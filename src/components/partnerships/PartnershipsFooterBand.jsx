import { BOOKING_URL } from '@/lib/contactConfig';
import React from 'react';
import { MessageCircle } from 'lucide-react';
import WhatsAppLink from '@/components/WhatsAppLink';

export default function PartnershipsFooterBand() {
  return (
    <section className="bg-[#A66B3C] py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <p className="text-white font-bold text-lg leading-snug">
          Operators: medrevolve.com/ForBusiness.<br className="sm:hidden" /> Partners: you're already here.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#A66B3C] hover:bg-white/90 transition-colors px-7 py-3.5 text-sm font-bold rounded-none whitespace-nowrap">
            Book a Demo
          </a>
          <WhatsAppLink
            className="inline-flex items-center gap-2 border border-white/60 text-white hover:bg-white/10 transition-colors px-6 py-3.5 text-sm font-bold rounded-none whitespace-nowrap">
            <MessageCircle className="w-4 h-4" />
            Message us on WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}