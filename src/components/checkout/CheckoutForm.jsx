import React, { useState } from 'react';
import { US_STATES } from '@/lib/storefront/catalog';
import { CHECKOUT_CONSENT } from '@/lib/storefront/consent';

export default function CheckoutForm({ value, onChange, submitLabel = 'Checkout coming soon', disabled = false }) {
  const [accepted, setAccepted] = useState(false);

  const field = (key) => ({
    value: value[key] || '',
    onChange: (e) => onChange({ ...value, [key]: e.target.value }),
  });

  const inputClass =
    'h-11 w-full rounded-lg border border-site-line bg-site-surface px-3 text-[13px] outline-none focus:border-site-moss';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="rounded-xl border border-site-line bg-site-surface p-5">
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

      <label className="mt-6 flex items-start gap-3 rounded-lg border border-site-line bg-site-cream/40 p-3">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none accent-site-rust"
        />
        <span className="text-[11px] leading-relaxed text-site-greige">{CHECKOUT_CONSENT}</span>
      </label>

      <button
        type="submit"
        disabled={disabled || !accepted}
        className="mt-5 w-full rounded-lg bg-site-rust px-5 py-3.5 text-[13px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-site-greige">
        Secure checkout is being finalized. Card processing is not yet enabled on this page.
      </p>
    </form>
  );
}