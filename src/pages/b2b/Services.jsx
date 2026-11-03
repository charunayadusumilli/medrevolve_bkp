import React, { useEffect } from 'react';
import ServicesHero from '@/components/b2b/ServicesHero';
import ServicePricingRows from '@/components/b2b/ServicePricingRows';
import ServiceDetailBlock from '@/components/b2b/ServiceDetailBlock';
import ServicesCloseOut from '@/components/b2b/ServicesCloseOut';
import ContactBand from '@/components/b2b/ContactBand';
import { SERVICES_PAGE_GROUPS, SERVICES_PAGE_CATALOG } from '@/lib/partner/servicesPage';
import { PRICE_NOTE } from '@/lib/partner/offerings';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function Services() {
  useEffect(() => {
    applyStoreSeo({
      title: 'Operator services and prices — MedRevolve',
      description:
        'Every operator service, priced in full: processing readiness audit $500, custom development $95/hour, development retainer $3,420/month, marketing engine, LegitScript buildout, pharmacy and payment integration, LLC formation and the full platform bundle.',
      path: '/services',
    });
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <ServicesHero />

      <section className="bg-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <div className="space-y-10">
            {SERVICES_PAGE_GROUPS.map((group) => (
              <ServicePricingRows key={group.label} label={group.label} services={group.services} />
            ))}
          </div>

          <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-site-greige">{PRICE_NOTE}</p>
        </div>
      </section>

      <section className="border-t border-site-line bg-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
            Service detail
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[38px]">
            What each one actually includes.
          </h2>

          <div className="mt-8 space-y-6">
            {SERVICES_PAGE_CATALOG.map((service) => (
              <ServiceDetailBlock key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <ServicesCloseOut />
      <ContactBand />
    </>
  );
}