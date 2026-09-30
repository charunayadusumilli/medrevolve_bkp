import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LABELS = ['Goal', 'About you', 'Your plan', 'Essentials'];

export default function FlowProgress({ step, onBack }) {
  return (
    <div className="max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3 h-8">
        {step > 0 ? (
          <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-dtc-text/75 hover:text-dtc-text">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <span />}
        <span className="text-xs text-dtc-text/65">Step {step + 1} of {LABELS.length} · {LABELS[step]}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {LABELS.map((l, i) => (
          <div key={l} className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-mr-ink' : 'bg-dtc-text/15'}`} />
        ))}
      </div>
    </div>
  );
}