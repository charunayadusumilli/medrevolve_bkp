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
  // Only medrevolve.com (and www.) is active — all other domains are DOWN
  if (h === 'medrevolve.com' || h === 'www.medrevolve.com') return 'B2C';
  if (h === 'admin.medrevolve.com')                          return 'ADMIN';
  // Everything else — medrevolveb2b.com, medrevolvewater.com, medrevolveruo.com,
  // any other hostname — shows nothing.
  // Exception: Base44 preview/dev environment (localhost / base44 domains) stays active.
  const isDevEnv = h === 'localhost' || h.includes('base44') || h.includes('127.0.0.1');
  if (isDevEnv) return 'B2C';
  return 'DOWN';
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