import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { addCase, bulkDiscountFor } from '@/lib/ruo/cart';
import { ruoMoney } from '@/lib/ruo/catalog';
import BulkLadder from '@/components/ruo/BulkLadder';

export default function RuoProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.RUOProduct.filter({ slug }, { limit: 1 })
      .then((page) => setProduct(page.items?.[0] || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="h-72 animate-pulse rounded-xl bg-site-surface" /></div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-[30px]">Compound not found</h1>
        <p className="mt-3 text-[13px] text-site-greige">This lot may have been retired.</p>
        <Link to="/catalog" className="mt-6 inline-flex rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream">Back to catalog</Link>
      </div>
    );
  }

  const discount = bulkDiscountFor(cases);
  const gross = product.price * cases;
  const net = gross - gross * discount;

  const add = () => {
    addCase(product, cases);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
      <Link to="/catalog" className="text-[12px] font-semibold text-site-greige underline underline-offset-4">Catalog</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          {product.image_url && (
            <img src={product.image_url} alt={product.name} className="aspect-[4/3] w-full rounded-xl object-cover" />
          )}
          <div className="mt-4 rounded-xl border border-site-line bg-site-surface p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Batch documentation</p>
            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between gap-4"><dt className="text-site-greige">Batch</dt><dd className="font-semibold">{product.batch_code}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-site-greige">Purity (HPLC)</dt><dd className="font-semibold">{product.purity}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-site-greige">Tested</dt><dd className="font-semibold">{product.tested_on}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-site-greige">Case</dt><dd className="font-semibold">{product.case_size} vials of {product.size}</dd></div>
            </dl>
            <Link to={product.coa_url || '/lab-results'} className="mt-4 inline-flex text-[12px] font-semibold text-site-rust underline underline-offset-4">
              View certificate of analysis
            </Link>
          </div>
        </div>

        <div>
          <h1 className="font-display text-[34px] leading-tight tracking-tight sm:text-[40px]">{product.name}</h1>
          <p className="mt-3 text-[14px] font-semibold">
            {ruoMoney(product.price)} <span className="text-[12px] font-medium text-site-greige">/ case</span>
          </p>
          {product.compare_at_price && (
            <p className="mt-1 text-[12px] text-site-greige line-through">{ruoMoney(product.compare_at_price)} list</p>
          )}

          <p className="mt-5 text-[13px] leading-relaxed text-site-greige">{product.description}</p>

          <div className="mt-6 rounded-xl border border-site-line bg-site-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">Cases</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCases((n) => Math.max(1, n - 1))} className="h-8 w-8 rounded-lg border border-site-line">−</button>
                <span className="w-8 text-center text-[13px] font-semibold">{cases}</span>
                <button type="button" onClick={() => setCases((n) => Math.min(product.quantity_limit || 12, n + 1))} className="h-8 w-8 rounded-lg border border-site-line">+</button>
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-site-line pt-3 text-[14px]">
              <span className="font-semibold">Order total</span>
              <span className="font-display text-[24px]">{ruoMoney(net)}</span>
            </div>
            {discount > 0 && (
              <p className="mt-1 text-right text-[11px] text-site-rust">Bulk discount applied: {Math.round(discount * 100)}%</p>
            )}
          </div>

          <button
            type="button"
            onClick={add}
            disabled={product.in_stock === false}
            className="mt-4 w-full rounded-lg bg-site-moss px-5 py-3.5 text-[14px] font-semibold text-site-cream disabled:opacity-40"
          >
            {product.in_stock === false ? 'Backordered' : added ? 'Added to cart' : 'Add to cart'}
          </button>

          <div className="mt-4"><BulkLadder /></div>

          <div className="mt-6 space-y-2 text-[12px] text-site-greige">
            <p><span className="font-semibold text-site-moss">Storage:</span> {product.storage}</p>
            <p><span className="font-semibold text-site-moss">Handling:</span> For in-vitro laboratory research only. Not for human or animal consumption.</p>
          </div>
        </div>
      </div>
    </section>
  );
}