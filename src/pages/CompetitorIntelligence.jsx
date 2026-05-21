import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Trophy } from 'lucide-react';

// ── DATA ────────────────────────────────────────────────────────────────────
const FEATURES = [
  'White-Label Storefront',
  'GLP-1 Telehealth',
  'Peptide / RUO Products',
  'Licensed Provider Network',
  'Pharmacy Network',
  'Payment Processing',
  'Compliance Infrastructure',
  'Inventory Management',
  'Website Builder',
  'Marketing Module',
  'Education / University',
  'LLC / Business Formation',
  'Crypto / ACH Payments',
  'B2B Merchant Platform',
  'AI Assistant',
];

const YES = 'yes';
const NO = 'no';
const PARTIAL = 'partial';

const COMPETITORS = [
  {
    name: 'MedRevolve',
    url: 'https://medrevolve.com',
    tagline: 'All-in-one B2B merchant platform for GLP-1, peptide & telehealth businesses',
    model: 'B2B SaaS Platform',
    target: 'Wellness operators, peptide merchants, GLP clinics',
    pricing: 'From $99/mo base → $526–$1,400/mo full stack',
    highlight: true,
    features: {
      'White-Label Storefront': YES,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': YES,
      'Licensed Provider Network': YES,
      'Pharmacy Network': YES,
      'Payment Processing': YES,
      'Compliance Infrastructure': YES,
      'Inventory Management': YES,
      'Website Builder': YES,
      'Marketing Module': PARTIAL,
      'Education / University': YES,
      'LLC / Business Formation': YES,
      'Crypto / ACH Payments': YES,
      'B2B Merchant Platform': YES,
      'AI Assistant': YES,
    },
    notes: 'The only platform offering all modules under one roof including payment processing pre-approved for this space, compliance as architecture (not a certificate), GLP University, Peptide University, and full inventory management.',
    missing: [],
  },
  {
    name: 'Beluga Health',
    url: 'https://belugahealth.com',
    tagline: 'White-label telemedicine solution with physician network & pharmacy fulfillment',
    model: 'White-Label Telehealth API',
    target: 'Health & wellness brands, retailers, pharmaceutical brands',
    pricing: 'Per-visit pricing (not disclosed publicly)',
    highlight: false,
    features: {
      'White-Label Storefront': YES,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': PARTIAL,
      'Licensed Provider Network': YES,
      'Pharmacy Network': YES,
      'Payment Processing': PARTIAL,
      'Compliance Infrastructure': PARTIAL,
      'Inventory Management': NO,
      'Website Builder': PARTIAL,
      'Marketing Module': NO,
      'Education / University': NO,
      'LLC / Business Formation': NO,
      'Crypto / ACH Payments': NO,
      'B2B Merchant Platform': PARTIAL,
      'AI Assistant': NO,
    },
    notes: 'Strong telehealth API and physician network. LegitScript certified. Focuses on clinical delivery — does NOT provide merchant business infrastructure, education, payment processing for operators, or inventory tools.',
    missing: ['Inventory Management', 'Marketing Module', 'Education / University', 'LLC / Business Formation', 'Crypto / ACH Payments', 'AI Assistant'],
  },
  {
    name: 'OpenLoop Health',
    url: 'https://openloophealth.com',
    tagline: 'Enterprise white-label telehealth platform for hospitals, health systems & digital health companies',
    model: 'Enterprise White-Label Telehealth',
    target: 'Hospitals, health systems, retailers, digital health companies',
    pricing: 'Enterprise (custom pricing, contact sales)',
    highlight: false,
    features: {
      'White-Label Storefront': YES,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': NO,
      'Licensed Provider Network': YES,
      'Pharmacy Network': PARTIAL,
      'Payment Processing': PARTIAL,
      'Compliance Infrastructure': YES,
      'Inventory Management': NO,
      'Website Builder': NO,
      'Marketing Module': NO,
      'Education / University': NO,
      'LLC / Business Formation': NO,
      'Crypto / ACH Payments': NO,
      'B2B Merchant Platform': NO,
      'AI Assistant': YES,
    },
    notes: '20k clinicians, 250k patient visits/month, 30+ specialties, all 50 states. Enterprise-grade but NOT built for small wellness operators or peptide merchants. No RUO products, no inventory, no education layer.',
    missing: ['Peptide / RUO Products', 'Inventory Management', 'Website Builder', 'Marketing Module', 'Education / University', 'LLC / Business Formation', 'Crypto / ACH Payments', 'B2B Merchant Platform'],
  },
  {
    name: 'Qualiphy',
    url: 'https://qualiphy.me',
    tagline: 'On-demand good faith exams & telemedicine for med spas and clinics',
    model: 'Pay-Per-Consult Telehealth',
    target: 'Med spas, clinics, aesthetic practices',
    pricing: '$27.99 per consultation — no signup, monthly, or hidden fees',
    highlight: false,
    features: {
      'White-Label Storefront': PARTIAL,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': PARTIAL,
      'Licensed Provider Network': YES,
      'Pharmacy Network': YES,
      'Payment Processing': NO,
      'Compliance Infrastructure': PARTIAL,
      'Inventory Management': NO,
      'Website Builder': NO,
      'Marketing Module': NO,
      'Education / University': NO,
      'LLC / Business Formation': NO,
      'Crypto / ACH Payments': NO,
      'B2B Merchant Platform': NO,
      'AI Assistant': NO,
    },
    notes: 'LegitScript certified. Excellent for good faith exams and instant provider connections. Pay-per-consult model at $27.99. Covers 70+ MedSpa procedures, GLP-1, IV therapy, lab kits. NOT a business platform — no merchant tools, no inventory, no education.',
    missing: ['Payment Processing', 'Inventory Management', 'Website Builder', 'Marketing Module', 'Education / University', 'LLC / Business Formation', 'Crypto / ACH Payments', 'B2B Merchant Platform', 'AI Assistant'],
  },
  {
    name: 'UpScriptHealth',
    url: 'https://upscripthealth.com',
    tagline: '20-year veteran telemedicine platform partnering with pharma brands for DTC prescription distribution',
    model: 'Pharma Partner / DTC Telemedicine',
    target: 'Pharmaceutical companies, established pharma brands',
    pricing: 'Enterprise (custom, pharma-focused)',
    highlight: false,
    features: {
      'White-Label Storefront': YES,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': NO,
      'Licensed Provider Network': YES,
      'Pharmacy Network': YES,
      'Payment Processing': PARTIAL,
      'Compliance Infrastructure': YES,
      'Inventory Management': NO,
      'Website Builder': NO,
      'Marketing Module': YES,
      'Education / University': NO,
      'LLC / Business Formation': NO,
      'Crypto / ACH Payments': NO,
      'B2B Merchant Platform': NO,
      'AI Assistant': NO,
    },
    notes: 'Trusted by AbbVie, Pfizer, Merck, Allergan and 50+ pharma brands. 20+ years in compliance. Built for big pharma NOT for independent wellness operators or peptide merchants. No RUO support, no inventory, no merchant platform.',
    missing: ['Peptide / RUO Products', 'Inventory Management', 'Website Builder', 'Education / University', 'LLC / Business Formation', 'Crypto / ACH Payments', 'B2B Merchant Platform', 'AI Assistant'],
  },
  {
    name: 'WellSync',
    url: 'https://wellsync.com',
    tagline: 'White-label virtual care platform for pharmacies, DTC companies & healthcare innovators',
    model: 'White-Label Telehealth Platform',
    target: 'Pharmacies, DTC companies, labs, healthcare innovators',
    pricing: 'Custom pricing (contact sales)',
    highlight: false,
    features: {
      'White-Label Storefront': YES,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': PARTIAL,
      'Licensed Provider Network': YES,
      'Pharmacy Network': YES,
      'Payment Processing': PARTIAL,
      'Compliance Infrastructure': PARTIAL,
      'Inventory Management': NO,
      'Website Builder': PARTIAL,
      'Marketing Module': NO,
      'Education / University': NO,
      'LLC / Business Formation': NO,
      'Crypto / ACH Payments': NO,
      'B2B Merchant Platform': PARTIAL,
      'AI Assistant': NO,
    },
    notes: 'Powered Vitamin Shoppe\'s Whole Health Rx telehealth. Solid white-label virtual care. Missing merchant business infrastructure, education, payment processing specific to this space, and inventory management.',
    missing: ['Inventory Management', 'Marketing Module', 'Education / University', 'LLC / Business Formation', 'Crypto / ACH Payments', 'AI Assistant'],
  },
  {
    name: 'ProRx',
    url: 'https://prorx.com',
    tagline: 'GLP-1 telehealth provider offering no-additive tirzepatide with overnight shipping',
    model: 'DTC GLP-1 Telehealth',
    target: 'End consumers seeking GLP-1 medications',
    pricing: '$699 starter → $799 ongoing (12-week plans)',
    highlight: false,
    features: {
      'White-Label Storefront': NO,
      'GLP-1 Telehealth': YES,
      'Peptide / RUO Products': PARTIAL,
      'Licensed Provider Network': YES,
      'Pharmacy Network': YES,
      'Payment Processing': PARTIAL,
      'Compliance Infrastructure': PARTIAL,
      'Inventory Management': NO,
      'Website Builder': NO,
      'Marketing Module': NO,
      'Education / University': NO,
      'LLC / Business Formation': NO,
      'Crypto / ACH Payments': NO,
      'B2B Merchant Platform': NO,
      'AI Assistant': NO,
    },
    notes: 'Known differentiator: no-additive tirzepatide + free overnight shipping. DTC consumer brand, NOT a B2B platform. Operators cannot resell or white-label ProRx. No merchant tools whatsoever.',
    missing: ['White-Label Storefront', 'Inventory Management', 'Website Builder', 'Marketing Module', 'Education / University', 'LLC / Business Formation', 'Crypto / ACH Payments', 'B2B Merchant Platform', 'AI Assistant'],
  },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const FeatureIcon = ({ status }) => {
  if (status === YES) return <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (status === NO) return <XCircle className="w-4 h-4 text-red-400 mx-auto" />;
  return <AlertCircle className="w-4 h-4 text-amber-400 mx-auto" />;
};

const modelColors = {
  'B2B SaaS Platform': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'White-Label Telehealth API': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Enterprise White-Label Telehealth': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Pay-Per-Consult Telehealth': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Pharma Partner / DTC Telemedicine': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'White-Label Telehealth Platform': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'DTC GLP-1 Telehealth': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

export default function CompetitorIntelligence() {
  const [search, setSearch] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [view, setView] = useState('cards'); // 'cards' | 'matrix'

  const filtered = COMPETITORS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase()) ||
    c.model.toLowerCase().includes(search.toLowerCase())
  );

  const scoreCompetitor = (c) => {
    return Object.values(c.features).filter(v => v === YES).length;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B8F5E] mb-2">Market Intelligence</p>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">Competitor Analysis</h1>
              <p className="text-white/40 text-sm">GLP-1 / Peptide / Telehealth Platform Landscape — May 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search companies..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 pl-9 w-56"
                />
              </div>
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                <button
                  onClick={() => setView('cards')}
                  className={`px-4 py-2 text-xs font-bold ${view === 'cards' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setView('matrix')}
                  className={`px-4 py-2 text-xs font-bold ${view === 'matrix' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                >
                  Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* MedRevolve wins banner */}
        <div className="bg-[#4A6741]/20 border border-[#6B8F5E]/30 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-[#6B8F5E] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#8FB88F] mb-1">MedRevolve is the only platform with all 15 capabilities in one place</p>
            <p className="text-xs text-white/50">No competitor combines B2B merchant tools + payment processing (pre-approved for this space) + compliance-as-architecture + GLP University + Peptide University + inventory management under one roof. Every other platform does 1-3 things well.</p>
          </div>
        </div>

        {/* ── CARDS VIEW ── */}
        {view === 'cards' && (
          <div className="space-y-4">
            {filtered.map((company) => {
              const score = scoreCompetitor(company);
              const isExpanded = expandedCard === company.name;
              const isUs = company.highlight;

              return (
                <div
                  key={company.name}
                  className={`rounded-xl border transition-all ${
                    isUs
                      ? 'border-[#6B8F5E]/50 bg-[#4A6741]/10'
                      : 'border-white/8 bg-[#111]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className={`text-lg font-black ${isUs ? 'text-[#8FB88F]' : 'text-white'}`}>
                          {company.name}
                        </h2>
                        {isUs && (
                          <span className="text-xs font-bold bg-[#4A6741] text-white px-2 py-0.5 rounded-full">
                            ← US
                          </span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${modelColors[company.model] || 'bg-white/5 text-white/50 border-white/10'}`}>
                          {company.model}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm">{company.tagline}</p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Score */}
                      <div className="text-center">
                        <div className={`text-2xl font-black ${isUs ? 'text-[#8FB88F]' : score >= 10 ? 'text-emerald-400' : score >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                          {score}/{FEATURES.length}
                        </div>
                        <div className="text-xs text-white/30">capabilities</div>
                      </div>
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : company.name)}
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Quick feature pills */}
                  <div className="px-5 pb-4 flex flex-wrap gap-2">
                    {FEATURES.map(f => (
                      <span
                        key={f}
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1.5 ${
                          company.features[f] === YES
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : company.features[f] === PARTIAL
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-white/5 text-white/20 border border-white/5'
                        }`}
                      >
                        {company.features[f] === YES ? '✓' : company.features[f] === PARTIAL ? '~' : '✗'} {f}
                      </span>
                    ))}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-white/8 p-5 grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2">Target Customer</p>
                        <p className="text-sm text-white/70">{company.target}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2">Pricing</p>
                        <p className="text-sm text-white/70">{company.pricing}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2">Key Gaps vs MedRevolve</p>
                        {company.missing.length === 0 ? (
                          <p className="text-sm text-[#8FB88F] font-bold">Full coverage — This is us! 🎉</p>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {company.missing.slice(0, 6).map(m => (
                              <span key={m} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">{m}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2">Assessment</p>
                        <p className="text-sm text-white/60 leading-relaxed">{company.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MATRIX VIEW ── */}
        {view === 'matrix' && (
          <div className="overflow-x-auto rounded-xl border border-white/8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-white/8">
                  <th className="text-left px-4 py-3 text-white/40 font-semibold text-xs uppercase tracking-wider sticky left-0 bg-[#111] w-44 min-w-[11rem]">
                    Feature
                  </th>
                  {filtered.map(c => (
                    <th key={c.name} className={`px-4 py-3 text-center text-xs font-bold min-w-[120px] ${c.highlight ? 'text-[#8FB88F]' : 'text-white/60'}`}>
                      {c.name}
                      {c.highlight && <span className="block text-[10px] text-[#6B8F5E]">← US</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, i) => (
                  <tr key={feature} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#0D0D0D]'}`}>
                    <td className="px-4 py-2.5 text-white/60 text-xs font-medium sticky left-0 bg-inherit">
                      {feature}
                    </td>
                    {filtered.map(c => (
                      <td key={c.name} className={`px-4 py-2.5 text-center ${c.highlight ? 'bg-[#4A6741]/5' : ''}`}>
                        <FeatureIcon status={c.features[feature]} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-white/20 bg-[#111]">
                  <td className="px-4 py-3 text-white/40 text-xs font-bold uppercase sticky left-0 bg-[#111]">Total Score</td>
                  {filtered.map(c => {
                    const score = scoreCompetitor(c);
                    return (
                      <td key={c.name} className={`px-4 py-3 text-center font-black text-base ${c.highlight ? 'text-[#8FB88F]' : score >= 10 ? 'text-emerald-400' : score >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                        {score}/{FEATURES.length}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Full capability</span>
          <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Partial / limited</span>
          <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-red-400" /> Not offered</span>
          <span className="ml-auto">Last updated: May 2026 · Based on public information</span>
        </div>
      </div>
    </div>
  );
}