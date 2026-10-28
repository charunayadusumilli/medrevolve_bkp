import React, { useEffect } from 'react';
import StoreHero from '@/components/storefront/StoreHero';
import CategoryTiles from '@/components/storefront/CategoryTiles';
import BestSellers from '@/components/storefront/BestSellers';
import FdaStrip from '@/components/storefront/FdaStrip';
import HowItWorksSteps from '@/components/storefront/HowItWorksSteps';
import TrustBar from '@/components/storefront/TrustBar';
import Testimonials from '@/components/storefront/Testimonials';
import ToolsStrip from '@/components/storefront/ToolsStrip';
import BusinessBanner from '@/components/storefront/BusinessBanner';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function StoreHome() {
  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — Prescription care, delivered | Weight loss, hair, skin & wellness',
      description:
        'Licensed-provider telehealth for weight loss, sexual health, hair, skin, testosterone and daily wellness. FDA-approved options, cash-pay pricing, free shipping over $50.',
      path: '/',
    });
  }, []);

  return (
    <>
      <StoreHero />
      <CategoryTiles />
      <BestSellers />
      <FdaStrip />
      <HowItWorksSteps />
      <TrustBar />
      <Testimonials />
      <ToolsStrip />
      <BusinessBanner />
    </>
  );
}