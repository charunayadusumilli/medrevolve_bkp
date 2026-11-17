import React, { useEffect, useState } from 'react';
import { COA_DISCLAIMER } from '@/lib/ruo/storefront';
import { loadProducts } from '@/lib/ruo/shop';

export default function RuoCoasPage() {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadProducts()
      .then((items) => {
        if (cancelled) return;
        setProducts(items.filter((product) => product.coa_url || product.coa_lot));
      })
      .catch(() => { if (!cancelled) setProducts([]); });
    return () => { cancelled = true; };
  }, []);

  const term = query.trim().toLowerCase();
  const rows = (products || []).filter(
    (product) =>
      !term ||
      String(product.name || '').toLowerCase().includes(term) ||
      String(product.coa_lot || '').toLowerCase().includes(term),
  );

  return (
    <div>
      <div className="border-b border-ruo-ink pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Documents</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">COA library</h1>
        <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-ruo-muted">
          Every lot with a report on file, matched to the lot number on the label. {COA_DISCLAIMER}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-ruo-line py-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product or lot"
          className="h-9 w-full max-w-sm border border-ruo-line bg-ruo-surface px-3 font-mono text-[11px] outline-none focus:border-ruo-accent"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
          {products === null ? 'Loading' : `${rows.length} lot${rows.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {products === null && (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          Loading…
        </p>
      )}

      {products !== null && rows.length === 0 && (
        <p className="border border-ruo-line bg-ruo-surface px-6 py-14 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          No lot reports match that search.
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ruo-ink">
                {['Product', 'Lot', 'Purity', 'Laboratory', 'Report'].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap py-2 pr-5 font-mono text-[9px] font-normal uppercase tracking-[0.14em] text-ruo-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr key={product.id || product.slug} className="border-b border-ruo-line">
                  <td className="py-3 pr-5 text-[13px] font-medium">
                    {product.name}
                    {product.strength_label && (
                      <span className="font-mono text-[10px] text-ruo-muted"> · {product.strength_label}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-5 font-mono text-[11px]">{product.coa_lot || '—'}</td>
                  <td className="whitespace-nowrap py-3 pr-5 font-mono text-[11px] tabular-nums">
                    {product.purity || '—'}
                  </td>
                  <td className="py-3 pr-5 text-[11px] text-ruo-muted">{product.lab_name || '—'}</td>
                  <td className="py-3">
                    {product.coa_url ? (
                      <a
                        href={product.coa_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.1em] underline underline-offset-4"
                      >
                        Open report
                      </a>
                    ) : (
                      <span className="font-mono text-[10px] text-ruo-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 font-mono text-[10px] leading-relaxed text-ruo-muted">{COA_DISCLAIMER}</p>
    </div>
  );
}