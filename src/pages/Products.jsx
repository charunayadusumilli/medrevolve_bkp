import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Heart, Scale, Leaf, Lock, ChevronRight } from 'lucide-react';

// Lifestyle-focused categories with real people imagery (30-65 age group)
const categories = [
  {
    id: 'weight',
    name: 'Weight',
    description: 'Feel confident in your body',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    available: true
  },
  {
    id: 'longevity',
    name: 'Longevity',
    description: 'Age gracefully, live fully',
    image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=600&q=80',
    available: true
  },
  {
    id: 'hormone',
    name: 'Hormone',
    description: 'Balance from within',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    available: true
  },
  {
    id: 'sexual',
    name: 'Sexual Health',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=600&q=80',
    available: false
  },
  {
    id: 'hair',
    name: 'Hair',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    available: false
  },
  {
    id: 'skin',
    name: 'Skin',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    available: false
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    available: false
  }
];

// Products with lifestyle-oriented imagery
const allProducts = [
  {
    id: 1,
    name: 'Semaglutide',
    category: 'weight',
    subtitle: 'Weight Loss Injection',
    description: 'The most effective FDA-approved treatment for sustainable weight management. Feel lighter, move freely.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    tag: 'Most Popular',
    tagColor: 'bg-amber-500',
    price: 299,
    benefits: ['Up to 15% weight loss', 'Weekly injection', 'Reduces cravings']
  },
  {
    id: 2,
    name: 'Tirzepatide',
    category: 'weight',
    subtitle: 'Dual-Action Weight Loss',
    description: 'Advanced dual-hormone therapy for enhanced results. The newest breakthrough in weight management.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
    tag: 'Advanced',
    tagColor: 'bg-violet-500',
    price: 399,
    benefits: ['Up to 22% weight loss', 'Weekly injection', 'Better glucose control']
  },
  {
    id: 3,
    name: 'Semaglutide Oral Drops',
    category: 'weight',
    subtitle: 'No Needles Required',
    description: 'All the benefits without injections. Simple daily drops for those who prefer needle-free treatment.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80',
    tag: 'Needle-Free',
    tagColor: 'bg-teal-500',
    price: 249,
    benefits: ['Easy daily drops', 'No injections', 'Gradual results']
  },
  {
    id: 4,
    name: 'Microdose Semaglutide',
    category: 'weight',
    subtitle: 'Gentle Introduction',
    description: 'Perfect for first-timers or those wanting a gentler approach to weight management.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80',
    tag: null,
    price: 199,
    benefits: ['Lower dosage', 'Fewer side effects', 'Great for beginners']
  },
  {
    id: 5,
    name: 'Sermorelin',
    category: 'longevity',
    subtitle: 'Growth Hormone Support',
    description: 'Naturally stimulate your body\'s growth hormone production. Wake up refreshed, recover faster.',
    image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=500&q=80',
    tag: 'Anti-Aging',
    tagColor: 'bg-rose-500',
    price: 199,
    benefits: ['Better sleep', 'Faster recovery', 'Increased energy']
  },
  {
    id: 6,
    name: 'Glutathione Injection',
    category: 'longevity',
    subtitle: 'Master Antioxidant',
    description: 'The body\'s most powerful antioxidant. Detoxify, protect, and glow from the inside out.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    tag: 'Glow',
    tagColor: 'bg-pink-500',
    price: 149,
    benefits: ['Skin radiance', 'Detoxification', 'Immune support']
  },
  {
    id: 7,
    name: 'NAD+ Nasal Spray',
    category: 'longevity',
    subtitle: 'Cellular Energy Boost',
    description: 'Recharge your cells at the molecular level. More energy, sharper focus, better aging.',
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80',
    tag: 'Energy',
    tagColor: 'bg-orange-500',
    price: 179,
    benefits: ['Mental clarity', 'Cellular repair', 'Sustained energy']
  },
  {
    id: 8,
    name: 'B12 Injection',
    category: 'longevity',
    subtitle: 'Essential Vitality',
    description: 'Combat fatigue and boost your natural energy. Feel the difference within days.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&q=80',
    tag: null,
    price: 79,
    benefits: ['Energy boost', 'Mood support', 'Nervous system health']
  },
  {
    id: 9,
    name: 'Synapsin Nasal Spray',
    category: 'longevity',
    subtitle: 'Brain Health',
    description: 'Protect and enhance your cognitive function. Stay sharp, stay focused, stay you.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=80',
    tag: 'Focus',
    tagColor: 'bg-blue-500',
    price: 159,
    benefits: ['Memory support', 'Mental clarity', 'Neuroprotection']
  },
  {
    id: 10,
    name: 'Testosterone Therapy',
    category: 'hormone',
    subtitle: 'Restore Your Drive',
    description: 'Reclaim your energy, strength, and confidence. Optimized levels for your best self.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    tag: 'Men\'s Health',
    tagColor: 'bg-indigo-500',
    price: 199,
    benefits: ['Increased energy', 'Muscle support', 'Better mood']
  },
  {
    id: 11,
    name: 'Estrogen Therapy',
    category: 'hormone',
    subtitle: 'Hormonal Harmony',
    description: 'Navigate hormonal changes with grace. Relief from symptoms, restoration of balance.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
    tag: 'Women\'s Health',
    tagColor: 'bg-fuchsia-500',
    price: 179,
    benefits: ['Hot flash relief', 'Better sleep', 'Mood stability']
  },
  {
    id: 12,
    name: 'Thyroid Support',
    category: 'hormone',
    subtitle: 'Metabolic Balance',
    description: 'Optimize your thyroid for energy, metabolism, and overall wellbeing.',
    image: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=500&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=500&q=80',
    tag: null,
    price: 149,
    benefits: ['Energy balance', 'Weight management', 'Temperature regulation']
  }
];

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || null;
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4 tracking-tight">
              Explore Our Products
            </h1>
            <p className="text-lg text-[#5A6B5A]">
              Wellness that fits your life. Choose your path to feeling your best.
            </p>
          </motion.div>

          {/* Category Grid - FrontCare Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* First Row - 4 categories */}
            {categories.slice(0, 4).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard 
                  category={category} 
                  isActive={activeCategory === category.id}
                  onClick={() => category.available && setActiveCategory(category.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Second Row - 3 categories + Title */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
            <motion.div 
              className="hidden md:flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Empty space or could add decorative element */}
            </motion.div>
            {categories.slice(4).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <CategoryCard 
                  category={category} 
                  isActive={activeCategory === category.id}
                  onClick={() => category.available && setActiveCategory(category.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.section
            key={activeCategory}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="py-16 px-6 lg:px-8 bg-white"
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D]">
                    {categories.find(c => c.id === activeCategory)?.name} Products
                  </h2>
                  <p className="text-[#5A6B5A] mt-2">
                    Personalized treatments backed by science
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveCategory(null)}
                  className="text-[#5A6B5A] hover:text-[#2D3A2D]"
                >
                  View All Categories
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* No Category Selected State */}
      {!activeCategory && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-[#D4E5D7] flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-10 h-10 text-[#4A6741]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#2D3A2D] mb-4">
              Choose Your Wellness Journey
            </h2>
            <p className="text-[#5A6B5A] mb-8">
              Select a category above to explore treatments designed for your specific goals. 
              Every journey is unique—let's find yours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.filter(c => c.available).map(category => (
                <Button
                  key={category.id}
                  variant="outline"
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full border-[#4A6741]/30 text-[#4A6741] hover:bg-[#4A6741] hover:text-white"
                >
                  {category.name}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Trust Section */}
      <section className="py-16 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-light text-[#4A6741] mb-2">50,000+</div>
              <p className="text-[#5A6B5A]">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-light text-[#4A6741] mb-2">Licensed</div>
              <p className="text-[#5A6B5A]">Medical Providers</p>
            </div>
            <div>
              <div className="text-4xl font-light text-[#4A6741] mb-2">3-5 Days</div>
              <p className="text-[#5A6B5A]">Discreet Delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ category, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group ${
        !category.available ? 'opacity-80' : ''
      }`}
      whileHover={category.available ? { scale: 1.02 } : {}}
      whileTap={category.available ? { scale: 0.98 } : {}}
    >
      {/* Image */}
      <img 
        src={category.image}
        alt={category.name}
        className={`w-full h-full object-cover transition-transform duration-700 ${
          category.available ? 'group-hover:scale-110' : ''
        }`}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isActive 
          ? 'bg-gradient-to-t from-[#4A6741]/90 via-[#4A6741]/40 to-transparent' 
          : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
      }`} />

      {/* Coming Soon Overlay */}
      {!category.available && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
            <Lock className="w-4 h-4 text-[#4A6741]" />
            <span className="text-sm font-medium text-[#2D3A2D]">Coming Soon</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className={`text-xl md:text-2xl font-medium transition-colors ${
          isActive ? 'text-white' : 'text-white'
        }`}>
          {category.name}
        </h3>
        {category.available && (
          <p className="text-white/80 text-sm mt-1">
            {category.description}
          </p>
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 border-4 border-[#4A6741] rounded-2xl"
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

function ProductCard({ product }) {
  return (
    <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
      <motion.div 
        className="bg-[#FDFBF7] rounded-3xl overflow-hidden group h-full flex flex-col"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={product.lifestyle}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Tag */}
          {product.tag && (
            <Badge className={`absolute top-4 left-4 ${product.tagColor} text-white border-none font-medium`}>
              {product.tag}
            </Badge>
          )}

          {/* Hover overlay with quick benefits */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <div className="space-y-1">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-white text-sm">
                  <Sparkles className="w-3 h-3" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs font-medium text-[#4A6741] uppercase tracking-wider mb-1">
              {product.subtitle}
            </p>
            <h3 className="text-xl font-medium text-[#2D3A2D] group-hover:text-[#4A6741] transition-colors">
              {product.name}
            </h3>
            <p className="text-[#5A6B5A] text-sm mt-2 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Price & CTA */}
          <div className="mt-5 pt-5 border-t border-[#E8E0D5] flex items-center justify-between">
            <div>
              <span className="text-2xl font-light text-[#2D3A2D]">${product.price}</span>
              <span className="text-sm text-[#5A6B5A]">/mo</span>
            </div>
            <div className="flex items-center gap-2 text-[#4A6741] font-medium text-sm group-hover:gap-3 transition-all">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}