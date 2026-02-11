import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] via-[#F5F0E8] to-[#E8E0D5]" />
      
      {/* Decorative circles */}
      <motion.div 
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#D4E5D7]/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-[#E5D4C8]/40 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A6741]/10 text-[#4A6741] text-sm font-medium mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Leaf className="w-4 h-4" />
              Wellness Reimagined
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2D3A2D] leading-[1.1] mb-6">
              Your Path To
              <span className="block font-medium bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] bg-clip-text text-transparent">
                Better Health, Curated
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#5A6B5A] leading-relaxed mb-8 max-w-lg">
              Wellness doesn't have to feel clinical. It should feel like connection. Shop the recommendations of your most trusted creators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('Products')}>
                <Button 
                  size="lg" 
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8 py-6 text-base font-medium group"
                >
                  Start Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-[#D4E5D7] to-[#E5D4C8] transform rotate-6" />
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
                  alt="Woman smiling outdoors"
                  className="w-full h-full object-cover"
                />
              </div>
              

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}