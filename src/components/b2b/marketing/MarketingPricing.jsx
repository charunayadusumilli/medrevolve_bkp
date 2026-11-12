import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { ALA_CARTE, MARKETING_CHECKOUT_URL, PRICING_NOTE } from '@/lib/partner/marketingPage';

const INCLUDED = ['Channel build', 'Lifecycle flows', 'Weekly market scan', 'Monthly reporting'];

const toRow = (record) => ({
  slug: record.slug,
  name: record.name,
  price: record.price_label,
  to: record.service_path || `/services/${record.slug}`,
});

export default function MarketingPricing() {
  // Prices come from the ServiceCatalog entity (Partner Services); the static
  // catalog in marketingPage.js is the fallback if the entity has no rows yet.
  const [rows, setRows] = useState(ALA_CARTE);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const page = await base44.entities.ServiceCatalog.filter(
          { category: 'Partner Services', active: true },
          { sort: 'display_order', limit: 20 }
        );
        const items = (page.items || []).filter((r) => r.slug).map(toRow);
        if (active && items.length) setRows(items);
      } catch {
        // Keep the built-in catalog rows.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Pricing
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
          One engine, priced plainly
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <article className="border border-site-line bg-site-cream p-6 sm:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-site-greige">
              Partner-referred services
            </p>
            <h3 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-site-moss">
              Marketing Engine
            </h3>
            <p className="mt-3 text-[20px] font-semibold text-site-rust">$1,500 setup</p>
            <p className="text-[14px] font-semibold text-site-rust">then $2,500 per month</p>

            <ul className="mt-5 space-y-2">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[13px] text-site-greige">
                  <Check className="h-3.5 w-3.5 shrink-0 text-site-rust" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={MARKETING_CHECKOUT_URL}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-site-rust px-6 py-3 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90"
            >
              Get the marketing engine
            </a>
          </article>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">
              Add only what you need
            </p>
            <ul className="mt-3 border border-site-line bg-site-cream">
              {rows.map((item) => (
                <li key={item.slug} className="border-b border-site-line last:border-b-0">
                  <Link
                    to={item.to}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-site-surface"
                  >
                    <span>
                      <span className="block text-[14px] font-semibold text-site-moss">{item.name}</span>
                      <span className="mt-1 block font-mono text-[11px] text-site-rust">{item.price}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-site-greige" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-md text-[12px] leading-relaxed text-site-greige">{PRICING_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}