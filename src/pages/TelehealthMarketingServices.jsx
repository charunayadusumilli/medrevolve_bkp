import React from 'react';
import MarketingSeo from '@/components/b2b/marketing/MarketingSeo';
import MarketingHero from '@/components/b2b/marketing/MarketingHero';
import MarketingChannels from '@/components/b2b/marketing/MarketingChannels';
import MarketingWhy from '@/components/b2b/marketing/MarketingWhy';
import MarketingProcess from '@/components/b2b/marketing/MarketingProcess';
import MarketingAudiences from '@/components/b2b/marketing/MarketingAudiences';
import MarketingPricing from '@/components/b2b/marketing/MarketingPricing';
import MarketingFaq from '@/components/b2b/marketing/MarketingFaq';
import MarketingCta from '@/components/b2b/marketing/MarketingCta';

/** Public marketing services page at /marketing (medrevolveb2b.com). */
export default function TelehealthMarketingServices() {
  return (
    <>
      <MarketingSeo />
      <MarketingHero />
      <MarketingChannels />
      <MarketingWhy />
      <MarketingProcess />
      <MarketingAudiences />
      <MarketingPricing />
      <MarketingFaq />
      <MarketingCta />
    </>
  );
}