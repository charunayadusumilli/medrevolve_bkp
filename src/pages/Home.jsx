import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Phone, Shield, Users, Building2, Stethoscope, TrendingUp, Lock, FileText } from 'lucide-react';
import { createPageUrl } from '@/utils';

const SERVICES = [
  { icon: TrendingUp, label: 'GLP-1 / Weight Management', desc: 'Semaglutide, Tirzepatide — physician-supervised protocols' },
  { icon: Users, label: "Men's Health / TRT", desc: 'Testosterone replacement, optimized for outcomes' },
  { icon: Stethoscope, label: "Women's Health / BHRT", desc: 'Bioidentical hormone restoration' },
  { icon: CheckCircle, label: 'Longevity & Wellness', desc: 'Hair, skin, and general wellness programs' },
];

const B2B_FEATURES = [
  { icon: Building2, label: 'White-Label Platform', desc: 'Launch your telehealth brand with our full-stack infrastructure' },
  { icon: Shield, label: 'LegitScript Certified', desc: 'Fully compliant, audit-ready, HIPAA-covered infrastructure' },
  { icon: FileText, label: 'Licensed 503A Pharmacy', desc: 'Direct pharmacy fulfillment network — all 50 states' },
  { icon: Lock, label: 'Compliance-First', desc: 'Built-in HIPAA, LegitScript, and payment processor compliance' },
];

const COMPLIANCE_BADGES = [
  'HIPAA Compliant',
  'LegitScript Certified',
  'Licensed Providers — All 50 States',
  'Licensed 503A Pharmacy Network',
];

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fade} initial="hidden" animate="show">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-400 border border-green-400/30 rounded-full px-4 py-1.5 mb-6">
              Physician-Supervised Telehealth
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              The Telehealth Platform<br />
              <span className="text-white/40">Built for Modern Medicine.</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect patients with licensed providers for GLP-1, hormone therapy, and wellness care — or launch your own white-label telehealth business on our compliant infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('BookAppointment')}>
                <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 py-3 text-sm font-bold h-auto">
                  Book a Consultation <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to={createPageUrl('ForBusiness')}>
                <Button variant="ghost" className="text-white/60 hover:text-white rounded-sm px-8 py-3 text-sm font-semibold h-auto border border-white/10 hover:border-white/30">
                  Launch Your Platform
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COMPLIANCE STRIP ─────────────────────────────────────────── */}
      <div className="bg-gray-50 border-y border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {COMPLIANCE_BADGES.map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── CLINICAL SERVICES ────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Clinical Programs</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every program is physician-supervised, pharmacy-fulfilled, and available in all 50 states.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map(({ icon: Icon, label, desc }) => (
              <motion.div key={label} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="border border-gray-100 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all group">
                <Icon className="w-5 h-5 text-gray-400 mb-3 group-hover:text-gray-700 transition-colors" />
                <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('BookAppointment')}>
              <Button className="bg-gray-900 hover:bg-gray-700 text-white rounded-sm px-8 font-semibold">
                Book a Consultation <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100" />

      {/* ── B2B PLATFORM ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 mb-4">For Business</span>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Launch Your Telehealth Business</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Med spas, wellness clinics, and healthcare practices use MedRevolve to add compliant telehealth revenue without building from scratch.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {B2B_FEATURES.map(({ icon: Icon, label, desc }) => (
              <motion.div key={label} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-all">
                <Icon className="w-5 h-5 text-gray-400 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to={createPageUrl('ForBusiness')}>
              <Button className="bg-gray-900 hover:bg-gray-700 text-white rounded-sm px-8 font-semibold">
                Explore Business Platform <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CALL CTA ─────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Have questions? Talk to a specialist.</h2>
          <p className="text-white/40 mb-8 text-sm">Available Monday – Friday, 9am–6pm ET</p>
          <a href="tel:+12403875224">
            <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-10 py-3 h-auto text-base font-bold">
              <Phone className="w-4 h-4 mr-2" /> 240-387-5224
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
}