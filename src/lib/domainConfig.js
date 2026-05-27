/**
 * MedRevolve Domain Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTIVE DOMAINS:
 *   medrevolve.com      → B2C  — unified telehealth platform
 *   medrevolveb2b.com   → B2C  — same site, same content
 *
 * INACTIVE (DOWN):
 *   medrevolvewater.com → DOWN — blank page, no content
 *   medrevolveruo.com   → DOWN — blank page, no content
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function detectDomain() {
  const h = window.location.hostname.toLowerCase();
  if (h === 'medrevolvewater.com' || h === 'www.medrevolvewater.com') return 'DOWN';
  if (h === 'medrevolveruo.com'   || h === 'www.medrevolveruo.com')   return 'DOWN';
  if (h === 'admin.medrevolve.com')                                    return 'ADMIN';
  // Both primary domains → same B2C experience
  return 'B2C';
}

export const BRAND = {
  name: 'MedRevolve',
  logoText: 'MR',
};

// Kept for backward compatibility with admin components
export const PAGE_DOMAIN_MAP = {};
export const FUNCTION_DOMAIN_MAP = { B2C: [], ADMIN: [] };
export const NAV_CONFIG = { B2C: [], DEV: [] };

export default { detectDomain, BRAND, PAGE_DOMAIN_MAP, FUNCTION_DOMAIN_MAP, NAV_CONFIG };