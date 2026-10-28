import React from 'react';

const ITEMS = [
  'LegitScript certified',
  'US-licensed providers',
  '503A partner pharmacy',
  'Free shipping over $99',
];

export default function ConsumerTrustBand() {
  return (
    <section className="border-y border-site-line bg-site-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-site-line px-5 sm:px-8 md:grid-cols-4 md:divide-x">
        {ITEMS.map((item) => (
          <div key={item} className="border-b border-site-line px-1 py-6 last:border-b-0 md:border-b-0 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}