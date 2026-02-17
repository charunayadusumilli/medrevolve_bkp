import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const slides = [
  {
    tag: 'GLP-1 Weight Loss',
    headline: 'Lose Weight with\nFDA-Approved GLP-1s',
    sub: 'Semaglutide & Tirzepatide from $99/mo. Real doctors, fast delivery.',
    cta: 'See if you qualify',
    ctaHref: 'Questionnaire',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=90',
    badge: 'Most Popular',
  },
  {
    tag: "Men's Health",
    headline: "Better Performance,\nClinically Proven",
    sub: 'ED treatments, hormone therapy, and hair loss — all online, discreet.',
    cta: 'Get started',
    ctaHref: 'Products?category=mens_health',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=90',
    badge: 'Fast Delivery',
  },
  {
    tag: "Women's Health",
    headline: 'Hormones in Balance,\nLife in Focus',
    sub: 'HRT, fertility support, and wellness therapies tailored for you.',
    cta: 'Explore treatments',
    ctaHref: 'Products?category=womens_health',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=90',
    badge: 'New Treatments',
  },
];

const trustItems = [
  'Trusted by 50,000+ patients',
  'Real, licensed providers',
  'FDA-approved medications',
  'Get started 100% online',
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section className="relative bg-[#0F1A0F] overflow-hidden">
      {/* Trust bar */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B8F5E]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main hero */}
      <div className="relative min-h-[85vh] flex items-center">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.tag}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1A0F]/90 via-[#0F1A0F]/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A6741] text-white text-xs font-semibold mb-5">
                {slide.badge && <span className="bg-white text-[#4A6741] rounded-full px-2 py-0.5 text-[10px] font-bold">{slide.badge}</span>}
                {slide.tag}
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-5" style={{ whiteSpace: 'pre-line' }}>
                {slide.headline}
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">{slide.sub}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={createPageUrl(slide.ctaHref)}>
                  <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 font-bold rounded-full px-8 text-base">
                    {slide.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Consultations')}>
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-full px-8 text-base border border-white/30">
                    Book a consultation
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-white w-8' : 'bg-white/30 w-3'}`}
            />
          ))}
        </div>
      </div>

      {/* Quick category pills */}
      <div className="relative z-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {[
              { name: 'Weight Loss', href: 'Products?category=weight_loss', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=80&q=80' },
              { name: "Men's Health", href: 'Products?category=mens_health', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&q=80' },
              { name: "Women's Health", href: 'Products?category=womens_health', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&q=80' },
              { name: 'Longevity', href: 'Products?category=longevity', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=80&q=80' },
              { name: 'Hair Loss', href: 'Products?category=hair_loss', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&q=80' },
              { name: 'Peptides', href: 'Products?category=peptides', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=80&q=80' },
            ].map((cat) => (
              <Link key={cat.name} to={createPageUrl(cat.href)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F0E8] hover:bg-[#4A6741] hover:text-white text-[#2D3A2D] text-sm font-medium transition-all group">
                <img src={cat.img} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}