import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Pill, Truck, Stethoscope } from 'lucide-react';

const PRODUCT_PILLS = [
  { label: 'GLP-1 Weight Loss', icon: '🔥' },
  { label: "Men's Health / TRT", icon: '💪' },
  { label: "Women's Health / BHRT", icon: '🌸' },
  { label: 'Peptides / Longevity', icon: '🧬' },
  { label: 'Hair Health', icon: '✨' },
  { label: 'Skin Health', icon: '💆' },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, text: 'LegiScript Certified' },
  { icon: Stethoscope, text: 'US-Licensed Providers' },
  { icon: Pill, text: 'FDA-Compliant Pharmacy' },
  { icon: Truck, text: 'Delivered to Your Door' },
];

export default function DTCHero() {
  return (
    <section className="relative bg-gradient-to-b from-[#F0F7F5] to-white overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B8B7A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A9B6F]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-12 pt-12 lg:pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-[#0B8B7A]/10 border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#0B8B7A] animate-pulse" />
                <span className="text-[#0B8B7A] text-xs font-bold uppercase tracking-wider">LegiScript Certified · FDA-Compliant</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.05] mb-4" style={{ letterSpacing: '-0.03em' }}>
                Your health,<br />
                <span className="text-[#0B8B7A]">delivered to your door.</span>
              </h1>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 max-w-lg">
                Physician-supervised telehealth for weight loss, hormones, peptides, and longevity. Complete your online assessment, meet with a US-licensed provider, and get your medication delivered.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {PRODUCT_PILLS.map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700">
                    <span>{p.icon}</span> {p.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/shop">
                  <Button size="lg" className="bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg px-8 font-bold h-auto py-3.5">
                    Shop Products <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a href="tel:+12403875224">
                  <Button size="lg" variant="outline" className="rounded-lg px-6 font-bold h-auto py-3.5 border-gray-300">
                    Talk to Us: 240-387-5224
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TRUST_BADGES.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <badge.icon className="w-4 h-4 text-[#0B8B7A] flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Hero image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" alt="Telehealth consultation" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B8B7A]/20 to-transparent" />
            </div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[#0B8B7A]/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-[#0B8B7A]" />
                </div>
                <p className="text-xs font-bold text-gray-900">Free delivery</p>
              </div>
              <p className="text-[10px] text-gray-500">Medication shipped to your door in discreet packaging.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}