import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { JOURNEYS } from './landingData';

export default function JourneyCards() {
  return (
    <section className="py-24 px-6 lg:px-10 bg-[#F6F8F7]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0B8B7A] mb-3">Choose your journey</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#0A1414] tracking-tight">Three clearly labeled paths. No ambiguity.</h2>
          <p className="mt-4 text-gray-500">Every product is classified as Prescription, Research-Use-Only, or Wellness — so you always know exactly what you're getting.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {JOURNEYS.map((j, i) => (
            <motion.div key={j.key} id={`journey-${j.key}`}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col scroll-mt-32">
              <div className="relative h-52 overflow-hidden">
                <img src={j.image} alt={j.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0A1414]">{j.tag}</span>
                <p className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{j.eyebrow}</p>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <j.icon className="w-5 h-5 text-[#0B8B7A]" />
                  <h3 className="text-xl font-semibold text-[#0A1414]">{j.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{j.desc}</p>
                <ul className="space-y-2 mb-7">
                  {j.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#0B8B7A] flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <Link to={j.link} className="mt-auto inline-flex items-center justify-between rounded-full bg-[#0A1414] hover:bg-[#0B8B7A] text-white text-sm font-semibold px-5 py-3 transition-colors">
                  {j.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}