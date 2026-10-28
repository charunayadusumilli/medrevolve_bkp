import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ConsumerProductCard from './ConsumerProductCard';

export default function ConsumerBestSellers() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.StorefrontProduct
      .filter({ badge: 'bestseller' }, { limit: 8 })
      .then((page) => {
        if (!cancelled) setProducts((page.items || []).slice(0, 4));
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Best sellers</p>
            <h2 className="mt-3 font-display text-[32px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
              What members choose first
            </h2>
          </div>
          <Link to="/shop" className="hidden text-[13px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 sm:block">
            Shop all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products === null
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-site-cream" />
              ))
            : products.map((product) => <ConsumerProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}