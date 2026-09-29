/**
 * MedRevolve Domain Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTIVE DOMAINS:
 *   medrevolve.com      → DTC  — consumer telehealth platform (peptides, GLP-1, hormones)
 *   medrevolveb2b.com   → B2B  — B2B SaaS platform (white-label telehealth infrastructure)
 *
 * INACTIVE (DOWN):
 *   medrevolvewater.com → DOWN — blank page, no content
 *   medrevolveruo.com   → DOWN — blank page, no content
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function detectDomain() {
  const h = window.location.hostname.toLowerCase();
  // medrevolve.com → DTC consumer telehealth platform (peptides, GLP-1, hormones)
  if (h === 'medrevolve.com' || h === 'www.medrevolve.com') return 'DTC';
  // medrevolveb2b.com → B2B SaaS platform (white-label telehealth infrastructure)
  if (h === 'medrevolveb2b.com' || h === 'www.medrevolveb2b.com') return 'B2B';
  if (h === 'admin.medrevolve.com')                          return 'ADMIN';
  // Dev / preview environment — defaults to DTC so the consumer platform is visible in builder
  const isDevEnv = h === 'localhost' || h.includes('base44') || h.includes('127.0.0.1');
  if (isDevEnv) return 'DTC';
  return 'DOWN';
}

export const BRAND = {
  name: 'MedRevolve',
  logoText: 'MR',
};

// Kept for backward compatibility with admin components
export const PAGE_DOMAIN_MAP = {};
export const FUNCTION_DOMAIN_MAP = { DTC: [], B2B: [], ADMIN: [] };
export const NAV_CONFIG = { DTC: [], B2B: [], DEV: [] };

export default { detectDomain, BRAND, PAGE_DOMAIN_MAP, FUNCTION_DOMAIN_MAP, NAV_CONFIG };