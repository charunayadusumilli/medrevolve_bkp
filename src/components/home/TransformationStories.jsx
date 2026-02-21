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
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    stars: 5,
  },
  {
    name: 'James R.',
    age: 44,
    location: 'Miami, FL',
    program: "Men's Health — Testosterone",
    result: 'Energy levels transformed',
    quote: 'The process was discreet, fast, and genuinely personal. Within 6 weeks my energy, focus and drive were back. This is the platform I wish existed 10 years ago.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80',
    stars: 5,
  },
  {
    name: 'Elena K.',
    age: 52,
    location: 'New York, NY',
    program: 'Longevity — NAD+ + Sermorelin',
    result: 'Sleeping 8 hrs, recovering faster',
    quote: 'Peptide protocols changed how I age. My recovery is sharper, my mind is clearer. MedRevolve treats you like a whole person, not a transaction.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&q=80',
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
              className="bg-[#1E293B] rounded-2xl p-7 flex flex-col border border-white/5 hover:border-[#C6A75E]/20 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.stars)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-[#C6A75E] text-[#C6A75E]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6 italic">
                "{t.quote}"
              </p>

              {/* Result badge */}
              <div className="bg-[#C6A75E]/10 border border-[#C6A75E]/20 rounded-xl px-3 py-2 mb-5">
                <p className="text-[#C6A75E] text-xs font-semibold">{t.result}</p>
                <p className="text-white/40 text-[11px]">{t.program}</p>
              </div>

              {/* Person */}
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover object-center"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}, {t.age}</p>
                  <p className="text-white/35 text-xs">{t.location}</p>
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