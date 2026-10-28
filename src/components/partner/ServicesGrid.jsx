import React from 'react';

const SERVICES = [
  { title: 'Clinical network', copy: 'Licensed providers per state, async review, video visits and prescribing.' },
  { title: 'Pharmacy fulfillment', copy: '503A and brand fulfillment with tracking and refill automation.' },
  { title: 'Branded storefront', copy: 'Mobile-first shop, intake and checkout on your domain.' },
  { title: 'Payments', copy: 'Card, wallet and subscription billing with dispute handling.' },
  { title: 'Compliance', copy: 'BAA, consent flows, LegitScript-ready copy and audit trails.' },
  { title: 'Growth ops', copy: 'Lifecycle messaging, WhatsApp support and retention reporting.' },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Services</p>
      <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
        Everything behind the storefront
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <div key={service.title} className="rounded-xl border border-site-line bg-site-surface p-6">
            <p className="text-[15px] font-semibold">{service.title}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{service.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}