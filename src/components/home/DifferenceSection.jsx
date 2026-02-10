import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Building2, Leaf, Award, Clock } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Nationwide Doctors Network',
    description: 'Board certified physicians and medical providers are available to answer your questions and guide your journey.',
    color: '#4A6741'
  },
  {
    icon: Shield,
    title: 'Quality Ingredients',
    description: 'Our products adhere to the highest standards of medical compliance and regulation. NABP certified for your peace of mind.',
    color: '#6B8F5E'
  },
  {
    icon: Building2,
    title: 'Nationwide Pharmacy Network',
    description: 'We work with 503a pharmacy partners that are top-line and can scale with our fast-paced growth.',
    color: '#8B7355'
  }
];

const stats = [
  { value: '50k+', label: 'Happy Customers' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '3-5', label: 'Days Delivery' },
  { value: '24/7', label: 'Support Available' }
];

export default function DifferenceSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-sm font-medium text-[#4A6741] uppercase tracking-wide mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
            The <span className="font-medium text-[#4A6741]">MedRevolve</span> Difference
          </h2>
          <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
            We're committed to providing the highest quality wellness solutions with care and transparency
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E0D5]/50">
                  {/* Number */}
                  <span className="absolute top-6 right-6 text-6xl font-light text-[#4A6741]/10">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  
                  <h3 className="text-xl font-medium text-[#2D3A2D] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#5A6B5A] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div 
          className="bg-[#4A6741] rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-light text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}