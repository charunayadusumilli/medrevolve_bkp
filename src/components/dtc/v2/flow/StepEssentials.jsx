import React from 'react';
import { Plus, Check } from 'lucide-react';
import { ESSENTIALS } from '../brand';

export default function StepEssentials({ picked, toggle, onFinish }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-4xl sm:text-5xl text-dtc-text text-center mb-3">Add your essentials</h1>
      <p className="text-center text-dtc-text/75 mb-10">Everything you need to start, in one box. Optional.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {ESSENTIALS.map((p) => {
          const on = picked.includes(p.id);
          return (
            <button key={p.id} onClick={() => toggle(p.id)}
              className={`rounded-3xl overflow-hidden border text-left bg-dtc-surface transition ${on ? 'border-dtc-text shadow-md' : 'border-dtc-text/10 hover:border-dtc-text/40'}`}>
              <div className="aspect-square bg-mr-sand">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dtc-text truncate">{p.name}</p>
                  <p className="text-xs text-dtc-text/75">${p.price}</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${on ? 'bg-mr-ink text-white' : 'bg-dtc-page text-dtc-text'}`}>
                  {on ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <button onClick={onFinish}
        className="mt-10 w-full rounded-full bg-mr-ink hover:bg-mr-forest text-white font-medium py-4 transition-colors">
        {picked.length ? `Add ${picked.length} essential${picked.length > 1 ? 's' : ''} & review cart` : 'Skip & review cart'}
      </button>
    </div>
  );
}