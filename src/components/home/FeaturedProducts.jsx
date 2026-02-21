import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import RotatingProductCard from '@/components/product/RotatingProductCard';

// Premium products with MR branding and professional pharmaceutical visuals
const products = [
  {
    id: 1, 
    name: 'Semaglutide', 
    category: 'Weight Loss',
    description: 'Lose up to 15% body weight with once-weekly dosing',
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=85',
    gradient: ['#2D3A2D', '#4A6741'],
    bg: '#F0F4EF'
  },
  {
    id: 2, 
    name: 'Tirzepatide', 
    category: 'Weight Loss',
    description: 'Dual-action GLP-1 for maximum results',
    tag: 'Strongest',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=85',
    gradient: ['#4C3D6B', '#6B4D8B'],
    bg: '#EEF0F4'
  },
  {
    id: 3, 
    name: 'Sermorelin', 
    category: 'Longevity',
    description: 'Sleep deeper, recover faster, feel younger',
    tag: 'Anti-Aging',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&q=85',
    gradient: ['#9B1A1A', '#B43030'],
    bg: '#F4F0EE'
  },
  {
    id: 4, 
    name: 'Glutathione', 
    category: 'Longevity',
    description: 'Radiant skin and cellular health from within',
    tag: 'Glow',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85',
    gradient: ['#8B1A6B', '#B43090'],
    bg: '#F4EEF0'
  },
  {
    id: 5, 
    name: 'NAD+ Injection', 
    category: 'Longevity',
    description: 'All-day energy and sharp mental clarity',
    tag: 'Energy',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=85',
    gradient: ['#1A6B2D', '#2D9B4A'],
    bg: '#EEF4F2'
  },
  {
    id: 6, 
    name: 'Testosterone Therapy', 
    category: "Men's Health",
    description: 'Reclaim your drive, strength and confidence',
    tag: 'For Men',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=85',
    gradient: ['#1A3A6B', '#2D5A9B'],
    bg: '#EEEEF4'
  },
  {
    id: 7, 
    name: 'Semaglutide Drops', 
    category: 'Weight Loss',
    description: 'Same results — zero injections required',
    tag: 'Needle-Free',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=600&q=85',
    gradient: ['#2D6B4C', '#3D9B6B'],
    bg: '#EEF4EE'
  },
  {
    id: 8, 
    name: 'Synapsin Spray', 
    category: 'Longevity',
    description: 'Stay sharp and focused at any age',
    tag: 'Mental Focus',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=85',
    gradient: ['#1A3A5C', '#2D5A8B'],
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
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7A8F7C] mb-2">MedRevolve Precision Treatments</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#0F172A]">
              Featured <span className="font-semibold">Products.</span>
            </h2>
            <p className="text-base text-[#1E293B]/55 mt-2 max-w-sm">
              Clinician-reviewed. Pharmacy-grade. Delivered discreetly.
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
              <RotatingProductCard product={product} />
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