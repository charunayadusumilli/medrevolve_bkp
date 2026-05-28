import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, CreditCard, Users, ShieldCheck, BarChart3, Mail } from 'lucide-react';

const DEMO_SCREENS = [
  {
    id: 'storefront',
    label: 'Your Storefront',
    icon: Globe,
    bg: '#1a2e1a',
    preview: (
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#111] text-white p-6 font-mono text-xs space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-white/30 text-[10px]">yourwellnessbrand.com</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-green-400 text-base font-bold mb-1">Your Brand Name</p>
          <p className="text-white/50 text-[11px] mb-3">Physician-Supervised Wellness • All 50 States</p>
          <div className="grid grid-cols-2 gap-2">
            {['Weight Management', 'Hormone Health', "Men's Wellness", 'Longevity'].map(s => (
              <div key={s} className="bg-white/8 border border-white/10 rounded p-2 text-[10px] text-white/60">{s}</div>
            ))}
          </div>
          <div className="mt-3 bg-green-600 rounded px-3 py-2 text-center text-[11px] font-bold">
            Start Free Consultation →
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'checkout',
    label: 'Checkout & Payments',
    icon: CreditCard,
    bg: '#1a1a2e',
    preview: (
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#111] text-white p-6 space-y-4">
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Secure Checkout</p>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-bold text-sm">Initial Consultation</p>
              <p className="text-white/40 text-[11px]">60-min physician visit</p>
            </div>
            <p className="text-white font-black text-lg">$199</p>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="bg-white/8 rounded-lg p-3 space-y-2">
              <div className="h-2 bg-white/20 rounded w-full" />
              <div className="h-2 bg-white/10 rounded w-3/4" />
              <div className="h-2 bg-white/10 rounded w-1/2" />
            </div>
          </div>
          <div className="bg-blue-600 rounded px-3 py-2.5 text-center text-[11px] font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Pay Securely via Stripe
          </div>
        </div>
        <p className="text-white/20 text-[9px] text-center">Powered by Stripe • PCI-DSS Level 1</p>
      </div>
    ),
  },
  {
    id: 'providers',
    label: 'Provider Dashboard',
    icon: Users,
    bg: '#2e1a2e',
    preview: (
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#111] text-white p-6 space-y-4">
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Provider Portal</p>
        <div className="space-y-2">
          {[
            { name: 'Dr. Sarah M., MD', status: 'Online', patients: 12 },
            { name: 'Dr. James K., NP', status: 'In Session', patients: 8 },
            { name: 'Dr. Priya L., MD', status: 'Available', patients: 15 },
          ].map(p => (
            <div key={p.name} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${p.status === 'In Session' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <div>
                  <p className="text-white text-[11px] font-bold">{p.name}</p>
                  <p className="text-white/30 text-[9px]">{p.status}</p>
                </div>
              </div>
              <p className="text-white/50 text-[10px]">{p.patients} patients</p>
            </div>
          ))}
        </div>
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-2 text-[10px] text-purple-300">
          ✓ E-prescribing active • EMR synced • Calendar integrated
        </div>
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics & CRM',
    icon: BarChart3,
    bg: '#2e1a1a',
    preview: (
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#111] text-white p-6 space-y-4">
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Business Analytics</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Monthly Revenue', val: '$42,800', up: true },
            { label: 'Active Patients', val: '284', up: true },
            { label: 'Conversion Rate', val: '18.4%', up: true },
            { label: 'Avg LTV', val: '$1,240', up: false },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-white/30 text-[9px] uppercase font-bold mb-1">{s.label}</p>
              <p className="text-white font-black text-base">{s.val}</p>
              <p className={`text-[9px] font-bold ${s.up ? 'text-green-400' : 'text-white/30'}`}>
                {s.up ? '↑ Growing' : '→ Stable'}
              </p>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-[9px] text-center">HubSpot + Zoho CRM synced • Real-time</p>
      </div>
    ),
  },
  {
    id: 'marketing',
    label: 'Marketing Engine',
    icon: Mail,
    bg: '#1a2020',
    preview: (
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#111] text-white p-6 space-y-4">
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Marketing Automations</p>
        <div className="space-y-2">
          {[
            { seq: 'Welcome Sequence', status: 'Active', sent: '1,240' },
            { seq: 'Rx Reminder Flow', status: 'Active', sent: '892' },
            { seq: 'Re-engagement', status: 'Active', sent: '340' },
            { seq: 'Creator Affiliate', status: 'Live', sent: '2,100' },
          ].map(m => (
            <div key={m.seq} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
              <div>
                <p className="text-white text-[11px] font-bold">{m.seq}</p>
                <p className="text-white/30 text-[9px]">{m.sent} delivered</p>
              </div>
              <span className="text-[9px] font-black text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                {m.status}
              </span>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-[9px] text-center">Twilio SMS + Email + LegitScript Certified</p>
      </div>
    ),
  },
];

export default function PlugAndPlayDemo() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#A8C99B] border border-[#A8C99B]/20 rounded-full px-4 py-1.5 mb-4">
            Live Platform Demo
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            This Is What Your Business<br />
            <span className="text-[#A8C99B]">Looks Like After We Build It</span>
          </h2>
          <p className="text-white/35 max-w-xl mx-auto text-base">
            Every screen you see below is part of your operating telehealth platform. Plug and play — you own it all.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* Tab list */}
          <div className="space-y-2">
            {DEMO_SCREENS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                    active === i
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'border-white/5 text-white/30 hover:text-white/60 hover:border-white/10'
                  }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-bold">{s.label}</span>
                  {active === i && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                </button>
              );
            })}

            <Link to="/MerchantOnboarding" className="block mt-4">
              <Button className="w-full bg-white text-black hover:bg-white/90 rounded-sm font-bold text-sm">
                Get This Platform <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Preview */}
          <motion.div key={active}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22 }}>
            <div className="rounded-2xl overflow-hidden border border-white/10 p-6"
              style={{ backgroundColor: DEMO_SCREENS[active].bg }}>
              <div className="flex items-center gap-2 mb-4">
                {React.createElement(DEMO_SCREENS[active].icon, { className: 'w-4 h-4 text-white/40' })}
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  {DEMO_SCREENS[active].label}
                </span>
                <span className="ml-auto text-[9px] text-green-400 font-black bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">LIVE</span>
              </div>
              {DEMO_SCREENS[active].preview}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}