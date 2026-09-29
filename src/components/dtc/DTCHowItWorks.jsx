import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Video, Package } from 'lucide-react';

const STEPS = [
  { n: '01', icon: ClipboardList, title: 'Complete Your Assessment', desc: 'Answer a few health questions online. Takes about 5 minutes. No insurance required — simple cash-pay pricing.', color: '#0B8B7A' },
  { n: '02', icon: Video, title: 'Meet Your Provider', desc: 'Connect with a US-licensed physician via video or phone. They review your history and create a personalized plan.', color: '#4A9B6F' },
  { n: '03', icon: Package, title: 'Get It Delivered', desc: 'Your medication ships from an FDA-compliant, NABP-verified pharmacy — delivered to your door in discreet packaging.', color: '#2D6A9F' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function DTCHowItWorks() {
  return (
    <section className="py-16 lg:py-24 px-5 lg:px-12 bg-[#F8FAF9]">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-12">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#0B8B7A] border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A0A0A] mb-3" style={{ letterSpacing: '-0.03em' }}>
            Three steps to<br />
            <span className="text-[#0B8B7A]">feeling your best.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => (
            <motion.div key={step.n} {...fade(i * 0.1)} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#0B8B7A]/20 to-transparent" />
              )}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full mb-5"
                style={{ background: `${step.color}10`, border: `2px solid ${step.color}20` }}>
                <step.icon className="w-10 h-10" style={{ color: step.color }} />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center"
                  style={{ background: step.color }}>
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#0A0A0A] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}