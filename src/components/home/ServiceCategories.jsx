import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale, Heart, Sparkles, Scissors, Droplets, HeartPulse, Lock } from 'lucide-react';

const categories = [
  {
    name: 'Weight Loss',
    icon: Scale,
    description: 'GLP-1 programs that work',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    available: true,
    color: '#4A6741',
    href: 'Products?category=weight_loss'
  },
  {
    name: 'Longevity',
    icon: Heart,
    description: 'Peptides & anti-aging',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    available: true,
    color: '#6B8F5E',
    href: 'Products?category=longevity'
  },
  {
    name: 'Hormones',
    icon: Sparkles,
    description: 'Balance from within',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=85',
    available: true,
    color: '#8B7355',
    href: 'Products?category=hormone'
  },
  {
    name: 'Hair',
    icon: Scissors,
    description: 'Regrow & restore',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=85',
    available: false,
    color: '#A68B6A',
    href: 'Products?category=hair_loss'
  },
  {
    name: 'Skin',
    icon: Droplets,
    description: 'Glow from within',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=85',
    available: false,
    color: '#C4A77D',
    href: 'Products'
  },
  {
    name: "Men's Health",
    icon: HeartPulse,
    description: 'Performance & vitality',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    available: true,
    color: '#5A7A8A',
    href: 'Products?category=mens_health'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ServiceCategories() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7A8F7C] mb-3">Where Will You Begin?</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#0F172A] mb-3">
            Explore Our <span className="font-semibold">Services.</span>
          </h2>
          <p className="text-base text-[#1E293B]/55 max-w-lg mx-auto">
            Precision wellness solutions designed around your goals — not generic protocols.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={item}>
              {category.available ? (
                <Link to={createPageUrl(category.href)}>
                  <CategoryCard category={category} />
                </Link>
              ) : (
                <CategoryCard category={category} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  const Icon = category.icon;
  
  return (
    <motion.div 
      className={`relative group cursor-pointer ${!category.available ? 'opacity-70' : ''}`}
      whileHover={category.available ? { y: -8 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {!category.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white/90 rounded-full px-4 py-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#4A6741]" />
              <span className="text-sm font-medium text-[#2D3A2D]">Coming Soon</span>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div 
            className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: category.color }} />
          </div>
          <h3 className="text-white font-medium text-lg">{category.name}</h3>
          <p className="text-white/70 text-xs mt-1 line-clamp-2">{category.description}</p>
        </div>
      </div>
    </motion.div>
  );
}