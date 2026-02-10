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
    description: 'FDA-approved treatment for sustainable weight management',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Tirzepatide',
    category: 'Weight Loss',
    description: 'Advanced dual-action weight management solution',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80',
    tag: 'Popular'
  },
  {
    id: 3,
    name: 'Sermorelin',
    category: 'Longevity',
    description: 'Natural growth hormone releasing peptide',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80',
    tag: null
  },
  {
    id: 4,
    name: 'Glutathione Injection',
    category: 'Longevity',
    description: 'Powerful antioxidant for cellular health',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    tag: 'New'
  },
  {
    id: 5,
    name: 'NAD+ Nasal Spray',
    category: 'Longevity',
    description: 'Boost cellular energy and metabolism',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    tag: null
  },
  {
    id: 6,
    name: 'B12 Injection',
    category: 'Longevity',
    description: 'Essential vitamin for energy and vitality',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
    tag: null
  },
  {
    id: 7,
    name: 'Semaglutide Oral Drops',
    category: 'Weight Loss',
    description: 'Convenient oral alternative for weight management',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
    tag: 'New'
  },
  {
    id: 8,
    name: 'Synapsin Nasal Spray',
    category: 'Longevity',
    description: 'Support cognitive function and brain health',
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=400&q=80',
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