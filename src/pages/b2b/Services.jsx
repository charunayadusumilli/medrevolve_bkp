import React, { useEffect } from 'react';
import ServicesSection from '@/components/b2b/ServicesSection';
import ContactBand from '@/components/b2b/ContactBand';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function Services() {
  useEffect(() => {
    applyStoreSeo({
      title: 'Operator services and prices — MedRevolve',
      description:
        'Processing readiness audit, custom development, retainer, marketing engine, LegitScript buildout and platform setup — with prices listed in full.',
      path: '/services',
    });
  }, []);

  return (
    <>
      <ServicesSection />
      <ContactBand />
    </>
  );
}