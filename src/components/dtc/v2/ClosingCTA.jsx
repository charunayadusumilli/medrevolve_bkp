import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { V2_IMAGES } from './brand';

const TRUST = ['US-licensed providers', 'Licensed US pharmacies', 'HIPAA-secure platform', 'Free discreet shipping'];

export default function ClosingCTA() {
  return (
    <section className="bg-dtc-page py-20 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden bg-mr-forest grid lg:grid-cols-2">
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <h2 className="font-display text-4xl lg:text-5xl text-white leading-tight">Your plan starts with five minutes.</h2>
          <p className="text-white/70 mt-4 max-w-md">Answer a few questions and see options a provider can review for you.</p>
          <Link to="/start" className="mt-8 self-start inline-flex items-center gap-2 rounded-full bg-white text-mr-ink hover:bg-mr-cream font-medium px-8 py-4 transition-colors">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {TRUST.map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-white/80">
                <ShieldCheck className="w-4 h-4 text-white/60" /> {t}
              </div>
            ))}
          </div>
        </div>
        <div className="min-h-[320px]">
          <img src={V2_IMAGES.jogging} alt="Couple jogging at sunrise" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}