import React, { useEffect, useState } from 'react';

const KEY = 'mr_ruo_gate_v1';
const TTL_MS = 180 * 24 * 60 * 60 * 1000;

function alreadyAccepted() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    return Boolean(raw?.acceptedAt && Date.now() - raw.acceptedAt < TTL_MS);
  } catch {
    return false;
  }
}

export default function ResearchGate() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setOpen(!alreadyAccepted());
  }, []);

  if (!open) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ acceptedAt: Date.now() }));
    } catch {
      // storage unavailable — the gate reappears next visit
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-site-moss/60 px-5 py-8">
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-site-surface p-7 shadow-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Research use only</p>
        <h2 className="mt-3 font-display text-[28px] leading-tight">Qualified researcher attestation</h2>
        <p className="mt-3 text-[13px] leading-relaxed text-site-greige">
          Material sold on this site is supplied exclusively for in-vitro laboratory research. It is not for
          human or animal consumption, not for diagnostic or therapeutic use, and is not a drug, supplement
          or prescription product.
        </p>

        <label className="mt-5 flex items-start gap-3 rounded-xl border border-site-line bg-site-cream p-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#1F2D27]"
          />
          <span className="text-[12px] leading-relaxed text-site-moss">
            I attest that I am 18 years or older, that I am a qualified researcher or an authorized
            representative of a research or manufacturing organization, and that I will not administer
            these materials to humans or animals.
          </span>
        </label>

        <button
          type="button"
          onClick={accept}
          disabled={!checked}
          className="mt-5 w-full rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
        >
          Enter the research catalog
        </button>
        <p className="mt-3 text-[11px] text-site-greige">
          Attestation is stored on this device for 180 days. Business verification is required at checkout.
        </p>
      </div>
    </div>
  );
}