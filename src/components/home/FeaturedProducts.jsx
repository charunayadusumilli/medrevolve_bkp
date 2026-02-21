import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Premium lifestyle imagery — Hims/Ro style, no clinical drug shots
const products = [
  {
    id: 1, name: 'Semaglutide', category: 'Weight Loss',
    description: 'Lose up to 15% body weight with once-weekly dosing',
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=85',
    bg: '#F0F4EF'
  },
  {
    id: 2, name: 'Tirzepatide', category: 'Weight Loss',
    description: 'Dual-action GLP-1 for maximum results',
    tag: 'Strongest',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=85',
    bg: '#EEF0F4'
  },
  {
    id: 3, name: 'Sermorelin', category: 'Longevity',
    description: 'Sleep deeper, recover faster, feel younger',
    tag: null,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=85',
    bg: '#F4F0EE'
  },
  {
    id: 4, name: 'Glutathione', category: 'Longevity',
    description: 'Radiant skin and cellular health from within',
    tag: 'Glow',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=85',
    bg: '#F4EEF0'
  },
  {
    id: 5, name: 'NAD+ Injection', category: 'Longevity',
    description: 'All-day energy and sharp mental clarity',
    tag: null,
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=85',
    bg: '#EEF4F2'
  },
  {
    id: 6, name: 'Testosterone Therapy', category: "Men's Health",
    description: 'Reclaim your drive, strength and confidence',
    tag: null,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=85',
    bg: '#EEEEF4'
  },
  {
    id: 7, name: 'Semaglutide Drops', category: 'Weight Loss',
    description: 'Same results — zero injections required',
    tag: 'Needle-Free',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=85',
    bg: '#EEF4EE'
  },
  {
    id: 8, name: 'Synapsin Spray', category: 'Longevity',
    description: 'Stay sharp and focused at any age',
    tag: null,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=85',
    bg: '#F4F2EE'
  },
];

export default function FeaturedProducts() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
              Featured <span className="font-medium text-[#4A6741]">Products</span>
            </h2>
            <p className="text-lg text-[#5A6B5A] max-w-xl">
              Discover our most popular wellness treatments, backed by science
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full border-[#4A6741]/20 hover:bg-[#4A6741]/10"
            >
              <ChevronLeft className="w-5 h-5 text-[#4A6741]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full border-[#4A6741]/20 hover:bg-[#4A6741]/10"
            >
              <ChevronRight className="w-5 h-5 text-[#4A6741]" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 lg:px-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
                <ProductCard product={product} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 text-center">
        <Link to={createPageUrl('Products')}>
          <Button 
            variant="outline"
            size="lg"
            className="rounded-full border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741] hover:text-white px-8"
          >
            View All Products
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <motion.div
      className="w-64 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-[#D1D5DB]/30"
      whileHover={{ y: -6 }}
    >
      {/* Lifestyle image — no drug shots */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: product.bg }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-600 group-hover:scale-[1.06]"
        />
        {/* Subtle dark overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-widest uppercase">
            {product.tag}
          </span>
        )}
        {/* MR branding — subtle, luxury */}
        <span className="absolute bottom-2.5 right-3 text-[11px] font-black text-white/20 tracking-tighter select-none font-serif">MR</span>
      </div>

      <div className="p-5">
        <p className="text-[10px] font-bold text-[#7A8F7C] uppercase tracking-[0.18em] mb-1">{product.category}</p>
        <h3 className="text-base font-semibold text-[#0F172A] mb-1.5 group-hover:text-[#4A6741] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[#1E293B]/55 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center gap-1 text-[#0F172A] text-sm font-semibold group-hover:gap-2 transition-all">
          Learn More
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}