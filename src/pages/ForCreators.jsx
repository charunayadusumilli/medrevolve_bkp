import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Users, DollarSign, BarChart3, Megaphone,
  Gift, Heart, Zap, CheckCircle, Star
} from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Competitive Commissions',
    description: 'Earn generous commissions on every sale made through your unique referral link.'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track your performance with detailed dashboards showing clicks, conversions, and earnings.'
  },
  {
    icon: Megaphone,
    title: 'Marketing Support',
    description: 'Access professional marketing materials, content templates, and brand assets.'
  },
  {
    icon: Gift,
    title: 'Exclusive Perks',
    description: 'Get early access to new products, exclusive discounts, and special promotions.'
  },
  {
    icon: Heart,
    title: 'Trusted Products',
    description: 'Recommend FDA-approved, science-backed wellness solutions your audience can trust.'
  },
  {
    icon: Zap,
    title: 'Quick Payouts',
    description: 'Get paid on time, every time. Multiple payout options available.'
  }
];

const steps = [
  { number: '01', title: 'Apply', description: 'Fill out a quick application to join our creator program' },
  { number: '02', title: 'Get Approved', description: 'Our team reviews applications within 24-48 hours' },
  { number: '03', title: 'Share', description: 'Use your unique link and marketing materials to promote' },
  { number: '04', title: 'Earn', description: 'Track your earnings and get paid monthly' }
];

const testimonials = [
  {
    name: 'Jessica T.',
    role: 'Fitness Influencer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    quote: 'Partnering with MedRevolve has been incredible. My audience trusts these products because they actually work.',
    followers: '250K'
  },
  {
    name: 'Marcus R.',
    role: 'Wellness Coach',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    quote: 'The commission structure is fantastic, and the support team is always there when I need them.',
    followers: '180K'
  }
];

export default function ForCreators() {
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
              <span className="inline-block text-sm font-medium text-[#4A6741] uppercase tracking-wide mb-4">
                For Creators
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2D3A2D] mb-6 leading-tight">
                Turn Your Influence Into <span className="font-medium text-[#4A6741]">Impact & Income</span>
              </h1>
              <p className="text-lg text-[#5A6B5A] mb-8">
                Partner with MedRevolve to share trusted wellness products with your audience. Earn competitive commissions while helping others on their health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8 py-6 group"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full px-8 py-6"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80"
                  alt="Creator"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stats */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4E5D7] flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#4A6741]" />
                  </div>
                  <div>
                    <p className="text-2xl font-medium text-[#2D3A2D]">5,000+</p>
                    <p className="text-sm text-[#5A6B5A]">Active Creators</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
              Why Partner With <span className="font-medium text-[#4A6741]">MedRevolve</span>
            </h2>
            <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
              We provide everything you need to succeed as a wellness ambassador
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#F5F0E8] rounded-3xl p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#4A6741]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#4A6741]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#2D3A2D] mb-2">{benefit.title}</h3>
                  <p className="text-[#5A6B5A]">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
              How It <span className="font-medium text-[#4A6741]">Works</span>
            </h2>
            <p className="text-lg text-[#5A6B5A]">
              Get started in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 text-center h-full">
                  <span className="text-5xl font-light text-[#4A6741]/20 block mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-medium text-[#2D3A2D] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#5A6B5A]">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6">
                    <ArrowRight className="w-6 h-6 text-[#4A6741]/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 lg:px-8 bg-[#4A6741]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Hear From Our <span className="font-medium">Creators</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">{testimonial.followers} followers</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
              Ready to Join Our <span className="font-medium text-[#4A6741]">Creator Community?</span>
            </h2>
            <p className="text-lg text-[#5A6B5A] mb-8">
              Apply today and start earning while making a real difference in people's lives.
            </p>
            <Button 
              size="lg"
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-10 py-6 text-base font-medium group"
            >
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}