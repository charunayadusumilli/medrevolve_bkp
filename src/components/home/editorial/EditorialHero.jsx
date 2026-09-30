import React from 'react';
import { motion } from 'framer-motion';
import EditorialImage from './EditorialImage';

export default function EditorialHero() {
  return (
    <section className="bg-[#F9F7F2] px-6 lg:px-12 pt-16 pb-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-6">
            US telehealth infrastructure for founders
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] leading-[1.02] mb-6"
            style={{ letterSpacing: '-0.02em' }}>
            Launch your<br />telehealth brand.
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed max-w-md mb-8">
            Services, payments, and a unified CRM — all under your brand. We own the vendor relationships so you can operate with confidence, in any state, day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="#qualify">
              <button className="bg-[#1A1A1A] text-white rounded-full px-8 py-4 text-sm font-semibold hover:bg-black transition-colors">
                Start
              </button>
            </a>
            <a href="tel:+12403875224" className="text-sm font-semibold text-[#1A1A1A] hover:text-stone-500 transition-colors">
              Call 240-387-5224
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          <EditorialImage
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80"
            alt="Founder"
            className="w-full h-full" />
        </motion.div>
      </div>
    </section>
  );
}