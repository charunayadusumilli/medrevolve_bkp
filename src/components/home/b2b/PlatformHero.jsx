import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_E164, PHONE_TEL } from '@/lib/contactConfig';

export default function PlatformHero() {
  return (
    <section className="bg-[#1F2D27] px-6 lg:px-12 pt-20 pb-24">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C] mb-7">
            White-Label Telehealth Infrastructure
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6" style={{ letterSpacing: '-0.03em' }}>
            The White-Label<br />
            <span className="text-[#A66B3C]">Telehealth Platform</span>
          </h1>
          <p className="text-white/55 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            MedRevolve builds and operates the complete infrastructure for your telehealth brand: AI-powered intake, a licensed 50-state clinician network, payment processing built for healthcare, pharmacy fulfillment, a unified CRM, and real-time compliance monitoring — live in 7 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness">
              <button className="bg-[#A66B3C] text-white hover:bg-[#945E33] transition-colors px-9 py-4 text-sm font-bold rounded-none w-full sm:w-auto inline-flex items-center justify-center gap-2">
                Launch Your Brand <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="mailto:rned@medrevolve.com"
              className="bg-transparent text-white border border-white/25 hover:bg-white/10 transition-colors px-9 py-4 text-sm font-bold rounded-none w-full sm:w-auto inline-flex items-center justify-center">
              Talk to Us
            </a>
          </div>
          <a href={PHONE_TEL} className="mt-6 inline-flex items-center gap-2 text-white/45 text-sm hover:text-white/70 transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#A66B3C]" /> Or call {PHONE_DISPLAY}
          </a>
        </motion.div>
      </div>
    </section>
  );
}