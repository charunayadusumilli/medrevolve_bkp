/**
 * DomainRouter — reads the hostname and redirects/renders the correct
 * landing page for each published domain.
 *
 * Active domains:
 *   medrevolve.com      → B2C → homepage: '/'
 *   medrevolveb2b.com   → B2C → homepage: '/' (same unified site)
 *   [DEV / preview]     → DEV → all pages visible
 *
 * Disabled domains (WATER, RUO) are not routed here.
 */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectDomain, NAV_CONFIG } from '@/lib/domainConfig';

// Both active domains land on the same homepage
const DOMAIN_HOME = {
  B2C:   '/',
  ADMIN: '/AdminDashboard',
  DEV:   '/',
};

// No domain-exclusive page restrictions — all pages accessible on both domains
const DOMAIN_EXCLUSIVE = {};

export function useDomainRouter() {
  const domain = detectDomain();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if on a live domain and the page is restricted
    if (domain === 'DEV') return;
    const exclusiveDomain = DOMAIN_EXCLUSIVE[location.pathname];
    if (exclusiveDomain && domain !== exclusiveDomain) {
      navigate(DOMAIN_HOME[domain] || '/', { replace: true });
    }
  }, [domain, location.pathname]);

  return { domain, nav: NAV_CONFIG[domain] || NAV_CONFIG.B2C, homeUrl: DOMAIN_HOME[domain] || '/' };
}

export default { useDomainRouter, DOMAIN_HOME };