import React from 'react';
import ReferralForm from './ReferralForm';

export default function ReferralSection() {
  return (
    <section id="referred" className="border border-site-line bg-site-surface p-6 sm:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">Priority intake</p>
      <h2 className="mt-3 font-display text-[28px] leading-tight tracking-tight text-site-moss sm:text-[34px]">
        Referred by a partner?
      </h2>
      <div className="mt-4 max-w-2xl space-y-2 text-[14px] leading-relaxed text-site-greige">
        <p>Partner referrals get priority kickoff inside 3 business days.</p>
        <p>You get a named point of contact from the first reply onward.</p>
        <p>A fixed-price audit is scoped before any hourly work begins.</p>
      </div>
      <div className="mt-6">
        <ReferralForm />
      </div>
    </section>
  );
}