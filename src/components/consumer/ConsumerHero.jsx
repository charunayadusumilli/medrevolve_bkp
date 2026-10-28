import React from 'react';
import { Link } from 'react-router-dom';

const HERO_STILL_LIFE =
  'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/1914d2eb2_generated_image.png';

export default function ConsumerHero() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 md:pb-24 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">
            Telehealth, done properly
          </p>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tight text-site-moss sm:text-[58px]">
            Care that fits your life.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-site-greige">
            Licensed providers. Real prescriptions. Delivered.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/start"
              className="rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90"
            >
              Start your intake
            </Link>
            <Link
              to="/shop"
              className="text-[14px] font-semibold text-site-moss underline decoration-site-line decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-site-rust"
            >
              Browse the shop
            </Link>
          </div>
          <p className="mt-6 text-[12px] text-site-greige">
            No insurance required. Free shipping over $99.
          </p>
        </div>

        <div className="relative">
          <img
            src={HERO_STILL_LIFE}
            alt="MedRevolve prescription bottle on a cream linen surface"
            className="aspect-[4/5] w-full rounded-xl object-cover shadow-[0_18px_50px_-30px_rgba(31,45,39,0.5)]"
          />
        </div>
      </div>
    </section>
  );
}