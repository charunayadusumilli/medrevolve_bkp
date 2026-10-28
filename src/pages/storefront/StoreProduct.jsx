import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  money,
  statusChip,
  isPrescription,
  isCompounded,
  categoryLabel,
  categoryImage,
} from '@/lib/storefront/catalog';
import { applyStoreSeo, productJsonLd } from '@/lib/storefront/seo';
import BuyBox from '@/components/storefront/BuyBox';
import ProductTimeline from '@/components/storefront/ProductTimeline';
import SafetyBlock from '@/components/storefront/SafetyBlock';
import BoughtTogether from '@/components/storefront/BoughtTogether';
import ProductTile from '@/components/storefront/ProductTile';
import { INTAKE_BANNER } from '@/components/storefront/QuickAdd';

export default function StoreProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProduct(null);
    setRelated([]);

    (async () => {
      const page = await base44.entities.StorefrontProduct.filter({ slug }, { limit: 1 });
      if (cancelled) return;
      const found = (page.items || [])[0];
      if (!found) {
        setLoading(false);
        return;
      }
      setProduct(found);
      setActiveImage(found.image_url || categoryImage(found.category));
      setLoading(false);

      const rel = await base44.entities.StorefrontProduct.filter({ category: found.category }, { limit: 6 });
      if (cancelled) return;
      setRelated((rel.items || []).filter((p) => p.slug !== found.slug).slice(0, 4));
    })();

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (product) {
      const path = `/product/${product.slug}`;
      applyStoreSeo({
        title: `${product.display_name}${product.generic_name ? ` (${product.generic_name})` : ''} — ${isPrescription(product) ? 'starting at' : ''} ${money(product.price)} | MedRevolve`,
        description: `${product.display_name} from MedRevolve. ${isPrescription(product) ? 'Start a licensed-provider intake — prices start at ' + money(product.subscription_price ?? product.price) + '/mo after approval.' : 'Cash-pay pricing, free shipping over $50, subscription savings available.'}`,
        path,
        jsonLd: productJsonLd(product, path),
      });
    }
  }, [product]);

  // 404 signal — only after loading has finished.
  useEffect(() => {
    if (loading || product) return undefined;
    const meta = document.createElement('meta');
    meta.name = 'prerender-status-code';
    meta.content = '404';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [loading, product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="h-[420px] animate-pulse rounded-2xl bg-sf-surface" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <p className="font-display text-[40px]">Product not found</p>
        <p className="mt-2 text-[14px] text-sf-muted">This treatment may have been renamed or retired.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-sf-ink px-6 py-3 text-[13px] font-semibold text-white">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>
    );
  }

  const prescription = isPrescription(product);

  // Compliance gate: a prescription PDP without safety information never publishes.
  if (prescription && !product.safety_info) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <p className="font-display text-[34px]">This treatment isn't available yet</p>
        <p className="mt-2 text-[14px] text-sf-muted">
          Safety information is required before this page can go live. In the meantime you can start an intake
          to speak with a provider about alternatives.
        </p>
        <Link
          to={`/intake/${product.category}`}
          className="mt-6 inline-flex rounded-full bg-sf-ink px-6 py-3 text-[13px] font-semibold text-white"
        >
          Start an intake
        </Link>
      </div>
    );
  }

  const chip = statusChip(product);
  const gallery = [activeImage, categoryImage(product.category)].filter(
    (src, index, arr) => src && arr.indexOf(src) === index
  );

  const handleGuardedAdd = () => {
    navigate(`/intake/${product.category}`, { state: { banner: INTAKE_BANNER } });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-[12px] text-sf-muted">
        <Link to="/" className="hover:text-sf-ink">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-sf-ink">Shop</Link>
        <span>/</span>
        <Link to={`/shop/${product.category}`} className="hover:text-sf-ink">{categoryLabel(product.category)}</Link>
        <span>/</span>
        <span className="text-sf-ink">{product.display_name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="overflow-hidden rounded-3xl border border-sf-line bg-sf-surface">
            <img
              src={activeImage}
              alt={product.display_name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border transition-colors ${
                    activeImage === src ? 'border-sf-ink' : 'border-sf-line'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-[34px] leading-tight tracking-tight sm:text-[40px]">
            {product.display_name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.generic_name && <p className="text-[13px] text-sf-muted">{product.generic_name}</p>}
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${chip.className}`}>
              {chip.label}
            </span>
            {product.brand_name && <span className="text-[11px] text-sf-muted">· {product.brand_name}</span>}
          </div>

          {product.description && (
            <p className="mt-4 text-[13px] leading-relaxed text-sf-muted">{product.description}</p>
          )}

          <div className="mt-6">
            <BuyBox product={product} onGuardedAdd={handleGuardedAdd} />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-sf-muted">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-sf-accent" /> Licensed US providers</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-sf-accent" /> Free shipping over $50</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-sf-accent" /> HIPAA-secure</span>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <ProductTimeline prescription={prescription} />

        {product.clinical_notes && (
          <section className="rounded-2xl border border-sf-line bg-sf-surface p-6">
            <h2 className="font-display text-[24px] tracking-tight">Clinical notes</h2>
            <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-sf-ink/85">
              {product.clinical_notes}
            </p>
            {product.coa_url && (
              <a
                href={product.coa_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[12px] font-semibold text-sf-accent underline"
              >
                View batch certificate of analysis
              </a>
            )}
          </section>
        )}

        <SafetyBlock product={product} />

        <section className="rounded-2xl border border-sf-line bg-sf-paper p-6">
          <h2 className="text-[13px] font-semibold">Regulatory notice</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-sf-muted">
            {isCompounded(product)
              ? 'This is a compounded medication prepared by a state-licensed 503A pharmacy. It is not FDA-approved. Compounded drugs are not reviewed by the FDA for safety, effectiveness, or quality, and may not be substituted for an FDA-approved product without your provider\'s guidance.'
              : product.fda_status === 'fda_approved'
                ? 'This product is FDA-approved for its labeled indication. A licensed provider determines whether it is appropriate for you. Prescription required.'
                : 'This product is a dietary supplement. Statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.'}
          </p>
          {isPrescription(product) && (
            <p className="mt-2 text-[11px] leading-relaxed text-sf-muted">
              Prescription products require an online consultation with a licensed provider. Pricing shown is
              the cash-pay rate if treatment is approved; you will not be charged for medication unless a
              provider approves it.
            </p>
          )}
        </section>

        {!prescription && <BoughtTogether product={product} />}

        {related.length > 0 && (
          <section>
            <h2 className="mt-8 font-display text-[26px] tracking-tight">Related treatments</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <ProductTile key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}