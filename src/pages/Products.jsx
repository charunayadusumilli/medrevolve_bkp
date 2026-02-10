import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, SlidersHorizontal, X } from 'lucide-react';

const allProducts = [
  {
    id: 1,
    name: 'Semaglutide',
    category: 'weight',
    description: 'FDA-approved GLP-1 receptor agonist for sustainable weight management. Helps reduce appetite and promote long-term weight loss.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    tag: 'Best Seller',
    price: 'From $299/mo'
  },
  {
    id: 2,
    name: 'Tirzepatide',
    category: 'weight',
    description: 'Advanced dual-action GIP and GLP-1 receptor agonist for enhanced weight management results.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80',
    tag: 'Popular',
    price: 'From $399/mo'
  },
  {
    id: 3,
    name: 'Semaglutide Oral Drops',
    category: 'weight',
    description: 'Convenient oral alternative for weight management. Easy to use sublingual drops.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
    tag: 'New',
    price: 'From $249/mo'
  },
  {
    id: 4,
    name: 'Tirzepatide Oral Drops',
    category: 'weight',
    description: 'Advanced dual-action formula in convenient oral drop form.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    tag: null,
    price: 'From $349/mo'
  },
  {
    id: 5,
    name: 'Semaglutide Microdose',
    category: 'weight',
    description: 'Lower dose option for those seeking gentle weight management support.',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80',
    tag: null,
    price: 'From $199/mo'
  },
  {
    id: 6,
    name: 'Tirzepatide Microdose',
    category: 'weight',
    description: 'Gentle introduction to dual-action weight management therapy.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    tag: null,
    price: 'From $249/mo'
  },
  {
    id: 7,
    name: 'Sermorelin',
    category: 'longevity',
    description: 'Natural growth hormone releasing peptide that supports vitality, energy, and overall wellness.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
    tag: null,
    price: 'From $199/mo'
  },
  {
    id: 8,
    name: 'Glutathione Injection',
    category: 'longevity',
    description: 'Powerful antioxidant for cellular health, detoxification, and skin radiance.',
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=400&q=80',
    tag: 'New',
    price: 'From $149/mo'
  },
  {
    id: 9,
    name: 'NAD+ Nasal Spray',
    category: 'longevity',
    description: 'Boost cellular energy, metabolism, and cognitive function with this essential coenzyme.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    tag: null,
    price: 'From $179/mo'
  },
  {
    id: 10,
    name: 'B12 Injection',
    category: 'longevity',
    description: 'Essential vitamin for energy, vitality, and nervous system health.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
    tag: null,
    price: 'From $79/mo'
  },
  {
    id: 11,
    name: 'Synapsin Nasal Spray',
    category: 'longevity',
    description: 'Support cognitive function, memory, and brain health with this neuroprotective formula.',
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=400&q=80',
    tag: null,
    price: 'From $159/mo'
  },
  {
    id: 12,
    name: 'Testosterone Therapy',
    category: 'hormone',
    description: 'Restore optimal testosterone levels for energy, strength, and overall well-being.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    tag: 'Popular',
    price: 'From $199/mo'
  },
  {
    id: 13,
    name: 'Estrogen Therapy',
    category: 'hormone',
    description: 'Balance estrogen levels for improved mood, energy, and hormonal health.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80',
    tag: null,
    price: 'From $179/mo'
  },
  {
    id: 14,
    name: 'Thyroid Support',
    category: 'hormone',
    description: 'Optimize thyroid function for metabolism, energy, and weight management.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
    tag: null,
    price: 'From $149/mo'
  }
];

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'weight', label: 'Weight Loss' },
  { value: 'longevity', label: 'Longevity' },
  { value: 'hormone', label: 'Hormone' }
];

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="pt-12 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
              Our <span className="font-medium text-[#4A6741]">Products</span>
            </h1>
            <p className="text-lg text-[#5A6B5A]">
              Science-backed wellness solutions personalized for your journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-[#FDFBF7]/95 backdrop-blur-lg border-b border-[#E8E0D5] py-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-white border border-[#E8E0D5] p-1 rounded-full">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat.value}
                    value={cat.value}
                    className="rounded-full px-6 data-[state=active]:bg-[#4A6741] data-[state=active]:text-white"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6B5A]" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-[#E8E0D5] bg-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-[#5A6B5A]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#5A6B5A]">
              Showing <span className="font-medium text-[#2D3A2D]">{filteredProducts.length}</span> products
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
                  <ProductCard product={product} />
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#5A6B5A] mb-4">No products found matching your criteria</p>
              <Button 
                variant="outline"
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <motion.div 
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
      whileHover={{ y: -8 }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.tag && (
          <Badge className="absolute top-4 left-4 bg-[#4A6741] text-white border-none">
            {product.tag}
          </Badge>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-xs font-medium text-[#4A6741] uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-medium text-[#2D3A2D] mt-2 group-hover:text-[#4A6741] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[#5A6B5A] mt-2 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="mt-4 pt-4 border-t border-[#E8E0D5] flex items-center justify-between">
          <span className="text-sm font-medium text-[#2D3A2D]">{product.price}</span>
          <div className="flex items-center text-[#4A6741] text-sm font-medium group-hover:gap-2 transition-all">
            Learn More
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}