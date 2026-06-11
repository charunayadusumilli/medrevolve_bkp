import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const STEPS = [
  { n: '01', title: 'Platform Onboarding', desc: 'Complete a 30-minute setup call. We configure your white-label portal, patient intake, pharmacy connections, and billing in 48 hours.' },
  { n: '02', title: 'Physician Network Live', desc: 'Your patients consult with licensed physicians from our 50-state network. No providers to hire, credential, or manage.' },
  { n: '03', title: 'Pharmacy Fulfillment', desc: 'Licensed 503A pharmacies ship medications directly to your patients. Automatic refills, tracking, and compliance built in.' },
  { n: '04', title: 'Scale Your Clinic', desc: 'No per-patient overhead. Add unlimited patients under your brand. Your margin grows as your clinic grows.' },
];

const INCLUDED = [
  'White-label patient portal (your brand, your domain)',
  'Licensed telehealth physicians — all 50 states',
  '503A pharmacy network — direct patient shipping',
  'HIPAA-compliant patient records and messaging',
  'Automated subscription billing',
  'LegitScript-ready compliance framework',
  'Marketing assets and patient acquisition support',
  'Dedicated launch team — go live in 7 days',
];

export default function WeightLossClinicPlatform() {
  return (
    <div className="bg-white">
      <SEOHead
        title="GLP-1 & Weight-Loss Clinic Platform | MedRevolve"
        description="The GLP-1 and weight-loss clinic platform — provider network, intake, telehealth, and payments in one."
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-yellow-400 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6">
            Medical Weight Loss Clinic Platform
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            The GLP-1 and weight-loss platform<br />
            <span className="text-yellow-400">that runs your clinic.</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            2,400 entrepreneurs search "how to start a medical weight loss clinic" every month. MedRevolve is the only platform that gives you the complete infrastructure — physicians, pharmacy, compliance, technology — all in one.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-sm text-base">
                Start Free Setup Call <ArrowRight className="w-4 h-4 ml-2" />
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

      {/* ── MARKET ── */}
      <section className="py-12 px-6 bg-yellow-50 border-y border-yellow-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            <p className="font-black text-gray-900 text-lg">The Medical Weight Loss Market</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { v: '$82B', l: 'global GLP-1 market by 2030' },
              { v: '2,400/mo', l: 'searches for "start medical weight loss clinic"' },
              { v: '42%', l: 'of US adults are actively seeking weight loss solutions' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-black text-yellow-600">{s.v}</p>
                <p className="text-xs text-gray-500 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            How You Launch a Weight Loss Clinic<br /><span className="text-yellow-500">With MedRevolve</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fade(i * 0.08)} className="border border-gray-100 rounded-xl p-6">
                <p className="text-yellow-500 text-4xl font-black mb-3">{s.n}</p>
                <h3 className="font-black text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUDED ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">What's Included</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {INCLUDED.map((item, i) => (
              <motion.div key={item} {...fade(i * 0.05)} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Your Weight Loss Clinic Starts Here</h2>
          <p className="text-gray-500 mb-8">Book a free 30-minute call and we'll walk you through launching your branded medical weight loss clinic — in as little as 7 days.</p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-[#0A0A0A] hover:bg-gray-800 text-white font-bold px-10 py-3 rounded-sm text-base">
              Book Free Strategy Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}