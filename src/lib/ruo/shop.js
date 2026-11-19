import { base44 } from '@/api/base44Client';

export const RESEARCH_AREAS = [
  'Metabolic',
  'Tissue & Recovery',
  'Growth Hormone',
  'Cognitive & Sleep',
  'Longevity & Cellular',
  'Skin & Cosmetic',
  'Hormone & Signaling',
  'Supplies',
];

export const FLAT_SHIPPING = 18;
export const FREE_SHIPPING_UNITS = 4;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Research area' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
];

const round = (value) => Math.round((Number(value) || 0) * 100) / 100;

export function money(value) {
  return `$${(Number(value) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Cart, checkout and order records key every line by the product slug. */
export function cartKey(product) {
  return product?.slug || '';
}

/** Public catalog: active records only, grouped by research area then editorial order. */
export async function loadProducts() {
  const page = await base44.entities.RuoProduct.filter(
    { active: true },
    { sort: 'research_area', limit: 500 },
  );
  return [...(page?.items ?? [])].sort((a, b) => {
    const area = String(a.research_area || '').localeCompare(String(b.research_area || ''));
    if (area !== 0) return area;
    return (Number(a.display_order) || 0) - (Number(b.display_order) || 0);
  });
}

/** Same compound at other strengths — drives the strength pill row. */
export function strengthSiblings(product, all) {
  if (!product?.name) return [];
  const base = String(product.name).trim().toLowerCase();
  return (all || [])
    .filter((item) => String(item.name || '').trim().toLowerCase() === base)
    .sort((a, b) => (Number(a.mg) || 0) - (Number(b.mg) || 0));
}

export async function loadProductBySlug(slug) {
  if (!slug) return null;
  const { items } = await base44.entities.RuoProduct.filter({ slug, active: true }, { limit: 1 });
  return items?.[0] ?? null;
}

export async function loadProductsByKeys(keys) {
  const list = [...new Set((keys || []).filter(Boolean))];
  if (list.length === 0) return new Map();
  const { items } = await base44.entities.RuoProduct.filter({ slug: { $in: list } }, { limit: 200 });
  return new Map((items || []).map((product) => [product.slug, product]));
}

/**
 * Volume pricing is per line, applied automatically — never a coupon.
 * When a tier price is not set on the record, the published tier badges hold:
 * 3+ saves 5% and 6+ saves 10% off the unit price.
 */
export function unitPrice(product, quantity) {
  const qty = Math.max(1, Number(quantity) || 1);
  const retail = Number(product?.retail_price) || 0;
  const explicit = qty >= 6
    ? Number(product?.tier_6_price)
    : qty >= 3
      ? Number(product?.tier_3_price)
      : retail;

  if (Number.isFinite(explicit) && explicit > 0) return round(explicit);
  if (qty >= 6) return round(retail * 0.9);
  if (qty >= 3) return round(retail * 0.95);
  return round(retail);
}

export function lineTotal(product, quantity) {
  return round(unitPrice(product, quantity) * Math.max(1, Number(quantity) || 1));
}

export function lineSavings(product, quantity) {
  const retail = Number(product?.retail_price) || 0;
  const qty = Math.max(1, Number(quantity) || 1);
  return round((retail - unitPrice(product, qty)) * qty);
}

/** "Add N more to reach the next tier" nudge, or null at the top tier. */
export function nextTierNudge(product, quantity) {
  const qty = Math.max(1, Number(quantity) || 1);
  if (qty < 3) return { add: 3 - qty, label: '3+ units', price: unitPrice(product, 3) };
  if (qty < 6) return { add: 6 - qty, label: '6+ units', price: unitPrice(product, 6) };
  return null;
}

export function tierRows(product) {
  const retail = Number(product?.retail_price) || 0;
  return [1, 3, 6].map((qty) => {
    const price = unitPrice(product, qty);
    return {
      qty,
      label: qty === 1 ? '1–2 units' : qty === 3 ? '3–5 units' : '6+ units',
      price,
      savePct: retail > 0 ? Math.round(((retail - price) / retail) * 100) : 0,
    };
  });
}