import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TierTable from './TierTable';
import useCaseCart from '@/hooks/useCaseCart';
import { addUnits, buyNowLine, totalUnits } from '@/lib/ruo/storeCart';
import { cartKey, money, nextTierNudge, unitPrice } from '@/lib/ruo/shop';

export default function CaseBuyBox({ product }) {
  const navigate = useNavigate();
  const cart = useCaseCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.in_stock === false;
  const tierPrice = unitPrice(product, quantity);
  const nudge = nextTierNudge(product, quantity);

  const add = () => {
    addUnits(cartKey(product), quantity);
    setAdded(true);
  };

  const buyNow = () => {
    buyNowLine(cartKey(product), quantity);
    navigate('/ruo/checkout');
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-3 border-b border-ruo-line pb-4">
        <span className="font-mono text-[30px] tabular-nums leading-none">{money(unitPrice(product, quantity))}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
          per unit · {quantity >= 6 ? '6+ tier' : quantity >= 3 ? '3+ tier' : '1–2 units'}
        </span>
        {soldOut && (
          <span className="border border-ruo-warn px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ruo-warn">
            Backordered
          </span>
        )}
      </div>

      <div className="mt-4">
        <TierTable product={product} />
      </div>

      <div className="mt-5 flex flex-wrap items-stretch gap-3">
        <div className="flex items-stretch border border-ruo-line">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="w-10 border-r border-ruo-line font-mono"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            value={quantity}
            onChange={(event) => {
              const parsed = Math.round(Number(event.target.value));
              setQuantity(Number.isFinite(parsed) && parsed > 0 ? Math.min(99, parsed) : 1);
            }}
            inputMode="numeric"
            aria-label="Quantity"
            className="w-12 bg-transparent text-center font-mono text-[12px] tabular-nums outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            className="w-10 border-l border-ruo-line font-mono"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={soldOut}
          className="min-w-[180px] flex-1 border border-ruo-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-ruo-ink hover:text-ruo-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? 'Not orderable' : 'Add to case'}
        </button>

        <button
          type="button"
          onClick={buyNow}
          disabled={soldOut}
          className="min-w-[180px] flex-1 bg-ruo-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy now — {money(tierPrice * quantity)}
        </button>
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
        {quantity} unit{quantity === 1 ? '' : 's'} · {money(tierPrice)} each · {money(tierPrice * quantity)} line total
      </p>

      {added && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-accent">
          Added ·{' '}
          <Link to="/ruo/cart" className="underline underline-offset-4">
            Open case cart ({totalUnits(cart)} units)
          </Link>
        </p>
      )}

      {nudge && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ruo-muted">
          Add {nudge.add} more for {nudge.label} at {money(nudge.price)} per unit
        </p>
      )}
    </div>
  );
}