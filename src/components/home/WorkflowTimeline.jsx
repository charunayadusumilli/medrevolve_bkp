import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const steps = [
  { n: '01', title: 'Apply & Onboard', body: 'Submit your merchant application. Your dedicated onboarding manager provisions your account and begins domain, compliance, and inventory setup.', tag: 'Day 1–3' },
  { n: '02', title: 'Certify & Comply', body: 'Complete MedRevolve University and your compliance walkthrough. HIPAA, DEA protocols, and state licensing documentation generated automatically.', tag: 'Day 3–7' },
  { n: '03', title: 'Configure Products', body: 'Activate your product catalog — GLP-1s, peptides, hormone protocols. Set pricing, backup SKUs, and auto-reorder thresholds in the inventory dashboard.', tag: 'Day 7–14' },
  { n: '04', title: 'Activate Telehealth', body: 'Connect to the provider network. Configure consultation types, prescription workflows, and patient intake forms for your branded telehealth portal.', tag: 'Day 14–21' },
  { n: '05', title: 'Connect Payments', body: 'Integrate your high-risk merchant account. Card, ACH, crypto, and subscription billing are configured with your storefront and pharmacy fulfillment pipeline.', tag: 'Day 21–28' },
  { n: '06', title: 'Go Live & Scale', body: 'Launch to your first patients. Real-time analytics, provider oversight, inventory monitoring, and your partner support team are live and with you.', tag: 'Day 28–30' },
];

export default function WorkflowTimeline() {
  return (
    <section className="bg-[#040404] border-t border-white/5 py-24 px-8 lg:px-16">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-medium">The Process</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight">
              30 days to live.<br />
              <span className="text-white/25">Step by step.</span>
            </h2>
          </div>
          <Link to={createPageUrl('MerchantOnboarding')}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <button className="flex items-center gap-3 border border-white/15 text-white/60 hover:text-white hover:border-white/40 px-7 py-3.5 text-[11px] font-bold tracking-widest uppercase transition-all">
              Start Onboarding <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-[#040404] p-8 lg:p-10 group hover:bg-white/[0.02] transition-colors">

              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-medium">{step.n}</span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/25 font-medium px-2.5 py-1 border border-white/10 rounded-full">{step.tag}</span>
              </div>

              <div className="w-px h-8 bg-white/10 mb-6" />

              <h3 className="text-xl font-bold text-white mb-3 leading-tight">{step.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}