import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Users, Package, Stethoscope, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const milestones = [
  {
    year: '2021',
    tag: 'THE ORIGIN',
    title: 'We were the merchant.',
    body: 'MedRevolve started as a direct-to-consumer wellness brand — selling GLP-1 protocols, peptide stacks, and hormone therapies to patients across the US. We lived every pain point: confusing compliance, unreliable pharmacies, broken payment rails.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    stat: { v: '1st', l: 'GLP-1 Protocol Sold' },
  },
  {
    year: '2022',
    tag: 'THE PIVOT',
    title: 'Built the infrastructure we wished existed.',
    body: 'After scaling our own storefront to 5,000+ patients, we reverse-engineered everything into a reusable platform. Provider credentialing, pharmacy contracts, compliance docs, inventory management — all productized from our own battle scars.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    stat: { v: '5K+', l: 'Patients on our own platform' },
  },
  {
    year: '2023',
    tag: 'THE PLATFORM',
    title: 'First merchants. Proven model.',
    body: 'We opened the infrastructure to other wellness entrepreneurs. Med spas, fitness coaches, longevity clinics — they plugged into our OS and went from idea to compliant storefront in under 30 days. What took us 18 months took them 4 weeks.',
    img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    stat: { v: '50+', l: 'Early merchant partners' },
  },
  {
    year: '2024–Now',
    tag: 'THE SCALE',
    title: 'The operating system for wellness commerce.',
    body: 'Today, MedRevolve powers 200+ active merchants across GLP, peptides, hormone therapy, longevity, and mens/womens health. Every product line we sell as a brand, you can white-label as a merchant. Same infrastructure. Your brand.',
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    stat: { v: '200+', l: 'Active merchant storefronts' },
  },
];

const proofPoints = [
  { icon: Package, label: 'Same GLP-1 catalog we use for our own patients' },
  { icon: Stethoscope, label: 'Same provider network we built for our own telehealth' },
  { icon: CheckCircle2, label: 'Same compliance framework we used to get licensed in 50 states' },
  { icon: TrendingUp, label: 'Same payment rails we battle-tested for high-risk wellness' },
];

export default function BrandJourney() {
  const [active, setActive] = useState(0);
  const m = milestones[active];

  return (
    <section className="bg-[#0A0A0A] border-t border-white/5 overflow-hidden">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20 border-b border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-medium">Our Story</p>
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
              We built this<br />
              <span className="text-white/25">for ourselves first.</span>
            </h2>
          </div>
          <p className="text-white/35 text-sm max-w-sm leading-relaxed lg:text-right">
            Every tool in this platform was forged by MedRevolve operating as a real wellness merchant — selling GLP-1s, peptides, and telehealth services to real patients.
          </p>
        </div>
      </div>

      {/* Timeline nav */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex overflow-x-auto scrollbar-hide">
            {milestones.map((ms, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`flex-shrink-0 px-6 py-5 text-left border-b-2 transition-all duration-300 mr-2
                  ${i === active ? 'border-white' : 'border-transparent hover:border-white/20'}`}>
                <p className={`text-[10px] tracking-[0.3em] uppercase mb-1 transition-colors ${i === active ? 'text-white/60' : 'text-white/20'}`}>{ms.tag}</p>
                <p className={`text-sm font-bold transition-colors ${i === active ? 'text-white' : 'text-white/30'}`}>{ms.year}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content — image + text */}
      <div className="max-w-7xl mx-auto">
        <motion.div key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2">

          {/* Image */}
          <div className="relative h-64 lg:h-auto min-h-[400px] overflow-hidden">
            <motion.img
              key={m.img}
              src={m.img}
              alt={m.title}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            {/* Stat overlay */}
            <div className="absolute bottom-8 left-8">
              <div className="text-4xl font-black text-white">{m.stat.v}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">{m.stat.l}</div>
            </div>
          </div>

          {/* Text */}
          <div className="p-10 lg:p-16 flex flex-col justify-center border-l border-white/5">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-medium">{m.year} — {m.tag}</p>
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">{m.title}</h3>
            <p className="text-white/45 leading-relaxed text-base mb-10">{m.body}</p>

            {/* Dot nav */}
            <div className="flex gap-2 mt-auto">
              {milestones.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full ${i === active ? 'w-8 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Proof strip */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/20 mb-8 font-medium">When you join MedRevolve, you get exactly what we built for ourselves</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proofPoints.map((pt, i) => {
              const Icon = pt.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                  <p className="text-white/45 text-sm leading-relaxed">{pt.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}