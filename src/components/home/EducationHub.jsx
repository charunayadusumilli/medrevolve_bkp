import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Video, FileText, ArrowUpRight, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const tracks = [
  {
    icon: BookOpen,
    category: 'SCIENCE',
    title: 'Telehealth & Clinical Foundations',
    description: 'Clinical best practices, therapeutic protocols, regulatory frameworks for different medication classes, contraindication management, and evidence-based prescribing.',
    modules: 5,
    duration: '3.5 hrs',
    level: 'Foundational',
    color: '#4A6741',
    bg: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
  },
  {
    icon: FileText,
    category: 'COMPLIANCE',
    title: 'Regulatory & Licensing Mastery',
    description: 'State-by-state licensing, HIPAA implementation, DEA controlled substance protocols, compounding pharmacy oversight, and FDA labeling requirements.',
    modules: 8,
    duration: '6 hrs',
    level: 'Intermediate',
    color: '#2A6B7A',
    bg: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
  },
  {
    icon: Video,
    category: 'OPERATIONS',
    title: 'Merchant Operations Certification',
    description: 'Inventory management, auto-reorder logic, telehealth workflow design, provider oversight, patient retention strategies, and platform administration.',
    modules: 6,
    duration: '4 hrs',
    level: 'Intermediate',
    color: '#7A5A45',
    bg: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  },
  {
    icon: Award,
    category: 'GROWTH',
    title: 'Patient Acquisition & Retention',
    description: 'Performance marketing frameworks for regulated health products, referral programs, creator partnerships, patient LTV optimization, and brand positioning.',
    modules: 7,
    duration: '5 hrs',
    level: 'Advanced',
    color: '#6B7A4A',
    bg: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
  },
];

export default function EducationHub() {
  return (
    <section className="bg-[#060606] border-t border-white/5">

      {/* Header with background */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=60"
            alt="" className="w-full h-full object-cover opacity-[0.04]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <GraduationCap className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 font-medium">MedRevolve University</p>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
                Own your business.<br />
                <span className="text-white/25">Operate with confidence.</span>
              </h2>
            </div>
            <div className="lg:text-right">
              <p className="text-white/35 text-sm max-w-xs leading-relaxed mb-6">
                Our university ensures your team is trained on clinical, operational, and compliance fundamentals before launch. You'll graduate as a certified operator.
              </p>
              <div className="flex lg:justify-end gap-6">
                {[
                  { v: '26', l: 'Modules' },
                  { v: '4', l: 'Tracks' },
                  { v: 'Certified', l: 'Credential' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-white font-black text-lg">{s.v}</div>
                    <div className="text-white/25 text-[10px] tracking-[0.15em] uppercase">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course cards */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-lg border border-white/5 hover:border-white/15 transition-all duration-500 flex flex-col">

                {/* Image top */}
                <div className="relative h-36 overflow-hidden">
                  <img src={track.bg} alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, #060606 100%)` }} />
                  <div className="absolute inset-0 opacity-60" style={{ background: track.color + '30' }} />
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] tracking-[0.3em] uppercase font-semibold px-2.5 py-1 rounded-full border"
                      style={{ borderColor: track.color + '60', color: track.color, background: track.color + '15' }}>
                      {track.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 bg-[#060606] flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: track.color }} />
                    <span className="text-white/30 text-[10px] tracking-[0.15em] uppercase">{track.level}</span>
                  </div>
                  <h3 className="text-white font-bold text-base leading-tight mb-3">{track.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-4 flex-1">{track.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-white/20" />
                        <span className="text-[10px] text-white/30">{track.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-white/20" />
                        <span className="text-[10px] text-white/30">{track.duration}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">Certification is included with every MedRevolve merchant subscription.</p>
          <Link to={createPageUrl('MerchantOnboarding')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <button className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-6 py-3">
              Start Certification <ArrowUpRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}