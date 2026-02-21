import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCT_ILLUSTRATIONS, PRODUCT_BG } from './ProductIllustration';

const products = [
  { id: 1, name: 'Semaglutide', category: 'Weight Loss', description: 'Lose up to 15% body weight with once-weekly dosing', tag: 'Best Seller' },
  { id: 2, name: 'Tirzepatide', category: 'Weight Loss', description: 'Dual-action GLP-1 for maximum results', tag: 'Strongest' },
  { id: 3, name: 'Sermorelin', category: 'Longevity', description: 'Sleep deeper, recover faster, feel younger', tag: null },
  { id: 4, name: 'Glutathione', category: 'Longevity', description: 'Radiant skin and cellular health from within', tag: 'Glow' },
  { id: 5, name: 'NAD+ Injection', category: 'Longevity', description: 'All-day energy and sharp mental clarity', tag: null },
  { id: 6, name: 'Testosterone Therapy', category: "Men's Health", description: 'Reclaim your drive, strength and confidence', tag: null },
  { id: 7, name: 'Semaglutide Drops', category: 'Weight Loss', description: 'Same results — zero injections required', tag: 'Needle-Free' },
  { id: 8, name: 'Synapsin Spray', category: 'Longevity', description: 'Stay sharp and focused at any age', tag: null },
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
  const Illustration = PRODUCT_ILLUSTRATIONS[product.id];
  const bg = PRODUCT_BG[product.id] || ['#E8F0E4', '#D4E8CC'];

  return (
    <motion.div 
      className="w-72 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
      whileHover={{ y: -8 }}
    >
      <div
        className="relative aspect-square overflow-hidden flex items-center justify-center p-6"
        style={{ background: `linear-gradient(135deg, ${bg[0]} 0%, ${bg[1]} 100%)` }}
      >
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          {Illustration && <Illustration />}
        </div>
        {product.tag && (
          <span className="absolute top-4 left-4 bg-[#2D3A2D] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
            {product.tag}
          </span>
        )}
        {/* MR watermark */}
        <span className="absolute bottom-3 right-4 text-[10px] font-black text-black/10 tracking-tighter select-none">MR</span>
      </div>
      <div className="p-6">
        <span className="text-xs font-medium text-[#4A6741] uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-medium text-[#2D3A2D] mt-2 group-hover:text-[#4A6741] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[#5A6B5A] mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center text-[#4A6741] text-sm font-medium group-hover:gap-2 transition-all">
          Learn More
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}