import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const COMPARISON = [
  { feature: 'Full white-label (your brand, domain)', medrevolve: true, other: false },
  { feature: 'Pharmacy fulfillment network included', medrevolve: true, other: false },
  { feature: 'Launch in 7 days', medrevolve: true, other: false },
  { feature: 'No per-patient transaction fees', medrevolve: true, other: false },
  { feature: 'LegitScript compliance support', medrevolve: true, other: true },
  { feature: '50-state licensed provider network', medrevolve: true, other: true },
  { feature: 'GLP-1 / Weight loss programs', medrevolve: true, other: true },
  { feature: 'Dedicated merchant success team', medrevolve: true, other: false },
];

export default function MyTelemedicineAlternative() {
  return (
    <div className="bg-white">
      <SEOHead />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-400/30 rounded-full px-4 py-1.5 mb-6">
            MyTelemedicine Alternative
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Looking for a MyTelemedicine Alternative?<br />
            <span className="text-purple-400">MedRevolve Is the Full-Stack Solution</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            If you've been evaluating MyTelemedicine for your clinic or wellness business, here's what MedRevolve adds: true white-labeling, pharmacy integration, LegitScript compliance support, and a dedicated 7-day launch process — all in one platform.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-3 rounded-sm text-base">
                See If You Qualify <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/MerchantDemo">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-3 rounded-sm text-base">
                See Live Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">MedRevolve vs. MyTelemedicine</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Feature comparison for telehealth business operators</p>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900 text-white">
              <div className="p-4 font-black text-sm">Feature</div>
              <div className="p-4 font-black text-sm text-purple-400 text-center">MedRevolve</div>
              <div className="p-4 font-black text-sm text-gray-400 text-center">MyTelemedicine</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="p-4 text-sm text-gray-700">{row.feature}</div>
                <div className="p-4 flex justify-center">
                  {row.medrevolve ? <CheckCircle className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-400" />}
                </div>
                <div className="p-4 flex justify-center">
                  {row.other ? <CheckCircle className="w-5 h-5 text-gray-400" /> : <X className="w-5 h-5 text-red-300" />}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            * Comparison based on publicly available information. Features subject to change.
          </p>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ── */}
      <section className="py-16 px-6 bg-[#F7F4ED]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-8">What Makes MedRevolve Different</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: '🏷️', title: 'True White-Label', desc: 'Patient portal, communications, and brand — all under your name. No MedRevolve branding visible to your patients.' },
              { emoji: '💊', title: 'Pharmacy Built In', desc: 'Licensed 503A pharmacy network for GLP-1, hormone, and wellness medications — included from day one.' },
              { emoji: '📋', title: 'Compliance First', desc: 'LegitScript support, HIPAA infrastructure, and DEA-compliant prescribing workflows are part of every setup.' },
            ].map((item, i) => (
              <motion.div key={item.title} {...fade(i * 0.1)} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-4">See the Platform That Includes Everything</h2>
          <p className="text-gray-500 mb-8">Book a free 30-minute strategy call. No sales pressure — just a clear walkthrough of what MedRevolve includes and how your launch timeline looks.</p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-[#0A0A0A] hover:bg-gray-800 text-white font-bold px-10 py-3 rounded-sm text-base">
              Book Free Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}