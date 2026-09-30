import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function EditorialUniversity() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#F1ECE3] rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center mb-5">
              <GraduationCap className="w-6 h-6 text-[#F1ECE3]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">MedRevolve University</span>
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mt-3 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Free education for telehealth operators.
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-7">
              Compliance, launch, and scale tracks — built for founders who want to understand the business before they run it.
            </p>
            <Link to="/University">
              <button className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white rounded-full px-6 py-3.5 text-sm font-semibold hover:bg-black transition-colors">
                Explore free resources <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          {/* overlapping card stack */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex gap-3 opacity-90">
            <div className="w-28 h-40 bg-white rounded-xl shadow-lg rotate-[-8deg]" />
            <div className="w-28 h-40 bg-[#E8E0D2] rounded-xl shadow-lg rotate-[3deg]" />
            <div className="w-28 h-40 bg-[#1A1A1A] rounded-xl shadow-lg rotate-[10deg]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}