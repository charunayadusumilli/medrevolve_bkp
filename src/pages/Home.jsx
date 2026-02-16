import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Leaf, Shield, Users, Building2, Sparkles } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/home/ServiceCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import DifferenceSection from '@/components/home/DifferenceSection';
import ResultsSection from '@/components/home/ResultsSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import PersonalizedRecommendations from '@/components/recommendations/PersonalizedRecommendations';

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
      <CTASection />
      <FAQSection />
    </div>
  );
}