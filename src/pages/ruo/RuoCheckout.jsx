import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRuoCart from '@/hooks/useRuoCart';
import { ruoTotals } from '@/lib/ruo/cart';
import { ruoMoney } from '@/lib/ruo/catalog';
import { startCheckout } from '@/lib/checkout';
import CheckoutForm from '@/components/checkout/CheckoutForm';

const EMPTY = { name: '', email: '', phone: '', address: '', city: '', state: '', zip: '' };

export default function RuoCheckout() {
  const cart = useRuoCart();
  const [value, setValue] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const totals = ruoTotals(cart);

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-[32px]">No cases to check out</h1>
        <Link to="/catalog" className="mt-6 inline-flex rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream">
          Browse the catalog
        </Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await startCheckout({
        channel: 'ruo',
        lines: cart.lines.map((l) => ({ sku: l.sku, quantity: l.quantity })),
        customer: { name: value.name, email: value.email, phone: value.phone },
        shipAddress: value.address,
        shipCity: value.city,
        shipState: value.state,
        shipZip: value.zip,
      });
    } catch (err) {
      setSubmitting(false);
      setError(err?.message || 'Checkout could not be started.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link to="/cart" className="text-[12px] font-semibold text-site-greige underline underline-offset-4">Back to cart</Link>
      <h1 className="mt-4 font-display text-[34px] tracking-tight sm:text-[40px]">Research checkout</h1>
      <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-site-greige">
        Business verification is required before the first shipment. If your entity details are not yet on
        file, we will email a short verification form before dispatch.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CheckoutForm
          value={value}
          onChange={setValue}
          onSubmit={submit}
          submitting={submitting}
          error={error}
          submitLabel={`Pay ${ruoMoney(totals.total)}`}
        >
          <label className="mt-4 flex items-start gap-3 rounded-lg border border-site-line bg-site-cream p-3">
            <input type="checkbox" required className="mt-0.5 h-4 w-4" />
            <span className="text-[11px] leading-relaxed text-site-greige">
              I confirm these materials are purchased for in-vitro laboratory research only, not for human
              or animal consumption, and that I am authorized to purchase for my organization.
            </span>
          </label>
        </CheckoutForm>

        <aside className="h-fit rounded-xl border border-site-line bg-site-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Order summary</p>
          <ul className="mt-4 space-y-3">
            {cart.lines.map((line) => (
              <li key={line.sku} className="flex justify-between gap-3 text-[13px]">
                <span>{line.name}<span className="block text-[11px] text-site-greige">{line.quantity} case{line.quantity === 1 ? '' : 's'}</span></span>
                <span className="font-semibold">{ruoMoney(line.unit_price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-site-line pt-4 text-[13px]">
            <div className="flex justify-between"><dt className="text-site-greige">Subtotal</dt><dd>{ruoMoney(totals.gross)}</dd></div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-site-rust"><dt>Bulk discount</dt><dd>−{ruoMoney(totals.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-site-greige">Cold-chain shipping</dt><dd>{totals.shipping === 0 ? 'Included' : ruoMoney(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-site-line pt-3 text-[15px] font-semibold"><dt>Total</dt><dd>{ruoMoney(totals.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}