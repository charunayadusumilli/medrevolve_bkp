import React from 'react';
import { STRIPE_DISCLOSURE } from '@/lib/partner/offerings';

/**
 * Hosted Stripe checkout buttons. External links, new tab, no card data here.
 * One payment renders a single button; services with a monthly component render two.
 */
export default function PayButtons({ payments = [] }) {
  if (!payments.length) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {payments.map((payment) => (
          <a
            key={payment.url}
            href={payment.url}
            target="_blank"
            rel="noopener noreferrer"
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
      <p className="mt-2 max-w-[34ch] text-[10px] leading-relaxed text-site-greige">{STRIPE_DISCLOSURE}</p>
    </div>
  );
}