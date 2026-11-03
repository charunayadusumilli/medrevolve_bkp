import React from 'react';
import { Link } from 'react-router-dom';
import ReferralForm from './ReferralForm';

export default function ReferralSection() {
  return (
    <section id="referred" className="border border-site-line bg-site-surface p-6 sm:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">Priority intake</p>
      <h2 className="mt-3 font-display text-[28px] leading-tight tracking-tight text-site-moss sm:text-[34px]">
        Referred by a partner?
      </h2>
      <div className="mt-4 max-w-2xl space-y-2 text-[14px] leading-relaxed text-site-greige">
        <p>Referred clients get priority kickoff within 3 business days.</p>
        <p>You get a named point of contact from the first reply onward.</p>
        <p>A fixed-price audit is scoped before any hourly work begins.</p>
      </div>

      <div className="mt-6 border border-site-line bg-site-cream p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-site-moss">
          Start here: the $500 processing readiness audit
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-site-greige">
          It is the entry product. Fixed price, written report, no hourly work before it.
        </p>
        <Link
          to="/audit"
          className="mt-4 inline-flex rounded-lg bg-site-rust px-5 py-3 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90"
        >
          See the $500 audit
        </Link>
      </div>

      <div className="mt-6">
        <ReferralForm />
      </div>
    </section>
  );
}