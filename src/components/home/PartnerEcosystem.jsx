import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Building2, Users, Stethoscope } from 'lucide-react';

const tracks = [
  {
    id: 'partner',
    label: 'Partner Program',
    headline: 'Add Telehealth to\nYour Business',
    description: 'Gyms, spas, salons & clinics earn on every qualified patient. White-label, no inventory, no medical liability. Earn up to $40,000/mo.',
    cta: 'View Partner Program',
    href: 'PartnerProgram',
    icon: Building2,
    accent: 'from-[#4A6741] to-[#6B8F5E]',
    bg: 'bg-[#4A6741]/5',
    border: 'border-[#4A6741]/10',
    tag: 'Earn $1,200–$40,000/mo',
  },
  {
    id: 'creators',
    label: 'For Creators',
    headline: 'Turn Your Audience\nInto Income',
    description: 'Partner with MedRevolve and earn 10–25% recurring commission by sharing products you believe in with your community.',
    cta: 'Join as Creator',
    href: 'ForCreators',
    icon: Sparkles,
    accent: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    tag: 'Up to 25% commission',
  },
  {
    id: 'providers',
    label: 'Providers & Pharmacies',
    headline: 'Expand Your\nPractice Online',
    description: 'Licensed physicians, NPs, and compounding pharmacies join our nationwide network. Flexible models, full compliance support.',
    cta: 'Apply Now',
    href: 'ProviderIntake',
    icon: Stethoscope,
    accent: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    tag: 'Nationwide network',
  },
];

export default function PartnerEcosystem() {
  return (
    <section className="bg-[#FDFBF7] py-24 px-6">
      <div className="max-w-7xl mx-auto">
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
                  <div className={`h-full rounded-3xl ${track.bg} border ${track.border} p-8 flex flex-col gap-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${track.accent} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-white/80 px-3 py-1 rounded-full border">
                        {track.tag}
                      </span>
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      {track.label}
                    </span>

                    <h3 className="text-2xl font-bold text-[#2D3A2D] leading-snug whitespace-pre-line">
                      {track.headline}
                    </h3>

                    <p className="text-sm text-[#5A6B5A] leading-relaxed flex-1">
                      {track.description}
                    </p>

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