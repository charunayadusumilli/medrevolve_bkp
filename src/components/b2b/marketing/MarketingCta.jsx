import React from 'react';
import {
  MARKETING_CHECKOUT_URL,
  STRATEGY_CALL_URL,
  COMPLIANCE_LINE,
} from '@/lib/partner/marketingPage';

export default function MarketingCta() {
  return (
    <section className="bg-site-moss text-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <h2 className="max-w-2xl font-display text-[30px] leading-tight tracking-tight sm:text-[42px]">
          Ready to grow your telehealth brand?
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-cream/70">
          Tell us where you are today and we will map the strategy to get you where you want to go.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={MARKETING_CHECKOUT_URL}
            className="inline-flex items-center justify-center rounded-lg bg-site-rust px-6 py-3 text-[14px] font-semibold text-site-cream transition-opacity hover:opacity-90"
          >
            Get the marketing engine
          </a>
          <a
            href={STRATEGY_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-site-cream/30 px-6 py-3 text-[14px] font-semibold text-site-cream transition-colors hover:border-site-cream"
          >
            Book a strategy call
          </a>
        </div>

        <p className="mt-10 max-w-3xl border-t border-site-cream/15 pt-5 text-[11px] leading-relaxed text-site-cream/50">
          {COMPLIANCE_LINE}
        </p>
      </div>
    </section>
  );
}