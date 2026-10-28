import React from 'react';

const DAYS = [
  { day: 'Day 1', title: 'Brand and domain', copy: 'Your logo, palette and domain wired to the platform. Nothing generic left in the flow.' },
  { day: 'Day 2', title: 'Clinical build', copy: 'Intake, consent and questionnaire logic mapped to the treatments you will offer.' },
  { day: 'Day 3', title: 'Provider roster', copy: 'Licensed providers assigned by state with scheduling and async review configured.' },
  { day: 'Day 4', title: 'Pharmacy and catalog', copy: '503A fulfillment, pricing and SKU limits loaded against your margins.' },
  { day: 'Day 5', title: 'Payments and compliance', copy: 'Card processing, refund policy, BAA and LegitScript-ready disclosures in place.' },
  { day: 'Day 6', title: 'QA and soft launch', copy: 'End-to-end test orders, intake edge cases and mobile checkout verified.' },
  { day: 'Day 7', title: 'Live', copy: 'Launch with tracking, order routing and WhatsApp support switched on.' },
];

export default function SevenDayWalkthrough() {
  return (
    <section id="platform" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">The 7-day walkthrough</p>
      <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
        What actually happens between signup and first order
      </h2>

      <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {DAYS.map((step) => (
          <li key={step.day} className="border-t border-site-line pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">{step.day}</p>
            <p className="mt-2 text-[15px] font-semibold">{step.title}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}