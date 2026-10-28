import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { STOREFRONT_CATEGORIES, categoryImage } from '@/lib/storefront/catalog';
import { applyStoreSeo } from '@/lib/storefront/seo';
import ProductTile from '@/components/storefront/ProductTile';
import ShopFilters from '@/components/storefront/ShopFilters';

const rank = (p) => (p.badge === 'bestseller' ? 0 : p.badge === 'new' ? 1 : p.badge === 'value' ? 2 : 3);
// Headline price a shopper sees first — subscription where one exists.
const headline = (p) => p.subscription_price ?? p.price;

export default function StoreShop() {
  const { category } = useParams();
  const isCategory = Boolean(category);
  const meta = STOREFRONT_CATEGORIES.find((c) => c.slug === category);

  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(0);
  const [subOnly, setSubOnly] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    if (isCategory) {
      const label = meta?.label || 'Treatments';
      applyStoreSeo({
        title: `${label} — shop prescription & online options | MedRevolve`,
        description: `${label} from MedRevolve: licensed-provider care and direct-purchase products with transparent cash-pay pricing. Rx options start with a short intake.`,
        path: `/shop/${category}`,
      });
    } else {
      applyStoreSeo({
        title: 'Shop all treatments, labs & wellness | MedRevolve',
        description:
          'Shop every MedRevolve category — weight loss, sexual health, hair, skin, testosterone, mental health, labs and daily wellness — with cash-pay pricing and free shipping over $50.',
        path: '/shop',
      });
    }
  }, [isCategory, category, meta]);

  useEffect(() => {
    let cancelled = false;
    setProducts(null);

    const run = async () => {
      const query = {};
      const activeCategory = isCategory ? category : categoryFilter !== 'all' ? categoryFilter : null;
      if (activeCategory) query.category = activeCategory;
      if (maxPrice) query.price = { $lte: maxPrice };
      if (inStock) query.in_stock = true;
      if (subOnly) query.subscription_price = { $exists: true };
      if (search.trim()) {
        const rx = { $regex: search.trim(), $options: 'i' };
        query.$or = [
          { display_name: rx },
          { generic_name: rx },
          { brand_name: rx },
        ];
      }

      const page = await base44.entities.StorefrontProduct.filter(query, { limit: 100 });
      if (cancelled) return;
      setProducts(page.items || []);
    };

    const timer = setTimeout(run, isCategory ? 0 : 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isCategory, category, categoryFilter, maxPrice, subOnly, inStock, search]);

  const sorted = useMemo(() => {
    if (!products) return null;
    const list = [...products];
    if (sort === 'price-asc') list.sort((a, b) => headline(a) - headline(b));
    else if (sort === 'price-desc') list.sort((a, b) => headline(b) - headline(a));
    else if (sort === 'name') list.sort((a, b) => String(a.display_name).localeCompare(String(b.display_name)));
    else list.sort((a, b) => rank(a) - rank(b) || String(a.display_name).localeCompare(String(b.display_name)));
    return list;
  }, [products, sort]);

  const heading = isCategory ? meta?.label || 'Treatments' : 'Shop all';
  const blurb = isCategory
    ? meta?.tagline || 'Prescription and direct-purchase options in this category.'
    : 'Every category in one place — direct-purchase products ship today, prescription treatments start with a short provider visit.';

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <nav className="flex items-center gap-2 text-[12px] text-sf-muted">
        <Link to="/" className="hover:text-sf-ink">Home</Link>
        <span>/</span>
        {isCategory ? (
          <>
            <Link to="/shop" className="hover:text-sf-ink">Shop</Link>
            <span>/</span>
            <span className="text-sf-ink">{heading}</span>
          </>
        ) : (
          <span className="text-sf-ink">Shop all</span>
        )}
      </nav>

      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-[38px] leading-tight tracking-tight sm:text-[46px]">{heading}</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-sf-muted">{blurb}</p>
          {isCategory && (
            <p className="mt-2 text-[12px] text-sf-muted">
              Prescription items in this category require a licensed provider review and are not sold directly.
            </p>
          )}
        </div>
        {isCategory && meta && (
          <img
            src={categoryImage(meta.slug)}
            alt={meta.label}
            className="h-28 w-full rounded-2xl object-cover lg:h-32 lg:w-64"
          />
        )}
      </header>

      <div className="mt-8">
        <ShopFilters
          search={search}
          onSearch={setSearch}
          categoryFilter={categoryFilter}
          onCategory={setCategoryFilter}
          maxPrice={maxPrice}
          onMaxPrice={setMaxPrice}
          subOnly={subOnly}
          onSubOnly={setSubOnly}
          inStock={inStock}
          onInStock={setInStock}
          sort={sort}
          onSort={setSort}
          lockCategory={isCategory}
        />
      </div>

      <div className="mt-8">
        {sorted === null ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-sf-surface" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-sf-line bg-sf-surface p-10 text-center">
            <p className="text-[15px] font-semibold">No products match those filters</p>
            <p className="mt-1.5 text-[13px] text-sf-muted">
              Try clearing the filters, or start a visit to talk to a provider about prescription options.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link to="/shop" className="rounded-full bg-sf-ink px-5 py-2.5 text-[13px] font-semibold text-white">
                Browse shop
              </Link>
              <Link to="/start" className="rounded-full border border-sf-ink px-5 py-2.5 text-[13px] font-semibold text-sf-ink">
                Start your visit
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-[12px] text-sf-muted">
              {sorted.length} product{sorted.length === 1 ? '' : 's'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sorted.map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}