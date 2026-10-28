import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
import { HERO_IMAGE } from '@/lib/storefront/catalog';

export default function StoreHero() {
  return (
    <section className="border-b border-sf-line bg-sf-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sf-line bg-sf-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sf-muted">
            <BadgeCheck className="h-3.5 w-3.5 text-sf-accent" />
            LegitScript certified telehealth
          </span>

          <h1 className="mt-6 font-display text-[42px] leading-[1.02] tracking-tight sm:text-[58px] lg:text-[64px]">
            Care that fits
            <br />
            <span className="text-sf-accent">your life.</span>
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-sf-muted">
            Weight, hormones, hair, skin and everyday wellness. Licensed US providers, licensed pharmacies,
            and cash-pay pricing that doesn't need insurance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/start"
              className="inline-flex items-center gap-2 rounded-full bg-sf-ink px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start your visit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-sf-ink px-6 py-3.5 text-sm font-semibold text-sf-ink transition-colors hover:bg-sf-ink hover:text-white"
            >
              Shop all products
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-sf-muted">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-sf-accent" /> FDA-approved options</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-sf-accent" /> Free shipping over $50</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-sf-accent" /> HIPAA-secure intake</span>
          </div>
        </div>

        <div className="relative">
          <img
            src={HERO_IMAGE}
            alt="Prescription care delivered"
            className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-[0_24px_60px_-30px_rgba(20,30,26,0.45)]"
          />
          <div className="absolute -bottom-5 left-5 rounded-2xl border border-sf-line bg-sf-surface/95 px-4 py-3 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sf-muted">Most requested</p>
            <p className="mt-1 text-[13px] font-semibold">GLP-1 weight loss</p>
            <p className="text-[12px] text-sf-muted">from $149/mo after approval</p>
          </div>
        </div>
      </div>
    </section>
  );
}