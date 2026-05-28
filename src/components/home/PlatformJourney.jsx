import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Building2, Globe, Stethoscope, Megaphone, ShieldCheck,
  ArrowRight, CheckCircle, ChevronRight, Zap, Star
} from 'lucide-react';

const PHASES = [
  {
    n: '01',
    icon: Building2,
    label: 'Company Foundation',
    title: 'We Set Up Your Business Infrastructure',
    color: '#4A6741',
    light: '#EEF5EB',
    desc: 'Before a single patient sees your brand, we build the legal and financial foundation your telehealth business runs on.',
    deliverables: [
      'LLC formation or verification',
      'Business banking setup (Brex or Stripe)',
      'EIN registration assistance',
      'Domain name secured in your name',
      'Brand identity & placeholder site live within 48 hrs',
      'High-risk merchant account provisioned',
    ],
    outcome: 'You have a real, operational business entity ready to receive money.',
  },
  {
    n: '02',
    icon: Globe,
    label: 'Website & Storefront',
    title: 'Your Branded Telehealth Platform Goes Live',
    color: '#2D6A9F',
    light: '#E8F2FB',
    desc: 'A production-ready, fully white-labeled telehealth storefront under your brand — optimized for conversion, compliance, and mobile.',
    deliverables: [
      'Custom domain — yourname.com — live',
      'Program pages (no product/drug names)',
      'HIPAA-compliant intake forms',
      'Patient portal with appointment booking',
      'Secure Stripe checkout embedded',
      'SEO-ready site structure',
    ],
    outcome: 'Your site is live, indexed, and accepting real patients.',
  },
  {
    n: '03',
    icon: Stethoscope,
    label: 'Backend Integration',
    title: 'Providers, Pharmacy & Automation Wired In',
    color: '#7B5EA7',
    light: '#F3EEF9',
    desc: 'The operational backbone of your telehealth business — licensed providers, pharmacy routing, telehealth video, and full CRM automation.',
    deliverables: [
      'Board-certified physician network connected',
      'Licensed 503A pharmacy routed to your account',
      'E-prescribing & EMR integration live',
      'Google Calendar scheduling for providers',
      'HubSpot CRM syncing every lead',
      'Twilio SMS automations for patient comms',
    ],
    outcome: 'A patient can book, consult, get prescribed, and receive their order — end to end.',
  },
  {
    n: '04',
    icon: Megaphone,
    label: 'Marketing Engine',
    title: 'Acquisition & Revenue Automation',
    color: '#B85C38',
    light: '#FAEEE8',
    desc: 'We build and activate your full acquisition and retention marketing stack — email, SMS, paid, and creator-driven.',
    deliverables: [
      'Google & Meta ad account structure',
      'LegitScript certification process started',
      'Creator / affiliate referral system live',
      'Email drip sequences (welcome, follow-up, Rx reminder)',
      'SMS marketing flows via Twilio',
      'Analytics dashboard tracking every dollar',
    ],
    outcome: 'You have an automated marketing engine generating and converting leads.',
  },
  {
    n: '05',
    icon: ShieldCheck,
    label: 'Compliance & Scale',
    title: 'Compliance Lock-In & Growth Operations',
    color: '#0B6B63',
    light: '#E6F4F3',
    desc: 'Ongoing compliance monitoring, automated audits, and the operational cadence to scale without legal exposure.',
    deliverables: [
      'HIPAA compliance documentation & BAAs',
      'Telehealth consent & disclosure library',
      'State-by-state prescribing rule monitoring',
      'Automated compliance audit runs',
      'Monthly operations review with MedRevolve team',
      'Expansion into new states or verticals',
    ],
    outcome: 'You scale confidently — protected, compliant, and built to grow.',
  },
];

export default function PlatformJourney() {
  const [active, setActive] = useState(0);
  const phase = PHASES[active];
  const PhaseIcon = phase.icon;

  return (
    <section className="py-24 px-6 bg-[#F7F4ED]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#4A6741] border border-[#4A6741]/30 rounded-full px-4 py-1.5 mb-4">
            The Build Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            From Zero to Operating<br />
            <span className="text-[#4A6741]">Telehealth Business</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Five phases. One partner. Everything done for you — so you focus on growing your brand.
          </p>
        </div>

        {/* Phase nav tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-10 scrollbar-hide justify-start lg:justify-center">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            const isActive = active === i;
            return (
              <button key={p.n} onClick={() => setActive(i)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold transition-all ${
                  isActive ? 'text-white border-transparent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
                style={{ background: isActive ? p.color : undefined }}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{p.label}</span>
                <span className="sm:hidden">{p.n}</span>
              </button>
            );
          })}
        </div>

        {/* Phase detail */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left: Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: phase.light }}>
                  <PhaseIcon className="w-7 h-7" style={{ color: phase.color }} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: phase.color }}>Phase {phase.n}</span>
                  <h3 className="text-xl font-black text-gray-900 leading-snug">{phase.title}</h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{phase.desc}</p>

              {/* Outcome callout */}
              <div className="rounded-xl px-4 py-3 flex items-start gap-3 mb-6"
                style={{ backgroundColor: phase.light }}>
                <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: phase.color }} />
                <p className="text-sm font-semibold" style={{ color: phase.color }}>{phase.outcome}</p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {PHASES.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all ${active === i ? 'w-6' : 'w-2 bg-gray-200'}`}
                    style={{ background: active === i ? phase.color : undefined }} />
                ))}
                <span className="text-xs text-gray-400 ml-2">{active + 1} / {PHASES.length}</span>
              </div>
            </div>

            {/* Right: Deliverables */}
            <div className="bg-[#0A0A0A] rounded-2xl p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">
                What We Deliver in Phase {phase.n}
              </p>
              <ul className="space-y-3">
                {phase.deliverables.map((d, i) => (
                  <motion.li key={d}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: phase.color + '30' }}>
                      <CheckCircle className="w-3 h-3" style={{ color: phase.color }} />
                    </div>
                    <span className="text-white/70 text-sm leading-relaxed">{d}</span>
                  </motion.li>
                ))}
              </ul>

              {active < PHASES.length - 1 ? (
                <button onClick={() => setActive(active + 1)}
                  className="mt-6 flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white/60 transition-colors">
                  Next: Phase {PHASES[active + 1].n} — {PHASES[active + 1].label}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link to="/MerchantOnboarding">
                  <Button className="mt-6 w-full font-bold text-white rounded-sm"
                    style={{ backgroundColor: phase.color }}>
                    Start Your Platform <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}