import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import StoreHero from '@/components/storefront/StoreHero';
import CategoryTiles from '@/components/storefront/CategoryTiles';
import BestSellers from '@/components/storefront/BestSellers';
import FdaStrip from '@/components/storefront/FdaStrip';
import CompoundedSection from '@/components/storefront/CompoundedSection';
import ToolsStrip from '@/components/storefront/ToolsStrip';
import Testimonials from '@/components/storefront/Testimonials';
import StoreFaq from '@/components/storefront/StoreFaq';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function StoreHome() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — Care that fits your life | Weight loss, hair, skin & wellness',
      description:
        'Licensed-provider telehealth for weight loss, sexual health, hair, skin, testosterone and daily wellness. FDA-approved options, transparent cash-pay pricing, free shipping over $50.',
      path: '/',
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    base44.entities.StorefrontProduct
      .filter({}, { limit: 200, sort: 'price' })
      .then((page) => { if (!cancelled) setProducts(page.items || []); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <StoreHero />
      <CategoryTiles products={products} />
      <BestSellers products={products} />
      <FdaStrip products={products} />
      <CompoundedSection products={products} />
      <ToolsStrip />
      <Testimonials />
      <StoreFaq />
    </>
  );
}