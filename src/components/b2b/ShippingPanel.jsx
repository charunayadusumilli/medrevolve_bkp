import React from 'react';

const ROWS = [
  { label: 'Dispatch window', value: 'Orders placed before 12:00 ET dispatch the next business day. Bulk orders ship in 2-3 business days.' },
  { label: 'Carrier', value: 'FedEx, tracked, signature required on delivery. Packaging is selected per material.' },
  { label: 'States served', value: 'All 50 U.S. states and Washington, D.C. We do not ship internationally.' },
];

export default function ShippingPanel() {
  return (
    <div className="border border-site-line bg-site-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Shipping</p>
      <dl className="mt-4 divide-y divide-site-line border-t border-site-line">
        {ROWS.map((row) => (
          <div key={row.label} className="py-3.5">
            <dt className="text-[12px] font-semibold uppercase tracking-[0.04em] text-site-moss">{row.label}</dt>
            <dd className="mt-1 text-[13px] leading-relaxed text-site-greige">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 border-l-2 border-site-rust pl-3 text-[12px] leading-relaxed text-site-greige">
        Buyers are responsible for compliance with their local regulations.
      </p>
    </div>
  );
}