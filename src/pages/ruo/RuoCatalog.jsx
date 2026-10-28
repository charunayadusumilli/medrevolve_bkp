import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import RuoProductCard from '@/components/ruo/RuoProductCard';
import BulkLadder from '@/components/ruo/BulkLadder';
import { RUO_CATEGORIES } from '@/lib/ruo/catalog';

export default function RuoCatalog() {
  const { category } = useParams();
  const [products, setProducts] = useState(null);

  const active = RUO_CATEGORIES.find((c) => c.slug === category);

  useEffect(() => {
    setProducts(null);
    const query = category ? { category } : {};
    base44.entities.RUOProduct.filter(query, { sort: 'price', limit: 60 }).then((page) => setProducts(page.items || []));
  }, [category]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Catalog</p>
      <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">
        {active ? active.label : 'All research compounds'}
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/catalog"
          className={`rounded-lg border px-3 py-2 text-[12px] font-semibold ${
            !category ? 'border-site-moss bg-site-moss text-site-cream' : 'border-site-line hover:border-site-moss'
          }`}
        >
          All
        </Link>
        {RUO_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/catalog/${cat.slug}`}
            className={`rounded-lg border px-3 py-2 text-[12px] font-semibold ${
              category === cat.slug ? 'border-site-moss bg-site-moss text-site-cream' : 'border-site-line hover:border-site-moss'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products === null
          ? [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-site-surface" />)
          : products.map((product) => <RuoProductCard key={product.id} product={product} />)}
      </div>

      {products?.length === 0 && (
        <p className="mt-10 text-[13px] text-site-greige">Nothing in this category yet. <Link to="/catalog" className="underline">View all compounds</Link>.</p>
      )}

      <div className="mt-12 max-w-md"><BulkLadder /></div>
    </section>
  );
}