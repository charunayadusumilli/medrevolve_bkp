import React from 'react';
import { PROCESS_STEPS } from '@/lib/partner/marketingPage';

export default function MarketingProcess() {
  return (
    <section className="bg-site-moss text-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          How it runs
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight sm:text-[40px]">
          From audit to always-on growth
        </h2>

        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => (
            <li key={step.n} className="border-t border-site-cream/15 pt-5">
              <span className="font-mono text-[11px] font-semibold text-site-rust">{step.n}</span>
              <h3 className="mt-2 font-display text-[22px] leading-snug tracking-tight">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-site-cream/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}