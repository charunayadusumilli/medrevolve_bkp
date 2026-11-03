import React, { useEffect } from 'react';
import RuoLeadHero from '@/components/b2b/RuoLeadHero';
import RuoSection from '@/components/b2b/RuoSection';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function RuoOverview() {
  useEffect(() => {
    applyStoreSeo({
      title: 'RUO bulk supply — MedRevolve',
      description:
        'Research-use-only compounds for licensed laboratories. Certificate of analysis on every lot. Volume pricing from 5 vials. 21+ only.',
      path: '/ruo',
    });
  }, []);

  return (
    <>
      <RuoLeadHero />
      <RuoSection />
    </>
  );
}