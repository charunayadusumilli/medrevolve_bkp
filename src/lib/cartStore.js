// Tiny localStorage-backed cart for the MedRevolve service catalog.
const KEY = 'medrevolve_cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function persist(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  persist(cart);
}

export function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.quantity = Math.max(1, qty);
  persist(cart);
}

export function removeFromCart(id) {
  persist(getCart().filter(i => i.id !== id));
}

export function clearCart() {
  persist([]);
}

export function cartCount() {
  return getCart().reduce((n, i) => n + i.quantity, 0);
}