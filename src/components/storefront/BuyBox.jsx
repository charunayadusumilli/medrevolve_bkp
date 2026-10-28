import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShieldCheck, Truck, ArrowUpRight, Check } from 'lucide-react';
import { money, statusChip, isPrescription, isCompounded } from '@/lib/storefront/catalog';
import { addLine, resolveUnitPrice } from '@/lib/storefront/cart';
import { useToast } from '@/components/ui/use-toast';
import { INTAKE_BANNER } from './QuickAdd';

export default function BuyBox({ product, onGuardedAdd }) {
  const rx = isPrescription(product);
  const limit = product.quantity_limit || 6;
  const cadences = product.subscription_cadences?.length ? product.subscription_cadences : [30, 60, 90];
  const [dose, setDose] = useState(product.dose_options?.[0]?.label);
  const [purchaseType, setPurchaseType] = useState('one_time');
  const [cadence, setCadence] = useState(cadences[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  const inStock = product.in_stock !== false;
  const unitPrice = resolveUnitPrice(product, purchaseType, dose);
  const subscribedPrice = resolveUnitPrice(product, 'subscription', dose);
  const unitSave = Math.max(0, resolveUnitPrice(product, 'one_time', dose) - subscribedPrice);
  const atCeiling = quantity >= limit;

  const handleAdd = () => {
    // Rail guard — a prescription SKU can never be added to the basket.
    if (rx) {
      onGuardedAdd?.();
      return;
    }
    addLine(product, { quantity, purchaseType, cadenceDays: cadence, doseLabel: dose });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    toast({ title: 'Added to basket', description: `${quantity} × ${product.display_name}` });
  };

  if (rx) {
    return (
      <div className="rounded-2xl border border-sf-line bg-sf-surface p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[34px] font-display leading-none">
            Starting at {money(product.subscription_price ?? product.price)}
            <span className="font-body text-base text-sf-muted">/mo</span>
          </p>
          {product.compare_at_price > product.price && (
            <p className="text-sm text-sf-muted line-through">{money(product.compare_at_price)}</p>
          )}
        </div>
        <p className="mt-1 text-[12px] text-sf-muted">after provider approval</p>
        {isCompounded(product) && (
          <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusChip(product).className}`}>
            {statusChip(product).label}
          </span>
        )}

        <Link
          to={`/intake/${product.category}?product=${product.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sf-ink px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start intake
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-center text-[11px] text-sf-muted">
          No charge until a licensed provider approves your treatment.
        </p>

        <div className="mt-5 space-y-2 border-t border-sf-line pt-4 text-[12px] text-sf-muted">
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sf-accent" /> Reviewed by US-licensed providers</p>
          <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-sf-accent" /> Free, discreet shipping</p>
        </div>
        {product.rail === 'prescription' && !product.safety_info && (
          <p className="mt-4 rounded-lg bg-sf-sun/15 p-2 text-[11px] text-[#8a5a12]">
            Safety information is being finalized for this treatment.
          </p>
        )}
        <p className="sr-only">{INTAKE_BANNER}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sf-line bg-sf-surface p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-[34px] font-display leading-none">{money(unitPrice)}</p>
        {product.compare_at_price > product.price && (
          <p className="text-sm text-sf-muted line-through">{money(product.compare_at_price)}</p>
        )}
        {purchaseType === 'subscription' && unitSave > 0 && (
          <span className="rounded-full bg-sf-accent-soft px-2 py-0.5 text-[11px] font-semibold text-sf-accent">
            Save {money(unitSave)}
          </span>
        )}
      </div>

      {product.dose_options?.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sf-muted">Strength</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.dose_options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setDose(option.label)}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  dose === option.label
                    ? 'border-sf-ink bg-sf-ink text-white'
                    : 'border-sf-line text-sf-ink hover:border-sf-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPurchaseType('one_time')}
          className={`rounded-xl border px-3 py-3 text-left transition-colors ${
            purchaseType === 'one_time' ? 'border-sf-ink bg-sf-paper' : 'border-sf-line'
          }`}
        >
          <span className="block text-[12px] font-semibold">One-time</span>
          <span className="block text-[11px] text-sf-muted">{money(resolveUnitPrice(product, 'one_time', dose))}</span>
        </button>
        <button
          type="button"
          onClick={() => setPurchaseType('subscription')}
          disabled={product.subscription_price == null}
          className={`rounded-xl border px-3 py-3 text-left transition-colors disabled:opacity-50 ${
            purchaseType === 'subscription' ? 'border-sf-ink bg-sf-paper' : 'border-sf-line'
          }`}
        >
          <span className="block text-[12px] font-semibold">Subscribe</span>
          <span className="block text-[11px] text-sf-muted">
            {product.subscription_price != null ? money(subscribedPrice) : 'Not offered'}
          </span>
        </button>
      </div>

      {purchaseType === 'subscription' && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-sf-paper px-3 py-2.5">
          <div>
            <p className="text-[12px] font-semibold">Ships every</p>
            <p className="text-[11px] text-sf-muted">Cancel anytime</p>
          </div>
          <select
            value={cadence}
            onChange={(e) => setCadence(Number(e.target.value))}
            className="rounded-lg border border-sf-line bg-sf-surface px-2 py-1.5 text-[12px] font-medium"
          >
            {cadences.map((days) => (
              <option key={days} value={days}>{days} days</option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-sf-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="grid h-10 w-10 place-items-center rounded-l-full disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            min={1}
            max={limit}
            value={quantity}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) setQuantity(Math.max(1, Math.min(limit, Math.round(next) || 1)));
            }}
            className="h-10 w-12 border-x border-sf-line bg-transparent text-center text-[13px] font-semibold outline-none"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(limit, q + 1))}
            disabled={atCeiling || !inStock}
            title={atCeiling ? `Maximum ${limit} per order.` : undefined}
            className="grid h-10 w-10 place-items-center rounded-r-full disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-sf-muted">Max {limit} per order</p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sf-ink px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:bg-sf-line disabled:text-sf-muted"
      >
        {added ? <Check className="h-4 w-4" /> : null}
        {inStock ? (added ? 'Added to basket' : 'Add to basket') : 'Out of stock — notify me'}
      </button>

      {added && (
        <Link to="/cart" className="mt-3 block text-center text-[12px] font-semibold text-sf-accent underline">
          View basket
        </Link>
      )}

      <div className="mt-5 space-y-2 border-t border-sf-line pt-4 text-[12px] text-sf-muted">
        <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-sf-accent" /> Free shipping over $50</p>
        <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sf-accent" /> Third-party tested, batch COA on request</p>
      </div>
    </div>
  );
}