import React, { useEffect } from 'react';
import { applyStoreSeo } from '@/lib/storefront/seo';
import PlatformHero from '@/components/b2b/PlatformHero';
import ServicesSection from '@/components/b2b/ServicesSection';
import RuoSection from '@/components/b2b/RuoSection';
import ProofPoints from '@/components/b2b/ProofPoints';
import ContactBand from '@/components/b2b/ContactBand';

export default function PartnerHome() {
  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — the platform RUO B2B sellers launch on',
      description:
        'Onboard your research-use-only operation onto MedRevolve: storefront, payments, compliance, provider and pharmacy networks, inventory and marketing, under your own brand. Every module priced on the page.',
      path: '/',
    });
  }, []);

  return (
    <>
      <PlatformHero />
      <ServicesSection />
      <RuoSection />
      <ProofPoints />
      <ContactBand />
    </>
  );
}