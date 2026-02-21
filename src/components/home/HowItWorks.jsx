import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Stethoscope, Package, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Take a 5-Minute Assessment',
    description: 'Tell us about your goals and health history. No doctor visit required — do it from your phone.',
    icon: ClipboardCheck,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=90',
    details: [
      'Takes under 5 minutes on any device',
      'Share your goals and health background',
      'No insurance or referral needed'
    ]
  },
  {
    number: '02',
    title: 'Get Matched With a Provider',
    description: 'A licensed clinician reviews your profile and creates a personalized treatment plan — just for you.',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=700&q=90',
    details: [
      'Board-certified physicians & NPs',
      'Personalized protocol, not generic scripts',
      'Async review — no waiting room'
    ]
  },
  {
    number: '03',
    title: 'Delivered. Coached. Supported.',
    description: 'Your treatment arrives discreetly in 24–48 hours. Your AI Health Coach and care team support you every step.',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1609899464926-da5a3b1d460f?w=700&q=90',
    details: [
      'Discreet delivery in 24–48 hours',
      'AI Health Coach between visits',
      'Ongoing adjustments as you progress'
    ]
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
            How It <span className="font-medium text-[#4A6741]">Works</span>
          </h2>
          <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
            Your wellness journey in three simple steps
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#4A6741] text-white shadow-xl shadow-[#4A6741]/20' 
                      : 'bg-[#F5F0E8] hover:bg-[#E8E0D5]'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-white/20' : 'bg-[#4A6741]/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-[#4A6741]'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-medium ${isActive ? 'text-white/70' : 'text-[#4A6741]'}`}>
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className={`text-xl font-medium mb-2 ${isActive ? 'text-white' : 'text-[#2D3A2D]'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${isActive ? 'text-white/80' : 'text-[#5A6B5A]'}`}>
                        {step.description}
                      </p>
                      
                      <AnimatePresence>
                        {isActive && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-2"
                          >
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                {detail}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <Link to={createPageUrl('Products')}>
              <Button 
                size="lg"
                className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6 mt-6 group"
              >
                Start Here
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Image */}
          <motion.div
            className="relative aspect-[4/5] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep}
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Step indicator */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                      index === activeStep ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}