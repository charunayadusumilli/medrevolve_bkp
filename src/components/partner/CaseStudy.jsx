import React from 'react';

const METRICS = [
  { value: '90 days', label: 'Signup to 1,200 patients' },
  { value: '4', label: 'States licensed at launch' },
  { value: '31%', label: 'Of revenue on subscription' },
];

export default function CaseStudy() {
  return (
    <section id="case-study" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Case study</p>
          <h2 className="mt-3 font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
            A two-room med spa, now a four-state telehealth brand
          </h2>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-site-greige">
            An aesthetics clinic in the Midwest launched a weight-care line under its own name. We ran the
            clinical network, pharmacy fulfillment and checkout; they kept the brand, the patient
            relationship and the margin.
          </p>
          <blockquote className="mt-6 border-l-2 border-site-rust pl-4 text-[14px] leading-relaxed text-site-moss">
            "We expected a licensing project. What we got was a second business line that runs without us
            hiring a single engineer."
            <span className="mt-2 block text-[12px] text-site-greige">Owner, clinic partner (name withheld)</span>
          </blockquote>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {METRICS.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-site-line bg-site-surface p-5">
              <p className="font-display text-[28px] leading-none">{metric.value}</p>
              <p className="mt-2 text-[11px] leading-snug text-site-greige">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}