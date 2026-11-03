// Single source of truth for the medrevolveb2b.com offer.
// Prices are rendered as text on purpose so they stay searchable and readable.
// Checkout is hosted on Stripe — no card data touches this site.

export const RUO_CATALOG_URL = 'https://medrevolveruo.com/catalog';

export const RUO_DISCLAIMER =
  'All products are sold for research and laboratory use only. Not for human consumption. Not for diagnostic or therapeutic use. Not FDA-approved.';

export const STRIPE_DISCLOSURE =
  'Secure checkout hosted by Stripe. Cash-pay, no insurance claims. Prices in USD, excluding taxes.';

const PAY = {
  audit: 'https://buy.stripe.com/5kQ28r4vk89X7P6dN22ZO00',
  devBlock: 'https://buy.stripe.com/6oU8wP0f4ai52uM9wM2ZO01',
  retainer: 'https://buy.stripe.com/3cI5kD3rg2PDfhy10g2ZO02',
  marketingSetup: 'https://buy.stripe.com/3cIaEX2nc61P6L26kA2ZO03',
  marketingMonthly: 'https://buy.stripe.com/6oUaEXd1Q1Lz8Ta5gw2ZO04',
  legitScript: 'https://buy.stripe.com/28EeVdf9YcqdeduaAQ2ZO05',
  llc: 'https://buy.stripe.com/eVq14n2ncgGt5GYeR62ZO0a',
  paymentSetup: 'https://buy.stripe.com/5kQ3cv8LA3TH6L2cIY2ZO08',
  paymentMonthly: 'https://buy.stripe.com/14AdR94vk61PedufVa2ZO09',
  pharmacySetup: 'https://buy.stripe.com/dRmcN55zo4XL0mE9wM2ZO06',
  pharmacyMonthly: 'https://buy.stripe.com/6oUfZhe5U9e14CUdN22ZO07',
  productIntegration: 'https://buy.stripe.com/cNi4gz7Hw0Hvb1i7oE2ZO0b',
  marketingIntegrationSetup: 'https://buy.stripe.com/cNi4gzge23TH2uMdN22ZO0c',
  marketingIntegrationMonthly: 'https://buy.stripe.com/cNidR96Ds1Lz3yQ10g2ZO0d',
  bundleSetup: 'https://buy.stripe.com/14AfZh0f4bm9edu8sI2ZO0e',
  bundleMonthly: 'https://buy.stripe.com/dRm4gz0f489X8TabEU2ZO0f',
};

export const AUDIT_URL = PAY.audit;

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
    price: '$500 one-time',
    detail:
      'PCI configuration review, required policy and disclosure pages, checkout and cart review, and a written remediation report.',
    caveat:
      'This is a readiness audit. It does not guarantee approval by any processor or acquirer.',
    payments: [{ label: 'Buy now - $500', url: PAY.audit, primary: true }],
  },
  {
    name: 'Custom Development',
    price: '$95 / hour',
    detail: '4-hour minimum. Sold as a 4-hour block at $380, invoiced monthly.',
    payments: [{ label: 'Buy now - $380', url: PAY.devBlock }],
  },
  {
    name: 'Development Retainer',
    price: '$3,420 / month',
    detail: '40 hours per month, 10% off hourly. Priority queue and a monthly work report.',
    payments: [{ label: 'Buy now - $3,420/month', url: PAY.retainer }],
  },
  {
    name: 'Marketing Engine',
    price: '$1,500 setup + $2,500 / month',
    detail:
      'Setup includes channel build and lifecycle email flows. Then weekly market scan and monthly reporting.',
    payments: [
      { label: 'Start marketing engine', url: PAY.marketingSetup },
      { label: 'Monthly marketing', url: PAY.marketingMonthly },
    ],
  },
  {
    name: 'LegitScript Buildout',
    price: 'From $2,500',
    detail:
      '$2,500 deposit, quoted per client. Separate merchant account, pharmacy tie-ins, compliance registration.',
    payments: [{ label: 'Start LegitScript buildout', url: PAY.legitScript }],
  },
];

export const PLATFORM_SERVICES = [
  {
    name: 'LLC Formation and Setup',
    price: '$1,500 one-time',
    detail: 'Entity formation and platform setup.',
    payments: [{ label: 'Buy now - $1,500', url: PAY.llc }],
  },
  {
    name: 'Payment Integration',
    price: '$1,000 setup + $100 / month',
    detail: 'Merchant configuration and payment rails.',
    payments: [
      { label: 'Setup - $1,000', url: PAY.paymentSetup },
      { label: 'Then $100/month', url: PAY.paymentMonthly },
    ],
  },
  {
    name: 'Pharmacy Integration',
    price: '$1,000 setup + $100 / month',
    detail: 'Pharmacy connectivity, catalog sync and order routing.',
    payments: [
      { label: 'Setup - $1,000', url: PAY.pharmacySetup },
      { label: 'Then $100/month', url: PAY.pharmacyMonthly },
    ],
  },
  {
    name: 'Product Integration',
    price: '$750 one-time',
    detail: 'Catalog build and product data import.',
    payments: [{ label: 'Buy now - $750', url: PAY.productIntegration }],
  },
  {
    name: 'Marketing Integration',
    price: '$750 setup + $150 / month',
    detail: 'Channels, tracking and lifecycle flows.',
    payments: [
      { label: 'Setup - $750', url: PAY.marketingIntegrationSetup },
      { label: 'Then $150/month', url: PAY.marketingIntegrationMonthly },
    ],
  },
  {
    name: 'Full Platform Bundle',
    price: '$4,000 setup + $250 / month',
    detail: 'Every module above, one engagement.',
    payments: [
      { label: 'Setup - $4,000', url: PAY.bundleSetup },
      { label: 'Then $250/month', url: PAY.bundleMonthly },
    ],
  },
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