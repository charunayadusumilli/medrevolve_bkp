import React, { useState } from 'react';
import { RUO_STATEMENT } from '@/lib/ruo/storefront';

const KEY = 'mr_ruo_gate_v1';

export function hasAcceptedGate() {
  try {
    return localStorage.getItem(KEY) === '21+';
  } catch {
    return false;
  }
}

export default function AgeGate({ onAccept }) {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');

  const enter = () => {
    if (!checked) {
      setError('You must confirm you are 21 or older to enter.');
      return;
    }
    try {
      localStorage.setItem(KEY, '21+');
    } catch {
      // storage unavailable — this session still proceeds
    }
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ruo-bg px-5 py-10 font-body text-ruo-ink">
      <div className="w-full max-w-2xl border border-ruo-ink bg-ruo-surface p-8 sm:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ruo-warn">
          Research use only
        </p>
        <h1 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-tight sm:text-[40px]">
          21 or older.
          <span className="block text-ruo-muted">Not for human or veterinary use.</span>
        </h1>

        <div className="mt-7 space-y-4 border-t border-ruo-line pt-7 text-[13px] leading-relaxed text-ruo-muted">
          <p>{RUO_STATEMENT}</p>
          <p>
            By entering you confirm that you are at least 21 years of age, that you are acquiring these
            materials as a qualified researcher or laboratory, and that they will not be administered to
            humans or animals.
          </p>
        </div>

        <label className="mt-8 flex items-start gap-3 border border-ruo-line p-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              setError('');
            }}
            className="mt-0.5 h-4 w-4 accent-ruo-ink"
          />
          <span className="text-[12px] leading-relaxed text-ruo-ink">
            I am 21 or older and I will use these materials for laboratory research only.
          </span>
        </label>

        {error && <p className="mt-3 font-mono text-[11px] text-ruo-warn">{error}</p>}

        <button
          type="button"
          onClick={enter}
          className="mt-6 w-full bg-ruo-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ruo-bg transition-opacity hover:opacity-90"
        >
          I am 21+ — enter
        </button>

        <p className="mt-4 text-[11px] leading-relaxed text-ruo-muted">
          Not a 503A or 503B pharmacy. Materials are sold for laboratory research only and are not for
          diagnostic, therapeutic, or veterinary use.
        </p>
      </div>
    </div>
  );
}