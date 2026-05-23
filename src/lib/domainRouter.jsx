/**
 * DomainRouter — reads the hostname and redirects/renders the correct
 * landing page and nav for each published domain.
 * 
 * Works both in Base44 DEV preview (all pages visible) and on live domains
 * (only that domain's pages are served).
 */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectDomain, NAV_CONFIG } from '@/lib/domainConfig';

// Map each domain key to its canonical homepage path
const DOMAIN_HOME = {
  B2C:   '/',
  B2B:   '/ForBusiness',
  RUO:   '/ResearchProducts',
  WATER: '/WaterHome',
  ADMIN: '/AdminDashboard',
  DEV:   '/',
};

// Pages that are ONLY valid on a specific domain — redirect away if wrong domain
const DOMAIN_EXCLUSIVE = {
  '/WaterHome':        'WATER',
  '/ResearchProducts': 'RUO',
  '/ForBusiness':      'B2B',
  '/MerchantOnboarding': 'B2B',
  '/MerchantDashboard':  'B2B',
};

export function useDomainRouter() {
  const domain = detectDomain();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // On a specific live domain, enforce correct homepage
    if (domain !== 'DEV' && location.pathname === '/') {
      const home = DOMAIN_HOME[domain];
      if (home && home !== '/') {
        navigate(home, { replace: true });
      }
    }
  }, [domain, location.pathname]);

  return { domain, nav: NAV_CONFIG[domain] || NAV_CONFIG.B2C, homeUrl: DOMAIN_HOME[domain] || '/' };
}

export default { useDomainRouter, DOMAIN_HOME };