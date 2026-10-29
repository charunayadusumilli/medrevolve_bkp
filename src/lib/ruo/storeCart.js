const KEY = 'mr_ruo_case_cart_v2';
const EVENT = 'mr-ruo-case-cart';

function blank() {
  return { lines: [] };
}

export function readCaseCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw || !Array.isArray(raw.lines)) return blank();
    return { lines: raw.lines.filter((l) => l && l.sku) };
  } catch {
    return blank();
  }
}

function write(cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable — the page still holds its own state
  }
  window.dispatchEvent(new CustomEvent(EVENT));
  return cart;
}

export function subscribeToCaseCart(handler) {
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function addUnits(sku, quantity = 1) {
  const cart = readCaseCart();
  const qty = Math.max(1, Math.round(Number(quantity) || 1));
  const line = cart.lines.find((l) => l.sku === sku);
  if (line) line.quantity += qty;
  else cart.lines.push({ sku, quantity: qty });
  return write(cart);
}

export function setUnits(sku, quantity) {
  const cart = readCaseCart();
  const line = cart.lines.find((l) => l.sku === sku);
  if (!line) return cart;
  const parsed = Math.round(Number(quantity) || 0);
  if (parsed <= 0) {
    cart.lines = cart.lines.filter((l) => l.sku !== sku);
  } else {
    line.quantity = parsed;
  }
  return write(cart);
}

export function removeUnits(sku) {
  const cart = readCaseCart();
  cart.lines = cart.lines.filter((l) => l.sku !== sku);
  return write(cart);
}

export function clearCaseCart() {
  return write(blank());
}

export function totalUnits(cart) {
  return (cart?.lines || []).reduce((n, line) => n + (Number(line.quantity) || 0), 0);
}