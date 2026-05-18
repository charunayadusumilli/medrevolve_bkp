import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pillars = [
  { index: '01', label: 'PRODUCTS', title: 'GLP-1 & Peptide\nCatalog', sub: 'Curated pharmaceutical-grade inventory — GLP-1s, peptides, hormone protocols — sourced, labeled, and shipped.' },
  { index: '02', label: 'TELEHEALTH', title: 'Provider Network\n& Clinical OS', sub: 'White-label telehealth infrastructure with credentialed providers, prescribing workflows, and patient management built in.' },
  { index: '03', label: 'SERVICES', title: 'Launch. Comply.\nScale.', sub: 'MedRevolve University, payment rails, compliance certification, and full-stack merchant support from day one.' },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % pillars.length), 5000);
    return () => clearInterval(t);
  }, []);

  const p = pillars[active];

  return (
    <section className="relative bg-[#0A0A0A] min-h-screen flex flex-col overflow-hidden">

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Vertical accent lines */}
      <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-white/5 hidden lg:block" />

      {/* Main hero content */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row">

        {/* LEFT: Pillar selector */}
        <div className="hidden lg:flex flex-col justify-end pb-20 px-16 pt-16 w-80 flex-shrink-0 border-r border-white/5">
          <div className="space-y-1">
            {pillars.map((pi, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`group w-full text-left px-4 py-4 border-l-2 transition-all duration-400
                  ${i === active ? 'border-white bg-white/3' : 'border-white/10 hover:border-white/30'}`}>
                <p className={`text-[10px] tracking-[0.3em] uppercase mb-1 transition-colors ${i === active ? 'text-white/60' : 'text-white/20 group-hover:text-white/40'}`}>{pi.index}</p>
                <p className={`text-sm font-semibold tracking-wide transition-colors ${i === active ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>{pi.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Big headline */}
        <div className="flex-1 flex flex-col justify-end pb-16 px-8 lg:px-16 pt-16">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>

              <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-6 font-medium">
                {p.index} — {p.label}
              </p>

              <h1 className="font-black text-white leading-[0.9] tracking-[-0.03em] mb-8"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', whiteSpace: 'pre-line' }}>
                {p.title}
              </h1>

              <p className="text-base text-white/40 max-w-md leading-relaxed font-light mb-10">
                {p.sub}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl('MerchantOnboarding')}>
                  <button className="flex items-center gap-3 bg-white text-black px-8 py-4 text-[13px] font-bold tracking-widest uppercase hover:bg-white/90 transition-colors">
                    Start Platform
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to={createPageUrl('ForBusiness')}>
                  <button className="flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-[13px] font-medium tracking-widest uppercase hover:bg-white/5 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: Progress indicator */}
        <div className="hidden lg:flex flex-col justify-end pb-20 px-10 w-20 flex-shrink-0 border-l border-white/5 items-center">
          <div className="flex flex-col gap-1.5">
            {pillars.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`transition-all duration-500 rounded-full ${i === active ? 'bg-white h-8 w-0.5' : 'bg-white/20 h-2 w-0.5 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative z-10 border-t border-white/5 px-8 lg:px-16 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-8 lg:gap-16">
            {[
              { v: '200+', l: 'Merchant Partners' },
              { v: '50K+', l: 'Patients Served' },
              { v: '99%', l: 'Uptime SLA' },
              { v: 'HIPAA', l: 'Compliant' },
            ].map(s => (
              <div key={s.v} className="flex flex-col">
                <span className="text-white text-sm font-bold">{s.v}</span>
                <span className="text-white/25 text-[10px] tracking-[0.15em] uppercase">{s.l}</span>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase hidden md:block">The Operating System for Modern Wellness Commerce</p>
        </div>
      </div>
    </section>
  );
}