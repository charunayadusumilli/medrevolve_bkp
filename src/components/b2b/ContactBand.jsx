import React from 'react';
import { Link } from 'react-router-dom';
import { B2B_CONTACT } from '@/lib/partner/offerings';

const LEGAL = [
  { label: 'Terms', to: '/Terms' },
  { label: 'Privacy', to: '/Privacy' },
  { label: 'Refund Policy', to: '/RefundPolicy' },
  { label: 'Medical Disclaimer', to: '/MedicalDisclaimer' },
];

export default function ContactBand() {
  return (
    <section className="border-t border-site-line bg-site-moss text-site-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:py-16">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">Contact</p>
          <h2 className="mt-3 font-display text-[30px] leading-tight tracking-tight sm:text-[36px]">
            Talk to a person, not a form queue.
          </h2>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-site-cream/60">
            Referrals that come through a partner are answered within one business day.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={`tel:${B2B_CONTACT.phoneTel}`}
            className="font-mono text-[22px] tracking-tight underline decoration-site-cream/30 underline-offset-4 hover:decoration-site-cream"
          >
            {B2B_CONTACT.phoneDisplay}
          </a>
          <a
            href={`mailto:${B2B_CONTACT.email}`}
            className="text-[15px] font-semibold underline decoration-site-cream/30 underline-offset-4 hover:decoration-site-cream"
          >
            {B2B_CONTACT.email}
          </a>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            {LEGAL.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[12px] text-site-cream/50 underline decoration-transparent underline-offset-4 transition-colors hover:text-site-cream hover:decoration-site-cream/40"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}