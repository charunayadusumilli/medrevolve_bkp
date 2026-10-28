import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import RuoProductCard from '@/components/ruo/RuoProductCard';
import BulkLadder from '@/components/ruo/BulkLadder';
import { RUO_CATEGORIES, RUO_BANNER } from '@/lib/ruo/catalog';

const PROOF = [
  { title: 'COA on every batch', copy: 'HPLC purity and mass spec documentation published before a case ships.' },
  { title: 'Cold chain packing', copy: 'Insulated, temperature-logged packaging with tracking on every order.' },
  { title: 'Net-30 for approved accounts', copy: 'Business verification, then terms on repeat bulk orders.' },
];

export default function RuoHome() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    base44.entities.RUOProduct.filter({ in_stock: true }, { limit: 8 }).then((page) => setProducts(page.items || []));
  }, []);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 md:pb-24 md:pt-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Research supply</p>
        <h1 className="mt-4 max-w-3xl font-display text-[40px] leading-[1.06] tracking-tight sm:text-[56px]">
          Research-grade compounds. Every batch documented.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-site-greige">
          Lyophilized peptides and reference materials sold by the case to qualified laboratories.
          Certificate of analysis with every lot.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/catalog" className="rounded-lg bg-site-moss px-6 py-3.5 text-[14px] font-semibold text-site-cream">
            Browse the catalog
          </Link>
          <Link to="/bulk-orders" className="text-[14px] font-semibold underline decoration-site-line underline-offset-4">
            Request a bulk quote
          </Link>
        </div>
      </section>

      <section className="border-y border-site-line bg-site-surface">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">{RUO_BANNER}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-8 md:grid-cols-3">
        {PROOF.map((item) => (
          <div key={item.title} className="rounded-xl border border-site-line bg-site-surface p-6">
            <p className="text-[14px] font-semibold">{item.title}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-site-greige">{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 md:pb-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Categories</p>
            <h2 className="mt-3 font-display text-[30px] leading-tight tracking-tight sm:text-[36px]">Shop by research area</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            {RUO_CATEGORIES.map((cat) => (
              <Link key={cat.slug} to={`/catalog/${cat.slug}`} className="rounded-lg border border-site-line px-3 py-2 text-[12px] font-semibold hover:border-site-moss">
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products === null
            ? [0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-site-surface" />)
            : products.slice(0, 4).map((product) => <RuoProductCard key={product.id} product={product} />)}
        </div>

        <div className="mt-10 max-w-md"><BulkLadder /></div>
      </section>
    </>
  );
}