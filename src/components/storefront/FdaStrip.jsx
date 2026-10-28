import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { money } from '@/lib/storefront/catalog';

// Fixed order requested for the FDA-approved treatments strip.
const FEATURED_SLUGS = ['wegovy', 'zepbound', 'ozempic', 'mounjaro'];

export default function FdaStrip({ products }) {
  if (products === null) return <div className="h-56 animate-pulse bg-sf-surface" />;

  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const featured = FEATURED_SLUGS.map((slug) => bySlug[slug]).filter(Boolean);
  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Same molecule, licensed pharmacies</p>
          <h2 className="mt-2 font-display text-[30px] tracking-tight sm:text-[38px]">FDA-approved treatments</h2>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-sf-muted">
            Brand-name options dispensed by licensed US pharmacies. Pricing shown is the cash-pay monthly
            rate after a licensed provider approves your treatment.
          </p>
        </div>
        <Link to="/shop/weight-loss" className="text-[13px] font-semibold text-sf-accent hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <article
            key={product.id}
            className="flex flex-col rounded-2xl border border-sf-line bg-sf-surface p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  to={`/product/${product.slug}`}
                  className="text-[14px] font-semibold leading-snug hover:underline"
                >
                  {product.display_name}
                </Link>
                <p className="mt-0.5 text-[11px] text-sf-muted">{product.generic_name}</p>
                {product.brand_name && (
                  <p className="mt-0.5 text-[11px] text-sf-muted">{product.brand_name}</p>
                )}
              </div>
              <Link to={`/product/${product.slug}`} aria-label={`View ${product.display_name}`}>
                <ArrowUpRight className="h-4 w-4 text-sf-muted" />
              </Link>
            </div>

            <div className="mt-auto pt-4">
              <p className="text-[15px] font-semibold">
                Starting at {money(product.subscription_price ?? product.price)}/mo
              </p>
              {product.compare_at_price > product.price && (
                <p className="text-[11px] text-sf-muted line-through">{money(product.compare_at_price)}</p>
              )}
              <p className="mt-1 text-[11px] text-sf-muted">after provider approval</p>
              <a
                href={`/product/${product.slug}#safety`}
                className="mt-3 inline-block text-[11px] font-semibold text-sf-accent underline"
              >
                Important safety information
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}