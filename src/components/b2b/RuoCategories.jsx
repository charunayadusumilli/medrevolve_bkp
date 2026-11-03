import React from 'react';
import { RUO_CATEGORIES } from '@/lib/partner/offerings';

export default function RuoCategories() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {RUO_CATEGORIES.map((category, i) => (
        <div key={category.name} className="border border-site-line bg-site-surface p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">
            {String(i + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-3 text-[19px] font-semibold tracking-tight text-site-moss">{category.name}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{category.blurb}</p>
        </div>
      ))}
    </div>
  );
}