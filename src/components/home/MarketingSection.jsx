import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, Target, Zap, ArrowUpRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const metrics = [
  { value: '$2.4M+', label: 'Monthly GMV', sub: 'Across all merchant storefronts', trend: '+34% MoM' },
  { value: '50K+', label: 'Active Patients', sub: 'On platform across all merchants', trend: '+18% MoM' },
  { value: '4.2 Wks', label: 'Avg Launch Time', sub: 'From application to live', trend: 'Industry best' },
  { value: '$890', label: 'Avg Patient LTV', sub: 'Per 12-month subscription', trend: '+12% YoY' },
  { value: '91%', label: 'Retention Rate', sub: '12-month patient retention', trend: 'vs 67% industry' },
  { value: '30 Days', label: 'Payback Period', sub: 'Avg merchant ROI timeline', trend: 'Proven model' },
];

const channels = [
  {
    icon: Target,
    title: 'Performance Marketing',
    body: 'Pre-built ad frameworks for Meta, Google, and TikTok that comply with pharmaceutical advertising guidelines. Plug in your brand — we provide the copy, creative, and targeting logic.',
    color: '#4A6741',
  },
  {
    icon: TrendingUp,
    title: 'Creator Referral Engine',
    body: 'Turn wellness content creators into your patient acquisition channel. Unique referral links, real-time commission tracking, and tiered reward structures built into the platform.',
    color: '#2A6B7A',
  },
  {
    icon: Zap,
    title: 'Email & SMS Automation',
    body: 'Pre-configured nurture sequences for GLP-1, peptide, and hormone patients. Refill reminders, progress check-ins, upsell sequences — HIPAA-compliant and ready to deploy.',
    color: '#7A5A45',
  },
  {
    icon: BarChart2,
    title: 'Real-Time Analytics Dashboard',
    body: 'Track patient acquisition cost, LTV, conversion rates, inventory turns, and provider utilization from one unified dashboard. Every metric your merchant operation needs.',
    color: '#5A4A7A',
  },
];

export default function MarketingSection() {
  return (
    <section className="bg-[#050505] border-t border-white/5">

      {/* Big number header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=50"
            alt=""
            className="w-full h-full object-cover opacity-[0.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#050505]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 py-20">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-medium">Platform Analytics</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight mb-4">
            Numbers that prove<br />
            <span className="text-white/25">the model works.</span>
          </h2>
          <p className="text-white/35 text-sm max-w-md leading-relaxed">
            Aggregated anonymized data across the MedRevolve merchant network. Updated monthly.
          </p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5">
            {metrics.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#050505] p-6 lg:p-8 group hover:bg-white/[0.015] transition-colors">
                <div className="text-2xl lg:text-3xl font-black text-white mb-1">{m.value}</div>
                <div className="text-[11px] font-semibold text-white/45 mb-1 tracking-wide">{m.label}</div>
                <div className="text-[10px] text-white/20 mb-2">{m.sub}</div>
                <div className="text-[10px] text-emerald-500/70 font-semibold tracking-wide">{m.trend}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing channels */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-medium">Growth Infrastructure</p>
          <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight">
            Built-in marketing.<br />
            <span className="text-white/25">From day one.</span>
          </h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-white/5 hover:border-white/15 p-7 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: ch.color + '18' }}>
                  <Icon className="w-5 h-5" style={{ color: ch.color }} />
                </div>
                <h4 className="text-white font-bold text-base mb-3 leading-tight">{ch.title}</h4>
                <p className="text-white/35 text-sm leading-relaxed">{ch.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-white/20 mb-3 font-medium">Ready to build?</p>
              <h3 className="text-3xl lg:text-4xl font-black text-white">
                Your wellness business.<br />
                <span className="text-white/30">Our infrastructure.</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl('MerchantOnboarding')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <button className="flex items-center gap-3 bg-white text-black px-8 py-4 text-[12px] font-black tracking-widest uppercase hover:bg-white/90 transition-colors">
                  Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link to={createPageUrl('ForBusiness')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <button className="flex items-center gap-3 border border-white/15 text-white/50 hover:text-white hover:border-white/40 px-8 py-4 text-[12px] font-bold tracking-widest uppercase transition-all">
                  Schedule Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}