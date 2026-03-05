import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Lock, ChevronRight, Sparkles, Zap, Heart, Scale, HeartPulse, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RevolvingContentStrip from '@/components/home/RevolvingContentStrip';

const categories = [
  { id: 'weight', name: 'Weight Loss', icon: Scale, emoji: '⚖️', desc: 'GLP-1 programs, semaglutide, tirzepatide', color: '#2D3A2D', bg: '#F0F4EF', available: true, href: 'Products?category=weight_loss' },
  { id: 'longevity', name: 'Longevity', icon: Heart, emoji: '🧬', desc: 'Peptides, NAD+, anti-aging protocols', color: '#3D5636', bg: '#EDF0EE', available: true, href: 'Products?category=longevity' },
  { id: 'hormone', name: 'Hormones', icon: Sparkles, emoji: '✨', desc: 'Balance & optimization', color: '#3D3656', bg: '#EEEAF0', available: true, href: 'Products?category=hormone' },
  { id: 'mens', name: "Men's Health", icon: Zap, emoji: '⚡', desc: 'TRT, ED, performance', color: '#1A3A5C', bg: '#E8EDF0', available: true, href: 'Products?category=mens_health' },
  { id: 'womens', name: "Women's Health", icon: HeartPulse, emoji: '🌸', desc: 'HRT, wellness, balance', color: '#5C1A4A', bg: '#F0EBF0', available: true, href: 'Products?category=womens_health' },
  { id: 'hair', name: 'Hair & Skin', icon: Brain, emoji: '💆', desc: 'Coming soon', color: '#5C4A1A', bg: '#F0EEEA', available: false, href: '' },
];

// Featured products for each category
const featuredByCategory = {
  weight: [
    { id: 1, name: 'Semaglutide', tag: 'Most Popular', price: 299, tagColor: '#2D3A2D', promise: 'Lose up to 15% body weight', form: 'Auto-Injector Pen', customers: '12,400+', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
    { id: 2, name: 'Tirzepatide', tag: 'Strongest', price: 399, tagColor: '#4C3D6B', promise: 'Up to 22% weight loss', form: 'Auto-Injector Pen', customers: '8,200+', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80' },
    { id: 3, name: 'Oral Drops', tag: 'Needle-Free', price: 249, tagColor: '#2D6B4C', promise: 'No injections required', form: 'Oral Drops', customers: '6,800+', image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80' },
  ],
  longevity: [
    { id: 6, name: 'Sermorelin', tag: 'Anti-Aging', price: 199, tagColor: '#9B1A1A', promise: 'Deep sleep, rapid recovery', form: 'Injectable', customers: '7,300+', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80' },
    { id: 8, name: 'NAD+ Injection', tag: 'Brain & Body', price: 179, tagColor: '#1A6B2D', promise: 'All-day energy & clarity', form: 'Injectable', customers: '5,400+', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80' },
    { id: 9, name: 'Glutathione', tag: 'Glow', price: 149, tagColor: '#8B1A6B', promise: 'Radiant skin from within', form: 'Injectable', customers: '9,600+', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
  ],
  hormone: [
    { id: 11, name: 'Testosterone Cypionate', tag: 'For Men', price: 199, tagColor: '#1A3A6B', promise: 'Reclaim energy & strength', form: 'Injectable', customers: '11,100+', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
    { id: 12, name: 'Estradiol + Progesterone', tag: 'For Women', price: 179, tagColor: '#6B1A6B', promise: 'Feel like yourself again', form: 'Cream', customers: '8,900+', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
    { id: 13, name: 'Thyroid T3/T4', tag: 'Metabolism', price: 149, tagColor: '#1A6B6B', promise: 'Steady energy, healthy weight', form: 'Capsule', customers: '6,200+', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80' },
  ],
  mens: [
    { id: 15, name: 'Sildenafil (ED)', tag: 'ED Treatment', price: 89, tagColor: '#1A3A6B', promise: 'Confidence when it counts', form: 'Tablet', customers: '14,600+', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
    { id: 17, name: 'Finasteride + Minoxidil', tag: 'Hair Rx', price: 49, tagColor: '#1A6B3A', promise: 'Stop hair loss before it stops you', form: 'Topical', customers: '18,400+', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { id: 18, name: 'T + Sema Stack', tag: 'Power Stack', price: 449, tagColor: '#1A1A6B', promise: 'Lose fat. Build muscle.', form: 'Injectable', customers: '3,600+', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' },
  ],
  womens: [
    { id: 19, name: 'Semaglutide for Women', tag: 'Most Popular', price: 299, tagColor: '#6B1A4A', promise: 'Designed for her', form: 'Injectable', customers: '9,800+', image: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&q=80' },
    { id: 20, name: 'Estriol Vaginal Cream', tag: 'Feminine Health', price: 99, tagColor: '#8B1A6B', promise: 'Restore comfort & confidence', form: 'Cream', customers: '5,200+', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
    { id: 22, name: 'Spironolactone', tag: 'Skin + Hair', price: 59, tagColor: '#8B1A3A', promise: 'Clear skin. Fuller hair.', form: 'Tablet', customers: '7,100+', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80' },
  ],
};

function MiniProductCard({ product, categoryHref }) {
  return (
    <Link to={createPageUrl(`ProductDetail?id=${product.id}`)} onClick={() => window.scrollTo({ top: 0 })}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
      >
        <div className="aspect-[3/2] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: product.tagColor }}>{product.tag}</span>
            <span className="text-[10px] text-gray-400">{product.form}</span>
          </div>
          <h4 className="font-semibold text-[#1A2A1A] text-sm mt-2 mb-1">{product.name}</h4>
          <p className="text-xs text-[#5A6B5A] mb-3">{product.promise}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#1A2A1A]">from ${product.price}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
            <ChevronRight className="w-4 h-4 text-[#4A6741]" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomeProductsTab() {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  const activeCat = categories.find(c => c.id === activeCategory);
  const products = featuredByCategory[activeCategory] || [];

  return (
    <div className="bg-white">
      <RevolvingContentStrip />
      <div className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <motion.div className="mb-10 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#7A8F7C] mb-2">Start Today</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#0F172A] mb-3">
            What do you want to <span className="font-semibold">feel better</span> at?
          </h2>
          <p className="text-sm text-[#5A6B5A] max-w-md mx-auto">
            Select a category to see physician-prescribed treatments. Every product requires a quick consultation.
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => cat.available && setActiveCategory(isActive ? null : cat.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center
                  ${isActive ? 'border-[#2D3A2D] bg-[#2D3A2D] text-white shadow-xl' : 'border-transparent bg-[#F8F6F2] hover:border-[#2D3A2D]/30 text-[#2D3A2D]'}
                  ${!cat.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                whileHover={cat.available ? { y: -4 } : {}}
                whileTap={cat.available ? { scale: 0.97 } : {}}
              >
                {!cat.available && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-3 h-3 text-gray-400" />
                  </div>
                )}
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-semibold text-sm leading-tight">{cat.name}</span>
                <span className={`text-[10px] leading-snug ${isActive ? 'text-white/70' : 'text-[#5A6B5A]'}`}>{cat.available ? cat.desc : 'Coming soon'}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Product Reveal */}
        <AnimatePresence mode="wait">
          {activeCategory && products.length > 0 && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {/* Workflow Banner */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-[#F5F0E8] rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-[#2D3A2D] font-medium flex-1">
                  <span className="w-6 h-6 rounded-full bg-[#4A6741] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  Choose product
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                  Quick consult
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                  Rx delivered
                </div>
                <Link to={createPageUrl(activeCat.href)} onClick={() => window.scrollTo({ top: 0 })}>
                  <Button size="sm" variant="outline" className="rounded-full border-[#2D3A2D] text-[#2D3A2D] hover:bg-[#2D3A2D] hover:text-white text-xs flex-shrink-0">
                    See all {activeCat.name}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <MiniProductCard product={product} categoryHref={activeCat.href} />
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                <Link to={createPageUrl('VisitTypeSelector')} onClick={() => window.scrollTo({ top: 0 })}>
                  <Button className="bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full px-8">
                    Browse All Treatments
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Consultations')} onClick={() => window.scrollTo({ top: 0 })}>
                  <Button variant="outline" className="rounded-full border-[#2D3A2D] text-[#2D3A2D] hover:bg-[#F5F0E8] px-8">
                    Book a Consultation First
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {!activeCategory && (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-[#8A9A8A] text-sm"
            >
              ↑ Select a category above to see treatments
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}