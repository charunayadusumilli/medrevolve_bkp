import React, { useEffect } from 'react';
import { applyStoreSeo } from '@/lib/storefront/seo';
import RuoLeadHero from '@/components/b2b/RuoLeadHero';
import RuoSection from '@/components/b2b/RuoSection';
import ServicesSection from '@/components/b2b/ServicesSection';
import ProofPoints from '@/components/b2b/ProofPoints';
import ContactBand from '@/components/b2b/ContactBand';

export default function PartnerHome() {
  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — RUO bulk supply and telehealth operator services',
      description:
        'Research-use-only compounds with a certificate of analysis on every lot, plus the pricing for building and running a telehealth operation.',
      path: '/',
    });
  }, []);

  return (
    <>
      <RuoLeadHero />
      <RuoSection />
      <ServicesSection />
      <ProofPoints />
      <ContactBand />
    </>
  );
}