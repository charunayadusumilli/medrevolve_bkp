import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const stats = [
  { v: '200+', l: 'Merchant Partners' },
  { v: 'LegitScript', l: 'Certification Ready' },
  { v: 'HIPAA', l: 'Compliant' },
  { v: '7 Days', l: 'Avg. Launch Time' },
];

const features = [
  'White-label telehealth platform under your brand',
  'LegitScript-ready compliance stack',
  'Integrated marketing & website builder',
  'MedRevolve University — ongoing training',
];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const words = ['Telehealth', 'Wellness', 'Clinical', 'Med Spa'];

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative bg-[#0A0A0A] lg:min-h-screen flex flex-col justify-center overflow-hidden" style={{ minHeight: 'clamp(400px, 80vh, 100vh)' }}>

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #4A6741 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-24 w-full">
        <div className="max-w-3xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B8F5E]" />
            <span className="text-white/50 text-xs tracking-widest uppercase font-medium">Complete Wellness Commerce OS</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <h1 className="font-black text-white leading-[0.95] tracking-[-0.03em] mb-4 lg:mb-6"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 6.5rem)' }}>
              Your{' '}
              <span className="relative inline-block">
                <motion.span
                  key={wordIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="text-[#6B8F5E]">
                  {words[wordIdx]}
                </motion.span>
              </span>
              <br />Business,
              <br />Live Today.
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/45 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xl font-light">
            MedRevolve is the complete platform to launch and grow a compliant telehealth or wellness business.
          </motion.p>

          {/* Feature checklist — hidden on mobile to save space */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#6B8F5E] flex-shrink-0" />
                <span className="text-white/55 text-sm">{f}</span>
              </li>
            ))}
          </motion.ul>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4">
            <Link to={createPageUrl('MerchantOnboarding')}>
              <button className="flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-colors rounded-sm">
                Start Your Platform
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to={createPageUrl('TelehealthPlatform')}>
              <button className="flex items-center gap-3 border border-white/20 text-white/70 px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white/5 hover:text-white hover:border-white/40 transition-all rounded-sm">
                See How It Works
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Stats row — hidden on mobile to save space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden lg:flex mt-20 pt-8 border-t border-white/8 flex-wrap gap-x-12 gap-y-6">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-white text-2xl font-black">{s.v}</p>
              <p className="text-white/25 text-[11px] tracking-[0.2em] uppercase mt-0.5">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}