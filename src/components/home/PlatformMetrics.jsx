import React from 'react';
import { motion } from 'framer-motion';

const METRICS = [
  { value: '7 Days', label: 'Average platform setup time', sub: 'From intake call to live site' },
  { value: '$5K', label: 'One-time setup fee', sub: 'Then $2,500/mo operations' },
  { value: '50 States', label: 'Provider coverage', sub: 'Licensed in all 50' },
  { value: '503A', label: 'Pharmacy network', sub: 'Licensed compounding partners' },
];

export default function PlatformMetrics() {
  return (
    <div className="bg-[#0A0A0A] py-14 px-6 border-b border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {METRICS.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center">
            <p className="text-3xl font-black text-white mb-1">{m.value}</p>
            <p className="text-sm font-semibold text-white/50 mb-0.5">{m.label}</p>
            <p className="text-xs text-white/20">{m.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}