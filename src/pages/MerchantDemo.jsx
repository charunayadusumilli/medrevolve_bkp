import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowRight, ShieldCheck, FlaskConical, Stethoscope, CheckCircle,
  AlertTriangle, Lock, Star, Package, CreditCard, Phone, Mail,
  ExternalLink, ToggleLeft, ToggleRight, Building2, Globe, Zap,
  Info, Eye
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ThemePreviewBuilder from '@/components/merchant/ThemePreviewBuilder';

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT DEMO PAGE
// Shows prospective merchants what their white-label site will look like.
// Toggle between: GLP Mode (Rx, telehealth-gated) and RUO Mode (research compounds, age-gated)
// This is the demo — actual merchant sites are deployed on their own domains.
// ─────────────────────────────────────────────────────────────────────────────

const GLP_PRODUCTS = [
  {
    id: 'glp-sema',
    name: 'Semaglutide — Weight Management Program',
    chemical: 'Semaglutide (GLP-1 receptor agonist)',
    price: 299,
    frequency: 'monthly',
    description: 'Physician-prescribed compounded semaglutide. Weekly injection. Includes telehealth consultation and ongoing provider support.',
    specs: ['Compounded by 503A licensed pharmacy', 'Physician consultation included', 'Progress check-ins every 4 weeks', 'Auto-refill available'],
    badge: 'Most Popular',
    requiresRx: true,
    warning: null,
  },
  {
    id: 'glp-tirz',
    name: 'Tirzepatide — Dual-Action Protocol',
    chemical: 'Tirzepatide (GLP-1 / GIP dual agonist)',
    price: 349,
    frequency: 'monthly',
    description: 'Dual GLP-1/GIP receptor agonist. Clinically superior weight loss outcomes. Physician-supervised protocol.',
    specs: ['Compounded by 503B licensed pharmacy', 'Licensed provider supervision', 'Initial + monthly follow-ups', 'Dosage titration included'],
    badge: 'Premium',
    requiresRx: true,
    warning: null,
  },
  {
    id: 'glp-nad',
    name: 'NAD+ Longevity Protocol',
    chemical: 'Nicotinamide Adenine Dinucleotide',
    price: 199,
    frequency: 'monthly',
    description: 'Physician-ordered subcutaneous NAD+ injections. Energy, cellular repair, cognitive performance.',
    specs: ['Physician prescription required', 'Licensed compounding pharmacy', 'Monthly supply included', 'Provider monitored protocol'],
    badge: null,
    requiresRx: true,
    warning: null,
  },
];

const RUO_PRODUCTS = [
  {
    id: 'ruo-bpc157',
    name: 'BPC-157',
    chemical: 'Body Protection Compound-157',
    casNumber: '137525-51-0',
    purity: '≥99.2%',
    price: 89,
    unit: 'vial (5mg)',
    description: 'Stable gastric pentadecapeptide. Lyophilized. For in vitro research and laboratory use only.',
    specs: ['5mg lyophilized powder', 'Purity ≥99.2% (HPLC)', 'COA + SDS included', 'Refrigerate at 2-8°C'],
    badge: 'High Demand',
    requiresRx: false,
    warning: 'FOR RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE',
  },
  {
    id: 'ruo-tb500',
    name: 'TB-500',
    chemical: 'Thymosin Beta-4 Fragment (Ac-SDKP)',
    casNumber: '77591-33-4',
    purity: '≥98.5%',
    price: 109,
    unit: 'vial (5mg)',
    description: 'Actin-binding peptide fragment. Lyophilized. For laboratory and in vitro research only.',
    specs: ['5mg lyophilized powder', 'Purity ≥98.5% (HPLC)', 'COA + mass spec included', 'Store below -20°C'],
    badge: null,
    requiresRx: false,
    warning: 'FOR RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE',
  },
  {
    id: 'ruo-ghk',
    name: 'GHK-Cu',
    chemical: 'Copper Peptide (Gly-His-Lys-Cu)',
    casNumber: '49557-75-7',
    purity: '≥99.0%',
    price: 79,
    unit: 'vial (50mg)',
    description: 'Copper complex tripeptide. Research-grade. Tissue culture and in vitro applications only.',
    specs: ['50mg lyophilized', 'Purity ≥99.0% (HPLC)', 'COA included', 'Room temp stable'],
    badge: 'New',
    requiresRx: false,
    warning: 'FOR RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE',
  },
];

const COMPLIANCE_RULES = {
  glp: [
    'Requires licensed physician consultation before dispensing',
    'No Brand name usage (Ozempic, Wegovy, Mounjaro) — chemical names only',
    'LegitScript certification required on your merchant domain',
    '503A or 503B licensed pharmacy integration required',
    'Age verification: 18+ only',
    'No before/after transformation images linking to product',
  ],
  ruo: [
    'Age gate required — 18+ verification',
    'Must display "For Research Use Only — Not for Human or Veterinary Use" on every product',
    'No syringes or injection imagery alongside products',
    'No human weight loss, fitness, or medical claims',
    'No pixel/conversion tracking tied to human health intent',
    'Institutional address preferred — residential shipping flagged by FDA',
    'COA (Certificate of Analysis) required with every product',
    'Separate domain from any Rx or consumer health site — no cross-domain linking',
  ],
};

function AgeGateOverlay({ onConfirm }) {
  const [checked, setChecked] = useState({ age: false, research: false, terms: false });
  const allChecked = checked.age && checked.research && checked.terms;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0D0D0D] border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-black text-white">Age Verification Required</h2>
            <p className="text-xs text-white/40">RUO Catalog Access</p>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-xs text-red-300 font-bold text-center tracking-wide uppercase">
            For Research Use Only — Not for Human or Veterinary Use
          </p>
        </div>
        <div className="space-y-4 mb-6">
          {[
            { key: 'age', label: 'I confirm I am 18 years of age or older' },
            { key: 'research', label: 'I confirm I am a licensed researcher, scientist, or institutional professional purchasing for laboratory / in vitro research purposes only' },
            { key: 'terms', label: 'I understand these compounds are NOT for human consumption, NOT for veterinary use, and I will not use them as drugs, supplements, or food additives' },
          ].map(item => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setChecked(c => ({ ...c, [item.key]: !c[item.key] }))}
                className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                  checked[item.key] ? 'bg-red-500 border-red-500' : 'border-white/30'
                }`}>
                {checked[item.key] && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs text-white/60 leading-relaxed">{item.label}</span>
            </label>
          ))}
        </div>
        <Button
          disabled={!allChecked}
          onClick={onConfirm}
          className={`w-full rounded-sm font-bold ${allChecked ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
          I Confirm — Enter Research Catalog
        </Button>
        <p className="text-[10px] text-white/20 text-center mt-3">
          By entering you agree to our Terms of Service. This access is logged.
        </p>
      </motion.div>
    </div>
  );
}

function GLPProductCard({ product, onCheckout }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {product.badge && (
        <div className="bg-[#4A6741] text-white text-[10px] font-bold uppercase tracking-widest text-center py-1.5">
          {product.badge}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-[#1a1a1a] text-sm leading-tight pr-2">{product.name}</h3>
          <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">Rx Only</span>
        </div>
        <p className="text-[10px] text-[#888] font-mono mb-3">{product.chemical}</p>
        <p className="text-sm text-[#666] leading-relaxed mb-4">{product.description}</p>
        <ul className="space-y-1.5 mb-5">
          {product.specs.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-[#555]">
              <CheckCircle className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" />{s}
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-black text-[#1a1a1a]">${product.price}</div>
            <div className="text-xs text-[#888]">/ {product.frequency}</div>
          </div>
          <Button
            onClick={() => onCheckout(product)}
            className="bg-[#1A2A1A] hover:bg-[#2D3A2D] text-white rounded-sm text-xs font-bold flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" /> Start Consultation
          </Button>
        </div>
        <p className="text-[10px] text-[#888] mt-3 border-t border-gray-50 pt-2">
          Physician consultation required. Prescription dispensed by licensed 503A/503B pharmacy.
        </p>
      </div>
    </div>
  );
}

function RUOProductCard({ product, onCheckout }) {
  return (
    <div className="bg-[#0D0D0D] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-colors">
      {product.badge && (
        <div className="bg-red-900/40 border-b border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center py-1.5">
          {product.badge}
        </div>
      )}
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 mb-4">
          <p className="text-[9px] text-red-400 font-bold text-center tracking-wider uppercase">{product.warning}</p>
        </div>
        <h3 className="font-bold text-white text-sm mb-0.5">{product.name}</h3>
        <p className="text-[10px] text-white/30 font-mono mb-1">{product.chemical}</p>
        <p className="text-[10px] text-white/25 mb-3">CAS: {product.casNumber} · Purity: {product.purity}</p>
        <p className="text-xs text-white/50 leading-relaxed mb-4">{product.description}</p>
        <ul className="space-y-1.5 mb-5">
          {product.specs.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />{s}
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xl font-black text-white">${product.price}</div>
            <div className="text-xs text-white/30">/ {product.unit}</div>
          </div>
          <Button
            onClick={() => onCheckout(product)}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-sm text-xs font-bold flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" /> Order (Institutional)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MerchantDemo() {
  const [mode, setMode] = useState('glp'); // 'glp' | 'ruo'
  const [ruoVerified, setRuoVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState('');

  const switchToRuo = () => {
    if (!ruoVerified) {
      setShowAgeGate(true);
    } else {
      setMode('ruo');
    }
  };

  const handleAgeConfirm = () => {
    setRuoVerified(true);
    setShowAgeGate(false);
    setMode('ruo');
  };

  const handleCheckout = (product) => {
    setCheckoutMsg(`Demo only — on a live merchant site, this would redirect to a ${product.requiresRx ? 'telehealth consultation flow' : 'verified institutional checkout'} for "${product.name}".`);
    setTimeout(() => setCheckoutMsg(''), 5000);
  };

  const isGLP = mode === 'glp';

  return (
    <div className={`min-h-screen ${isGLP ? 'bg-[#FAFAF8]' : 'bg-[#080808]'}`}>

      {showAgeGate && <AgeGateOverlay onConfirm={handleAgeConfirm} />}

      {/* ── Demo Banner ──────────────────────────────────────────────── */}
      <div className="bg-[#1a1a5e] text-white/80 text-xs text-center py-2.5 px-4 flex items-center justify-center gap-3 flex-wrap sticky top-0 z-40">
        <Eye className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
        <span>
          <span className="font-bold text-blue-200">DEMO MODE</span> — This is a preview of what your merchant site looks like. Toggle between site types below.
        </span>
        <Link to={createPageUrl('MerchantOnboarding')}>
          <span className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer transition-colors">
            Get Your Site →
          </span>
        </Link>
      </div>

      {/* ── Mode Toggle ─────────────────────────────────────────────── */}
      <div className={`sticky top-9 z-30 border-b ${isGLP ? 'bg-white border-gray-100' : 'bg-[#0D0D0D] border-white/8'}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Globe className={`w-4 h-4 ${isGLP ? 'text-[#4A6741]' : 'text-white/40'}`} />
            <span className={`text-sm font-bold ${isGLP ? 'text-[#1a1a1a]' : 'text-white'}`}>
              {isGLP ? '🏥 GLP / Telehealth Merchant Site' : '🔬 RUO Research Compound Site'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={showCompliance ? () => setShowCompliance(false) : () => setShowCompliance(true)}
              className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                isGLP ? 'border-[#4A6741]/30 text-[#4A6741] hover:bg-[#4A6741]/5' : 'border-white/15 text-white/50 hover:bg-white/5'
              }`}>
              <Info className="w-3.5 h-3.5" />
              {showCompliance ? 'Hide' : 'Show'} Compliance Rules
            </button>
            <div className="flex items-center gap-2 bg-black/5 border border-black/10 rounded-full p-1">
              <button
                onClick={() => setMode('glp')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isGLP ? 'bg-[#4A6741] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                GLP / Rx Mode
              </button>
              <button
                onClick={switchToRuo}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !isGLP ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                RUO Mode
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Rules Panel */}
        <AnimatePresence>
          {showCompliance && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className={`overflow-hidden border-t ${isGLP ? 'bg-green-50 border-green-100' : 'bg-red-950/30 border-red-500/15'}`}>
              <div className="max-w-6xl mx-auto px-6 py-4">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isGLP ? 'text-[#4A6741]' : 'text-red-400'}`}>
                  {isGLP ? 'GLP / Rx Site — Required Compliance Rules' : 'RUO Site — Required Compliance Rules'}
                </p>
                <div className="grid md:grid-cols-2 gap-2">
                  {COMPLIANCE_RULES[isGLP ? 'glp' : 'ruo'].map((rule, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs ${isGLP ? 'text-green-800' : 'text-red-300/70'}`}>
                      <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {checkoutMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A2A1A] text-white text-xs px-5 py-3 rounded-xl shadow-xl max-w-sm text-center border border-[#4A6741]/40">
          {checkoutMsg}
        </div>
      )}

      <AnimatePresence mode="wait">
        {isGLP ? (
          <motion.div key="glp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* GLP Site Hero */}
            <section className="pt-12 pb-10 px-6 lg:px-8 bg-white border-b border-gray-100">
              <div className="max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-[#EEF5F0] rounded-full px-3 py-1 mb-4">
                  <ShieldCheck className="w-3 h-3 text-[#4A6741]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6741]">
                    LegitScript Certified · Board-Certified Physicians
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                  Your Weight Loss Journey<br /><span className="text-[#4A6741]">Starts Here.</span>
                </h1>
                <p className="text-[#666] text-base max-w-2xl mx-auto mb-6 leading-relaxed">
                  Physician-prescribed, pharmacy-dispensed compounded weight management treatments.
                  Licensed providers. Real results. No insurance required.
                </p>
                <div className="flex flex-wrap gap-3 justify-center text-xs text-[#555]">
                  {['Physician Consultation Included', '503A/B Licensed Pharmacy', 'LegitScript Certified', 'HIPAA Compliant'].map(t => (
                    <div key={t} className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5">
                      <CheckCircle className="w-3 h-3 text-[#4A6741]" />{t}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12 px-6 lg:px-8 bg-[#F9F7F4]">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Treatment Programs</h2>
                <p className="text-sm text-[#888] mb-6">All treatments require physician consultation. Prescription dispensed by licensed pharmacy.</p>
                <div className="grid md:grid-cols-3 gap-5">
                  {GLP_PRODUCTS.map(p => <GLPProductCard key={p.id} product={p} onCheckout={handleCheckout} />)}
                </div>
                <p className="text-xs text-[#888] mt-6 text-center border-t border-gray-200 pt-6">
                  These medications have not been approved by the FDA for the treatment of obesity or overweight.
                  Results may vary. Not available in all states. Consult your physician.
                </p>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="ruo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* RUO Site — Full disclaimer */}
            <div className="bg-red-950 border-b border-red-500/30 py-3 px-6 text-center">
              <p className="text-red-300 text-xs font-bold tracking-widest uppercase">
                ⚠ FOR RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE ⚠
              </p>
              <p className="text-red-400/50 text-[10px] mt-0.5">
                Products on this site are sold exclusively for in vitro research and laboratory use. Not for therapeutic, diagnostic, or food use.
              </p>
            </div>

            <section className="pt-10 pb-8 px-6 lg:px-8 bg-[#0D0D0D] border-b border-white/8">
              <div className="max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 border border-red-500/30 rounded-full px-3 py-1 mb-4">
                  <FlaskConical className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Research Compounds — Institutional Access</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Research-Grade Peptides.<br /><span className="text-red-400">Laboratory Certified.</span>
                </h1>
                <p className="text-white/40 text-base max-w-2xl mx-auto leading-relaxed">
                  High-purity research compounds for licensed researchers and institutional laboratories.
                  HPLC-certified. COA included. For in vitro use only.
                </p>
              </div>
            </section>

            <section className="py-12 px-6 lg:px-8 bg-[#080808]">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-white">Research Compound Catalog</h2>
                  <span className="text-[10px] bg-red-500/15 border border-red-500/25 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">RUO Only</span>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {RUO_PRODUCTS.map(p => <RUOProductCard key={p.id} product={p} onCheckout={handleCheckout} />)}
                </div>
                <div className="mt-8 bg-white/[0.03] border border-white/8 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-white/40" /> Institutional Order Process
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-xs text-white/40">
                    <div><span className="text-white/70 font-semibold block mb-1">1. Verify Account</span>Provide institutional credentials, DEA number (if applicable), and intended research use</div>
                    <div><span className="text-white/70 font-semibold block mb-1">2. Checkout</span>Verified accounts proceed to checkout. New visitors submit inquiry form for review</div>
                    <div><span className="text-white/70 font-semibold block mb-1">3. Receive COA</span>Certificate of Analysis shipped with every order. Refrigeration instructions included</div>
                  </div>
                </div>
                <p className="text-[10px] text-white/20 text-center mt-6 leading-relaxed max-w-3xl mx-auto">
                  LEGAL DISCLAIMER: All products sold by this site are for IN VITRO RESEARCH USE ONLY. They are not drugs, supplements, food additives, or diagnostic agents.
                  Not for use in humans or animals. Must be handled by qualified research personnel in an appropriate research setting.
                  By purchasing, you confirm you are a licensed researcher or institutional professional.
                </p>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Theme Preview Builder ────────────────────────────────────── */}
      <section className="py-14 px-6 lg:px-8 bg-[#060606] border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#6B8F5E] text-xs font-bold uppercase tracking-widest mb-2">Live Theme Preview</p>
            <h2 className="text-2xl font-bold text-white mb-2">See it in your brand colors</h2>
            <p className="text-white/40 text-sm">Enter your brand name and pick a color — see your site theme instantly.</p>
          </div>
          <ThemePreviewBuilder mode={mode} />
        </div>
      </section>

      {/* ── CTA to Get Your Own Site ─────────────────────────────────── */}
      <section className="py-14 px-6 lg:px-8 bg-[#0A0A0A] border-t border-white/8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 mb-5">
            <Zap className="w-3 h-3 text-[#8FB88F]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FB88F]">Ready to Launch?</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            This is what your site looks like.<br />
            <span className="text-white/40">Get yours in 24 hours.</span>
          </h2>
          <p className="text-sm text-white/40 mb-8 max-w-xl mx-auto">
            Choose GLP/Rx mode, RUO mode, or both on separate domains.
            MedRevolve handles compliance, LegitScript certification, payment processing, and pharmacy integrations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 py-3 font-bold">
                Start Your Platform <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('ForBusiness')}>
              <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/5 hover:text-white rounded-sm px-6">
                See Pricing & Modules
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}