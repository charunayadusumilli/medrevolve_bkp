/**
 * Long-form service detail used on /services and the media kits.
 * Keyed by the service slug in the catalog.
 */
export const SERVICE_DETAILS = {
  'readiness-audit': {
    audience: 'Operators about to apply for card processing who want the site reviewed first.',
    timeline: 'Written report delivered within 5 business days of purchase.',
  },
  'custom-development': {
    audience: 'Operators with one specific build task and no in-house developer.',
    timeline: 'First 4-hour block scheduled within 3 business days, invoiced monthly.',
  },
  'development-retainer': {
    audience: 'Operators shipping continuously who need a standing development team.',
    timeline: 'Starts the Monday after signup, with a monthly work report.',
  },
  'marketing-engine': {
    audience: 'Operators with a live storefront who need demand, not more build.',
    timeline: 'Setup in week one; first campaigns live inside 14 days.',
  },
  'legitscript-buildout': {
    audience: 'Operators in regulated categories who need a separate compliant merchant account.',
    timeline: 'Scoped within 3 days; application support runs 2 to 6 weeks.',
  },
  'llc-formation': {
    audience: 'Founders who have not formed the entity yet and need the platform stood up.',
    timeline: 'Entity filed within 5 business days; platform setup the same week.',
  },
  'payment-integration': {
    audience: 'Operators with a formed entity and a site that needs live card processing.',
    timeline: 'Configured, tested and live within 7 business days.',
  },
  'pharmacy-integration': {
    audience: 'Operators with a product line that has to route to pharmacy fulfilment.',
    timeline: 'Connected within 10 business days of pharmacy approval.',
  },
  'product-integration': {
    audience: 'Operators holding a catalog spreadsheet and no structured product data.',
    timeline: 'Catalog live within 5 business days.',
  },
  'marketing-integration': {
    audience: 'Operators who already market and need the channels wired into the platform.',
    timeline: 'Channels and tracking wired within 5 business days.',
  },
  'full-platform-bundle': {
    audience: 'Operators launching from zero who want one vendor and one monthly fee.',
    timeline: 'Onboarding starts inside a week; first modules live in 14 days.',
  },
};

export function getServiceDetail(slug) {
  return SERVICE_DETAILS[slug] || { audience: '', timeline: '' };
}