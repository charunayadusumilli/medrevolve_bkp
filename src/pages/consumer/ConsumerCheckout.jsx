import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStoreCart from '@/hooks/useStoreCart';
import { cartTotals, restrictedLines } from '@/lib/storefront/cart';
import { money } from '@/lib/storefront/catalog';
import { startCheckout } from '@/lib/checkout';
import CheckoutForm from '@/components/checkout/CheckoutForm';

const EMPTY = { name: '', email: '', phone: '', address: '', city: '', state: '', zip: '' };

export default function ConsumerCheckout() {
  const cart = useStoreCart();
  const navigate = useNavigate();
  const [value, setValue] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totals = cartTotals(cart);
  const restricted = restrictedLines(cart, value.state || cart.shipState);

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

  const submit = async (e, token) => {
    e.preventDefault();
    setError('');
    if (restricted.length > 0) {
      setError(`Some items can't ship to ${value.state}. Remove them from the basket first.`);
      return;
    }
    setSubmitting(true);
    try {
      const result = await startCheckout({
        nonce: token.nonce,
        expiryMonth: token.expiryMonth,
        expiryYear: token.expiryYear,
        avsZip: token.avsZip,
        channel: 'consumer',
        lines: cart.lines.map((l) => ({
          sku: l.sku,
          quantity: l.quantity,
          purchase_type: l.purchase_type,
          dose_label: l.dose_label,
          cadence_days: l.cadence_days,
        })),
        customer: { name: value.name, email: value.email, phone: value.phone },
        shipAddress: value.address,
        shipCity: value.city,
        shipState: value.state,
        shipZip: value.zip,
      });
      navigate(`/checkout/success?order=${result.order_id}`);
    } catch (err) {
      setSubmitting(false);
      setError(err?.message || 'Payment could not be completed.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link to="/cart" className="text-[12px] font-semibold text-site-greige underline underline-offset-4">Back to basket</Link>
      <h1 className="mt-4 font-display text-[34px] tracking-tight sm:text-[40px]">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CheckoutForm
          value={value}
          onChange={setValue}
          onSubmit={submit}
          submitting={submitting}
          error={error}
          submitLabel={`Pay ${money(totals.total)}`}
        />

        <aside className="h-fit rounded-xl border border-site-line bg-site-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Order summary</p>
          <ul className="mt-4 space-y-3">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-[13px]">
                <span>
                  {line.name}
                  <span className="block text-[11px] text-site-greige">
                    Qty {line.quantity} · {line.purchase_type === 'subscription' ? `refill every ${line.cadence_days} days` : 'one-time'}
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