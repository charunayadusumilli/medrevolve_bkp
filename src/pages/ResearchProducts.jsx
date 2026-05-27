import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, FlaskConical, ShieldAlert, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────────────────
// RESEARCH USE ONLY (RUO) PAGE — STRICT COMPLIANCE
//
// FDA / LegitScript / Mastercard compliance rules for this page:
//   1. Must display "For Research Use Only — Not for Human or Veterinary Use" 
//      on EVERY product and at the top of the page
//   2. Age gate required before access
//   3. No "before/after" human transformation images
//   4. No "weight loss", "feel better", or human-use language
//   5. No pixel/tracking tied to weight loss intent
//   6. No syringes or injection equipment shown alongside RUO products
//   7. No GLP-1 compounds on this page (separate domain required for GLP consumer)
//   8. No bacteriostatic water alongside peptides (implies reconstitution for human use)
//   9. This page is informational only — purchases via licensed research accounts only
//   10. Shipping to a doctor's office = automatic FDA flag; institutional address required
// ─────────────────────────────────────────────────────────────────────────────

const RUO_CATALOG = [
  {
    id: 'bpc157',
    name: 'BPC-157',
    chemicalName: 'Body Protective Compound — pentadecapeptide (GEPPPGKPADDAGLV)',
    cas: 'CAS 137525-51-0',
    form: 'Lyophilized Powder',
    purity: '≥99%',
    category: 'Peptide',
    description: 'Synthetic pentadecapeptide derived from a protective protein found in the stomach. Used in in-vitro and in-vivo preclinical research settings. COA provided.',
    note: 'For research use only. Not for human or veterinary use.',
    available: true,
  },
  {
    id: 'cjc1295',
    name: 'CJC-1295',
    chemicalName: 'Growth Hormone Releasing Factor Analogue (GRF 1-29)',
    cas: 'CAS 863288-34-0',
    form: 'Lyophilized Powder',
    purity: '≥98%',
    category: 'Peptide',
    description: 'Synthetic analogue of GHRH (Growth Hormone Releasing Hormone) amino acids 1-29. Used in preclinical neuroendocrine research. COA provided.',
    note: 'For research use only. Not for human or veterinary use.',
    available: true,
  },
  {
    id: 'ghkcu',
    name: 'GHK-Cu (Copper Peptide)',
    chemicalName: 'Glycyl-L-histidyl-L-lysine copper(II) complex',
    cas: 'CAS 49557-75-7',
    form: 'Lyophilized Powder',
    purity: '≥99%',
    category: 'Peptide',
    description: 'Naturally occurring plasma tripeptide–copper complex. Used in biochemistry and cell biology research related to tissue remodeling and antioxidant activity.',
    note: 'For research use only. Not for human or veterinary use.',
    available: true,
  },
  {
    id: 'tb500',
    name: 'TB-500 (Thymosin Beta-4 Fragment)',
    chemicalName: 'Ac-Ser-Asp-Lys-Pro (Thymosin Beta-4 fragment 17-23)',
    cas: 'CAS 885340-08-9',
    form: 'Lyophilized Powder',
    purity: '≥98%',
    category: 'Peptide',
    description: 'Synthetic peptide fragment of Thymosin Beta-4. Used in cell migration, differentiation, and cytoskeletal research in laboratory settings.',
    note: 'For research use only. Not for human or veterinary use.',
    available: true,
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    chemicalName: 'Aib-His-D-2Nal-D-Phe-Lys-NH2',
    cas: 'CAS 170851-70-4',
    form: 'Lyophilized Powder',
    purity: '≥99%',
    category: 'Peptide',
    description: 'Selective GH secretagogue receptor agonist. Used in in-vitro receptor binding assays and in-vivo preclinical neuroendocrine studies.',
    note: 'For research use only. Not for human or veterinary use.',
    available: true,
  },
  {
    id: 'aod9604',
    name: 'AOD-9604',
    chemicalName: 'hGH Fragment 177-191 (Tyr-hGH 177-191)',
    cas: 'CAS 221231-10-3',
    form: 'Lyophilized Powder',
    purity: '≥98%',
    category: 'Peptide',
    description: 'C-terminal fragment of human Growth Hormone (residues 177–191). Used in preclinical metabolic and lipolytic research models.',
    note: 'For research use only. Not for human or veterinary use.',
    available: true,
  },
];

// Age gate: user must confirm they are ≥18 and a licensed researcher
function AgeGate({ onConfirm }) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const allChecked = checked1 && checked2 && checked3;

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-red-500/30 rounded-2xl p-8 max-w-lg w-full"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Restricted Access — Verification Required</h2>
            <p className="text-white/40 text-xs mt-0.5">Research Use Only Products</p>
          </div>
        </div>

        <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-red-300 text-sm font-semibold mb-2">⚠ FOR RESEARCH USE ONLY</p>
          <p className="text-white/60 text-xs leading-relaxed">
            The products listed on this page are intended for <strong className="text-white">licensed research, laboratory, 
            and scientific use only</strong>. They are <strong className="text-white/90">NOT approved by the FDA for human 
            or veterinary use</strong>, are not drugs or dietary supplements, and are not intended to diagnose, 
            treat, cure, or prevent any disease or condition.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { state: checked1, set: setChecked1, label: 'I am 18 years of age or older and am accessing this page in a professional capacity.' },
            { state: checked2, set: setChecked2, label: 'I am a licensed researcher, scientist, or authorized institutional buyer. I understand these compounds are for in-vitro or in-vivo preclinical research only.' },
            { state: checked3, set: setChecked3, label: 'I confirm I will not use, administer, or distribute these compounds for human or veterinary use. I accept full responsibility for compliance with all applicable laws and regulations.' },
          ].map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => item.set(!item.state)}
                className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                  item.state ? 'bg-[#4A6741] border-[#4A6741]' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                }`}
              >
                {item.state && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-xs text-white/60 leading-relaxed">{item.label}</span>
            </label>
          ))}
        </div>

        <Button
          onClick={onConfirm}
          disabled={!allChecked}
          className={`w-full rounded-sm font-bold transition-all ${
            allChecked
              ? 'bg-[#4A6741] hover:bg-[#3D5636] text-white'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          I Confirm — Enter Research Products Catalog
        </Button>
        <p className="text-[10px] text-white/25 text-center mt-3">
          By proceeding, you acknowledge and accept the terms above.
          Misuse of research compounds may violate federal and state laws.
        </p>
      </motion.div>
    </div>
  );
}

function ProductRow({ product }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-[#4A6741]/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-4 h-4 text-[#8FB88F]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{product.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold">RUO ONLY</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/40">{product.category}</span>
            </div>
            <p className="text-xs text-white/35 mt-0.5 font-mono">{product.cas} · {product.form} · {product.purity}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 ml-12">
          <p className="text-xs text-white/30 font-mono mb-2">{product.chemicalName}</p>
          <p className="text-sm text-white/60 leading-relaxed mb-3">{product.description}</p>
          <div className="bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-300 font-semibold">
            ⚠ {product.note}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchProducts() {
  const [ageVerified, setAgeVerified] = useState(false);

  if (!ageVerified) {
    return <AgeGate onConfirm={() => setAgeVerified(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <SEOHead
        title="Research Compound Catalog | For Research Use Only — Institutional Orders"
        description="HPLC-certified peptides and research compounds for licensed institutions, universities, and CROs. COA provided. For research use only — not for human or veterinary use."
      />

      {/* ── RUO Compliance Banner — REQUIRED ────────────────────────────── */}
      <div className="bg-red-900/70 border-b border-red-700/50 text-red-200 text-xs text-center py-3 px-4 leading-relaxed">
        <span className="font-black text-red-300">FOR RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE.</span>
        {' '}These products are not drugs, dietary supplements, or medical devices.
        Not evaluated or approved by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
        For licensed research institutions only.
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-white/8 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400/70 mb-1">Restricted Access — Verified Researchers Only</p>
              <h1 className="text-2xl font-bold text-white">Research Compound Catalog</h1>
              <p className="text-sm text-white/40 mt-1">
                Peptides and research compounds for licensed in-vitro / in-vivo preclinical research use.
                All compounds supplied with Certificate of Analysis (COA).
              </p>
            </div>
          </div>

          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-white/50 leading-relaxed">
              <strong className="text-amber-300">Important Notice:</strong> All compounds on this page are sold exclusively 
              as research chemicals to licensed institutions. They are <strong className="text-white/70">not intended for human consumption, 
              self-administration, or any therapeutic purpose</strong>. By viewing this catalog, you have confirmed 
              your status as an authorized researcher or institutional buyer. We reserve the right 
              to verify institutional credentials before fulfilling any order.
            </div>
          </div>
        </div>
      </div>

      {/* ── Product List ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Available Research Compounds</h2>
            <p className="text-xs text-white/30 mt-0.5">{RUO_CATALOG.length} compounds · COA included · Institutional orders only</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">
              RUO ONLY
            </span>
          </div>
        </div>

        <div className="space-y-1">
          {RUO_CATALOG.map(product => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>

        {/* Ordering / Contact */}
        <div className="mt-10 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-2">Institutional Orders & Inquiries</h3>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            Orders are fulfilled exclusively to verified research institutions, universities, licensed 
            compounding facilities, and CROs (Contract Research Organizations). 
            Please contact our institutional research supply team with your institution name, address, 
            DEA/NPI or institutional ID, and intended research purpose.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-white/40">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <div className="font-semibold text-white/60 mb-1">Minimum Order Requirements</div>
              <ul className="space-y-1">
                <li>• Institutional purchase order or credit account</li>
                <li>• Verified facility address (no residential shipping)</li>
                <li>• Signed RUO agreement on file</li>
                <li>• COA requested with each batch</li>
              </ul>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <div className="font-semibold text-white/60 mb-1">Compliance Documentation</div>
              <ul className="space-y-1">
                <li>• Certificate of Analysis (COA) per batch</li>
                <li>• HPLC purity testing results</li>
                <li>• Mass spectrometry verification</li>
                <li>• Sterility / endotoxin testing (upon request)</li>
              </ul>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/8 text-center">
            <p className="text-[10px] text-white/25 mb-3">
              Contact our institutional sales team for pricing, availability, and verification process.
            </p>
            <a href="mailto:research@medrevolveruo.com">
              <button className="bg-white/8 hover:bg-white/12 border border-white/15 text-white text-sm font-medium px-6 py-2.5 rounded-sm transition-colors">
                Contact Research Supply Team →
              </button>
            </a>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-white/20 leading-relaxed max-w-3xl mx-auto">
            All research compounds are for laboratory and preclinical research use only. 
            Not for human use, self-experimentation, or veterinary use. 
            This catalog strictly prohibits the sale of these compounds for any purpose other than legitimate scientific research. 
            Purchasers assume full responsibility for ensuring use in compliance with all federal, state, and local laws. 
            These statements have not been evaluated by the FDA. These products are not drugs or medical devices.
          </p>
          <p className="text-[10px] text-white/15 mt-2">
            © 2025 Research Compounds · Institutional Supply Division · research@medrevolveruo.com
          </p>
        </div>
      </div>
    </div>
  );
}