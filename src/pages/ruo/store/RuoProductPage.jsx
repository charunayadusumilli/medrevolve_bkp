import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '@/components/ruo/store/ProductCard';
import RuoDisclaimer from '@/components/ruo/store/RuoDisclaimer';
import TierTable from '@/components/ruo/store/TierTable';
import useCaseCart from '@/hooks/useCaseCart';
import { addUnits, totalUnits } from '@/lib/ruo/storeCart';
import {
  cartKey,
  loadProductBySlug,
  loadProducts,
  money,
  nextTierNudge,
  unitPrice,
} from '@/lib/ruo/shop';

export default function RuoProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(undefined);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const cart = useCaseCart();

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);
    setQuantity(1);
    setAdded(false);

    loadProductBySlug(slug)
      .then((record) => { if (!cancelled) setProduct(record); })
      .catch(() => { if (!cancelled) setProduct(null); });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!product?.research_area) return;
    let cancelled = false;
    loadProducts()
      .then((items) => {
        if (cancelled) return;
        setRelated(
          items
            .filter((item) => item.slug !== product.slug && item.research_area === product.research_area)
            .slice(0, 4),
        );
      })
      .catch(() => { if (!cancelled) setRelated([]); });
    return () => { cancelled = true; };
  }, [product]);

  useEffect(() => {
    const isMissing = product === null;
    if (!isMissing) return undefined;
    const node = document.createElement('meta');
    node.name = 'prerender-status-code';
    node.content = '404';
    document.head.appendChild(node);
    return () => node.remove();
  }, [product]);

  if (product === undefined) {
    return (
      <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ruo-muted">
        Loading record…
      </p>
    );
  }

  if (product === null) {
    return (
      <div className="border border-ruo-line bg-ruo-surface px-6 py-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-warn">Not found</p>
        <h1 className="mt-4 text-[24px] font-semibold tracking-tight">
          That record is not in the catalog.
        </h1>
        <Link
          to="/ruo/catalog"
          className="mt-6 inline-block border border-ruo-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em]"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  const price = Number(product.retail_price) || 0;
  const tierPrice = unitPrice(product, quantity);
  const nudge = nextTierNudge(product, quantity);
  const paragraphs = String(product.long_description || '')
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  const add = () => {
    addUnits(cartKey(product), quantity);
    setAdded(true);
  };

  return (
    <div>
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
        <Link to="/ruo/catalog" className="underline underline-offset-4">Catalog</Link>
        <span>/</span>
        <span className="text-ruo-ink">{product.research_area}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="border border-ruo-line bg-white">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-muted">
              Image pending
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ruo-accent">
            {product.research_area}
          </p>
          <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight sm:text-[36px]">
            {product.name}
          </h1>
          {product.strength_label && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ruo-muted">
              {product.strength_label}
            </p>
          )}
          {product.short_description && (
            <p className="mt-4 text-[13px] leading-relaxed text-ruo-muted">{product.short_description}</p>
          )}

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[24px] tabular-nums">{money(price)}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
              per unit · 1–2 units
            </span>
            {product.in_stock === false && (
              <span className="border border-ruo-warn px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ruo-warn">
                Backordered
              </span>
            )}
          </div>

          <div className="mt-5 border border-ruo-line bg-ruo-surface p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">
              Volume pricing
            </p>
            <div className="mt-2">
              <TierTable product={product} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-stretch border border-ruo-line">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="w-9 border-r border-ruo-line font-mono"
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
                className="w-9 border-l border-ruo-line font-mono"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={add}
              disabled={product.in_stock === false}
              className="flex-1 bg-ruo-ink px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.in_stock === false ? 'Not orderable' : `Add to cart — ${money(tierPrice * quantity)}`}
            </button>
          </div>

          {added && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-accent">
              Added · <Link to="/ruo/cart" className="underline underline-offset-4">Open cart ({totalUnits(cart)} units)</Link>
            </p>
          )}

          {nudge && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ruo-muted">
              Add {nudge.add} more for {nudge.label} at {money(nudge.price)} per unit
            </p>
          )}

          {product.stock_note && (
            <p className="mt-4 border-t border-ruo-line pt-4 text-[11px] leading-relaxed text-ruo-muted">
              {product.stock_note}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-muted">
            Research record
          </h2>
          <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-ruo-ink">
            {paragraphs.length > 0 ? (
              paragraphs.map((text) => <p key={text.slice(0, 40)}>{text}</p>)
            ) : (
              <p className="text-ruo-muted">
                The full research record for this lot is being published. Request it with the lot number
                and it is sent as a document.
              </p>
            )}
          </div>

          <div className="mt-6">
            <RuoDisclaimer />
          </div>
        </div>

        <aside className="h-fit border border-ruo-ink p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">
            Lot and purity
          </p>
          <dl className="mt-4 space-y-3 text-[12px]">
            <div className="flex justify-between gap-3 border-b border-ruo-line pb-2">
              <dt className="text-ruo-muted">Purity</dt>
              <dd className="font-mono">{product.purity || 'Pending release'}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-ruo-line pb-2">
              <dt className="text-ruo-muted">Lot</dt>
              <dd className="font-mono">{product.coa_lot || '—'}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-ruo-line pb-2">
              <dt className="text-ruo-muted">Laboratory</dt>
              <dd className="text-right">{product.lab_name || 'Vanguard Laboratory'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ruo-muted">Strength</dt>
              <dd className="font-mono">{product.strength_label || (product.mg ? `${product.mg} mg` : '—')}</dd>
            </div>
          </dl>

          <div className="mt-5 space-y-2">
            {product.coa_url ? (
              <a
                href={product.coa_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-ruo-ink px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                Open the lot COA
              </a>
            ) : (
              <p className="border border-ruo-line px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ruo-muted">
                COA pending release
              </p>
            )}
            {product.coa_lot && (
              <Link
                to={`/ruo/verify?lot=${encodeURIComponent(product.coa_lot)}`}
                className="block border border-ruo-line px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-muted"
              >
                Verify this lot
              </Link>
            )}
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-ruo-muted">
            Reports are hosted by the testing laboratory, not published by us.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-ruo-line pt-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-muted">
            More in {product.research_area}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id || item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}