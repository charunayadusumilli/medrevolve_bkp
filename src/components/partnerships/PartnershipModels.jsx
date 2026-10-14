import React from 'react';
import { motion } from 'framer-motion';

const MODELS = [
  { title: 'Implementation Partner', body: 'We roll out your contracts as your launch layer.' },
  { title: 'Infrastructure Partner', body: 'White-label stack under your brand.' },
  { title: 'Channel Partner', body: 'Co-develop the EGWP / retiree channel and share revenue.' },
  { title: 'Strategic Partner', body: 'Deeper commercial arrangement including M&A conversation.' },
];

export default function PartnershipModels() {
  return (
    <section className="bg-[#F7F4ED] py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">Partnership models</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1F2D27] mt-4" style={{ letterSpacing: '-0.02em' }}>
            Four ways to work together.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODELS.map((m, i) => (
            <motion.div key={m.title}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-[#E4DED2] p-7 flex flex-col">
              <span className="text-3xl font-black text-[#E4DED2] mb-4">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-base font-bold text-[#1F2D27] mb-2">{m.title}</h3>
              <p className="text-[#3A453E] text-sm leading-relaxed">{m.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}