import React from 'react';
import { Link } from 'react-router-dom';
import ReferralSection from './ReferralSection';
import ServiceCards from './ServiceCards';
import { SERVICE_CATALOG, PRICE_NOTE } from '@/lib/partner/offerings';

/**
 * The B2B landing page's services block: every service as its own block of content,
 * with a ballpark amount and a link to that service's page.
 */
export default function ServicesLanding() {
  return (
    <section id="services" className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Services
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight sm:text-[40px]">
          {SERVICE_CATALOG.length} services. Ballpark on each, own page for the detail.
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-greige">
          Take one module or the whole stack. Every amount below is the real price, not a placeholder, and
          each service opens on its own page with what is included and the checkout.
        </p>

        <div className="mt-8">
          <ReferralSection />
        </div>

        <div className="mt-10">
          <ServiceCards services={SERVICE_CATALOG} />
        </div>

        <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-site-greige">{PRICE_NOTE}</p>

        <div className="mt-6 flex flex-wrap gap-5 text-[13px] font-semibold">
          <Link to="/services" className="text-site-rust underline decoration-site-line underline-offset-4 hover:decoration-site-rust">
            Full price list
          </Link>
          <Link to="/audit" className="text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss">
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