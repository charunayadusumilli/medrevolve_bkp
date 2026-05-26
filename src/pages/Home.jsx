import React from 'react';
import SEOHead from '@/components/SEOHead';
import { detectDomain } from '@/lib/domainConfig';

// B2C — Patient-facing components
import B2CHeroSection from '@/components/home/B2CHeroSection';
import B2CProgramsSection from '@/components/home/B2CProgramsSection';
import B2CJourneySection from '@/components/home/B2CJourneySection';
import B2CSocialProof from '@/components/home/B2CSocialProof';
import PhoneCTA from '@/components/home/PhoneCTA';

// B2B / DEV — Merchant-facing components
import HeroSection from '@/components/home/HeroSection';
import StartPlatformCTA from '@/components/home/StartPlatformCTA';
import JourneySelector from '@/components/home/JourneySelector';
import BrandJourney from '@/components/home/BrandJourney';
import PillarsSection from '@/components/home/PillarsSection';
import EducationHub from '@/components/home/EducationHub';
import ServicesWorkflow from '@/components/home/ServicesWorkflow';
import PartnershipsSection from '@/components/home/PartnershipsSection';
import WorkflowTimeline from '@/components/home/WorkflowTimeline';
import MarketingSection from '@/components/home/MarketingSection';
import SocialProofStrip from '@/components/home/SocialProofStrip';

export default function Home() {
  const domain = detectDomain();
  const isB2C = domain === 'B2C';

  // ── B2C: medrevolve.com — Patient-facing telehealth consumer platform ─────
  if (isB2C) {
    return (
      <div className="min-h-screen bg-[#060606]">
        <SEOHead
          title="MedRevolve — Physician-Supervised GLP-1, Hormone & Wellness Programs"
          description="Connect with a licensed physician online. Get evaluated, receive your prescription, and have it delivered to your door. GLP-1, TRT, BHRT & wellness programs."
        />

        {/* 1. Hero — Patient-focused, Hims/RO style */}
        <B2CHeroSection />

        {/* 2. Programs — GLP-1, Men's Health, Women's Wellness, Longevity */}
        <B2CProgramsSection />

        {/* 3. How It Works — Consult → Rx → Delivery journey */}
        <B2CJourneySection />

        {/* 4. Social Proof — Patient testimonials + trust badges */}
        <B2CSocialProof />

        {/* 5. Call CTA */}
        <PhoneCTA />
      </div>
    );
  }

  // ── B2B / DEV / Default — Merchant-facing platform ───────────────────────
  return (
    <div className="min-h-screen bg-[#080808]">
      <SEOHead
        title="MedRevolve — White-Label Telehealth & GLP-1 Platform for Wellness Merchants"
        description="Launch a compliant GLP-1 telehealth, RUO, or wellness business. Full platform: website, providers, pharmacy, compliance, and payments — under your brand."
      />

      {/* 1. Hero — B2B merchant-focused */}
      <HeroSection />

      {/* 2. Start Platform CTA */}
      <StartPlatformCTA />

      {/* 3. Phone CTA */}
      <PhoneCTA />

      {/* 4. Journey Selector — 5 merchant/partner paths */}
      <JourneySelector />

      {/* 5. Brand Journey — MedRevolve's story */}
      <BrandJourney />

      {/* 6. Pillars */}
      <PillarsSection />

      {/* 7. Education Hub */}
      <EducationHub />

      {/* 8. Services Workflow */}
      <ServicesWorkflow />

      {/* 9. Partnerships */}
      <PartnershipsSection />

      {/* 10. 7-Day Timeline */}
      <WorkflowTimeline />

      {/* 11. Marketing & Analytics */}
      <MarketingSection />

      {/* 12. Social Proof & Final CTA */}
      <SocialProofStrip />
    </div>
  );
}