import { useEffect } from 'react';
import { detectSite } from '@/lib/siteContext';

// Google Tag Manager container for the B2B site (medrevolveb2b.com).
// Loads only on the PARTNER site, and reports the visitor's cookie choice through
// Google Consent Mode v2 (the app's Cookiebot banner is the single source of choice).
const GTM_ID = 'GTM-NGW8BWNC';
const COOKIEBOT_CBID = 'f872245e-106f-4258-bb1a-084567404e79';

const DENIED = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

function consentFromCookiebot() {
  const c = window.Cookiebot && window.Cookiebot.consent;
  if (!c || !c.method) return null;
  const ads = c.marketing ? 'granted' : 'denied';
  return {
    analytics_storage: c.statistics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

export default function GoogleTagB2B() {
  useEffect(() => {
    if (detectSite() !== 'PARTNER') return undefined;
    if (window.__mrB2BGtmLoaded) return undefined;
    window.__mrB2BGtmLoaded = true;

    window.dataLayer = window.dataLayer || [];
    const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', DENIED);

    // Same consent banner + same stored choice as the rest of the app.
    if (!document.getElementById('Cookiebot')) {
      const cb = document.createElement('script');
      cb.id = 'Cookiebot';
      cb.src = 'https://consent.cookiebot.com/uc.js';
      cb.async = true;
      cb.setAttribute('data-cbid', COOKIEBOT_CBID);
      cb.type = 'text/javascript';
      document.head.insertBefore(cb, document.head.firstChild);
    }

    const syncConsent = () => {
      const choice = consentFromCookiebot();
      if (choice) gtag('consent', 'update', choice);
    };
    window.addEventListener('CookiebotOnLoad', syncConsent);
    window.addEventListener('CookiebotOnAccept', syncConsent);
    window.addEventListener('CookiebotOnDecline', syncConsent);
    syncConsent();

    if (!document.getElementById('gtm-ngw8bwnc')) {
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const s = document.createElement('script');
      s.id = 'gtm-ngw8bwnc';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(s);
    }

    return () => {
      window.removeEventListener('CookiebotOnLoad', syncConsent);
      window.removeEventListener('CookiebotOnAccept', syncConsent);
      window.removeEventListener('CookiebotOnDecline', syncConsent);
    };
  }, []);

  return null;
}