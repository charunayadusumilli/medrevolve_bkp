import React from 'react';
import { Star } from 'lucide-react';

const QUOTES = [
  {
    quote: 'The intake took ten minutes and a provider messaged me the next morning with questions before approving anything.',
    name: 'Danielle R.',
    context: 'Weight loss member',
  },
  {
    quote: 'Everything arrived in plain packaging and the follow-up check-in was actually scheduled, not just promised.',
    name: 'Marcus T.',
    context: 'Hair and skin member',
  },
  {
    quote: 'I appreciated being told what was compounded and what was FDA-approved instead of having to dig for it.',
    name: 'Priya S.',
    context: 'Wellness member',
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-sf-line bg-sf-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-[30px] tracking-tight sm:text-[38px]">What members say</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {QUOTES.map((item) => (
            <figure key={item.name} className="rounded-2xl border border-sf-line bg-sf-paper p-5">
              <div className="flex gap-0.5 text-sf-sun">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-[13px] leading-relaxed text-sf-ink">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-[12px] text-sf-muted">
                <span className="font-semibold text-sf-ink">{item.name}</span> · {item.context}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-sf-muted">
          Testimonials reflect individual experiences with our service and are not a guarantee of results.
          Clinical outcomes vary by patient, treatment, and adherence. Medication is only available if a
          licensed provider determines it is appropriate.
        </p>
      </div>
    </section>
  );
}