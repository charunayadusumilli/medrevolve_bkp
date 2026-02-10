import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ClipboardCheck, Stethoscope, Package, 
  MessageCircle, Shield, Clock, Check, Leaf
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Complete Health Questionnaire',
    description: 'Start by creating your profile and completing a comprehensive health questionnaire. This helps us understand your unique health history, goals, and needs.',
    icon: ClipboardCheck,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    details: [
      'Create your secure account',
      'Answer questions about your medical history',
      'Share your wellness goals',
      'Upload any relevant health documents'
    ]
  },
  {
    number: '02',
    title: 'Medical Review',
    description: 'A licensed, board-certified physician reviews your health information and determines the best treatment plan for your specific needs.',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
    details: [
      'Review by licensed physician',
      'Personalized treatment recommendation',
      'Custom dosage determination',
      'Follow-up communication if needed'
    ]
  },
  {
    number: '03',
    title: 'Pharmacy Fulfillment',
    description: 'Once approved, your prescription is sent to our partner pharmacy for fulfillment. Your medication arrives at your door in discreet packaging.',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1580281657702-257584239a55?w=600&q=80',
    details: [
      'NABP-certified pharmacy partners',
      'Discreet, secure packaging',
      'Fast 3-5 day shipping',
      'Temperature-controlled when needed'
    ]
  },
  {
    number: '04',
    title: 'Ongoing Support',
    description: 'Your journey doesn\'t end with delivery. Our medical team is available for questions, adjustments, and continued care throughout your treatment.',
    icon: MessageCircle,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    details: [
      '24/7 messaging with care team',
      'Regular check-ins and progress tracking',
      'Easy prescription refills',
      'Dosage adjustments as needed'
    ]
  }
];

const benefits = [
  { icon: Shield, title: 'Licensed Providers', description: 'Board-certified physicians in your state' },
  { icon: Clock, title: 'Fast Turnaround', description: 'Same-day medical review, 3-5 day delivery' },
  { icon: Leaf, title: 'Quality Products', description: 'FDA-approved medications from certified pharmacies' }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="pt-12 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2D3A2D] mb-6">
              Your Wellness Journey <span className="font-medium text-[#4A6741]">Made Simple</span>
            </h1>
            <p className="text-lg text-[#5A6B5A]">
              From consultation to delivery, we've streamlined every step to make your path to better health as effortless as possible.
            </p>
          </motion.div>

          {/* Benefits Bar */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#4A6741]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D3A2D]">{benefit.title}</h3>
                    <p className="text-sm text-[#5A6B5A]">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 1;
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-20 last:mb-0"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={isEven ? 'lg:order-2' : ''}>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                      <img 
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 left-6 w-16 h-16 rounded-2xl bg-[#4A6741] flex items-center justify-center">
                        <span className="text-2xl font-light text-white">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={isEven ? 'lg:order-1' : ''}>
                    <div className="w-14 h-14 rounded-2xl bg-[#4A6741]/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#4A6741]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-[#5A6B5A] mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#D4E5D7] flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-[#4A6741]" />
                          </div>
                          <span className="text-[#5A6B5A]">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-[#4A6741]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Take the first step towards better health today. Our process is simple, secure, and designed with your wellness in mind.
            </p>
            <Link to={createPageUrl('Products')}>
              <Button 
                size="lg"
                className="bg-white text-[#4A6741] hover:bg-white/90 rounded-full px-10 py-6 text-base font-medium group"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}