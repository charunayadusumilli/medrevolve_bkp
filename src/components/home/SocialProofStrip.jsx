import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const stats = [
  { value: '200+', label: 'Active Merchants', sub: 'Operating on the platform' },
  { value: '$2.4M+', label: 'GMV Processed', sub: 'Monthly merchant volume' },
  { value: '50K+', label: 'Patients Served', sub: 'Across all storefronts' },
  { value: '99.9%', label: 'Uptime SLA', sub: 'Infrastructure reliability' },
  { value: '30 Days', label: 'Avg. Time to Launch', sub: 'Onboarding to live' },
  { value: 'HIPAA', label: 'Compliant', sub: 'Full regulatory coverage' },
];

const testimonials = [
  { text: 'MedRevolve gave us everything we needed to go from idea to compliant storefront in under 4 weeks. The compliance walkthrough alone saved us months of legal fees.', name: 'Elite Peptide Solutions', role: 'Merchant Partner' },
  { text: 'The telehealth infrastructure is exactly what we needed. Patients book, providers prescribe, pharmacy ships — all through one branded experience.', name: 'WellnessFirst Clinic', role: 'Telehealth Merchant' },
  { text: 'The combination of inventory management + auto-reorder + payment processing is a game-changer. We scaled from 50 to 800 active patients in 90 days.', name: 'NextGen Wellness', role: 'GLP Merchant' },
];

export default function SocialProofStrip() {
  return (
    <section className="bg-[#060606] border-t border-white/5">

      {/* Stats row */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-0 lg:divide-x divide-white/5">
            {stats.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="lg:px-8 first:pl-0 last:pr-0">
                <div className="text-2xl lg:text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-[11px] font-semibold text-white/50 mb-0.5 tracking-wide">{s.label}</div>
                <div className="text-[10px] text-white/20 tracking-wide">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-px bg-transparent lg:bg-white/5">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 bg-[#060606] p-8 lg:p-10 border border-white/5 lg:border-none">
              <div className="flex gap-0.5 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-white/55 text-[15px] leading-relaxed mb-8 font-light italic">"{t.text}"</p>
              <div>
                <p className="text-white/80 text-sm font-semibold">{t.name}</p>
                <p className="text-white/25 text-[11px] tracking-[0.15em] uppercase mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA banner */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-2">Ready to build?</p>
            <h3 className="text-2xl lg:text-3xl font-black text-white">Launch your wellness platform today.</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl('MerchantOnboarding')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <button className="bg-white text-black px-8 py-4 text-[12px] font-bold tracking-widest uppercase hover:bg-white/90 transition-colors flex items-center gap-2">
                Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <Link to={createPageUrl('ForBusiness')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <button className="border border-white/20 text-white/60 hover:text-white hover:border-white/40 px-8 py-4 text-[12px] font-bold tracking-widest uppercase transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}