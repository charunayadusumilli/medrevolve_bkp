import React from 'react';
import { Plus } from 'lucide-react';
import { addToCart } from '@/lib/cartStore';
import { ESSENTIALS, toCartItem } from './brand';

export default function EssentialsSuggestions({ cart }) {
  const suggestions = ESSENTIALS.filter((p) => !cart.some((i) => i.id === p.id));
  if (!suggestions.length) return null;
  return (
    <div className="bg-mr-cream rounded-3xl p-5 mt-6">
      <p className="font-display text-2xl text-mr-ink">Don't forget your essentials</p>
      <p className="text-sm text-mr-ink/60 mb-4">Members usually add these with their first order.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        {suggestions.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-3 flex items-center gap-3">
            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-mr-ink truncate">{p.name}</p>
              <p className="text-xs text-mr-ink/60">${p.price}</p>
            </div>
            <button onClick={() => addToCart(toCartItem(p))} aria-label={`Add ${p.name}`}
              className="w-8 h-8 rounded-full bg-mr-ink hover:bg-mr-forest text-white flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}