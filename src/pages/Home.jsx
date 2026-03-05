import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import HomeProductsTab from '@/components/home/HomeProductsTab';
import HomeProgramsTab from '@/components/home/HomeProgramsTab';

// Below-fold lazy
const TransformationStories = lazy(() => import('@/components/home/TransformationStories'));
const DifferenceSection     = lazy(() => import('@/components/home/DifferenceSection'));
const FAQSection            = lazy(() => import('@/components/home/FAQSection'));
const CTASection            = lazy(() => import('@/components/home/CTASection'));

function SectionSkeleton() {
  return <div className="w-full py-16" aria-hidden="true" />;
}

const tabs = [
  { id: 'products', label: '✦ Start Today', sub: 'Browse treatments' },
  { id: 'programs', label: '⬡ Programs', sub: 'Full care journeys' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen" style={{ background: '#F8F6F2' }}>
      {/* Hero */}
      <HeroSection />

      {/* Tab Switcher */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-[#E8E0D5] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-start px-6 py-4 text-left transition-colors group
                  ${activeTab === tab.id ? 'text-[#2D3A2D]' : 'text-[#5A6B5A] hover:text-[#2D3A2D]'}`}
              >
                <span className="text-sm font-bold">{tab.label}</span>
                <span className="text-xs text-[#7A8F7C]">{tab.sub}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D3A2D] rounded-t"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'products' ? <HomeProductsTab /> : <HomeProgramsTab />}
      </motion.div>

      {/* Below-fold shared sections */}
      <Suspense fallback={<SectionSkeleton />}>
        <TransformationStories />
        <DifferenceSection />
        <FAQSection />
        <CTASection />
      </Suspense>
    </div>
  );
}