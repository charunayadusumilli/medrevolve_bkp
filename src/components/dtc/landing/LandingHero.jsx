import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { LANDING_IMAGES, JOURNEYS } from './landingData';

export default function LandingHero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#061312]">
      <img src={LANDING_IMAGES.hero} alt="Scientist analyzing a molecular model" fetchpriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061312] via-[#061312]/85 to-[#061312]/20" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#061312] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 w-full">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3FD1BC]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Clinician-guided · US-licensed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight">
            Science-first wellness,<br />
            <span className="text-[#3FD1BC]">engineered end to end.</span>
          </h1>
          <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-xl">
            AI-personalized intake, research-backed compounds, sterile compounding and robotic fulfillment — with real people supporting every step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#3FD1BC] hover:bg-[#5BE0CD] text-[#061312] font-semibold px-7 py-3.5 transition-colors">
              Explore treatments <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+12403875224" className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white hover:bg-white/10 font-semibold px-7 py-3.5 transition-colors">
              <Phone className="w-4 h-4" /> Talk to care team
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
          {JOURNEYS.map((j) => (
            <a key={j.key} href={`#journey-${j.key}`}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 hover:bg-white/10 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#3FD1BC]/15 flex items-center justify-center flex-shrink-0">
                <j.icon className="w-4 h-4 text-[#3FD1BC]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">{j.title}</p>
                <p className="text-[11px] text-white/45 truncate">{j.tag}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}