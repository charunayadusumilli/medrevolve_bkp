import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    category: 'Diet Plan',
    tag: 'Nutrition',
    tagColor: '#2D6B4C',
    tagBg: '#E8F5EE',
    title: 'High-Protein GLP-1 Meal Plan',
    subtitle: 'Maximize your semaglutide results with anti-inflammatory foods that keep you full longer.',
    cta: 'View Plan',
    href: 'Programs',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    accent: '#2D6B4C',
  },
  {
    category: 'Workout',
    tag: 'Exercise',
    tagColor: '#1A3A6B',
    tagBg: '#E8EDF5',
    title: '20-Min Fat-Burning Circuit',
    subtitle: 'Low-impact HIIT designed to complement your weight loss protocol and preserve lean muscle.',
    cta: 'Learn More',
    href: 'Programs',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    accent: '#1A3A6B',
  },
  {
    category: 'Education',
    tag: 'How It Works',
    tagColor: '#6B1A4A',
    tagBg: '#F5E8EF',
    title: 'How GLP-1s Rewire Your Hunger',
    subtitle: 'Learn the science behind semaglutide — how it targets brain receptors to reduce cravings.',
    cta: 'Read Guide',
    href: 'HowItWorks',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    accent: '#6B1A4A',
  },
  {
    category: 'Recovery',
    tag: 'Longevity',
    tagColor: '#5C3D1A',
    tagBg: '#F5EFE8',
    title: 'Sleep & Peptide Recovery Protocol',
    subtitle: 'Pair Sermorelin with sleep optimization to boost HGH release and accelerate recovery.',
    cta: 'Explore',
    href: 'Products?category=longevity',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    accent: '#5C3D1A',
  },
  {
    category: 'Recipe',
    tag: 'Meal Prep',
    tagColor: '#2D3A2D',
    tagBg: '#EEF2EE',
    title: '7-Day Anti-Inflammatory Meal Prep',
    subtitle: 'Simple, delicious meals that support hormonal balance and gut health — batch cooked in 2 hours.',
    cta: 'Get Recipes',
    href: 'Programs',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
    accent: '#2D3A2D',
  },
  {
    category: 'Hormone Health',
    tag: 'Education',
    tagColor: '#8B1A1A',
    tagBg: '#F5E8E8',
    title: 'Signs You May Need HRT',
    subtitle: 'Fatigue, weight gain, brain fog — these could be hormone imbalances. Know what to look for.',
    cta: 'Learn More',
    href: 'Products?category=hormone',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    accent: '#8B1A1A',
  },
];

export default function RevolvingContentStrip() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    startTimer();
  };

  const prev = () => go((current - 1 + slides.length) % slides.length);
  const next = () => go((current + 1) % slides.length);

  const slide = slides[current];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div className="py-12 px-6 lg:px-8 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#7A8F7C] mb-1">Wellness Hub</p>
            <h2 className="text-2xl font-semibold text-[#2D3A2D]">Diet Plans · Workouts · Education</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center hover:bg-[#2D3A2D] hover:border-[#2D3A2D] hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="w-9 h-9 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center hover:bg-[#2D3A2D] hover:border-[#2D3A2D] hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Carousel */}
        <div className="relative overflow-hidden rounded-3xl shadow-xl h-[340px] md:h-[300px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col md:flex-row"
            >
              {/* Image Side */}
              <div className="relative md:w-1/2 h-48 md:h-full overflow-hidden flex-shrink-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: slide.tagBg, color: slide.tagColor }}>
                    {slide.tag}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 bg-white flex flex-col justify-center px-8 py-6 md:py-0">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: slide.accent }}>
                  {slide.category}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-[#1A2A1A] mb-3 leading-tight">
                  {slide.title}
                </h3>
                <p className="text-sm text-[#5A6B5A] mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link to={createPageUrl(slide.href)} onClick={() => window.scrollTo({ top: 0 })}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 text-white"
                    style={{ background: slide.accent }}
                  >
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators + thumbnail strip */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`transition-all rounded-full ${i === current ? 'w-8 h-2.5 bg-[#2D3A2D]' : 'w-2.5 h-2.5 bg-[#D1C9B8] hover:bg-[#4A6741]'}`}
            />
          ))}
        </div>

        {/* Mini thumbnail row */}
        <div className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide pb-1">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 transition-all text-left ${
                i === current ? 'border-[#2D3A2D] bg-white shadow-md' : 'border-transparent bg-white/60 hover:bg-white'
              }`}
            >
              <img src={s.image} alt={s.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" loading="lazy" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7A8F7C] truncate">{s.tag}</p>
                <p className="text-xs font-semibold text-[#2D3A2D] truncate max-w-[100px]">{s.title.split(' ').slice(0, 3).join(' ')}…</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}