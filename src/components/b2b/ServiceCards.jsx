import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PayButtons from './PayButtons';

/** Landing-page content for one service: what it is, its ballpark, its page, its checkout. */
export default function ServiceCards({ services }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <article
          key={service.slug}
          className="flex flex-col border border-site-line bg-site-surface p-5 sm:p-6"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-site-greige">
            {service.group}
          </p>
          <h3 className="mt-2 font-display text-[22px] leading-snug tracking-tight text-site-moss">
            {service.name}
          </h3>
          <p className="mt-2 flex-1 text-[13px] leading-relaxed text-site-greige">{service.summary}</p>

          <p className="mt-4 border-t border-site-line pt-3 font-mono text-[11px] leading-relaxed text-site-rust">
            Ballpark: {service.ballpark}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              to={`/services/${service.slug}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss"
            >
              Service page <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {service.slug === 'marketing-engine' && (
              <Link
                to="/marketing"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-site-rust underline decoration-site-line underline-offset-4 hover:decoration-site-rust"
              >
                See what&apos;s included <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <PayButtons payments={service.payments.slice(0, 1)} />
          </div>
        </article>
      ))}
    </div>
  );
}