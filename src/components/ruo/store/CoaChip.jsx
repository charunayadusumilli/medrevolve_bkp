import React from 'react';

export default function CoaChip({ status }) {
  const released = status === 'released';
  return (
    <span
      className={`inline-flex items-center border px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.12em] ${
        released
          ? 'border-ruo-accent text-ruo-accent'
          : 'border-ruo-warn text-ruo-warn'
      }`}
    >
      {released ? 'COA on file' : 'COA pending'}
    </span>
  );
}