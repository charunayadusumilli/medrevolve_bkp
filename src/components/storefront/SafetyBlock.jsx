import React, { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { isPrescription } from '@/lib/storefront/catalog';

export default function SafetyBlock({ product }) {
  const prescription = isPrescription(product);
  const defaultOpen =
    prescription && typeof window !== 'undefined' && window.innerWidth < 768;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-sf-line bg-sf-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#8a5a12]" />
          <span className="text-[15px] font-semibold">Safety information</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-sf-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-sf-line px-6 py-5">
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-sf-ink/85">
            {product.safety_info}
          </p>
          {prescription && (
            <p className="mt-4 rounded-xl bg-sf-paper p-3 text-[11px] leading-relaxed text-sf-muted">
              This product requires a prescription. A licensed provider will review your medical history and
              may decline treatment if it is not appropriate for you. Do not start, stop, or change any
              medication without talking to a clinician.
            </p>
          )}
        </div>
      )}
    </section>
  );
}