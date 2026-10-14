import React from 'react';
import SEOHead from '@/components/SEOHead';
import PlatformHero from '@/components/home/b2b/PlatformHero';
import WhatWeRun from '@/components/home/b2b/WhatWeRun';
import BuiltFor from '@/components/home/b2b/BuiltFor';
import WhyOperators from '@/components/home/b2b/WhyOperators';
import PlatformCTABand from '@/components/home/b2b/PlatformCTABand';

export default function Home() {
  return (
    <div className="bg-[#F7F4ED]">
      <SEOHead
        title="The White-Label Telehealth Platform | MedRevolve"
        description="MedRevolve builds and operates complete white-label telehealth infrastructure: AI-powered intake, a licensed 50-state clinician network, payment processing built for healthcare, pharmacy fulfillment, a unified CRM, and real-time compliance monitoring — live in 7 days."
      />
      <PlatformHero />
      <WhatWeRun />
      <BuiltFor />
      <WhyOperators />
      <PlatformCTABand />
    </div>
  );
}