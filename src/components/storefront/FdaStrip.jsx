import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { money, fdaChip } from '@/lib/storefront/catalog';

export default function FdaStrip() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.StorefrontProduct
      .filter({ fda_status: 'fda_approved' }, { limit: 12 })
      .then((page) => { if (!cancelled) setProducts(page.items || []); });
    return () => { cancelled = true; };
  }, []);

  if (products === null) return <div className="h-56 animate-pulse bg-sf-surface" />;
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Same molecule, real pharmacies</p>
          <h2 className="mt-2 font-display text-[30px] tracking-tight sm:text-[38px]">FDA-approved treatments</h2>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-sf-muted">
            Brand-name and generic options dispensed by licensed US pharmacies. Pricing shown is the
            cash-pay monthly rate after a licensed provider approves your treatment.
          </p>
        </div>
        <Link to="/shop" className="text-[13px] font-semibold text-sf-accent hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="group rounded-2xl border border-sf-line bg-sf-surface p-4 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(20,30,26,0.5)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-semibold leading-snug">{product.display_name}</p>
                {product.generic_name && <p className="mt-0.5 text-[11px] text-sf-muted">{product.generic_name}</p>}
              </div>
              <ArrowUpRight className="h-4 w-4 text-sf-muted transition-transform group-hover:-translate-y-0.5" />
            </div>
            <span className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${fdaChip(product.fda_status).className}`}>
              {fdaChip(product.fda_status).label}
            </span>
            <p className="mt-3 text-[15px] font-semibold">
              Starting at {money(product.subscription_price ?? product.price)}/mo
            </p>
            {product.compare_at_price > product.price && (
              <p className="text-[11px] text-sf-muted line-through">{money(product.compare_at_price)}</p>
            )}
            <p className="mt-1 text-[11px] text-sf-muted">after provider approval</p>
          </Link>
        ))}
      </div>
    </section>
  );
}