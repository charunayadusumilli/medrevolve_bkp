const KEY = 'mr_storefront_cart_v1';
const EVENT = 'mr-storefront-cart';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING = 5.95;
export const TAX_RATE = 0.0825;

const round = (n) => Math.round((Number(n) || 0) * 100) / 100;

function blank() {
  return { savedAt: Date.now(), shipState: '', lines: [] };
}

export function readCart() {
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
    // storage unavailable — the in-memory cart still drives this page
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVENT));
  return next;
}

export function subscribeToCart(handler) {
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function resolveUnitPrice(product, purchaseType = 'one_time', doseLabel) {
  const subscription =
    purchaseType === 'subscription' && product.subscription_price != null
      ? product.subscription_price
      : product.price;
  const dose = (product.dose_options || []).find((d) => d.label === doseLabel);
  return round(subscription + (dose?.price_delta || 0));
}

function lineId(sku, purchaseType, cadenceDays, doseLabel) {
  return [sku, purchaseType, purchaseType === 'subscription' ? cadenceDays : 0, doseLabel || 'std'].join('__');
}

export function addLine(product, options = {}) {
  const { quantity = 1, purchaseType = 'one_time', cadenceDays = 30, doseLabel } = options;

  // Rail guard: prescription products can never enter the basket.
  if (product.rail === 'prescription') return { blocked: true, category: product.category };

  const cart = readCart();
  const limit = product.quantity_limit || 6;
  const dose = (product.dose_options || []).find((d) => d.label === doseLabel);
  const doseDelta = dose?.price_delta || 0;
  const id = lineId(product.sku, purchaseType, cadenceDays, doseLabel);
  const existing = cart.lines.find((l) => l.id === id);

  if (existing) {
    existing.quantity = Math.min(limit, existing.quantity + quantity);
    existing.unit_price = resolveUnitPrice(product, existing.purchase_type, existing.dose_label);
  } else {
    cart.lines.push({
      id,
      sku: product.sku,
      slug: product.slug,
      name: product.display_name,
      generic_name: product.generic_name || '',
      image_url: product.image_url || '',
      category: product.category,
      purchase_type: purchaseType,
      cadence_days: purchaseType === 'subscription' ? cadenceDays : null,
      dose_label: doseLabel || '',
      dose_delta: doseDelta,
      list_price: product.price,
      subscription_price: product.subscription_price ?? null,
      unit_price: resolveUnitPrice(product, purchaseType, doseLabel),
      quantity: Math.min(limit, Math.max(1, quantity)),
      quantity_limit: limit,
      in_stock: product.in_stock !== false,
      state_restrictions: product.state_restrictions || [],
    });
  }

  write(cart);
  return { ok: true, id, limit };
}

export function setQuantity(id, quantity) {
  const cart = readCart();
  const line = cart.lines.find((l) => l.id === id);
  if (!line) return cart;
  const parsed = Number(quantity);
  const next = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : line.quantity;
  line.quantity = Math.max(1, Math.min(line.quantity_limit || 6, next));
  return write(cart);
}

export function setLinePurchaseType(id, purchaseType, cadenceDays) {
  const cart = readCart();
  const line = cart.lines.find((l) => l.id === id);
  if (!line) return cart;
  line.purchase_type = purchaseType;
  line.cadence_days = purchaseType === 'subscription' ? cadenceDays || 30 : null;
  const base =
    purchaseType === 'subscription' && line.subscription_price != null
      ? line.subscription_price
      : line.list_price;
  line.unit_price = round(base + (line.dose_delta || 0));
  return write(cart);
}

export function removeLine(id) {
  const cart = readCart();
  cart.lines = cart.lines.filter((l) => l.id !== id);
  return write(cart);
}

export function setShipState(code) {
  const cart = readCart();
  cart.shipState = code || '';
  return write(cart);
}

export function clearCart() {
  return write(blank());
}

export function cartCount(cart) {
  return (cart?.lines || []).reduce((n, line) => n + line.quantity, 0);
}

export function restrictedLines(cart, shipState) {
  if (!shipState) return [];
  return (cart?.lines || []).filter((l) => (l.state_restrictions || []).includes(shipState));
}

export function cartTotals(cart) {
  const lines = cart?.lines || [];
  const grossSubtotal = round(lines.reduce((sum, l) => sum + (l.list_price + (l.dose_delta || 0)) * l.quantity, 0));
  const savings = round(
    lines.reduce((sum, l) => {
      if (l.purchase_type !== 'subscription' || l.subscription_price == null) return sum;
      return sum + (l.list_price - l.subscription_price) * l.quantity;
    }, 0)
  );
  const netSubtotal = round(grossSubtotal - savings);
  const shipping = lines.length === 0 || netSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = round(netSubtotal * TAX_RATE);
  return {
    grossSubtotal,
    savings,
    netSubtotal,
    shipping,
    tax,
    total: round(netSubtotal + shipping + tax),
  };
}