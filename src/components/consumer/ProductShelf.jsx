import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { money, isPrescription, categoryImage } from '@/lib/storefront/catalog';

export default function ProductShelf() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.StorefrontProduct
      .list({ sort: '-created_date', limit: 24 })
      .then((page) => {
        if (cancelled) return;
        const items = page.items || page;
        const ranked = [...items].sort((a, b) => {
          const score = (p) => (p.badge === 'bestseller' ? 0 : p.badge === 'new' ? 1 : 2);
          return score(a) - score(b);
        });
        setProducts(ranked.slice(0, 6));
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">The shelf</p>
            <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-site-moss sm:text-[40px]">
              Shop with the paperwork attached.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-site-greige">
              Prescription items start with an intake. Everything else ships straight away. Certificate status
              is shown on the card, not buried in a PDF.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-[13px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 transition-colors duration-200 hover:decoration-site-rust"
          >
            Shop all products
          </Link>
        </div>

        {!products && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[360px] animate-pulse rounded-xl border border-site-line bg-site-cream" />
            ))}
          </div>
        )}

        {products && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const rx = isPrescription(product);
              const image = product.image_url || categoryImage(product.category);
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-site-line bg-site-cream transition-shadow duration-200 hover:shadow-[0_16px_40px_-32px_rgba(31,45,39,0.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-site-surface">
                    <img
                      src={image}
                      alt={product.display_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-site-cream/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-site-moss">
                      {rx ? 'Rx required' : 'No Rx'}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[14px] font-semibold leading-snug text-site-moss">{product.display_name}</p>
                    {product.generic_name && (
                      <p className="mt-1 text-[12px] text-site-greige">{product.generic_name}</p>
                    )}

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-[22px] leading-none text-site-moss">
                        {money(product.subscription_price ?? product.price)}
                      </span>
                      <span className="text-[11px] text-site-greige">
                        {rx ? 'per month after approval' : 'one-time'}
                      </span>
                    </div>

                    <p className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] text-site-greige">
                      <span className={`h-1.5 w-1.5 rounded-full ${product.coa_url ? 'bg-site-rust' : 'bg-site-line'}`} />
                      {product.coa_url ? 'Certificate of analysis on file' : 'Certificate available on request'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}