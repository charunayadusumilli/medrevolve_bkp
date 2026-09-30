import React from 'react';
import { motion } from 'framer-motion';
import EditorialImage from './EditorialImage';

const PHASES = [
  { n: '01', label: 'Company Foundation', title: 'We set up your business infrastructure', desc: 'LLC formation, business banking, EIN, domain, brand identity, and a high-risk merchant account — your operational entity ready to receive money.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80' },
  { n: '02', label: 'Website & Storefront', title: 'Your branded platform goes live', desc: 'Custom domain, program pages, HIPAA-compliant intake, patient portal, secure checkout, and SEO-ready structure — live and accepting patients.', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80' },
  { n: '03', label: 'Backend Integration', title: 'Providers, pharmacy & automation wired in', desc: 'Board-certified physicians, licensed 503A pharmacy, e-prescribing, EMR, scheduling, CRM sync, and SMS automations — end-to-end care.', img: 'https://images.unsplash.com/photo-1576091160399-1ba397bb6b07?w=800&q=80' },
  { n: '04', label: 'Marketing Engine', title: 'Acquisition & revenue automation', desc: 'Ad account structure, LegitScript process, creator/affiliate system, email drips, SMS flows, and analytics — an automated engine converting leads.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' },
  { n: '05', label: 'Compliance & Scale', title: 'Compliance lock-in & growth operations', desc: 'HIPAA docs & BAAs, consent library, state prescribing monitoring, automated audits, and monthly operations review — scale confidently.', img: 'https://images.unsplash.com/photo-1450101499163-1f9a1c5e2c99?w=800&q=80' },
];

export default function EditorialJourney() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">The build process</span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mt-3" style={{ letterSpacing: '-0.02em' }}>
            From zero to operating.
          </h2>
          <p className="text-stone-500 mt-3 text-sm">Five phases. One partner. Everything done for you.</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 hidden md:block" />
          <div className="space-y-14">
            {PHASES.map((p, i) => (
              <motion.div key={p.n}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 md:px-8">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden">
                    <EditorialImage src={p.img} alt={p.label} className="w-full h-full" />
                  </div>
                </div>
                <div className="md:w-1/2 md:px-8">
                  <span className="font-display text-3xl text-stone-300">{p.n}</span>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 mt-1">{p.label}</p>
                  <h3 className="font-display text-2xl text-[#1A1A1A] mt-2 mb-2">{p.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}