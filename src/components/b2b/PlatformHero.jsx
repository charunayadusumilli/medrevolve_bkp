import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MODULES = [
  'Storefront & domain',
  'Payments & processing',
  'Compliance & LegitScript',
  'Provider network',
  'Pharmacy network',
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
          RUO B2B onboarding
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-[36px] leading-[1.06] tracking-tight sm:text-[56px]">
          The platform RUO sellers launch on.
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">
          MedRevolve builds and runs the stack you would otherwise assemble yourself: storefront, licensed
          providers, pharmacy routing, compliance, inventory and card processing, all under your brand. You
          bring the buyers. We run the rails.
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
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity hover:opacity-90"
          >
            See modules &amp; pricing <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 rounded-lg border border-site-cream/30 px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-colors hover:bg-site-cream/10"
          >
            Start onboarding
          </Link>
        </div>

        <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-site-cream/45">
          Research-use-only buyers are onboarded under a research-use agreement and must be 21 or older. Every
          module is sold as a standalone service or as the full bundle.
        </p>
      </div>
    </section>
  );
}