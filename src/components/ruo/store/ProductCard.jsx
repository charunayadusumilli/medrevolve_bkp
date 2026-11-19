import React from 'react';
import { Link } from 'react-router-dom';
import { money } from '@/lib/ruo/shop';

export default function ProductCard({ product }) {
  const price = Number(product.retail_price) || 0;

  return (
    <article className="group flex h-full flex-col border border-ruo-line bg-ruo-surface">
      <Link to={`/ruo/p/${product.slug}`} className="block aspect-square overflow-hidden bg-white">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">
            Image pending
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-accent">
          {product.research_area}
        </p>

        <Link
          to={`/ruo/p/${product.slug}`}
          className="mt-2 text-[14px] font-semibold leading-snug text-ruo-ink"
        >
          {product.name}
        </Link>

        {product.strength_label && (
          <p className="mt-1 font-mono text-[10px] text-ruo-muted">{product.strength_label}</p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-[14px] tabular-nums text-ruo-ink">{money(price)}</span>
          {product.in_stock === false && (
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ruo-warn">
              Backordered
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="border border-ruo-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ruo-muted">
            {product.purity ? `${product.purity} HPLC` : 'Purity pending'}
          </span>
          {product.coa_lot && (
            <span className="border border-ruo-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ruo-muted">
              Lot {product.coa_lot}
            </span>
          )}
          {product.coa_url ? (
            <span className="border border-ruo-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ruo-ink">
              COA on file
            </span>
          ) : (
            <span className="border border-ruo-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ruo-warn">
              COA pending
            </span>
          )}
        </div>

        <Link
          to={`/ruo/p/${product.slug}`}
          className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-ink underline underline-offset-4"
        >
          Lot and COA
        </Link>
      </div>
    </article>
  );
}