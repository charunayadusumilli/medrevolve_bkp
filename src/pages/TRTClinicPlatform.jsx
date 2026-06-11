import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Shield, Zap, DollarSign } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const FEATURES = [
  'White-label TRT telehealth portal under your brand',
  'Multi-state licensed physicians — testosterone prescribing',
  'Licensed 503A compounding pharmacy network included',
  'HIPAA-compliant patient records and messaging',
  'Automated lab order integration',
  'Monthly subscription billing — set your own pricing',
  'LegitScript-ready compliance framework',
  'Launch in under 7 days — no tech team needed',
];

export default function TRTClinicPlatform() {
  return (
    <div className="bg-white">
      <SEOHead
        title="TRT Clinic Platform for Hormone-Optimization Practices | MedRevolve"
        description="Launch a TRT practice on the platform built for hormone-optimization clinics. Provider network, compliance, payments, all included."
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
            TRT & Men's Health Clinic Platform
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            The TRT clinic platform built for<br />
            <span className="text-blue-400">hormone-optimization practices.</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            MedRevolve gives entrepreneurs and clinic owners a complete testosterone replacement therapy telehealth platform — white-labeled, fully compliant, with licensed physicians in all 50 states and pharmacy fulfillment built in.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-sm text-base">
                Start Free Setup Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/MerchantDemo">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-3 rounded-sm text-base">
                See Platform Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── WHY TRT ── */}
      <section className="py-16 px-6 bg-[#F7F4ED]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            The TRT Market Is Exploding — Most Entrepreneurs Don't Know How to Start
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm mb-10">
            1,600+ people search "how to start a TRT company" every month. The barrier is compliance and infrastructure — not demand. MedRevolve removes every barrier.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, label: 'Fully Compliant', sub: 'HIPAA, DEA-licensed physicians, state-by-state coverage' },
              { icon: <Zap className="w-6 h-6" />, label: '7-Day Launch', sub: 'From contract to live portal in under a week' },
              { icon: <DollarSign className="w-6 h-6" />, label: 'Recurring Revenue', sub: 'Monthly subscriptions — you set your own pricing' },
            ].map((f, i) => (
              <motion.div key={f.label} {...fade(i * 0.1)} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-blue-500 mb-3 flex justify-center">{f.icon}</div>
                <p className="font-black text-gray-900 mb-1 text-sm">{f.label}</p>
                <p className="text-xs text-gray-500">{f.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            Everything Included in Your<br /><span className="text-blue-500">TRT Clinic Platform</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f} {...fade(i * 0.05)} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{f}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#0A0A0A] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Launch Your TRT Clinic Platform Today</h2>
          <p className="text-white/50 mb-8">Book a free strategy call. We'll walk you through exactly how to launch a compliant, branded TRT telehealth company — without hiring a single employee.</p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-10 py-3 rounded-sm text-base">
              Book Free Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}