import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Building2, Users } from 'lucide-react';

const tracks = [
  {
    id: 'creators',
    label: 'For Creators',
    headline: 'Turn your audience\ninto income',
    description: 'Partner with MedRevolve and earn commission by sharing products you believe in with your community.',
    cta: 'Join as Creator',
    href: 'ForCreators',
    icon: Sparkles,
    accent: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    tag: 'Up to 30% commission',
  },
  {
    id: 'business',
    label: 'For Businesses',
    headline: 'White-label wellness\nfor your brand',
    description: 'Offer telehealth and premium wellness products under your brand. Fast setup, full compliance support included.',
    cta: 'Explore Solutions',
    href: 'ForBusiness',
    icon: Building2,
    accent: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    tag: 'White-label ready',
  },
  {
    id: 'partners',
    label: 'For Partners',
    headline: 'Grow with a\ntrusted network',
    description: 'Pharmacies, clinics, and wellness providers — join our partner ecosystem and reach thousands of new patients.',
    cta: 'Become a Partner',
    href: 'PartnerSignup',
    icon: Users,
    accent: 'from-[#4A6741] to-[#6B8F5E]',
    bg: 'bg-[#4A6741]/5',
    border: 'border-[#4A6741]/10',
    tag: 'Revenue sharing',
  },
];

export default function PartnerEcosystem() {
  return (
    <section className="bg-[#FDFBF7] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest text-[#4A6741] uppercase mb-4">
            The MedRevolve Ecosystem
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D3A2D] leading-tight">
            Build with us
          </h2>
          <p className="mt-4 text-lg text-[#5A6B5A] max-w-xl mx-auto">
            Whether you create content, run a business, or operate a clinic — there's a place for you inside MedRevolve.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={createPageUrl(track.href)} className="group block h-full">
                  <div className={`h-full rounded-3xl ${track.bg} border ${track.border} p-8 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    {/* Icon + Tag */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${track.accent} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-white/60 px-3 py-1 rounded-full border">
                        {track.tag}
                      </span>
                    </div>

                    {/* Label */}
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      {track.label}
                    </span>

                    {/* Headline */}
                    <h3 className="text-2xl font-bold text-[#2D3A2D] leading-snug whitespace-pre-line">
                      {track.headline}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#5A6B5A] leading-relaxed flex-1">
                      {track.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-semibold text-sm text-[#2D3A2D] group-hover:gap-3 transition-all">
                      {track.cta}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}