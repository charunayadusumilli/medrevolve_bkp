import React from 'react';

const CELLS = [
  { title: 'Third-party tested', note: 'Independent laboratory' },
  { title: 'Lot-level COA', note: 'Report per lot number' },
  { title: 'Ships from USA', note: 'Adult signature required' },
  { title: 'Research only', note: 'Not for human or animal use' },
];

export default function TrustBar() {
  return (
    <div className="mt-6 grid grid-cols-2 border-l border-t border-ruo-line lg:grid-cols-4">
      {CELLS.map((cell) => (
        <div key={cell.title} className="border-b border-r border-ruo-line px-4 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ruo-ink">{cell.title}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-ruo-muted">{cell.note}</p>
        </div>
      ))}
    </div>
  );
}