import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Building2, ShoppingBag } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
            Unlock Your <span className="font-medium text-[#4A6741]">Revenue Potential</span>
          </h2>
          <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
            Partner with MedRevolve and grow your business while helping others achieve their wellness goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* For Creators Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <Link to={createPageUrl('ForCreators')}>
              <div className="relative bg-gradient-to-br from-[#4A6741] to-[#3D5636] rounded-3xl p-8 md:p-10 h-full overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">
                    For Creators
                  </h3>
                  <p className="text-white/80 mb-8 max-w-sm">
                    Monetize your influence by recommending trusted wellness products to your audience. Earn commissions on every sale.
                  </p>
                  
                  <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* For Business Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <Link to={createPageUrl('ForBusiness')}>
              <div className="relative bg-gradient-to-br from-[#8B7355] to-[#6B5A45] rounded-3xl p-8 md:p-10 h-full overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">
                    For Business
                  </h3>
                  <p className="text-white/80 mb-8 max-w-sm">
                    Integrate our wellness solutions into your business model. White-label options and wholesale pricing available.
                  </p>
                  
                  <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Shop Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 text-[#5A6B5A] mb-6">
            <div className="h-px w-16 bg-[#E8E0D5]" />
            <span>OR</span>
            <div className="h-px w-16 bg-[#E8E0D5]" />
          </div>
          
          <Link to={createPageUrl('Products')}>
            <Button 
              size="lg"
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-10 py-6 text-base font-medium group"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}