import React from 'react';
import BookDemoLink from '@/components/BookDemoLink';

const PACKAGES = [
  {
    name: 'Launch',
    price: '$4,000',
    cadence: 'one-time platform launch fee',
    points: ['Branded storefront and intake', 'Provider roster setup', 'Pharmacy and catalog loading', 'Compliance disclosures and BAAs'],
  },
  {
    name: 'Full stack',
    price: 'Per written proposal',
    cadence: 'ongoing platform and clinical operations',
    points: ['Everything in Launch', 'Payments and subscription billing', 'Lifecycle messaging and support desk', 'Monthly operations reporting'],
    featured: true,
  },
  {
    name: 'Custom',
    price: 'Scoped',
    cadence: 'multi-brand or enterprise groups',
    points: ['Multiple storefronts', 'Custom integrations and CRM sync', 'Dedicated operations lead', 'Enterprise contracting'],
  },
];

export default function PartnerPackages() {
  return (
    <section id="packages" className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Packages</p>
        <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
          Clear scope, then a written proposal
        </h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`flex flex-col rounded-xl border p-6 ${
                pkg.featured ? 'border-site-moss bg-site-cream' : 'border-site-line bg-site-cream/60'
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">{pkg.name}</p>
              <p className="mt-3 font-display text-[30px] leading-none">{pkg.price}</p>
              <p className="mt-2 text-[11px] text-site-greige">{pkg.cadence}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {pkg.points.map((point) => (
                  <li key={point} className="text-[13px] leading-relaxed text-site-greige">{point}</li>
                ))}
              </ul>
              <BookDemoLink className="mt-6 inline-flex justify-center rounded-lg bg-site-moss px-4 py-2.5 text-[12px] font-semibold text-site-cream">
                Talk through {pkg.name}
              </BookDemoLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}