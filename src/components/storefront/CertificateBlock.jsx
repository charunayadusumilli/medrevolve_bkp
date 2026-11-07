import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_SMS } from '@/lib/contactConfig';

export default function CertificateBlock({ product }) {
  const hasCoa = Boolean(product.coa_url);
  const facts = [
    product.lot_number && ['Lot', product.lot_number],
    product.lab_name && ['Laboratory', product.lab_name],
    product.lab_accreditation && ['Accreditation', product.lab_accreditation],
    product.purity_pct && ['Purity (HPLC)', `${product.purity_pct}%`],
  ].filter(Boolean);

  return (
    <section className="mt-4 rounded-2xl border border-sf-line bg-sf-surface p-5">
      <div className="flex items-start gap-2.5">
        <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-sf-accent" strokeWidth={1.7} />
        <div>
          <h2 className="font-display text-[20px] leading-tight tracking-tight">Certificate of analysis</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-sf-muted">
            {hasCoa
              ? 'The lab report for the batch this product was filled from.'
              : "This product's lot is released with a certificate on file at the dispensing pharmacy. Ask us and we'll send the report for the batch you received."}
          </p>
        </div>
      </div>

      {facts.length > 0 && (
        <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 border-b border-sf-line pb-1.5">
              <dt className="text-[11px] uppercase tracking-[0.06em] text-sf-muted">{label}</dt>
              <dd className="text-[12px] font-semibold text-sf-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
        {hasCoa ? (
          <a
            href={product.coa_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sf-ink underline decoration-sf-line underline-offset-4 hover:decoration-sf-accent"
          >
            View the report
          </a>
        ) : (
          <a
            href={PHONE_SMS}
            className="font-semibold text-sf-ink underline decoration-sf-line underline-offset-4 hover:decoration-sf-accent"
          >
            Text {PHONE_DISPLAY} for this lot's COA
          </a>
        )}
        <span className="text-sf-muted">Filled by a state-licensed 503A pharmacy.</span>
      </div>
    </section>
  );
}