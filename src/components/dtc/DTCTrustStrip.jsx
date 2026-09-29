import React from 'react';
import { ShieldCheck, Award, Lock, Stethoscope, Pill, MapPin } from 'lucide-react';

const BADGES = [
  { icon: ShieldCheck, text: 'LegiScript Certified', sub: 'Advertising compliance verified' },
  { icon: Award, text: 'FDA-Compliant', sub: '503A pharmacy network' },
  { icon: Lock, text: 'HIPAA Protected', sub: 'Your data is secure' },
  { icon: Stethoscope, text: 'US-Licensed Providers', sub: 'Board-certified physicians' },
  { icon: Pill, text: 'NABP-Verified Pharmacy', sub: 'Safe, regulated medications' },
  { icon: MapPin, text: 'All 50 States', sub: 'Coverage nationwide' },
];

export default function DTCTrustStrip() {
  return (
    <section className="py-10 px-5 lg:px-12 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">
          Trusted · Compliant · Physician-Supervised
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGES.map((badge, i) => (
            <div key={i} className="text-center">
              <badge.icon className="w-6 h-6 text-[#4A9B6F] mx-auto mb-2" />
              <p className="text-white text-xs font-bold mb-0.5">{badge.text}</p>
              <p className="text-white/30 text-[10px] leading-tight">{badge.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}