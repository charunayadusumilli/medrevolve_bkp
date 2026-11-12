import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AUDIENCES } from '@/lib/partner/marketingPage';

function AudienceCta({ cta }) {
  const className =
    'mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss';
  if (cta.to) {
    return (
      <Link to={cta.to} className={className}>
        {cta.label} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    );
  }
  return (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
      {cta.label} <ArrowRight className="h-3.5 w-3.5" />
    </a>
  );
}

export default function MarketingAudiences() {
  return (
    <section className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Who it&apos;s for
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
          Built for brands at every stage
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <article
              key={audience.title}
              className="flex flex-col border border-site-line bg-site-surface p-5 sm:p-6"
            >
              <h3 className="font-display text-[22px] leading-snug tracking-tight text-site-moss">
                {audience.title}
              </h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-site-greige">{audience.body}</p>
              <AudienceCta cta={audience.cta} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}