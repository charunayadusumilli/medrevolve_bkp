import React, { useEffect } from 'react';
import ReferralSection from '@/components/b2b/ReferralSection';
import ContactBand from '@/components/b2b/ContactBand';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function Partners() {
  useEffect(() => {
    applyStoreSeo({
      title: 'Partner referrals — MedRevolve',
      description:
        'Referred by a partner? Priority kickoff inside 3 business days, a named point of contact and a fixed-price audit before any hourly work begins.',
      path: '/partners',
    });
  }, []);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 md:pt-16">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Merchant services partners
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-[36px] leading-[1.08] tracking-tight sm:text-[48px]">
          Send your referred client here.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-site-greige">
          This page is the referral handoff. One form, one owner, and a fixed scope before billable work
          starts.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 md:pb-20">
        <ReferralSection />
      </div>

      <ContactBand />
    </>
  );
}