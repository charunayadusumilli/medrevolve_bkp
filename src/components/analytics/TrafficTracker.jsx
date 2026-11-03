import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureAttribution, trackEvent, isConversionLink, serviceFromHref, getAttribution } from '@/lib/tracking';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'];

/** Keeps the stored attribution on the address bar and records page_view / cta_click events. */
export default function TrafficTracker() {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    trackEvent('page_view', { page_path: `${location.pathname}${location.search}` });

    const attribution = getAttribution();
    if (!Object.keys(attribution).length) return;

    const params = new URLSearchParams(window.location.search);
    if (UTM_KEYS.some((key) => params.get(key))) return;

    UTM_KEYS.forEach((key) => {
      if (attribution[key]) params.set(key, attribution[key]);
    });
    const query = params.toString();
    if (query) window.history.replaceState({}, '', `${window.location.pathname}?${query}`);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!isConversionLink(href)) return;

      const serviceInterest = anchor.dataset.service || serviceFromHref(href);
      trackEvent('cta_click', {
        page_path: `${window.location.pathname}${window.location.search}`,
        service_interest: serviceInterest,
      });
      if (href.includes('buy.stripe.com') || href.includes('checkout.stripe.com')) {
        trackEvent('checkout_start', { service_interest: serviceInterest });
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}