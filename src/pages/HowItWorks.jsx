import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Building2, Globe, Stethoscope, Megaphone, ShieldCheck,
  ArrowRight, CheckCircle, ChevronRight, Star, Phone
} from 'lucide-react';

const STEPS = [
  {
    n: '01',
    icon: Phone,
    label: 'Discovery Call',
    color: '#4A6741',
    light: '#EEF5EB',
    title: 'We Learn Your Business & Build Your Plan',
    desc: 'A 30-minute call with a MedRevolve specialist. We map your niche, target state(s), business model, and timeline — then hand you a custom build plan.',
    deliverables: [
      'Custom platform build plan document',
      'Niche & market positioning recommendation',
      'State licensing & compliance scope',
      'Pricing structure recommendation',
      'Timeline to launch (typically 7–14 days)',
      'Dedicated account manager assigned',
    ],
    outcome: 'You leave with a clear roadmap, no guesswork.',
  },
  {
    n: '02',
    icon: Building2,
    label: 'Business Foundation',
    color: '#2D6A9F',
    light: '#E8F2FB',
    title: 'We Set Up Your Legal & Financial Infrastructure',
    desc: 'Before a single patient sees your brand, we build the legal and financial foundation your telehealth business runs on.',
    deliverables: [
      'LLC formation or verification',
      'EIN registration assistance',
      'Business banking setup (Brex or Stripe)',
      'High-risk merchant account provisioned',
      'Domain name secured in your name',
      'Brand identity & placeholder site live within 48 hrs',
    ],
    outcome: 'You have a real, operational business entity ready to receive money.',
  },
  {
    n: '03',
    icon: Globe,
    label: 'Platform Build',
    color: '#7B5EA7',
    light: '#F3EEF9',
    title: 'Your Branded Telehealth Platform Goes Live',
    desc: 'A production-ready, fully white-labeled telehealth storefront under your brand — optimized for conversion, compliance, and mobile.',
    deliverables: [
      'Custom domain yourname.com — live',
      'Program pages (no product/drug names)',
      'HIPAA-compliant intake forms',
      'Patient portal with appointment booking',
      'Secure Stripe checkout embedded',
      'SEO-ready site structure',
    ],
    outcome: 'Your site is live, indexed, and accepting real patients.',
  },
  {
    n: '04',
    icon: Stethoscope,
    label: 'Provider & Pharmacy',
    color: '#B85C38',
    light: '#FAEEE8',
    title: 'Providers, Pharmacy & Automation Wired In',
    desc: 'The operational backbone — licensed providers, pharmacy routing, telehealth video, and full CRM automation connected to your platform.',
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
    n: '05',
    icon: Megaphone,
    label: 'Marketing Engine',
    color: '#C4822A',
    light: '#FDF3E7',
    title: 'Acquisition & Revenue Automation Activated',
    desc: 'We build and activate your full acquisition and retention marketing stack — email, SMS, paid ads, and creator-driven affiliate channels.',
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
    n: '06',
    icon: ShieldCheck,
    label: 'Compliance & Scale',
    color: '#0B6B63',
    light: '#E6F4F3',
    title: 'Compliance Lock-In & Ongoing Operations',
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

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay },
});

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const StepIcon = step.icon;

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative bg-[#0A0A0A] py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=30)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 to-[#0A0A0A]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#A8C99B] border border-[#A8C99B]/20 rounded-full px-4 py-1.5 mb-5">
            The Build Process
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            From Zero to Operating<br />
            <span className="text-[#A8C99B]">Telehealth Business in 7 Days</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto mb-8">
            Six structured phases. One infrastructure partner. Everything done for you — so you focus on growing your brand.
          </p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 font-black text-base h-auto py-4">
              Start With a Discovery Call <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Steps */}
      <section className="py-24 px-6 bg-[#F7F4ED]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Six Phases. Complete Infrastructure.
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Every phase is executed by the MedRevolve team — you approve, we build.
            </p>
          </div>

          {/* Step tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2 mb-10 scrollbar-hide justify-start lg:justify-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = active === i;
              return (
                <button key={s.n} onClick={() => setActive(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold transition-all ${
                    isActive ? 'text-white border-transparent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ background: isActive ? s.color : undefined }}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.n}</span>
                </button>
              );
            })}
          </div>

          {/* Step detail */}
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="grid lg:grid-cols-2 gap-8 items-start">

              {/* Left */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: step.light }}>
                    <StepIcon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: step.color }}>Phase {step.n}</span>
                    <h3 className="text-xl font-black text-gray-900 leading-snug">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{step.desc}</p>

                <div className="rounded-xl px-4 py-3 flex items-start gap-3 mb-6"
                  style={{ backgroundColor: step.light }}>
                  <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: step.color }} />
                  <p className="text-sm font-semibold" style={{ color: step.color }}>{step.outcome}</p>
                </div>

                <div className="flex items-center gap-2">
                  {STEPS.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all ${active === i ? 'w-6' : 'w-2 bg-gray-200'}`}
                      style={{ background: active === i ? step.color : undefined }} />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">{active + 1} / {STEPS.length}</span>
                </div>
              </div>

              {/* Right */}
              <div className="bg-[#0A0A0A] rounded-2xl p-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">
                  What We Deliver in Phase {step.n}
                </p>
                <ul className="space-y-3">
                  {step.deliverables.map((d, i) => (
                    <motion.li key={d}
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: step.color + '30' }}>
                        <CheckCircle className="w-3 h-3" style={{ color: step.color }} />
                      </div>
                      <span className="text-white/70 text-sm leading-relaxed">{d}</span>
                    </motion.li>
                  ))}
                </ul>

                {active < STEPS.length - 1 ? (
                  <button onClick={() => setActive(active + 1)}
                    className="mt-6 flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white/60 transition-colors">
                    Next: Phase {STEPS[active + 1].n} — {STEPS[active + 1].label}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link to="/MerchantOnboarding">
                    <Button className="mt-6 w-full font-bold text-white rounded-sm"
                      style={{ backgroundColor: step.color }}>
                      Start Your Platform <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* Timeline strip */}
      <section className="py-16 px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900">Typical Launch Timeline</h2>
            <p className="text-gray-400 text-sm mt-1">From first call to first patient — 7–14 business days</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { day: 'Day 1–2', event: 'Discovery call + build plan delivered' },
              { day: 'Day 2–4', event: 'LLC, banking, domain, and brand live' },
              { day: 'Day 4–7', event: 'Platform built + providers/pharmacy integrated' },
              { day: 'Day 7–14', event: 'Marketing live + first patients onboarded' },
            ].map((t, i) => (
              <motion.div key={t.day} {...fade(i * 0.08)}
                className="bg-[#F7F4ED] rounded-xl p-5 border border-gray-100">
                <p className="text-xs font-black text-[#4A6741] uppercase tracking-widest mb-2">{t.day}</p>
                <p className="text-sm text-gray-700 font-medium leading-snug">{t.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#0A0A0A] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Start?</h2>
          <p className="text-white/40 mb-8">Book your free discovery call and we'll have your build plan ready within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 font-black">
                Book Discovery Call <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="tel:+12403875224">
              <Button variant="ghost" className="text-white border border-white/15 rounded-sm px-8 font-bold hover:bg-white/5">
                Call 240-387-5224
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}