import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Stethoscope, Briefcase, ArrowRight } from 'lucide-react';

const AUDIENCES = [
  { icon: Rocket, title: 'Entrepreneurs & Creators', body: 'You bring the audience, we bring the operations.' },
  { icon: Stethoscope, title: 'Clinics & Med Spas', body: 'Add service lines without new infrastructure.' },
  { icon: Briefcase, title: 'Agencies & Partners', body: 'White-label delivery for your clients.' },
];

export default function BuiltFor() {
  return (
    <section className="bg-[#1F2D27] py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">Built for</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4" style={{ letterSpacing: '-0.02em' }}>
            Who we build for.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.title}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}>
                <Link to="/ForBusiness"
                  className="group block h-full bg-white/5 border border-white/10 hover:border-[#A66B3C]/60 transition-all p-8">
                  <div className="w-12 h-12 bg-[#A66B3C] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{a.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{a.body}</p>
                  <span className="inline-flex items-center gap-2 text-[#A66B3C] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                    For Business <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}