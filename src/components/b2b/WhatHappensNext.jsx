import React from 'react';

const STEPS = [
  {
    step: '01',
    title: 'We reply within one business day',
    detail: 'A named person on our side, not an autoresponder, answers the referral.',
  },
  {
    step: '02',
    title: 'Fixed-price audit within three days',
    detail: 'Scope and price are written down before anything hourly is quoted.',
  },
  {
    step: '03',
    title: 'Kickoff inside a week',
    detail: 'Work starts on the agreed module with a written scope behind it.',
  },
];

export default function WhatHappensNext() {
  return (
    <section className="border border-site-line bg-site-surface p-6 sm:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
        What happens next
      </p>
      <h2 className="mt-3 font-display text-[24px] leading-tight tracking-tight text-site-moss sm:text-[28px]">
        Three steps, no chasing.
      </h2>

      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {STEPS.map((item) => (
          <li key={item.step} className="border-t border-site-line pt-4">
            <p className="font-mono text-[11px] tracking-[0.14em] text-site-rust">{item.step}</p>
            <p className="mt-2 text-[14px] font-semibold leading-snug text-site-moss">{item.title}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-site-greige">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}