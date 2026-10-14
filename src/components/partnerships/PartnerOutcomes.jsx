import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Cpu, Activity, CreditCard } from 'lucide-react';

const CARDS = [
  {
    icon: ShieldCheck,
    title: 'EGWP & Insurance Channel',
    body: "Employer Group Waiver Plan structures, Part D plan sponsor pathways, and insurance tie-ups. We open the retiree coverage channel partners can't build quickly in-house.",
  },
  {
    icon: Zap,
    title: '7-Day Implementation',
    body: 'AI-powered intake, CRM, payment rails, and pharmacy setup launched in 7 days. Clear your rollout backlog without waiting on hiring.',
  },
  {
    icon: Cpu,
    title: 'AI That Already Runs',
    body: '24/7 AI intake, automated retention workflows, churn-risk flags, and payment recovery. Deployed and working — not a 12-month build.',
  },
  {
    icon: Activity,
    title: 'Compliance Monitoring',
    body: 'Real-time FDA, PCAC, and Federal Register monitoring with alerts before regulations change. Automated compliance logging per patient.',
  },
  {
    icon: CreditCard,
    title: 'Payment Rails',
    body: 'High-risk merchant accounts, LegitScript-ready, employer billing and member copay handling with automated retry. No processor shutdowns.',
  },
];

export default function PartnerOutcomes() {
  return (
    <section className="bg-[#F7F4ED] py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">What we help partners accomplish</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1F2D27] mt-4" style={{ letterSpacing: '-0.02em' }}>
            Infrastructure that clears the backlog.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
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