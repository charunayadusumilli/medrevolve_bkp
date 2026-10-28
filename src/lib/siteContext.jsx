import React, { createContext, useContext, useMemo } from 'react';
import { WHATSAPP_URL } from '@/lib/contactConfig';

// WhatsApp runs through the patient_support agent channel — the same connect link on all
// three sites, so no per-site number is published here.
const WHATSAPP_NUMBER = '';

function waLink() {
  return WHATSAPP_URL;
}

export const SITES = {
  CONSUMER: {
    key: 'CONSUMER',
    brand: 'MedRevolve',
    domain: 'medrevolve.com',
    whatsapp: waLink('I need help with my order'),
    whatsappMessage: 'I need help with my order',
    cartNamespace: 'consumer',
  },
  PARTNER: {
    key: 'PARTNER',
    brand: 'MedRevolve',
    domain: 'medrevolveb2b.com',
    whatsapp: waLink('I want a demo'),
    whatsappMessage: 'I want a demo',
    cartNamespace: 'partner',
  },
  RUO: {
    key: 'RUO',
    brand: 'MedRevolve Research',
    domain: 'medrevolveruo.com',
    whatsapp: waLink('I need a bulk quote'),
    whatsappMessage: 'I need a bulk quote',
    cartNamespace: 'ruo',
  },
};

/**
 * Hostname → site variant.
 * medrevolve.com / www / app.medrevolve.com → CONSUMER
 * medrevolveb2b.com / www → PARTNER HQ
 * medrevolveruo.com / www → RUO STORE
 * Anything else (preview, build URL, localhost) → CONSUMER
 * An explicit `?site=partner|ruo` query override lets the team preview the
 * other two sites from a preview URL.
 */
export function detectSite(hostname = window.location.hostname, search = window.location.search) {
  const override = new URLSearchParams(search || '').get('site');
  if (override && SITES[override.toUpperCase()]) return override.toUpperCase();

  const h = String(hostname || '').toLowerCase();
  if (h === 'medrevolveruo.com' || h === 'www.medrevolveruo.com' || h.startsWith('ruo.')) return 'RUO';
  if (h === 'medrevolveb2b.com' || h === 'www.medrevolveb2b.com' || h.startsWith('b2b.')) return 'PARTNER';
  return 'CONSUMER';
}

const SiteContext = createContext({ site: 'CONSUMER', ...SITES.CONSUMER });

export function SiteProvider({ children }) {
  const value = useMemo(() => {
    const site = detectSite();
    return { site, ...SITES[site] };
  }, []);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}

export { WHATSAPP_NUMBER, waLink };