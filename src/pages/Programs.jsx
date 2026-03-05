import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Check, ChevronDown, Star, Leaf, Apple, Activity,
  Heart, Zap, Moon, Brain, Video, FileText, Package, HeartPulse, Lock
} from 'lucide-react';

// ── Journey Data — The core 4-step patient experience ─────────────────────
const coreJourney = [
  {
    step: '01',
    icon: Video,
    label: 'Consultation',
    title: 'Meet a Licensed Provider',
    desc: 'Book a same-day or next-day telehealth consultation. Your provider reviews your history, goals, and labs — then builds your protocol.',
    detail: 'Board-certified physicians and NPs. HIPAA-compliant video. 20–30 minutes.',
    href: 'Consultations',
    cta: 'Book Now',
    accent: '#4A6741',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=85&fm=webp',
  },
  {
    step: '02',
    icon: FileText,
    label: 'Prescription',
    title: 'Your Protocol. Personalized.',
    desc: 'Your provider writes a custom prescription — GLP-1, peptides, hormone therapy, or a full program — sent directly to a licensed compounding pharmacy.',
    detail: 'Semaglutide, Tirzepatide, NAD+, Testosterone, and more. No hidden costs.',
    href: 'VisitTypeSelector',
    cta: 'Browse Treatments',
    accent: '#8B7355',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=700&q=85&fm=webp',
  },
  {
    step: '03',
    icon: Package,
    label: 'Delivery',
    title: 'Delivered to Your Door',
    desc: 'Your medication, lab kits, and supplement protocols shipped discreetly. Temperature-controlled, pharmacy-grade, and exactly as prescribed.',
    detail: 'Discreet packaging. 24–48 hour delivery. Ongoing refill management.',
    href: 'Products',
    cta: 'See Products',
    accent: '#2D3A2D',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=700&q=85&fm=webp',
  },
  {
    step: '04',
    icon: HeartPulse,
    label: 'Ongoing Care',
    title: 'Support That Never Stops',
    desc: 'Regular provider check-ins, AI health coaching, lab reviews, and real-time protocol adjustments as your body responds.',
    detail: 'Monthly check-ins. AI coach access. Lab & dosage reviews included.',
    href: 'CustomerIntake',
    cta: 'Get Started',
    accent: '#4A6741',
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=700&q=85&fm=webp',
  },
];

// ── Treatment Category Data ───────────────────────────────────────────────
const treatmentCategories = [
  {
    id: 'weight',
    icon: '⚖️',
    label: 'Weight Loss',
    tag: 'Most Popular',
    tagColor: '#D97706',
    headline: 'GLP-1 Weight Loss Programs',
    sub: 'Semaglutide & Tirzepatide programs — clinically proven to reduce body weight by up to 22%.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=85&fm=webp',
    includes: ['Semaglutide or Tirzepatide Rx', 'Weekly provider check-ins', 'Nutrition coaching', 'Unlimited care team messaging'],
    price: 'From $299/mo',
    href: 'Products?category=weight_loss',
  },
  {
    id: 'mens',
    icon: '⚡',
    label: "Men's Health",
    tag: 'High Performance',
    tagColor: '#4338CA',
    headline: "Men's Vitality & Performance",
    sub: 'Testosterone optimization, metabolic health, and energy protocols prescribed by real physicians.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=85&fm=webp',
    includes: ['Testosterone & hormone panel', 'TRT or natural protocol', 'Monthly provider check-in', 'Sexual health consultation'],
    price: 'From $249/mo',
    href: 'Products?category=mens_health',
  },
  {
    id: 'womens',
    icon: '🌸',
    label: "Women's Health",
    tag: 'Personalized',
    tagColor: '#A21CAF',
    headline: "Women's Hormone & Wellness",
    sub: 'Hormone balance, weight management, and longevity — designed entirely around your biology.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=85&fm=webp',
    includes: ['Full female hormone panel', 'BHRT or natural support', 'Thyroid & adrenal evaluation', 'Monthly specialist consultation'],
    price: 'From $279/mo',
    href: 'Products?category=womens_health',
  },
  {
    id: 'longevity',
    icon: '🧬',
    label: 'Longevity',
    tag: 'Science-Backed',
    tagColor: '#7C3AED',
    headline: 'Longevity & Peptide Protocols',
    sub: 'NAD+, Sermorelin, BPC-157 — precision peptide protocols backed by cutting-edge cellular science.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85&fm=webp',
    includes: ['Full longevity biomarker panel', 'Hormone & peptide optimization', 'Biological age tracking', 'Personalized supplement stack'],
    price: 'From $399/mo',
    href: 'Products?category=longevity',
  },
  {
    id: 'hormones',
    icon: '✨',
    label: 'Hormone Therapy',
    tag: 'Trending',
    tagColor: '#DC2626',
    headline: 'Hormone Optimization',
    sub: 'Balance your hormones for energy, mood, weight, and vitality. Physician-guided from day one.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=85&fm=webp',
    includes: ['Comprehensive hormone panel', 'Bioidentical HRT protocols', 'Thyroid optimization', 'Quarterly reviews'],
    price: 'From $229/mo',
    href: 'Products?category=hormone',
  },
  {
    id: 'mind',
    icon: '🧠',
    label: 'Mind & Sleep',
    tag: 'New',
    tagColor: '#0891B2',
    headline: 'Cognitive & Sleep Programs',
    sub: 'Clarity, focus, and deep sleep protocols. Cortisol testing, adaptogens, and cognitive support.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&q=85&fm=webp',
    includes: ['Cortisol & stress hormone panel', 'Adaptogen & nootropic protocol', 'CBT-I sleep therapy', 'Weekly mindfulness coaching'],
    price: 'From $199/mo',
    href: 'Programs',
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'How is this different from a regular diet or gym program?', a: 'Every MedRevolve program is medically supervised by licensed providers — not a generic app or fitness influencer. We combine prescription therapy (when appropriate), lab testing, and personalized coaching that adapts to your biology.' },
  { q: 'Do I need insurance?', a: 'No insurance needed. Our programs are transparent, flat-rate monthly memberships. Some lab tests may be covered depending on your plan — we\'ll help you check.' },
  { q: 'Are prescriptions included in the price?', a: 'Yes — for programs that include medication, the prescription and pharmacy fulfillment are included in the monthly price. No surprise costs.' },
  { q: 'How quickly will I see results?', a: 'Many members notice improvements in energy, mood, and wellbeing within the first 2-4 weeks. Clinical outcomes like weight loss or hormone optimization typically show measurable results within 60-90 days.' },
  { q: 'What if I want to switch programs?', a: 'You can switch programs at any time with no penalty. Your care team will guide the transition to make sure it aligns with your goals.' },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="text-white font-medium pr-4">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-[#A8C99B] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-5 text-white/50 leading-relaxed text-sm">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TreatmentCard({ cat, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="group relative bg-[#1E293B] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={cat.image} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white"
            style={{ background: cat.tagColor + 'cc' }}>{cat.tag}</span>
        </div>
        <div className="absolute top-3 right-3 text-2xl">{cat.icon}</div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2 leading-snug">{cat.headline}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{cat.sub}</p>

        <div className="space-y-2 mb-5">
          {cat.includes.map((item, j) => (
            <div key={j} className="flex items-center gap-2 text-sm text-white/60">
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cat.tagColor }} />
              {item}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm font-bold text-white">{cat.price}</span>
          <Link to={createPageUrl(cat.href)} onClick={() => window.scrollTo({ top: 0 })}>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-black rounded-none transition-all hover:opacity-85"
              style={{ background: cat.tagColor }}>
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const [activeJourney, setActiveJourney] = useState(0);
  const activeStep = coreJourney[activeJourney];
  const StepIcon = activeStep.icon;

  return (
    <div className="min-h-screen bg-[#0A1628]">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=70&fm=webp"
            alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/80 to-[#0A1628]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 mb-8">
              <Leaf className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">Medically Supervised Programs</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" style={{ letterSpacing: '-0.03em' }}>
              Your Journey.<br />
              <span className="text-[#A8C99B]">Built Around You.</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Consultation. Prescription. Delivery. Coaching. One seamless telehealth experience, powered by real licensed providers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={createPageUrl('Consultations')}>
                <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-10 font-bold shadow-2xl text-base">
                  Start My Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('VisitTypeSelector')}>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-none px-8 border border-white/20 text-base">
                  Browse Treatments
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <section className="bg-white/5 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50,000+', label: 'Members enrolled' },
            { value: '92%', label: 'Report measurable results' },
            { value: '200+', label: 'Licensed providers' },
            { value: '24 hrs', label: 'To your first check-in' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-[#A8C99B]">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Journey: 4-Step Interactive ───────────────────────────── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#A8C99B]/60 mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              The MedRevolve Journey
            </h2>
            <p className="text-white/40 mt-3 max-w-md mx-auto">From your first consultation to ongoing optimization — every step managed.</p>
          </motion.div>

          {/* Journey step tabs */}
          <div className="flex gap-2 justify-center mb-12 flex-wrap">
            {coreJourney.map((step, i) => {
              const SI = step.icon;
              return (
                <button key={step.step} onClick={() => setActiveJourney(i)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    i === activeJourney ? 'bg-white text-[#0A1628] border-white shadow-lg' : 'text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                  }`}>
                  <SI className="w-4 h-4" />{step.label}
                </button>
              );
            })}
          </div>

          {/* Active step detail */}
          <AnimatePresence mode="wait">
            <motion.div key={activeJourney}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 400 }}>
                <img src={activeStep.image} alt={activeStep.label} className="w-full h-full object-cover" style={{ minHeight: 400 }} loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="text-white/10 font-black text-9xl leading-none select-none">{activeStep.step}</span>
                </div>
                <div className="absolute bottom-6 left-6">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full text-white backdrop-blur-sm"
                    style={{ background: activeStep.accent + 'bb', border: `1px solid ${activeStep.accent}60` }}>
                    <StepIcon className="w-3.5 h-3.5" /> {activeStep.label}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-black text-white mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {activeStep.title}
                </h3>
                <p className="text-white/55 text-base leading-relaxed mb-4">{activeStep.desc}</p>
                <p className="text-white/30 text-sm italic mb-8">{activeStep.detail}</p>
                <Link to={createPageUrl(activeStep.href)} onClick={() => window.scrollTo({ top: 0 })}>
                  <button className="flex items-center gap-2 px-8 py-3 font-bold text-sm text-black rounded-none hover:opacity-85 transition-all"
                    style={{ background: activeStep.accent }}>
                    {activeStep.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mt-10">
            {coreJourney.map((_, i) => (
              <button key={i} onClick={() => setActiveJourney(i)}
                className={`transition-all h-0.5 rounded-full ${i === activeJourney ? 'w-10 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Treatment Categories ───────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#A8C99B]/60 mb-3">Treatment Programs</p>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Choose Your Program
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatmentCategories.map((cat, i) => (
              <TreatmentCard key={cat.id} cat={cat} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ───────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-8 bg-[#0A1628]">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Why MedRevolve?</h2>
            <p className="text-white/40">Not all health programs are created equal.</p>
          </motion.div>
          <div className="bg-[#1E293B] rounded-2xl overflow-hidden border border-white/5">
            <div className="grid grid-cols-3 text-center">
              <div className="p-4 border-r border-white/5 col-span-1" />
              <div className="p-4 border-r border-white/5 bg-[#A8C99B]/10">
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <Leaf className="w-3.5 h-3.5 text-[#A8C99B]" />
                  <span className="text-white text-sm font-bold">MedRevolve</span>
                </div>
              </div>
              <div className="p-4"><span className="text-white/30 text-sm font-medium">Generic Programs</span></div>
            </div>
            {[
              ['Licensed medical providers', true, false],
              ['Prescription medication included', true, false],
              ['Personalized lab testing', true, false],
              ['1:1 provider consultations', true, false],
              ['Nutrition coaching', true, 'Extra cost'],
              ['Ongoing plan adjustment', true, false],
              ['Transparent flat-rate pricing', true, false],
            ].map(([feature, ours, theirs], i) => (
              <div key={i} className={`grid grid-cols-3 text-center border-t border-white/5 ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                <div className="p-4 text-sm text-white/70 font-medium text-left px-6">{feature}</div>
                <div className="p-4 bg-[#A8C99B]/5 border-r border-white/5">
                  {ours === true ? <span className="text-[#A8C99B] font-bold text-lg">✓</span> : <span className="text-sm text-[#A8C99B]">{ours}</span>}
                </div>
                <div className="p-4">
                  {theirs === false ? <span className="text-white/20 text-lg">✗</span> : <span className="text-sm text-white/30">{theirs}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10 text-center" style={{ letterSpacing: '-0.02em' }}>Common Questions</h2>
          <div className="divide-y divide-white/10">
            {faqs.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 bg-[#0A1628]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Ready to Begin?
          </h2>
          <p className="text-white/40 mb-10 text-lg">Answer 5 questions and get matched with the right program and provider today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl('Consultations')}>
              <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-10 font-bold text-base shadow-xl">
                Book a Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('CustomerIntake')}>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-none px-8 border border-white/20 text-base">
                Complete Intake Form
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}