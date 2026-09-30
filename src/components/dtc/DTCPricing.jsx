import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Initial Consultation',
    price: '$199',
    period: 'one-time',
    desc: 'Meet with a US-licensed provider to discuss your health goals and get a personalized treatment plan.',
    features: ['Video or phone consultation', 'Health history review', 'Personalized treatment plan', 'Lab order if needed', 'No insurance required'],
    cta: 'Book Consultation',
    highlight: false,
  },
  {
    name: 'GLP-1 Weight Loss',
    price: '$399',
    period: 'per month',
    desc: 'Complete GLP-1 weight loss program including medication, provider access, and ongoing support.',
    features: ['Monthly GLP-1 medication', 'Unlimited provider messages', 'Progress monitoring', 'Nutrition guidance', 'Free delivery'],
    cta: 'Start Weight Loss',
    highlight: true,
  },
  {
    name: 'Hormone Therapy',
    price: '$199',
    period: 'per month',
    desc: 'TRT or BHRT program with lab testing, medication, and ongoing provider supervision.',
    features: ['Lab testing included', 'Monthly medication', 'Provider follow-ups', 'Dose adjustments', 'Free delivery'],
    cta: 'Start Hormone Therapy',
    highlight: false,
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function DTCPricing() {
  return (
    <section className="py-16 lg:py-24 px-5 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-12">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#0B8B7A] border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A0A0A] mb-3" style={{ letterSpacing: '-0.03em' }}>
            No insurance needed.<br />
            <span className="text-[#0B8B7A]">No hidden fees.</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            Simple monthly pricing. Cancel anytime. All programs include provider access and free delivery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} {...fade(i * 0.1)}
              className={`relative rounded-2xl p-6 border-2 transition-all ${
                plan.highlight
                  ? 'border-[#0B8B7A] bg-gradient-to-b from-[#0B8B7A]/5 to-white shadow-xl scale-[1.02]'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
              }`}>
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B8B7A] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-black text-[#0A0A0A] mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-black text-[#0A0A0A]">{plan.price}</span>
                <span className="text-sm text-gray-400 font-medium">/ {plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0B8B7A] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/shop" className="block">
                <Button className={`w-full rounded-lg font-bold h-auto py-3 ${plan.highlight ? 'bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                  {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}