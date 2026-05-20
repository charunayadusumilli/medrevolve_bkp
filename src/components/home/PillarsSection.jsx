import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Stethoscope, GraduationCap, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pillars = [
  {
    index: '01',
    category: 'TELEHEALTH',
    title: 'White-Label Clinical Platform',
    description: 'Full telehealth infrastructure under your brand. Credentialed providers, e-prescribing, async/sync consultations, patient management, and 503A/B pharmacy integrations — for GLP-1, RUO, hormones, or any clinical vertical.',
    items: ['Provider Credentialing', 'Async + Video Consultations', 'E-Prescribe Engine', 'Patient CRM', 'Licensed Pharmacy Network'],
    icon: Stethoscope,
    href: 'TelehealthPlatform',
    bg: '#0F1A0F',
    accent: '#4A6741',
    light: '#A8C99B',
  },
  {
    index: '02',
    category: 'WEBSITE & MARKETING',
    title: 'Integrated Website Builder & Marketing',
    description: 'Done-for-you white-label website, SEO, email campaigns, CRM, and funnel automation — purpose-built for GLP-1, RUO, and wellness brands with built-in compliance controls.',
    items: ['White-Label Domain + Website', 'Email & SMS Marketing Automation', 'CRM & Lead Capture', 'SEO & Ad Campaign Ready', 'Compliant Content Templates'],
    icon: Rocket,
    href: 'ForBusiness',
    bg: '#0F140F',
    accent: '#5A7A5A',
    light: '#8FB88F',
  },
  {
    index: '03',
    category: 'COMPLIANCE & UNIVERSITY',
    title: 'LegitScript-Ready + Ongoing Support',
    description: 'End-to-end merchant compliance from LLC formation and LegitScript certification to payment processing. MedRevolve University gives your team ongoing training, SOPs, and support to stay compliant and grow.',
    items: ['LegitScript Certification', 'Payment Processing + Merchant Acct', 'LLC Formation', 'MedRevolve University Access', 'Dedicated Compliance Dashboard'],
    icon: GraduationCap,
    href: 'ForBusiness',
    bg: '#130F0F',
    accent: '#7A5A45',
    light: '#C9A88F',
  },
];

export default function PillarsSection() {
  return (
    <section className="bg-[#080808] border-t border-white/5">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20 border-b border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-4 font-medium">Platform Architecture</p>
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
              Build. Launch.<br />
              <span className="text-white/30">Stay Compliant.</span>
            </h2>
          </div>
          <p className="text-white/35 text-base max-w-sm leading-relaxed lg:text-right">
            MedRevolve is the complete operating platform for telehealth, GLP-1, RUO, and wellness businesses — from day one to scale.
          </p>
        </div>
      </div>

      {/* Pillar cards */}
      <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative flex flex-col p-10 lg:p-12 min-h-[480px] overflow-hidden"
              style={{ background: pillar.bg }}>
              {/* Subtle bg texture */}
              <div className="absolute inset-0 opacity-[0.06] z-0"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=40)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(135deg, ${pillar.bg} 40%, transparent 100%)` }} />

              {/* Index */}
              <div className="flex items-center justify-between mb-12 relative z-10">
                <span className="text-[10px] tracking-[0.35em] uppercase font-medium" style={{ color: pillar.light + '60' }}>
                  {pillar.index}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-medium px-3 py-1 border rounded-full" style={{ borderColor: pillar.accent + '40', color: pillar.light }}>
                  {pillar.category}
                </span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 relative z-10" style={{ background: pillar.accent + '20' }}>
                <Icon className="w-6 h-6" style={{ color: pillar.light }} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight relative z-10">{pillar.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1 relative z-10">{pillar.description}</p>

              {/* Feature list */}
              <ul className="space-y-2 mb-10 relative z-10">
                {pillar.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: pillar.light }} />
                    <span className="text-[13px] text-white/50">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={createPageUrl(pillar.href)}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-sm font-semibold tracking-wide group-hover:gap-3 transition-all relative z-10 cursor-pointer hover:underline"
                style={{ color: pillar.light }}>
                Explore {pillar.category}
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${pillar.accent}, transparent)` }} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}