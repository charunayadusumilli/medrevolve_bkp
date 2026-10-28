import React, { useRef, useState } from 'react';
import { US_STATES } from '@/lib/storefront/catalog';
import QbiCardForm from '@/components/checkout/QbiCardForm';

export default function CheckoutForm({ value, onChange, onSubmit, submitting, error, submitLabel, children }) {
  const cardForm = useRef(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState('');

  const field = (key) => ({
    value: value[key] || '',
    onChange: (e) => onChange({ ...value, [key]: e.target.value }),
  });

  const inputClass =
    'h-11 w-full rounded-lg border border-site-line bg-site-surface px-3 text-[13px] outline-none focus:border-site-moss';

  const submit = async (e) => {
    e.preventDefault();
    if (!cardForm.current) {
      setCardError('The card form is still loading. Give it a moment and try again.');
      return;
    }
    const token = await cardForm.current.getNonceToken();
    if (!token?.nonce) {
      setCardError('Check the card details and try again.');
      return;
    }
    setCardError('');
    onSubmit(e, token);
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-site-line bg-site-surface p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Contact</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input {...field('name')} required placeholder="Full name" className={inputClass} />
        <input {...field('email')} required type="email" placeholder="Email for the receipt" className={inputClass} />
        <input {...field('phone')} placeholder="Phone" className={`${inputClass} sm:col-span-2`} />
      </div>

      <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Shipping</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input {...field('address')} required placeholder="Street address" className={`${inputClass} sm:col-span-2`} />
        <input {...field('city')} required placeholder="City" className={inputClass} />
        <select {...field('state')} required className={inputClass}>
          <option value="">State</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        <input {...field('zip')} required placeholder="ZIP" className={inputClass} />
      </div>

      {children}

      <div className="mt-6">
        <QbiCardForm formRef={cardForm} onReady={() => setCardReady(true)} onConfigError={setCardError} />
      </div>

      {(error || cardError) && (
        <p className="mt-4 rounded-lg bg-site-rust/10 p-3 text-[12px] text-site-rust">{error || cardError}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !cardReady}
        className="mt-5 w-full rounded-lg bg-site-rust px-5 py-3.5 text-[13px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Processing payment…' : submitLabel}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-site-greige">
        Payments are processed by QBI Gateway. Your card details never touch our servers.
      </p>
    </form>
  );
}