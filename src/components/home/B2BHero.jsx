import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const PROOF_POINTS = [
  'White-label, on your domain — patients see your brand, your clinic, your colors',
  'Provider network, ready to plug in — multi-state credentialed clinicians via Qualiphy',
  'Compliance built in — HIPAA, BAA, state telehealth laws, payment compliance',
];

export default function B2BHero() {
  return (
    <section className="relative bg-[#060606] overflow-hidden">
      {/* Background image overlay — B2B clinic operations / SaaS platform environment */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&q=60)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/97 to-[#060606]/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest">
                Telehealth Business Infrastructure
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6"
              style={{ letterSpacing: '-0.03em' }}>
              The white-label telehealth platform<br />
              <span className="text-[#A8C99B]">built for clinics that scale.</span>
            </h1>

            <p className="text-lg text-white/45 leading-relaxed mb-4 max-w-xl">
              Med spas, IV clinics, TRT practices, weight-loss programs — launch your branded patient experience on infrastructure built for multi-state compliance, provider workflows, and payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/PersonalizedDemo">
                <Button size="lg"
                  className="bg-white text-[#060606] hover:bg-white/90 rounded-sm px-10 font-black text-base h-auto py-4">
                  Book a Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/Platform">
                <Button size="lg" variant="ghost"
                  className="text-white border border-white/15 hover:bg-white/8 hover:border-white/30 rounded-sm px-8 text-base h-auto py-4">
                  See the Platform
                </Button>
              </Link>
            </div>

            {/* Proof points */}
            <div className="flex flex-col gap-2">
              {PROOF_POINTS.map(p => (
                <span key={p} className="flex items-center gap-2 text-sm text-white/40">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" />
                  {p}
                </span>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Right: Platform UI preview panel */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}>
          <div className="relative">
            {/* Main dashboard card */}
            <div className="bg-[#111]/90 backdrop-blur border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-white/25 text-[10px] font-mono">admin.yourclinic.com</span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black text-base">Clinic Operations</p>
                    <p className="text-white/30 text-[10px]">Today — June 11, 2026</p>
                  </div>
                  <span className="text-[9px] font-black text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-1">LIVE</span>
                </div>
                {/* Stat row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Patients', val: '284' },
                    { label: 'Revenue', val: '$42.8k' },
                    { label: 'CVR', val: '18.4%' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/5 border border-white/8 rounded-lg p-2.5 text-center">
                      <p className="text-white font-black text-sm">{s.val}</p>
                      <p className="text-white/30 text-[9px] uppercase font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Provider list */}
                <div className="space-y-2">
                  <p className="text-white/25 text-[9px] uppercase font-bold tracking-widest">Active Providers</p>
                  {[
                    { name: 'Dr. Sarah M., MD', state: 'FL • TX • CA', status: 'Available' },
                    { name: 'Dr. James K., NP', state: 'NY • IL • OH', status: 'In Session' },
                  ].map(p => (
                    <div key={p.name} className="flex items-center justify-between bg-white/4 border border-white/8 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-white text-[11px] font-bold">{p.name}</p>
                        <p className="text-white/25 text-[9px]">{p.state}</p>
                      </div>
                      <span className={`text-[9px] font-bold rounded-full px-2 py-0.5 ${
                        p.status === 'Available'
                          ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                          : 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                      }`}>{p.status}</span>
                    </div>
                  ))}
                </div>
                {/* Compliance bar */}
                <div className="bg-[#4A6741]/15 border border-[#4A6741]/25 rounded-lg px-3 py-2.5">
                  <p className="text-[#A8C99B] text-[10px] font-bold">✓ HIPAA · BAA Signed · LegitScript Pending · Stripe Active</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black text-gray-900">Platform live in 7 days</span>
            </div>
          </div>
        </motion.div>

        </div>
      </div>
    </section>
  );
}