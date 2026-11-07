import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { applyStoreSeo } from '@/lib/storefront/seo';
import ConsumerHero from '@/components/consumer/ConsumerHero';
import PriceProofStrip from '@/components/consumer/PriceProofStrip';
import LabVerifiedBand from '@/components/consumer/LabVerifiedBand';
import ProductShelf from '@/components/consumer/ProductShelf';
import WalkthroughSection from '@/components/consumer/walkthrough/WalkthroughSection';
import FirstWeekQuestions from '@/components/consumer/FirstWeekQuestions';
import ResearchLibrary from '@/components/consumer/ResearchLibrary';
import GuidelineCards from '@/components/consumer/GuidelineCards';
import ConsumerCategoryGrid from '@/components/consumer/ConsumerCategoryGrid';
import ConsumerTrustBand from '@/components/consumer/ConsumerTrustBand';
import { SAFETY_SLIDES, EFFICACY_SLIDES, DOSE_SLIDES } from '@/lib/consumer/education';

export default function ConsumerHome() {
  const location = useLocation();

  useEffect(() => {
    applyStoreSeo({
      title: 'MedRevolve — lab-verified telehealth, explained before you buy',
      description:
        'Clinician-prescribed care with a certificate of analysis, plain-English safety walkthroughs, dose schedules and the published research behind every product. Cash-pay pricing, delivered.',
      path: '/',
    });
  }, []);

  // Deep links like /#safety or /#research land on the right section.
  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <>
      <ConsumerHero />
      <PriceProofStrip />
      <LabVerifiedBand />
      <ProductShelf />

      <WalkthroughSection
        id="safety"
        eyebrow="Is it safe?"
        title="Safety, in the order it actually matters."
        intro="Five screens that answer the question people really have. What is in the vial, who should not take it, what to expect, how you are monitored, and what to do if something goes wrong."
        aside={{
          label: 'The short answer',
          body:
            'These are prescription medicines, not supplements. Safety comes from screening, correct titration and follow-up — which is why nothing here ships without a provider review.',
        }}
        slides={SAFETY_SLIDES}
      />

      <WalkthroughSection
        id="effectiveness"
        eyebrow="How effective, and for how long"
        title="What the trials show — and where it plateaus."
        intro="Real numbers from the named trials, the timeline people actually experience, and an honest answer about what happens when you stop."
        aside={{
          label: 'Read the fine print',
          body:
            'Trial results are means across hundreds of people. Yours will differ. What is consistent is that the dose, the adherence and the follow-up are what move the result.',
        }}
        slides={EFFICACY_SLIDES}
      />

      <WalkthroughSection
        id="dosing"
        eyebrow="How dosing works"
        title="Dosage, without the mystery."
        intro="Why you start low, what a dose is doing in your body, what to do about a missed week, and what maximum efficacy actually requires from you."
        aside={{
          label: 'Never guess a dose',
          body:
            'If you are unsure after a missed week, a side effect or a gap in supply, message your provider before the next injection. Guessing is how people get sick.',
        }}
        slides={DOSE_SLIDES}
      />

      <FirstWeekQuestions />
      <ResearchLibrary />
      <GuidelineCards />
      <ConsumerCategoryGrid />
      <ConsumerTrustBand />

      <section className="border-t border-site-line bg-site-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 md:py-24">
          <h2 className="mx-auto max-w-2xl font-display text-[32px] leading-tight tracking-tight text-site-moss sm:text-[44px]">
            Ten minutes now. A clinician's decision next.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-site-greige">
            Answer a short intake, get reviewed by a US-licensed provider, and — only if it's right for you —
            have treatment shipped discreetly with its lot certificate.
          </p>
          <Link
            to="/start"
            className="mt-8 inline-flex rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90"
          >
            Start your intake
          </Link>
          <p className="mt-4 text-[11px] text-site-greige">
            Prescription not guaranteed · Cash-pay pricing · US residents only
          </p>
        </div>
      </section>
    </>
  );
}