import React from 'react';
import { Link } from 'react-router-dom';
import PayButtons from './PayButtons';
import { getServiceDetail } from '@/lib/partner/serviceDetailContent';

/** The full detail block for one service, anchored so the table rows can jump to it. */
export default function ServiceDetailBlock({ service }) {
  const detail = getServiceDetail(service.slug);

  return (
    <article
      id={service.slug}
      className="scroll-mt-28 border border-site-line bg-site-surface p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-site-greige">{service.group}</p>
          <h3 className="mt-2 font-display text-[26px] leading-tight tracking-tight text-site-moss">
            {service.name}
          </h3>
        </div>
        <p className="text-[18px] font-semibold text-site-rust">{service.price}</p>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">What you get</p>
          <ul className="mt-3 space-y-2">
            {service.included.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-site-greige">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-site-rust" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Who it is for</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-site-greige">{detail.audience}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Timeline</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-site-greige">{detail.timeline}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-site-line pt-5">
        <PayButtons payments={service.payments} serviceSlug={service.slug} />
        {service.slug === 'marketing-engine' && (
          <Link
            to="/marketing"
            className="mt-3 inline-block text-[12px] font-semibold text-site-rust underline decoration-site-line underline-offset-4 hover:decoration-site-rust"
          >
            See what&apos;s included
          </Link>
        )}
      </div>
    </article>
  );
}