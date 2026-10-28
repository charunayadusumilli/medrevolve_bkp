import React from 'react';
import { Search, X } from 'lucide-react';
import { STOREFRONT_CATEGORIES } from '@/lib/storefront/catalog';

const PRICE_BANDS = [
  { label: 'Any price', value: 0 },
  { label: 'Under $25', value: 25 },
  { label: 'Under $50', value: 50 },
  { label: 'Under $100', value: 100 },
];

export default function ShopFilters({
  search,
  onSearch,
  categoryFilter,
  onCategory,
  maxPrice,
  onMaxPrice,
  subOnly,
  onSubOnly,
}) {
  const active = search || categoryFilter !== 'all' || maxPrice !== 0 || subOnly;

  return (
    <div className="rounded-2xl border border-sf-line bg-sf-surface p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sf-muted" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search treatments, ingredients, brands"
            className="w-full rounded-full border border-sf-line bg-sf-paper py-2.5 pl-9 pr-4 text-[13px] outline-none focus:border-sf-ink"
          />
        </label>

        <select
          value={categoryFilter}
          onChange={(e) => onCategory(e.target.value)}
          className="rounded-full border border-sf-line bg-sf-paper px-4 py-2.5 text-[13px] font-medium outline-none focus:border-sf-ink"
        >
          <option value="all">All categories</option>
          {STOREFRONT_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {PRICE_BANDS.map((band) => (
          <button
            key={band.value}
            type="button"
            onClick={() => onMaxPrice(band.value)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              maxPrice === band.value
                ? 'border-sf-ink bg-sf-ink text-white'
                : 'border-sf-line text-sf-muted hover:border-sf-ink hover:text-sf-ink'
            }`}
          >
            {band.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onSubOnly(!subOnly)}
          className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
            subOnly
              ? 'border-sf-accent bg-sf-accent-soft text-sf-accent'
              : 'border-sf-line text-sf-muted hover:border-sf-ink hover:text-sf-ink'
          }`}
        >
          Subscription available
        </button>

        {active && (
          <button
            type="button"
            onClick={() => {
              onSearch('');
              onCategory('all');
              onMaxPrice(0);
              onSubOnly(false);
            }}
            className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-sf-muted hover:text-sf-ink"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}