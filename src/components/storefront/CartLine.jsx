import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { money } from '@/lib/storefront/catalog';
import { setLinePurchaseType, setQuantity, removeLine } from '@/lib/storefront/cart';

const CADENCES = [30, 60, 90];

export default function CartLine({ line, stateLabel }) {
  const limit = line.quantity_limit || 6;
  const atCeiling = line.quantity >= limit;
  const inStock = line.in_stock !== false;
  const subscription = line.purchase_type === 'subscription';
  const restricted = stateLabel && (line.state_restrictions || []).length > 0;

  return (
    <div className="flex gap-4 border-b border-sf-line py-5 last:border-b-0">
      <Link to={`/product/${line.slug}`} className="h-24 w-24 flex-none overflow-hidden rounded-xl bg-sf-paper">
        {line.image_url ? (
          <img src={line.image_url} alt={line.name} className="h-full w-full object-cover" />
        ) : null}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${line.slug}`} className="text-[14px] font-semibold hover:underline">
              {line.name}
            </Link>
            {line.dose_label && <p className="text-[12px] text-sf-muted">{line.dose_label}</p>}
            <p className="mt-1 text-[12px] text-sf-muted">
              {money(line.unit_price)} each
              {subscription && line.subscription_price != null && (
                <span className="ml-1.5 line-through">{money(line.list_price + (line.dose_delta || 0))}</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.id)}
            className="rounded-full p-1.5 text-sf-muted transition-colors hover:bg-sf-paper hover:text-sf-ink"
            aria-label={`Remove ${line.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {!inStock && (
          <p className="mt-2 inline-flex rounded-lg bg-sf-line/60 px-2 py-1 text-[11px] font-semibold text-sf-ink">
            Out of stock — notify me.
          </p>
        )}

        {restricted && (line.state_restrictions || []).includes(stateLabel) && (
          <p className="mt-2 inline-flex rounded-lg bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700">
            Not available in {stateLabel}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-sf-line">
            <button
              type="button"
              onClick={() => setQuantity(line.id, line.quantity - 1)}
              disabled={line.quantity <= 1}
              className="grid h-8 w-8 place-items-center rounded-l-full disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <input
              type="number"
              min={1}
              max={limit}
              value={line.quantity}
              onChange={(e) => setQuantity(line.id, e.target.value)}
              className="h-8 w-10 border-x border-sf-line bg-transparent text-center text-[12px] font-semibold outline-none"
              aria-label={`Quantity for ${line.name}`}
            />
            <button
              type="button"
              onClick={() => setQuantity(line.id, line.quantity + 1)}
              disabled={atCeiling || !inStock}
              title={atCeiling ? `Maximum ${limit} per order.` : !inStock ? 'Out of stock' : undefined}
              className="grid h-8 w-8 place-items-center rounded-r-full disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="inline-flex rounded-full border border-sf-line p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setLinePurchaseType(line.id, 'one_time')}
              className={`rounded-full px-2.5 py-1 font-semibold transition-colors ${
                !subscription ? 'bg-sf-ink text-white' : 'text-sf-muted'
              }`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => setLinePurchaseType(line.id, 'subscription', line.cadence_days || 30)}
              disabled={line.subscription_price == null}
              className={`rounded-full px-2.5 py-1 font-semibold transition-colors disabled:opacity-40 ${
                subscription ? 'bg-sf-accent text-white' : 'text-sf-muted'
              }`}
            >
              Subscribe
            </button>
          </div>

          <span className="ml-auto text-[14px] font-semibold">
            {money(line.unit_price * line.quantity)}
          </span>
        </div>

        {subscription && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-sf-muted">
            <span>Refill every</span>
            <select
              value={line.cadence_days || 30}
              onChange={(e) => setLinePurchaseType(line.id, 'subscription', Number(e.target.value))}
              className="rounded-lg border border-sf-line bg-sf-paper px-2 py-1 text-[11px] font-medium text-sf-ink outline-none"
            >
              {CADENCES.map((days) => (
                <option key={days} value={days}>{days} days</option>
              ))}
            </select>
            <span className="text-sf-accent">Cancel anytime</span>
          </div>
        )}

        {atCeiling && (
          <p className="mt-2 text-[11px] text-sf-muted">Maximum {limit} per order.</p>
        )}
      </div>
    </div>
  );
}