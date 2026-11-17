import React from 'react';

export default function RuoDisclaimer() {
  return (
    <section className="border border-ruo-ink bg-ruo-surface p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-warn">
        Research use only
      </p>
      <p className="mt-3 text-[12px] leading-relaxed text-ruo-muted">
        Products are for laboratory research only, not for human or animal use, not for diagnostic or
        therapeutic use. Sold to qualified researchers 21 or older. No dosing, administration or handling
        guidance is provided for any material on this site, and no benefit claims are made.
      </p>
    </section>
  );
}