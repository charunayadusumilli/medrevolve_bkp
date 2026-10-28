import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { money, isCompounded, isPrescription } from '@/lib/storefront/catalog';

export default function CompoundedSection({ products }) {
  if (products === null) return <div className="h-56 animate-pulse bg-sf-paper" />;

  const compounded = products.filter(isCompounded);
  if (compounded.length === 0) return null;

  return (
    <section className="border-y border-sf-line bg-sf-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Prepared by 503A pharmacies</p>
            <h2 className="mt-2 font-display text-[30px] tracking-tight sm:text-[38px]">Compounded treatments</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-sf-muted">
              Compounded medications are prepared by state-licensed 503A pharmacies and are not FDA-approved.
              They are not reviewed by the FDA for safety, effectiveness, or quality. A licensed provider
              decides whether a compounded option is appropriate for you.
            </p>
          </div>
          <Link to="/shop" className="text-[13px] font-semibold text-sf-accent hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {compounded.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group flex flex-col rounded-2xl border border-sf-line bg-sf-surface p-4 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(20,30,26,0.5)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-semibold leading-snug">{product.display_name}</p>
                  {product.generic_name && (
                    <p className="mt-0.5 text-[11px] text-sf-muted">{product.generic_name}</p>
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 text-sf-muted transition-transform group-hover:-translate-y-0.5" />
              </div>

              <div className="mt-auto pt-4">
                <p className="text-[15px] font-semibold">
                  {isPrescription(product) ? 'Starting at ' : ''}
                  {money(isPrescription(product) ? product.subscription_price ?? product.price : product.price)}
                  {isPrescription(product) ? '/mo' : ' one-time'}
                </p>
                {product.compare_at_price > product.price && (
                  <p className="text-[11px] text-sf-muted line-through">{money(product.compare_at_price)}</p>
                )}
                <span className="mt-2 inline-flex rounded-full bg-sf-sun/15 px-2 py-0.5 text-[10px] font-semibold text-[#8a5a12]">
                  Not FDA-approved
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}