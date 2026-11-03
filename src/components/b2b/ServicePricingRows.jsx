import React from 'react';
import PayButtons from './PayButtons';

/**
 * One price table: name, what is included, price, one primary checkout button,
 * and a jump link down to the full detail block for that service.
 */
export default function ServicePricingRows({ label, services }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">{label}</p>
      <div className="mt-3 border border-site-line bg-site-surface">
        <div className="hidden border-b border-site-line px-6 py-3 sm:grid sm:grid-cols-[1.2fr_1.5fr_0.8fr_1.1fr] sm:items-center sm:gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Service</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">What is included</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Price</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Checkout</span>
        </div>

        {services.map((service) => (
          <div
            key={service.slug}
            className="grid gap-3 border-b border-site-line px-5 py-5 last:border-b-0 sm:grid-cols-[1.2fr_1.5fr_0.8fr_1.1fr] sm:items-start sm:gap-4 sm:px-6"
          >
            <p className="text-[15px] font-semibold leading-snug text-site-moss">{service.name}</p>

            <p className="line-clamp-2 text-[13px] leading-relaxed text-site-greige">{service.detail}</p>

            <p className="text-[15px] font-semibold text-site-rust sm:text-[14px]">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-site-greige sm:hidden">
                Price
              </span>
              {service.price}
            </p>

            <div>
              <PayButtons payments={service.payments.slice(0, 1)} serviceSlug={service.slug} compact />
              <a
                href={`#${service.slug}`}
                className="mt-2 inline-block text-[11px] font-semibold text-site-greige underline decoration-site-line underline-offset-4 hover:decoration-site-greige"
              >
                See what is included
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}