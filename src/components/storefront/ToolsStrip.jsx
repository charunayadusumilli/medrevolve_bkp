import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Dumbbell, Flame, Activity } from 'lucide-react';

const TOOLS = [
  { slug: 'bmi', label: 'BMI calculator', copy: 'Check where your body mass index sits.', icon: Calculator },
  { slug: 'tdee', label: 'TDEE calculator', copy: 'Estimate the calories you burn daily.', icon: Flame },
  { slug: 'protein', label: 'Protein target', copy: 'Daily protein for your goal and weight.', icon: Dumbbell },
  { slug: 'testosterone', label: 'Testosterone check', copy: 'Understand what your lab number means.', icon: Activity },
];

export default function ToolsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-[30px] tracking-tight sm:text-[38px]">Free tools</h2>
        <p className="text-[12px] text-sf-muted">No account needed</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map(({ slug, label, copy, icon: Icon }) => (
          <Link
            key={slug}
            to={`/tools/${slug}`}
            className="rounded-2xl border border-sf-line bg-sf-surface p-5 transition-colors hover:border-sf-ink"
          >
            <Icon className="h-5 w-5 text-sf-accent" />
            <p className="mt-3 text-[14px] font-semibold">{label}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-sf-muted">{copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}