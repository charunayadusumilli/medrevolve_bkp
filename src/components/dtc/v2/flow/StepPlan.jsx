import React from 'react';
import { Check } from 'lucide-react';
import { productsForGoal } from '../brand';

export default function StepPlan({ goal, selectedId, onSelect, onNext }) {
  const products = productsForGoal(goal);
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-4xl sm:text-5xl text-dtc-text text-center mb-3">Options for {goal.label.toLowerCase()}</h1>
      <p className="text-center text-dtc-text/75 mb-10">Choose what you'd like a provider to review. Prescriptions are only issued if appropriate.</p>
      <div className="space-y-3">
        {products.map((p) => {
          const active = selectedId === p.id;
          return (
            <button key={p.id} onClick={() => onSelect(p.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-3xl border text-left transition ${active ? 'border-dtc-text bg-dtc-surface shadow-md' : 'border-dtc-text/10 bg-dtc-surface/60 hover:border-dtc-text/40'}`}>
              <img src={p.image} alt={p.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display text-2xl text-dtc-text">{p.name}</p>
                  {p.badge && <span className="text-[10px] font-semibold uppercase tracking-wider bg-mr-sage text-mr-forest rounded-full px-2 py-0.5">{p.badge}</span>}
                </div>
                <p className="text-sm text-dtc-text/75 line-clamp-1">{p.tagline}</p>
                <p className="text-xs text-dtc-text/65 mt-1">{p.typeLabel}</p>
              </div>
              <div className="text-right pr-2">
                <p className="font-medium text-dtc-text">${p.price}</p>
                <p className="text-xs text-dtc-text/65">{p.billing === 'monthly' ? 'per month' : 'one-time'}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${active ? 'bg-mr-ink border-dtc-text' : 'border-dtc-text/20'}`}>
                {active && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
      <button disabled={!selectedId} onClick={onNext}
        className="mt-8 w-full rounded-full bg-mr-ink hover:bg-mr-forest disabled:opacity-30 text-white font-medium py-4 transition-colors">
        Continue
      </button>
    </div>
  );
}