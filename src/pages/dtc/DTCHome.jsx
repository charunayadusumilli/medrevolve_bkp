import React from 'react';
import DTCHero from '@/components/dtc/DTCHero';
import DTCProductCategories from '@/components/dtc/DTCProductCategories';
import DTCHowItWorks from '@/components/dtc/DTCHowItWorks';
import DTCTrustStrip from '@/components/dtc/DTCTrustStrip';
import DTCPricing from '@/components/dtc/DTCPricing';
import DTCTestimonials from '@/components/dtc/DTCTestimonials';
import DTCFAQ from '@/components/dtc/DTCFAQ';
import DTCFinalCTA from '@/components/dtc/DTCFinalCTA';

export default function DTCHome() {
  return (
    <div className="bg-white">
      <DTCHero />
      <DTCTrustStrip />
      <DTCProductCategories />
      <DTCHowItWorks />
      <DTCPricing />
      <DTCTestimonials />
      <DTCFAQ />
      <DTCFinalCTA />
    </div>
  );
}