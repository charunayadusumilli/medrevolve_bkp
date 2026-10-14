import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Stethoscope, CreditCard, Package, Users, Activity } from 'lucide-react';

const CAPABILITIES = [
  { icon: Cpu, title: 'AI Intake', body: '24/7 patient intake, eligibility, and triage — no human needed in the first five minutes.' },
  { icon: Stethoscope, title: 'Licensed Clinician Network', body: 'US-licensed physicians contracted across all 50 states.' },
  { icon: CreditCard, title: 'Payment Processing', body: 'High-risk merchant accounts, LegitScript-ready, automated retries and subscription billing.' },
  { icon: Package, title: 'Pharmacy Fulfillment', body: '50-state licensed pharmacy partners, delivery in 2–3 days.' },
  { icon: Users, title: 'Unified CRM', body: 'Every lead, patient, and follow-up in one pipeline with automation.' },
  { icon: Activity, title: 'Compliance Monitoring', body: 'Real-time FDA and regulatory tracking with audit-ready documentation.' },
];

export default function WhatWeRun() {
  return (
    <section className="bg-[#F7F4ED] py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">What we run for you</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1F2D27] mt-4" style={{ letterSpacing: '-0.02em' }}>
            The whole operation, under your brand.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-[#E4DED2] p-7 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-[#1F2D27] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#A66B3C]" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2D27] mb-3">{c.title}</h3>
                <p className="text-[#3A453E] text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}