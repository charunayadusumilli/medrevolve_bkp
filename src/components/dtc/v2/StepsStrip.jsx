import React from 'react';
import { V2_IMAGES } from './brand';

const STEPS = [
  { n: '01', title: 'Tell us about you', desc: 'A 5-minute online visit. No waiting rooms.', image: V2_IMAGES.pilates },
  { n: '02', title: 'A provider reviews', desc: 'US-licensed clinicians decide what fits — if anything.', image: V2_IMAGES.compounding },
  { n: '03', title: 'Delivered to your door', desc: 'Compounded by licensed pharmacies, shipped discreetly.', image: V2_IMAGES.essentials },
];

export default function StepsStrip() {
  return (
    <section className="bg-dtc-page py-20 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl text-dtc-text mb-10">Care in three steps.</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-dtc-surface rounded-3xl overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-mr-forest tracking-widest">{s.n}</p>
                <p className="font-display text-2xl text-dtc-text mt-2">{s.title}</p>
                <p className="text-sm text-dtc-text/75 mt-2">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}