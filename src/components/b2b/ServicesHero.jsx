import React from 'react';

export default function ServicesHero() {
  return (
    <section className="bg-site-moss text-site-cream">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Operator services
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-[36px] leading-[1.06] tracking-tight sm:text-[56px]">
          Everything an operator needs, priced plainly.
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">
          Six platform services and six partner services. Fixed prices. Clear scope. No discovery-call
          theatre.
        </p>
      </div>
    </section>
  );
}