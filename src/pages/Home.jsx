import React, { lazy, Suspense } from 'react';
// Above-the-fold sections — loaded eagerly for fast LCP
import HeroSection from '@/components/home/HeroSection';

// Below-the-fold — eager-loaded but after main paint
import VideoAdStrip from '@/components/home/VideoAdStrip';
import ServiceCategories from '@/components/home/ServiceCategories';

// Below-the-fold sections — lazy-loaded to reduce initial JS parse time
const WellnessJourneySection = lazy(() => import('@/components/home/WellnessJourneySection'));
const ProgramsStrip         = lazy(() => import('@/components/home/ProgramsStrip'));
const FeaturedProducts      = lazy(() => import('@/components/home/FeaturedProducts'));
const HowItWorks            = lazy(() => import('@/components/home/HowItWorks'));
const DifferenceSection     = lazy(() => import('@/components/home/DifferenceSection'));
const TransformationStories = lazy(() => import('@/components/home/TransformationStories'));
const PartnerEcosystem      = lazy(() => import('@/components/home/PartnerEcosystem'));
const CTASection            = lazy(() => import('@/components/home/CTASection'));
const FAQSection            = lazy(() => import('@/components/home/FAQSection'));

// Minimal placeholder keeps layout stable while lazy chunks load
function SectionSkeleton() {
  return <div className="w-full py-16" aria-hidden="true" />;
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F6F2' }}>
      {/* Above fold */}
      <HeroSection />
      <VideoAdStrip />
      <ServiceCategories />

      {/* Lazy: below the fold */}
      <Suspense fallback={<SectionSkeleton />}>
        <WellnessJourneySection />
        <ProgramsStrip />
        <FeaturedProducts />
        <HowItWorks />
        <DifferenceSection />
        <TransformationStories />
        <PartnerEcosystem />
        <CTASection />
        <FAQSection />
      </Suspense>
    </div>
  );
}