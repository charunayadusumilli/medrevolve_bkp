import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PartnershipsHero() {
  return (
    <section className="bg-[#1F2D27] px-6 lg:px-12 pt-20 pb-24">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C] mb-7">
            For Platforms, Employers &amp; Partners
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6" style={{ letterSpacing: '-0.03em' }}>
            Your Brand. Our Rails.<br />
            <span className="text-[#A66B3C]">Partnership-Ready Infrastructure.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            MedRevolve is the white-label infrastructure layer for telehealth and employer health programs: AI-powered intake, unified CRM, payment processing built for high-risk, 50-state pharmacy fulfillment, and real-time compliance monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#inquiry">
              <button className="bg-[#A66B3C] text-white hover:bg-[#945E33] transition-colors px-9 py-4 text-sm font-bold rounded-none w-full sm:w-auto">
                Start a Partnership
              </button>
            </a>
            <Link to="/ForBusiness">
              <button className="bg-transparent text-white border border-white/25 hover:bg-white/10 transition-colors px-9 py-4 text-sm font-bold rounded-none w-full sm:w-auto inline-flex items-center justify-center gap-2">
                Explore ForBusiness <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}