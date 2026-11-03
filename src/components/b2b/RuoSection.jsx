import React from 'react';
import RuoCategories from './RuoCategories';
import VolumeLadder from './VolumeLadder';
import DocumentationPanel from './DocumentationPanel';
import ShippingPanel from './ShippingPanel';
import CatalogPackRequest from './CatalogPackRequest';
import { RUO_CATALOG_URL, RUO_DISCLAIMER } from '@/lib/partner/offerings';

export default function RuoSection() {
  return (
    <section id="ruo" className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Research use only
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight sm:text-[40px]">
          Bulk compounds for licensed laboratories.
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-greige">
          Four catalog categories, one documentation standard. Everything below is supplied for laboratory
          research, not for human use.
        </p>

        <div className="mt-8">
          <RuoCategories />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Volume pricing</p>
            <h3 className="mt-3 font-display text-[24px] leading-tight text-site-moss">
              Discounts start at 5 vials.
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-site-greige">
              Applied per order, per compound. Bulk quotes above 25 vials are handled directly.
            </p>
            <div className="mt-5">
              <VolumeLadder />
            </div>
          </div>
          <DocumentationPanel />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ShippingPanel />
          <CatalogPackRequest />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-site-line pt-8">
          <a
            href={RUO_CATALOG_URL}
            className="rounded-lg bg-site-rust px-6 py-3 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90"
          >
            View the RUO catalog
          </a>
          <p className="max-w-xl text-[11px] leading-relaxed text-site-greige">{RUO_DISCLAIMER}</p>
        </div>
      </div>
    </section>
  );
}