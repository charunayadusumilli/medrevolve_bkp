import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Shield, Users, Building2, GraduationCap } from 'lucide-react';

const SERVICES = [
  {
    title: 'Weight Management Program',
    desc: 'Physician-supervised programs for medically supported, sustainable weight management.',
    icon: '⚖️',
  },
  {
    title: 'Hormone Optimization Program',
    desc: 'Comprehensive hormone evaluation and physician-directed optimization for men and women.',
    icon: '🧬',
  },
  {
    title: 'Longevity & Cellular Health',
    desc: 'Functional medicine protocols designed to support vitality, energy, and healthy aging.',
    icon: '🌿',
  },
  {
    title: "Men's Health Program",
    desc: 'Confidential, physician-supervised care addressing energy, performance, and vitality.',
    icon: '⚡',
  },
  {
    title: "Women's Health Program",
    desc: 'Comprehensive hormonal and wellness support tailored to each stage of a woman\'s life.',
    icon: '🌸',
  },
  {
    title: 'Hair & Skin Restoration',
    desc: 'Physician-directed programs for hair restoration and skin health improvement.',
    icon: '✨',
  },
];

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Complete Your Free Intake',
    desc: 'Answer a short health questionnaire — takes about 3 minutes. No appointment needed to start.',
  },
  {
    n: '02',
    title: 'Meet Your Physician',
    desc: 'A licensed, board-certified physician reviews your intake and creates your personalized care plan.',
  },
  {
    n: '03',
    title: 'Your Care Plan, Delivered',
    desc: 'Your treatment ships directly to your door from a licensed pharmacy — discrete, fast, fully tracked.',
  },
];

const TRUST_BADGES = [
  { label: 'HIPAA Compliant' },
  { label: 'Board-Certified Physicians' },
  { label: 'All 50 States' },
  { label: 'Rx Delivered to Your Door' },
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
      <section className="bg-[#1F2D27] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=30)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-400 border border-green-400/30 rounded-full px-4 py-1.5 mb-6">
              Physician-Supervised Wellness
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Physician-Supervised Wellness,<br />
              <span className="text-white/40">Delivered to Your Door.</span>
            </h1>
            <p className="text-lg text-white/55 max-w-2xl mx-auto mb-4 leading-relaxed">
              Licensed physicians. All 50 states. No waiting rooms.
            </p>
            <p className="text-sm text-white/30 mb-10 max-w-xl mx-auto">
              MedRevolve connects patients with independently licensed healthcare providers for physician-supervised wellness programs. All treatments require a valid physician consultation and prescription.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/CustomerIntake">
                <Button className="rounded-sm px-8 py-3 text-sm font-bold h-auto text-white"
                  style={{ backgroundColor: '#A66B3C' }}>
                  Start Free Intake <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/Services">
                <Button variant="ghost" className="text-white/60 hover:text-white rounded-sm px-8 py-3 text-sm font-semibold h-auto border border-white/10 hover:border-white/30">
                  See Our Services
                </Button>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {TRUST_BADGES.map(({ label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs font-semibold text-white/40">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F7F4ED' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Our Programs</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Physician-Supervised Wellness Programs</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Every program is managed by a licensed, board-certified physician. No drug names or specific treatments are advertised — your physician will determine what's right for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} {...fade(i * 0.06)}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-gray-200 transition-all flex flex-col">
                <div className="text-3xl mb-3">{svc.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{svc.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{svc.desc}</p>
                <Link to="/CustomerIntake" className="mt-4">
                  <Button size="sm" className="w-full rounded-sm text-white text-xs font-semibold"
                    style={{ backgroundColor: '#A66B3C' }}>
                    Start This Program <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6 max-w-2xl mx-auto">
            All programs require a physician consultation. Your provider will determine the appropriate treatment plan based on your health history and individual needs.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Simple Process</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ n, title, desc }, i) => (
              <motion.div key={n} {...fade(i * 0.1)} className="text-center">
                <div className="w-12 h-12 rounded-sm bg-[#1F2D27] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-black text-sm">{n}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/CustomerIntake">
              <Button className="rounded-sm px-8 font-bold text-white" style={{ backgroundColor: '#A66B3C' }}>
                Start Your Free Intake <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── B2B CTA SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#1F2D27' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fade()}>
            <Building2 className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-3">
              Are You a Clinic Owner or Wellness Operator?
            </h2>
            <p className="text-white/45 mb-8 text-sm max-w-xl mx-auto">
              MedRevolve builds complete, compliant telehealth platforms for wellness businesses — website, providers, pharmacy network, merchant account, and compliance — all under your brand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/ForBusiness">
                <Button className="bg-white text-[#1F2D27] hover:bg-white/90 rounded-sm px-8 font-bold">
                  Explore B2B Partnership <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/University">
                <Button variant="ghost" className="text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-sm px-8">
                  <GraduationCap className="w-4 h-4 mr-2" /> MedRevolve University
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST / COMPLIANCE STRIP ─────────────────────────────────────── */}
      <section className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {['HIPAA Compliant', 'LegitScript Support', 'Licensed Providers — All 50 States', 'Licensed 503A Pharmacy Partners', 'Surescripts Integrated'].map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {b}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}