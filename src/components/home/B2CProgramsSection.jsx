import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Stethoscope, Pill, Users, Heart, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PROGRAMS = [
  {
    id: 'glp1',
    icon: Pill,
    color: '#4A9B6F',
    bgColor: '#0D2016',
    label: 'GLP-1 Weight Loss',
    tagline: 'Physician-supervised weight management',
    description: 'Work with a licensed physician to evaluate whether a GLP-1 program is appropriate for you. If prescribed, medication is dispensed by a licensed pharmacy and shipped to your door with ongoing monitoring.',
    whatYouGet: [
      'Initial physician consultation',
      'Personalized treatment evaluation',
      'Licensed pharmacy dispensing',
      'Monthly check-ins with your provider',
      'Ongoing prescription management',
    ],
    disclaimer: 'Requires physician evaluation and valid prescription. Not appropriate for all patients.',
    cta: 'Start Consultation',
    ctaPath: 'BookAppointment',
  },
  {
    id: 'hormone',
    icon: Heart,
    color: '#B85C7A',
    bgColor: '#1A0A10',
    label: 'Hormone Therapy',
    tagline: 'Bioidentical hormone replacement therapy',
    description: 'Our licensed providers evaluate your symptoms, labs, and health history to determine if bioidentical hormone replacement therapy is appropriate for you.',
    whatYouGet: [
      'Comprehensive hormone consultation',
      'Hormone symptom assessment',
      'BHRT protocol if clinically indicated',
      'Ongoing monitoring & dosage adjustments',
      'Discreet home delivery',
    ],
    disclaimer: 'Individualized treatment. Prescription required. Results vary by patient.',
    cta: 'Book Consultation',
    ctaPath: 'BookAppointment',
  },
];

export default function B2CProgramsSection() {
  const [active, setActive] = useState('glp1');
  const prog = PROGRAMS.find(p => p.id === active);
  const Icon = prog.icon;

  return (
    <section className="bg-[#050505] border-t border-white/5">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20 border-b border-white/5">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-4">Programs</p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight">
            Physician-supervised<br />
            <span className="text-white/25">programs, built for you.</span>
          </h2>
          <p className="text-white/35 text-sm max-w-xs leading-relaxed">
            Every program starts with a licensed provider consultation. We never ship medication without a valid prescription.
          </p>
        </div>
      </div>

      {/* Program Selector + Detail */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: Program tabs */}
          <div className="lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/5">
            {PROGRAMS.map(p => {
              const PIcon = p.icon;
              const isActive = p.id === active;
              return (
                <button key={p.id} onClick={() => setActive(p.id)}
                  className={`w-full text-left px-8 lg:px-10 py-6 border-b border-white/5 transition-all duration-300 group ${isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: isActive ? p.color + '25' : 'transparent' }}>
                      <PIcon className="w-4 h-4 transition-colors" style={{ color: isActive ? p.color : '#ffffff30' }} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold leading-tight transition-colors ${isActive ? 'text-white' : 'text-white/35 group-hover:text-white/60'}`}>
                        {p.label}
                      </p>
                      <p className={`text-xs mt-0.5 transition-colors ${isActive ? 'text-white/40' : 'text-white/15'}`}>
                        {p.tagline}
                      </p>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: prog.color }} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Program detail */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="p-10 lg:p-16 min-h-[500px] flex flex-col justify-between"
                style={{ background: prog.bgColor }}>

                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: prog.color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color: prog.color }} />
                    </div>
                    <div>
                      <p className="text-white/30 text-xs tracking-widest uppercase">{prog.tagline}</p>
                    </div>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">{prog.label}</h3>
                  <p className="text-white/45 leading-relaxed mb-8 max-w-xl">{prog.description}</p>

                  <div className="mb-8">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4">What's Included</p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {prog.whatYouGet.map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: prog.color }} />
                          <span className="text-white/55 text-sm">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance disclaimer */}
                  <div className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 mb-8">
                    <p className="text-white/30 text-xs leading-relaxed">
                      <span className="text-white/50 font-semibold">Medical Disclaimer: </span>
                      {prog.disclaimer} These statements have not been evaluated by the FDA.
                    </p>
                  </div>
                </div>

                <div>
                  <Link to={createPageUrl(prog.ctaPath)} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <button className="flex items-center gap-3 px-8 py-4 text-[12px] font-bold tracking-widest uppercase text-white transition-all hover:opacity-90 rounded-sm"
                      style={{ background: prog.color }}>
                      {prog.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}