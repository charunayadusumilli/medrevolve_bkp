import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Building2, FlaskConical, Megaphone, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const partnerTypes = [
  {
    icon: FlaskConical,
    label: 'PHARMACY NETWORK',
    title: 'NABP-Certified Compounding Pharmacies',
    body: 'Every pharmacy in our network is NABP-certified and PCAB-accredited. Your patients receive medications that meet the highest compounding standards, shipped in 24–48 hours.',
    stat: '40+',
    statLabel: 'Partner Pharmacies',
    img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=700&q=80',
    color: '#4A6741',
    href: 'PharmacyIntake',
  },
  {
    icon: Heart,
    label: 'PROVIDER NETWORK',
    title: '200+ Licensed & Credentialed Providers',
    body: 'MDs, DOs, NPs, and PAs across every US state — credentialed, insured, and experienced in weight management, hormone therapy, longevity, and integrative medicine.',
    stat: '200+',
    statLabel: 'Active Providers',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80',
    color: '#2A6B7A',
    href: 'ProviderIntake',
  },
  {
    icon: Megaphone,
    label: 'CREATOR NETWORK',
    title: 'Wellness Creators & Affiliate Partners',
    body: 'A curated network of health and wellness content creators ready to drive patient acquisition for your storefront. Performance-based commission structure with real-time tracking.',
    stat: '500+',
    statLabel: 'Creator Partners',
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80',
    color: '#7A5A45',
    href: 'ForCreators',
  },
  {
    icon: Building2,
    label: 'B2B PARTNERS',
    title: 'Med Spas, Clinics & Wellness Centers',
    body: 'White-label the full MedRevolve stack for your existing practice. Add telehealth, GLP-1 protocols, and peptide programs to your service menu without building any infrastructure.',
    stat: '200+',
    statLabel: 'Business Partners',
    img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&q=80',
    color: '#6B4A7A',
    href: 'ForBusiness',
  },
];

const techPartners = [
  { name: 'Stripe', cat: 'Payments' },
  { name: 'Twilio', cat: 'Communications' },
  { name: 'HubSpot', cat: 'CRM' },
  { name: 'Qualiphy', cat: 'Verification' },
  { name: 'Beluga Health', cat: 'Telehealth Rails' },
  { name: 'Google Workspace', cat: 'Operations' },
  { name: 'Zoho CRM', cat: 'Merchant CRM' },
  { name: 'DocuSign', cat: 'e-Signatures' },
];

export default function PartnershipsSection() {
  return (
    <section className="bg-[#080808] border-t border-white/5">

      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=50"
            alt="" className="w-full h-full object-cover opacity-[0.05]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 to-[#080808]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 py-20">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4 font-medium">Ecosystem</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
              Built on relationships.<br />
              <span className="text-white/25">Powered by trust.</span>
            </h2>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
              Every partnership in the MedRevolve ecosystem is vetted, contracted, and performance-monitored so you never have to worry about the network behind your brand.
            </p>
          </div>
        </div>
      </div>

      {/* Partner type cards */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
        <div className="grid md:grid-cols-2 gap-4">
          {partnerTypes.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-lg border border-white/5 hover:border-white/15 transition-all duration-500">

                {/* Background image */}
                <div className="absolute inset-0">
                  <img src={pt.img} alt={pt.title}
                    className="w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity duration-500"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#080808]/90 to-[#080808]/70" />
                </div>

                <div className="relative p-8 lg:p-10 flex flex-col h-full min-h-[260px]">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: pt.color + '20' }}>
                        <Icon className="w-4.5 h-4.5" style={{ color: pt.color }} />
                      </div>
                      <span className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: pt.color }}>{pt.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{pt.stat}</div>
                      <div className="text-[10px] text-white/25 tracking-[0.1em] uppercase">{pt.statLabel}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">{pt.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed flex-1 mb-6">{pt.body}</p>

                  <Link to={createPageUrl(pt.href)} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-colors group-hover:gap-3"
                      style={{ color: pt.color }}>
                      Join Network <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tech partners strip */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/20 mb-8 font-medium">Technology Partners</p>
          <div className="flex flex-wrap gap-3">
            {techPartners.map((tp, i) => (
              <motion.div key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/8 rounded-full hover:border-white/20 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="text-white/40 text-[11px] font-semibold">{tp.name}</span>
                <span className="text-white/15 text-[10px]">· {tp.cat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}