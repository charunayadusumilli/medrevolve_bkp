import React from 'react';
import { PROOF_POINTS } from '@/lib/partner/offerings';

export default function ProofPoints() {
  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">Who we are</p>
        <h2 className="mt-3 max-w-xl font-display text-[30px] leading-tight tracking-tight sm:text-[38px]">
          What sits behind the platform.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PROOF_POINTS.map((point) => (
            <div key={point.title} className="border-t-2 border-site-moss pt-4">
              <h3 className="text-[15px] font-semibold leading-snug text-site-moss">{point.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}