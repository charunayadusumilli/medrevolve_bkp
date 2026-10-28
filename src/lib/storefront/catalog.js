export const STOREFRONT_CATEGORIES = [
  {
    slug: 'weight-loss',
    label: 'Weight loss',
    tagline: 'GLP-1 care, provider-led',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/4a7bccbac_generated_image.png',
  },
  {
    slug: 'sexual-health',
    label: 'Sexual health',
    tagline: 'Discreet, clinician-approved',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/38ea061d3_generated_image.png',
  },
  {
    slug: 'hair',
    label: 'Hair',
    tagline: 'Thinning and regrowth',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/df57552c6_generated_image.png',
  },
  {
    slug: 'skin',
    label: 'Skin',
    tagline: 'Prescription-grade topicals',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/df5c945ad_generated_image.png',
  },
  {
    slug: 'mental-health',
    label: 'Mental health',
    tagline: 'Everyday mood support',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/fa3944486_generated_image.png',
  },
  {
    slug: 'testosterone',
    label: 'Testosterone',
    tagline: 'Hormone optimization',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/be4677c2f_generated_image.png',
  },
  {
    slug: 'labs',
    label: 'Labs',
    tagline: 'At-home panels from $79',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/76e07df9e_generated_image.png',
  },
  {
    slug: 'daily-wellness',
    label: 'Daily wellness',
    tagline: 'Foundations, third-party tested',
    image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/435b6e2b5_generated_image.png',
  },
];

export const HERO_IMAGE =
  'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/de750191a_generated_image.png';

export function categoryLabel(slug) {
  return STOREFRONT_CATEGORIES.find((c) => c.slug === slug)?.label || 'Treatments';
}

export function categoryImage(slug) {
  return STOREFRONT_CATEGORIES.find((c) => c.slug === slug)?.image || HERO_IMAGE;
}

export function money(value) {
  const amount = Number(value) || 0;
  const decimals = Number.isInteger(amount) ? 0 : 2;
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  })}`;
}

const FDA_CHIPS = {
  fda_approved: { label: 'FDA-approved', className: 'bg-sf-accent-soft text-sf-accent' },
  compounded_503a: { label: 'Compounded · not FDA-approved', className: 'bg-sf-sun/15 text-[#8a5a12]' },
  supplement: { label: 'Supplement', className: 'bg-sf-line/60 text-sf-muted' },
};

export function fdaChip(status) {
  return FDA_CHIPS[status] || FDA_CHIPS.supplement;
}

/** Chip shown next to price — labs describe the service, not a drug status. */
export function statusChip(product) {
  if (product?.category === 'labs') {
    return { label: 'At-home lab panel', className: 'bg-sf-line/60 text-sf-muted' };
  }
  return fdaChip(product?.fda_status);
}

export function isCompounded(product) {
  return product?.fda_status === 'compounded_503a';
}

export function isPrescription(product) {
  return product?.rail === 'prescription';
}

/** Price shown as the headline number — subscriptions lead for retail SKUs. */
export function headlinePrice(product) {
  if (isPrescription(product)) return product.subscription_price ?? product.price;
  return product.subscription_price ?? product.price;
}

const STATE_PAIRS =
  'AL:Alabama,AK:Alaska,AZ:Arizona,AR:Arkansas,CA:California,CO:Colorado,CT:Connecticut,DE:Delaware,DC:District of Columbia,FL:Florida,GA:Georgia,HI:Hawaii,ID:Idaho,IL:Illinois,IN:Indiana,IA:Iowa,KS:Kansas,KY:Kentucky,LA:Louisiana,ME:Maine,MD:Maryland,MA:Massachusetts,MI:Michigan,MN:Minnesota,MS:Mississippi,MO:Missouri,MT:Montana,NE:Nebraska,NV:Nevada,NH:New Hampshire,NJ:New Jersey,NM:New Mexico,NY:New York,NC:North Carolina,ND:North Dakota,OH:Ohio,OK:Oklahoma,OR:Oregon,PA:Pennsylvania,RI:Rhode Island,SC:South Carolina,SD:South Dakota,TN:Tennessee,TX:Texas,UT:Utah,VT:Vermont,VA:Virginia,WA:Washington,WV:West Virginia,WI:Wisconsin,WY:Wyoming';

export const US_STATES = STATE_PAIRS.split(',').map((pair) => {
  const [code, name] = pair.split(':');
  return { code, name };
});

export function stateName(code) {
  return US_STATES.find((s) => s.code === code)?.name || code;
}