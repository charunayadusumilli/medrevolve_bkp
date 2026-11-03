import React from 'react';
import { STRIPE_DISCLOSURE } from '@/lib/partner/offerings';
import { withTracking } from '@/lib/tracking';

/**
 * Hosted Stripe checkout buttons. External links, new tab, no card data here.
 * Stored utm_* / ref attribution is appended so checkout stays attributable.
 */
export default function PayButtons({ payments = [], serviceSlug, compact = false }) {
  if (!payments.length) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {payments.map((payment) => (
          <a
            key={payment.url}
            href={withTracking(payment.url)}
            target="_blank"
            rel="noopener noreferrer"
            data-service={serviceSlug}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[12px] font-semibold transition-colors duration-200 ${
              payment.primary
                ? 'bg-site-rust text-site-cream hover:opacity-90'
                : 'border border-site-moss text-site-moss hover:bg-site-moss hover:text-site-cream'
            }`}
          >
            {payment.label}
          </a>
        ))}
      </div>
      {!compact && (
        <p className="mt-2 max-w-[34ch] text-[10px] leading-relaxed text-site-greige">{STRIPE_DISCLOSURE}</p>
      )}
    </div>
  );
}