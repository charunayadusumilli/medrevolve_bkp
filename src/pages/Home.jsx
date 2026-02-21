import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/home/ServiceCategories';
import WellnessJourneySection from '@/components/home/WellnessJourneySection';
import ProgramsStrip from '@/components/home/ProgramsStrip';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import DifferenceSection from '@/components/home/DifferenceSection';
import TransformationStories from '@/components/home/TransformationStories';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import PartnerEcosystem from '@/components/home/PartnerEcosystem';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F6F2' }}>
      <HeroSection />
      <ServiceCategories />
      <WellnessJourneySection />
      <ProgramsStrip />
      <FeaturedProducts />
      <HowItWorks />
      <DifferenceSection />
      <TransformationStories />
      <PartnerEcosystem />
      <CTASection />
      <FAQSection />
    </div>
  );
}