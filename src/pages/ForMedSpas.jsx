import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const BENEFITS = [
  'Physician-supervised GLP-1 weight loss programs under your brand',
  'No new staff hiring — providers are included in the platform',
  'Same-week launch after onboarding call',
  'HIPAA-compliant patient management built in',
  'Monthly recurring revenue from subscription programs',
  'Licensed 503A pharmacy fulfillment — ships direct to patients',
  'LegitScript-ready compliance framework',
  'Full white-label: your logo, your domain, your brand',
];

const STATS = [
  { value: '3,600+', label: 'monthly searches for "med spa weight loss program"' },
  { value: '$399/mo', label: 'average patient revenue per month' },
  { value: '7 days', label: 'average time to launch' },
  { value: '50 states', label: 'provider network coverage' },
];

export default function ForMedSpas() {
  return (
    <div className="bg-white">
      {/* Meta is handled by index.html SEO defaults; per-page SEO via SEOHead if needed */}

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-green-400 border border-green-400/30 rounded-full px-4 py-1.5 mb-6">
            Med Spa & Aesthetic Clinic Platform
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Add a GLP-1 Weight Loss Program<br />
            <span className="text-green-400">to Your Med Spa — in 7 Days</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            MedRevolve gives med spas and aesthetic clinics a complete, physician-supervised telehealth weight loss program — fully white-labeled under your brand, HIPAA compliant, and generating recurring monthly revenue from day one.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-sm text-base">
                Start Free Setup Call <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/MerchantDemo">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-3 rounded-sm text-base">
                See Live Platform Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#F7F4ED] py-10 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.08)} className="text-center">
              <p className="text-2xl md:text-3xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Everything Your Med Spa Needs<br />
              <span className="text-green-600">to Launch Telehealth</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              No technology team. No compliance attorney. No pharmacy negotiations. We handle all of it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b} {...fade(i * 0.05)} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-[#0A0A0A] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">How Med Spas Launch With MedRevolve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Onboarding Call', desc: 'A 30-minute call to understand your spa\'s existing services, client base, and revenue goals. We design your program around your brand.' },
              { step: '02', title: 'Platform Setup', desc: 'We configure your white-label portal, connect your domain, set up patient intake, and verify pharmacy partnerships. Done in 48 hours.' },
              { step: '03', title: 'Launch & Scale', desc: 'Your med spa\'s GLP-1 program goes live. Patients enroll, consult with licensed physicians, and receive pharmacy-direct shipments.' },
            ].map((item, i) => (
              <motion.div key={item.step} {...fade(i * 0.1)} className="border border-white/10 rounded-xl p-6">
                <p className="text-green-400 text-4xl font-black mb-3">{item.step}</p>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Add Recurring Revenue to Your Med Spa?</h2>
          <p className="text-gray-500 mb-8">Book a free 30-minute strategy call. We'll show you exactly how your med spa launches a branded weight loss telehealth program — with zero overhead.</p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-[#0A0A0A] hover:bg-gray-800 text-white font-bold px-10 py-3 rounded-sm text-base">
              Book Free Strategy Call <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> No setup fees</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> HIPAA compliant</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Launch in 7 days</span>
          </div>
        </div>
      </section>
    </div>
  );
}