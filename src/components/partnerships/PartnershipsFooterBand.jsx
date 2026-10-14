import React from 'react';
import { Phone } from 'lucide-react';

export default function PartnershipsFooterBand() {
  return (
    <section className="bg-[#A66B3C] py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <p className="text-white font-bold text-lg leading-snug">
          Operators: medrevolve.com/ForBusiness.<br className="sm:hidden" /> Partners: you're already here.
        </p>
        <a href="tel:+12403875224"
          className="inline-flex items-center gap-2 bg-white text-[#A66B3C] hover:bg-white/90 transition-colors px-7 py-3.5 text-sm font-bold rounded-none whitespace-nowrap">
          <Phone className="w-4 h-4" /> (240) 387-5224
        </a>
      </div>
    </section>
  );
}