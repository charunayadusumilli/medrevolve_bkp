import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, ShieldCheck } from 'lucide-react';

export default function DTCFinalCTA() {
  return (
    <section className="py-16 lg:py-24 px-5 lg:px-12 bg-gradient-to-br from-[#0B8B7A] to-[#0A6B5E]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">LegiScript Certified · FDA-Compliant · HIPAA Protected</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Start your health<br />
            journey today.
          </h2>

          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-8">
            Take the first step. Complete your free assessment and a US-licensed provider will create your personalized plan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/CustomerIntake">
              <Button size="lg" className="bg-white text-[#0B8B7A] hover:bg-white/90 rounded-lg px-8 font-black h-auto py-3.5">
                Start Free Assessment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="tel:+12403875224">
              <Button size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white/10 rounded-lg px-6 font-bold h-auto py-3.5">
                <Phone className="mr-2 w-4 h-4" /> 240-387-5224
              </Button>
            </a>
          </div>

          <p className="text-white/50 text-xs mt-6">No insurance required · Cancel anytime · All 50 states</p>
        </motion.div>
      </div>
    </section>
  );
}