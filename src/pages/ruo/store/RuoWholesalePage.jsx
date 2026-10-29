import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { US_STATES } from '@/lib/storefront/catalog';

const input =
  'h-10 w-full border border-ruo-line bg-ruo-surface px-3 font-mono text-[11px] outline-none focus:border-ruo-accent';

const VOLUMES = [
  '$2,000 – $5,000 per month',
  '$5,000 – $15,000 per month',
  '$15,000 – $50,000 per month',
  '$50,000+ per month',
];

const LADDER = [
  { cases: '5+ cases', discount: '15%' },
  { cases: '10+ cases', discount: '22%' },
  { cases: '25+ cases', discount: '30%' },
];

const EMPTY = {
  business_name: '',
  ein: '',
  state: '',
  monthly_volume: VOLUMES[0],
  contact_name: '',
  email: '',
  phone: '',
};

export default function RuoWholesalePage() {
  const [value, setValue] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setValue({ ...value, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await base44.entities.RUOWholesaleApplication.create({
        ...value,
        status: 'new',
        notes: 'Submitted from the RUO wholesale page.',
      });
      setDone(true);
    } catch (err) {
      setError(err?.message || 'The application could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Wholesale</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">
          Wholesale accounts
        </h1>
        <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-ruo-muted">
          Wholesale applies to laboratories and research suppliers ordering at volume. Minimum order is
          $2,000. Applications are reviewed manually against the business registration.
        </p>

        <div className="mt-8 border border-ruo-line">
          <div className="border-b border-ruo-line px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-muted">
            Published starting ladder
          </div>
          <table className="w-full border-collapse text-left">
            <tbody>
              {LADDER.map((tier) => (
                <tr key={tier.cases} className="border-b border-ruo-line last:border-b-0">
                  <td className="px-4 py-3 font-mono text-[11px]">{tier.cases}</td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] tabular-nums">
                    {tier.discount} off list
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-ruo-muted">
          Approved accounts see wholesale pricing after login. Until an account is approved, the published
          volume ladder on the catalog applies.
        </p>

        {done ? (
          <div className="mt-8 border border-ruo-accent p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-accent">Received</p>
            <h2 className="mt-2 text-[18px] font-semibold">Application under review</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-ruo-muted">
              We review against the EIN and state registration provided. Expect a reply at {value.email} within
              two business days.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-3 border border-ruo-line p-5 sm:grid-cols-2">
            <input required placeholder="Business name" value={value.business_name} onChange={set('business_name')} className={`${input} sm:col-span-2`} />
            <input required placeholder="EIN (XX-XXXXXXX)" value={value.ein} onChange={set('ein')} className={input} />
            <select required value={value.state} onChange={set('state')} className={input}>
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            <select value={value.monthly_volume} onChange={set('monthly_volume')} className={`${input} sm:col-span-2`}>
              {VOLUMES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <input required placeholder="Contact name" value={value.contact_name} onChange={set('contact_name')} className={input} />
            <input required type="email" placeholder="Email" value={value.email} onChange={set('email')} className={input} />
            <input placeholder="Phone" value={value.phone} onChange={set('phone')} className={`${input} sm:col-span-2`} />

            {error && <p className="font-mono text-[11px] text-ruo-warn sm:col-span-2">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-ruo-ink px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg disabled:opacity-50 sm:col-span-2"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
            <p className="text-[10px] leading-relaxed text-ruo-muted sm:col-span-2">
              These materials are supplied for laboratory research only. Wholesale accounts must be registered
              businesses; sole-proprietor applications are reviewed case by case.
            </p>
          </form>
        )}
      </div>

      <aside className="border border-ruo-line p-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">Terms</p>
        <ul className="mt-3 space-y-3 text-[12px] leading-relaxed text-ruo-muted">
          <li>$2,000 minimum order for wholesale pricing.</li>
          <li>Net terms are available after two settled orders.</li>
          <li>Orders ship to the registered business address on file.</li>
          <li>Volume pricing is per line and applied automatically at checkout.</li>
          <li>Research use only. Not for human or veterinary use.</li>
        </ul>
        <a
          href="mailto:support@medrevolveruo.com"
          className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.12em] underline underline-offset-4"
        >
          support@medrevolveruo.com
        </a>
      </aside>
    </div>
  );
}