import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PlatformCTABand() {
  return (
    <section className="bg-[#A66B3C] py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8" style={{ letterSpacing: '-0.02em' }}>
          Your Brand. Our Rails.
        </h2>
        <Link to="/ForBusiness">
          <button className="bg-white text-[#1F2D27] hover:bg-white/90 transition-colors px-10 py-4 text-sm font-bold rounded-none inline-flex items-center justify-center gap-2">
            Launch Your Brand <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <p className="mt-7 text-white/80 text-sm">
          Interested in a partnership?{' '}
          <Link to="/Partnerships" className="font-bold underline underline-offset-4 hover:text-white">
            See /Partnerships.
          </Link>
        </p>
      </div>
    </section>
  );
}