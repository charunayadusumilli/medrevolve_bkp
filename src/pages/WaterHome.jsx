/**
 * medrevolvewater.com — Bacteriostatic Water
 * Premium pharmaceutical-grade bacteriostatic water in sterile vials
 * B2B + B2C combined — individuals & businesses can order
 * RUO-style compliance: not for injection/human use without provider order
 */
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CheckCircle, Shield, Package, FlaskConical, Truck,
  Building2, User, ArrowRight, Star, ChevronDown, Lock,
  Beaker, Award, RefreshCw, BadgeCheck
} from 'lucide-react';

// ── Products ─────────────────────────────────────────────────────────────────
const VIAL_PRODUCTS = [
  {
    id: 'bsw-30ml',
    name: 'Bacteriostatic Water 30mL',
    subtitle: 'Multi-Use Sterile Vial',
    price: '$12.99',
    bulkPrice: '$9.99',
    unit: 'per vial',
    badge: 'Best Value',
    badgeColor: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
    description: '30mL flip-top sterile vial. 0.9% benzyl alcohol preservative. USP-grade water for injection base. Ideal for multi-use reconstitution.',
    specs: ['30mL USP sterile water', '0.9% benzyl alcohol', 'Flip-top aluminum seal', 'Type I borosilicate glass', 'Endotoxin tested', 'Lot & expiry labeled'],
    minOrder: 1,
    bulkMinOrder: 10,
    audience: 'both',
  },
  {
    id: 'bsw-10ml',
    name: 'Bacteriostatic Water 10mL',
    subtitle: 'Standard Sterile Vial',
    price: '$7.99',
    bulkPrice: '$5.49',
    unit: 'per vial',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    description: '10mL flip-top sterile vial. Pharmaceutical-grade benzyl alcohol preserved. Standard size for single or limited-use reconstitution applications.',
    specs: ['10mL USP sterile water', '0.9% benzyl alcohol', 'Flip-top aluminum seal', 'Type I borosilicate glass', 'Sterility tested', 'COA available'],
    minOrder: 1,
    bulkMinOrder: 25,
    audience: 'both',
  },
  {
    id: 'bsw-5ml',
    name: 'Bacteriostatic Water 5mL',
    subtitle: 'Compact Sterile Vial',
    price: '$5.99',
    bulkPrice: '$3.99',
    unit: 'per vial',
    badge: null,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
    description: '5mL compact flip-top vial. Same pharmaceutical-grade purity as larger sizes. Perfect for single-compound reconstitution or smaller volume applications.',
    specs: ['5mL USP sterile water', '0.9% benzyl alcohol', 'Flip-top aluminum seal', 'Type I borosilicate glass', 'Single-use recommended', 'COA available'],
    minOrder: 1,
    bulkMinOrder: 50,
    audience: 'both',
  },
];

const BULK_PACKS = [
  { name: 'Starter Kit', qty: '12 × 10mL', price: '$59.99', savings: 'Save 15%', icon: Package },
  { name: 'Clinic Pack', qty: '50 × 10mL + 20 × 30mL', price: '$279.99', savings: 'Save 22%', badge: 'Most Ordered', icon: Building2 },
  { name: 'Wholesale Box', qty: '100 × 10mL or 30mL', price: 'Contact for Pricing', savings: 'Best Margin', icon: FlaskConical },
];

const CERTIFICATIONS = [
  { label: 'USP Grade', sub: 'Pharmaceutical standard' },
  { label: 'Sterility Tested', sub: 'Every batch' },
  { label: 'Endotoxin Tested', sub: 'LAL method' },
  { label: 'COA Included', sub: 'Certificate of Analysis' },
  { label: 'US Manufactured', sub: 'FDA-registered facility' },
  { label: 'Cold Chain Shipped', sub: 'Integrity maintained' },
];

const WHO_BUYS = [
  {
    icon: User,
    label: 'Individuals / Researchers',
    description: 'Order individual vials for reconstitution and licensed facility use. Discreet, secure shipping.',
    cta: 'Shop Retail',
    link: '#products',
    color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    accent: 'text-blue-400',
  },
  {
    icon: Building2,
    label: 'Clinics & Med Spas',
    description: 'Bulk clinical packs with volume pricing. Consistent supply for your practice.',
    cta: 'Get Bulk Pricing',
    link: '#bulk',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    accent: 'text-emerald-400',
  },
  {
    icon: FlaskConical,
    label: 'Compounding Pharmacies',
    description: 'Wholesale pricing, private label options, and net-30 terms available for qualified facilities.',
    cta: 'Wholesale Inquiry',
    link: '/Contact',
    color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20',
    accent: 'text-purple-400',
  },
];

export default function WaterHome() {
  const [activeTab, setActiveTab] = useState('retail');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is bacteriostatic water?',
      a: 'Bacteriostatic water is sterile water containing 0.9% benzyl alcohol as a preservative. It inhibits bacterial growth, allowing multi-use from a single vial over a period of time. It is commonly used in research and clinical settings for reconstitution of lyophilized compounds.'
    },
    {
      q: 'Is this for human injection?',
      a: 'Our bacteriostatic water is sold for research, compounding, and reconstitution use. Any injectable use must be under the direction of a licensed medical provider. We do not sell this product as a standalone injectable for end-consumer self-administration.'
    },
    {
      q: 'What is the shelf life after opening?',
      a: 'Unopened vials are stable until the printed expiry date. Once accessed, the benzyl alcohol preservative inhibits bacterial growth for up to 28 days when stored properly at 2–8°C.'
    },
    {
      q: 'Do you offer bulk / wholesale pricing?',
      a: 'Yes. We offer volume pricing for clinics, med spas, compounding pharmacies, and wholesale distributors. Contact us for net-30 terms and volume discount tiers starting at 25+ vials.'
    },
    {
      q: 'What certifications do your vials have?',
      a: 'All vials are manufactured in an FDA-registered facility, tested for sterility and endotoxins via LAL method, and include a Certificate of Analysis (COA) with every lot. USP-grade benzyl alcohol and water for injection base.'
    },
    {
      q: 'How is shipping handled?',
      a: 'Orders ship via cold-chain packaging with temperature monitors. We use overnight and 2-day shipping options to maintain product integrity. Bulk/wholesale orders ship via LTL freight.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#040C14] text-white">
      <SEOHead
        title="Bacteriostatic Water Vials — 5mL, 10mL, 30mL | MedRevolve Water"
        description="Pharmaceutical-grade bacteriostatic water in 5mL, 10mL, and 30mL sterile flip-top vials. USP-grade, endotoxin tested, COA included. Retail & bulk/wholesale available."
      />

      {/* Compliance Bar */}
      <div className="bg-[#0A1520] border-b border-white/5 text-center py-2 px-4">
        <p className="text-white/30 text-[10px] tracking-wide">
          For research, compounding, and reconstitution use only. Any injection use requires licensed medical supervision. Not for direct OTC injection.
        </p>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071525] via-[#040C14] to-[#02080F]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            {/* Logo mark */}
            <div className="flex items-center justify-center gap-2.5 mb-10">
              <div className="w-9 h-9 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-[11px]">MW</span>
              </div>
              <span className="text-white text-base font-bold tracking-tight">MedRevolve Water</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8">
              <Beaker className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-bold tracking-widest uppercase">Pharmaceutical-Grade Bacteriostatic Water</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none" style={{ letterSpacing: '-0.03em' }}>
              The Purest<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                Bacteriostatic Water.
              </span>
            </h1>

            <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
              USP-grade sterile vials in 5mL, 10mL, and 30mL. 0.9% benzyl alcohol preserved.
              Endotoxin tested. COA included. Retail & wholesale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="#products">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-sm px-10 font-bold text-base">
                  Shop Vials <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#bulk">
                <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-sm px-10 text-base">
                  <Building2 className="mr-2 w-4 h-4" /> Bulk / Wholesale
                </Button>
              </a>
            </div>

            {/* Certs strip */}
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {CERTIFICATIONS.map(c => (
                <div key={c.label} className="text-center">
                  <p className="text-sm font-black text-white">{c.label}</p>
                  <p className="text-white/30 text-[11px] mt-0.5">{c.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#050E18]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Who We Serve</p>
            <h2 className="text-3xl font-light text-white">Retail Orders & Wholesale, <span className="font-semibold text-cyan-300">All in One Place</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHO_BUYS.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${w.color} border rounded-2xl p-6 flex flex-col`}>
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${w.accent}`} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{w.label}</h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">{w.description}</p>
                  <a href={w.link}>
                    <Button size="sm" variant="ghost" className={`${w.accent} border border-white/10 hover:bg-white/10 rounded-sm text-xs font-bold w-full`}>
                      {w.cta} →
                    </Button>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────────── */}
      <section id="products" className="py-24 px-6 bg-[#040C14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Product Catalog</p>
            <h2 className="text-4xl font-light text-white mb-2">
              Sterile Vials, <span className="font-semibold text-cyan-300">Three Sizes</span>
            </h2>
            <p className="text-white/35 text-sm max-w-xl mx-auto">All vials manufactured in an FDA-registered facility. COA provided with every lot.</p>
          </div>

          {/* Retail / Bulk Toggle */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveTab('retail')}
              className={`px-6 py-2 rounded-sm text-sm font-bold transition-all ${activeTab === 'retail' ? 'bg-white text-black' : 'text-white/50 border border-white/10 hover:text-white'}`}>
              Retail Pricing
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-2 rounded-sm text-sm font-bold transition-all ${activeTab === 'bulk' ? 'bg-white text-black' : 'text-white/50 border border-white/10 hover:text-white'}`}>
              Bulk / Wholesale
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {VIAL_PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
              >
                {/* Vial visual */}
                <div className="relative h-44 bg-gradient-to-br from-blue-900/30 to-cyan-900/20 flex items-center justify-center">
                  <div className="flex items-end gap-2">
                    {/* Stylized vial */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-2 bg-white/80 rounded-t-sm" />
                      <div className="w-4 h-1 bg-white/60" />
                      <div
                        className="rounded-b-lg border-2 border-blue-400/60 bg-gradient-to-b from-blue-200/20 to-cyan-400/10 flex items-center justify-center"
                        style={{ width: product.id === 'bsw-30ml' ? 40 : product.id === 'bsw-10ml' ? 32 : 24, height: product.id === 'bsw-30ml' ? 96 : product.id === 'bsw-10ml' ? 76 : 56 }}>
                        <span className="text-[9px] font-bold text-blue-300 rotate-90 whitespace-nowrap">
                          {product.id === 'bsw-30ml' ? '30mL' : product.id === 'bsw-10ml' ? '10mL' : '5mL'}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2 text-left">
                      <p className="text-xs text-white/50 font-mono">Benzyl Alcohol</p>
                      <p className="text-xs text-white/50 font-mono">0.9% w/v</p>
                      <p className="text-[10px] text-blue-400/70 font-mono mt-1">BACTERIOSTATIC</p>
                    </div>
                  </div>
                  {product.badge && (
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-0.5">{product.name}</h3>
                  <p className="text-blue-400 text-xs font-semibold mb-3">{product.subtitle}</p>
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{product.description}</p>

                  <ul className="space-y-1.5 mb-6">
                    {product.specs.map(s => (
                      <li key={s} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-white/8 pt-4">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-2xl font-black text-white">
                          {activeTab === 'retail' ? product.price : product.bulkPrice}
                        </p>
                        <p className="text-[11px] text-white/30">{product.unit} {activeTab === 'bulk' ? `(min ${product.bulkMinOrder})` : ''}</p>
                      </div>
                      {activeTab === 'bulk' && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Bulk Rate
                        </span>
                      )}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-sm font-bold text-sm">
                      {activeTab === 'retail' ? 'Order Now' : 'Request Quote'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK / WHOLESALE PACKS ────────────────────────────────────────── */}
      <section id="bulk" className="py-24 px-6 bg-[#050E18]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Bulk & Wholesale</p>
            <h2 className="text-3xl font-light text-white mb-3">
              Volume Pricing for <span className="font-semibold text-emerald-300">Clinics & Distributors</span>
            </h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto">
              Consistent supply at the best margins. Net-30 terms available for qualified accounts. Private label options for established distributors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {BULK_PACKS.map((pack, i) => {
              const Icon = pack.icon;
              return (
                <motion.div key={pack.name}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`relative bg-white/5 border rounded-2xl p-6 ${pack.badge ? 'border-emerald-500/40' : 'border-white/10'}`}>
                  {pack.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full">{pack.badge}</span>
                  )}
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{pack.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{pack.qty}</p>
                  <p className="text-2xl font-black text-white mb-1">{pack.price}</p>
                  <p className="text-emerald-400 text-xs font-bold mb-5">{pack.savings}</p>
                  <Link to="/Contact">
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm font-bold text-xs">
                      Get This Pack →
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* B2B CTA */}
          <div className="bg-gradient-to-r from-blue-900/30 to-emerald-900/20 border border-white/10 rounded-2xl p-8 text-center">
            <BadgeCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Want to Resell Under Your Brand?</h3>
            <p className="text-white/45 text-sm mb-6 max-w-lg mx-auto">
              MedRevolve Water offers private label and white-label programs for compounding pharmacies, distributors, and med spas. Your logo, our pharmaceutical-grade product.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/Contact">
                <Button className="bg-white text-black hover:bg-white/90 rounded-sm font-bold px-8">
                  Apply for Wholesale Account
                </Button>
              </Link>
              <a href="mailto:orders@medrevolvewater.com">
                <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10 rounded-sm px-8">
                  Contact for Wholesale
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUALITY & COMPLIANCE ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#040C14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Quality Standards</p>
            <h2 className="text-3xl font-light text-white">Built for <span className="font-semibold text-white">Pharmaceutical Precision</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, title: 'USP-Grade Water for Injection', body: 'Base water meets USP <1> Water for Injection standards. Purified, distilled, and validated.' },
              { icon: Shield, title: '0.9% Benzyl Alcohol Preservative', body: 'Pharmaceutical-grade preservative inhibits bacterial and fungal growth. Multi-use stability.' },
              { icon: Award, title: 'Endotoxin Tested (LAL)', body: 'Every lot tested for bacterial endotoxins using Limulus Amebocyte Lysate (LAL) method.' },
              { icon: Lock, title: 'Sterility Validated', body: 'Sterility testing per USP <71>. Sealed under nitrogen. Tamper-evident aluminum crimp seal.' },
              { icon: RefreshCw, title: 'Lot Traceability', body: 'Full chain-of-custody documentation. Lot number and expiry date on every vial.' },
              { icon: Truck, title: 'Cold Chain Shipping', body: 'Temperature-controlled packaging for all orders. Overnight and 2-day options available.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white/4 border border-white/8 rounded-xl p-5">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#050E18]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">FAQ</p>
            <h2 className="text-3xl font-light text-white">Common Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-white text-sm font-semibold">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#040C14]">
        <div className="max-w-3xl mx-auto text-center">
          <Beaker className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Ready to Order?
          </h2>
          <p className="text-white/45 mb-8 text-lg">
            Same-day shipping on in-stock items. COA available for every lot. Wholesale accounts approved in 24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-sm px-12 font-bold text-base">
                Shop Now
              </Button>
            </a>
            <a href="mailto:orders@medrevolvewater.com">
              <Button size="lg" variant="ghost" className="border border-white/20 text-white hover:bg-white/10 rounded-sm px-12 text-base">
                Contact for Wholesale
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#02080E] border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                  <span className="text-black font-black text-[10px]">MW</span>
                </div>
                <span className="text-white text-sm font-bold">MedRevolve Water</span>
              </div>
              <p className="text-white/25 text-xs max-w-xs leading-relaxed">
                Pharmaceutical-grade bacteriostatic water. FDA-registered facility. USP grade. COA with every lot.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-xs">
              <div>
                <p className="text-white/25 font-bold uppercase tracking-widest mb-3">Products</p>
                <ul className="space-y-2 text-white/40">
                  <li><a href="#products" className="hover:text-white transition-colors">5mL Vials</a></li>
                  <li><a href="#products" className="hover:text-white transition-colors">10mL Vials</a></li>
                  <li><a href="#products" className="hover:text-white transition-colors">30mL Vials</a></li>
                  <li><a href="#bulk" className="hover:text-white transition-colors">Bulk / Wholesale</a></li>
                </ul>
              </div>
              <div>
                <p className="text-white/25 font-bold uppercase tracking-widest mb-3">Company</p>
                <ul className="space-y-2 text-white/40">
                  <li><a href="mailto:orders@medrevolvewater.com" className="hover:text-white transition-colors">orders@medrevolvewater.com</a></li>
                  <li><Link to="/Privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/Terms" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6">
            <p className="text-white/15 text-[10px] text-center leading-relaxed">
              © 2025 MedRevolve Water. For research, compounding, and reconstitution use only.
              Not for direct injection without licensed medical supervision.
              These products have not been evaluated by the FDA as finished pharmaceutical products.
              Manufactured in an FDA-registered facility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}