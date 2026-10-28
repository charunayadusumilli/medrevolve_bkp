import React from 'react';
import { Link } from 'react-router-dom';
import { STOREFRONT_CATEGORIES } from '@/lib/storefront/catalog';

const TILES = [
  { slug: 'weight-loss', label: 'Weight Care' },
  { slug: 'sexual-health', label: 'Sexual Health' },
  { slug: 'hair', label: 'Hair' },
  { slug: 'skin', label: 'Skin' },
  { slug: 'mental-health', label: 'Mental Health' },
  { slug: 'labs', label: 'Labs & Wellness' },
];

export default function ConsumerCategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Categories</p>
          <h2 className="mt-3 font-display text-[32px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
            Where would you like to start?
          </h2>
        </div>
        <Link to="/shop" className="hidden text-[13px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 sm:block">
          Shop all
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => {
          const meta = STOREFRONT_CATEGORIES.find((c) => c.slug === tile.slug);
          return (
            <Link
              key={tile.slug}
              to={`/shop/${tile.slug}`}
              className="group overflow-hidden rounded-xl border border-site-line bg-site-surface"
            >
              <div className="overflow-hidden">
                {meta?.image && (
                  <img
                    src={meta.image}
                    alt={tile.label}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[15px] font-semibold text-site-moss">{tile.label}</p>
                  <p className="mt-0.5 text-[12px] text-site-greige">{meta?.tagline}</p>
                </div>
                <span className="text-[12px] font-semibold text-site-rust">Shop</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}