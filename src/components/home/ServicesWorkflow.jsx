import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, CreditCard, Shield, Rocket, Building2, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const services = [
  {
    id: 'university',
    step: '01',
    icon: GraduationCap,
    title: 'MedRevolve University',
    tagline: 'Knowledge infrastructure for modern wellness merchants.',
    description: 'Self-paced and live modules covering product science, compliance frameworks, patient acquisition, provider relationships, and platform operations. Graduate with a certified merchant credential.',
    modules: [
      'Physician-Supervised Program Science Fundamentals',
      'Regulatory Frameworks (FDA, DEA, State)',
      'Merchant Operations Certification',
      'Patient Acquisition & Retention',
      'Platform & Technology Onboarding',
    ],
    cta: 'Enroll Now',
    href: 'ForBusiness',
    color: '#4A6741',
    bg: 'from-[#0F1A0F] to-[#080808]',
  },
  {
    id: 'payments',
    step: '02',
    icon: CreditCard,
    title: 'Payment & Processing',
    tagline: 'High-risk merchant rails. Built for wellness commerce.',
    description: 'Integrated payment processing for nutraceuticals, physician-supervised programs, and telehealth services through licensed high-risk healthcare merchant accounts. Card, ACH, and crypto rails with built-in chargeback protection and subscription billing.',
    modules: [
      'Card Processing (High-Risk Approved)',
      'ACH & Bank Transfer Rails',
      'Crypto Payment Gateway',
      'Subscription & AutoRx Billing',
      'Chargeback Defense System',
    ],
    cta: 'View Payment Options',
    href: 'PaymentsDashboard',
    color: '#7A5A45',
    bg: 'from-[#130F0F] to-[#080808]',
  },
  {
    id: 'compliance',
    step: '03',
    icon: Shield,
    title: 'Compliance Certification',
    tagline: 'HIPAA, DEA, state licensing — handled end-to-end.',
    description: 'Step-by-step compliance walkthrough for all regulatory requirements. Document generation, state-by-state licensing guidance, provider credentialing, and ongoing compliance monitoring.',
    modules: [
      'HIPAA Compliance Setup',
      'DEA & Controlled Substance Protocols',
      'State Licensing Walkthrough',
      'Provider Credentialing Docs',
      'Ongoing Compliance Monitoring',
    ],
    cta: 'Start Compliance',
    href: 'ComplianceDashboard',
    color: '#2A6B7A',
    bg: 'from-[#0A1318] to-[#080808]',
  },
  {
    id: 'launch',
    step: '04',
    icon: Rocket,
    title: 'Launch Support',
    tagline: 'From zero to operational in 30 days.',
    description: 'Dedicated onboarding team, technical integration support, provider network access, inventory provisioning, domain setup, and go-live coordination. We stay in the foxhole with you.',
    modules: [
      'Dedicated Onboarding Manager',
      'Domain & Storefront Setup',
      'Inventory Provisioning',
      'Provider Network Access',
      'Go-Live Coordination',
    ],
    cta: 'Schedule Kickoff',
    href: 'MerchantOnboarding',
    color: '#5A6B8A',
    bg: 'from-[#0A0F18] to-[#080808]',
  },
  {
    id: 'llc',
    step: '05',
    icon: Building2,
    title: 'LLC Formation',
    tagline: 'Business entity setup, done right.',
    description: 'We handle entity formation, EIN acquisition, registered agent services, and business banking introductions so you can focus on building — not paperwork.',
    modules: [
      'LLC & Corp Formation',
      'EIN Acquisition',
      'Registered Agent Service',
      'Operating Agreement Drafting',
      'Business Banking Intro',
    ],
    cta: 'Form My Entity',
    href: 'ForBusiness',
    color: '#6B7A4A',
    bg: 'from-[#101408] to-[#080808]',
  },
  {
    id: 'partners',
    step: '06',
    icon: Users,
    title: 'Partner Ecosystem',
    tagline: 'Creators, providers, pharmacies — all connected.',
    description: 'Access our pre-built network of 200+ licensed providers, NABP-certified pharmacies, and wellness content creators ready to drive traffic and fulfillment from day one.',
    modules: [
      '200+ Credentialed Providers',
      'NABP-Certified Pharmacies',
      'Creator Referral Network',
      'B2B Wholesale Pricing',
      'Revenue Share Programs',
    ],
    cta: 'Join the Network',
    href: 'PartnerProgram',
    color: '#7A4A6B',
    bg: 'from-[#130A18] to-[#080808]',
  },
];

export default function ServicesWorkflow() {
  const [active, setActive] = useState('university');
  const activeService = services.find(s => s.id === active);
  const Icon = activeService.icon;

  return (
    <section className="bg-[#060606] border-t border-white/5">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20 border-b border-white/5">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-4 font-medium">Services</p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
            Full-stack support.<br />
            <span className="text-white/25">End to end.</span>
          </h2>
          <p className="text-white/35 text-sm max-w-xs leading-relaxed">
            Every service you need to launch and scale a compliant wellness merchant operation.
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: Service menu */}
          <div className="lg:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/5">
            {services.map((s) => {
              const SIcon = s.icon;
              const isActive = s.id === active;
              return (
                <button key={s.id} onClick={() => setActive(s.id)}
                  className={`w-full text-left px-8 lg:px-10 py-6 border-b border-white/5 transition-all duration-300 group
                    ${isActive ? 'bg-white/3' : 'hover:bg-white/[0.015]'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: isActive ? s.color + '25' : 'transparent' }}>
                      <SIcon className="w-4 h-4 transition-colors" style={{ color: isActive ? s.color : '#ffffff30' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] tracking-[0.2em] uppercase mb-0.5 transition-colors ${isActive ? 'text-white/50' : 'text-white/20'}`}>{s.step}</p>
                      <p className={`text-sm font-semibold leading-tight transition-colors ${isActive ? 'text-white' : 'text-white/35 group-hover:text-white/60'}`}>{s.title}</p>
                    </div>
                    {isActive && <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.color }} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Detail panel */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full bg-gradient-to-br ${activeService.bg} p-10 lg:p-16 flex flex-col justify-between min-h-[500px]`}>

                <div>
                  {/* Step & icon */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: activeService.color + '20' }}>
                      <Icon className="w-6 h-6" style={{ color: activeService.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-0.5">Step {activeService.step}</p>
                      <p className="text-white/50 text-xs">{activeService.tagline}</p>
                    </div>
                  </div>

                  {/* Title & description */}
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">{activeService.title}</h3>
                  <p className="text-white/45 leading-relaxed mb-10 max-w-xl">{activeService.description}</p>

                  {/* Feature checklist */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-10">
                    {activeService.modules.map((m, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: activeService.color }} />
                        <span className="text-white/60 text-sm">{m}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div>
                  <Link to={createPageUrl(activeService.href)}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <button className="flex items-center gap-3 px-8 py-4 text-[12px] font-bold tracking-widest uppercase text-black transition-all hover:gap-5"
                      style={{ background: activeService.color === '#4A6741' ? '#A8C99B' : activeService.color === '#7A5A45' ? '#C9A88F' : activeService.color === '#2A6B7A' ? '#8FC9D4' : activeService.color === '#5A6B8A' ? '#8FA8C9' : activeService.color === '#6B7A4A' ? '#B8C99B' : '#C98FB8' }}>
                      {activeService.cta}
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