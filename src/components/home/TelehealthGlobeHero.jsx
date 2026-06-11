import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowDown } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    n: '01',
    tag: 'BUSINESS FOUNDATION',
    headline: 'You have an idea.',
    sub: 'A wellness clinic. A med spa. A weight-loss brand. You know the market. You just need the infrastructure.',
    detail: 'MedRevolve sets up your LLC, merchant account, domain, and brand identity — so your business is real and fundable from day one.',
    stat: { val: '48 hrs', label: 'to live brand & site' },
    color: '#4A6741',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=70',
  },
  {
    n: '02',
    tag: 'PLATFORM & STOREFRONT',
    headline: 'Your branded platform goes live.',
    sub: 'A full telehealth storefront — under your name, on your domain. Patients see your brand, not ours.',
    detail: 'White-label patient portal, program pages, HIPAA-compliant intake forms, Stripe checkout, and SEO-ready architecture — all built and deployed for you.',
    stat: { val: '7 days', label: 'to a live, operational site' },
    color: '#2D6A9F',
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=70',
  },
  {
    n: '03',
    tag: 'PROVIDERS & PHARMACY',
    headline: 'The clinical backbone is wired in.',
    sub: 'Board-certified physicians, NPs, and licensed 503A pharmacies — connected to your platform, ready to serve your patients.',
    detail: 'Multi-state prescribing, e-prescribing & EMR, Google Calendar scheduling, and pharmacy routing — fully integrated and automated.',
    stat: { val: '50 states', label: 'provider coverage' },
    color: '#7B5EA7',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=70',
  },
  {
    n: '04',
    tag: 'MARKETING & REVENUE',
    headline: 'Patients start flowing in.',
    sub: 'A full acquisition and retention engine — email, SMS, paid ads, creator affiliates — all compliant, all automated.',
    detail: 'LegitScript certification process, Google & Meta ad structure, HubSpot CRM, Twilio SMS flows, drip sequences, and real-time analytics — built and activated.',
    stat: { val: '$42.8k', label: 'avg. monthly revenue (month 6)' },
    color: '#B85C38',
    img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=900&q=70',
  },
  {
    n: '05',
    tag: 'COMPLIANCE & SCALE',
    headline: 'You scale — protected.',
    sub: 'Ongoing HIPAA compliance, BAA management, automated audits, and state-by-state prescribing monitoring. Grow without legal exposure.',
    detail: 'Monthly operations reviews, compliance documentation library, multi-state expansion roadmap, and your own MedRevolve success team on call.',
    stat: { val: '100%', label: 'HIPAA compliant from day one' },
    color: '#0B6B63',
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=70',
  },
];

// Animated globe SVG component
function GlobeVisual({ activeStep }) {
  const color = JOURNEY_STEPS[activeStep].color;
  const pct = ((activeStep + 1) / JOURNEY_STEPS.length) * 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full opacity-10 blur-3xl transition-all duration-1000"
        style={{
          width: '520px', height: '520px',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />

      {/* Globe SVG */}
      <svg viewBox="0 0 400 400" className="w-[340px] h-[340px] md:w-[420px] md:h-[420px]" style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.5))' }}>
        <defs>
          <radialGradient id="globeGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1a2a1a" />
            <stop offset="100%" stopColor="#060606" />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx="200" cy="200" r="170" />
          </clipPath>
        </defs>

        {/* Globe base */}
        <circle cx="200" cy="200" r="170" fill="url(#globeGrad)" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="1" />

        {/* Latitude lines */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((y, i) => {
          const dy = y - 200;
          const r = Math.sqrt(170 * 170 - dy * dy);
          if (isNaN(r)) return null;
          return (
            <ellipse key={i} cx="200" cy={y} rx={r} ry={r * 0.35}
              fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.8" />
          );
        })}

        {/* Longitude lines */}
        {[0, 36, 72, 108, 144].map((angle, i) => (
          <ellipse key={i} cx="200" cy="200" rx="170" ry={170 * Math.abs(Math.cos(angle * Math.PI / 180))}
            fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.8"
            transform={`rotate(${angle}, 200, 200)`} />
        ))}

        {/* Active meridian highlight */}
        <ellipse cx="200" cy="200" rx="170" ry={60 + activeStep * 20}
          fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="1.5"
          style={{ transition: 'all 0.8s ease' }}
          transform={`rotate(${activeStep * 36}, 200, 200)`} />

        {/* Journey nodes — dots on globe */}
        {JOURNEY_STEPS.map((step, i) => {
          const angle = (i / JOURNEY_STEPS.length) * Math.PI * 2 - Math.PI / 2;
          const r = 120;
          const x = 200 + r * Math.cos(angle);
          const y = 200 + r * Math.sin(angle) * 0.55;
          const isActive = i === activeStep;
          const isPast = i < activeStep;

          return (
            <g key={i} style={{ cursor: 'pointer' }}>
              {/* Connection line */}
              {i > 0 && (
                <line
                  x1={200 + 120 * Math.cos(((i - 1) / JOURNEY_STEPS.length) * Math.PI * 2 - Math.PI / 2)}
                  y1={200 + 120 * Math.sin(((i - 1) / JOURNEY_STEPS.length) * Math.PI * 2 - Math.PI / 2) * 0.55}
                  x2={x} y2={y}
                  stroke={isPast || isActive ? color : 'white'}
                  strokeOpacity={isPast || isActive ? 0.5 : 0.1}
                  strokeWidth="1"
                  strokeDasharray={isPast || isActive ? "none" : "3,3"}
                  style={{ transition: 'all 0.6s ease' }}
                />
              )}

              {/* Pulse ring for active */}
              {isActive && (
                <circle cx={x} cy={y} r="18" fill={color} fillOpacity="0.12"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              )}

              {/* Node dot */}
              <circle cx={x} cy={y} r={isActive ? 7 : isPast ? 5 : 4}
                fill={isActive ? color : isPast ? color : '#333'}
                stroke={isActive ? 'white' : isPast ? color : '#555'}
                strokeWidth={isActive ? 2 : 1}
                style={{ transition: 'all 0.5s ease' }} />

              {/* Step number */}
              <text x={x + 12} y={y + 4} fill="white" fillOpacity={isActive ? 0.8 : 0.25}
                fontSize="9" fontWeight="bold" fontFamily="monospace"
                style={{ transition: 'all 0.5s ease' }}>
                {step.n}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text x="200" y="193" textAnchor="middle" fill="white" fillOpacity="0.15"
          fontSize="10" fontWeight="bold" fontFamily="sans-serif" letterSpacing="3">
          MEDREVOLVE
        </text>
        <text x="200" y="208" textAnchor="middle" fill="white" fillOpacity="0.08"
          fontSize="8" fontFamily="sans-serif" letterSpacing="2">
          PLATFORM
        </text>

        {/* Progress arc */}
        <circle cx="200" cy="200" r="185"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.3"
          strokeDasharray={`${pct * 11.62} 1162`}
          strokeLinecap="round"
          transform="rotate(-90 200 200)"
          style={{ transition: 'all 0.8s ease' }}
        />
      </svg>

      {/* Active step stat floating near globe */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-right">
          <p className="font-black text-3xl md:text-4xl" style={{ color }}>{JOURNEY_STEPS[activeStep].stat.val}</p>
          <p className="text-white/30 text-xs max-w-[140px] leading-tight">{JOURNEY_STEPS[activeStep].stat.label}</p>
        </motion.div>
      </AnimatePresence>

      <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.12} 50%{transform:scale(1.3);opacity:0.06} }`}</style>
    </div>
  );
}

export default function TelehealthGlobeHero() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % JOURNEY_STEPS.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [autoPlay]);

  const go = (i) => {
    setAutoPlay(false);
    setActive(i);
    clearInterval(timerRef.current);
  };

  const step = JOURNEY_STEPS[active];

  return (
    <section className="relative min-h-screen bg-[#060606] overflow-hidden flex flex-col">

      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#060606] to-transparent z-10 pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060606] to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 lg:px-12 pt-16 pb-8">

        {/* ── TOP: label + headline ── */}
        <div className="pt-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                Complete Telehealth Infrastructure
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-4"
              style={{ letterSpacing: '-0.03em' }}>
              Everything you need<br />
              <span style={{ color: step.color, transition: 'color 0.6s ease' }}>
                to own a telehealth business.
              </span>
            </h1>

            <p className="text-white/35 text-lg max-w-xl leading-relaxed">
              From zero to a HIPAA-compliant, physician-powered, revenue-generating telehealth platform — under your brand, in 7 days.
            </p>
          </motion.div>
        </div>

        {/* ── MAIN: Globe left + Step content right ── */}
        <div className="flex-1 grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-center">

          {/* Left: Globe */}
          <div className="relative h-[320px] md:h-[440px] flex items-center justify-center">
            <GlobeVisual activeStep={active} />
          </div>

          {/* Right: Step detail */}
          <div className="flex flex-col justify-center">

            {/* Step nav pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {JOURNEY_STEPS.map((s, i) => (
                <button key={i} onClick={() => go(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    active === i
                      ? 'text-white border-transparent shadow-lg'
                      : 'bg-transparent text-white/25 border-white/10 hover:text-white/50 hover:border-white/20'
                  }`}
                  style={{ background: active === i ? s.color : undefined }}>
                  <span>{s.n}</span>
                  <span className="hidden sm:inline">{s.tag}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}>

                {/* Step label */}
                <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ color: step.color }}>
                  Phase {step.n} — {step.tag}
                </p>

                {/* Headline */}
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3"
                  style={{ letterSpacing: '-0.02em' }}>
                  {step.headline}
                </h2>

                {/* Sub */}
                <p className="text-white/50 text-base leading-relaxed mb-4">
                  {step.sub}
                </p>

                {/* Detail */}
                <p className="text-white/25 text-sm leading-relaxed mb-8 border-l-2 pl-4"
                  style={{ borderColor: step.color + '50' }}>
                  {step.detail}
                </p>

                {/* Image strip */}
                <div className="rounded-xl overflow-hidden mb-8 h-[140px] relative">
                  <img src={step.img} alt={step.tag}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.55) saturate(0.8)' }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${step.color}40 0%, transparent 60%)` }} />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-white font-black text-2xl">{step.stat.val}</span>
                    <span className="text-white/50 text-xs ml-2">{step.stat.label}</span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/MerchantOnboarding">
                <Button size="lg"
                  className="bg-white text-[#060606] hover:bg-white/90 rounded-sm px-8 font-black text-sm h-auto py-3.5">
                  Book a Demo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/HowItWorks">
                <Button size="lg" variant="ghost"
                  className="text-white/50 border border-white/10 hover:bg-white/5 hover:text-white rounded-sm px-7 text-sm h-auto py-3.5">
                  See Full Journey
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* ── BOTTOM: Scroll hint ── */}
        <div className="flex justify-center pt-8 pb-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-white/15 cursor-pointer"
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to explore</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}