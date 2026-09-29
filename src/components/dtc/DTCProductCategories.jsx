import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { icon: '🔥', title: 'GLP-1 Weight Loss', desc: 'Physician-supervised GLP-1 programs for sustainable weight management. Monthly plans include medication, provider access, and ongoing support.', price: 'From $399/mo', gradient: 'from-orange-50 to-red-50', border: 'border-orange-100' },
  { icon: '💪', title: "Men's Health / TRT", desc: 'Testosterone replacement therapy and men\'s wellness programs. Lab testing, provider consultation, and personalized treatment plans.', price: 'From $199/mo', gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
  { icon: '🌸', title: "Women's Health / BHRT", desc: 'Bioidentical hormone replacement therapy and women\'s wellness. Personalized hormone optimization under medical supervision.', price: 'From $199/mo', gradient: 'from-pink-50 to-rose-50', border: 'border-pink-100' },
  { icon: '🧬', title: 'Peptides / Longevity', desc: 'Cutting-edge peptide therapies for recovery, vitality, and longevity. Clinician-guided protocols from US-licensed providers.', price: 'From $249/mo', gradient: 'from-teal-50 to-cyan-50', border: 'border-teal-100' },
  { icon: '✨', title: 'Hair Health', desc: 'FDA-approved hair loss treatments prescribed online. Finasteride, minoxidil, and combination therapy delivered to your door.', price: 'From $25/mo', gradient: 'from-amber-50 to-yellow-50', border: 'border-amber-100' },
  { icon: '💆', title: 'Skin Health', desc: 'Prescription skincare and dermatology solutions. Personalized treatment plans for acne, anti-aging, and skin wellness.', price: 'From $30/mo', gradient: 'from-purple-50 to-violet-50', border: 'border-purple-100' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function DTCProductCategories() {
  return (
    <section className="py-16 lg:py-24 px-5 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-12">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#0B8B7A] border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-4">
            What We Treat
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A0A0A] mb-3" style={{ letterSpacing: '-0.03em' }}>
            Your whole health,<br />
            <span className="text-[#0B8B7A]">all in one place.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            From weight loss to longevity — every program is physician-supervised and delivered through our LegiScript-certified, FDA-compliant platform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.title} {...fade(i * 0.06)}
              className={`group bg-gradient-to-br ${cat.gradient} border ${cat.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}>
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="text-lg font-black text-[#0A0A0A] mb-2">{cat.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{cat.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0B8B7A]">{cat.price}</span>
                <Link to="/CustomerIntake" className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 group-hover:text-[#0B8B7A] transition-colors">
                  Start <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}