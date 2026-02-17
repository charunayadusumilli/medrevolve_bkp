import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/home/ServiceCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import DifferenceSection from '@/components/home/DifferenceSection';
import ResultsSection from '@/components/home/ResultsSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import PersonalizedRecommendations from '@/components/recommendations/PersonalizedRecommendations';
import PartnerEcosystem from '@/components/home/PartnerEcosystem';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <HeroSection />
      <ServiceCategories />
      <PersonalizedRecommendations title="Personalized Just For You" />
      <FeaturedProducts />
      <HowItWorks />
      <DifferenceSection />
      <ResultsSection />
      {/* Ecosystem section — replaces top-nav clutter for creators/business/partners */}
      <PartnerEcosystem />
      <CTASection />
      <FAQSection />
    </div>
  );
}