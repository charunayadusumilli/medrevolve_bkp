import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BatchAnalysis from '@/components/ruo/store/BatchAnalysis';
import CaseBuyBox from '@/components/ruo/store/CaseBuyBox';
import ProductCard from '@/components/ruo/store/ProductCard';
import ProductFaq, { productFaq } from '@/components/ruo/store/ProductFaq';
import StrengthPills from '@/components/ruo/store/StrengthPills';
import UgcRail from '@/components/ruo/store/UgcRail';
import RuoDisclaimer from '@/components/ruo/store/RuoDisclaimer';
import {
  applyProductSeo,
  faqSchema,
  injectJsonLd,
  productSchema,
  removeJsonLd,
} from '@/lib/ruo/seo';
import { loadProductBySlug, loadProducts, strengthSiblings } from '@/lib/ruo/shop';

const COMPLIANCE = [
  'Not a 503A or 503B pharmacy',
  'Not for human or veterinary use',
  'No medical advice',
  '21+ only',
];

export default function RuoProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(undefined);
  const [all, setAll] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);

    loadProductBySlug(slug)
      .then((record) => { if (!cancelled) setProduct(record); })
      .catch(() => { if (!cancelled) setProduct(null); });

    loadProducts()
      .then((items) => { if (!cancelled) setAll(items); })
      .catch(() => { if (!cancelled) setAll([]); });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    const isMissing = product === null;
    if (!isMissing) return undefined;
    const node = document.createElement('meta');
    node.name = 'prerender-status-code';
    node.content = '404';
    document.head.appendChild(node);
    return () => node.remove();
  }, [product]);

  useEffect(() => {
    if (!product) return undefined;
    applyProductSeo(product);
    injectJsonLd('ruo-product', productSchema(product));
    injectJsonLd('ruo-product-faq', faqSchema(productFaq(product)));
    return () => {
      removeJsonLd('ruo-product');
      removeJsonLd('ruo-product-faq');
    };
  }, [product]);

  const strengths = useMemo(() => strengthSiblings(product, all), [product, all]);

  const related = useMemo(() => {
    if (!product) return [];
    return all
      .filter((item) => item.slug !== product.slug && item.research_area === product.research_area)
      .slice(0, 4);
  }, [product, all]);

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

  const paragraphs = String(product.long_description || '')
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <div>
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
        <Link to="/ruo/catalog" className="underline underline-offset-4">Catalog</Link>
        <span>/</span>
        <span>{product.research_area}</span>
        <span>/</span>
        <span className="text-ruo-ink">{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="border border-ruo-line bg-white">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-muted">
              Image pending
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ruo-accent">
            {product.research_area} · Research use only
          </p>
          <h1 className="mt-3 text-[32px] font-semibold uppercase leading-[0.98] tracking-[-0.02em] sm:text-[46px]">
            {product.name}
          </h1>

          <div className="mt-4">
            <StrengthPills options={strengths} currentSlug={product.slug} />
          </div>

          {product.strength_label && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ruo-muted">
              {product.strength_label}
              {product.mg ? ` · ${product.mg} mg fill` : ''}
            </p>
          )}

          {product.short_description && (
            <p className="mt-4 text-[13px] leading-relaxed text-ruo-muted">{product.short_description}</p>
          )}

          <div className="mt-6">
            <CaseBuyBox product={product} />
          </div>

          {product.stock_note && (
            <p className="mt-4 border-t border-ruo-line pt-4 text-[11px] leading-relaxed text-ruo-muted">
              {product.stock_note}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <BatchAnalysis product={product} />
      </div>

      <UgcRail surface="product" title="Research feed" />

      <div className="mt-12 grid gap-10 border-t border-ruo-ink pt-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-muted">
            Research documentation
          </h2>
          <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-ruo-ink">
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
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-muted">Record summary</p>
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
              <dd className="font-mono">
                {product.strength_label || (product.mg ? `${product.mg} mg` : '—')}
              </dd>
            </div>
          </dl>

          {product.coa_lot && (
            <Link
              to={`/ruo/verify?lot=${encodeURIComponent(product.coa_lot)}`}
              className="mt-5 block border border-ruo-line px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-muted"
            >
              Verify this lot
            </Link>
          )}

          <p className="mt-4 text-[10px] leading-relaxed text-ruo-muted">
            Reports are hosted by the testing laboratory, not published by us.
          </p>
        </aside>
      </div>

      <ProductFaq product={product} />

      {related.length > 0 && (
        <section className="mt-12 border-t border-ruo-line pt-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-muted">
            Related compounds in {product.research_area}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id || item.slug} product={item} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-ruo-line pt-6">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ruo-muted">
          {COMPLIANCE.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px]">
          <Link to="/ruo/documentation" className="underline underline-offset-4">Payment policy</Link>
          <Link to="/ruo/documentation" className="underline underline-offset-4">Shipping policy</Link>
          <Link to="/ruo/coas" className="underline underline-offset-4">COA library</Link>
          <Link to="/ruo/contact" className="underline underline-offset-4">Contact</Link>
        </div>
      </div>
    </div>
  );
}