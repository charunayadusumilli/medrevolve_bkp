import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applyStoreSeo } from '@/lib/storefront/seo';
import { PARTNER_SERVICES, B2B_CONTACT } from '@/lib/partner/offerings';

const SCOPE = [
  'PCI configuration review of the current checkout and payment setup.',
  'Required policy and disclosure pages reviewed against processor requirements.',
  'Checkout and cart review, including subscription and refund logic.',
  'A written remediation report you can hand to a processor or acquirer.',
];

const CAVEAT = PARTNER_SERVICES[0].caveat;

export default function Audit() {
  useEffect(() => {
    applyStoreSeo({
      title: 'Processing Readiness Audit — $500 flat — MedRevolve',
      description:
        'A $500 flat review of PCI configuration, policy and disclosure pages, checkout and cart, with a written remediation report.',
      path: '/audit',
    });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-20">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
        Fixed price
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-[36px] leading-[1.08] tracking-tight sm:text-[48px]">
        Website and Processing Readiness Audit
      </h1>
      <p className="mt-3 font-mono text-[20px] tracking-tight text-site-rust">$500 flat</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-[15px] font-semibold text-site-moss">What is reviewed</h2>
          <ul className="mt-3 divide-y divide-site-line border-y border-site-line">
            {SCOPE.map((item) => (
              <li key={item} className="flex gap-3 py-3.5">
                <span className="font-mono text-[10px] text-site-rust">&#8226;</span>
                <span className="text-[14px] leading-relaxed text-site-greige">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-l-2 border-site-rust pl-4 text-[12px] leading-relaxed text-site-greige">
            {CAVEAT}
          </p>
        </div>

        <div className="border border-site-line bg-site-surface p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Next step</p>
          <h3 className="mt-3 font-display text-[24px] leading-tight text-site-moss">
            Request the audit.
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-site-greige">
            Referred by a partner? Say so in the form and the audit is scheduled first, before any hourly
            work is quoted.
          </p>
          <Link
            to="/partners"
            className="mt-5 inline-flex rounded-lg bg-site-rust px-5 py-3 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90"
          >
            Go to the referral form
          </Link>
          <p className="mt-4 text-[12px] text-site-greige">
            Or call{' '}
            <a href={`tel:${B2B_CONTACT.phoneTel}`} className="font-semibold text-site-moss underline underline-offset-4">
              {B2B_CONTACT.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}