import React from 'react';
import LandingHero from '@/components/dtc/landing/LandingHero';
import JourneyCards from '@/components/dtc/landing/JourneyCards';
import ScienceFlow from '@/components/dtc/landing/ScienceFlow';
import FeaturedGrid from '@/components/dtc/landing/FeaturedGrid';
import DTCTrustStrip from '@/components/dtc/DTCTrustStrip';
import UGCSection from '@/components/dtc/UGCSection';
import DTCFAQ from '@/components/dtc/DTCFAQ';
import DTCFinalCTA from '@/components/dtc/DTCFinalCTA';

export default function DTCHome() {
  return (
    <div className="bg-white">
      <LandingHero />
      <DTCTrustStrip />
      <JourneyCards />
      <ScienceFlow />
      <FeaturedGrid />
      <UGCSection />
      <DTCFAQ />
      <DTCFinalCTA />
    </div>
  );
}