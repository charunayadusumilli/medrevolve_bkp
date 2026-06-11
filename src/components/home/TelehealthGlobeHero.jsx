import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowDown, Shield, CheckCircle2, Lock, Star, Zap, Globe } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    n: '01',
    tag: 'BUSINESS FOUNDATION',
    headline: 'You have an idea.',
    sub: 'A wellness clinic. A med spa. A weight-loss brand. You know the market. We give you a US-registered business ready to operate on day one.',
    detail: 'LLC formation, EIN, merchant account, and your domain — all US-compliant, all handled. No lawyers, no guesswork.',
    stat: { val: 'All 50', label: 'states — open for business' },
    color: '#4A9B6F',
    trust: ['US LLC formation included', 'Federal EIN registration', 'US merchant account ready', 'State-compliant from the start'],
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    badge: { icon: '🇺🇸', text: 'US-Registered & Compliant' },
  },
  {
    n: '02',
    tag: 'PLATFORM & STOREFRONT',
    headline: 'Your branded platform goes live.',
    sub: 'A full telehealth storefront under your name, on your domain — built to US federal and state privacy standards from the ground up.',
    detail: 'White-label patient portal, HIPAA-compliant intake forms, US-licensed Stripe checkout, and SEO-ready architecture — deployed and live.',
    stat: { val: 'HIPAA', label: 'compliant by architecture' },
    color: '#2D6A9F',
    trust: ['HIPAA Title II compliant', 'US-hosted infrastructure', 'Stripe US payment rails', 'State-specific intake forms'],
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
    badge: { icon: '🔒', text: 'HIPAA Compliant by Design' },
  },
  {
    n: '03',
    tag: 'PROVIDERS & PHARMACY',
    headline: 'US-licensed clinical network — ready.',
    sub: 'Board-certified US physicians and NPs, connected to NABP-verified 503A pharmacies. Coverage in every state your patients are in.',
    detail: 'Multi-state DEA-licensed prescribing, e-prescribing via US-certified EMR, automated routing to US-licensed compounding pharmacies.',
    stat: { val: '50 States', label: 'US provider coverage' },
    color: '#7B5EA7',
    trust: ['DEA-licensed physicians', 'NABP-verified US pharmacies', 'US 503A compounding network', 'State board compliant prescribing'],
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    badge: { icon: '⚕️', text: 'Nationwide US Clinical Network' },
  },
  {
    n: '04',
    tag: 'MARKETING & COMPLIANCE',
    headline: 'Reach patients — the right way.',
    sub: 'US advertising regulations for telehealth are strict. We navigate every rule — FDA, FTC, state board guidelines — so your marketing is fully clean.',
    detail: 'LegitScript certification process, US-compliant ad copy, FTC-compliant testimonials, and CAN-SPAM / TCPA-ready SMS and email flows.',
    stat: { val: 'FTC + FDA', label: 'compliant ad framework' },
    color: '#B85C38',
    trust: ['LegitScript certified', 'FTC-compliant copy standards', 'TCPA-ready SMS flows', 'CAN-SPAM email compliance'],
    img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80',
    badge: { icon: '📋', text: 'Fully Compliant Marketing' },
  },
  {
    n: '05',
    tag: 'COMPLIANCE & SCALE',
    headline: 'Operate in any state — protected.',
    sub: 'As you expand across the US, compliance scales with you. BAA management, state-by-state prescribing rules, and audit-ready documentation — always current.',
    detail: 'We monitor state telehealth law changes, update your BAAs, maintain your compliance library, and flag licensing requirements before they become problems.',
    stat: { val: 'BAA + HIPAA', label: 'audit-ready always' },
    color: '#0B8B7A',
    trust: ['Ongoing state law monitoring', 'BAA management included', 'Audit-ready documentation', 'Multi-state expansion support'],
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80',
    badge: { icon: '🛡️', text: 'Protected in Every State' },
  },
];

const US_TRUST_STRIP = [
  { icon: Shield, text: 'HIPAA Title II Compliant' },
  { icon: Lock, text: 'LegitScript Certified Process' },
  { icon: CheckCircle2, text: 'DEA-Licensed Providers' },
  { icon: Star, text: 'NABP-Verified Pharmacies' },
  { icon: Zap, text: 'FTC & FDA Ad Compliance' },
  { icon: Globe, text: 'Operable in All 50 States' },
];

// Orbiting data packets animation
function DataPackets({ color, activeStep }) {
  const packets = [
    { r: 195, speed: 14, offset: 0, size: 3 },
    { r: 195, speed: 14, offset: 120, size: 2 },
    { r: 195, speed: 14, offset: 240, size: 2.5 },
    { r: 175, speed: 20, offset: 60, size: 2 },
    { r: 175, speed: 20, offset: 180, size: 1.5 },
  ];

  return (
    <>
      {packets.map((p, i) => {
        const id = `pkt-${i}-${activeStep}`;
        return (
          <circle key={i} r={p.size} fill={color} fillOpacity="0.7">
            <animateMotion dur={`${p.speed}s`} repeatCount="indefinite">
              <mpath href={`#orbit-${i % 2}`} />
            </animateMotion>
          </circle>
        );
      })}
    </>
  );
}

function GlobeVisual({ activeStep, onStepClick }) {
  const color = JOURNEY_STEPS[activeStep].color;
  const pct = ((activeStep + 1) / JOURNEY_STEPS.length) * 100;
  const circumference = 2 * Math.PI * 185;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Multi-layer glow */}
      <div className="absolute rounded-full transition-all duration-1000 pointer-events-none"
        style={{ width: '460px', height: '460px', background: `radial-gradient(circle, ${color}18 0%, ${color}06 40%, transparent 70%)` }} />
      <div className="absolute rounded-full transition-all duration-1000 pointer-events-none"
        style={{ width: '300px', height: '300px', background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, filter: 'blur(20px)' }} />

      <svg viewBox="0 0 400 400"
        className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px]"
        style={{ filter: `drop-shadow(0 0 30px ${color}30)`, overflow: 'visible' }}>
        <defs>
          <radialGradient id="globeGrad" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#1e2e1e" />
            <stop offset="60%" stopColor="#0d0d0d" />
            <stop offset="100%" stopColor="#060606" />
          </radialGradient>
          <radialGradient id="globeShine" cx="35%" cy="32%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="globeClip">
            <circle cx="200" cy="200" r="168" />
          </clipPath>

          {/* Orbit paths for data packets */}
          <path id="orbit-0" d="M 200,15 A 185,185 0 1,1 199.99,15" fill="none" />
          <path id="orbit-1" d="M 200,25 A 175,175 0 1,1 199.99,25" fill="none" />
        </defs>

        {/* Globe sphere */}
        <circle cx="200" cy="200" r="168" fill="url(#globeGrad)" />

        {/* Grid lines — latitude */}
        {[48, 88, 128, 168, 200, 232, 272, 312, 352].map((cy, i) => {
          const dy = cy - 200;
          const rx = Math.sqrt(Math.max(0, 168 * 168 - dy * dy));
          const ry = rx * 0.38;
          if (rx < 2) return null;
          return (
            <ellipse key={`lat-${i}`} cx="200" cy={cy} rx={rx} ry={ry}
              fill="none" stroke="white" strokeOpacity="0.055" strokeWidth="0.7" />
          );
        })}

        {/* Grid lines — longitude */}
        {[0, 30, 60, 90, 120, 150].map((a, i) => (
          <ellipse key={`lon-${i}`} cx="200" cy="200"
            rx="168" ry={168 * Math.max(0.05, Math.abs(Math.cos(a * Math.PI / 180)))}
            fill="none" stroke="white" strokeOpacity="0.055" strokeWidth="0.7"
            transform={`rotate(${a} 200 200)`} />
        ))}

        {/* Equator highlight */}
        <ellipse cx="200" cy="200" rx="168" ry="63"
          fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />

        {/* Active meridian glow */}
        <ellipse cx="200" cy="200" rx="168" ry={55 + activeStep * 18}
          fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="2"
          style={{ transition: 'all 0.8s ease' }}
          transform={`rotate(${activeStep * 36} 200 200)`} />

        {/* Outer orbit ring */}
        <circle cx="200" cy="200" r="185"
          fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1" />

        {/* Progress arc */}
        <circle cx="200" cy="200" r="185"
          fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.5"
          strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 200 200)"
          style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.6s ease', filter: `url(#glow)` }}
        />

        {/* Tick marks on progress ring */}
        {JOURNEY_STEPS.map((_, i) => {
          const angle = (i / JOURNEY_STEPS.length) * 360 - 90;
          const rad = angle * Math.PI / 180;
          const r1 = 180, r2 = 192;
          const isPast = i <= activeStep;
          return (
            <line key={`tick-${i}`}
              x1={200 + r1 * Math.cos(rad)} y1={200 + r1 * Math.sin(rad)}
              x2={200 + r2 * Math.cos(rad)} y2={200 + r2 * Math.sin(rad)}
              stroke={isPast ? color : 'white'}
              strokeOpacity={isPast ? 0.8 : 0.15}
              strokeWidth={isPast ? 2 : 1}
              style={{ transition: 'all 0.5s ease' }}
            />
          );
        })}

        {/* Animated data packets */}
        <g style={{ transition: 'opacity 0.4s' }}>
          {[0, 1, 2].map(i => (
            <circle key={`dp-${i}`} r={i === 0 ? 3 : 2} fill={color} fillOpacity="0.6"
              filter="url(#glow)">
              <animateMotion
                dur={`${12 + i * 5}s`}
                begin={`${i * 3}s`}
                repeatCount="indefinite">
                <mpath href="#orbit-0" />
              </animateMotion>
            </circle>
          ))}
          {[0, 1].map(i => (
            <circle key={`dp2-${i}`} r="2" fill="white" fillOpacity="0.2">
              <animateMotion
                dur={`${18 + i * 7}s`}
                begin={`${i * 6}s`}
                repeatCount="indefinite">
                <mpath href="#orbit-1" />
              </animateMotion>
            </circle>
          ))}
        </g>

        {/* Journey nodes */}
        {JOURNEY_STEPS.map((step, i) => {
          const angle = (i / JOURNEY_STEPS.length) * Math.PI * 2 - Math.PI / 2;
          const nr = 118;
          const nx = 200 + nr * Math.cos(angle);
          const ny = 200 + nr * Math.sin(angle) * 0.54;
          const isActive = i === activeStep;
          const isPast = i < activeStep;

          // Connection arc to next
          const nextAngle = ((i + 1) / JOURNEY_STEPS.length) * Math.PI * 2 - Math.PI / 2;
          const nx2 = 200 + nr * Math.cos(nextAngle);
          const ny2 = 200 + nr * Math.sin(nextAngle) * 0.54;

          return (
            <g key={i} onClick={() => onStepClick(i)} style={{ cursor: 'pointer' }}>
              {/* Connection line to next */}
              {i < JOURNEY_STEPS.length - 1 && (
                <line x1={nx} y1={ny} x2={nx2} y2={ny2}
                  stroke={isPast ? color : isActive ? color : 'white'}
                  strokeOpacity={isPast ? 0.4 : isActive ? 0.25 : 0.08}
                  strokeWidth={isPast ? 1.5 : 1}
                  strokeDasharray={(!isPast && !isActive) ? '4,4' : 'none'}
                  style={{ transition: 'all 0.6s ease' }}
                />
              )}

              {/* Outer pulse for active */}
              {isActive && (
                <>
                  <circle cx={nx} cy={ny} r="22" fill={color} fillOpacity="0.07"
                    style={{ animation: 'globePulse 2s ease-in-out infinite' }} />
                  <circle cx={nx} cy={ny} r="14" fill={color} fillOpacity="0.12"
                    style={{ animation: 'globePulse 2s ease-in-out infinite 0.3s' }} />
                </>
              )}

              {/* Node */}
              <circle cx={nx} cy={ny}
                r={isActive ? 8 : isPast ? 6 : 5}
                fill={isActive ? color : isPast ? color : '#1a1a1a'}
                stroke={isActive ? 'white' : isPast ? color : '#3a3a3a'}
                strokeWidth={isActive ? 2.5 : 1.5}
                filter={isActive ? 'url(#glow)' : undefined}
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Check for completed */}
              {isPast && (
                <text x={nx} y={ny + 4} textAnchor="middle"
                  fill="white" fontSize="6" fontWeight="bold">✓</text>
              )}

              {/* Active indicator */}
              {isActive && (
                <text x={nx} y={ny + 4} textAnchor="middle"
                  fill="white" fontSize="5" fontWeight="bold">{step.n}</text>
              )}

              {/* Step label — offset based on position */}
              <text
                x={nx + (nx > 210 ? 14 : nx < 190 ? -14 : 0)}
                y={ny + (ny > 210 ? 16 : ny < 190 ? -12 : 4)}
                textAnchor={nx > 210 ? 'start' : nx < 190 ? 'end' : 'middle'}
                fill="white"
                fillOpacity={isActive ? 0.7 : isPast ? 0.35 : 0.18}
                fontSize="7.5"
                fontWeight="bold"
                fontFamily="sans-serif"
                letterSpacing="0.5"
                style={{ transition: 'all 0.5s ease' }}>
                {step.tag.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* Globe shine overlay */}
        <circle cx="200" cy="200" r="168" fill="url(#globeShine)" />

        {/* Center: MedRevolve brand */}
        <g>
          <text x="200" y="196" textAnchor="middle"
            fill="white" fillOpacity="0.18" fontSize="9"
            fontWeight="900" fontFamily="sans-serif" letterSpacing="4">
            MEDREVOLVE
          </text>
          <text x="200" y="210" textAnchor="middle"
            fill="white" fillOpacity="0.08" fontSize="7"
            fontFamily="sans-serif" letterSpacing="2">
            TELEHEALTH PLATFORM
          </text>
        </g>
      </svg>

      {/* Floating step counter */}
      <AnimatePresence mode="wait">
        <motion.div key={`stat-${activeStep}`}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
          className="absolute top-4 left-4 md:top-8 md:left-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Step {activeStep + 1} of 5</p>
          <div className="flex gap-1">
            {JOURNEY_STEPS.map((_, i) => (
              <div key={i}
                className="h-0.5 rounded-full transition-all duration-500"
                style={{
                  width: i === activeStep ? '24px' : '8px',
                  background: i <= activeStep ? JOURNEY_STEPS[activeStep].color : 'rgba(255,255,255,0.1)',
                }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating US signal bottom-right */}
      <AnimatePresence mode="wait">
        <motion.div key={`s-${activeStep}`}
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.4 }}
          className="absolute bottom-2 right-2 md:bottom-6 md:right-6 text-right">
          <div className="flex items-center gap-1.5 justify-end mb-0.5">
            <span className="text-base">{JOURNEY_STEPS[activeStep].badge.icon}</span>
            <p className="font-black text-sm leading-none" style={{ color: JOURNEY_STEPS[activeStep].color }}>
              {JOURNEY_STEPS[activeStep].stat.val}
            </p>
          </div>
          <p className="text-white/20 text-[10px] max-w-[140px] leading-tight">
            {JOURNEY_STEPS[activeStep].stat.label}
          </p>
        </motion.div>
      </AnimatePresence>

      <style>{`
        @keyframes globePulse {
          0%, 100% { transform: scale(1); opacity: 0.12; }
          50% { transform: scale(1.25); opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}

export default function TelehealthGlobeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % JOURNEY_STEPS.length);
    }, 5000);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const go = (i) => {
    setPaused(false);
    setActive(i);
    startTimer();
  };

  const step = JOURNEY_STEPS[active];

  return (
    <section className="relative bg-[#060606] overflow-hidden">
      {/* Fine grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />

      {/* Color wash behind active step */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 60% 50% at 25% 55%, ${step.color}0d 0%, transparent 70%)` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-12 pt-14 pb-6">

        {/* ── US CONFIDENCE BAR ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-white/20">🇺🇸</span>
            <span className="text-[11px] font-semibold text-white/20">Built for US entrepreneurs — operable in any state, day one.</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Platform Live</span>
          </div>
        </motion.div>

        {/* ── HEADLINE ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10">

          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
              🇺🇸 US-Licensed · Federal & State Compliant · Any State, Day One
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-white leading-[1.02] mb-4"
            style={{ letterSpacing: '-0.03em' }}>
            Launch telehealth<br />
            <span style={{ color: step.color, transition: 'color 0.7s ease' }}>
              anywhere in the US.
            </span>
          </h1>

          <p className="text-white/30 text-base md:text-lg max-w-2xl leading-relaxed">
            We own the vendor relationships — US pharmacies, licensed providers, compliance infrastructure — so you can operate with confidence in any state.
          </p>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-[1fr_520px] gap-6 lg:gap-12 items-center">

          {/* LEFT: Globe */}
          <div className="relative h-[300px] md:h-[420px] lg:h-[500px]">
            <GlobeVisual activeStep={active} onStepClick={go} />
          </div>

          {/* RIGHT: Step Content */}
          <div className="flex flex-col">

            {/* Phase nav tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
              {JOURNEY_STEPS.map((s, i) => (
                <button key={i} onClick={() => go(i)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
                    active === i
                      ? 'text-white border-transparent'
                      : 'bg-transparent text-white/20 border-white/8 hover:text-white/40 hover:border-white/15'
                  }`}
                  style={{ background: active === i ? s.color : undefined }}>
                  <span className="font-mono">{s.n}</span>
                  <span className="hidden sm:inline">{s.tag.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3 }}>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border"
                  style={{ borderColor: step.color + '40', background: step.color + '12' }}>
                  <span className="text-sm">{step.badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: step.color }}>
                    {step.badge.text}
                  </span>
                </div>

                {/* Phase label */}
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: step.color }}>
                  Phase {step.n} — {step.tag}
                </p>

                {/* Headline */}
                <h2 className="text-2xl md:text-3xl lg:text-[34px] font-black text-white leading-tight mb-3"
                  style={{ letterSpacing: '-0.025em' }}>
                  {step.headline}
                </h2>

                {/* Sub copy */}
                <p className="text-white/45 text-sm leading-relaxed mb-4">
                  {step.sub}
                </p>

                {/* Detail with border */}
                <p className="text-white/22 text-xs leading-relaxed mb-5 border-l-2 pl-3.5"
                  style={{ borderColor: step.color + '60' }}>
                  {step.detail}
                </p>

                {/* Trust signals — per-step checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  {step.trust.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: step.color }} />
                      <span className="text-white/50 text-[11px] font-semibold">{t}</span>
                    </div>
                  ))}
                </div>

                {/* Image strip with overlay */}
                <div className="rounded-xl overflow-hidden h-[110px] relative mb-6 border border-white/5">
                  <img src={step.img} alt={step.tag}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{ filter: 'brightness(0.45) saturate(0.7)' }} />
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(105deg, ${step.color}50 0%, transparent 55%)` }} />
                  <div className="absolute inset-0 flex items-end p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{step.badge.icon}</span>
                      <span className="text-white/70 text-xs font-bold">{step.badge.text}</span>
                    </div>
                  </div>
                  {/* Phase progress dots */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    {JOURNEY_STEPS.map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= active ? step.color : 'rgba(255,255,255,0.15)' }} />
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
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

          </div>
        </div>

        {/* ── US TRUST SIGNALS STRIP ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 pt-6 border-t border-white/5">
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

        {/* Scroll hint */}
        <div className="flex justify-center pt-8 pb-2">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
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