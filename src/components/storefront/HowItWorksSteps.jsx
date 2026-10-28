import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  { label: 'Intake', copy: 'Answer a 5-minute medical questionnaire. HIPAA-secure, no phone call needed.' },
  { label: 'Provider review', copy: 'A US-licensed provider reviews your history, usually within 24 hours.' },
  { label: 'Pharmacy', copy: 'If approved, your prescription is filled by a licensed US pharmacy.' },
  { label: 'Delivered', copy: 'Discreet, tracked shipping to your door. Follow-ups included.' },
];

export default function HowItWorksSteps() {
  return (
    <section className="border-y border-sf-line bg-sf-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[30px] tracking-tight sm:text-[38px]">How it works</h2>
          <Link to="/intake/weight-loss" className="text-[13px] font-semibold text-sf-sun hover:underline">
            Start your intake
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.label} className="border-t border-white/15 pt-4">
              <p className="font-display text-[13px] text-sf-sun">0{index + 1}</p>
              <p className="mt-2 text-[15px] font-semibold">{step.label}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/60">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}