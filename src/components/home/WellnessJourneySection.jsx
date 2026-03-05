import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, FileText, Video, Package, HeartPulse, CheckCircle } from 'lucide-react';

const journeySteps = [
  {
    id: 'consult',
    number: '01',
    icon: Video,
    label: 'Consultation',
    headline: 'Meet a Real Doctor.\nNot a Chatbot.',
    body: 'Book a same-day or next-day telehealth consultation with a licensed physician or NP. They review your health history, goals, and labs — then build your personalized protocol.',
    callouts: ['Board-certified providers', 'HIPAA-compliant video', '20–30 min consultation'],
    cta: 'Book a Consultation',
    href: 'Consultations',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=85&fm=webp',
    accent: '#4A6741',
    pill: 'Step 1',
  },
  {
    id: 'prescription',
    number: '02',
    icon: FileText,
    label: 'Prescription',
    headline: 'Your Protocol.\nCustomized.',
    body: 'Your provider writes a personalized prescription — GLP-1, peptides, hormone therapy, or a full program — based entirely on your biology and goals. Sent directly to a licensed compounding pharmacy.',
    callouts: ['GLP-1 / Peptides / HRT', 'Licensed pharmacy fulfillment', 'No hidden costs'],
    cta: 'Browse Treatments',
    href: 'VisitTypeSelector',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=700&q=85&fm=webp',
    accent: '#8B7355',
    pill: 'Step 2',
  },
  {
    id: 'delivery',
    number: '03',
    icon: Package,
    label: 'Delivery',
    headline: 'Door-to-Door.\nIn 24–48 Hours.',
    body: 'Your medication, lab kits, and supplement protocols are shipped discreetly to your door. Temperature-controlled, pharmacy-grade, and exactly as prescribed.',
    callouts: ['Discreet packaging', '24–48 hour delivery', 'Temperature controlled'],
    cta: 'See All Products',
    href: 'Products',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=700&q=85&fm=webp',
    accent: '#2D3A2D',
    pill: 'Step 3',
  },
  {
    id: 'coaching',
    number: '04',
    icon: HeartPulse,
    label: 'Ongoing Coaching',
    headline: 'Support That\nNever Stops.',
    body: 'Your care doesn\'t end at delivery. Regular provider check-ins, AI health coaching, lab reviews, and real-time protocol adjustments as your body responds and evolves.',
    callouts: ['Monthly provider check-ins', 'AI health coach access', 'Lab & dosage reviews'],
    cta: 'View Programs',
    href: 'Programs',
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=700&q=85&fm=webp',
    accent: '#4A6741',
    pill: 'Step 4',
  },
];

export default function WellnessJourneySection() {
  const [activeStep, setActiveStep] = useState(0);
  const active = journeySteps[activeStep];
  const Icon = active.icon;

  return (
    <section className="bg-[#0F172A] py-24 px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#A8C99B]/70 mb-3">Your Care Journey</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
            From Consultation<br />
            <span className="text-[#A8C99B]">to Transformation.</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto text-base">
            A fully orchestrated healthcare experience — doctor, prescription, delivery, and coaching in one seamless platform.
          </p>
        </motion.div>

        {/* Step selector tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {journeySteps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  i === activeStep
                    ? 'bg-white text-[#0F172A] border-white shadow-lg'
                    : 'text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <StepIcon className="w-4 h-4" />
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Active Journey Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            {/* Left: Image */}
            <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 420 }}>
              <img
                src={active.image}
                alt={active.label}
                className="w-full h-full object-cover object-center"
                style={{ minHeight: 420 }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Big number */}
              <div className="absolute top-6 left-6">
                <span className="text-white/15 font-black text-8xl leading-none select-none">{active.number}</span>
              </div>
              {/* Pill */}
              <div className="absolute bottom-6 left-6">
                <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full text-white"
                  style={{ background: active.accent + 'cc' }}>
                  {active.pill}
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="text-white">
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4"
                style={{ color: active.accent }}>
                {active.label}
              </p>
              <h3
                className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight"
                style={{ whiteSpace: 'pre-line', letterSpacing: '-0.02em' }}
              >
                {active.headline}
              </h3>
              <p className="text-white/55 text-base leading-relaxed mb-8 max-w-md">
                {active.body}
              </p>

              {/* Callouts */}
              <div className="space-y-3 mb-10">
                {active.callouts.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: active.accent + '30', border: `1px solid ${active.accent}50` }}>
                      <CheckCircle className="w-3 h-3" style={{ color: active.accent }} />
                    </div>
                    <span className="text-white/70 text-sm font-medium">{c}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link to={createPageUrl(active.href)} onClick={() => window.scrollTo({ top: 0 })}>
                  <button className="flex items-center gap-2 px-7 py-3 font-bold text-sm text-black rounded-none transition-all hover:opacity-90"
                    style={{ background: active.accent === '#0F172A' ? '#A8C99B' : active.accent }}>
                    {active.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                {/* Step nav arrows */}
                <div className="flex gap-2">
                  {activeStep > 0 && (
                    <button onClick={() => setActiveStep(s => s - 1)}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all">
                      ←
                    </button>
                  )}
                  {activeStep < journeySteps.length - 1 && (
                    <button onClick={() => setActiveStep(s => s + 1)}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all">
                      →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom progress bar */}
        <div className="flex gap-2 mt-10 justify-center">
          {journeySteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`transition-all duration-400 h-0.5 rounded-full ${i === activeStep ? 'w-10 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}