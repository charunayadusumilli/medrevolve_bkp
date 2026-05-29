import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const COMPARISON = [
  { feature: 'Full white-label (your brand, domain)', medrevolve: true, openloop: false },
  { feature: 'Pharmacy network included', medrevolve: true, openloop: false },
  { feature: 'Launch in 7 days', medrevolve: true, openloop: false },
  { feature: 'Dedicated launch team', medrevolve: true, openloop: false },
  { feature: 'LegitScript-ready compliance', medrevolve: true, openloop: true },
  { feature: '50-state provider coverage', medrevolve: true, openloop: true },
  { feature: 'No per-patient fees', medrevolve: true, openloop: false },
  { feature: 'Integrated patient portal', medrevolve: true, openloop: true },
];

export default function OpenLoopAlternative() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-orange-400 border border-orange-400/30 rounded-full px-4 py-1.5 mb-6">
            OpenLoop Alternative
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Looking for an OpenLoop Alternative?<br />
            <span className="text-orange-400">MedRevolve Includes More — For Less</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            OpenLoop is a provider staffing solution. MedRevolve is a full-stack telehealth platform — white-label, pharmacy, compliance, technology, and patient management all in one. If you're outgrowing OpenLoop or just getting started, here's why operators choose MedRevolve.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-sm text-base">
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

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">
            MedRevolve vs. OpenLoop
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10">Feature-by-feature comparison for telehealth operators</p>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900 text-white">
              <div className="p-4 font-black text-sm">Feature</div>
              <div className="p-4 font-black text-sm text-green-400 text-center">MedRevolve</div>
              <div className="p-4 font-black text-sm text-gray-400 text-center">OpenLoop</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="p-4 text-sm text-gray-700">{row.feature}</div>
                <div className="p-4 flex justify-center">
                  {row.medrevolve ? <CheckCircle className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-400" />}
                </div>
                <div className="p-4 flex justify-center">
                  {row.openloop ? <CheckCircle className="w-5 h-5 text-gray-400" /> : <X className="w-5 h-5 text-red-300" />}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            * Comparison based on publicly available information. Features subject to change.
          </p>
        </div>
      </section>

      {/* ── WHY SWITCH ── */}
      <section className="py-16 px-6 bg-[#F7F4ED]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Why Operators Switch to MedRevolve</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: '🏷️', title: 'True White-Label', desc: 'Your domain. Your logo. Your brand. Patients never see MedRevolve.' },
              { emoji: '💊', title: 'Pharmacy Included', desc: 'We bring licensed 503A pharmacy partners. No separate negotiations.' },
              { emoji: '🚀', title: 'Launch in 7 Days', desc: 'OpenLoop staffs your providers. MedRevolve gives you the entire operating platform.' },
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
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to See the Full Platform?</h2>
          <p className="text-gray-500 mb-8">Book a free 30-minute call. We'll show you exactly what MedRevolve delivers and how it compares to every alternative on the market.</p>
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