import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const slides = [
  {
    tag: 'Weight Loss',
    headline: 'Finally, A Body\nYou Love.',
    sub: 'GLP-1 programs, personalized nutrition, and 1:1 coaching — delivered to your door.',
    cta: 'Start My Assessment',
    ctaHref: 'Questionnaire',
    image: 'https://images.unsplash.com/photo-1609899464926-da5a3b1d460f?w=1600&q=95',
    accent: '#A8C99B',
  },
  {
    tag: "Men's Health",
    headline: 'Built For\nThe Modern Man.',
    sub: 'Testosterone, vitality, and performance protocols — prescribed by real doctors.',
    cta: 'Get My Plan',
    ctaHref: 'Products?category=mens_health',
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=1600&q=95',
    accent: '#C9B99A',
  },
  {
    tag: "Women's Wellness",
    headline: 'Feel Like\nYourself Again.',
    sub: 'Hormone balance, weight loss, and longevity — designed around your biology.',
    cta: 'Discover My Plan',
    ctaHref: 'Products?category=womens_health',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=95',
    accent: '#D4A8C9',
  },
  {
    tag: 'Longevity',
    headline: 'Perform At\nEvery Age.',
    sub: 'Peptide protocols and longevity programs backed by cutting-edge science.',
    cta: 'Explore Longevity',
    ctaHref: 'Products?category=longevity',
    image: 'https://images.unsplash.com/photo-1590253230532-a67f6bc61b9e?w=1600&q=95',
    accent: '#A8BFC9',
  },
];

const categories = [
  { name: 'Weight Loss', href: 'Products?category=weight_loss', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=80' },
  { name: "Men's Health", href: 'Products?category=mens_health', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=80&q=80' },
  { name: "Women's Health", href: 'Products?category=womens_health', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&q=80' },
  { name: 'Longevity', href: 'Products?category=longevity', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=80&q=80' },
  { name: 'Hair Loss', href: 'Products?category=hair_loss', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&q=80' },
  { name: 'Peptides', href: 'Products?category=peptides', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=80&q=80' },
];

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
    <section className="relative bg-[#080F08] overflow-hidden">
      {/* Full-screen hero */}
      <div className="relative min-h-screen flex flex-col">

        {/* Background images with crossfade */}
        {slides.map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{ opacity: i === activeSlide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <img src={s.image} alt={s.tag} className="w-full h-full object-cover object-center" />
            {/* Rich multi-layer gradient for luxury depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            {/* Subtle color tint per slide */}
            <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 80% 50%, ${s.accent}55, transparent 70%)` }} />
          </motion.div>
        ))}

        {/* Top content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-24 pb-32">
            <div className="max-w-3xl">

              {/* Slide tag pill */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tag-${activeSlide}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45 }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/60 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-white/40" />
                    {slide.tag}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`h-${activeSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className="text-6xl lg:text-8xl font-black text-white leading-[1.02] tracking-tight mb-6"
                  style={{ whiteSpace: 'pre-line', fontVariantNumeric: 'tabular-nums' }}
                >
                  {slide.headline}
                </motion.h1>
              </AnimatePresence>

              {/* Subtext */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${activeSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl text-white/60 mb-10 max-w-xl leading-relaxed font-light"
                >
                  {slide.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cta-${activeSlide}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Link to={createPageUrl(slide.ctaHref)}>
                    <Button size="lg"
                      className="bg-white text-[#0F1A0F] hover:bg-white/90 font-bold rounded-full px-8 text-base h-14 shadow-2xl shadow-black/40"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      {slide.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl('Consultations')}>
                    <Button size="lg" variant="ghost"
                      className="text-white hover:bg-white/10 rounded-full px-8 text-base h-14 border border-white/25 backdrop-blur-sm"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      Book a consultation
                    </Button>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom controls & stats bar */}
        <div className="relative z-10 border-t border-white/10 backdrop-blur-md bg-black/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-8">
              {[
                { value: '50K+', label: 'Patients Served' },
                { value: '200+', label: 'Licensed Providers' },
                { value: '4.9★', label: 'Patient Rating' },
              ].map((stat) => (
                <div key={stat.value} className="text-center">
                  <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPrevSlide(activeSlide); setActiveSlide(i); }}
                  className={`transition-all duration-500 rounded-full ${
                    i === activeSlide ? 'bg-white w-8 h-1' : 'bg-white/25 w-2 h-1 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick category pills */}
      <div className="bg-[#0F1A0F] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link key={cat.name} to={createPageUrl(cat.href)}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all">
                <img src={cat.img} alt={cat.name} className="w-5 h-5 rounded-full object-cover opacity-80" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}