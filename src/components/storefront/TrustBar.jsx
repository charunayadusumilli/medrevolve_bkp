import React from 'react';
import { BadgeCheck, Lock, Stethoscope, Building2 } from 'lucide-react';

const ITEMS = [
  { icon: Stethoscope, title: 'Licensed providers', copy: 'Every prescription is reviewed by a provider licensed in your state.' },
  { icon: Building2, title: 'Licensed pharmacies', copy: 'Dispensed by state-licensed US pharmacies, never gray-market suppliers.' },
  { icon: BadgeCheck, title: 'LegitScript certified', copy: 'Independently verified for safe, compliant telehealth advertising.' },
  { icon: Lock, title: 'HIPAA-secure', copy: 'Your intake and records are encrypted and never sold.' },
];

export default function TrustBar() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="rounded-2xl border border-sf-line bg-sf-surface p-5">
            <Icon className="h-5 w-5 text-sf-accent" />
            <p className="mt-3 text-[14px] font-semibold">{title}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-sf-muted">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}