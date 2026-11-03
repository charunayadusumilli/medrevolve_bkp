import React from 'react';
import { Link } from 'react-router-dom';
import { AUDIT_URL, PARTNER_SERVICES, STRIPE_DISCLOSURE } from '@/lib/partner/offerings';

const SCANS = [
  'Claims language that reads as a drug or treatment claim',
  'Missing research-use-only labeling and 21+ gating',
  'Required disclosures, disclaimers and policy pages',
  'Checkout, refund and subscription terms',
  'Processor and LegitScript readiness checklist',
];

const DELIVERS = [
  ['Scan', 'We crawl your site the way a processor, a payment sponsor and a compliance reviewer would.'],
  ['Report', 'Every finding is written up with the page it sits on and what to change.'],
  ['Remediate', 'We fix what we can in your storefront, or hand your team the exact edits.'],
  ['Monitor', 'Ongoing weekly scans with alerts when something new breaks compliance.'],
];

const CAVEAT = PARTNER_SERVICES[0].caveat;

export default function ComplianceMonitoring() {
  return (
    <section id="compliance" className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Module · Compliance
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight sm:text-[40px]">
          We scan your site and keep it compliant.
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-greige">
          RUO sellers get shut down over the words on the page, not just the product. We review your
          storefront against what processors, payment sponsors and compliance reviewers look for, tell you
          exactly what is wrong, and then keep watching it.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="border border-site-line bg-site-cream p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-moss">
              What the scan flags
            </p>
            <ul className="mt-4 space-y-2.5">
              {SCANS.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-site-greige">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-site-rust" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3">
            {DELIVERS.map(([step, detail]) => (
              <div key={step} className="border border-site-line bg-site-cream p-4 sm:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-rust">{step}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-site-greige">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border border-site-line bg-site-cream p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[14px] font-semibold text-site-moss">Start with the $500 readiness audit.</p>
            <p className="mt-1 text-[12px] leading-relaxed text-site-greige">
              It is the entry product. Ongoing monitoring is quoted per site once the audit is done.
            </p>
          </div>
          <a
            href={AUDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center rounded-lg bg-site-rust px-6 py-3 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90"
          >
            Buy now - $500
          </a>
        </div>

        <p className="mt-3 max-w-3xl text-[11px] leading-relaxed text-site-greige">{CAVEAT}</p>
        <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-site-greige">{STRIPE_DISCLOSURE}</p>

        <Link
          to="/services"
          className="mt-5 inline-flex text-[13px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss"
        >
          See every module and price
        </Link>
      </div>
    </section>
  );
}