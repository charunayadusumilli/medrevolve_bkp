import React from 'react';
import { GUIDELINES } from '@/lib/consumer/education';

export default function GuidelineCards() {
  return (
    <section className="border-t border-site-line bg-site-moss">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Where the profession lands</p>
          <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-site-cream sm:text-[40px]">
            What the certifying bodies actually say.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-site-cream/70">
            Summaries of published positions — not quotations, and not our opinion dressed up as theirs.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/15 md:grid-cols-2">
          {GUIDELINES.map((item) => (
            <div key={item.org} className="bg-site-moss p-6">
              <p className="text-[13px] font-semibold text-site-cream">{item.org}</p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-site-cream/70">{item.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}