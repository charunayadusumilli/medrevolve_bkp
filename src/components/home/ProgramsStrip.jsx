import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

const programs = [
  {
    icon: '⚖️',
    title: 'Weight Optimization',
    desc: 'GLP-1 protocols with ongoing physician support and nutrition coaching.',
    href: 'Programs',
    color: '#4A6741',
  },
  {
    icon: '🧬',
    title: 'Peptide Protocols',
    desc: 'NAD+, BPC-157, Sermorelin — cellular optimization for longevity.',
    href: 'Programs',
    color: '#0F172A',
  },
  {
    icon: '🥗',
    title: 'Diet & Nutrition Plans',
    desc: 'Structured 12-week metabolic reset and anti-inflammation programs.',
    href: 'Programs',
    color: '#7A8F7C',
  },
  {
    icon: '🔄',
    title: 'Lifestyle Reset',
    desc: 'Physician-guided wean-off protocols for unhealthy habits and dependencies.',
    href: 'Programs',
    color: '#C6A75E',
  },
  {
    icon: '⚡',
    title: 'Hormone Therapy',
    desc: 'Testosterone & estrogen optimization. Balance from within.',
    href: 'Programs',
    color: '#1E293B',
  },
  {
    icon: '🧠',
    title: 'Cognitive & Skin',
    desc: 'Synapsin, Glutathione, and skin-forward wellness programs.',
    href: 'Programs',
    color: '#8B7355',
  },
];

export default function ProgramsStrip() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7A8F7C] mb-2">Full Ecosystem</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#0F172A]">
              Every program.<br />
              <span className="font-semibold">One platform.</span>
            </h2>
          </div>
          <Link
            to={createPageUrl('Programs')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold text-[#0F172A] hover:gap-3 transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            View All Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={createPageUrl(p.href)} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="group bg-[#F8F6F2] rounded-2xl p-6 hover:bg-[#0F172A] transition-all duration-300 cursor-pointer border border-[#D1D5DB]/40 hover:border-[#0F172A] h-full">
                  <div className="text-2xl mb-4">{p.icon}</div>
                  <h3 className="font-semibold text-[#0F172A] group-hover:text-white text-base mb-2 transition-colors">{p.title}</h3>
                  <p className="text-[#1E293B]/55 group-hover:text-white/55 text-sm leading-relaxed transition-colors">{p.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]/40 group-hover:text-[#C6A75E] transition-colors">
                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}