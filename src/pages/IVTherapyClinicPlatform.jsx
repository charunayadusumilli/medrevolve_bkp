import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const SERVICES = [
  'IV hydration and vitamin drip programs',
  'Physician-supervised NAD+ therapy',
  'Weight management add-on programs (GLP-1)',
  'Hormone optimization (TRT / BHRT)',
  'Longevity and peptide protocols',
  'Telehealth follow-up consultations',
];

const INCLUDED = [
  'White-label patient portal — your brand and domain',
  'Licensed telehealth physicians for medical oversight',
  'Compliance framework (HIPAA, LegitScript-ready)',
  '503A pharmacy network for compound medications',
  'Automated patient scheduling and intake',
  'Monthly subscription billing infrastructure',
  'Launch support — go live in 7 days',
  'Marketing assets and patient acquisition templates',
];

export default function IVTherapyClinicPlatform() {
  return (
    <div className="bg-white">
      <SEOHead />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span {...fade(0)} className="inline-block text-[10px] font-black uppercase tracking-widest text-cyan-400 border border-cyan-400/30 rounded-full px-4 py-1.5 mb-6">
            IV Therapy & Wellness Clinic Platform
          </motion.span>
          <motion.h1 {...fade(0.1)} className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Add Telehealth to Your<br />
            <span className="text-cyan-400">IV Therapy Clinic — in 7 Days</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            IV therapy clinics are the fastest growing category for telehealth add-ons. MedRevolve gives your clinic a full physician-supervised telehealth wing — weight management, hormone optimization, and longevity protocols — all under your existing brand.
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-sm text-base">
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

      {/* ── SERVICES YOU CAN ADD ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">
            Physician-Supervised Programs<br />
            <span className="text-cyan-500">You Can Add to Your IV Clinic</span>
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10">Expand your service menu without expanding your staff headcount.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <motion.div key={s} {...fade(i * 0.08)} className="border border-cyan-100 bg-cyan-50 rounded-xl p-5">
                <CheckCircle className="w-5 h-5 text-cyan-500 mb-3" />
                <p className="text-sm font-bold text-gray-800">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">What's Included in the Platform</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {INCLUDED.map((item, i) => (
              <motion.div key={item} {...fade(i * 0.05)} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Add Recurring Revenue to Your IV Clinic</h2>
          <p className="text-gray-500 mb-8">Your IV therapy clients are already your best candidates for telehealth programs. MedRevolve turns them into monthly recurring subscribers — under your brand.</p>
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