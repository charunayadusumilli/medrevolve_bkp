import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Droplets, ShieldCheck, FlaskConical, Building2,
  CheckCircle, ExternalLink, Package, Star, Truck, Award,
  AlertTriangle, Lock, CreditCard
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

// ─────────────────────────────────────────────────────────────────────────────
// COMPLIANCE NOTICE — medrevolve.com/Products
// Only bacteriostatic water (ancillary supply) is sold on this domain.
// All Rx compounds live on licensed merchant white-label sites only.
// RUO peptides are on a completely separate domain with age-gate + disclaimers.
// Cross-domain contamination = LegitScript certification failure.
// ─────────────────────────────────────────────────────────────────────────────

const WATER_PRODUCTS = [
  {
    id: 'bw-30ml-single',
    name: 'Bacteriostatic Water for Injection — 30mL Single Vial',
    sku: 'MR-BW-30-1',
    price: 14.99,
    unit: 'vial',
    description: 'USP-grade sterile water with 0.9% benzyl alcohol. Multi-dose. FDA-registered manufacturer.',
    specs: ['30mL multi-dose vial', '0.9% Benzyl Alcohol', 'USP grade sterile', 'COA included'],
    badge: null,
    inStock: true,
  },
  {
    id: 'bw-30ml-10pk',
    name: 'Bacteriostatic Water — 10-Pack (30mL vials)',
    sku: 'MR-BW-30-10',
    price: 119.99,
    unit: '10-pack',
    description: 'Case of 10 × 30mL vials. Best value for clinics and compounding facilities. Same-batch COA.',
    specs: ['10 × 30mL vials', 'Same-batch COA', 'Bulk institutional pricing', 'Tamper-evident seal'],
    badge: 'Best Value',
    inStock: true,
  },
  {
    id: 'bw-30ml-50pk',
    name: 'Bacteriostatic Water — 50-Pack (30mL vials)',
    sku: 'MR-BW-30-50',
    price: 499.99,
    unit: '50-pack',
    description: 'Institutional case of 50 × 30mL vials. Preferred by larger compounding pharmacies and hospital systems.',
    specs: ['50 × 30mL vials', 'Wholesale COA batch', 'Priority shipping', 'Net-30 available'],
    badge: 'Wholesale',
    inStock: true,
  },
];

const B2B_CATALOG = [
  {
    category: 'GLP-1 Weight Management',
    tag: 'Rx Required · 503A Compounding Pharmacy',
    tagColor: '#4A6741',
    items: ['Physician-Supervised GLP-1 Programs (injectable)', 'Physician-Supervised GLP-1 Programs (oral/sublingual)'],
    note: 'Requires LegitScript certification + physician network on your merchant site',
  },
  {
    category: 'Hormone Optimization',
    tag: 'Rx Required · 503A Compounding Pharmacy',
    tagColor: '#3B82F6',
    items: ['Testosterone Optimization Programs', 'Bioidentical Hormone Replacement Programs', 'Thyroid Optimization Programs'],
    note: 'Available to merchant sites with verified prescriber network',
  },
  {
    category: "Men's Health",
    tag: 'Rx Required',
    tagColor: '#7C3AED',
    items: ["Physician-Supervised Men's Sexual Health Programs", 'Combination Protocol Programs', "Men's Health Peptide Protocols (Rx)"],
    note: 'Prescription-only. Physician consult via your telehealth integration required',
  },
  {
    category: 'Longevity & Wellness',
    tag: 'Rx Required · Physician Order',
    tagColor: '#D97706',
    items: ['NAD+ Optimization Programs', 'Growth Hormone Secretagogue Programs', 'Glutathione & Micronutrient Protocols'],
    note: 'Physician-prescribed via merchant telehealth. COA + pharmacy dispensing included',
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(WATER_PRODUCTS[1]);
  const [qty, setQty] = useState(1);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleBuyWater = async () => {
    // Block checkout if in iframe
    if (window.self !== window.top) {
      alert('Checkout is only available from the published site. Please visit medrevolve.com directly.');
      return;
    }
    setLoadingCheckout(true);
    setCheckoutError('');
    try {
      const res = await base44.functions.invoke('createCheckout', {
        items: [{ name: selectedProduct.name, price: selectedProduct.price, quantity: qty }],
        successUrl: `${window.location.origin}/OrderSuccess?product=water`,
        cancelUrl: window.location.href,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setCheckoutError(res.data?.error || 'Checkout failed. Please try again.');
      }
    } catch (e) {
      setCheckoutError('Checkout failed. Please try again.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4]">

      {/* ── LegitScript Compliance Banner ─────────────────────────────── */}
      <div className="bg-[#1A2A1A] text-white/70 text-xs text-center py-2.5 px-4 flex items-center justify-center gap-3 flex-wrap">
        <ShieldCheck className="w-3.5 h-3.5 text-[#8FB88F] flex-shrink-0" />
        <span>
          <span className="font-semibold text-white/90">LegitScript Certification Pending</span>
          {' '}· Bacteriostatic Water sold for licensed facility and consumer use.
          Rx compounded treatments available exclusively on licensed merchant partner sites.
        </span>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-14 pb-10 px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 bg-[#EEF5F0] rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A6741]">Pharmaceutical Supply</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-4 leading-tight tracking-tight">
                USP-Grade Supplies.<br />
                <span className="text-[#4A6741]">Pharmaceutical-Grade.</span>
              </h1>
              <p className="text-[#666] text-base leading-relaxed mb-6 max-w-lg">
                MedRevolve supplies pharmaceutical-grade bacteriostatic water direct to licensed healthcare
                facilities, compounding pharmacies, research institutions — and now direct to consumers.
                All product sourced from FDA-registered, cGMP-certified manufacturers.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-[#555] border border-gray-200 rounded-full px-3 py-1.5">
                  <Award className="w-3.5 h-3.5 text-[#4A6741]" /> USP &lt;797&gt; Compliant
                </div>
                <div className="flex items-center gap-2 text-xs text-[#555] border border-gray-200 rounded-full px-3 py-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4A6741]" /> FDA-Registered Mfg.
                </div>
                <div className="flex items-center gap-2 text-xs text-[#555] border border-gray-200 rounded-full px-3 py-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#4A6741]" /> National Shipping
                </div>
              </div>
            </motion.div>

            {/* Product Visual */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center bg-gradient-to-br from-[#EEF5F0] to-[#D4E5D7] rounded-3xl p-12 aspect-square">
              <div className="text-center">
                <div className="w-28 h-28 rounded-full bg-white/60 backdrop-blur flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Droplets className="w-14 h-14 text-[#4A6741]" />
                </div>
                <div className="text-sm font-black text-[#4A6741] uppercase tracking-widest mb-1">USP Grade</div>
                <div className="text-xs text-[#666] mb-3">0.9% Benzyl Alcohol · Sterile Water for Injection</div>
                <div className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full shadow-sm text-xs text-[#4A6741] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> COA Included Every Batch
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Product Cards + Checkout ─────────────────────────────────────── */}
      <section className="py-14 px-6 lg:px-8 bg-[#F9F7F4]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Shop Bacteriostatic Water</h2>
          <p className="text-[#888] text-sm mb-8">No prescription required. Available for individual and licensed facility purchase.</p>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {WATER_PRODUCTS.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ y: -2 }}
                onClick={() => { setSelectedProduct(product); setQty(1); setCheckoutError(''); }}
                className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                  selectedProduct.id === product.id
                    ? 'border-[#4A6741] shadow-lg shadow-[#4A6741]/10'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                {product.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A6741] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {product.badge}
                  </div>
                )}
                {selectedProduct.id === product.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-5 h-5 text-[#4A6741]" />
                  </div>
                )}
                <Droplets className="w-8 h-8 text-[#4A6741] mb-3" />
                <h3 className="font-bold text-[#1a1a1a] text-sm mb-1 leading-tight pr-4">{product.name}</h3>
                <p className="text-[#888] text-xs mb-4 leading-relaxed">{product.description}</p>
                <ul className="space-y-1 mb-5">
                  {product.specs.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#555]">
                      <span className="w-1 h-1 rounded-full bg-[#4A6741] flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
                <div className="text-2xl font-black text-[#1a1a1a]">${product.price.toFixed(2)}</div>
                <div className="text-xs text-[#888]">per {product.unit}</div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#1a1a1a] mb-1">Selected: {selectedProduct.name}</div>
              <div className="text-xs text-[#888]">SKU: {selectedProduct.sku}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-[#1a1a1a] font-bold hover:bg-gray-50">−</button>
                <span className="w-8 text-center font-bold text-[#1a1a1a]">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-[#1a1a1a] font-bold hover:bg-gray-50">+</button>
              </div>
              <div className="text-xl font-black text-[#1a1a1a]">${(selectedProduct.price * qty).toFixed(2)}</div>
              <Button
                onClick={handleBuyWater}
                disabled={loadingCheckout}
                className="bg-[#1A2A1A] hover:bg-[#2D3A2D] text-white rounded-sm px-6 font-bold flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {loadingCheckout ? 'Processing…' : 'Buy Now'}
              </Button>
            </div>
            {checkoutError && <p className="text-red-500 text-xs w-full md:w-auto mt-2">{checkoutError}</p>}
          </div>

          {/* B2B inquiry */}
          <div className="mt-4 text-center">
            <p className="text-xs text-[#888]">
              Need bulk/institutional pricing or Net-30 terms?{' '}
              <Link to={createPageUrl('Contact')} className="text-[#4A6741] font-semibold underline">Request B2B pricing</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Trust & Compliance Specs ─────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-6 text-center">
            Specifications & Regulatory Compliance
          </h3>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { label: 'USP 797', desc: 'Meets United States Pharmacopeia compounding standards for sterile preparations', icon: ShieldCheck },
              { label: 'GMP Certified', desc: 'Manufactured under Current Good Manufacturing Practice (cGMP) regulations', icon: Award },
              { label: 'COA Provided', desc: 'Full Certificate of Analysis with every shipment — identity, purity, sterility', icon: FlaskConical },
              { label: 'LegitScript', desc: 'Certification process underway. Merchant accounts require LegitScript approval', icon: Lock },
            ].map((spec, i) => (
              <div key={i} className="bg-[#F9F7F4] rounded-xl p-5 border border-gray-100">
                <spec.icon className="w-6 h-6 text-[#4A6741] mb-3" />
                <div className="font-bold text-[#1a1a1a] text-sm mb-1">{spec.label}</div>
                <div className="text-xs text-[#666] leading-relaxed">{spec.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B Merchant Catalog — Dark Section ─────────────────────────── */}
      <section className="py-16 px-6 lg:px-8 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-[#4A6741]/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B8F5E]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8FB88F]">For Licensed Merchants</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Full Rx Catalog — <span className="text-[#8FB88F]">Under Your Brand</span>
            </h2>
            <p className="text-sm text-white/45 max-w-2xl mx-auto">
              MedRevolve's white-label platform gives licensed merchants access to a complete compounded Rx
              product catalog — GLP-1, hormones, men's health, longevity — with built-in telehealth,
              pharmacy integrations, and LegitScript-ready compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {B2B_CATALOG.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-white text-sm">{cat.category}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: cat.tagColor, borderColor: `${cat.tagColor}40`, background: `${cat.tagColor}15` }}>
                    {cat.tag}
                  </span>
                </div>
                <ul className="space-y-1.5 mb-3">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-white/55">
                      <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-white/25 border-t border-white/8 pt-2">{cat.note}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs text-white/25 mb-5">
              All Rx products exclusively available through licensed merchant partner sites — not on medrevolve.com.
              Each merchant undergoes compliance verification and LegitScript certification before accessing the catalog.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={createPageUrl('MerchantOnboarding')}>
                <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 font-bold">
                  Become a Merchant Partner <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('MerchantDemo')}>
                <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/5 hover:text-white rounded-sm px-6">
                  See Demo Site <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RUO Separation Notice ───────────────────────────────────────── */}
      <section className="py-8 px-6 lg:px-8 bg-[#111] border-t border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-amber-300 mb-1">Research Use Only (RUO) Products — Separate Domain</div>
              <p className="text-xs text-white/40 leading-relaxed">
                Research Use Only (RUO) peptide compounds are{' '}
                <strong className="text-white/60">not sold on this site</strong>. Per FDA guidance and LegitScript
                requirements, RUO compounds are maintained on a completely separate domain with mandatory age-gate,
                institutional verification, and "Not for Human or Veterinary Use" disclaimers at every product level.
                MedRevolve strictly enforces separation between RUO and consumer/Rx product sites.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}