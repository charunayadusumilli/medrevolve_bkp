import React from 'react';
import { motion } from 'framer-motion';

const METRICS = [
  { value: '7 Days', label: 'Average setup time' },
  { value: '50 States', label: 'Provider coverage' },
  { value: '1K+', label: 'Clinicians network' },
  { value: '503A', label: 'Licensed pharmacy partners' },
];

export default function EditorialMetrics() {
  return (
    <section className="bg-[#1A1A1A] py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {METRICS.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center">
            <p className="font-display text-4xl text-white mb-1">{m.value}</p>
            <p className="text-xs font-semibold text-white/50">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}