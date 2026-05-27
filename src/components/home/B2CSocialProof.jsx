import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Lock, Award } from 'lucide-react';

const TESTIMONIALS = [
  {
    text: 'I\'d tried everything. My MedRevolve physician was thorough, listened, and within my first follow-up I finally felt like I had a real plan.',
    name: 'Sarah M.',
    detail: 'GLP-1 Program · Member since 2024',
    stars: 5,
  },
  {
    text: 'The telehealth experience was seamless. My provider was knowledgeable, the process was fast, and the prescription came quickly.',
    name: 'James T.',
    detail: 'Men\'s Health Program · Member since 2024',
    stars: 5,
  },
  {
    text: 'I was hesitant about online health services but MedRevolve\'s team made me feel like I was at a real clinic. Highly recommend.',
    name: 'Maria L.',
    detail: 'Women\'s Wellness Program · Member since 2023',
    stars: 5,
  },
];

const BADGES = [
  { icon: Shield, label: 'HIPAA Compliant', sub: 'Your data is fully protected' },
  { icon: Lock, label: 'Licensed Providers', sub: 'Board-certified physicians' },
  { icon: Award, label: 'LegitScript Ready', sub: 'Pharmacy-grade compliance' },
  { icon: Star, label: 'Patients Nationwide', sub: 'Across all programs' },
];

export default function B2CSocialProof() {
  return (
    <section className="bg-[#060606] border-t border-white/5">

      {/* Trust badges */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x divide-white/5">
            {BADGES.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="lg:px-8 first:pl-0 last:pr-0 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4A6741]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#6B8F5E]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{b.label}</p>
                    <p className="text-white/30 text-xs mt-0.5">{b.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-12 font-medium">Patient Experiences</p>
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#060606] p-8 lg:p-10">
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-white/55 text-[15px] leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <p className="text-white/80 text-sm font-semibold">{t.name}</p>
                <p className="text-white/25 text-[11px] tracking-wide mt-0.5">{t.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/15 text-xs max-w-2xl mx-auto leading-relaxed">
            These statements have not been evaluated by the FDA. Individual results may vary. All programs require a valid prescription from a licensed physician. Telehealth services provided through licensed medical providers.
          </p>
        </div>
      </div>
    </section>
  );
}