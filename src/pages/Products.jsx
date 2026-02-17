import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Heart, Scale, Leaf, Lock, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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
    promise: 'Lose up to 15% body weight',
    lifestyle: 'https://images.unsplash.com/photo-1620231080477-7c3a0a6eff41?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1620231080477-7c3a0a6eff41?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    tag: 'Skin Glow',
    tagColor: 'bg-pink-500',
    price: 149,
    customers: '9,600+',
    benefits: ['Radiant skin', 'Liver detox', 'Immune boost']
  },
  {
    id: 7,
    name: 'NAD+ Spray',
    category: 'longevity',
    subtitle: 'Cellular Energy',
    promise: 'All-day mental clarity',
    lifestyle: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=80',
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
    subtitle: 'Men\'s Vitality',
    promise: 'Reclaim your drive & strength',
    lifestyle: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
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
    subtitle: 'Women\'s Balance',
    promise: 'Navigate change with ease',
    lifestyle: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
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
    lifestyle: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=500&q=80',
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
      className="bg-white rounded-3xl overflow-hidden group h-full flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8E0D5]/50"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={createPageUrl(`ProductDetail?id=${product.id}`)} className="flex-1 flex flex-col">
        {/* Hero Image with Lifestyle Focus */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F5F0E8] to-[#E8E0D5]">
          <img 
            src={product.lifestyle}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Trust Badge - Top Left */}
          {product.tag && (
            <div className="absolute top-4 left-4">
              <Badge className={`${product.tagColor} text-white border-none font-medium px-3 py-1 text-xs shadow-lg`}>
                ★ {product.tag}
              </Badge>
            </div>
          )}

          {/* Quick Result Promise - Bottom of Image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-medium text-lg leading-tight drop-shadow-lg">
              {product.promise || product.benefits[0]}
            </p>
          </div>
        </div>

        {/* Content Section - Marketing Optimized */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category & Name */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-[#4A6741] uppercase tracking-wider mb-1">
              {product.subtitle}
            </p>
            <h3 className="text-xl font-semibold text-[#2D3A2D] group-hover:text-[#4A6741] transition-colors leading-tight">
              {product.name}
            </h3>
          </div>

          {/* Benefit Pills - Scannable */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.benefits.slice(0, 3).map((benefit, i) => (
              <span 
                key={i} 
                className="inline-flex items-center gap-1 text-xs bg-[#D4E5D7]/50 text-[#4A6741] px-2.5 py-1 rounded-full"
              >
                <span className="w-1 h-1 bg-[#4A6741] rounded-full"></span>
                {benefit}
              </span>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4E5D7] to-[#4A6741]/20 border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] text-[#4A6741]">✓</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-[#5A6B5A]">
              {product.customers || '5,000+'} customers this month
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>
        </div>
      </Link>

      {/* Price & CTA - outside Link so clicks register */}
      <div className="px-6 pb-6 pt-4 border-t border-[#E8E0D5]">
          <p className="text-xs text-[#5A6B5A] mb-3">
            Includes medical consultation & free shipping
          </p>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-[#2D3A2D]">${product.price}</span>
                <span className="text-sm text-[#5A6B5A]">/mo</span>
              </div>
              <p className="text-xs text-[#4A6741] font-medium">Cancel anytime</p>
            </div>
            <Button 
              size="sm"
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-5 transition-all shadow-lg shadow-[#4A6741]/20"
            >
              {loading ? 'Loading...' : 'Start Now'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
  );
}