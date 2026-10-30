import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { money } from '@/lib/storefront/catalog';
import QuickAdd from './QuickAdd';

export default function BoughtTogether({ product }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    base44.entities.StorefrontProduct
      .filter({ rail: 'commerce' }, { limit: 12 })
      .then((page) => {
        if (cancelled) return;
        const picks = (page.items || [])
          .filter((p) => p.slug !== product.slug)
          .sort((a, b) => (a.category === product.category ? -1 : 1))
          .slice(0, 3);
        setItems(picks);
      });
    return () => { cancelled = true; };
  }, [product.slug, product.category]);

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-sf-line bg-sf-surface p-6">
      <h2 className="font-display text-[24px] tracking-tight">Frequently bought together</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-sf-line p-3">
            <img src={item.image_url} alt={item.display_name} className="h-14 w-14 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <Link to={`/product/${item.slug}`} className="block truncate text-[13px] font-semibold hover:underline">
                {item.display_name}
              </Link>
              <p className="text-[12px] text-sf-muted">
                {money(item.subscription_price ?? item.price)}
                {item.subscription_price != null ? '/mo' : ' one-time purchase'}
              </p>
            </div>
            <QuickAdd product={item} label="Add" />
          </div>
        ))}
      </div>
    </section>
  );
}