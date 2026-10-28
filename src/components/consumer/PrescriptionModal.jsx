import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

/**
 * Shown the moment a shopper tries to add a prescription-rail item.
 * The basket is never touched — the line is simply not added.
 */
export default function PrescriptionModal({ open, category, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-site-moss/40 px-5">
      <div className="w-full max-w-md rounded-xl bg-site-surface p-6 shadow-xl">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-site-cream text-site-moss">
          <Stethoscope className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-display text-[26px] leading-tight text-site-moss">This needs a provider review</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-site-greige">
          Prescription treatments are never added straight to a basket. A licensed provider reviews a short
          intake first — your basket stays exactly as it is.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/intake/${category || 'weight-loss'}`}
            className="flex-1 rounded-lg bg-site-rust px-4 py-3 text-center text-[13px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90"
          >
            Start my intake
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-site-line px-4 py-3 text-[13px] font-semibold text-site-moss transition-colors duration-200 hover:bg-site-cream"
          >
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}