import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle, Globe, CreditCard, Shield, Users,
  Stethoscope, Building2, FileText, Landmark, Phone, ChevronRight
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import ThemePicker from '@/components/home/ThemePicker';

// ── Service pillars ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: Globe,
    label: 'Digital Identity & Website',
    desc: 'We build your branded telehealth website — custom domain, content, niche-specific design, and full patient-facing experience.',
  },
  {
    icon: Stethoscope,
    label: 'Provider Integration',
    desc: 'We onboard licensed physicians and nurse practitioners into your platform so your patients can book and consult under your brand.',
  },
  {
    icon: Building2,
    label: 'Pharmacy Integration',
    desc: 'We connect your platform to licensed 503A compounding pharmacies that fulfill prescriptions written by your providers.',
  },
  {
    icon: CreditCard,
    label: 'Merchant Account & Payments',
    desc: 'We help you set up a compliant merchant account and bank account, then integrate secure payment processing into your platform.',
  },
  {
    icon: Landmark,
    label: 'Business Operations',
    desc: 'LLC formation guidance, banking setup, billing cycle management, and operational workflows — we walk you through it all.',
  },
  {
    icon: Shield,
    label: 'Compliance & Certifications',
    desc: 'We handle LegitScript certification, HIPAA compliance documentation, state licensing guidance, and ongoing audit readiness.',
  },
  {
    icon: FileText,
    label: 'Intake & Patient Management',
    desc: 'Custom intake forms, consent flows, patient records, and CRM integration — all configured for your specific programs.',
  },
  {
    icon: Users,
    label: 'Marketing & Growth',
    desc: 'From SEO to social media, we build and manage your digital marketing presence to drive qualified patient and partner traffic.',
  },
];

const JOURNEY_STEPS = [
  { n: '01', title: 'Tell Us About Your Business', desc: 'Fill out a quick intake: who you are, what niche you want to serve, and where you are in your journey.' },
  { n: '02', title: 'Choose Your Brand Theme', desc: 'Pick from Men\'s Health, Women\'s Health, GLP-1, Longevity, Med Spa, and more — then enter your brand name to see a live preview.' },
  { n: '03', title: 'Onboarding Consultation', desc: 'A dedicated MedRevolve specialist walks you through your entire platform setup — live, 1-on-1.' },
  { n: '04', title: 'We Build Everything', desc: 'Website, provider connections, pharmacy network, payment processor, compliance docs — we do the work.' },
  { n: '05', title: 'You Go Live', desc: 'Your branded telehealth platform launches. You own the brand and business. We power the infrastructure.' },
];

const NICHES = [
  { label: "Men's Health / TRT", color: '#1A3A5C', photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' },
  { label: "Women's Health / BHRT", color: '#7B3F6E', photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
  { label: 'GLP-1 / Weight Loss', color: '#1A5C3A', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
  { label: 'Longevity & Peptides', color: '#2D2D5A', photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { label: 'Med Spa / Aesthetics', color: '#5C3A1A', photo: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80' },
  { label: 'Hair Restoration', color: '#1A4A5C', photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
];

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=30)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div variants={fade()} initial="hidden" animate="show">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-400 border border-green-400/30 rounded-full px-4 py-1.5 mb-6">
              B2B Telehealth Services Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              We Build Your Telehealth<br />
              <span className="text-white/35">Business — End to End.</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
              MedRevolve is a full-service B2B infrastructure company. We set up your website, integrate licensed providers and pharmacies, configure your payment processing and merchant account, and handle compliance — so you can launch your telehealth brand with confidence.
            </p>
            <p className="text-sm text-white/30 mb-10 max-w-xl mx-auto">
              We are a services company. We do not sell products. We build and operate compliant telehealth business infrastructure for our partners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('MerchantOnboarding')}>
                <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 py-3 text-sm font-bold h-auto">
                  Start Your Business Setup <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button variant="ghost" className="text-white/60 hover:text-white rounded-sm px-8 py-3 text-sm font-semibold h-auto border border-white/10 hover:border-white/30">
                  Talk to a Specialist
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-y border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            'HIPAA Compliant Infrastructure',
            'LegitScript Certification Support',
            'Licensed Provider Network',
            'Licensed 503A Pharmacy Partners',
            'All 50 States',
          ].map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── WHAT WE DO ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Our Services</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Everything You Need to Launch</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From your first domain to your first patient visit — we provide every service required to build and operate a compliant telehealth business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={label} variants={fade(i * 0.05)} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="border border-gray-100 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NICHE PICKER SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Brand, Your Niche</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">See Your Website Before You Commit</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose a niche theme and type your brand name. We'll show you a live preview of what your website could look like — built, branded, and ready to launch.
            </p>
          </div>
          <ThemePicker />
        </div>
      </section>

      {/* ── NICHES WE SUPPORT ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Niche Specializations</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">We Specialize In These Markets</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Each niche requires specific provider credentials, pharmacy protocols, and compliance frameworks. We've built the infrastructure for all of them.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {NICHES.map(({ label, color, photo }) => (
              <motion.div key={label} variants={fade()} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative rounded-xl overflow-hidden group cursor-pointer" style={{ height: 120 }}>
                <img src={photo} alt={label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: `${color}CC` }} />
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="text-white font-bold text-sm leading-tight">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0A0A0A] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3">The Journey</p>
            <h2 className="text-3xl font-black mb-3">From Idea to Live Platform</h2>
            <p className="text-white/40 max-w-xl mx-auto">
              We've designed a clear, step-by-step process so you always know what's happening and what comes next.
            </p>
          </div>
          <div className="space-y-6">
            {JOURNEY_STEPS.map(({ n, title, desc }, i) => (
              <motion.div key={n} variants={fade(i * 0.08)} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 font-black text-xs text-white/30">
                  {n}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-10 py-3 h-auto font-bold">
                Begin My Setup <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Ready to build your telehealth business?</h2>
          <p className="text-gray-500 mb-8 text-sm">Start with a short intake form — no commitment required. A specialist will reach out within 24 hours.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button className="bg-gray-900 hover:bg-gray-700 text-white rounded-sm px-8 font-semibold">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="tel:+12403875224">
              <Button variant="outline" className="rounded-sm border-gray-300 text-gray-700 px-8">
                <Phone className="w-4 h-4 mr-2" /> 240-387-5224
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}