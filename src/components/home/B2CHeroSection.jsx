import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PROGRAMS = [
  { label: 'GLP-1 Weight Loss', color: '#4A9B6F' },
  { label: 'Hormone Therapy', color: '#6B5EA7' },
  { label: 'Men\'s Health', color: '#2D6A9F' },
  { label: 'Women\'s Wellness', color: '#B85C7A' },
];

const TRUST_BADGES = [
  'Licensed physicians in all 50 states',
  'HIPAA-compliant & FDA-compliant programs',
  'Pharmacy-dispensed, physician-prescribed',
];

export default function B2CHeroSection() {
  const [progIdx, setProgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setProgIdx(i => (i + 1) % PROGRAMS.length), 2600);
    return () => clearInterval(t);
  }, []);

  const prog = PROGRAMS[progIdx];

  return (
    <section className="relative bg-[#060606] min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background photo — doctor/patient consultation feel */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=60"
          alt=""
          className="w-full h-full object-cover opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/80 to-[#060606]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060606]" />
      </div>

      {/* Green radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #4A6741 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: headline + CTA */}
          <div>
            {/* Social proof badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-white/60 text-xs font-medium">Trusted by 50,000+ patients</span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="font-black text-white leading-[1.0] tracking-[-0.03em] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)' }}>
                Physician-Supervised{' '}
                <motion.span
                  key={progIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ color: prog.color }}
                  className="block">
                  {prog.label}
                </motion.span>
                <span className="text-white/70"> — From Home.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-base lg:text-lg leading-relaxed mb-8 max-w-xl font-light">
              Connect with a licensed provider online, get your prescription filled by a licensed pharmacy, and have it delivered to your door — all in one physician-supervised program.
            </motion.p>

            {/* Trust bullets */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2.5 mb-10">
              {TRUST_BADGES.map((b, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#6B8F5E] flex-shrink-0" />
                  <span className="text-white/60 text-sm">{b}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3">
              <Link to={createPageUrl('BookAppointment')}>
                <button className="flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-white/90 transition-colors rounded-sm">
                  Book Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to={createPageUrl('Products')}>
                <button className="flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 text-sm font-medium uppercase hover:bg-white/5 hover:text-white hover:border-white/40 transition-all rounded-sm">
                  View Programs
                </button>
              </Link>
            </motion.div>

            {/* FDA disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/20 text-[10px] mt-6 leading-relaxed max-w-sm">
              All programs require evaluation by a licensed physician. Results may vary. Not intended to diagnose, treat, cure, or prevent any disease.
            </motion.p>
          </div>

          {/* RIGHT: "How it works" mini card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="hidden lg:block">
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-6">Your Journey</p>
              {[
                { step: '01', title: 'Book Online', desc: 'Schedule a free consultation with a licensed provider — no insurance needed.' },
                { step: '02', title: 'Provider Visit', desc: 'Meet your doctor via telehealth. Review your health history and treatment options.' },
                { step: '03', title: 'Get Your Rx', desc: 'If appropriate, your physician prescribes your program and routes it to a licensed pharmacy.' },
                { step: '04', title: 'Delivered to You', desc: 'Your medication ships discreetly to your door with ongoing physician monitoring.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <div className="w-8 h-8 rounded-full bg-[#4A6741]/20 border border-[#4A6741]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#6B8F5E] text-[10px] font-black">{s.step}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-0.5">{s.title}</p>
                    <p className="text-white/35 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-5 border-t border-white/8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#6B8F5E]" />
                  <span className="text-white/30 text-xs">HIPAA-compliant · Licensed providers · 50 states</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}