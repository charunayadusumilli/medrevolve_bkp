import React from 'react';
import SEOHead from '@/components/SEOHead';
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
import PhoneCTA from '@/components/home/PhoneCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <SEOHead
        title="MedRevolve — GLP-1 Telehealth & Weight Loss Platform"
        description="Access physician-supervised GLP-1 programs, hormone therapy, and personalized telehealth — all from home. Licensed providers, compliant pharmacy."
      />
      {/* 1. Hero — rotating pillars, cinematic dark */}
      <HeroSection />

      {/* 1.5. Start Your Platform — prominent CTA with dynamic scroll */}
      <StartPlatformCTA />

      {/* 1.6. Phone CTA — direct call scheduling */}
      <PhoneCTA />

      {/* 2. Journey Selector — 5 distinct entry paths */}
      <JourneySelector />

      {/* 3. Brand Journey — MedRevolve's own story, built for ourselves first */}
      <BrandJourney />

      {/* 3. Pillars — Products, Telehealth, Services */}
      <PillarsSection />

      {/* 4. Education — MedRevolve University tracks */}
      <EducationHub />

      {/* 5. Services Workflow — interactive service explorer */}
      <ServicesWorkflow />

      {/* 6. Partnerships — pharmacies, providers, creators, B2B */}
      <PartnershipsSection />

      {/* 7. 30-Day Timeline */}
      <WorkflowTimeline />

      {/* 8. Marketing & Analytics — numbers that prove the model */}
      <MarketingSection />

      {/* 9. Social Proof & Final CTA */}
      <SocialProofStrip />
    </div>
  );
}