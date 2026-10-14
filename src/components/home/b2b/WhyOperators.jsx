import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Layers, Headphones, ShieldCheck } from 'lucide-react';

const REASONS = [
  { icon: Zap, title: '7-Day Launch', body: 'Live in a week, not a quarter.' },
  { icon: Layers, title: 'One Platform Instead of Five Vendors', body: 'Intake, clinicians, payments, pharmacy, CRM, and compliance in one place.' },
  { icon: Headphones, title: '24/7 Support to Resolution', body: 'A team that stays on the issue until it is closed.' },
  { icon: ShieldCheck, title: 'Compliance as a Feature', body: 'Monitoring and audit-ready documentation built into the platform.' },
];

export default function WhyOperators() {
  return (
    <section className="bg-[#F7F4ED] py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">Why operators choose us</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1F2D27] mt-4" style={{ letterSpacing: '-0.02em' }}>
            Reasons operators stay.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div key={r.title}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border-t-2 border-[#A66B3C] pt-6">
                <Icon className="w-6 h-6 text-[#A66B3C] mb-4" />
                <h3 className="text-base font-bold text-[#1F2D27] mb-2 leading-snug">{r.title}</h3>
                <p className="text-[#3A453E] text-sm leading-relaxed">{r.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}