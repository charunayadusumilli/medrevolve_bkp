import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowDown, CheckCircle2, Shield, Lock, Star, Zap, Globe } from 'lucide-react';
import FloatingGlobe3D, { GLOBE_SERVICES } from '@/components/home/FloatingGlobe3D';

const US_TRUST_STRIP = [
  { icon: Shield, text: 'HIPAA Title II' },
  { icon: Lock, text: 'LegitScript Ready' },
  { icon: CheckCircle2, text: 'DEA-Licensed' },
  { icon: Star, text: 'NABP-Verified' },
  { icon: Zap, text: 'FTC & FDA Ads' },
  { icon: Globe, text: 'All 50 States' },
];

const FLOATING_BADGES = [
  { text: '50 States', top: '18%', left: '6%', delay: 0, dur: 3 },
  { text: 'HIPAA', top: '28%', right: '8%', delay: 0.5, dur: 3.5 },
  { text: '7 Days Live', bottom: '32%', left: '4%', delay: 1, dur: 4 },
  { text: '24/7 Support', bottom: '22%', right: '6%', delay: 1.5, dur: 3.2 },
];

export default function TelehealthGlobeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % GLOBE_SERVICES.length);
    }, 4000);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const go = (i) => { setPaused(false); setActive(i); startTimer(); };
  const step = GLOBE_SERVICES[active];

  return (
    <section className="relative bg-[#060606] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />

      {/* Color wash behind active service */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 70% 60% at 50% 42%, ${step.color}12 0%, transparent 70%)` }} />

      {/* Floating glassmorphic badges */}
      {FLOATING_BADGES.map((badge, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + badge.delay * 0.3, duration: 0.5 }}
          className="absolute hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md z-20 pointer-events-none"
          style={{ top: badge.top, left: badge.left, right: badge.right, bottom: badge.bottom }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: badge.dur, ease: 'easeInOut' }}>
            <span className="text-white/60 text-xs font-bold tracking-wide">{badge.text}</span>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-12 pt-14 pb-8">

        {/* ── US confidence bar ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-white/20">🇺🇸</span>
            <span className="text-[11px] font-semibold text-white/20">Built for US entrepreneurs — operable in any state, day one.</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Platform Live</span>
          </div>
        </motion.div>

        {/* ── Headline ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
              🇺🇸 US-Licensed · Federal & State Compliant · Any State, Day One
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-white leading-[1.02] mb-4"
            style={{ letterSpacing: '-0.03em' }}>
            Launch telehealth<br />
            <span style={{ color: step.color, transition: 'color 0.7s ease' }}>anywhere in the US.</span>
          </h1>
          <p className="text-white/30 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Services, payments, and unified CRM — all under your brand. We own the vendor relationships so you can operate with confidence.
          </p>
        </motion.div>

        {/* ── 3D Globe ── */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[340px] md:h-[440px] lg:h-[500px] mb-6"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <FloatingGlobe3D activeIndex={active} onServiceClick={go} />
        </motion.div>

        {/* ── Service pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" style={{ perspective: '1000px' }}>
          {GLOBE_SERVICES.map((s, i) => (
            <motion.button key={s.key} onClick={() => go(i)}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                active === i
                  ? 'text-white border-transparent shadow-lg'
                  : 'bg-white/5 text-white/30 border-white/8 hover:text-white/60 hover:border-white/15'
              }`}
              style={{
                background: active === i ? s.color : undefined,
                boxShadow: active === i ? `0 4px 20px ${s.color}40` : undefined,
              }}>
              <span className="text-sm">{s.icon}</span>
              <span>{s.label}</span>
            </motion.button>
          ))}
        </div>

        {/* ── Active service detail ── */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border"
              style={{ borderColor: step.color + '40', background: step.color + '12' }}>
              <span className="text-sm">{step.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: step.color }}>{step.label}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.025em' }}>
              {step.headline}
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-4">{step.desc}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {step.stats.map((stat, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 px-2.5 py-1 rounded-full bg-white/5 border border-white/8">
                  <CheckCircle2 className="w-3 h-3" style={{ color: step.color }} /> {stat}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link to="/MerchantOnboarding">
            <Button size="lg"
              className="w-full sm:w-auto bg-white text-[#060606] hover:bg-white/90 rounded-sm px-8 font-black text-sm h-auto py-3.5">
              Book a Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <a href="tel:+12403875224">
            <Button size="lg" variant="ghost"
              className="w-full sm:w-auto text-white/40 border border-white/8 hover:bg-white/5 hover:text-white rounded-sm px-6 text-sm h-auto py-3.5">
              Call 240-387-5224
            </Button>
          </a>
        </div>

        {/* ── US trust strip ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="pt-6 border-t border-white/5">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/15 text-center mb-4">
            US Federal & State Compliance Standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {US_TRUST_STRIP.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-1.5 text-white/25 hover:text-white/50 transition-colors">
                <Icon className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-[11px] font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Scroll hint ── */}
        <div className="flex justify-center pt-8 pb-2">
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5 text-white/10 cursor-pointer"
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' })}>
            <span className="text-[9px] uppercase tracking-widest font-bold">Explore the platform</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}