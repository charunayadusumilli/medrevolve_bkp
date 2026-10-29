const round = (n) => Math.round((Number(n) || 0) * 100) / 100;

export const TIERS = [
  { key: 'tier_6_plus', min: 6, field: 'tier_6_plus_price', label: '6+ units' },
  { key: 'tier_3_5', min: 3, field: 'tier_3_5_price', label: '3-5 units' },
  { key: 'retail', min: 1, field: 'retail_price', label: '1-2 units' },
];

export function tierFor(quantity) {
  const qty = Math.max(1, Number(quantity) || 1);
  return TIERS.find((tier) => qty >= tier.min) || TIERS[2];
}

export function unitPrice(product, quantity) {
  const tier = tierFor(quantity);
  const price = Number(product?.[tier.field]);
  if (Number.isFinite(price) && price > 0) return round(price);
  return round(product?.retail_price);
}

export function lineTotal(product, quantity) {
  return round(unitPrice(product, quantity) * Math.max(1, Number(quantity) || 1));
}

/** Savings against the 1-2 unit price for the same quantity. */
export function lineSavings(product, quantity) {
  const retail = Number(product?.retail_price) || 0;
  const qty = Math.max(1, Number(quantity) || 1);
  return round((retail - unitPrice(product, qty)) * qty);
}

/** "Add N more to reach the next tier" nudge, or null at the top tier. */
export function nextTierNudge(product, quantity) {
  const qty = Math.max(1, Number(quantity) || 1);
  if (qty < 3) return { add: 3 - qty, label: '3-5 units', field: 'tier_3_5_price' };
  if (qty < 6) return { add: 6 - qty, label: '6+ units', field: 'tier_6_plus_price' };
  return null;
}

export function money(value) {
  return `$${(Number(value) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}