import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const EMPTY = { company: '', name: '', email: '', phone: '', compounds: '', volume: '', message: '' };

export default function RuoContact() {
  const [value, setValue] = useState(EMPTY);
  const [state, setState] = useState('idle');

  const field = (key) => ({
    value: value[key],
    onChange: (e) => setValue({ ...value, [key]: e.target.value }),
  });
  const inputClass =
    'h-11 w-full rounded-lg border border-site-line bg-site-surface px-3 text-[13px] outline-none focus:border-site-moss';

  const submit = async (e) => {
    e.preventDefault();
    setState('saving');
    try {
      await base44.entities.BusinessInquiry.create({
        company_name: value.company,
        contact_name: value.name,
        email: value.email,
        phone: value.phone,
        interest_type: 'Wholesale',
        company_size: value.volume,
        message: `${value.compounds}\n\n${value.message}`,
      });
      setState('done');
      setValue(EMPTY);
    } catch {
      setState('error');
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 md:py-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Bulk desk</p>
      <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">Request a bulk quote</h1>
      <p className="mt-4 text-[13px] leading-relaxed text-site-greige">
        Tell us the compounds, case volume and destination. Quotes are returned within one business day,
        with lot allocation and lead time confirmed.
      </p>

      {state === 'done' ? (
        <div className="mt-8 rounded-xl border border-site-line bg-site-surface p-6">
          <p className="text-[15px] font-semibold">Quote request received.</p>
          <p className="mt-2 text-[13px] text-site-greige">We reply from the bulk desk within one business day.</p>
          <button type="button" onClick={() => setState('idle')} className="mt-4 text-[12px] font-semibold text-site-rust underline underline-offset-4">
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 rounded-xl border border-site-line bg-site-surface p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input {...field('company')} required placeholder="Organization / lab name" className={`${inputClass} sm:col-span-2`} />
            <input {...field('name')} required placeholder="Contact name" className={inputClass} />
            <input {...field('email')} required type="email" placeholder="Work email" className={inputClass} />
            <input {...field('phone')} placeholder="Phone" className={inputClass} />
            <input {...field('volume')} placeholder="Monthly case volume" className={inputClass} />
            <input {...field('compounds')} required placeholder="Compounds and sizes" className={`${inputClass} sm:col-span-2`} />
            <textarea
              {...field('message')}
              rows={4}
              placeholder="Destination, timelines, payment terms"
              className="w-full rounded-lg border border-site-line bg-site-surface p-3 text-[13px] outline-none focus:border-site-moss sm:col-span-2"
            />
          </div>
          {state === 'error' && <p className="mt-3 text-[12px] text-site-rust">That didn't send. Try again.</p>}
          <button type="submit" disabled={state === 'saving'} className="mt-4 w-full rounded-lg bg-site-moss px-5 py-3.5 text-[13px] font-semibold text-site-cream disabled:opacity-50">
            {state === 'saving' ? 'Sending…' : 'Request quote'}
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-site-greige">
            Quotes are issued to verified research or manufacturing entities only.
          </p>
        </form>
      )}
    </section>
  );
}