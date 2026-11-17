import React from 'react';
import { money, tierRows } from '@/lib/ruo/shop';

export default function TierTable({ product }) {
  const rows = tierRows(product);

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-ruo-ink">
          {['Quantity', 'Unit price', 'Saving'].map((heading) => (
            <th
              key={heading}
              className="py-2 pr-4 font-mono text-[9px] font-normal uppercase tracking-[0.14em] text-ruo-muted"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.qty} className="border-b border-ruo-line last:border-0">
            <td className="py-2 pr-4 text-[12px]">{row.label}</td>
            <td className="py-2 pr-4 font-mono text-[12px] tabular-nums">{money(row.price)}</td>
            <td className="py-2 font-mono text-[11px] tabular-nums text-ruo-accent">
              {row.savePct > 0 ? `${row.savePct}%` : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}