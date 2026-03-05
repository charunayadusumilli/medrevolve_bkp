import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ads = [
  {
    id: 'weight-loss',
    label: 'Weight Loss',
    tag: 'GLP-1 Programs',
    headline: 'Lose 15–35 lbs in 4 months',
    sub: 'Semaglutide + personalized nutrition, prescribed by real doctors.',
    cta: 'Start My Journey',
    href: 'Questionnaire',
    // Looping Unsplash lifestyle video via their mp4 endpoint
    video: 'https://videos.pexels.com/video-files/4067013/4067013-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=85&fm=webp&sat=20&bright=10',
    accent: '#A8C99B',
  },
  {
    id: 'longevity',
    label: 'Longevity',
    tag: 'Live Longer. Live Better.',
    headline: 'Age on your own terms',
    sub: 'NAD+, peptides, and longevity protocols backed by cutting-edge science.',
    cta: 'Explore Longevity',
    href: 'Programs',
    video: 'https://videos.pexels.com/video-files/5699277/5699277-hd_1920_1080_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=85&fm=webp&sat=20&bright=10',
    accent: '#A8BFC9',
  },
  {
    id: 'mens-health',
    label: "Men's Health",
    tag: 'Performance & Vitality',
    headline: 'Built different. Optimized.',
    sub: 'Testosterone, metabolic health, and energy — prescribed, delivered, supported.',
    cta: "Start Men's Program",
    href: 'Programs',
    video: 'https://videos.pexels.com/video-files/4534839/4534839-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=85&fm=webp',
    accent: '#C9B99A',
  },
  {
    id: 'womens-health',
    label: "Women's Health",
    tag: 'Hormones & Wellness',
    headline: 'Your biology. Your plan.',
    sub: 'Hormone balance, weight management, and longevity designed for women.',
    cta: "Start Women's Program",
    href: 'Programs',
    video: 'https://videos.pexels.com/video-files/6827321/6827321-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=85&fm=webp',
    accent: '#D4A8C9',
  },
];

function AdSlide({ ad, isActive }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(v => !v);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
      else { videoRef.current.pause(); setPlaying(false); }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        src={ad.video}
        poster={ad.poster}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 24 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <span className="inline-block text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: `${ad.accent}30`, color: ad.accent, border: `1px solid ${ad.accent}50` }}>
            {ad.tag}
          </span>
          <h3 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
            {ad.headline}
          </h3>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed mb-6">{ad.sub}</p>
          <Link to={createPageUrl(ad.href)} onClick={() => window.scrollTo({ top: 0 })}>
            <button className="px-6 py-3 font-bold text-sm text-black rounded-none transition-all hover:opacity-90"
              style={{ background: ad.accent }}>
              {ad.cta} →
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all">
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button onClick={toggleMute} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all">
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Label pill */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
          {ad.label}
        </span>
      </div>
    </div>
  );
}

export default function VideoAdStrip() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-black py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/30 mb-2">Health Programs</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Your Journey Starts Here
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            {ads.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`transition-all duration-300 h-0.5 rounded-full ${i === active ? 'w-8 bg-white' : 'w-3 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Main featured ad + side reel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main feature */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ height: 480 }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} className="w-full h-full"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <AdSlide ad={ads[active]} isActive={true} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side thumbnails */}
          <div className="flex lg:flex-col gap-3">
            {ads.map((ad, i) => (
              <button key={ad.id} onClick={() => setActive(i)}
                className={`relative flex-1 rounded-xl overflow-hidden transition-all duration-300 ${i === active ? 'ring-2 ring-white/60' : 'opacity-50 hover:opacity-80'}`}
                style={{ minHeight: 100 }}>
                <img src={ad.poster} alt={ad.label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-2 left-3">
                  <p className="text-white text-xs font-bold">{ad.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}