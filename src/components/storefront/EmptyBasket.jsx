import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Stethoscope } from 'lucide-react';

export default function EmptyBasket() {
  return (
    <div className="rounded-2xl border border-sf-line bg-sf-surface px-6 py-16 text-center">
      <ShoppingBasket className="mx-auto h-8 w-8 text-sf-muted" />
      <h2 className="mt-4 font-display text-[26px] tracking-tight">Your basket is empty</h2>
      <p className="mt-2 text-[13px] text-sf-muted">
        Add labs, supplements or wellness essentials — or start an intake for prescription treatment.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-sf-ink px-6 py-3 text-[13px] font-semibold text-white"
        >
          <ShoppingBasket className="h-4 w-4" /> Browse shop
        </Link>
        <Link
          to="/intake/weight-loss"
          className="inline-flex items-center gap-2 rounded-full border border-sf-ink px-6 py-3 text-[13px] font-semibold text-sf-ink"
        >
          <Stethoscope className="h-4 w-4" /> Start an intake
        </Link>
      </div>
    </div>
  );
}