import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import useCaseCart from '@/hooks/useCaseCart';
import { bySku } from '@/lib/ruo/storefront';
import { lineSavings, lineTotal, money, nextTierNudge, unitPrice } from '@/lib/ruo/pricing';
import { removeUnits, setUnits, totalUnits } from '@/lib/ruo/storeCart';

const FLAT_SHIPPING = 18;
const FREE_SHIPPING_AT = 4;

export default function RuoCaseCartPage() {
  const cart = useCaseCart();
  const [products, setProducts] = useState(null);

  const skuKey = cart.lines.map((l) => l.sku).sort().join(',');

  useEffect(() => {
    if (!skuKey) {
      setProducts(new Map());
      return;
    }
    base44.entities.RUOProduct
      .filter({ sku: { $in: skuKey.split(',') } }, { limit: 100 })
      .then((page) => setProducts(bySku(page?.items)))
      .catch(() => setProducts(new Map()));
  }, [skuKey]);

  const units = totalUnits(cart);
  const lines = cart.lines
    .map((line) => ({ line, product: products?.get(line.sku) }))
    .filter((row) => row.product);
  const subtotal = lines.reduce((sum, r) => sum + lineTotal(r.product, r.line.quantity), 0);
  const shipping = lines.length === 0 || units >= FREE_SHIPPING_AT ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  if (cart.lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-muted">Case cart</p>
        <h1 className="mt-3 text-[26px] font-semibold tracking-tight">No units in the cart</h1>
        <Link
          to="/ruo/catalog"
          className="mt-6 inline-block bg-ruo-ink px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg"
        >
          Open the catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between border-b border-ruo-ink pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Case cart</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-tight">{units} unit{units === 1 ? '' : 's'}</h1>
        </div>
        <Link to="/ruo/catalog" className="font-mono text-[10px] uppercase tracking-[0.12em] underline underline-offset-4">
          Continue catalog
        </Link>
      </div>

      {products === null && (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
          Pricing the cart…
        </p>
      )}

      {products !== null && (
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {lines.map(({ line, product }) => {
              const unit = unitPrice(product, line.quantity);
              const savings = lineSavings(product, line.quantity);
              const nudge = nextTierNudge(product, line.quantity);
              return (
                <div key={line.sku} className="border-b border-ruo-line py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold">{product.display_name}</p>
                      <p className="mt-1 font-mono text-[10px] text-ruo-muted">
                        Lot {product.lot_number} · {product.mg ? `${product.mg} mg` : '—'} ·{' '}
                        {product.purity_pct != null ? `${product.purity_pct}%` : 'purity pending'}
                      </p>
                    </div>
                    <p className="font-mono text-[13px] tabular-nums">{money(lineTotal(product, line.quantity))}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-stretch border border-ruo-line">
                      <button
                        type="button"
                        onClick={() => setUnits(line.sku, line.quantity - 1)}
                        className="w-8 border-r border-ruo-line font-mono"
                        aria-label="Decrease units"
                      >
                        −
                      </button>
                      <input
                        value={line.quantity}
                        onChange={(e) => setUnits(line.sku, e.target.value)}
                        className="w-11 bg-transparent text-center font-mono text-[12px] tabular-nums outline-none"
                        inputMode="numeric"
                        aria-label="Units"
                      />
                      <button
                        type="button"
                        onClick={() => setUnits(line.sku, line.quantity + 1)}
                        className="w-8 border-l border-ruo-line font-mono"
                        aria-label="Increase units"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ruo-muted">
                      {money(unit)} / unit
                    </p>

                    <button
                      type="button"
                      onClick={() => removeUnits(line.sku)}
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-ruo-warn underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>

                  {savings > 0 && (
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ruo-accent">
                      You save {money(savings)} at this volume
                    </p>
                  )}
                  {nudge && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ruo-muted">
                      Add {nudge.add} more to reach {nudge.label} pricing (
                      {money(product[nudge.field])} / unit)
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <aside className="h-fit border border-ruo-ink p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">Order summary</p>
            <dl className="mt-4 space-y-2 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-ruo-muted">Subtotal ({units} units)</dt>
                <dd className="font-mono tabular-nums">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ruo-muted">Shipping</dt>
                <dd className="font-mono tabular-nums">{shipping === 0 ? 'Included' : money(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ruo-ink pt-3 text-[14px] font-semibold">
                <dt>Total</dt>
                <dd className="font-mono tabular-nums">{money(total)}</dd>
              </div>
            </dl>

            <Link
              to="/ruo/checkout"
              className="mt-5 block bg-ruo-ink px-5 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg"
            >
              Proceed to billing
            </Link>

            <p className="mt-4 text-[10px] leading-relaxed text-ruo-muted">
              Volume pricing applies automatically per line and is recalculated here as quantities change.
              ACH and wire are available on orders of $2,000 and above.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}