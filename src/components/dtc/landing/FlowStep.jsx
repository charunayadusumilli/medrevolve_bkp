import React from 'react';
import { motion } from 'framer-motion';

export default function FlowStep({ step, index }) {
  const reversed = index % 2 === 1;
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
      className={`relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/10">
        <img src={step.image} alt={step.label} loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061312]/60 to-transparent" />
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold text-white">
          {step.stat}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-5xl font-semibold text-white/10 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#3FD1BC]/10 border border-[#3FD1BC]/20 px-3 py-1.5">
            <step.icon className="w-4 h-4 text-[#3FD1BC]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3FD1BC]">{step.label}</span>
          </div>
        </div>
        <h3 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight mb-4">{step.title}</h3>
        <p className="text-white/55 leading-relaxed text-base lg:text-lg">{step.desc}</p>
      </div>
    </motion.div>
  );
}