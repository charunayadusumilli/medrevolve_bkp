import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { money, statusChip, isPrescription, isCompounded } from '@/lib/storefront/catalog';
import QuickAdd from './QuickAdd';

const BADGES = {
  bestseller: 'Bestseller',
  new: 'New',
  value: 'Best value',
};

export default function ProductTile({ product }) {
  const rx = isPrescription(product);
  const chip = statusChip(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sf-line bg-sf-surface">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-sf-paper">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.display_name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-sf-paper" />
        )}
        {BADGES[product.badge] && (
          <span className="absolute left-3 top-3 rounded-full bg-sf-surface/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sf-ink">
            {BADGES[product.badge]}
          </span>
        )}
        {product.in_stock === false && (
          <span className="absolute right-3 top-3 rounded-full bg-sf-ink/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.slug}`} className="text-[15px] font-semibold leading-snug hover:underline">
          {product.display_name}
        </Link>
        {product.generic_name && (
          <p className="mt-0.5 text-[12px] text-sf-muted">{product.generic_name}</p>
        )}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[17px] font-semibold">
            {rx
              ? `Starting at ${money(product.subscription_price ?? product.price)}/mo`
              : product.subscription_price != null
                ? `${money(product.subscription_price)}/mo`
                : `${money(product.price)} one-time`}
          </span>
          {product.compare_at_price > product.price && (
            <span className="text-[12px] text-sf-muted line-through">{money(product.compare_at_price)}</span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-sf-muted">
          {rx
            ? 'after provider approval'
            : product.subscription_price != null
              ? `or ${money(product.price)} one-time`
              : 'one-time purchase'}
        </p>

        {isCompounded(product) && (
          <span className={`mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${chip.className}`}>
            {chip.label}
          </span>
        )}

        <div className="mt-auto pt-4">
          {rx ? (
            <Link
              to={`/intake/${product.category}?product=${product.slug}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-sf-ink px-4 py-2 text-[12px] font-semibold text-sf-ink transition-colors hover:bg-sf-ink hover:text-white"
            >
              Start intake
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <QuickAdd product={product} className="w-full" />
          )}
        </div>
      </div>
    </article>
  );
}