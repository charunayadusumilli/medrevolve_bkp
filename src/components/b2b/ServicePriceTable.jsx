import React from 'react';
import PayButtons from './PayButtons';

export default function ServicePriceTable({ label, rows }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">{label}</p>
      <div className="mt-3 border border-site-line bg-site-surface">
        <div className="hidden border-b border-site-line px-6 py-3 sm:grid sm:grid-cols-[1.1fr_0.8fr_1.4fr_1fr] sm:items-center sm:gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Service</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Price</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">What it covers</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Checkout</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.name}
            className="grid gap-3 border-b border-site-line px-5 py-5 last:border-b-0 sm:grid-cols-[1.1fr_0.8fr_1.4fr_1fr] sm:items-start sm:gap-4 sm:px-6"
          >
            <p className="text-[15px] font-semibold leading-snug text-site-moss">{row.name}</p>
            <p className="text-[15px] font-semibold text-site-rust sm:text-[14px]">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-site-greige sm:hidden">
                Price
              </span>
              {row.price}
            </p>
            <div>
              <p className="text-[13px] leading-relaxed text-site-greige">{row.detail}</p>
              {row.caveat && (
                <p className="mt-2 border-l-2 border-site-line pl-3 text-[11px] leading-relaxed text-site-greige">
                  {row.caveat}
                </p>
              )}
            </div>
            <PayButtons payments={row.payments} />
          </div>
        ))}
      </div>
    </div>
  );
}