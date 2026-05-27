import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle, Shield, Zap, Globe, Package,
  Stethoscope, Pill, ChevronRight, Building2, Users, BarChart3,
  CreditCard, Lock, Truck, FlaskConical, Video, FileText,
  Megaphone, Star, Store, Layers, Link2, ShieldCheck
} from 'lucide-react';

// ── Section data ─────────────────────────────────────────────────────────────

const PRODUCT_TRACKS = [
  {
    id: 'glp',
    label: 'GLP-1 & Rx Telehealth',
    tag: 'Prescription Required',
    tagColor: '#B85C38',
    icon: Stethoscope,
    color: '#2D6A9F',
    light: '#D0E8F5',
    headline: 'Full Prescription Commerce Stack',
    body: 'Sell physician-supervised GLP-1s, hormones, and Rx compounds through a fully compliant telehealth funnel. Every order flows through a licensed provider visit, then routes to a licensed 503A compounding pharmacy.',
    products: ['Physician-Supervised GLP-1 Programs', 'Combination Weight Management Protocols', 'Testosterone Optimization Programs', 'Bioidentical Hormone Replacement Programs', 'Growth Hormone Secretagogue Programs', 'Custom Physician-Directed Protocols'],
    requirements: ['Licensed provider on platform', '503A or 503B pharmacy partner', 'HIPAA-compliant checkout', 'State-by-state Rx laws covered'],
    cta: 'Start GLP-1 Platform',
    link: 'MerchantOnboarding',
  },

];

const STOREFRONT_MODES = [
  {
    icon: Globe,
    title: 'Online-First Storefront',
    desc: 'A fully hosted, SEO-optimized storefront under your domain. Program pages, intake flows, checkout, and patient portal — live within 7 business days.',
    features: ['Custom domain (yourname.com)', 'SEO-optimized program pages', 'Mobile-first checkout', 'Integrated patient portal', 'Subscription & one-time billing'],
  },
  {
    icon: Store,
    title: 'Embedded In-Clinic Kiosk',
    desc: 'Embed the storefront into your existing clinic or spa website as an iframe or native integration. Patients order without leaving your ecosystem.',
    features: ['White-label iframe embed', 'Match your brand exactly', 'QR code intake flows', 'In-person + online unified', 'Staff ordering dashboard'],
  },
  {
    icon: Megaphone,
    title: 'Creator & Affiliate Funnel',
    desc: 'Give creators and medical reps unique referral links tied to your storefront. Every sale is tracked, attributed, and auto-comped.',
    features: ['Unique affiliate links', 'Auto commission payouts', 'Creator dashboard', 'Conversion analytics', 'SMS + email drip sequences'],
  },
];

const PROVIDER_INTEGRATIONS = [
  {
    icon: Stethoscope,
    role: 'MDs & NPs',
    desc: 'Board-certified physicians and nurse practitioners who prescribe, supervise, and manage patient protocols within your white-label brand.',
    integrations: ['EMR access', 'E-prescribing', 'Video consults', 'Async messaging'],
    color: '#2D6A9F',
  },
  {
    icon: Users,
    role: 'Medical Representatives',
    desc: 'Territory reps who onboard clinics, demo the platform, and drive B2B account acquisition for your merchant network.',
    integrations: ['CRM sync (HubSpot/Zoho)', 'Commission tracking', 'Demo account access', 'Branded sales collateral'],
    color: '#4A6741',
  },
  {
    icon: Star,
    role: 'Creators & Influencers',
    desc: 'Content creators who promote your brand and products to their audience via unique affiliate links with tracked conversions.',
    integrations: ['Unique storefront links', 'Real-time analytics', 'Auto payouts', 'Creator media kit'],
    color: '#7B5EA7',
  },
  {
    icon: Shield,
    role: 'Compliance Officers',
    desc: 'Embedded compliance monitoring via PEPMD — automated audits, documentation management, and state-law alerts.',
    integrations: ['PEPMD integration', 'State Rx law alerts', 'Audit trail logs', 'Document vault'],
    color: '#B85C38',
  },
];

const PHARMACY_B2B = [
  {
    icon: Building2,
    title: '503A Compounding Pharmacies',
    desc: 'Patient-specific compounding partners who fulfill individual Rx orders. Ideal for GLP-1, hormone, and peptide protocols.',
    tags: ['Individual Rx fulfillment', 'Custom compound formulations', 'State-licensed', 'PCAB accredited'],
  },
  {
    icon: Package,
    title: 'Licensed Pharmacy Network',
    desc: 'Our network of NABP-verified, state-licensed pharmacies fulfills patient-specific compounded prescriptions issued by licensed providers on the platform.',
    tags: ['Patient-specific Rx only', 'State-licensed', 'NABP-verified', 'Licensed provider required'],
  },
  {
    icon: Truck,
    title: 'Logistics & Cold Chain',
    desc: 'Temperature-controlled shipping, batch-level COA documentation, customs compliance, and branded last-mile delivery.',
    tags: ['Cold-chain certified', 'COA per batch', 'Branded packaging', '2–5 day delivery'],
  },
  {
    icon: BarChart3,
    title: 'Inventory & Auto-Reorder',
    desc: 'Real-time inventory tracking with auto-reorder triggers, supplier management, and multi-pharmacy routing for backup fulfillment.',
    tags: ['Low-stock alerts', 'Auto-reorder rules', 'Multi-pharmacy routing', 'Supplier dashboard'],
  },
];

const TECH_INTEGRATIONS = [
  { name: 'Secure Payments', cat: 'Payments', icon: CreditCard, desc: 'Secure payment processing through licensed high-risk healthcare merchant accounts with PCI-compliant checkout, subscriptions, and split payouts' },
  { name: 'HubSpot', cat: 'CRM', icon: BarChart3, desc: 'Auto-sync leads, contacts, and deals from every form submission' },
  { name: 'Zoho CRM', cat: 'CRM', icon: Users, desc: 'Workflow automation and B2B account management' },
  { name: 'Twilio', cat: 'Communications', icon: Zap, desc: 'SMS, voice, and WhatsApp patient communications' },
  { name: 'Google Calendar', cat: 'Scheduling', icon: Video, desc: 'Provider availability and appointment sync' },
  { name: 'Zapier', cat: 'Automation', icon: Link2, desc: '5,000+ app integrations via webhook automation' },
  { name: 'Qualiphy', cat: 'eConsent', icon: FileText, desc: 'Digital consent forms and identity verification' },
  { name: 'Google Drive', cat: 'Documents', icon: Layers, desc: 'Compliance document storage and intake form archiving' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ tag, title, sub }) {
  return (
    <div className="text-center mb-16">
      {tag && <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">{tag}</p>}
      <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">{title}</h2>
      {sub && <p className="text-[#5A6B5A] text-lg max-w-2xl mx-auto">{sub}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ForBusiness() {
  const [activeTrack, setActiveTrack] = useState('glp');
  const track = PRODUCT_TRACKS.find(t => t.id === activeTrack);
  const TrackIcon = track.icon;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="B2B Telehealth Services | Launch Your Telehealth Business | MedRevolve"
        description="MedRevolve builds compliant telehealth businesses for wellness operators. Website, providers, pharmacy integration, merchant accounts, and compliance — end to end."
      />

      {/* ── Hero ── */}
      <section className="relative bg-[#060606] pt-20 pb-28 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=40)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/70 to-[#060606]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
              <Building2 className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">Full-Service Telehealth Business Infrastructure</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-none" style={{ letterSpacing: '-0.03em' }}>
              We Build Your Business.<br />
              <span className="text-[#A8C99B]">You Own the Brand.</span>
            </h1>
            <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
              MedRevolve is a B2B services company. We build compliant telehealth platforms for wellness operators — website, provider integration, pharmacy network, merchant accounts, and compliance, all set up under your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('MerchantOnboarding')}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">
                  Launch Your Platform <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base">
                  Talk to Sales
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-10 mt-14">
              {[
                { v: '7 Days', l: 'Avg. setup time' },
                { v: '503A', l: 'Compounding pharmacy' },
                { v: '50 States', l: 'Covered' },
                { v: 'White-Label', l: 'Your brand' },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-xl font-black text-white">{s.v}</p>
                  <p className="text-white/30 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 1: Products & Classification ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="Platform Types We Build"
            title={<>The Service We Deliver — <span className="font-semibold text-[#4A6741]">Your Telehealth Platform</span></>}
            sub="We specialize in building GLP-1 and physician-supervised telehealth platforms — with every compliance, provider, and pharmacy integration included."
          />

          {/* Track Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {PRODUCT_TRACKS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTrack(t.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-semibold transition-all ${
                    activeTrack === t.id
                      ? 'text-white border-transparent shadow-lg'
                      : 'text-[#5A6B5A] border-[#E8E0D5] bg-white hover:border-[#4A6741]/40'
                  }`}
                  style={{ background: activeTrack === t.id ? t.color : undefined }}>
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Active Track Detail */}
          <motion.div
            key={activeTrack}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: track.tagColor }}>
                  {track.tag}
                </span>
              </div>
              <h3 className="text-3xl font-light text-[#2D3A2D] mb-4">{track.headline}</h3>
              <p className="text-[#5A6B5A] leading-relaxed mb-8">{track.body}</p>

              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#5A6B5A] mb-3">Compliance Requirements</p>
                <ul className="space-y-2">
                  {track.requirements.map(r => (
                    <li key={r} className="flex items-center gap-2.5 text-sm text-[#2D3A2D]">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: track.color }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={createPageUrl(track.link)}>
                <Button className="rounded-none text-white px-8 font-bold" style={{ background: track.color }}>
                  {track.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5A6B5A] mb-4">Products In This Category</p>
              <div className="grid grid-cols-2 gap-2">
                {track.products.map(p => (
                  <div key={p} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#E8E0D5] bg-[#FDFBF7] text-sm text-[#2D3A2D]">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: track.color }} />
                    {p}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-[#E8E0D5] flex items-center gap-3">
                <TrackIcon className="w-5 h-5" style={{ color: track.color }} />
                <p className="text-xs text-[#5A6B5A]">Full product catalog available in your merchant dashboard after onboarding.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Storefront Guidelines ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="Storefront & Online Guidelines"
            title={<>Your Store, Your Rules — <span className="font-semibold text-[#4A6741]">Three Ways to Sell</span></>}
            sub="Whether you're pure online, embedded in a clinic, or running a creator-powered funnel — each mode has dedicated tools and guidelines."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {STOREFRONT_MODES.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div key={mode.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-7 border border-[#E8E0D5] shadow-sm hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#4A6741]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2D3A2D] mb-3">{mode.title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed mb-6">{mode.desc}</p>
                  <ul className="space-y-2">
                    {mode.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#2D3A2D]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to={createPageUrl('MerchantDemo')}>
              <Button variant="outline" className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-none px-10">
                See Live Demo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 3: Provider Integrations ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="Provider Ecosystem"
            title={<>Everyone Who Touches <span className="font-semibold text-[#4A6741]">Your Platform</span></>}
            sub="MedRevolve integrates every type of partner — from prescribing physicians to content creators — into one unified operator dashboard."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {PROVIDER_INTEGRATIONS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.role} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-7 border border-[#E8E0D5] hover:shadow-lg transition-all flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: p.color + '18' }}>
                    <Icon className="w-6 h-6" style={{ color: p.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">{p.role}</h3>
                    <p className="text-[#5A6B5A] text-sm leading-relaxed mb-4">{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.integrations.map(tag => (
                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ color: p.color, borderColor: p.color + '40', background: p.color + '0D' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl('ProviderIntake')}>
              <Button className="bg-[#2D6A9F] hover:bg-[#245980] text-white rounded-none px-8">Join as Provider</Button>
            </Link>
            <Link to={createPageUrl('ForCreators')}>
              <Button variant="outline" className="border-[#7B5EA7] text-[#7B5EA7] hover:bg-[#7B5EA7]/5 rounded-none px-8">Become a Creator</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Pharmacy B2B ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-3">Pharmacy & Logistics</p>
            <h2 className="text-4xl font-light text-white mb-4">
              The B2B Fulfillment <span className="font-semibold text-[#A8C99B]">Backbone</span>
            </h2>
            <p className="text-white/45 text-lg max-w-2xl mx-auto">
              From compounding to cold-chain delivery — MedRevolve connects your merchant storefront directly to verified pharmacy infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {PHARMACY_B2B.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-white/25 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#A8C99B]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to={createPageUrl('PharmacyIntake')}>
              <Button className="bg-[#A8C99B] text-[#0A1628] hover:bg-[#8FB88F] rounded-none px-10 font-bold">
                Partner as a Pharmacy <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Tech Integrations ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Tech Stack"
            title={<>Pre-Built <span className="font-semibold text-[#4A6741]">Integrations</span></>}
            sub="Every tool your operation needs — already connected. No dev work required."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_INTEGRATIONS.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-[#E8E0D5] hover:shadow-md transition-all text-center group">
                  <div className="w-10 h-10 rounded-xl bg-[#D4E5D7] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#4A6741] transition-colors">
                    <Icon className="w-5 h-5 text-[#4A6741] group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-semibold text-[#2D3A2D] text-sm">{t.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#4A6741] mt-0.5">{t.cat}</p>
                  <p className="text-[#5A6B5A] text-xs mt-2 leading-snug">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] via-[#3D5636] to-[#2D3A2D]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest mb-4">You're One Step Away</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-5">
            Ready to Launch Your<br /><span className="font-semibold">Telehealth Business?</span>
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-2xl mx-auto">
            We handle everything — website, providers, pharmacy connections, merchant account, compliance, and ongoing operations — so you can focus on growing your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold text-base shadow-xl">
                Launch My Platform <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base">
                Talk to Sales
              </Button>
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-6">MedRevolve is a services company. We do not sell pharmaceutical products. All clinical services are provided by licensed independent providers and pharmacies.</p>
        </div>
      </section>

    </div>
  );
}