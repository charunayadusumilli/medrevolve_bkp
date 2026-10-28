import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { RUO_BANNER, BULK_TIERS } from '@/lib/ruo/catalog';

const STEPS = [
  { title: '1. Verify your organization', copy: 'Create an account with your institution or business details. We confirm entity status before first shipment.' },
  { title: '2. Order by the case', copy: 'Catalog cases ship same-day if ordered before 2pm ET. Volume tiers apply automatically.' },
  { title: '3. Receive with documentation', copy: 'Each shipment includes the batch COA and cold-chain packing record.' },
  { title: '4. Reorder on terms', copy: 'Approved accounts can move to net-30 invoicing for repeat bulk orders.' },
];

const CHECKLIST = [
  'Legal entity name and EIN or registration number',
  'Research or manufacturing use statement',
  'Shipping address with a receiving contact',
  'Signed RUO terms and attestation',
];

export default function RuoInfo({ kind }) {
  const [lots, setLots] = useState(null);

  useEffect(() => {
    if (kind !== 'lab-results') return;
    base44.entities.RUOProduct.filter({}, { sort: '-tested_on', limit: 40 }).then((page) => setLots(page.items || []));
  }, [kind]);

  if (kind === 'lab-results') {
    return (
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Batch documentation</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">Lab results</h1>
        <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-site-greige">
          Every lot is tested by an independent laboratory. Purity is measured by HPLC and identity confirmed
          by mass spectrometry. Records are published per batch and retained for the life of the lot.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-site-line bg-site-surface">
          <table className="w-full text-left text-[12px]">
            <thead className="border-b border-site-line text-[10px] uppercase tracking-[0.08em] text-site-greige">
              <tr>
                <th className="px-4 py-3">Compound</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Purity</th>
                <th className="px-4 py-3">Tested</th>
                <th className="px-4 py-3">COA</th>
              </tr>
            </thead>
            <tbody>
              {(lots || []).map((lot) => (
                <tr key={lot.id} className="border-b border-site-line last:border-0">
                  <td className="px-4 py-3 font-semibold">{lot.name}</td>
                  <td className="px-4 py-3 text-site-greige">{lot.batch_code}</td>
                  <td className="px-4 py-3">{lot.purity}</td>
                  <td className="px-4 py-3 text-site-greige">{lot.tested_on}</td>
                  <td className="px-4 py-3">
                    <Link to={`/ruo/${lot.slug}`} className="font-semibold text-site-rust underline underline-offset-4">View</Link>
                  </td>
                </tr>
              ))}
              {lots === null && (
                <tr><td colSpan={5} className="px-4 py-6 text-site-greige">Loading batch records…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (kind === 'bulk-orders') {
    return (
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Volume</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">Bulk orders</h1>
        <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-site-greige">
          Pricing tiers apply automatically at checkout. Above 12 cases, send a quote request and we will
          confirm lead time, lot allocation and payment terms.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {BULK_TIERS.map((tier) => (
            <div key={tier.label} className="rounded-xl border border-site-line bg-site-surface p-5">
              <p className="font-display text-[24px]">{tier.label}</p>
              <p className="mt-1 text-[12px] text-site-greige">{tier.detail}</p>
            </div>
          ))}
        </div>
        <Link to="/contact" className="mt-8 inline-flex rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream">
          Request a quote
        </Link>
      </section>
    );
  }

  if (kind === 'how-to-order') {
    return (
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Process</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">How to order</h1>
        <ol className="mt-8 space-y-6">
          {STEPS.map((step) => (
            <li key={step.title} className="border-t border-site-line pt-5">
              <p className="text-[15px] font-semibold">{step.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{step.copy}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-xl border border-site-line bg-site-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Verification checklist</p>
          <ul className="mt-3 space-y-2 text-[13px] text-site-greige">
            {CHECKLIST.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    );
  }

  if (kind === 'track-order') {
    return (
      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Shipping</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">Track an order</h1>
        <p className="mt-4 text-[13px] leading-relaxed text-site-greige">
          Enter the order number from your confirmation email. Tracking is added when the cold-chain box
          leaves our facility, usually within one business day.
        </p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Order number, e.g. RUO-10428"
            className="h-11 flex-1 rounded-lg border border-site-line bg-site-surface px-3 text-[13px] outline-none focus:border-site-moss"
          />
          <button type="submit" className="h-11 rounded-lg bg-site-moss px-5 text-[13px] font-semibold text-site-cream">
            Look up
          </button>
        </form>
        <p className="mt-4 text-[12px] text-site-greige">
          Need it faster? Message us on WhatsApp with your order number and we will confirm the box status.
        </p>
      </section>
    );
  }

  if (kind === 'compliance') {
    return (
      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Restrictions</p>
        <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">Compliance</h1>
        <div className="mt-6 space-y-4 text-[13px] leading-relaxed text-site-greige">
          <p className="rounded-lg border border-site-rust/40 bg-site-surface px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-site-rust">
            {RUO_BANNER}
          </p>
          <p>Material on this site is supplied exclusively to qualified researchers for in-vitro laboratory work. It is not a drug, dietary supplement, cosmetic or prescription product, and it is not intended to diagnose, treat, cure or prevent any condition.</p>
          <p>Buyers attest at account creation that they are 18 or older, authorized to purchase on behalf of their organization, and will not administer any material to humans or animals.</p>
          <p>We do not ship to residential addresses for compounds above 50mg, and we do not sell to buyers who describe human use in correspondence. Orders that suggest human use are cancelled and refunded.</p>
          <p>Statements on this site have not been evaluated by the Food and Drug Administration.</p>
        </div>
      </section>
    );
  }

  return null;
}