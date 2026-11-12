import React from 'react';
import { WHY_POINTS } from '@/lib/partner/marketingPage';

export default function MarketingWhy() {
  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Why MedRevolve
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
          General agencies learn health ads on your budget. We already know them.
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-greige">
          Telehealth has rules most agencies have never read: prescription ad policy, LegitScript,
          HIPAA-safe tracking, claims you cannot make. We build around them from the start.
        </p>

        <ol className="mt-8 grid gap-6 sm:grid-cols-2">
          {WHY_POINTS.map((point) => (
            <li key={point.n} className="border-t border-site-line pt-5">
              <span className="font-mono text-[11px] font-semibold text-site-rust">{point.n}</span>
              <h3 className="mt-2 text-[15px] font-semibold leading-snug text-site-moss">{point.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{point.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}