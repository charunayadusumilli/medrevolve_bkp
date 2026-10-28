import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import useStoreCart from '@/hooks/useStoreCart';
import { cartTotals, restrictedLines, setShipState } from '@/lib/storefront/cart';
import { US_STATES } from '@/lib/storefront/catalog';
import { applyStoreSeo } from '@/lib/storefront/seo';
import CartLine from '@/components/storefront/CartLine';
import CartSummary from '@/components/storefront/CartSummary';
import EmptyBasket from '@/components/storefront/EmptyBasket';

export default function StoreCart() {
  const cart = useStoreCart();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    applyStoreSeo({
      title: 'Your basket | MedRevolve',
      description: 'Review your MedRevolve basket, choose one-time or subscription pricing, and check delivery eligibility by state.',
      path: '/cart',
    });
  }, []);

  const totals = cartTotals(cart);
  const restricted = restrictedLines(cart, cart.shipState);
  const blocked = restricted.length > 0;

  const handleCheckout = () => {
    setNotice('Checkout opens in the next release. Your basket is saved for 30 days.');
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <nav className="flex items-center gap-2 text-[12px] text-sf-muted">
        <Link to="/" className="hover:text-sf-ink">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-sf-ink">Shop</Link>
        <span>/</span>
        <span className="text-sf-ink">Basket</span>
      </nav>

      <h1 className="mt-6 font-display text-[38px] tracking-tight sm:text-[44px]">Your basket</h1>

      {cart.lines.length === 0 ? (
        <div className="mt-8">
          <EmptyBasket />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div>
            <div className="rounded-2xl border border-sf-line bg-sf-surface px-5">
              {cart.lines.map((line) => (
                <CartLine key={line.id} line={line} stateLabel={cart.shipState} />
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-sf-line bg-sf-surface p-5">
              <label className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] font-semibold">Ship to</span>
                <select
                  value={cart.shipState}
                  onChange={(e) => setShipState(e.target.value)}
                  className="rounded-full border border-sf-line bg-sf-paper px-4 py-2 text-[13px] font-medium outline-none focus:border-sf-ink"
                >
                  <option value="">Select your state</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </label>

              {blocked && (
                <p className="mt-3 rounded-xl bg-red-50 p-3 text-[12px] text-red-700">
                  {restricted.length} item{restricted.length === 1 ? '' : 's'} can't ship to {cart.shipState}.
                  Remove {restricted.length === 1 ? 'it' : 'them'} to continue.
                </p>
              )}

              <p className="mt-3 flex items-center gap-2 text-[11px] text-sf-muted">
                <Truck className="h-3.5 w-3.5 text-sf-accent" />
                Discreet packaging. Free shipping on orders over $50.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary totals={totals} blocked={blocked} onCheckout={handleCheckout} />
            {notice && (
              <p className="mt-3 rounded-xl border border-sf-line bg-sf-surface p-3 text-[12px] text-sf-ink">
                {notice}
              </p>
            )}
            <Link to="/shop" className="mt-4 block text-center text-[12px] font-semibold text-sf-accent hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}