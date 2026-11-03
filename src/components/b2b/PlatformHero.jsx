import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MODULES = [
  'Storefront & domain',
  'Payments & processing',
  'Compliance scanning',
  'Provider network',
  'Pharmacy & supply',
  'Inventory',
  'Product catalog',
  'Marketing & CRM',
  'LLC formation',
  'Analytics',
];

export default function PlatformHero() {
  return (
    <section className="bg-site-moss text-site-cream">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Research use only · B2B
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-[36px] leading-[1.06] tracking-tight sm:text-[56px]">
          Building an RUO business? We build it with you.
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">
          Come to us with the research-use-only business you want to launch. We are the starting point: we
          build the storefront, the research-use-only product pages and compliant checkout, connect supply,
          providers and processing, run your marketing, and scan your site so it stays compliant. You bring
          the buyers.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {MODULES.map((module) => (
            <li
              key={module}
              className="rounded-full border border-site-cream/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-site-cream/75"
            >
              {module}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity hover:opacity-90"
          >
            Start with the $500 audit <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-lg border border-site-cream/30 px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-colors hover:bg-site-cream/10"
          >
            What we build
          </a>
        </div>

        <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-site-cream/45">
          Research-use-only clients are onboarded under a research-use agreement and must be 21 or older. Every
          module is sold as a standalone service or as the full bundle.
        </p>
      </div>
    </section>
  );
}