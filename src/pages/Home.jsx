import React from 'react';
import SEOHead from '@/components/SEOHead';
import LaunchHome from '@/components/home/launch/LaunchHome';

// Previous homepage sections (PlatformHero, WhatWeRun, BuiltFor, WhyOperators, PlatformCTABand)
// still live in src/components/home/b2b and can be restored from the checkpoint
// "Before homepage redesign (7-day launch site)".
export default function Home() {
  return (
    <>
      <SEOHead
        title="Launch Your Own Telehealth Brand in About 7 Days | MedRevolve"
        description="White-label telehealth for clinics, med spas and pharmacies: your branded site, licensed providers, 503A pharmacy, healthcare-ready payments and ongoing compliance, live in about 7 days. $4,000 launch with all 14 items listed."
        ogImage="https://medrevolve.com/social/01-launch-in-7-days.png"
      />
      <LaunchHome />
    </>
  );
}
