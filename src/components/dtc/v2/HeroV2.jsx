import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { V2_IMAGES, GOALS } from './brand';

export default function HeroV2() {
  return (
    <section className="bg-dtc-page">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-10 pb-14 lg:pt-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-4 h-4 fill-mr-ink text-dtc-text" />)}</div>
            <span className="text-sm text-dtc-text/70">Loved by members nationwide</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl leading-[0.95] text-dtc-text">
            Feel like<br /><em className="text-mr-forest">yourself</em> again.
          </h1>
          <p className="mt-6 text-lg text-dtc-text/70 max-w-md">
            Clinician-guided care for weight, hormones and longevity — from a 5-minute online visit to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Link key={g.id} to={`/start?goal=${g.id}`}
                className="rounded-full border border-dtc-text/15 bg-dtc-surface/70 hover:bg-mr-ink hover:text-white px-4 py-2 text-sm font-medium text-dtc-text transition-colors">
                {g.label}
              </Link>
            ))}
          </div>
          <Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-full bg-mr-ink hover:bg-mr-forest text-white font-medium px-8 py-4 transition-colors">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-xs text-dtc-text/65">No membership fee. Prescriptions only if a provider decides it's right for you.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          className="relative">
          <div className="rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[4/5]">
            <img src={V2_IMAGES.heroMan} alt="Man relaxing after a morning workout" fetchpriority="high" className="w-full h-full object-cover object-[70%_center]" />
          </div>
          <div className="absolute -bottom-6 -left-4 sm:left-6 bg-dtc-surface rounded-2xl shadow-xl p-3 flex items-center gap-3 max-w-[260px]">
            <img src={V2_IMAGES.pen} alt="" className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-dtc-text">Shipped in 2–3 days</p>
              <p className="text-xs text-dtc-text/75">Discreet, temperature-safe box</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}