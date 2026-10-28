import React from 'react';
import { money } from '@/lib/storefront/catalog';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/storefront/cart';

export default function CartSummary({ totals, blocked, onCheckout, subscriptions = [] }) {
  const away = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.netSubtotal);

  return (
    <div className="rounded-2xl border border-sf-line bg-sf-surface p-5">
      <h2 className="text-[15px] font-semibold">Summary</h2>

      <dl className="mt-4 space-y-2.5 text-[13px]">
        <div className="flex justify-between text-sf-muted">
          <dt>Subtotal</dt>
          <dd className="text-sf-ink">{money(totals.grossSubtotal)}</dd>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between text-sf-accent">
            <dt>Subscription savings</dt>
            <dd>−{money(totals.savings)}</dd>
          </div>
        )}
        {subscriptions.length > 0 && (
          <div className="flex justify-between text-sf-muted">
            <dt>Subscriptions</dt>
            <dd className="text-right text-sf-ink">
              {subscriptions.length} item{subscriptions.length === 1 ? '' : 's'} · every{' '}
              {subscriptions[0].cadence_days || 30} days
            </dd>
          </div>
        )}
        <div className="flex justify-between text-sf-muted">
          <dt>Shipping</dt>
          <dd className="text-sf-ink">{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between text-sf-muted">
          <dt>Estimated tax</dt>
          <dd className="text-sf-ink">{money(totals.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-sf-line pt-3 text-[15px] font-semibold">
          <dt>Total</dt>
          <dd>{money(totals.total)}</dd>
        </div>
      </dl>

      {away > 0 && (
        <p className="mt-3 rounded-xl bg-sf-paper p-2.5 text-[11px] text-sf-muted">
          Add {money(away)} for free shipping.
        </p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        disabled={blocked}
        className="mt-5 w-full rounded-full bg-sf-ink px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-sf-line disabled:text-sf-muted"
      >
        Continue to checkout
      </button>

      {blocked && (
        <p className="mt-3 text-[11px] text-red-700">
          Remove the items unavailable in your state to continue.
        </p>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-sf-muted">
        Free shipping over {money(FREE_SHIPPING_THRESHOLD)}. Tax is an estimate; final tax is
        calculated at checkout.
      </p>
    </div>
  );
}