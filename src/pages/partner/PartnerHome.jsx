import React, { useEffect } from 'react';
import BookDemoLink from '@/components/BookDemoLink';
import { applyStoreSeo } from '@/lib/storefront/seo';
import OperatorTypes from '@/components/partner/OperatorTypes';
import SevenDayWalkthrough from '@/components/partner/SevenDayWalkthrough';
import BrandPreviewWidget from '@/components/partner/BrandPreviewWidget';
import ServicesGrid from '@/components/partner/ServicesGrid';
import PartnerPackages from '@/components/partner/PartnerPackages';
import CaseStudy from '@/components/partner/CaseStudy';
import VideoGrid from '@/components/partner/VideoGrid';

export default function PartnerHome() {
  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — white-label telehealth infrastructure',
      description:
        'Your brand. Our rails. Live in about 7 days. Clinical network, pharmacy fulfillment, compliance and payments for med spas, wellness clinics and first-time telehealth operators.',
      path: '/',
    });
  }, []);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 md:pb-24 md:pt-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">
          White-label telehealth infrastructure
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[40px] leading-[1.06] tracking-tight sm:text-[58px]">
          Your brand. Our rails. Live in about 7 days.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-site-greige">
          We run the clinical network, pharmacy fulfillment, compliance and payments. You keep the brand,
          the patient relationship and the margin.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookDemoLink className="rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90">
            Book a demo
          </BookDemoLink>
          <a
            href="#platform"
            className="text-[14px] font-semibold underline decoration-site-line decoration-1 underline-offset-4 hover:decoration-site-rust"
          >
            See the 7-day plan
          </a>
        </div>
      </section>

      <OperatorTypes />
      <SevenDayWalkthrough />
      <BrandPreviewWidget />
      <ServicesGrid />
      <PartnerPackages />
      <CaseStudy />
      <VideoGrid />

      <section className="border-t border-site-line bg-site-moss text-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 md:py-24">
          <h2 className="mx-auto max-w-xl font-display text-[32px] leading-tight tracking-tight sm:text-[42px]">
            Twenty minutes is enough to know if this fits.
          </h2>
          <BookDemoLink className="mt-8 inline-flex rounded-lg bg-site-cream px-6 py-3.5 text-[14px] font-semibold text-site-moss">
            Book a demo
          </BookDemoLink>
        </div>
      </section>
    </>
  );
}