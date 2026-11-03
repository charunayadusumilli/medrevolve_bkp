// Single source of truth for the medrevolveb2b.com offer.
// Prices are rendered as text on purpose so they stay searchable and readable.

export const RUO_CATALOG_URL = 'https://medrevolveruo.com/catalog';

export const RUO_DISCLAIMER =
  'All products are sold for research and laboratory use only. Not for human consumption. Not for diagnostic or therapeutic use. Not FDA-approved.';

export const RUO_CATEGORIES = [
  {
    name: 'GLP-1 compounds',
    blurb: 'Reference-standard GLP-1 materials supplied as lyophilized powder in sealed vials, per lot.',
  },
  {
    name: 'Peptide compounds',
    blurb: 'Research peptides with identity and purity documentation issued against each batch.',
  },
  {
    name: 'Longevity compounds',
    blurb: 'Materials used in cellular, metabolic and aging research models. Laboratory supply only.',
  },
  {
    name: 'Lab supplies',
    blurb: 'Bacteriostatic water, vials and preparation consumables for laboratory handling.',
  },
];

/** Volume ladder shown on the B2B site. The RUO storefront prices per SKU tier. */
export const VOLUME_TIERS = [
  { qty: '1-4 vials', discount: 'List price', note: 'Standard catalog price' },
  { qty: '5-9 vials', discount: '10% off', note: 'Applies per order, per compound' },
  { qty: '10-24 vials', discount: '15% off', note: 'Applies per order, per compound' },
  { qty: '25+ vials', discount: '20% off', note: 'Applies per order, per compound' },
];

export const COA_CONTENTS = [
  'Lot number',
  'Purity percentage',
  'Test method',
  'Testing lab',
  'Date of analysis',
];

export const PARTNER_SERVICES = [
  {
    name: 'Website and Processing Readiness Audit',
    price: '$500 flat',
    detail:
      'PCI configuration review, required policy and disclosure pages, checkout and cart review, and a written remediation report.',
    caveat:
      'This is a readiness audit. It does not guarantee approval by any processor or acquirer.',
  },
  {
    name: 'Custom Development',
    price: '$95 / hour',
    detail:
      '4-hour minimum, invoiced monthly. Examples: integrations, landing pages, automation, API work.',
  },
  {
    name: 'Development Retainer',
    price: '$3,420 / month',
    detail:
      '40 hours per month, 10% off hourly. Priority queue and a monthly work report.',
  },
  {
    name: 'Marketing Engine',
    price: '$2,500 / month',
    detail:
      'Plus $1,500 setup. Channel build, lifecycle email flows, weekly market scan and monthly reporting.',
  },
  {
    name: 'LegitScript Buildout',
    price: 'From $2,500',
    detail:
      'Quoted per client. Separate merchant account, pharmacy tie-ins, compliance registration.',
  },
  {
    name: 'Pharmacy Integration',
    price: '$1,000 setup + $100 / month',
    detail: 'Pharmacy connectivity, catalog sync and order routing.',
  },
];

export const PLATFORM_SERVICES = [
  { name: 'LLC Formation and Setup', price: '$1,500 one-time', detail: 'Entity formation and platform setup.' },
  { name: 'Payment Integration', price: '$1,000 setup + $100 / month', detail: 'Merchant configuration and payment rails.' },
  { name: 'Product Integration', price: '$750 one-time', detail: 'Catalog build and product data import.' },
  { name: 'Marketing Integration', price: '$750 setup + $150 / month', detail: 'Channels, tracking and lifecycle flows.' },
  { name: 'Full Platform Bundle', price: '$4,000 setup + $250 / month', detail: 'Every module above, one engagement.' },
];

export const PRICE_NOTE =
  'All prices in USD, cash-pay, excluding applicable taxes. Development and retainer work is billed against a card on file or invoiced per job.';

export const SERVICE_OPTIONS = [
  'Processing readiness audit',
  'Custom development',
  'Marketing engine',
  'LegitScript buildout',
  'Full platform',
  'RUO bulk supply',
];

export const PROOF_POINTS = [
  {
    title: 'Independent licensed providers',
    detail: 'Every encounter is delivered by a provider licensed in the patient state of record.',
  },
  {
    title: 'State-licensed 503A compounding pharmacies',
    detail: 'Compounding is fulfilled by licensed 503A pharmacies, never by an unlicensed reseller.',
  },
  {
    title: 'Cash-pay, no insurance claims',
    detail: 'Patients pay directly. No claim submission and no payer dependency in the revenue cycle.',
  },
  {
    title: 'Written agreements, documented audit trail',
    detail: 'Service agreements, BAAs and compliance records are signed and retained per engagement.',
  },
];

export const B2B_CONTACT = {
  phoneDisplay: '530-200-6352',
  phoneTel: '+15302006352',
  email: 'rned@medrevolve.com',
};