import React from 'react';
import { BULK_TIERS } from '@/lib/ruo/catalog';

export default function BulkLadder({ compact = false }) {
  return (
    <div className={`rounded-xl border border-site-line bg-site-cream ${compact ? 'p-3' : 'p-4'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Bulk ladder</p>
      <ul className="mt-2 space-y-1">
        {BULK_TIERS.map((tier) => (
          <li key={tier.label} className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="font-semibold text-site-moss">{tier.label}</span>
            <span className="text-site-greige">{tier.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}