import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, ChevronDown, Star, Leaf, Apple, Activity, Heart, Zap, Moon, Brain } from 'lucide-react';

// ── Program Data ────────────────────────────────────────────────────────────
const programCategories = [
  { id: 'diet', label: 'Diet Programs', icon: Apple },
  { id: 'health', label: 'Health Programs', icon: Activity },
  { id: 'mind', label: 'Mind & Sleep', icon: Moon },
];

const programs = [
  // ── Diet Programs ────────────────────────────────────────────────────────
  {
    id: 'metabolic-reset',
    category: 'diet',
    tag: 'Most Popular',
    tagColor: 'bg-amber-500',
    name: 'Metabolic Reset Program',
    subtitle: 'Science-Backed Weight Loss',
    description: 'A clinician-guided 12-week program combining GLP-1 medication, personalized nutrition coaching, and habit tracking to reset your metabolism for good.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=85',
    bg: 'bg-amber-50',
    price: 349,
    priceLabel: '/mo · all-inclusive',
    duration: '12 weeks',
    includes: [
      'Semaglutide or Tirzepatide prescription',
      'Weekly 1:1 provider check-ins',
      'Personalized meal plan by a dietitian',
      'Daily habit tracker app access',
      'Unlimited messaging with care team',
    ],
    results: '85% of members lose 10+ lbs in 12 weeks',
    icon: Apple,
    accent: '#D97706',
  },
  {
    id: 'lean-strong',
    category: 'diet',
    tag: 'Best Results',
    tagColor: 'bg-green-600',
    name: 'Lean & Strong Program',
    subtitle: 'Build Muscle, Burn Fat',
    description: 'Designed for those who want to lose fat while preserving lean muscle. Combines prescription support, strength-focused meal planning, and performance coaching.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85',
    bg: 'bg-green-50',
    price: 299,
    priceLabel: '/mo · 3-month minimum',
    duration: '3 months',
    includes: [
      'Body composition assessment',
      'High-protein nutrition protocol',
      'GLP-1 medication if eligible',
      'Bi-weekly provider consultations',
      'Performance-based coaching',
    ],
    results: 'Members gain strength while losing an average of 8% body fat',
    icon: Activity,
    accent: '#16A34A',
  },
  {
    id: 'plant-powered',
    category: 'diet',
    tag: 'New',
    tagColor: 'bg-teal-500',
    name: 'Plant-Powered Wellness',
    subtitle: 'Whole-Food. Whole Health.',
    description: 'A plant-forward nutrition program guided by a registered dietitian. Perfect for those wanting to improve energy, digestion, and long-term health without counting calories.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85',
    bg: 'bg-teal-50',
    price: 199,
    priceLabel: '/mo · no minimums',
    duration: 'Ongoing',
    includes: [
      'Personalized plant-based meal plans',
      'Weekly dietitian video sessions',
      'Supplement recommendations',
      'Grocery guide & meal prep tips',
      'Community accountability group',
    ],
    results: '91% report improved energy levels within 30 days',
    icon: Leaf,
    accent: '#0D9488',
  },
  {
    id: 'gut-health',
    category: 'diet',
    tag: 'Trending',
    tagColor: 'bg-orange-500',
    name: 'Gut Health Reset',
    subtitle: 'Fix the Root. Feel Better.',
    description: 'Your gut drives energy, mood, weight, and immunity. This program uses functional lab testing and a personalized protocol to restore your microbiome balance.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=85',
    bg: 'bg-orange-50',
    price: 249,
    priceLabel: '/mo · includes lab kit',
    duration: '8 weeks',
    includes: [
      'At-home gut microbiome lab test',
      'Provider analysis & protocol',
      'Anti-inflammatory diet plan',
      'Targeted probiotic recommendations',
      'Bi-weekly follow-up consultations',
    ],
    results: '78% see measurable improvement in bloating & energy in 8 weeks',
    icon: Heart,
    accent: '#EA580C',
  },

  // ── Health Programs ──────────────────────────────────────────────────────
  {
    id: 'longevity-protocol',
    category: 'health',
    tag: 'Premium',
    tagColor: 'bg-violet-600',
    name: 'Longevity Protocol',
    subtitle: 'Add Healthy Years to Your Life',
    description: 'Our flagship anti-aging program. Comprehensive bloodwork, biomarker optimization, hormone balancing, peptide therapy, and a personalized longevity plan.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85',
    bg: 'bg-violet-50',
    price: 499,
    priceLabel: '/mo · all-inclusive',
    duration: 'Ongoing',
    includes: [
      'Full longevity biomarker panel (annually)',
      'Hormone & peptide optimization',
      'Monthly provider check-ins',
      'Personalized supplement stack',
      'Biological age tracking',
    ],
    results: 'Members average a 7-year reduction in biological age markers',
    icon: Zap,
    accent: '#7C3AED',
  },
  {
    id: 'mens-vitality',
    category: 'health',
    tag: 'For Men',
    tagColor: 'bg-indigo-600',
    name: "Men's Vitality Program",
    subtitle: 'Energy. Drive. Strength.',
    description: 'Comprehensive men\'s health program covering testosterone optimization, metabolic health, cardiovascular wellness, and sexual health — all from licensed providers.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=85',
    bg: 'bg-indigo-50',
    price: 299,
    priceLabel: '/mo',
    duration: 'Ongoing',
    includes: [
      'Testosterone & hormone lab panel',
      'TRT or natural optimization protocol',
      'Cardiovascular & metabolic support',
      'Sexual health consultation',
      'Monthly provider check-in',
    ],
    results: '89% of members report improved energy and drive within 60 days',
    icon: Zap,
    accent: '#4338CA',
  },
  {
    id: 'womens-balance',
    category: 'health',
    tag: 'For Women',
    tagColor: 'bg-fuchsia-500',
    name: "Women's Hormone Balance",
    subtitle: 'Thrive Through Every Phase',
    description: 'Designed for perimenopause, menopause, or hormonal imbalance. A personalized hormone therapy and wellness program that helps women feel like themselves again.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85',
    bg: 'bg-fuchsia-50',
    price: 279,
    priceLabel: '/mo',
    duration: 'Ongoing',
    includes: [
      'Full female hormone panel',
      'BHRT or natural hormone support',
      'Nutrition & lifestyle guidance',
      'Thyroid & adrenal evaluation',
      'Monthly specialist consultations',
    ],
    results: '94% report improvement in hot flashes and mood within 8 weeks',
    icon: Heart,
    accent: '#A21CAF',
  },
  {
    id: 'heart-health',
    category: 'health',
    tag: 'Preventative',
    tagColor: 'bg-red-500',
    name: 'Heart Health Program',
    subtitle: 'Protect Your Most Important Muscle',
    description: 'A proactive cardiovascular wellness program with advanced lipid testing, blood pressure management, lifestyle coaching, and medication support if needed.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=85',
    bg: 'bg-red-50',
    price: 229,
    priceLabel: '/mo',
    duration: 'Ongoing',
    includes: [
      'Advanced cardiovascular lab panel',
      'Blood pressure monitoring plan',
      'Heart-healthy nutrition protocol',
      'Statin or medication support (if eligible)',
      'Quarterly cardiologist review',
    ],
    results: 'Members average 18% LDL reduction in 90 days',
    icon: Heart,
    accent: '#DC2626',
  },

  // ── Mind & Sleep ─────────────────────────────────────────────────────────
  {
    id: 'sleep-restore',
    category: 'mind',
    tag: 'Top Rated',
    tagColor: 'bg-blue-600',
    name: 'Sleep Restore Program',
    subtitle: 'Wake Up Feeling Human Again',
    description: 'A science-backed sleep improvement program that combines sleep medicine evaluation, CBT-I therapy, hormone optimization, and targeted supplementation.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=85',
    bg: 'bg-blue-50',
    price: 199,
    priceLabel: '/mo',
    duration: '8 weeks',
    includes: [
      'Sleep medicine provider evaluation',
      'CBT-I digital therapy program',
      'Melatonin & hormone assessment',
      'Custom sleep hygiene protocol',
      'Weekly sleep score tracking',
    ],
    results: '87% of members achieve 7+ hours of quality sleep by week 6',
    icon: Moon,
    accent: '#2563EB',
  },
  {
    id: 'stress-clarity',
    category: 'mind',
    tag: 'New',
    tagColor: 'bg-cyan-600',
    name: 'Clarity & Stress Program',
    subtitle: 'Calm Mind. Sharp Focus.',
    description: 'Designed for high-performers and people experiencing burnout. Combines cortisol testing, adaptogen protocols, mindfulness coaching, and cognitive support.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85',
    bg: 'bg-cyan-50',
    price: 229,
    priceLabel: '/mo',
    duration: '3 months',
    includes: [
      'Cortisol & stress hormone lab panel',
      'Adaptogen & nootropic protocol',
      'Weekly mindfulness coaching sessions',
      'Cognitive performance tracking',
      'NAD+ or peptide support if eligible',
    ],
    results: '82% report significant reduction in stress & anxiety scores',
    icon: Brain,
    accent: '#0891B2',
  },
];

// ── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How is this different from a regular diet or gym program?',
    a: 'Every MedRevolve program is medically supervised by licensed providers — not a generic app or fitness influencer. We combine prescription therapy (when appropriate), lab testing, and personalized coaching that adapts to your biology, not a one-size-fits-all plan.',
  },
  {
    q: 'Do I need insurance?',
    a: 'No insurance needed. Our programs are transparent, flat-rate monthly memberships. Some lab tests may be covered depending on your plan — we\'ll help you check.',
  },
  {
    q: 'What if I want to switch programs?',
    a: 'You can switch programs at any time with no penalty. Your care team will guide the transition to make sure it aligns with your goals.',
  },
  {
    q: 'Are prescriptions included in the price?',
    a: 'Yes — for programs that include medication, the prescription and pharmacy fulfillment are included in the monthly price. No surprise costs.',
  },
  {
    q: 'How quickly will I see results?',
    a: 'Many members notice improvements in energy, mood, and wellbeing within the first 2-4 weeks. Clinical outcomes like weight loss or hormone optimization typically show measurable results within 60-90 days.',
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8E0D5] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-[#2D3A2D] font-medium pr-4">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-[#4A6741] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#5A6B5A] leading-relaxed text-sm">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgramCard({ program }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className={`relative aspect-[16/9] overflow-hidden ${program.bg}`}>
        <img
          src={program.image}
          alt={program.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`${program.tagColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow`}>
            {program.tag}
          </span>
        </div>
        {/* Duration pill */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-[#2D3A2D]">
          {program.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: program.accent }}>
          {program.subtitle}
        </p>
        <h3 className="text-lg font-bold text-[#1A2A1A] mb-2 leading-snug">{program.name}</h3>
        <p className="text-sm text-[#5A6B5A] leading-relaxed mb-4">{program.description}</p>

        {/* Includes */}
        <div className="space-y-2 mb-4">
          {program.includes.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[#2D3A2D]">
              <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: program.accent + '20' }}>
                <Check className="w-2.5 h-2.5" style={{ color: program.accent }} />
              </div>
              {item}
            </div>
          ))}
        </div>

        {/* Result callout */}
        <div className="bg-[#F5F0E8] rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
          <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#5A6B5A] leading-relaxed">{program.results}</p>
        </div>

        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-[#1A2A1A]">${program.price}</span>
              <span className="text-xs text-[#8A9A8A] ml-1">{program.priceLabel}</span>
            </div>
          </div>
          <Link to={createPageUrl('CustomerIntake')}>
            <Button
              size="sm"
              className="rounded-full px-5 text-sm font-semibold text-white shadow"
              style={{ background: program.accent }}
            >
              Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const [activeCategory, setActiveCategory] = useState('diet');
  const filtered = programs.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D3A2D] via-[#3D5636] to-[#4A6741]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Leaf className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-semibold tracking-widest uppercase">Medically Supervised</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
              Programs Built<br />
              <span className="font-bold">Around Your Biology</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Not another generic diet. Real clinical programs — combining prescription therapy, lab testing, and personalized coaching — designed to work with your body.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={createPageUrl('CustomerIntake')}>
                <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-[#F5F0E8] rounded-full px-8 font-bold shadow-xl text-base">
                  Find My Program <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Consultations')}>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-full px-8 border border-white/30 text-base">
                  Talk to a Provider
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50,000+', label: 'Members enrolled' },
            { value: '92%', label: 'Report measurable results' },
            { value: '120+', label: 'Licensed providers' },
            { value: '24 hrs', label: 'To your first check-in' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-[#4A6741]">{stat.value}</p>
              <p className="text-xs text-[#5A6B5A] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="sticky top-16 z-20 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#E8E0D5]">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 py-3 overflow-x-auto scrollbar-hide">
          {programCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#2D3A2D] text-white shadow-md'
                    : 'text-[#5A6B5A] hover:bg-[#F5F0E8] hover:text-[#2D3A2D]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Programs Grid ── */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
            >
              {filtered.map((program, i) => (
                <motion.div key={program.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-3">How Programs Work</h2>
            <p className="text-[#5A6B5A]">Simple. Medical-grade. Delivered to you.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Complete Intake', desc: 'Answer a few questions about your health history and goals. Takes 5 minutes.', icon: '📋' },
              { step: '02', title: 'Meet Your Provider', desc: 'A licensed clinician reviews your profile and creates your personalized program.', icon: '🩺' },
              { step: '03', title: 'Receive Your Plan', desc: 'Medication (if prescribed), meal plans, lab kits, and coaching — delivered to your door.', icon: '📦' },
              { step: '04', title: 'Ongoing Support', desc: 'Regular check-ins, lab reviews, and plan adjustments as your body changes.', icon: '📈' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-[11px] font-bold text-[#4A6741] uppercase tracking-widest mb-1">{item.step}</p>
                <h3 className="font-bold text-[#2D3A2D] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5A6B5A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-[#2D3A2D] mb-3">Why MedRevolve Programs?</h2>
            <p className="text-[#5A6B5A]">Not all health programs are created equal.</p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div className="grid grid-cols-3 text-center">
              <div className="p-4 border-r border-gray-100 col-span-1" />
              <div className="p-4 border-r border-gray-100 bg-[#2D3A2D]">
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <Leaf className="w-3.5 h-3.5 text-[#A8C99B]" />
                  <span className="text-white text-sm font-bold">MedRevolve</span>
                </div>
              </div>
              <div className="p-4">
                <span className="text-[#8A9A8A] text-sm font-medium">Generic Programs</span>
              </div>
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
              <div key={i} className={`grid grid-cols-3 text-center border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <div className="p-4 text-sm text-[#2D3A2D] font-medium text-left px-6">{feature}</div>
                <div className="p-4 bg-[#2D3A2D]/5 border-r border-[#2D3A2D]/10">
                  {ours === true ? <span className="text-[#4A6741] font-bold text-lg">✓</span> : <span className="text-sm text-[#4A6741]">{ours}</span>}
                </div>
                <div className="p-4">
                  {theirs === false ? <span className="text-gray-300 text-lg">✗</span> : <span className="text-sm text-[#8A9A8A]">{theirs}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-10 text-center">Common Questions</h2>
          <div className="divide-y divide-[#E8E0D5]">
            {faqs.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Ready to Start Your Program?</h2>
          <p className="text-white/60 mb-10 text-lg">Answer 5 questions and get matched with the right program and provider today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl('CustomerIntake')}>
              <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-[#F5F0E8] rounded-full px-10 font-bold text-base shadow-xl">
                Find My Program <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('Consultations')}>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-full px-8 border border-white/30 text-base">
                Talk to a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}