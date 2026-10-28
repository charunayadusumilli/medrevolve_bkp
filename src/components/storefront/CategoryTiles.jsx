import React from 'react';
import { Link } from 'react-router-dom';
import { money, isPrescription, STOREFRONT_CATEGORIES } from '@/lib/storefront/catalog';

/** Price a shopper actually pays first — subscription for Rx, one-time for direct purchase. */
function displayAmount(product) {
  return isPrescription(product) ? product.subscription_price ?? product.price : product.price;
}

function statFor(products, slug) {
  const list = products.filter((p) => p.category === slug);
  if (list.length === 0) return null;
  const cheapest = list.reduce((a, b) => (displayAmount(b) < displayAmount(a) ? b : a));
  return {
    count: list.length,
    amount: displayAmount(cheapest),
    unit: isPrescription(cheapest) ? '/mo' : ' one-time',
  };
}

export default function CategoryTiles({ products }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-[30px] tracking-tight sm:text-[38px]">Start with a goal</h2>
        <Link to="/shop" className="text-[13px] font-semibold text-sf-accent hover:underline">
          Shop all treatments
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STOREFRONT_CATEGORIES.map((category) => {
          const stat = products ? statFor(products, category.slug) : null;
          return (
            <Link
              key={category.slug}
              to={`/shop/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-sf-line bg-sf-surface"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sf-ink/90 via-sf-ink/35 to-transparent p-4 pt-14">
                <p className="text-[15px] font-semibold text-white">{category.label}</p>
                <p className="mt-0.5 text-[11px] text-white/75">
                  {stat ? (
                    <>
                      {stat.count} product{stat.count === 1 ? '' : 's'} · from {money(stat.amount)}
                      {stat.unit}
                    </>
                  ) : (
                    category.tagline
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}