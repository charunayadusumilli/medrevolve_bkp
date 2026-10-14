/**
 * MedRevolve Domain Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTIVE DOMAINS:
 *   medrevolve.com      → B2B  — public white-label telehealth infrastructure site
 *   medrevolveb2b.com   → B2B  — white-label telehealth infrastructure
 *   app.medrevolve.com  → APP  — patient app (intake, shop, cart, portal)
 *   admin.medrevolve.com→ ADMIN
 *
 * INACTIVE (DOWN):
 *   medrevolvewater.com → DOWN — blank page, no content
 *   medrevolveruo.com   → DOWN — blank page, no content
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function detectDomain() {
  const h = window.location.hostname.toLowerCase();
  // app.medrevolve.com → patient app (intake, shop, cart, patient portal)
  if (h === 'app.medrevolve.com') return 'APP';
  if (h === 'admin.medrevolve.com') return 'ADMIN';
  // Public sites — white-label telehealth infrastructure (B2B)
  if (h === 'medrevolve.com' || h === 'www.medrevolve.com') return 'B2B';
  if (h === 'medrevolveb2b.com' || h === 'www.medrevolveb2b.com') return 'B2B';
  // Dev / preview environment — the B2B platform site is the primary public site
  const isDevEnv = h === 'localhost' || h.includes('base44') || h.includes('127.0.0.1');
  if (isDevEnv) return 'B2B';
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