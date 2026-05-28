import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';

const PROOF_POINTS = [
  'Website + storefront in 7 days',
  'Licensed providers — all 50 states',
  'Pharmacy network included',
  'HIPAA compliant by default',
  'Full merchant account setup',
];

export default function B2BHero() {
  return (
    <section className="relative bg-[#060606] overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=1800&q=40)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/95 to-[#060606]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest">
                Telehealth Business Infrastructure
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6"
              style={{ letterSpacing: '-0.03em' }}>
              We Build Your<br />
              Telehealth<br />
              <span className="text-[#A8C99B]">Business.</span>
            </h1>

            <p className="text-lg text-white/45 leading-relaxed mb-4 max-w-lg">
              MedRevolve is a B2B services company. We deliver the complete infrastructure for a compliant, operating telehealth platform — under your brand, in your name.
            </p>
            <p className="text-sm text-white/25 mb-10 max-w-md">
              Website. Providers. Pharmacy. Merchant account. Compliance. Marketing engine. Done for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/MerchantOnboarding">
                <Button size="lg"
                  className="bg-white text-[#060606] hover:bg-white/90 rounded-sm px-10 font-black text-base h-auto py-4">
                  Book Your $100 Setup Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+12403875224">
                <Button size="lg" variant="ghost"
                  className="text-white border border-white/15 hover:bg-white/8 hover:border-white/30 rounded-sm px-8 text-base h-auto py-4">
                  <Phone className="w-4 h-4 mr-2" /> 240-387-5224
                </Button>
              </a>
            </div>

            {/* Proof points */}
            <div className="flex flex-col gap-2">
              {PROOF_POINTS.map(p => (
                <span key={p} className="flex items-center gap-2 text-sm text-white/40">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" />
                  {p}
                </span>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}