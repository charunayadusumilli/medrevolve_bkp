import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, CheckCircle } from 'lucide-react';

const WHAT_YOU_GET = [
  '1-hour live guided setup call with a MedRevolve specialist',
  'Full platform architecture walkthrough for your business',
  'Compliance & legal structure guidance',
  'Provider & pharmacy network introduction',
  'Payment processing & merchant account setup plan',
  'Marketing & launch strategy built for your niche',
];

export default function B2BFinalCTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#0f1f0f] via-[#0A0A0A] to-[#0A0A0A]">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#A8C99B] border border-[#A8C99B]/20 rounded-full px-4 py-1.5 mb-5">
              Start Here
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Ready to Launch<br />
              Your Telehealth<br />
              <span className="text-[#A8C99B]">Business?</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Book your $100 onboarding consultation. One hour. Everything mapped out. Your platform in motion within days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/MerchantOnboarding">
                <Button size="lg"
                  className="bg-white text-[#060606] hover:bg-white/90 rounded-sm font-black text-base px-10 h-auto py-4">
                  Book $100 Setup Call <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+12403875224">
                <Button size="lg" variant="ghost"
                  className="text-white border border-white/15 hover:bg-white/8 rounded-sm px-8 text-base h-auto py-4">
                  <Phone className="w-4 h-4 mr-2" /> Call Now
                </Button>
              </a>
            </div>

            <p className="text-white/20 text-xs">
              MedRevolve is a services company. We do not sell pharmaceutical products. All clinical services are provided by independently licensed providers and pharmacies.
            </p>
          </motion.div>

          {/* Right: What you get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white font-black text-2xl">$100</p>
                  <p className="text-white/30 text-xs">Onboarding Consultation</p>
                </div>
                <span className="text-[10px] font-black text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-3 py-1">
                  ONE-TIME
                </span>
              </div>

              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">What's Included</p>
              <ul className="space-y-3 mb-6">
                {WHAT_YOU_GET.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                    <span className="text-white/60 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-5">
                <p className="text-white/30 text-xs mb-3">After the consultation:</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Platform setup</span>
                  <span className="text-white font-bold">$5,000 one-time</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-white/50">Monthly operations</span>
                  <span className="text-white font-bold">$2,500 / mo</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}