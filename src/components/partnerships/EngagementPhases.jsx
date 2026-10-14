import React from 'react';
import { motion } from 'framer-motion';

const PHASES = [
  { tag: 'Phase 1 · Days 1–30', title: 'Scoped pilot', body: 'A defined pilot with agreed success criteria, so both sides know exactly what "working" looks like.' },
  { tag: 'Phase 2 · Days 31–90', title: 'Full rollout', body: 'Complete rollout with metrics dashboards live, so performance is visible in real time.' },
  { tag: 'Phase 3 · Ongoing', title: 'Quarterly reviews & expansion', body: 'Quarterly business reviews and expansion into new programs, channels, or markets.' },
];

export default function EngagementPhases() {
  return (
    <section className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">Engagement phases</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1F2D27] mt-4" style={{ letterSpacing: '-0.02em' }}>
            From pilot to expansion.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PHASES.map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border-t-2 border-[#A66B3C] pt-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#A66B3C]">{p.tag}</span>
              <h3 className="text-lg font-bold text-[#1F2D27] mt-2 mb-2">{p.title}</h3>
              <p className="text-[#3A453E] text-sm leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-[#F7F4ED] border border-[#E4DED2] p-6">
          <p className="text-[#1F2D27] text-sm font-semibold">
            What we need from a partner: one executive sponsor, one 30-day pilot scope, and a decision point at day 30.
          </p>
        </div>
      </div>
    </section>
  );
}