import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield, Pill, Truck, HeartPulse } from 'lucide-react';

const FEATURES = [
  { icon: Globe, label: 'Website & Domain', desc: 'Custom branded storefront' },
  { icon: Shield, label: 'Compliance Ready', desc: 'All 50 states covered' },
  { icon: Pill, label: 'Product Catalog', desc: 'GLP-1, RUO, Wellness' },
  { icon: Truck, label: 'Fulfillment', desc: 'Pharmacy network included' },
  { icon: HeartPulse, label: 'Provider Network', desc: 'Licensed doctors ready' },
  { icon: Zap, label: 'Live in Days', desc: 'Not months' },
];

export default function StartPlatformCTA() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <section className="relative py-12 lg:py-24 px-6 lg:px-8 bg-gradient-to-b from-[#0A0A0A] via-[#111D30] to-[#0A0A0A] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A6741]/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2D6A9F]/30 rounded-full filter blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-[#4A6741]/30 rounded-full px-3 py-1.5 mb-3 lg:mb-6">
            <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-[#A8C99B]" />
            <span className="text-[#A8C99B] text-[10px] lg:text-xs font-bold uppercase tracking-widest">Launch in Days</span>
          </div>
          <h2 className="text-3xl lg:text-6xl font-black text-white mb-2 lg:mb-4 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Start Your <span className="text-[#A8C99B]">Platform</span>
          </h2>
          <p className="text-sm lg:text-xl text-white/50 max-w-2xl mx-auto mb-4 lg:mb-8">
            Complete platform to launch telehealth, GLP-1, or wellness business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button size="sm" className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg px-6 lg:px-8 font-bold text-xs lg:text-base lg:h-auto h-9">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to={'/Platform?tab=book'}>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg px-6 lg:px-8 font-bold text-xs lg:text-base lg:h-auto h-9">
                Book Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid with scroll animation — 2 cols on mobile, 3 on lg */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
          <AnimatePresence>
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group relative bg-white/5 border border-white/10 hover:border-[#4A6741]/50 rounded-xl p-6 transition-all duration-300 hover:bg-white/8 hover:-translate-y-1 cursor-pointer overflow-hidden">
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#4A6741]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative">
                    <div className="w-7 lg:w-10 h-7 lg:h-10 rounded-lg bg-[#4A6741]/20 flex items-center justify-center mb-2 lg:mb-4 group-hover:bg-[#4A6741]/40 transition-colors">
                      <Icon className="w-3.5 lg:w-5 h-3.5 lg:h-5 text-[#A8C99B]" />
                    </div>
                    <h3 className="text-white font-bold mb-0.5 lg:mb-1 text-xs lg:text-base">{feature.label}</h3>
                    <p className="text-white/50 text-[10px] lg:text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Highlight stats — hidden on mobile to save space */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:grid mt-12 lg:mt-20 grid-cols-4 gap-6 text-center">
          {[
            { num: '7-30', label: 'Days to Launch' },
            { num: '200+', label: 'Providers' },
            { num: '50', label: 'States Covered' },
            { num: '$0', label: 'Setup Fee' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-[#A8C99B]">{stat.num}</p>
              <p className="text-white/50 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}