import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ruo/store/ProductCard';
import TrustBar from '@/components/ruo/store/TrustBar';
import UgcRail from '@/components/ruo/store/UgcRail';
import { SORT_OPTIONS, loadProducts } from '@/lib/ruo/shop';
import { RUO_STATEMENT } from '@/lib/ruo/storefront';
import { applyRouteSeo } from '@/lib/ruo/seo';

const selectClass =
  'h-10 border border-ruo-line bg-ruo-surface px-3 font-mono text-[10px] uppercase tracking-[0.1em] outline-none focus:border-ruo-accent';

function sortProducts(products, sort) {
  const list = [...products];
  if (sort === 'price-asc') return list.sort((a, b) => a.retail_price - b.retail_price);
  if (sort === 'price-desc') return list.sort((a, b) => b.retail_price - a.retail_price);
  if (sort === 'newest') {
    return list.sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')));
  }
  return list.sort((a, b) => {
    const area = String(a.research_area || '').localeCompare(String(b.research_area || ''));
    if (area !== 0) return area;
    return (Number(a.display_order) || 0) - (Number(b.display_order) || 0);
  });
}

export default function RuoCatalogPage() {
  const [products, setProducts] = useState(null);
  const [area, setArea] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    let cancelled = false;
    loadProducts()
      .then((items) => { if (!cancelled) setProducts(items); })
      .catch(() => { if (!cancelled) setProducts([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    applyRouteSeo({
      title: 'Research catalog — third-party tested, lot-matched COA | MedRevolve Research',
      description:
        'Reference materials for in-vitro laboratory research. Every record lists strength, released HPLC purity, lot number and the laboratory report for that lot. Research use only, 21+, not for human or veterinary use.',
      path: window.location.pathname,
    });
  }, []);

  const areas = useMemo(() => {
    const present = [...new Set((products || []).map((p) => p.research_area).filter(Boolean))];
    return ['All', ...present.sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = (products || []).filter((product) => {
      if (area !== 'All' && product.research_area !== area) return false;
      if (!term) return true;
      return [product.name, product.slug, product.research_area, product.strength_label]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
    return sortProducts(filtered, sort);
  }, [products, area, search, sort]);

  return (
    <div>
      <section className="border border-ruo-ink bg-ruo-ink px-6 py-10 text-ruo-bg sm:px-10 sm:py-14">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ruo-bg/60">
          MedRevolve Research · Catalog
        </p>
        <h1 className="mt-4 max-w-3xl text-[30px] font-semibold leading-[1.08] tracking-tight sm:text-[44px]">
          Reference materials, lot-matched to their COA.
        </h1>
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed text-ruo-bg/70 sm:text-[13px]">
          Every record lists the strength, the released purity, the lot number and the laboratory report
          for that lot. Volume pricing applies automatically in the cart, per line. Sold to qualified
          researchers 21 or older.
        </p>
      </section>

      <TrustBar />

      <div className="mt-10">
        <UgcRail surface="home" title="Research feed" />
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-ruo-line pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {areas.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setArea(name)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                area === name
                  ? 'border-ruo-ink bg-ruo-ink text-ruo-bg'
                  : 'border-ruo-line text-ruo-muted hover:border-ruo-ink hover:text-ruo-ink'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search catalog"
            aria-label="Search catalog"
            className="h-10 w-full border border-ruo-line bg-ruo-surface px-3 text-[12px] outline-none focus:border-ruo-accent sm:w-52"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort catalog"
            className={selectClass}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
          {products === null
            ? 'Loading catalog'
            : `${visible.length} of ${products.length} record${products.length === 1 ? '' : 's'}`}
        </p>
        <p className="max-w-xs text-right text-[10px] leading-relaxed text-ruo-muted">
          {RUO_STATEMENT}
        </p>
      </div>

      <UgcRail surface="catalog" variant="strip" />

      {products === null && (
        <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="h-80 animate-pulse border border-ruo-line bg-ruo-surface" />
          ))}
        </div>
      )}

      {products !== null && products.length === 0 && (
        <div className="border border-ruo-line bg-ruo-surface px-6 py-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-warn">
            Catalog publishing
          </p>
          <h2 className="mt-4 text-[22px] font-semibold tracking-tight sm:text-[26px]">
            Records are being added lot by lot.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-ruo-muted">
            Nothing is listed yet. Every material appears here with its strength, released purity, lot
            number and the laboratory report matched to that lot. Ask us about a specific lot in the
            meantime.
          </p>
          <Link
            to="/ruo/contact"
            className="mt-6 inline-block border border-ruo-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em]"
          >
            Ask about a lot
          </Link>
        </div>
      )}

      {products !== null && products.length > 0 && visible.length === 0 && (
        <div className="border border-ruo-line bg-ruo-surface px-6 py-14 text-center">
          <p className="text-[13px] font-semibold">No records match that filter.</p>
          <button
            type="button"
            onClick={() => { setArea('All'); setSearch(''); }}
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}

      {visible.length > 0 && (
        <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      )}

      <p className="mt-10 max-w-3xl border-t border-ruo-line pt-5 text-[11px] leading-relaxed text-ruo-muted">
        Volume pricing is calculated per line and applied automatically in the cart: 1–2 units at the unit
        price, 3–5 units at the middle tier, 6 or more at the lowest tier. Purity is published only after
        the testing laboratory releases the lot.
      </p>
    </div>
  );
}