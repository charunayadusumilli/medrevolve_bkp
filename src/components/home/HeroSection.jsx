import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const slides = [
  {
    tag: 'Weight Loss',
    headline: 'FEEL\nBETTER.',
    sub: 'GLP-1 programs, personalized nutrition, and 1:1 coaching — delivered to your door.',
    cta: 'Start My Assessment',
    ctaHref: 'Questionnaire',
    image: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=1200&q=80&fm=webp',
    accent: '#A8C99B',
  },
  {
    tag: "Men's Health",
    headline: 'BUILT\nDIFFERENT.',
    sub: 'Testosterone, vitality, and performance protocols — prescribed by real doctors.',
    cta: 'Get My Plan',
    ctaHref: 'Products?category=mens_health',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80&fm=webp',
    accent: '#C9B99A',
  },
  {
    tag: "Women's Wellness",
    headline: 'YOUR\nBIOLOGY.',
    sub: 'Hormone balance, weight loss, and longevity — designed around your biology.',
    cta: 'Discover My Plan',
    ctaHref: 'Products?category=womens_health',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80&fm=webp',
    accent: '#D4A8C9',
  },
  {
    tag: 'Longevity',
    headline: 'LIVE\nLONGER.',
    sub: 'Longevity protocols and physician-prescribed wellness programs backed by science.',
    cta: 'Explore Longevity',
    ctaHref: 'Products?category=longevity',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&fm=webp',
    accent: '#A8BFC9',
  },
];

const categories = [
  { name: 'Weight Loss', href: 'Products?category=weight_loss', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&q=80' },
  { name: "Men's Health", href: 'Products?category=mens_health', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&q=80' },
  { name: "Women's Health", href: 'Products?category=womens_health', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
  { name: 'Longevity', href: 'Products?category=longevity', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=80&q=80' },
  { name: 'Hair Loss', href: 'Products?category=hair_loss', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&q=80' },
  { name: 'Longevity', href: 'Products?category=longevity', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=80' },
];

// MR Monogram SVG — luxury geometric mark
function MRMark({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.08"/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="serif" letterSpacing="-1">MR</text>
    </svg>
  );
}

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlide(activeSlide);
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const slide = slides[activeSlide];

  return (
    <section className="relative bg-black overflow-hidden">
      {/* Full-viewport hero — NDStudio style: edge-to-edge, full black, massive type */}
      <div className="relative min-h-screen flex flex-col">

        {/* Background images with crossfade — slightly dimmer for editorial look */}
        {slides.map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{ opacity: i === activeSlide ? 1 : 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            <img src={s.image} alt={s.tag} className="w-full h-full object-cover object-center" loading={i === 0 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : 'low'} />
            {/* Heavy dark overlay for editorial contrast */}
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          </motion.div>
        ))}

        {/* Main content — NDStudio: text left-aligned bottom-anchored large */}
        <div className="relative z-10 flex-1 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 pt-32">

            {/* Eyebrow label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${activeSlide}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40">
                  {slide.tag}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Headline — massive, bold, editorial like NDStudio */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h-${activeSlide}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-white leading-[0.92] tracking-tighter mb-8"
                style={{
                  whiteSpace: 'pre-line',
                  fontSize: 'clamp(4rem, 12vw, 10rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                {slide.headline}
              </motion.h1>
            </AnimatePresence>

            {/* Bottom row: sub + CTAs side by side */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`bottom-${activeSlide}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
              >
                <p className="text-base text-white/50 max-w-sm leading-relaxed font-light">
                  {slide.sub}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <Link to={createPageUrl(slide.ctaHref)}>
                    <Button
                      className="bg-white text-black hover:bg-white/90 font-bold text-sm px-7 h-12 rounded-none tracking-wide"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      {slide.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl('Consultations')}>
                    <Button variant="ghost"
                      className="text-white hover:bg-white/10 text-sm px-7 h-12 rounded-none border border-white/20 tracking-wide"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      Book a consultation
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom bar — minimal stats + slide dots */}
        <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              {[
                { value: '50K+', label: 'Patients' },
                { value: '200+', label: 'Providers' },
                { value: '4.9★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.value} className="flex items-baseline gap-1.5">
                  <p className="text-white font-bold text-sm leading-none">{stat.value}</p>
                  <p className="text-white/30 text-[11px]">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPrevSlide(activeSlide); setActiveSlide(i); }}
                  className={`transition-all duration-500 ${
                    i === activeSlide ? 'bg-white w-6 h-0.5' : 'bg-white/25 w-2 h-0.5 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category strip — clean dark bar */}
      <div className="bg-black border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide divide-x divide-white/10">
            {categories.map((cat) => (
              <Link key={cat.name} to={createPageUrl(cat.href)}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex-shrink-0 flex items-center gap-2.5 px-6 py-4 text-white/40 hover:text-white text-xs font-semibold tracking-widest uppercase transition-all hover:bg-white/5">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}