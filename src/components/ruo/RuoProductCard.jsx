import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addCase } from '@/lib/ruo/cart';
import { ruoMoney } from '@/lib/ruo/catalog';
import BulkLadder from './BulkLadder';

export default function RuoProductCard({ product }) {
  const [added, setAdded] = useState(false);

  const add = () => {
    addCase(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group flex h-full flex-col rounded-xl border border-site-line bg-site-surface">
      <Link to={`/ruo/${product.slug}`} className="overflow-hidden rounded-t-xl">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/ruo/${product.slug}`} className="font-display text-[21px] leading-tight">{product.name}</Link>
        <p className="mt-1 text-[11px] text-site-greige">
          Case of {product.case_size} · Batch {product.batch_code} · {product.purity} purity
        </p>
        <p className="mt-3 text-[15px] font-semibold">
          {ruoMoney(product.price)}
          <span className="ml-1 text-[11px] font-medium text-site-greige">/ case</span>
        </p>

        <div className="mt-3"><BulkLadder compact /></div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={add}
            disabled={product.in_stock === false}
            className="flex-1 rounded-lg bg-site-moss px-4 py-2.5 text-[12px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
          >
            {product.in_stock === false ? 'Backordered' : added ? 'Added' : 'Add case'}
          </button>
          <Link
            to={product.coa_url || '/lab-results'}
            className="rounded-lg border border-site-line px-3 py-2.5 text-[12px] font-semibold text-site-moss hover:border-site-moss"
          >
            COA
          </Link>
        </div>
      </div>
    </article>
  );
}