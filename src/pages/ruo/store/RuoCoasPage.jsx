import React, { useEffect, useState } from 'react';
import { COA_DISCLAIMER, loadCatalog } from '@/lib/ruo/storefront';

export default function RuoCoasPage() {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadCatalog()
      .then((items) => setProducts(items.filter((p) => p.coa_status === 'released')))
      .catch(() => setProducts([]));
  }, []);

  const term = query.trim().toLowerCase();
  const rows = (products || []).filter(
    (p) =>
      !term ||
      String(p.display_name || '').toLowerCase().includes(term) ||
      String(p.lot_number || '').toLowerCase().includes(term),
  );

  return (
    <div>
      <div className="border-b border-ruo-ink pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Documents</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">COA library</h1>
        <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-ruo-muted">
          Every lot the laboratory has released, with a link to the report they host. {COA_DISCLAIMER}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-ruo-line py-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by product or lot"
          className="h-9 w-full max-w-sm border border-ruo-line bg-ruo-surface px-3 font-mono text-[11px] outline-none"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
          {products === null ? 'Loading' : `${rows.length} released lot${rows.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {products === null && (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          Loading…
        </p>
      )}

      {products !== null && rows.length === 0 && (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          No released lots match that search.
        </p>
      )}

      {rows.length > 0 && (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ruo-ink">
              {['Product', 'Lot', 'Purity', 'Laboratory', 'Report'].map((h) => (
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
            {rows.map((p) => (
              <tr key={p.id || p.sku} className="border-b border-ruo-line">
                <td className="py-3 pr-5 text-[13px] font-medium">
                  {p.display_name}
                  {p.mg ? <span className="font-mono text-[10px] text-ruo-muted"> · {p.mg} mg</span> : null}
                </td>
                <td className="whitespace-nowrap py-3 pr-5 font-mono text-[11px]">{p.lot_number}</td>
                <td className="whitespace-nowrap py-3 pr-5 font-mono text-[11px] tabular-nums">
                  {p.purity_pct != null ? `${p.purity_pct}%` : '—'}
                </td>
                <td className="py-3 pr-5 text-[11px] text-ruo-muted">
                  {p.lab_name || '—'}
                  {p.lab_accreditation ? (
                    <span className="block font-mono text-[9px] uppercase tracking-[0.08em]">
                      {p.lab_accreditation}
                    </span>
                  ) : null}
                </td>
                <td className="py-3">
                  {p.report_url ? (
                    <a
                      href={p.report_url}
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
      )}

      <p className="mt-8 font-mono text-[10px] leading-relaxed text-ruo-muted">{COA_DISCLAIMER}</p>
    </div>
  );
}