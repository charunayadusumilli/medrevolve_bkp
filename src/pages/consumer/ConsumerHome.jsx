import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applyStoreSeo } from '@/lib/storefront/seo';
import ConsumerHero from '@/components/consumer/ConsumerHero';
import PriceProofStrip from '@/components/consumer/PriceProofStrip';
import ConsumerCategoryGrid from '@/components/consumer/ConsumerCategoryGrid';
import ConsumerBestSellers from '@/components/consumer/ConsumerBestSellers';
import ConsumerTrustBand from '@/components/consumer/ConsumerTrustBand';
import ConsumerToolsBand from '@/components/consumer/ConsumerToolsBand';

export default function ConsumerHome() {
  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — care that fits your life',
      description:
        'Licensed providers, real prescriptions, delivered. Weight care, hormone health, skin, hair, mental health and labs with transparent cash-pay pricing.',
      path: '/',
    });
  }, []);

  return (
    <>
      <ConsumerHero />
      <PriceProofStrip />
      <ConsumerCategoryGrid />
      <ConsumerBestSellers />
      <ConsumerTrustBand />
      <ConsumerToolsBand />
      <section className="border-t border-site-line bg-site-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 md:py-24">
          <h2 className="mx-auto max-w-xl font-display text-[32px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
            Ten minutes now. A provider review next.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-site-greige">
            Answer a short intake, meet your provider by message or video, and get treatment shipped
            discreetly if it's right for you.
          </p>
          <Link
            to="/start"
            className="mt-8 inline-flex rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90"
          >
            Start your intake
          </Link>
        </div>
      </section>
    </>
  );
}