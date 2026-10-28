const KEY = 'mr_ruo_cart_v1';
const EVENT = 'mr-ruo-cart';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const RUO_SHIPPING = 18;
export const RUO_FREE_SHIPPING_CASES = 4;

/** Bulk ladder applied to the case count of the whole order. */
export const BULK_LADDER = [
  { cases: 4, discount: 0.15, label: '4+ cases −15%' },
  { cases: 3, discount: 0.1, label: '3 cases −10%' },
  { cases: 2, discount: 0.05, label: '2 cases −5%' },
];

const round = (n) => Math.round((Number(n) || 0) * 100) / 100;

function blank() {
  return { savedAt: Date.now(), shipState: '', lines: [] };
}

export function readRuoCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw || !Array.isArray(raw.lines)) return blank();
    if (!raw.savedAt || Date.now() - raw.savedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return blank();
    }
    return { ...blank(), ...raw };
  } catch {
    return blank();
  }
}

function write(cart) {
  const next = { ...cart, savedAt: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — in-memory state still renders this page
  }
  window.dispatchEvent(new CustomEvent(EVENT));
  return next;
}

export function subscribeToRuoCart(handler) {
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function addCase(product, quantity = 1) {
  const cart = readRuoCart();
  const limit = product.quantity_limit || 12;
  const existing = cart.lines.find((l) => l.sku === product.sku);

  if (existing) {
    existing.quantity = Math.min(limit, existing.quantity + quantity);
  } else {
    cart.lines.push({
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      image_url: product.image_url || '',
      category: product.category,
      case_size: product.case_size || 10,
      batch_code: product.batch_code || '',
      unit_price: product.price,
      quantity: Math.min(limit, Math.max(1, quantity)),
      quantity_limit: limit,
      in_stock: product.in_stock !== false,
    });
  }
  return write(cart);
}

export function setCaseQuantity(sku, quantity) {
  const cart = readRuoCart();
  const line = cart.lines.find((l) => l.sku === sku);
  if (!line) return cart;
  const parsed = Number(quantity);
  const next = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : line.quantity;
  line.quantity = Math.max(1, Math.min(line.quantity_limit || 12, next));
  return write(cart);
}

export function removeCase(sku) {
  const cart = readRuoCart();
  cart.lines = cart.lines.filter((l) => l.sku !== sku);
  return write(cart);
}

export function setRuoShipState(code) {
  const cart = readRuoCart();
  cart.shipState = code || '';
  return write(cart);
}

export function clearRuoCart() {
  return write(blank());
}

export function ruoCaseCount(cart) {
  return (cart?.lines || []).reduce((n, line) => n + line.quantity, 0);
}

export function bulkDiscountFor(cases) {
  return BULK_LADDER.find((tier) => cases >= tier.cases)?.discount || 0;
}

export function ruoTotals(cart) {
  const lines = cart?.lines || [];
  const cases = ruoCaseCount(cart);
  const gross = round(lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0));
  const discountRate = bulkDiscountFor(cases);
  const discount = round(gross * discountRate);
  const subtotal = round(gross - discount);
  const shipping = lines.length === 0 || cases >= RUO_FREE_SHIPPING_CASES ? 0 : RUO_SHIPPING;
  return {
    gross,
    cases,
    discountRate,
    discount,
    subtotal,
    shipping,
    total: round(subtotal + shipping),
  };
}