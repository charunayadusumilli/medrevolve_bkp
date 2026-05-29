import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const BENEFITS = [
  'No franchise fees — flat monthly platform fee',
  'Your brand, your domain, your pricing',
  'All 50 states covered via licensed physician network',
  'Pharmacy fulfillment network included',
  'HIPAA-compliant infrastructure',
  'LegitScript compliance support',
  'Full training and onboarding',
  'Launch in 7 days or less',
];

export default function TelehealthFranchise() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-teal-400 border border-teal-400/30 rounded-full px-4 py-1.5 mb-6">
            Telehealth Franchise Alternative
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Launch a Telehealth Business<br />
            <span className="text-teal-400">Without Buying a Franchise</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Traditional telehealth franchises lock you into their brand, their fees, and their rules. MedRevolve gives you the same operational infrastructure — physicians, pharmacy, compliance, technology — but under your own brand, with no franchise royalties.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-sm text-base">
                Start Free Strategy Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/ForBusiness">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-3 rounded-sm text-base">
                View Full Platform
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FRANCHISE VS MEDREVOLVE ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            Telehealth Franchise vs. MedRevolve Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-black text-gray-900 mb-5 text-lg">Traditional Telehealth Franchise</h3>
              {[
                '$50K–$250K+ upfront franchise fee',
                '5–10% ongoing royalty fees',
                'Locked into franchisor\'s brand',
                '6–18 month build-out timeline',
                'Geographic territory restrictions',
                'Limited control over pricing',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-200">
              <h3 className="font-black text-teal-800 mb-5 text-lg">MedRevolve Platform</h3>
              {[
                'Flat monthly platform fee — no royalties',
                'Your brand, domain, and pricing',
                'Launch in 7 days',
                'Nationwide — no territory restrictions',
                'You set your own prices and margins',
                'Full support team included',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Everything Included in the Platform</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b} {...fade(i * 0.05)} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#0A0A0A] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Own the Business. Keep All the Revenue.</h2>
          <p className="text-white/50 mb-8">Skip the franchise. Book a free 30-minute call and launch your telehealth company under your own brand in 7 days.</p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-10 py-3 rounded-sm text-base">
              Book Free Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}