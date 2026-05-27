import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, FlaskConical, Building2, Megaphone,
  ArrowRight, ChevronRight
} from 'lucide-react';

const JOURNEYS = [
  {
    key: 'glp',
    icon: Stethoscope,
    title: 'GLP-1 Telehealth Platform',
    subtitle: 'Launch a fully-integrated physician-gated wellness brand',
    description: 'White-label telehealth infrastructure for GLP-1 programs. Licensed providers, e-prescribing, patient management, website, marketing, and compliance — all under your brand.',
    cta: 'Start Your Platform',
    ctaPath: 'MerchantOnboarding',
    demo: null,
    demoPath: null,
    color: '#4A6741',
    bgLight: 'bg-[#4A6741]/10',
    borderActive: 'border-[#4A6741]',
    pill: 'Telehealth',
    pillColor: 'bg-[#4A6741]/20 text-[#6B8F5E]',
  },
  {
    key: 'ruo',
    icon: FlaskConical,
    title: 'RUO Research Supply',
    subtitle: 'Institutional RUO catalog — licensed research entities only',
    description: 'Supply research compounds to licensed institutions and CROs. Age-gated catalog, institutional verification, signed RUO agreements required. Not for consumer sale. Separate domain — medrevolveruo.com.',
    cta: 'RUO Inquiry',
    ctaPath: 'MerchantOnboarding',
    demo: null,
    demoPath: null,
    color: '#991B1B',
    bgLight: 'bg-red-900/10',
    borderActive: 'border-red-700',
    pill: 'RUO / Research',
    pillColor: 'bg-red-900/30 text-red-400',
  },
  {
    key: 'provider',
    icon: Stethoscope,
    title: 'Provider Integration',
    subtitle: 'Join as a licensed MD, NP, PA, or DO',
    description: 'See patients via telehealth on your schedule. E-prescribing, intake routing, and credentialing handled. Flexible retainer or per-consult model.',
    cta: 'Apply as Provider',
    ctaPath: 'ProviderIntake',
    demo: null,
    demoPath: null,
    color: '#0F766E',
    bgLight: 'bg-teal-900/10',
    borderActive: 'border-teal-700',
    pill: 'For Clinicians',
    pillColor: 'bg-teal-900/30 text-teal-400',
  },
  {
    key: 'pharmacy',
    icon: Building2,
    title: 'Pharmacy Partnership',
    subtitle: 'Compounding or mail-order pharmacy fulfillment partner',
    description: 'Receive a steady Rx referral stream from the MedRevolve network. LegitScript & NABP required. BAA + contract setup handled digitally.',
    cta: 'Apply as Pharmacy',
    ctaPath: 'PharmacyIntake',
    demo: null,
    demoPath: null,
    color: '#4338CA',
    bgLight: 'bg-indigo-900/10',
    borderActive: 'border-indigo-700',
    pill: 'For Pharmacies',
    pillColor: 'bg-indigo-900/30 text-indigo-400',
  },
  {
    key: 'creator',
    icon: Megaphone,
    title: 'Brand Partnerships',
    subtitle: 'Grow with the MedRevolve network — recurring commissions',
    description: 'Earn recurring commissions by referring clients to MedRevolve-powered platforms. Monthly ACH payout. Real-time dashboard.',
    cta: 'Join Partner Program',
    ctaPath: 'ForCreators',
    demo: null,
    demoPath: null,
    color: '#7C3AED',
    bgLight: 'bg-purple-900/10',
    borderActive: 'border-purple-700',
    pill: 'Partners',
    pillColor: 'bg-purple-900/30 text-purple-400',
  },
];

export default function JourneySelector() {
  const [active, setActive] = useState(null);
  const selected = active ? JOURNEYS.find(j => j.key === active) : null;

  return (
    <section className="py-20 px-6 lg:px-8 bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#6B8F5E] text-xs font-bold uppercase tracking-widest mb-3">Choose Your Path</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What brings you to MedRevolve?</h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Every journey is different. Select your track below — we'll take you directly to the right onboarding, demo, or application.
          </p>
        </div>

        {/* Journey Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {JOURNEYS.map((j) => {
            const Icon = j.icon;
            const isActive = active === j.key;
            return (
              <button
                key={j.key}
                onClick={() => setActive(isActive ? null : j.key)}
                className={`group relative p-4 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? `${j.bgLight} ${j.borderActive} border-2`
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-all"
                  style={{ background: isActive ? j.color : 'rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${j.pillColor}`}>
                  {j.pill}
                </span>
                <p className="text-white font-semibold text-sm leading-tight mt-1">{j.title}</p>
                <p className="text-white/40 text-xs mt-1 leading-snug">{j.subtitle}</p>
                <ChevronRight
                  className={`w-3.5 h-3.5 absolute top-3 right-3 transition-transform ${isActive ? 'rotate-90 text-white/60' : 'text-white/20 group-hover:text-white/40'}`}
                />
              </button>
            );
          })}
        </div>

        {/* Expanded Detail Panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 ${selected.bgLight} ${selected.borderActive} border flex flex-col sm:flex-row items-start sm:items-center gap-6`}
            >
              <div className="flex-1">
                <p className="text-white font-bold text-base mb-1">{selected.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{selected.description}</p>
              </div>
              <div className="flex flex-wrap gap-3 flex-shrink-0">
                {selected.demo && (
                  <Link to={createPageUrl(selected.demoPath)}>
                    <button className="px-5 py-2.5 rounded-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-semibold transition-all">
                      {selected.demo}
                    </button>
                  </Link>
                )}
                <Link to={createPageUrl(selected.ctaPath)}>
                  <button
                    className="px-6 py-2.5 rounded-sm text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90"
                    style={{ background: selected.color }}
                  >
                    {selected.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <p className="text-white/25 text-xs text-center mt-2">
            Select a track above to see your personalized path →
          </p>
        )}
      </div>
    </section>
  );
}