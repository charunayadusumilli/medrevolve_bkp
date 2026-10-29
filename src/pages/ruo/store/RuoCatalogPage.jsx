import React, { useEffect, useState } from 'react';
import CatalogRow from '@/components/ruo/store/CatalogRow';
import { loadCatalog, RUO_STATEMENT } from '@/lib/ruo/storefront';
import { addUnits } from '@/lib/ruo/storeCart';

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'peptides', label: 'Peptides' },
  { value: 'metabolic', label: 'Metabolic' },
  { value: 'longevity', label: 'Longevity' },
  { value: 'supplies', label: 'Supplies' },
];

const COA_OPTIONS = [
  { value: 'all', label: 'All COA statuses' },
  { value: 'released', label: 'COA on file' },
  { value: 'pending', label: 'COA pending' },
];

const selectClass =
  'h-9 border border-ruo-line bg-ruo-surface px-2 font-mono text-[10px] uppercase tracking-[0.1em] outline-none';

export default function RuoCatalogPage() {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState('all');
  const [coa, setCoa] = useState('all');
  const [flash, setFlash] = useState('');

  useEffect(() => {
    loadCatalog()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const add = (sku, qty) => {
    addUnits(sku, qty);
    setFlash(`${qty} unit${qty === 1 ? '' : 's'} added to the case cart.`);
  };

  const rows = (products || []).filter(
    (p) => (category === 'all' || p.category === category) && (coa === 'all' || p.coa_status === coa),
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ruo-ink pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">
            Research catalog
          </p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">
            Reference materials
          </h1>
        </div>
        <p className="max-w-sm text-[11px] leading-relaxed text-ruo-muted">{RUO_STATEMENT}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-ruo-line py-4">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select value={coa} onChange={(e) => setCoa(e.target.value)} className={selectClass}>
          {COA_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
          {products === null ? 'Loading' : `${rows.length} of ${products.length} items`}
        </p>
        {flash && (
          <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-accent">
            {flash}
          </p>
        )}
      </div>

      {products === null && (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          Loading catalog…
        </p>
      )}

      {products !== null && rows.length === 0 && (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          No items match this filter.
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ruo-ink">
                {['Product', 'Fill', 'Purity', 'Lot', 'COA', 'Unit', '3–5', '6+', 'Qty'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap py-2 pr-5 font-mono text-[9px] font-normal uppercase tracking-[0.14em] text-ruo-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <CatalogRow key={product.id || product.sku} product={product} onAdd={add} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-ruo-muted">
        Volume pricing is applied automatically per line: 1–2 units at the unit price, 3–5 units at the
        middle column, 6 or more at the right column. Purity is published only after the testing
        laboratory releases the lot.
      </p>
    </div>
  );
}