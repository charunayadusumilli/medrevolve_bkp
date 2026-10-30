import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStoreCart from '@/hooks/useStoreCart';
import { cartTotals } from '@/lib/storefront/cart';
import { money } from '@/lib/storefront/catalog';
import CheckoutForm from '@/components/checkout/CheckoutForm';

const EMPTY = { name: '', email: '', phone: '', address: '', city: '', state: '', zip: '' };

export default function ConsumerCheckout() {
  const cart = useStoreCart();
  const [value, setValue] = useState(EMPTY);

  const totals = cartTotals(cart);

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-[32px]">Nothing to check out</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-lg bg-site-rust px-5 py-3 text-[13px] font-semibold text-site-cream">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link to="/cart" className="text-[12px] font-semibold text-site-greige underline underline-offset-4">Back to basket</Link>
      <h1 className="mt-4 font-display text-[34px] tracking-tight sm:text-[40px]">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CheckoutForm
          value={value}
          onChange={setValue}
          submitLabel="Checkout coming soon"
          disabled
        />

        <aside className="h-fit rounded-xl border border-site-line bg-site-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Order summary</p>
          <ul className="mt-4 space-y-3">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-[13px]">
                <span>
                  {line.name}
                  <span className="block text-[11px] text-site-greige">
                    Qty {line.quantity} · {line.purchase_type === 'subscription' ? `refill every ${line.cadence_days} days` : 'One-time purchase'}
                  </span>
                </span>
                <span className="font-semibold">{money(line.unit_price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-site-line pt-4 text-[13px]">
            <div className="flex justify-between"><dt className="text-site-greige">Subtotal</dt><dd>{money(totals.netSubtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-site-greige">Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-site-greige">Estimated tax</dt><dd>{money(totals.tax)}</dd></div>
            <div className="flex justify-between border-t border-site-line pt-3 text-[15px] font-semibold"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}