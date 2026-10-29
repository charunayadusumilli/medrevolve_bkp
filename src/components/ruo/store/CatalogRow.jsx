import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CoaChip from './CoaChip';
import { money, unitPrice } from '@/lib/ruo/pricing';

export default function CatalogRow({ product, onAdd }) {
  const [qty, setQty] = useState(1);
  const available = Number(product.cases_available || 0);
  const soldOut = available <= 0;

  return (
    <tr className="border-b border-ruo-line align-top">
      <td className="py-4 pr-5">
        <p className="text-[13px] font-semibold leading-snug">{product.display_name}</p>
        <p className="mt-1 font-mono text-[10px] leading-relaxed text-ruo-muted">
          {product.sku} · CAS {product.cas_number || '—'}
          {product.bulk_only ? ' · case qty only' : ''}
        </p>
      </td>
      <td className="whitespace-nowrap py-4 pr-5 font-mono text-[12px] tabular-nums">
        {product.mg ? `${product.mg} mg` : '—'}
      </td>
      <td className="whitespace-nowrap py-4 pr-5 font-mono text-[12px] tabular-nums">
        {product.purity_pct != null ? `${product.purity_pct}%` : '—'}
      </td>
      <td className="whitespace-nowrap py-4 pr-5">
        <span className="font-mono text-[11px]">{product.lot_number}</span>
        <Link
          to={`/ruo/verify?lot=${encodeURIComponent(product.lot_number)}`}
          className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted underline underline-offset-4"
        >
          Verify lot
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pr-5">
        <CoaChip status={product.coa_status} />
      </td>
      <td className="whitespace-nowrap py-4 pr-5 font-mono text-[12px] tabular-nums">
        {money(unitPrice(product, 1))}
      </td>
      <td className="whitespace-nowrap py-4 pr-5 font-mono text-[12px] tabular-nums text-ruo-muted">
        {product.tier_3_5_price ? money(product.tier_3_5_price) : '—'}
      </td>
      <td className="whitespace-nowrap py-4 pr-5 font-mono text-[12px] tabular-nums text-ruo-muted">
        {product.tier_6_plus_price ? money(product.tier_6_plus_price) : '—'}
      </td>
      <td className="py-4">
        <div className="flex items-stretch border border-ruo-line">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-7 border-r border-ruo-line font-mono text-[13px] disabled:opacity-40"
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            value={qty}
            onChange={(e) => {
              const next = Math.round(Number(e.target.value) || 1);
              setQty(Math.max(1, Math.min(available || 1, next)));
            }}
            className="w-9 bg-transparent text-center font-mono text-[12px] tabular-nums outline-none"
            inputMode="numeric"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(available || q + 1, q + 1))}
            className="w-7 border-l border-ruo-line font-mono text-[13px] disabled:opacity-40"
            disabled={soldOut || qty >= available}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product.sku, qty)}
          disabled={soldOut}
          className="mt-2 w-full bg-ruo-ink px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ruo-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? 'Unavailable' : 'Add to case'}
        </button>
      </td>
    </tr>
  );
}