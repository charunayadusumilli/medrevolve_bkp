import { PARTNER_SERVICES, PLATFORM_SERVICES } from './offerings';

const ALL = [...PARTNER_SERVICES, ...PLATFORM_SERVICES];

function pick(slugs) {
  return slugs.map((slug) => ALL.find((service) => service.slug === slug)).filter(Boolean);
}

/** /services renders these two tables, partner-referred services first. */
export const SERVICES_PAGE_GROUPS = [
  {
    label: 'Partner-referred services',
    services: pick([
      'readiness-audit',
      'custom-development',
      'development-retainer',
      'marketing-engine',
      'legitscript-buildout',
      'pharmacy-integration',
    ]),
  },
  {
    label: 'Platform services',
    services: pick([
      'llc-formation',
      'payment-integration',
      'product-integration',
      'marketing-integration',
      'full-platform-bundle',
    ]),
  },
];

/** The same services, flattened, used by the detail blocks and the media kits. */
export const SERVICES_PAGE_CATALOG = SERVICES_PAGE_GROUPS.flatMap((group) =>
  group.services.map((service) => ({ ...service, group: group.label }))
);

/** Short slugs used by /media-kit/<slug>. */
export const MEDIA_KIT_SLUGS = {
  'readiness-audit': 'audit',
  'custom-development': 'development',
  'development-retainer': 'retainer',
  'marketing-engine': 'marketing',
  'legitscript-buildout': 'legitscript',
  'pharmacy-integration': 'pharmacy-integration',
  'llc-formation': 'llc',
  'payment-integration': 'payment-integration',
  'product-integration': 'product-integration',
  'marketing-integration': 'marketing-integration',
  'full-platform-bundle': 'full-bundle',
};

export function getServiceByMediaSlug(mediaSlug) {
  const entry = Object.entries(MEDIA_KIT_SLUGS).find(([, short]) => short === mediaSlug);
  if (!entry) return null;
  return SERVICES_PAGE_CATALOG.find((service) => service.slug === entry[0]) || null;
}

export function mediaKitSlug(serviceSlug) {
  return MEDIA_KIT_SLUGS[serviceSlug] || serviceSlug;
}