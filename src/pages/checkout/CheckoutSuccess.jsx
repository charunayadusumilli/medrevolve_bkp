import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { clearCart } from '@/lib/storefront/cart';
import { clearRuoCart } from '@/lib/ruo/cart';
import { detectSite } from '@/lib/siteContext';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const order = params.get('order') || '';
  const site = detectSite();
  const isRuo = site === 'RUO';

  useEffect(() => {
    if (isRuo) clearRuoCart();
    else clearCart();
  }, [isRuo]);

  return (
    <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Payment received</p>
      <h1 className="mt-4 font-display text-[36px] leading-tight tracking-tight sm:text-[44px]">
        Thank you — your order is confirmed.
      </h1>
      <p className="mt-4 text-[14px] leading-relaxed text-site-greige">
        A receipt is on its way to your email. {isRuo
          ? 'We will send the batch documentation and tracking as soon as the cold-chain box leaves the facility.'
          : 'You will get tracking as soon as your order ships.'}
      </p>

      {order && (
        <p className="mt-6 rounded-lg border border-site-line bg-site-surface px-4 py-3 text-[12px] text-site-greige">
          Order reference: <span className="font-semibold text-site-moss">{order.slice(-8).toUpperCase()}</span>
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={isRuo ? '/catalog' : '/shop'} className="rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream">
          {isRuo ? 'Back to the catalog' : 'Keep shopping'}
        </Link>
        <Link to={isRuo ? '/track-order' : '/patient-faq'} className="rounded-lg border border-site-line px-5 py-3 text-[13px] font-semibold text-site-moss">
          {isRuo ? 'Track this order' : 'Questions about my order'}
        </Link>
      </div>
    </section>
  );
}