import React from 'react';
import { Stethoscope, Sparkles, Dumbbell, Rocket } from 'lucide-react';

const OPERATORS = [
  { Icon: Stethoscope, label: 'Med spa', copy: 'Add physician-supervised weight and hormone care to your treatment menu.' },
  { Icon: Sparkles, label: 'Wellness clinic', copy: 'Turn in-person visits into recurring prescription revenue under your name.' },
  { Icon: Dumbbell, label: 'Fitness studio', copy: 'Offer GLP-1 and recovery protocols to members who already trust your coaching.' },
  { Icon: Rocket, label: 'First-time operator', copy: 'Launch a telehealth brand with no clinic, no pharmacy contract, no dev team.' },
];

export default function OperatorTypes() {
  return (
    <section id="operators" className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Who we run for</p>
        <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
          Four kinds of operators. One set of rails.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OPERATORS.map(({ Icon, label, copy }) => (
            <div key={label} className="rounded-xl border border-site-line bg-site-cream p-6">
              <Icon className="h-5 w-5 text-site-rust" />
              <p className="mt-4 text-[15px] font-semibold">{label}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}