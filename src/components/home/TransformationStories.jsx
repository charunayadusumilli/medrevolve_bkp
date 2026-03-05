import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    age: 38,
    location: 'Austin, TX',
    program: 'Weight Loss — Semaglutide',
    result: 'Lost 34 lbs in 4 months',
    quote: 'I had tried everything for years. MedRevolve was the first time someone actually listened, built a plan around my life, and the results followed. I feel like myself again.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=90&fm=webp&sat=20',
    bg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fm=webp&sat=20',
    stars: 5,
  },
  {
    name: 'James R.',
    age: 44,
    location: 'Miami, FL',
    program: "Men's Health — Testosterone",
    result: 'Energy levels transformed',
    quote: 'The process was discreet, fast, and genuinely personal. Within 6 weeks my energy, focus and drive were back. This is the platform I wish existed 10 years ago.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=90&fm=webp',
    bg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&fm=webp',
    stars: 5,
  },
  {
    name: 'Elena K.',
    age: 52,
    location: 'New York, NY',
    program: 'Longevity — NAD+ + Sermorelin',
    result: 'Sleeping 8 hrs, recovering faster',
    quote: 'Peptide protocols changed how I age. My recovery is sharper, my mind is clearer. MedRevolve treats you like a whole person, not a transaction.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=90&fm=webp&sat=20',
    bg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&fm=webp&sat=20',
    stars: 5,
  },
];

export default function TransformationStories() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A75E] mb-3">Real Results</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Transformation<br />
            <span className="font-semibold">Stories.</span>
          </h2>
          <p className="text-white/40 text-base max-w-md mx-auto">
            Patients who decided precision wellness was worth it.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative rounded-2xl overflow-hidden flex flex-col border border-white/5 hover:border-[#C6A75E]/30 transition-all duration-300 group"
              style={{ minHeight: 400 }}
            >
              {/* Background lifestyle photo */}
              <div className="absolute inset-0">
                <img src={t.bg} alt="" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-7 pt-16">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-[#C6A75E] text-[#C6A75E]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/85 text-sm leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>

                {/* Result badge */}
                <div className="bg-[#C6A75E]/15 border border-[#C6A75E]/30 rounded-xl px-3 py-2 mb-4 backdrop-blur-sm">
                  <p className="text-[#C6A75E] text-xs font-bold">{t.result}</p>
                  <p className="text-white/50 text-[11px]">{t.program}</p>
                </div>

                {/* Person */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-[#C6A75E]/40"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}, {t.age}</p>
                    <p className="text-white/40 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { value: '50K+', label: 'Patients Served' },
            { value: '200+', label: 'Licensed Providers' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '24-48h', label: 'Discreet Delivery' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-light text-white mb-1">{s.value}</p>
              <p className="text-white/35 text-xs uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}