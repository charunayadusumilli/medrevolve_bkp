import React from 'react';
import { FLOW_STEPS } from './landingData';
import FlowStep from './FlowStep';

export default function ScienceFlow() {
  return (
    <section className="py-24 px-6 lg:px-10 bg-[#061312]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3FD1BC] mb-3">From intelligence to your door</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">One continuous, science-driven flow.</h2>
        </div>
        <div className="sticky top-[101px] z-10 -mx-6 px-6 py-3 mb-14 bg-[#061312]/90 backdrop-blur overflow-x-auto">
          <div className="flex gap-2 justify-start lg:justify-center min-w-max">
            {FLOW_STEPS.map((s, i) => (
              <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/60">
                <s.icon className="w-3.5 h-3.5 text-[#3FD1BC]" /> {i + 1}. {s.label}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-24">
          {FLOW_STEPS.map((step, i) => <FlowStep key={step.label} step={step} index={i} />)}
        </div>
      </div>
    </section>
  );
}