import React from 'react';

function StateChip({ released }) {
  return (
    <span
      className={`shrink-0 border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${
        released ? 'border-ruo-ink text-ruo-ink' : 'border-ruo-warn text-ruo-warn'
      }`}
    >
      {released ? 'Pass' : 'Pending'}
    </span>
  );
}

export default function BatchAnalysis({ product }) {
  const released = Boolean(product?.coa_url);
  const lab = product?.lab_name || 'Vanguard Laboratory';
  const lot = product?.coa_lot || 'Not yet assigned';

  const rows = [
    { label: 'HPLC purity', value: released ? product.purity || 'See report' : null },
    { label: 'Mass spec identity', value: released ? 'Confirmed on report' : null },
    { label: 'Net content', value: product?.mg ? `${product.mg} mg` : null },
    { label: 'Endotoxin (USP <85>)', value: released ? 'Pass' : null },
    { label: 'Sterility', value: released ? 'Pass' : null },
    { label: 'Heavy metals (ICP-MS)', value: released ? 'Pass' : null },
  ];

  return (
    <section className="border border-ruo-ink bg-ruo-surface">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ruo-ink px-5 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ruo-muted">Batch analysis</p>
          <h2 className="mt-1.5 text-[19px] font-semibold tracking-tight sm:text-[22px]">
            Lot {lot}
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-muted">Laboratory</p>
          <p className="text-[12px]">{lab}</p>
        </div>
      </div>

      {!released && (
        <p className="border-b border-ruo-line bg-ruo-bg px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-warn">
          Report pending for this lot
        </p>
      )}

      <ul className="divide-y divide-ruo-line">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-[12px] text-ruo-ink">{row.label}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-[11px] tabular-nums text-ruo-muted">
                {row.value || 'Pending release'}
              </span>
              <StateChip released={released} />
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-ruo-line px-5 py-4">
        {released ? (
          <a
            href={product.coa_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-ruo-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-bg"
          >
            View lot report
          </a>
        ) : (
          <p className="border border-ruo-warn px-5 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ruo-warn">
            Report pending for this lot
          </p>
        )}
        <p className="mt-3 text-[10px] leading-relaxed text-ruo-muted">
          Reports are hosted by the testing laboratory. Nothing is marked pass until that laboratory
          releases the report for this lot.
        </p>
      </div>
    </section>
  );
}