import React from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PhoneCTA() {
  return (
    <section className="relative py-16 lg:py-24 px-6 lg:px-8 bg-[#0A0A0A] border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/30 rounded-full px-4 py-2 mb-6">
            <Phone className="w-4 h-4 text-[#6B8F5E]" />
            <span className="text-[#6B8F5E] text-xs font-bold uppercase tracking-widest">Talk to Our Team</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Ready to Launch?<br/>
            <span className="text-[#6B8F5E]">Let's Talk</span>
          </h2>
          
          <p className="text-white/50 text-base lg:text-lg mb-8 max-w-xl mx-auto">
            Speak with our platform specialists. Get answers, see demos, and start your journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/PhoneIntake">
              <button className="flex items-center gap-3 bg-[#4A6741] hover:bg-[#3D5636] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors rounded-lg">
                <Phone className="w-4 h-4" />
                Schedule a Call
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="tel:+12403875224" className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Or call now: 240-387-5224
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}