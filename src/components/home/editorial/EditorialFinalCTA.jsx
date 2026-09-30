import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle } from 'lucide-react';

const WHAT_YOU_GET = [
  '1-on-1 strategy consultation with a MedRevolve specialist',
  'Full walkthrough of your branded telehealth platform',
  'Provider & licensed pharmacy network setup covered',
  'Compliance, HIPAA & legal structure reviewed',
  'Personalized launch roadmap for your business',
  'No long-term commitment — pay only for the consultation',
];

export default function EditorialFinalCTA() {
  return (
    <section className="bg-[#F9F7F2] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#F1ECE3] rounded-3xl p-10 md:p-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">Start here</span>
              <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mt-3 mb-4" style={{ letterSpacing: '-0.02em' }}>
                Ready to launch your telehealth business?
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-7">
                Book a 1-on-1 strategy consultation. We'll walk through your branded platform, providers, pharmacy, compliance, and payments — then build your launch roadmap. $199 one-time, no long-term commitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/MerchantOnboarding">
                  <button className="bg-[#1A1A1A] text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-black transition-colors">
                    Book a Demo <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                </Link>
                <a href="#qualify">
                  <button className="bg-white text-[#1A1A1A] rounded-full px-7 py-3.5 text-sm font-semibold border border-stone-300 hover:border-stone-400 transition-colors">
                    See if you qualify
                  </button>
                </a>
                <a href="tel:+12403875224" className="inline-flex items-center justify-center text-sm font-semibold text-[#1A1A1A] hover:text-stone-500 transition-colors py-3.5">
                  <Phone className="w-4 h-4 mr-1.5" /> Call
                </a>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-stone-200">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-display text-2xl text-[#1A1A1A]">$199 One-Time</p>
                  <p className="text-stone-400 text-xs">B2B Strategy Consultation</p>
                </div>
                <span className="text-[10px] font-black text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">CONSULT</span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-3">What's included</p>
              <ul className="space-y-2.5 mb-5">
                {WHAT_YOU_GET.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                    <span className="text-stone-600 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-100 pt-4 text-sm">
                <div className="flex items-center justify-between"><span className="text-stone-500">Specialist calls you</span><span className="font-semibold text-[#1A1A1A]">Within 24 hrs</span></div>
                <div className="flex items-center justify-between mt-1"><span className="text-stone-500">Launch roadmap</span><span className="font-semibold text-[#1A1A1A]">Delivered on the call</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}