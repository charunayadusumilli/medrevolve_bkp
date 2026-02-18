import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Heart, Scale, Leaf, Lock, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Studio-quality pharmaceutical product imagery (Ro.co / Hims style)
const categories = [
  {
    id: 'weight',
    name: 'Weight',
    description: 'Feel confident in your body',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    bg: 'from-slate-100 to-slate-200',
    available: true
  },
  {
    id: 'longevity',
    name: 'Longevity',
    description: 'Age gracefully, live fully',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    bg: 'from-stone-100 to-stone-200',
    available: true
  },
  {
    id: 'hormone',
    name: 'Hormone',
    description: 'Balance from within',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
    bg: 'from-zinc-100 to-zinc-200',
    available: true
  },
  {
    id: 'sexual',
    name: 'Sexual Health',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=600&q=80',
    bg: 'from-neutral-100 to-neutral-200',
    available: false
  },
  {
    id: 'hair',
    name: 'Hair',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80',
    bg: 'from-gray-100 to-gray-200',
    available: false
  },
  {
    id: 'skin',
    name: 'Skin',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    bg: 'from-rose-50 to-rose-100',
    available: false
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80',
    bg: 'from-sky-50 to-sky-100',
    available: false
  }
];

// Studio pharmaceutical product imagery — capsules, vials, elegant packaging (Ro/Hims style)
const allProducts = [
  {
    id: 1,
    name: 'Semaglutide',
    category: 'weight',
    subtitle: 'Weight Loss Injection',
    promise: 'Lose up to 15% body weight',
    lifestyle: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=90',
    bg: 'bg-slate-50',
    tag: 'Most Popular',
    tagColor: 'bg-amber-500',
    price: 299,
    customers: '12,400+',
    benefits: ['Clinically proven results', 'Once weekly dose', 'Curbs cravings naturally']
  },
  {
    id: 2,
    name: 'Tirzepatide',
    category: 'weight',
    subtitle: 'Dual-Action Formula',
    promise: 'Up to 22% weight loss in studies',
    lifestyle: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=90',
    bg: 'bg-violet-50',
    tag: 'Strongest Results',
    tagColor: 'bg-violet-500',
    price: 399,
    customers: '8,200+',
    benefits: ['Maximum effectiveness', 'Better blood sugar', 'Sustained energy']
  },
  {
    id: 3,
    name: 'Semaglutide Drops',
    category: 'weight',
    subtitle: 'No Needles Needed',
    promise: 'Same results, zero injections',
    lifestyle: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=90',
    bg: 'bg-teal-50',
    tag: 'Needle-Free',
    tagColor: 'bg-teal-500',
    price: 249,
    customers: '6,800+',
    benefits: ['Simple daily drops', 'Travel friendly', 'Gentle on stomach']
  },
  {
    id: 4,
    name: 'Microdose Semaglutide',
    category: 'weight',
    subtitle: 'Start Gentle',
    promise: 'Perfect for beginners',
    lifestyle: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=800&q=90',
    bg: 'bg-emerald-50',
    tag: 'Beginner Friendly',
    tagColor: 'bg-emerald-500',
    price: 199,
    customers: '4,100+',
    benefits: ['Minimal side effects', 'Easy adjustment', 'Build tolerance slowly']
  },
  {
    id: 5,
    name: 'Sermorelin',
    category: 'longevity',
    subtitle: 'Growth Hormone Support',
    promise: 'Wake up feeling 10 years younger',
    lifestyle: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=90',
    bg: 'bg-rose-50',
    tag: 'Anti-Aging',
    tagColor: 'bg-rose-500',
    price: 199,
    customers: '7,300+',
    benefits: ['Deep restful sleep', 'Faster recovery', 'Natural energy boost']
  },
  {
    id: 6,
    name: 'Glutathione',
    category: 'longevity',
    subtitle: 'Master Antioxidant',
    promise: 'Glow from the inside out',
    lifestyle: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=90',
    bg: 'bg-pink-50',
    tag: 'Skin Glow',
    tagColor: 'bg-pink-500',
    price: 149,
    customers: '9,600+',
    benefits: ['Radiant skin', 'Liver detox', 'Immune boost']
  },
  {
    id: 7,
    name: 'NAD+ Injection',
    category: 'longevity',
    subtitle: 'Cellular Energy',
    promise: 'All-day mental clarity',
    lifestyle: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=90',
    bg: 'bg-orange-50',
    tag: 'Brain Boost',
    tagColor: 'bg-orange-500',
    price: 179,
    customers: '5,400+',
    benefits: ['Sharper focus', 'More stamina', 'Better aging']
  },
  {
    id: 8,
    name: 'B12 Injection',
    category: 'longevity',
    subtitle: 'Energy Essential',
    promise: 'Feel energized in days',
    lifestyle: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800&q=90',
    bg: 'bg-green-50',
    tag: 'Best Value',
    tagColor: 'bg-green-500',
    price: 79,
    customers: '15,200+',
    benefits: ['Instant energy', 'Better mood', 'Supports metabolism']
  },
  {
    id: 9,
    name: 'Synapsin Spray',
    category: 'longevity',
    subtitle: 'Cognitive Support',
    promise: 'Stay sharp at any age',
    lifestyle: 'https://images.unsplash.com/photo-1632167764943-7a8c3e9ba9b2?w=800&q=90',
    bg: 'bg-blue-50',
    tag: 'Memory',
    tagColor: 'bg-blue-500',
    price: 159,
    customers: '3,800+',
    benefits: ['Memory support', 'Focus clarity', 'Brain protection']
  },
  {
    id: 10,
    name: 'Testosterone Therapy',
    category: 'hormone',
    subtitle: "Men's Vitality",
    promise: 'Reclaim your drive & strength',
    lifestyle: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=90',
    bg: 'bg-indigo-50',
    tag: 'For Men',
    tagColor: 'bg-indigo-500',
    price: 199,
    customers: '11,100+',
    benefits: ['More energy', 'Lean muscle', 'Improved mood']
  },
  {
    id: 11,
    name: 'Estrogen Therapy',
    category: 'hormone',
    subtitle: "Women's Balance",
    promise: 'Navigate change with ease',
    lifestyle: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=800&q=90',
    bg: 'bg-fuchsia-50',
    tag: 'For Women',
    tagColor: 'bg-fuchsia-500',
    price: 179,
    customers: '8,900+',
    benefits: ['Hot flash relief', 'Restful nights', 'Mood balance']
  },
  {
    id: 12,
    name: 'Thyroid Support',
    category: 'hormone',
    subtitle: 'Metabolic Balance',
    promise: 'Optimize your metabolism',
    lifestyle: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&q=90',
    bg: 'bg-cyan-50',
    tag: 'Metabolism',
    tagColor: 'bg-cyan-500',
    price: 149,
    customers: '6,200+',
    benefits: ['Steady energy', 'Weight support', 'Feel balanced']
  }
];

// Map URL param values to internal category IDs
const categoryParamMap = {
  'weight_loss': 'weight',
  'weight': 'weight',
  'longevity': 'longevity',
  'hormone': 'hormone',
  'mens_health': 'hormone',
  'womens_health': 'hormone',
  'hair_loss': 'hair',
  'peptides': 'longevity',
};

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawCategory = urlParams.get('category') || null;
  const initialCategory = rawCategory ? (categoryParamMap[rawCategory] || rawCategory) : null;
  
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
            <p className="text-[#5A6B5A] mb-6">
              Select a category above to explore treatments designed for your specific goals. 
              Every journey is unique—let's find yours.
            </p>
            <div className="mb-8">
              <Link to={createPageUrl('CustomerIntake')}>
                <Button 
                  size="lg"
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8"
                >
                  Get Started - Complete Your Intake
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
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
      className={`relative rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all duration-300
        ${isActive ? 'border-[#2D3A2D] shadow-xl' : 'border-transparent'}
        ${!category.available ? 'opacity-60 cursor-default' : 'hover:border-[#2D3A2D]/30 hover:shadow-lg'}
        bg-white`}
      whileHover={category.available ? { y: -4 } : {}}
      whileTap={category.available ? { scale: 0.98 } : {}}
    >
      {/* Product Image — clean light bg, studio style */}
      <div className={`aspect-[4/3] relative overflow-hidden ${category.bg || 'bg-gray-100'}`}>
        <img
          src={category.image}
          alt={category.name}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${
            category.available ? 'group-hover:scale-105' : ''
          }`}
        />
        {/* Subtle vignette only at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/30 to-transparent" />

        {/* Coming Soon pill */}
        {!category.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-md border border-gray-200">
              <Lock className="w-3.5 h-3.5 text-[#4A6741]" />
              <span className="text-xs font-semibold text-[#2D3A2D]">Coming Soon</span>
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-[#2D3A2D] text-base">{category.name}</h3>
        {category.available && (
          <p className="text-xs text-[#5A6B5A] mt-0.5">{category.description}</p>
        )}
      </div>

      {/* Active underline */}
      {isActive && (
        <motion.div layoutId="activeCat" className="h-0.5 bg-[#2D3A2D] mx-4 mb-3 rounded-full" />
      )}
    </motion.div>
  );
}

function ProductCard({ product }) {
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      const priceMap = {
        'Semaglutide': 'price_1T1ETDAuWpKZkJ8tlrK09kNp',
        'NAD+ Spray': 'price_1T1ETDAuWpKZkJ8tdUByobRk',
        'Testosterone Therapy': 'price_1T1ETDAuWpKZkJ8tZlbegXkW'
      };
      
      const priceId = priceMap[product.name];
      if (!priceId) {
        alert('This product is not available for purchase yet');
        return;
      }

      const { data } = await base44.functions.invoke('createCheckout', {
        priceId,
        successUrl: `${window.location.origin}/Products?success=true`,
        cancelUrl: `${window.location.origin}/Products?canceled=true`
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert(error.message || 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden group h-full flex flex-col hover:shadow-xl transition-all duration-400 border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Link to={createPageUrl(`ProductDetail?id=${product.id}`)} className="flex-1 flex flex-col">
        {/* Studio product shot — clean light bg, product centered */}
        <div className={`relative aspect-square overflow-hidden ${product.bg || 'bg-gray-50'} flex items-center justify-center`}>
          <img
            src={product.lifestyle}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* Tag pill — minimal, top-right */}
          {product.tag && (
            <div className="absolute top-3 right-3">
              <span className={`${product.tagColor} text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow`}>
                {product.tag}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col">
          <p className="text-[11px] font-bold text-[#4A6741] uppercase tracking-widest mb-1">{product.subtitle}</p>
          <h3 className="text-lg font-semibold text-[#1A2A1A] leading-snug mb-2 group-hover:text-[#4A6741] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[#5A6B5A] mb-4 leading-relaxed">{product.promise}</p>

          {/* Benefits */}
          <div className="space-y-1.5 mb-4">
            {product.benefits.slice(0, 3).map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#2D3A2D]">
                <div className="w-4 h-4 rounded-full bg-[#D4E5D7] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4A6741] text-[9px] font-bold">✓</span>
                </div>
                {b}
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* Social proof */}
          <p className="text-[11px] text-[#8A9A8A]">{product.customers} patients treated</p>
        </div>
      </Link>

      {/* Price + CTA */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-[#1A2A1A]">${product.price}</span>
              <span className="text-sm text-[#8A9A8A]">/mo</span>
            </div>
            <p className="text-[11px] text-[#4A6741]">Includes consult + shipping</p>
          </div>
          <Button
            size="sm"
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-[#1A2A1A] hover:bg-[#2D3A2D] text-white rounded-full px-5 text-sm font-semibold"
          >
            {loading ? '...' : 'Get Started'}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}