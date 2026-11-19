import React from 'react';
import { Link } from 'react-router-dom';
import useCaseCart from '@/hooks/useCaseCart';
import { totalUnits } from '@/lib/ruo/storeCart';

export default function StickyCart() {
  const cart = useCaseCart();
  const units = totalUnits(cart);

  if (units === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ruo-ink bg-ruo-ink px-4 py-3 text-ruo-bg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:border sm:px-5">
      <Link to="/ruo/cart" className="flex items-center justify-between gap-6 sm:gap-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
          Case cart · {units} unit{units === 1 ? '' : 's'}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-bg/70">
          Review →
        </span>
      </Link>
    </div>
  );
}