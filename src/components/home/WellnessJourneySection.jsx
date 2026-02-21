import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

const journeys = [
  {
    number: '01',
    category: 'Weight Loss',
    headline: 'Recalibrate\nYour Metabolism.',
    body: 'GLP-1 and dual-action protocols clinically proven to reduce body weight by up to 22%. Physician-supervised, structured, and intentional.',
    cta: 'Explore Weight Programs',
    href: 'Products?category=weight_loss',
    // Woman in high-end gym, moody lighting, kettlebell — aspirational weight loss
    image: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=900&q=90',
    pill: 'Most Popular',
  },
  {
    number: '02',
    category: 'Longevity & Peptides',
    headline: 'Perform At\nEvery Age.',
    body: 'NAD+, Sermorelin, Glutathione — precision peptide protocols backed by cutting-edge cellular science. Age on your terms.',
    cta: 'Explore Longevity',
    href: 'Products?category=longevity',
    // Luxury spa / wellness center pool, editorial serene
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=90',
    pill: 'Science-Backed',
  },
  {
    number: '03',
    category: "Men's Health",
    headline: 'Built For\nThe Modern Man.',
    body: 'Testosterone optimization, performance protocols, and vitality programs — prescribed by real physicians, delivered discreetly.',
    cta: "Explore Men's Health",
    href: 'Products?category=mens_health',
    // Muscular man lifting in dramatic dark luxury gym — powerful, raw, aspirational
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=90',
    pill: 'High Performance',
  },
  {
    number: '04',
    category: "Women's Wellness",
    headline: 'Feel Like\nYourself Again.',
    body: 'Hormone balance, weight loss, and longevity — designed entirely around your biology. Modern medicine meeting modern woman.',
    cta: "Explore Women's Health",
    href: 'Products?category=womens_health',
    // Elegant woman yoga in luxury studio, natural light, premium
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=90',
    pill: 'Personalized',
  },
];

export default function WellnessJourneySection() {
  return (
    <section className="bg-[#F8F6F2] py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7A8F7C] mb-3">Your Transformation Paths</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#0F172A] leading-tight">
            Choose Your<br />
            <span className="font-semibold text-[#0F172A]">Wellness Journey.</span>
          </h2>
        </motion.div>

        {/* Journey Cards */}
        <div className="space-y-6">
          {journeys.map((j, index) => (
            <motion.div
              key={j.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(j.href)} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-[#D1D5DB]/50">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-80 lg:w-96 flex-shrink-0 h-64 md:h-auto overflow-hidden relative">
                      <img
                        src={j.image}
                        alt={j.category}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:bg-gradient-to-l md:from-transparent md:to-white/5" />
                      {/* Number overlay */}
                      <div className="absolute top-4 left-4">
                        <span className="text-white/30 font-black text-6xl leading-none select-none">{j.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A8F7C]">{j.category}</span>
                        <span className="text-[10px] font-semibold bg-[#0F172A] text-white px-2.5 py-0.5 rounded-full tracking-wide">{j.pill}</span>
                      </div>
                      <h3
                        className="text-3xl lg:text-4xl font-light text-[#0F172A] mb-4 leading-tight"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {j.headline}
                      </h3>
                      <p className="text-[#1E293B]/60 text-base leading-relaxed mb-6 max-w-md">
                        {j.body}
                      </p>
                      <div className="flex items-center gap-2 text-[#0F172A] font-semibold text-sm group-hover:gap-3 transition-all">
                        {j.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
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