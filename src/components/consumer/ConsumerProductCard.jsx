import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addLine } from '@/lib/storefront/cart';
import { money, isPrescription } from '@/lib/storefront/catalog';
import { useToast } from '@/components/ui/use-toast';
import PrescriptionModal from './PrescriptionModal';

export default function ConsumerProductCard({ product }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rxOpen, setRxOpen] = useState(false);
  const rx = isPrescription(product);

  const headline = product.subscription_price ?? product.price;
  const save = product.subscription_price != null ? product.price - product.subscription_price : 0;

  const addToCart = () => {
    if (product.in_stock === false) return;
    const result = addLine(product, {
      quantity: 1,
      purchaseType: product.subscription_price != null ? 'subscription' : 'one_time',
      cadenceDays: product.subscription_cadences?.[0] ?? 30,
      doseLabel: product.dose_options?.[0]?.label,
    });
    if (result?.blocked) {
      setRxOpen(true);
      return;
    }
    toast({ title: 'Added to basket', description: product.display_name });
  };

  return (
    <article className="group flex h-full flex-col">
      <Link to={`/product/${product.slug}`} className="overflow-hidden rounded-xl bg-site-surface">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.display_name}
            className="aspect-[4/5] w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <Link to={`/product/${product.slug}`} className="font-display text-[22px] leading-tight text-site-moss">
          {product.display_name}
        </Link>
        <p className="mt-2 text-[14px] font-semibold text-site-moss">
          {money(headline)}
          <span className="ml-1 text-[12px] font-medium text-site-greige">
            {product.subscription_price != null ? '/mo' : ' one-time'}
          </span>
        </p>
        {save > 0 && (
          <p className="mt-1 text-[12px] text-site-rust">Members save {money(save)}/mo</p>
        )}

        <div className="mt-4">
          {rx ? (
            <button
              type="button"
              onClick={() => setRxOpen(true)}
              className="w-full rounded-lg border border-site-moss px-4 py-2.5 text-[13px] font-semibold text-site-moss transition-colors duration-200 hover:bg-site-surface"
            >
              Start intake
            </button>
          ) : (
            <button
              type="button"
              onClick={addToCart}
              disabled={product.in_stock === false}
              className="w-full rounded-lg border border-site-line px-4 py-2.5 text-[13px] font-semibold text-site-moss transition-colors duration-200 hover:border-site-moss disabled:opacity-40"
            >
              {product.in_stock === false ? 'Out of stock' : 'Add to cart'}
            </button>
          )}
        </div>
      </div>

      <PrescriptionModal
        open={rxOpen}
        category={product.category}
        onClose={() => setRxOpen(false)}
      />
    </article>
  );
}