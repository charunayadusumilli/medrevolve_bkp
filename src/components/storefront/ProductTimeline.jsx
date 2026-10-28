import React from 'react';

const STEPS = [
  { day: 'Day 0', title: 'Intake', copy: 'A short online medical questionnaire, reviewed against your history.' },
  { day: 'Day 1–2', title: 'Provider review', copy: 'A US-licensed provider reviews and messages you with any questions.' },
  { day: 'Day 2–4', title: 'Pharmacy ships', copy: 'If approved, a licensed US pharmacy fills and ships your order.' },
  { day: 'Day 4–7', title: 'Arrives', copy: 'Discreet, tracked delivery. Follow-up care is included.' },
];

export default function ProductTimeline({ prescription }) {
  return (
    <section className="rounded-2xl border border-sf-line bg-sf-surface p-6">
      <h2 className="font-display text-[24px] tracking-tight">What to expect</h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <li key={step.day} className="border-t border-sf-line pt-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sf-accent">{step.day}</p>
            <p className="mt-1.5 text-[13px] font-semibold">{step.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-sf-muted">{step.copy}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[11px] leading-relaxed text-sf-muted">
        {prescription
          ? 'Timelines are estimates and depend on provider review and pharmacy fulfillment. No medication is dispensed without a valid prescription.'
          : 'Timelines are estimates and depend on stock and carrier performance.'}
      </p>
    </section>
  );
}