import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Semaglutide',
    category: 'Weight Loss',
    description: 'Lose up to 15% body weight with once-weekly dosing',
    image: 'https://images.unsplash.com/photo-1609899464926-da5a3b1d460f?w=500&q=85',
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Tirzepatide',
    category: 'Weight Loss',
    description: 'Dual-action GLP-1 for maximum results',
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=500&q=85',
    tag: 'Strongest'
  },
  {
    id: 3,
    name: 'Sermorelin',
    category: 'Longevity',
    description: 'Sleep deeper, recover faster, feel younger',
    image: 'https://images.unsplash.com/photo-1590253230532-a67f6bc61b9e?w=500&q=85',
    tag: null
  },
  {
    id: 4,
    name: 'Glutathione',
    category: 'Longevity',
    description: 'Radiant skin and cellular health from within',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=85',
    tag: 'Glow'
  },
  {
    id: 5,
    name: 'NAD+ Injection',
    category: 'Longevity',
    description: 'All-day energy and sharp mental clarity',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=85',
    tag: null
  },
  {
    id: 6,
    name: 'Testosterone Therapy',
    category: "Men's Health",
    description: 'Reclaim your drive, strength and confidence',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=85',
    tag: null
  },
  {
    id: 7,
    name: 'Semaglutide Drops',
    category: 'Weight Loss',
    description: 'Same results — zero injections required',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=85',
    tag: 'Needle-Free'
  },
  {
    id: 8,
    name: 'Synapsin Spray',
    category: 'Longevity',
    description: 'Stay sharp and focused at any age',
    image: 'https://images.unsplash.com/photo-1581079289196-67865ea83118?w=500&q=85',
    tag: null
  }
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
      className="w-72 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
      whileHover={{ y: -8 }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.tag && (
          <span className="absolute top-4 left-4 bg-[#4A6741] text-white text-xs font-medium px-3 py-1 rounded-full">
            {product.tag}
          </span>
        )}
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