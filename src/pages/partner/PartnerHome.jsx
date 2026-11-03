import React, { useEffect } from 'react';
import { applyStoreSeo } from '@/lib/storefront/seo';
import PlatformHero from '@/components/b2b/PlatformHero';
import ServicesSection from '@/components/b2b/ServicesSection';
import ComplianceMonitoring from '@/components/b2b/ComplianceMonitoring';
import RuoSection from '@/components/b2b/RuoSection';
import ProofPoints from '@/components/b2b/ProofPoints';
import ContactBand from '@/components/b2b/ContactBand';

export default function PartnerHome() {
  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — build your RUO business on our platform',
      description:
        'Building a research-use-only business? We build the storefront, connected supply, providers, payments and compliant checkout, and we scan your site to keep it compliant. Every module priced on the page.',
      path: '/',
    });
  }, []);

  return (
    <>
      <PlatformHero />
      <ServicesSection />
      <ComplianceMonitoring />
      <RuoSection />
      <ProofPoints />
      <ContactBand />
    </>
  );
}