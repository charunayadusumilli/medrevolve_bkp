import React from 'react';
import { Link } from 'react-router-dom';
import ReferralSection from './ReferralSection';
import ServicePriceTable from './ServicePriceTable';
import { PARTNER_SERVICES, PLATFORM_SERVICES, PRICE_NOTE } from '@/lib/partner/offerings';

export default function ServicesSection() {
  return (
    <section id="services" className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          For operators
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight sm:text-[40px]">
          What we build for operators
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-greige">
          Fixed prices, listed in full. No sales-gated pricing tiers and no add-ons that only appear on a call.
        </p>

        <div className="mt-8">
          <ReferralSection />
        </div>

        <div className="mt-12 space-y-10">
          <ServicePriceTable label="Partner-referred services" rows={PARTNER_SERVICES} />
          <ServicePriceTable label="Platform services" rows={PLATFORM_SERVICES} />
        </div>

        <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-site-greige">{PRICE_NOTE}</p>

        <div className="mt-6 flex flex-wrap gap-5 text-[13px] font-semibold">
          <Link to="/audit" className="text-site-rust underline decoration-site-line underline-offset-4 hover:decoration-site-rust">
            What the $500 audit covers
          </Link>
          <Link to="/partners" className="text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss">
            Partner referral form
          </Link>
        </div>
      </div>
    </section>
  );
}