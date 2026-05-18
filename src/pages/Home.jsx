import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PillarsSection from '@/components/home/PillarsSection';
import ServicesWorkflow from '@/components/home/ServicesWorkflow';
import WorkflowTimeline from '@/components/home/WorkflowTimeline';
import SocialProofStrip from '@/components/home/SocialProofStrip';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <HeroSection />
      <PillarsSection />
      <ServicesWorkflow />
      <WorkflowTimeline />
      <SocialProofStrip />
    </div>
  );
}