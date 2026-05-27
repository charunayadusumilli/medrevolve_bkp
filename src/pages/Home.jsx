import React from 'react';
import SEOHead from '@/components/SEOHead';

// Unified platform components — same experience on medrevolve.com and medrevolveb2b.com
import B2CHeroSection from '@/components/home/B2CHeroSection';
import B2CProgramsSection from '@/components/home/B2CProgramsSection';
import B2CJourneySection from '@/components/home/B2CJourneySection';
import B2CSocialProof from '@/components/home/B2CSocialProof';
import PhoneCTA from '@/components/home/PhoneCTA';
import StartPlatformCTA from '@/components/home/StartPlatformCTA';
import ServicesWorkflow from '@/components/home/ServicesWorkflow';
import SocialProofStrip from '@/components/home/SocialProofStrip';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060606]">
      <SEOHead
        title="MedRevolve — Physician-Supervised Telehealth | GLP-1, Hormone & Wellness Programs"
        description="Access physician-supervised telehealth from home. Licensed providers, licensed 503A pharmacies. GLP-1 weight management, hormone therapy, and personalized wellness — all 50 states."
      />

      {/* 1. Hero */}
      <B2CHeroSection />

      {/* 2. Clinical Programs */}
      <B2CProgramsSection />

      {/* 3. How It Works */}
      <B2CJourneySection />

      {/* 4. Platform CTA — for business operators & partners */}
      <StartPlatformCTA />

      {/* 5. Full-Service Workflow */}
      <ServicesWorkflow />

      {/* 6. Social Proof */}
      <B2CSocialProof />

      {/* 7. Call CTA */}
      <PhoneCTA />

      {/* 8. Final strip */}
      <SocialProofStrip />
    </div>
  );
}