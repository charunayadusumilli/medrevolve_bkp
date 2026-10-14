import React from 'react';
import { motion } from 'framer-motion';

const COMMITMENTS = [
  { label: 'Days-to-live per contract', value: '7-day standard' },
  { label: 'Cost per enrolled member', value: 'Reduced via AI automation' },
  { label: 'Retention curve', value: 'Improvements tracked per cohort' },
  { label: 'Alert lead time on regulatory changes', value: 'Before regulations take effect' },
  { label: 'Payment processing uptime', value: 'Monitored and reported' },
];

export default function MeasurableCommitments() {
  return (
    <section className="bg-[#1F2D27] py-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">Measurable commitments</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4" style={{ letterSpacing: '-0.02em' }}>
            We put numbers on the partnership.
          </h2>
        </div>
        <div className="divide-y divide-white/10 border-t border-white/10">
          {COMMITMENTS.map((c, i) => (
            <motion.div key={c.label}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-5">
              <span className="text-white/60 text-sm font-medium">{c.label}</span>
              <span className="text-white font-bold text-sm">{c.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}