import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import QbiCardForm from '@/components/checkout/QbiCardForm';
import { startCheckout } from '@/lib/checkout';
import useCaseCart from '@/hooks/useCaseCart';
import { bySku } from '@/lib/ruo/storefront';
import { lineTotal, money } from '@/lib/ruo/pricing';
import { clearCaseCart, totalUnits } from '@/lib/ruo/storeCart';
import { US_STATES } from '@/lib/storefront/catalog';

const ACH_THRESHOLD = 2000;
const FLAT_SHIPPING = 18;
const FREE_SHIPPING_AT = 4;

const input =
  'h-10 w-full border border-ruo-line bg-ruo-surface px-3 font-mono text-[11px] outline-none focus:border-ruo-accent';

export default function RuoCheckoutPage() {
  const cart = useCaseCart();
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
  });
  const [method, setMethod] = useState('card');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const cardForm = useRef(null);

  const skuKey = cart.lines.map((l) => l.sku).sort().join(',');

  useEffect(() => {
    if (!skuKey) {
      setProducts(new Map());
      return;
    }
    base44.entities.RUOProduct
      .filter({ sku: { $in: skuKey.split(',') } }, { limit: 100 })
      .then((page) => setProducts(bySku(page?.items)))
      .catch(() => setProducts(new Map()));
  }, [skuKey]);

  const units = totalUnits(cart);
  const lines = cart.lines
    .map((line) => ({ line, product: products?.get(line.sku) }))
    .filter((row) => row.product);
  const subtotal = lines.reduce((sum, r) => sum + lineTotal(r.product, r.line.quantity), 0);
  const shipping = lines.length === 0 || units >= FREE_SHIPPING_AT ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const achAvailable = total >= ACH_THRESHOLD;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const payload = () => ({
    channel: 'ruo',
    lines: cart.lines.map((l) => ({ sku: l.sku, quantity: l.quantity })),
    customer: { name: form.name, email: form.email, phone: form.phone },
    shipAddress: form.address,
    shipCity: form.city,
    shipState: form.state,
    shipZip: form.zip,
  });

  const payByCard = async () => {
    if (!cardForm.current) {
      setError('The card form is still loading. Give it a moment and try again.');
      return;
    }
    const token = await cardForm.current.getNonceToken();
    if (!token?.nonce) {
      setError('Check the card details and try again.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await startCheckout({
        ...payload(),
        nonce: token.nonce,
        expiryMonth: token.expiryMonth,
        expiryYear: token.expiryYear,
        avsZip: token.avsZip,
      });
      setResult({ kind: 'card', reference: data.reference_number || data.order_id });
      clearCaseCart();
    } catch (err) {
      setError(err?.message || 'Payment could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  const payByTransfer = async () => {
    setSubmitting(true);
    try {
      const res = await base44.functions.invoke('ruoAchOrder', payload());
      const data = res?.data || {};
      if (!data.success) throw new Error(data.error || 'The order could not be created.');
      setResult({ kind: 'ach', reference: data.reference });
      clearCaseCart();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'The order could not be created.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl border border-ruo-ink p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-accent">
          {result.kind === 'card' ? 'Payment approved' : 'Order reserved'}
        </p>
        <h1 className="mt-3 text-[26px] font-semibold tracking-tight">
          {result.kind === 'card' ? 'Order confirmed' : 'Awaiting settlement'}
        </h1>
        <p className="mt-3 font-mono text-[12px]">{result.reference}</p>
        <p className="mt-4 text-[12px] leading-relaxed text-ruo-muted">
          {result.kind === 'card'
            ? 'A receipt is on its way to the email on file. Lots ship on the lead time stated on each product record, with tracking emailed at dispatch.'
            : 'Settlement instructions for the ACH or wire transfer are emailed within one business day. The order does not ship until funds clear.'}
        </p>
        <p className="mt-4 border-t border-ruo-line pt-4 text-[11px] leading-relaxed text-ruo-muted">
          This is a research-use-only purchase. Not for human or veterinary use.
        </p>
        <Link
          to="/ruo/catalog"
          className="mt-6 inline-block bg-ruo-ink px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-[24px] font-semibold tracking-tight">Nothing to bill</h1>
        <Link to="/ruo/catalog" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[0.14em] underline underline-offset-4">
          Open the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Billing</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-tight sm:text-[32px]">
          Research purchase
        </h1>
        <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-ruo-muted">
          Direct billing, no intake. Card on any order; ACH or wire on orders of $2,000 and above.
        </p>

        <div className="mt-6 grid gap-3 border border-ruo-line p-5 sm:grid-cols-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted sm:col-span-2">
            Buyer and ship-to
          </p>
          <input required placeholder="Full name" value={form.name} onChange={set('name')} className={input} />
          <input required type="email" placeholder="Email for the receipt" value={form.email} onChange={set('email')} className={input} />
          <input placeholder="Phone" value={form.phone} onChange={set('phone')} className={input} />
          <input required placeholder="Street address" value={form.address} onChange={set('address')} className={input} />
          <input required placeholder="City" value={form.city} onChange={set('city')} className={input} />
          <select required value={form.state} onChange={set('state')} className={input}>
            <option value="">State</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
          <input required placeholder="ZIP" value={form.zip} onChange={set('zip')} className={input} />
        </div>

        <div className="mt-4 grid gap-3">
          <label className={`flex cursor-pointer items-center gap-3 border p-3 ${method === 'card' ? 'border-ruo-ink' : 'border-ruo-line'}`}>
            <input type="radio" name="method" checked={method === 'card'} onChange={() => setMethod('card')} className="accent-ruo-ink" />
            <span className="text-[12px]">Card — charged now</span>
          </label>
          <label
            className={`flex items-center gap-3 border p-3 ${
              achAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            } ${method === 'ach' ? 'border-ruo-ink' : 'border-ruo-line'}`}
          >
            <input
              type="radio"
              name="method"
              disabled={!achAvailable}
              checked={method === 'ach'}
              onChange={() => setMethod('ach')}
              className="accent-ruo-ink"
            />
            <span className="text-[12px]">
              ACH or wire — orders over $2,000
              {!achAvailable && <span className="ml-1 font-mono text-[10px] text-ruo-muted">(not yet met)</span>}
            </span>
          </label>
        </div>

        {method === 'card' ? (
          <div className="mt-4">
            <QbiCardForm formRef={cardForm} onReady={() => {}} onConfigError={setError} />
          </div>
        ) : (
          <div className="mt-4 border border-ruo-line p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">
              Zelle and wire — bulk orders
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-ruo-muted">
              Submit the order to reserve the units, then settle by ACH, wire, or Zelle. Settlement
              instructions and the invoice reference are emailed to the address on file within one business
              day — we do not publish account numbers on the site. Units are held for 3 business days.
            </p>
          </div>
        )}

        <label className="mt-5 flex items-start gap-3 border border-ruo-ink p-4">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-ruo-ink" />
          <span className="text-[11px] leading-relaxed">
            This is a research-use-only purchase. I confirm I am 21 or older, that these materials are for
            in-vitro laboratory research, and that they will not be administered to humans or animals.
          </span>
        </label>

        {error && <p className="mt-4 border border-ruo-warn p-3 font-mono text-[11px] text-ruo-warn">{error}</p>}

        <button
          type="button"
          disabled={!consent || submitting}
          onClick={method === 'card' ? payByCard : payByTransfer}
          className="mt-5 w-full bg-ruo-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting
            ? 'Processing…'
            : method === 'card'
              ? `Pay ${money(total)} by card`
              : `Reserve order — ${money(total)}`}
        </button>
        <p className="mt-3 text-[10px] leading-relaxed text-ruo-muted">
          Card payments are processed by QBI Gateway. Card details never touch our servers. The consent
          checkbox must be ticked before any charge is attempted.
        </p>
      </div>

      <aside className="h-fit border border-ruo-ink p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">Cart summary</p>
        {products === null ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">Pricing…</p>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {lines.map(({ line, product }) => (
                <li key={line.sku} className="flex justify-between gap-3 text-[12px]">
                  <span>
                    {product.display_name}
                    <span className="block font-mono text-[10px] text-ruo-muted">
                      {line.quantity} × lot {product.lot_number}
                    </span>
                  </span>
                  <span className="font-mono tabular-nums">{money(lineTotal(product, line.quantity))}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-ruo-line pt-4 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-ruo-muted">Subtotal</dt>
                <dd className="font-mono tabular-nums">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ruo-muted">Shipping</dt>
                <dd className="font-mono tabular-nums">{shipping === 0 ? 'Included' : money(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ruo-ink pt-3 text-[14px] font-semibold">
                <dt>Total</dt>
                <dd className="font-mono tabular-nums">{money(total)}</dd>
              </div>
            </dl>
          </>
        )}
        <Link to="/ruo/cart" className="mt-5 block font-mono text-[10px] uppercase tracking-[0.1em] underline underline-offset-4">
          Edit the case cart
        </Link>
      </aside>
    </div>
  );
}