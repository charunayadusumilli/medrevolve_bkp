import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Stethoscope, FileText, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STEPS = [
  {
    n: '01',
    icon: CalendarCheck,
    title: 'Book Your Consultation',
    body: 'Schedule online in minutes. No insurance required. Your consultation is conducted via secure HIPAA-compliant video visit with a licensed provider.',
    color: '#4A9B6F',
  },
  {
    n: '02',
    icon: Stethoscope,
    title: 'Meet Your Provider',
    body: 'Your licensed physician reviews your health history, current medications, and goals. They determine what — if anything — is appropriate for you.',
    color: '#2D6A9F',
  },
  {
    n: '03',
    icon: FileText,
    title: 'Receive Your Prescription',
    body: 'If your provider determines a program is appropriate, they issue a valid prescription routed directly to a licensed pharmacy partner.',
    color: '#7B5EA7',
  },
  {
    n: '04',
    icon: Package,
    title: 'Delivered to Your Door',
    body: 'Your medication ships discreetly, temperature-controlled, directly from the licensed pharmacy. Ongoing provider monitoring is included.',
    color: '#B85C7A',
  },
];

export default function B2CJourneySection() {
  return (
    <section className="bg-[#080808] border-t border-white/5 py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight">
              From consultation<br />
              <span className="text-white/25">to doorstep.</span>
            </h2>
          </div>
          <p className="text-white/35 text-sm max-w-xs leading-relaxed">
            Every step is physician-supervised. We never skip the consultation. Your health comes first.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#080808] p-8 lg:p-10 hover:bg-white/[0.02] transition-colors group">

                {/* Step number + icon */}
                <div className="flex items-start justify-between mb-8">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/15 font-medium">{step.n}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: step.color + '18' }}>
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                </div>

                <div className="w-px h-8 mb-6" style={{ background: step.color + '30' }} />

                <h3 className="text-lg font-bold text-white mb-3 leading-tight">{step.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{step.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to={createPageUrl('BookAppointment')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <button className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-colors rounded-sm">
              Start With a Free Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="text-white/20 text-xs mt-4">
            All consultations conducted by licensed physicians. Prescription required for all medications.
          </p>
        </div>
      </div>
    </section>
  );
}