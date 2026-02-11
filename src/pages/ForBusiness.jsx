import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Building2, Package, Shield, BarChart3,
  Users, Zap, CheckCircle, Handshake, Globe
} from 'lucide-react';

const solutions = [
  {
    icon: Package,
    title: 'White-Label Solutions',
    description: 'Brand our products as your own. Complete customization of packaging, labeling, and marketing materials.',
    features: ['Custom branding', 'Private label options', 'Flexible MOQ']
  },
  {
    icon: Building2,
    title: 'Wholesale Pricing',
    description: 'Access competitive wholesale pricing for clinics, wellness centers, and healthcare providers.',
    features: ['Volume discounts', 'Net terms available', 'Priority fulfillment']
  },
  {
    icon: Handshake,
    title: 'Partnership Programs',
    description: 'Strategic partnerships for businesses looking to integrate wellness into their offerings.',
    features: ['Co-marketing opportunities', 'Revenue sharing', 'Dedicated support']
  }
];

const benefits = [
  { icon: Shield, title: 'Quality Assured', description: 'FDA-approved products from NABP-certified pharmacies' },
  { icon: Globe, title: 'Nationwide Coverage', description: 'Delivery across all 50 states with reliable logistics' },
  { icon: Users, title: 'Expert Support', description: 'Dedicated account managers and technical support' },
  { icon: Zap, title: 'Fast Integration', description: 'Quick onboarding and seamless API integration' }
];

const industries = [
  'Med Spas & Clinics',
  'Wellness Centers',
  'Telehealth Platforms',
  'Fitness Studios',
  'Healthcare Providers',
  'Corporate Wellness'
];

export default function ForBusiness() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="pt-12 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block text-sm font-medium text-[#8B7355] uppercase tracking-wide mb-4">
                For Business
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2D3A2D] mb-6 leading-tight">
                Scale Your Wellness <span className="font-medium text-[#8B7355]">Business With Us</span>
              </h1>
              <p className="text-lg text-[#5A6B5A] mb-8">
                Partner with MedRevolve to offer premium wellness products to your clients. White-label solutions, wholesale pricing, and comprehensive support for businesses of all sizes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('BusinessInquiry')}>
                  <Button 
                    size="lg"
                    className="bg-[#8B7355] hover:bg-[#6B5A45] text-white rounded-full px-8 py-6 group"
                  >
                    Schedule a Call
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Contact')}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/5 rounded-full px-8 py-6"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                  alt="Business Meeting"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating card */}
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E5D4C8] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#8B7355]" />
                  </div>
                  <div>
                    <p className="text-2xl font-medium text-[#2D3A2D]">500+</p>
                    <p className="text-sm text-[#5A6B5A]">Business Partners</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
              Business <span className="font-medium text-[#8B7355]">Solutions</span>
            </h2>
            <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
              Flexible options designed to meet the needs of your business
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#F5F0E8] rounded-3xl p-8 h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#8B7355]/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#8B7355]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#2D3A2D] mb-3">{solution.title}</h3>
                  <p className="text-[#5A6B5A] mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#8B7355]" />
                        <span className="text-sm text-[#5A6B5A]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-6">
                Why Businesses <span className="font-medium text-[#8B7355]">Choose Us</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#8B7355]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#2D3A2D] mb-1">{benefit.title}</h3>
                        <p className="text-sm text-[#5A6B5A]">{benefit.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#8B7355] rounded-3xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-medium text-white mb-6">Industries We Serve</h3>
              <div className="grid grid-cols-2 gap-4">
                {industries.map((industry, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/90">
                    <CheckCircle className="w-5 h-5 text-white/60" />
                    <span>{industry}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#8B7355] to-[#6B5A45] rounded-3xl p-10 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Schedule a consultation with our business development team to discuss how we can help grow your wellness business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('BusinessInquiry')}>
                <Button 
                  size="lg"
                  className="bg-white text-[#8B7355] hover:bg-white/90 rounded-full px-8 py-6 group"
                >
                  Schedule a Call
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}