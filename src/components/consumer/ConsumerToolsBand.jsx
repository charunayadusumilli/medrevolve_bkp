import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const TOOLS = [
  {
    label: 'BMI calculator',
    copy: 'See where your body mass index falls and what it means for treatment options.',
    to: '/tools/bmi',
  },
  {
    label: 'GLP-1 eligibility check',
    copy: 'Answer a few questions to find out whether GLP-1 care is a fit for you.',
    to: '/intake/weight-loss',
  },
];

export default function ConsumerToolsBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Free tools</p>
      <h2 className="mt-3 font-display text-[32px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
        Know before you start
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.label}
            to={tool.to}
            className="group rounded-xl border border-site-line bg-site-surface p-6 transition-colors duration-200 hover:border-site-moss"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-[24px] leading-tight text-site-moss">{tool.label}</p>
              <ArrowUpRight className="h-4 w-4 text-site-greige transition-colors duration-200 group-hover:text-site-rust" />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-site-greige">{tool.copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}