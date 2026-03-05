import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Check, Video, FileText, Package, HeartPulse, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const programs = [
  {
    id: 'weight',
    icon: '⚖️',
    title: 'Weight Optimization',
    tag: 'Most Popular',
    tagColor: '#D97706',
    desc: 'GLP-1 protocols with ongoing physician support and nutrition coaching.',
    price: 'From $299/mo',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    includes: ['Semaglutide or Tirzepatide Rx', 'Weekly provider check-ins', 'Nutrition coaching', 'Unlimited care messaging'],
    journey: [
      { step: 1, label: 'Intake Form', desc: 'Complete health questionnaire (5 min)', action: 'CustomerIntake', cta: 'Start Intake', icon: FileText },
      { step: 2, label: 'Consultation', desc: 'Same-day video call with licensed provider', action: 'Consultations', cta: 'Book Now', icon: Video },
      { step: 3, label: 'Rx Prescribed', desc: 'Personalized GLP-1 protocol written', action: 'Products?category=weight_loss', cta: 'See Products', icon: FileText },
      { step: 4, label: 'Delivered', desc: 'Pharmacy-grade medication shipped 24–48 hrs', action: null, cta: null, icon: Package },
      { step: 5, label: 'Ongoing Care', desc: 'Monthly check-ins & dosage adjustments', action: 'PatientPortal', cta: 'My Portal', icon: HeartPulse },
    ],
    href: 'Products?category=weight_loss',
  },
  {
    id: 'mens',
    icon: '⚡',
    title: "Men's Health",
    tag: 'Performance',
    tagColor: '#4338CA',
    desc: 'TRT, ED, and men\'s vitality protocols — real physicians, real results.',
    price: 'From $89/mo',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    includes: ['Testosterone or ED protocol', 'Physician consultation', 'Monthly check-in', 'Discreet delivery'],
    journey: [
      { step: 1, label: 'Choose Treatment', desc: 'Browse ED, TRT, or hair loss options', action: 'Products?category=mens_health', cta: 'Browse Treatments', icon: FileText },
      { step: 2, label: 'Intake + Consult', desc: 'Quick consult — often same day', action: 'VisitTypeSelector', cta: 'Start Visit', icon: Video },
      { step: 3, label: 'Rx Sent to Pharmacy', desc: 'Compounded at licensed partner pharmacy', action: null, cta: null, icon: FileText },
      { step: 4, label: 'Discreet Delivery', desc: 'Shipped in plain packaging', action: null, cta: null, icon: Package },
    ],
    href: 'Products?category=mens_health',
  },
  {
    id: 'womens',
    icon: '🌸',
    title: "Women's Health",
    tag: 'Personalized',
    tagColor: '#A21CAF',
    desc: 'Hormone balance, weight management, and longevity — built for her.',
    price: 'From $59/mo',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    includes: ['Full female hormone panel', 'HRT or natural support', 'Thyroid evaluation', 'Monthly specialist consult'],
    journey: [
      { step: 1, label: 'Symptom Intake', desc: 'Tell us about your health goals', action: 'CustomerIntake', cta: 'Start Intake', icon: FileText },
      { step: 2, label: 'Consultation', desc: 'Female specialist consultation', action: 'Consultations', cta: 'Book Now', icon: Video },
      { step: 3, label: 'Lab Review', desc: 'Provider reviews your hormone labs', action: null, cta: null, icon: FileText },
      { step: 4, label: 'Rx + Delivered', desc: 'Personalized protocol delivered to door', action: 'Products?category=womens_health', cta: 'See Products', icon: Package },
    ],
    href: 'Products?category=womens_health',
  },
  {
    id: 'longevity',
    icon: '🧬',
    title: 'Longevity & Peptides',
    tag: 'Science-Backed',
    tagColor: '#7C3AED',
    desc: 'NAD+, Sermorelin, BPC-157 — cellular optimization for long-term vitality.',
    price: 'From $149/mo',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    includes: ['Full longevity biomarker panel', 'Peptide + hormone optimization', 'Biological age tracking', 'Personalized supplement stack'],
    journey: [
      { step: 1, label: 'Longevity Assessment', desc: 'Complete biomarker & goals intake', action: 'CustomerIntake', cta: 'Start Assessment', icon: FileText },
      { step: 2, label: 'Physician Review', desc: 'Licensed provider builds your protocol', action: 'Consultations', cta: 'Book Consult', icon: Video },
      { step: 3, label: 'Peptide Protocol', desc: 'Custom Rx sent to compounding pharmacy', action: 'Products?category=longevity', cta: 'See Peptides', icon: FileText },
      { step: 4, label: 'Monthly Monitoring', desc: 'Labs + check-ins every 30 days', action: 'PatientPortal', cta: 'My Portal', icon: HeartPulse },
    ],
    href: 'Products?category=longevity',
  },
  {
    id: 'hormone',
    icon: '✨',
    title: 'Hormone Therapy',
    tag: 'Trending',
    tagColor: '#DC2626',
    desc: 'Physician-guided hormone optimization for energy, mood, and vitality.',
    price: 'From $149/mo',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    includes: ['Comprehensive hormone panel', 'Bioidentical HRT protocols', 'Thyroid optimization', 'Quarterly reviews'],
    journey: [
      { step: 1, label: 'Hormone Intake', desc: 'Describe your symptoms & goals', action: 'CustomerIntake', cta: 'Start Intake', icon: FileText },
      { step: 2, label: 'Lab Work', desc: 'Provider orders your hormone panel', action: 'Consultations', cta: 'Book Consult', icon: Video },
      { step: 3, label: 'Protocol Created', desc: 'Customized BHRT or optimization plan', action: 'Products?category=hormone', cta: 'See Products', icon: FileText },
      { step: 4, label: 'Quarterly Reviews', desc: 'Ongoing monitoring & adjustments', action: 'PatientPortal', cta: 'My Portal', icon: HeartPulse },
    ],
    href: 'Products?category=hormone',
  },
  {
    id: 'nutrition',
    icon: '🥗',
    title: 'Diet & Nutrition',
    tag: 'New',
    tagColor: '#0891B2',
    desc: 'Structured 12-week metabolic reset with AI coaching and physician oversight.',
    price: 'From $199/mo',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    includes: ['12-week metabolic reset', 'AI nutrition coaching', 'Physician oversight', 'Lab tracking included'],
    journey: [
      { step: 1, label: 'Nutrition Intake', desc: 'Dietary habits & metabolic goals', action: 'CustomerIntake', cta: 'Start Intake', icon: FileText },
      { step: 2, label: 'Provider Review', desc: 'Physician reviews your metabolic profile', action: 'Consultations', cta: 'Book Consult', icon: Video },
      { step: 3, label: 'Personalized Plan', desc: 'Custom 12-week protocol delivered', action: null, cta: null, icon: Package },
      { step: 4, label: 'AI Coaching', desc: 'Weekly AI check-ins and adjustments', action: 'PatientPortal', cta: 'My Portal', icon: HeartPulse },
    ],
    href: 'Programs',
  },
];

function JourneyTimeline({ journey }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = journey[activeStep];
  const StepIcon = step.icon;

  return (
    <div className="mt-6">
      {/* Step dots */}
      <div className="flex items-center gap-0 mb-6">
        {journey.map((s, i) => (
          <React.Fragment key={s.step}>
            <button
              onClick={() => setActiveStep(i)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all flex-shrink-0
                ${i === activeStep ? 'bg-[#2D3A2D] border-[#2D3A2D] text-white scale-110' : i < activeStep ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-[#4A6741]'}`}
            >
              {i < activeStep ? '✓' : s.step}
            </button>
            {i < journey.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < activeStep ? 'bg-[#4A6741]' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Active step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-[#F8F6F2] rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2D3A2D] flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#4A6741] uppercase tracking-wider mb-1">Step {step.step}</p>
              <h4 className="font-semibold text-[#2D3A2D] mb-1">{step.label}</h4>
              <p className="text-sm text-[#5A6B5A]">{step.desc}</p>
              {step.action && (
                <Link to={createPageUrl(step.action)} onClick={() => window.scrollTo({ top: 0 })} className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#4A6741] hover:text-[#2D3A2D] transition-colors">
                  {step.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setActiveStep(s => Math.max(0, s - 1))}
          disabled={activeStep === 0}
          className="text-xs text-[#5A6B5A] disabled:opacity-30 hover:text-[#2D3A2D] transition-colors font-medium"
        >
          ← Previous
        </button>
        <button
          onClick={() => setActiveStep(s => Math.min(journey.length - 1, s + 1))}
          disabled={activeStep === journey.length - 1}
          className="text-xs text-[#4A6741] disabled:opacity-30 hover:text-[#2D3A2D] transition-colors font-semibold"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}

export default function HomeProgramsTab() {
  const [activeProgram, setActiveProgram] = useState(null);
  const activeProg = programs.find(p => p.id === activeProgram);

  return (
    <div className="py-16 px-6 lg:px-8 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="mb-10 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#7A8F7C] mb-2">Full Programs</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#0F172A] mb-3">
            Choose your <span className="font-semibold">program</span> — see every step.
          </h2>
          <p className="text-sm text-[#5A6B5A] max-w-md mx-auto">
            Select any program to see exactly how it works — from intake to ongoing care.
          </p>
        </motion.div>

        {/* Program Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {programs.map((prog, i) => {
            const isActive = activeProgram === prog.id;
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => setActiveProgram(isActive ? null : prog.id)}
                  className={`w-full text-left rounded-2xl overflow-hidden border-2 transition-all group
                    ${isActive ? 'border-[#2D3A2D] shadow-xl' : 'border-transparent hover:border-[#2D3A2D]/30 hover:shadow-md bg-white'}`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={prog.image} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: prog.tagColor + 'dd' }}>{prog.tag}</span>
                    </div>
                    <div className="absolute top-3 right-3 text-2xl">{prog.icon}</div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-white font-bold">{prog.price}</span>
                    </div>
                  </div>
                  <div className={`p-4 ${isActive ? 'bg-white' : 'bg-white'}`}>
                    <h3 className="font-semibold text-[#1A2A1A] mb-1">{prog.title}</h3>
                    <p className="text-xs text-[#5A6B5A] mb-3">{prog.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.includes.slice(0, 2).map((inc, j) => (
                        <span key={j} className="text-[10px] bg-[#F0F4EF] text-[#4A6741] px-2 py-0.5 rounded-full font-medium">{inc}</span>
                      ))}
                    </div>
                    <div className={`flex items-center gap-1 mt-3 text-xs font-bold transition-colors ${isActive ? 'text-[#2D3A2D]' : 'text-[#4A6741]'}`}>
                      {isActive ? 'Hide journey ↑' : 'See full journey →'}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Journey Expanded Section */}
        <AnimatePresence>
          {activeProg && (
            <motion.div
              key={activeProg.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E0D5] shadow-lg">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left: what's included */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{activeProg.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-[#1A2A1A]">{activeProg.title}</h3>
                        <p className="text-sm text-[#5A6B5A]">{activeProg.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#5A6B5A] mb-5 leading-relaxed">{activeProg.desc}</p>
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">What's Included</p>
                      {activeProg.includes.map((inc, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-[#2D3A2D]">
                          <div className="w-4 h-4 rounded-full bg-[#D4E5D7] flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-[#4A6741]" />
                          </div>
                          {inc}
                        </div>
                      ))}
                    </div>
                    <Link to={createPageUrl(activeProg.href)} onClick={() => window.scrollTo({ top: 0 })}>
                      <Button className="bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full px-6">
                        Explore {activeProg.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Right: journey timeline */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">Your Journey — Step by Step</p>
                    <JourneyTimeline journey={activeProg.journey} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div className="mt-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Link to={createPageUrl('Programs')} onClick={() => window.scrollTo({ top: 0 })}>
            <Button variant="outline" className="rounded-full border-[#2D3A2D] text-[#2D3A2D] hover:bg-[#2D3A2D] hover:text-white px-8">
              View All Programs in Detail
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}