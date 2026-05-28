import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, GraduationCap } from 'lucide-react';
import B2BHero from '@/components/home/B2BHero';
import PlatformMetrics from '@/components/home/PlatformMetrics';
import PlatformJourney from '@/components/home/PlatformJourney';
import PlugAndPlayDemo from '@/components/home/PlugAndPlayDemo';
import B2BFinalCTA from '@/components/home/B2BFinalCTA';

const WHO_ITS_FOR = [
  { icon: '🏥', title: 'Med Spa & Clinic Owners', desc: 'Add physician-supervised wellness programs to your existing business without building a telehealth team from scratch.' },
  { icon: '💪', title: 'Gym & Fitness Operators', desc: 'Offer your members a physician-supervised wellness track — fully managed, fully white-labeled under your brand.' },
  { icon: '🚀', title: 'Entrepreneurs & Startups', desc: 'Launch a telehealth business from zero. We handle everything technical, legal, and operational. You focus on growth.' },
  { icon: '🌿', title: 'Wellness Centers', desc: 'Expand your service menu with physician-supervised programs that generate recurring subscription revenue.' },
  { icon: '📱', title: 'Digital Health Founders', desc: 'Skip the 2-year build. Get a compliant, operating telehealth platform under your brand in 7 days.' },
  { icon: '🤝', title: 'Healthcare Professionals', desc: 'Monetize your expertise with your own brand. We give you the business infrastructure; you bring the knowledge.' },
];

const TRUST_POINTS = [
  'HIPAA Compliant Platform',
  'LegitScript Support',
  'Licensed Providers — All 50 States',
  'Licensed 503A Pharmacy Partners',
  'Stripe Payment Processing',
  'No Drug Names Advertised',
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <B2BHero />

      {/* ── METRICS STRIP ────────────────────────────────────────────────── */}
      <PlatformMetrics />

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#4A6741] border border-[#4A6741]/30 rounded-full px-4 py-1.5 mb-4">
              Who This Is For
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Built for Business Operators<br />
              <span className="text-[#4A6741]">Who Move Fast</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              If you want to run a telehealth business without building the compliance stack, provider network, and technology from scratch — MedRevolve is your infrastructure partner.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHO_ITS_FOR.map((item, i) => (
              <motion.div key={item.title} {...fade(i * 0.06)}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-gray-200 transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/MerchantOnboarding">
              <Button className="rounded-sm px-8 font-bold text-white bg-[#0A0A0A] hover:bg-gray-800">
                See If You Qualify <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5-PHASE JOURNEY ──────────────────────────────────────────────── */}
      <PlatformJourney />

      {/* ── LIVE PLATFORM DEMO ───────────────────────────────────────────── */}
      <PlugAndPlayDemo />

      {/* ── UNIVERSITY STRIP ─────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-[#F7F4ED] border-y border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1F2D27] rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-[#A8C99B]" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-base">MedRevolve University</p>
              <p className="text-gray-500 text-sm">Free education for telehealth operators — compliance, launch, and scale tracks.</p>
            </div>
          </div>
          <Link to="/University" className="flex-shrink-0">
            <Button variant="outline" className="rounded-sm border-gray-300 font-bold px-6">
              Explore Free Resources <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <B2BFinalCTA />

      {/* ── COMPLIANCE STRIP ─────────────────────────────────────────────── */}
      <section className="py-6 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_POINTS.map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> {b}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}