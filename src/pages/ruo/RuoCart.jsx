import React from 'react';
import { Link } from 'react-router-dom';
import useRuoCart from '@/hooks/useRuoCart';
import { readRuoCart, removeCase, ruoTotals, setCaseQuantity } from '@/lib/ruo/cart';
import { ruoMoney } from '@/lib/ruo/catalog';
import BulkLadder from '@/components/ruo/BulkLadder';

export default function RuoCart() {
  const cart = useRuoCart();
  const totals = ruoTotals(cart);

  if (cart.lines.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-[32px]">No cases in the cart</h1>
        <p className="mt-3 text-[13px] text-site-greige">Order by the case; volume tiers apply automatically.</p>
        <Link to="/catalog" className="mt-7 inline-flex rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream">
          Browse the catalog
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
      <h1 className="font-display text-[34px] leading-tight tracking-tight sm:text-[42px]">Research cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-site-line rounded-xl border border-site-line bg-site-surface">
          {cart.lines.map((line) => (
            <div key={line.sku} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-4">
                {line.image_url && <img src={line.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                <div>
                  <Link to={`/ruo/${line.slug}`} className="text-[14px] font-semibold">{line.name}</Link>
                  <p className="mt-0.5 text-[11px] text-site-greige">
                    Case of {line.case_size} · Batch {line.batch_code} · {ruoMoney(line.unit_price)}/case
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCaseQuantity(line.sku, line.quantity - 1)}
                    className="h-8 w-8 rounded-lg border border-site-line"
                  >−</button>
                  <span className="w-6 text-center text-[13px] font-semibold">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setCaseQuantity(line.sku, line.quantity + 1)}
                    className="h-8 w-8 rounded-lg border border-site-line"
                  >+</button>
                </div>
                <p className="w-20 text-right text-[13px] font-semibold">{ruoMoney(line.unit_price * line.quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeCase(line.sku)}
                  className="text-[11px] text-site-greige underline underline-offset-4 hover:text-site-rust"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-site-line bg-site-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Order summary</p>
          <dl className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between"><dt className="text-site-greige">Cases</dt><dd>{totals.cases}</dd></div>
            <div className="flex justify-between"><dt className="text-site-greige">Subtotal</dt><dd>{ruoMoney(totals.gross)}</dd></div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-site-rust">
                <dt>Bulk discount ({Math.round(totals.discountRate * 100)}%)</dt>
                <dd>−{ruoMoney(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between"><dt className="text-site-greige">Cold-chain shipping</dt><dd>{totals.shipping === 0 ? 'Included' : ruoMoney(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-site-line pt-3 text-[15px] font-semibold">
              <dt>Total</dt><dd>{ruoMoney(totals.total)}</dd>
            </div>
          </dl>

          <Link
            to="/checkout"
            className="mt-5 flex justify-center rounded-lg bg-site-moss px-5 py-3.5 text-[13px] font-semibold text-site-cream"
          >
            Checkout
          </Link>
          <p className="mt-3 text-[11px] leading-relaxed text-site-greige">
            Business verification is required before the first shipment. Net-30 invoicing is available on
            approved accounts.
          </p>
          <div className="mt-4"><BulkLadder compact /></div>
        </aside>
      </div>
    </section>
  );
}