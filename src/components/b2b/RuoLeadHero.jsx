import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { RUO_CATALOG_URL, RUO_DISCLAIMER } from '@/lib/partner/offerings';

export default function RuoLeadHero() {
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const openCatalog = (e) => {
    if (!confirmed) {
      e.preventDefault();
      setError('Confirm you are 21 or older to open the research catalog.');
    }
  };

  return (
    <section className="bg-site-moss text-site-cream">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Research use only
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-[38px] leading-[1.06] tracking-tight sm:text-[56px]">
          Research-grade compounds. Documented, batch-tested, shipped.
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">
          Bulk supply for licensed laboratories and qualified research buyers. Certificate of analysis on
          every lot. Volume pricing from 5 vials.
        </p>

        <label className="mt-8 flex max-w-xl items-start gap-3 border border-site-cream/25 px-4 py-3.5">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked);
              setError('');
            }}
            className="mt-0.5 h-4 w-4 accent-site-cream"
          />
          <span className="text-[12px] leading-relaxed text-site-cream/80">
            I confirm I am 21 or older and I am buying these materials for laboratory research only, not for
            human or veterinary use.
          </span>
        </label>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href={RUO_CATALOG_URL}
            onClick={openCatalog}
            aria-disabled={!confirmed}
            className={`inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-[14px] font-semibold transition-opacity duration-200 ${
              confirmed
                ? 'bg-site-rust text-site-cream hover:opacity-90'
                : 'cursor-not-allowed bg-site-rust/40 text-site-cream/60'
            }`}
          >
            View the RUO catalog <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#services"
            className="text-[14px] font-semibold text-site-cream underline decoration-site-cream/30 decoration-1 underline-offset-4 hover:decoration-site-cream"
          >
            Operator services below
          </a>
        </div>

        {error && <p className="mt-3 font-mono text-[11px] text-site-cream">{error}</p>}

        <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-site-cream/45">{RUO_DISCLAIMER}</p>
      </div>
    </section>
  );
}