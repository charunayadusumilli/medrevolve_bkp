import React from 'react';
import { VOLUME_TIERS } from '@/lib/partner/offerings';

export default function VolumeLadder() {
  return (
    <div className="border border-site-line bg-site-surface">
      <div className="hidden border-b border-site-line px-6 py-3 sm:grid sm:grid-cols-[1.1fr_1fr_1.2fr] sm:items-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Vials per order</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Volume discount</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Applies to</span>
      </div>

      {VOLUME_TIERS.map((tier) => (
        <div
          key={tier.qty}
          className="grid gap-1 border-b border-site-line px-5 py-4 last:border-b-0 sm:grid-cols-[1.1fr_1fr_1.2fr] sm:items-center sm:gap-0 sm:px-6"
        >
          <span className="text-[15px] font-semibold text-site-moss">{tier.qty}</span>
          <span className="text-[15px] text-site-rust sm:text-[14px] sm:font-semibold">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-site-greige sm:hidden">
              Volume discount
            </span>
            {tier.discount}
          </span>
          <span className="text-[12px] text-site-greige">{tier.note}</span>
        </div>
      ))}
    </div>
  );
}