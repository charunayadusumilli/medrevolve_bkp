import React from 'react';
import { MARKETING_CHECKOUT_URL, STRATEGY_CALL_URL, HERO_TRUST } from '@/lib/partner/marketingPage';

export default function MarketingHero() {
  return (
    <section className="bg-site-moss text-site-cream">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Telehealth marketing · B2B
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-[36px] leading-[1.06] tracking-tight sm:text-[56px]">
          Telehealth marketing, built around the ad rules.
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">
          Paid ads, organic social, creative and the landing pages they send traffic to, for telehealth
          and regulated health brands. Written to Meta and Google healthcare policies from the first
          draft, and run by the team that also built the platform underneath.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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

        <ul className="mt-8 flex flex-col gap-2 border-t border-site-cream/15 pt-5 text-[12px] leading-relaxed text-site-cream/60 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-2">
          {HERO_TRUST.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && <span className="hidden text-site-cream/25 sm:inline">·</span>}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}