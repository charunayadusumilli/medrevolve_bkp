import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Clock, Circle,
  Layers, ShoppingCart, Users, Shield, CreditCard, Building2,
  Pill, Stethoscope, Globe, BarChart3, ArrowRight, Zap, Target,
  TrendingUp, Package, Truck, FlaskConical, Network, DollarSign,
  FileText, Link, Cpu, HardDrive, Phone, Star, XCircle
} from 'lucide-react';

// ── Data extracted from all 10 call recordings ──────────────────────────
const PLATFORM_ARCHITECTURE = {
  b2bLayers: [
    { id: 'medrevolve_platform', label: 'MedRevolve Platform (Hub)', desc: 'Central SaaS infrastructure: website builder, compliance scanner, merchant onboarding, payment rails, inventory', color: '#4A6741', level: 0 },
    { id: 'merchant_layer', label: 'Merchant / B2B Operators', desc: 'Med Spas, Gyms, Clinics, Fitness Coaches, RUO sellers — they plug in and sell under their brand', color: '#6B8F5E', level: 1 },
    { id: 'consumer_layer', label: 'End Consumers (B2C)', desc: 'Patients seeking GLP-1, peptides, telehealth consultations, wellness products', color: '#8FB88F', level: 2 },
  ],
  noTelehealthFlow: [
    { step: 1, label: 'Merchant signs up', desc: 'Basic info → LLC formation → domain → white-label website (20 templates)' },
    { step: 2, label: 'Merchant gets compliance badge', desc: 'Legit Script / PepMD crawler scans site, certifies it, issues badge' },
    { step: 3, label: 'Merchant gets payment processing', desc: 'Under MedRevolve master merchant account (Open Loop model) OR their own sub-account' },
    { step: 4, label: 'Merchant selects product catalog', desc: 'Choose from approved GLP-1, RUO peptides, bacteriostatic water, supplements' },
    { step: 5, label: 'Consumer buys', desc: 'Payment flows through MedRevolve → pharmacy ships → no telehealth needed for RUO side' },
    { step: 6, label: 'MedRevolve earns', desc: 'Platform fee ($299/mo) + payment processing cut + product markup + compliance module fee' },
  ]
};

const ECOSYSTEM_VENDORS = [
  { cat: 'Payment Processing', items: ['Open Loop (expensive, full-service, merchant-of-record)', 'LegitScript merchant account (compliant for GLP)', 'Mastercard direct (card brand compliance)', 'Crypto processor (in exploration)', 'Multiple processors for redundancy (22 banks lined up)', 'RDR (Rapid Dispute Resolution) for chargeback management', '3D Secure for fraud prevention'], icon: CreditCard, color: '#3B82F6' },
  { cat: 'Compliance & Certification', items: ['LegitScript — website crawler/certification ($1,500/mo, ~1,500 clients)', 'PepMD — peptide-specific compliance + certification (Kartick partnership)', 'FDA letter monitoring AI (Mastercard + FDA both using AI scrapers)', 'MCC (Merchant Category Code) verification', 'Own MedRevolve certification standard (planned)'], icon: Shield, color: '#8B5CF6' },
  { cat: 'Pharmacy Partners (503A/503B)', items: ['8 pharmacies in pipeline', 'Kartick — 503A/503B, 4,000 clients, manufacturing facility (Chicago-area)', 'Qualify Me pharmacies (5-6 partner pharmacies)', 'Compounding pharmacies for GLP-1 / peptides', 'National shipping capability required'], icon: Pill, color: '#EC4899' },
  { cat: 'Providers / Telehealth', items: ['Qualify Me — ~1,500 providers, telehealth platform', 'Virtual Medical Assistants ($7/hr, Philippines — VA scheduling, EHR)', 'Oak Island TX credentialing company ($150/provider/insurance pair, 90-120 day process)', 'MDIntegrations — telehealth API integration', 'Target: 5 providers minimum (50 states coverage via licensing)', 'Qualifications: NP, PA, MD — must be state-licensed'], icon: Stethoscope, color: '#10B981' },
  { cat: 'Supply Chain / Manufacturing', items: ['Kartick (PurePeptides) — US manufacturing, 2-day delivery, COA included', 'China suppliers — 1,200 factories, $10/vial (seizure/testing risk)', 'Bacteriostatic water (Hospira/Pfizer brand, $5-$30/vial market)', 'India sourcing (trip planned June — 1M+ vials)', 'GLP-1/GLP-2/GLP-3 — semaglutide, tirzepatide, retatrutide'], icon: Package, color: '#F59E0B' },
  { cat: 'CRM & Marketing', items: ['Zoho CRM (integrated)', 'HubSpot (integrated)', 'Intent data platform ($2,000/mo — 7-10 day real-time buyer signals)', 'Web scrapers (Python, built by Noel\'s brother)', 'Facebook/Instagram/X advertising (with LegitScript badge)', 'UGC content / creator program'], icon: BarChart3, color: '#06B6D4' },
  { cat: 'Technology Infrastructure', items: ['Base44 platform (current build)', 'Multiple domain strategy (medrevolve.com, B2B subdomain, bacteriostatic water site)', 'White-label website builder (20 templates)', 'LegitScript crawler API integration', 'Mobile app (wellness tracking — before/after, weight, fitness)', 'Cloud/data center (India setup planned for redundancy)', 'PCI DSS compliance required'], icon: Cpu, color: '#84CC16' },
  { cat: 'Insurance / Medical Billing', items: ['Aetna, Signa, United Healthcare, Medicare, BCBS, Kaiser — credentialing', 'EHR system required for billing', 'Medical billing company (Oak Island, Michigan, 48 VMA staff)', 'SOC2 compliance for SaaS', 'Malpractice / E&O / liability insurance required'], icon: FileText, color: '#F97316' },
];

const PRODUCT_CATALOG = [
  { name: 'GLP-1 (Semaglutide)', type: 'GLP / Consumer + RUO', status: 'active', note: 'Top seller — competitor sells $99 (10mg). LegitScript required for consumer sales.' },
  { name: 'GLP-2 (Tirzepatide)', type: 'GLP / Consumer + RUO', status: 'active', note: '5mg and 10mg are best-sellers based on competitor data analysis.' },
  { name: 'GLP-3 (Retatrutide)', type: 'GLP / RUO', status: 'active', note: 'Growing demand — label as chemical compound only, not brand name.' },
  { name: 'BPC-157', type: 'RUO Peptide', status: 'active', note: 'Strong seller — research-only. Cannot be on GLP/consumer site.' },
  { name: 'CJC-1295', type: 'RUO Peptide', status: 'active', note: 'Research-only compound, check FDA status before listing.' },
  { name: 'GHK-Cu (Copper Peptide)', type: 'RUO Peptide', status: 'active', note: 'Popular in longevity/anti-aging vertical.' },
  { name: 'Bacteriostatic Water', type: 'Ancillary / B2B Supply', status: 'priority', note: '$1.2B market (BWFi). Kartick needs it. Sourcing from India/Pfizer Hospira. Never show with syringe on RUO site.' },
  { name: 'TB-500 / AOD / Ipamorelin', type: 'RUO Peptides', status: 'active', note: 'Bundled sales with bacteriostatic water are common.' },
  { name: 'Testosterone / Anavar', type: 'Controlled (via DefyMedical)', status: 'caution', note: 'DefyMedical model — need proper processor. Do NOT sell on RUO sites.' },
  { name: 'Melatonin', type: 'Supplements', status: 'caution', note: 'Automatically flags site as consumer-facing. Avoid unless on separate consumer site.' },
];

const ACTION_ITEMS = [
  { priority: 'critical', area: 'Payment Processing', task: 'Apply for LegitScript merchant account — submit website + paperwork', owner: 'Noel', status: 'in_progress', deadline: 'Immediate' },
  { priority: 'critical', area: 'Compliance', task: 'Get LegitScript certification ($1,500/mo) — run crawler against site', owner: 'Dev', status: 'in_progress', deadline: 'Week 1' },
  { priority: 'critical', area: 'Website', task: 'Remove all FDA-banned compounds from medrevolve.com Products page. Only bacteriostatic water shown. RUO compounds moved to /ResearchProducts with age gate.', owner: 'Dev', status: 'done', deadline: 'Immediate' },
  { priority: 'critical', area: 'Website', task: 'Add proper disclaimers: "For research use only, not for human or veterinary use" + age gate + Terms/Privacy/Refund policy. RUO page has age gate + full disclaimer stack.', owner: 'Dev', status: 'done', deadline: 'Week 1' },
  { priority: 'high', area: 'Payment Processing', task: 'Get Mastercard direct relationship setup — apply to card brand compliance', owner: 'Noel', status: 'todo', deadline: 'Week 2' },
  { priority: 'high', area: 'Supply Chain', task: 'Finalize Kartick (PurePeptides) partnership — exclusivity agreement for water + peptides', owner: 'Noel', status: 'in_progress', deadline: 'Week 1' },
  { priority: 'high', area: 'Product', task: 'Launch Bacteriostatic Water only page on medrevolve.com (B2B supply only). Full separate domain (bacteriostaticwater.xyz) still needed for standalone retail.', owner: 'Dev', status: 'in_progress', deadline: 'Week 2' },
  { priority: 'high', area: 'Onboarding', task: 'Onboard first B2B merchant (Mike) — white-label GLP site, tie in Legit Script, payment processing', owner: 'Both', status: 'in_progress', deadline: 'This Week' },
  { priority: 'high', area: 'Technology', task: 'Integrate PepMD compliance crawler API into MedRevolve merchant onboarding flow', owner: 'Dev', status: 'todo', deadline: 'Week 2' },
  { priority: 'medium', area: 'Providers', task: 'Recruit 5 providers with multi-state licenses via Qualify Me / MDIntegrations', owner: 'Noel', status: 'todo', deadline: 'Month 1' },
  { priority: 'medium', area: 'Infrastructure', task: 'Set up multiple payment processor accounts (22 bank relationships) for redundancy', owner: 'Noel', status: 'todo', deadline: 'Month 1' },
  { priority: 'medium', area: 'Insurance', task: 'Begin credentialing with Aetna, United, BCBS — hire Oak Island TX medical billing (VMAs)', owner: 'Both', status: 'todo', deadline: 'Month 1-3' },
  { priority: 'medium', area: 'Marketing', task: 'Set up Intent data platform ($2K/mo) — scrape GLP/peptide searchers and market to them', owner: 'Noel', status: 'todo', deadline: 'Month 1' },
  { priority: 'medium', area: 'Supply Chain', task: 'Plan India sourcing trip (June) — 1M+ bacteriostatic water vials, batch test, COA', owner: 'Noel', status: 'planned', deadline: 'June' },
  { priority: 'low', area: 'Technology', task: 'Build mobile wellness tracking app (before/after, weight logging, fitness tracking)', owner: 'Dev', status: 'todo', deadline: 'Month 2-3' },
  { priority: 'low', area: 'Infrastructure', task: 'India data center setup for global redundancy and compliance hosting', owner: 'Noel', status: 'planned', deadline: 'Month 3+' },
];

const REVENUE_STREAMS = [
  { name: 'Platform Monthly Fee', model: 'SaaS', amount: '$299/mo per merchant', potential: 'High', note: 'LegitScript is ~$300/mo with 1,500 clients = $450K/mo. We target same.' },
  { name: 'Payment Processing Cut', model: 'Transaction %', amount: '2-3% per transaction', potential: 'Very High', note: 'Merchant-of-record (Open Loop) model or sub-merchant fee.' },
  { name: 'Compliance Badge Fee', model: 'One-time + monthly', amount: '$500 setup + $99/mo', potential: 'Medium', note: 'Compete with LegitScript — own certification standard.' },
  { name: 'LLC Formation', model: 'One-time service', amount: '$299-$799', potential: 'Medium', note: 'Automated LLC creation on onboarding.' },
  { name: 'Bacteriostatic Water Sales', model: 'Product wholesale', amount: '$5-$30/vial markup', potential: 'Very High', note: '$1.2B market. Kartick + India sourcing = group buying power.' },
  { name: 'Peptide Product Markup', model: 'Product wholesale', amount: '30-100% markup', potential: 'High', note: 'US-sourced at competitive prices vs China. COA included = premium.' },
  { name: 'Telehealth Consultation', model: 'Per consultation', amount: '$15-$30/consult', potential: 'High', note: 'Provider gets paid, platform keeps spread. Insurance reimbursable.' },
  { name: 'Website Builder / Hosting', model: 'Module fee', amount: '$49-$199/mo', potential: 'Medium', note: '20 template library. Custom site = extra dev charge.' },
  { name: 'Insurance Billing (Medical)', model: '% of collection', amount: '7-8% of claims', potential: 'Future', note: 'Via Oak Island credentialing + EHR integration.' },
  { name: 'Intent Data Resale', model: 'Data product', amount: 'TBD', potential: 'Future', note: 'Scrape and resell B2B buyer intent data from the sector.' },
];

const COMPLIANCE_RULES = [
  { rule: 'Never list bacteriostatic water alongside syringes on a research-only site', severity: 'critical', reason: 'Instantly flags the site as consumer/human use' },
  { rule: 'Never use brand names (Ozempic, Wegovy, Rybelsus) — use chemical names only', severity: 'critical', reason: 'FDA actively monitors and sends warning letters; Eli Lilly will sue' },
  { rule: 'No GLP-1 on RUO site. No RUO peptides on GLP/consumer site', severity: 'critical', reason: 'Cross-contamination triggers compliance failure on both sides' },
  { rule: 'No pixel/conversion tracking showing "weight loss" intent on research site', severity: 'high', reason: 'FDA AI crawlers use pixel data to prove human/consumer use intent' },
  { rule: 'No "before/after" human transformation images on research site', severity: 'high', reason: 'Implies human use' },
  { rule: 'Age gate + disclaimer + "not for human use" language required at every product level', severity: 'high', reason: 'LegitScript and card brands require this for approval' },
  { rule: 'Shipping to a doctor\'s office address = automatic FDA flag for human use', severity: 'high', reason: 'FDA uses shipping manifests as evidence' },
  { rule: 'RDR + 3D Secure on merchant accounts to avoid chargebacks exceeding 0.25%', severity: 'medium', reason: 'Card brands will terminate accounts above threshold; match list follows' },
  { rule: 'Each state requires separate provider credentialing ($150/insurance/provider)', severity: 'medium', reason: 'Telehealth prescriptions require state licensing in patient\'s state' },
  { rule: 'PCI-DSS required for any payment processing platform', severity: 'medium', reason: 'Mandatory for Mastercard/Visa merchant-of-record status' },
];

// ── Subcomponents ────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color = '#4A6741' }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const cfg = {
    critical: { label: 'CRITICAL', bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    high: { label: 'HIGH', bg: 'bg-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
    medium: { label: 'MEDIUM', bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    low: { label: 'LOW', bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
  }[priority] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-400' },
    todo: { label: 'To Do', icon: Circle, color: 'text-white/40' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-green-400' },
    planned: { label: 'Planned', icon: Star, color: 'text-purple-400' },
  }[status] || { label: status, icon: Circle, color: 'text-white/40' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${cfg.color}`}>
      <cfg.icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function Collapsible({ title, icon: IconComp, color, children, defaultOpen = false }) {
  const Icon = IconComp;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}25` }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────
export default function StrategyIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'vendors', label: 'Vendors & Partners' },
    { id: 'products', label: 'Products' },
    { id: 'actions', label: 'Action Items' },
    { id: 'revenue', label: 'Revenue Model' },
    { id: 'compliance', label: 'Compliance Rules' },
  ];

  const criticalItems = ACTION_ITEMS.filter(i => i.priority === 'critical');
  const highItems = ACTION_ITEMS.filter(i => i.priority === 'high');
  const inProgressItems = ACTION_ITEMS.filter(i => i.status === 'in_progress');
  const todoItems = ACTION_ITEMS.filter(i => i.status === 'todo');

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      {/* Header */}
      <div className="border-b border-white/8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
                  <span className="text-black font-black text-[9px]">MR</span>
                </div>
                <span className="text-xs text-white/30 uppercase tracking-widest">MedRevolve Intelligence</span>
              </div>
              <h1 className="text-2xl font-black text-white">Strategic Operations Dashboard</h1>
              <p className="text-sm text-white/40 mt-1">Synthesized from 10 strategy calls (Feb–May 2026) · Confidential</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="bg-white/5 rounded-xl px-4 py-2">
                <div className="text-lg font-black text-red-400">{criticalItems.length}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest">Critical</div>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-2">
                <div className="text-lg font-black text-orange-400">{highItems.length}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest">High Priority</div>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-2">
                <div className="text-lg font-black text-blue-400">{inProgressItems.length}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest">In Progress</div>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-2">
                <div className="text-lg font-black text-white/50">{todoItems.length}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest">To Do</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto scrollbar-hide">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === t.id ? 'bg-white text-black' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Key Thesis */}
            <div className="bg-gradient-to-br from-[#1a2a1a] to-[#0f1f0f] border border-[#4A6741]/30 rounded-2xl p-6">
              <h2 className="text-base font-bold text-[#8FB88F] mb-3 uppercase tracking-widest text-xs">Core Thesis (from calls)</h2>
              <p className="text-white/80 leading-relaxed">
                MedRevolve is being built as <strong className="text-white">the operating system for compliant wellness merchants</strong> — 
                a unified platform that provides everything a med spa, gym, clinic, or GLP seller needs: 
                white-label website, compliance certification, payment processing, inventory/supply chain, telehealth, 
                CRM and marketing — all under one merchant account. The key insight: <strong className="text-white">we become the LegitScript + Open Loop + PepMD + website builder combined</strong>, 
                taking a cut at every layer.
              </p>
            </div>

            {/* Two-mode strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white">Mode A: Merchant-of-Record (Open Loop)</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-white/60">
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />MedRevolve holds master merchant account</li>
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />Consumer pays MedRevolve → we pay out merchant</li>
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />Merchant benefits: instant launch, no compliance headache</li>
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />We earn: spread between consumer price and payout</li>
                </ul>
              </div>
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white">Mode B: Sub-Merchant / Own Account</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-white/60">
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />Merchant has own LegitScript-approved account</li>
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />Collects money directly from consumers</li>
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />Pays MedRevolve platform fee for services used</li>
                  <li className="flex gap-2"><ArrowRight className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />We earn: monthly SaaS + compliance + module fees</li>
                </ul>
              </div>
            </div>

            {/* What's built vs what's needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Already Built (this platform)</h3>
                <ul className="space-y-1.5 text-sm text-white/60">
                  {['Merchant onboarding flow', 'White-label website builder framework', 'Partner/Provider/Pharmacy intake', 'HubSpot + Zoho CRM integration', 'Stripe payment integration', 'Google Calendar / telehealth booking', 'Compliance dashboard', 'Inventory management module', 'Creator/affiliate program', 'Admin analytics dashboard', 'Email notifications (Gmail connector)'].map(i => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />{i}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Still Needed (from calls)</h3>
                <ul className="space-y-1.5 text-sm text-white/60">
                  {['LegitScript API / PepMD crawler integration', 'Master merchant account (Mastercard direct)', 'Bacteriostatic water separate domain/site', 'Sub-merchant account management (payfac)', 'FDA-compliant product labeling system', 'Multiple payment processor redundancy', 'EHR integration (for insurance billing)', 'Medical billing module (Oak Island VMA)', 'Intent data platform integration', 'Mobile wellness tracking app', 'India/US vial sourcing pipeline', 'Provider multi-state credentialing flow'].map(i => (
                    <li key={i} className="flex gap-2"><AlertCircle className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />{i}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Market size */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Bacteriostatic Water Market', value: '$1.2B', note: '2024, US hospitals/clinics/pharma', color: '#4A6741' },
                { label: 'GLP-1 Sector Revenue', value: '$3.4M/mo', note: 'Single competitor site observed', color: '#3B82F6' },
                { label: 'LegitScript Revenue', value: '$450K/mo', note: '1,500 clients × $300/mo', color: '#8B5CF6' },
                { label: 'Peptide Market Growth', value: '10x', note: 'Estimated demand expansion', color: '#F59E0B' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-white/70 font-semibold">{stat.label}</div>
                  <div className="text-[10px] text-white/30 mt-1">{stat.note}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ARCHITECTURE ─────────────────────────────────────────────── */}
        {activeTab === 'architecture' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <SectionHeader icon={Network} title="Unified Platform Architecture" subtitle="How MedRevolve connects B2B merchants to end consumers — without requiring telehealth" />

            {/* Layer diagram */}
            <div className="space-y-3">
              {PLATFORM_ARCHITECTURE.b2bLayers.map((layer, i) => (
                <motion.div key={layer.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="relative rounded-xl p-5 border"
                  style={{ borderColor: `${layer.color}40`, background: `${layer.color}08`, marginLeft: `${i * 24}px` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ background: layer.color, color: '#fff' }}>{i + 1}</div>
                    <div>
                      <h3 className="font-bold text-white">{layer.label}</h3>
                      <p className="text-sm text-white/50 mt-0.5">{layer.desc}</p>
                    </div>
                  </div>
                  {i < PLATFORM_ARCHITECTURE.b2bLayers.length - 1 && (
                    <div className="absolute -bottom-3 left-10 text-white/20 text-lg">↓</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Non-telehealth flow */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Non-Telehealth Customer Onboarding Flow</h3>
              <div className="space-y-3">
                {PLATFORM_ARCHITECTURE.noTelehealthFlow.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-[#4A6741]/20 border border-[#4A6741]/40 flex items-center justify-center text-xs font-bold text-[#8FB88F] flex-shrink-0">{step.step}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{step.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{step.desc}</div>
                    </div>
                    {i < PLATFORM_ARCHITECTURE.noTelehealthFlow.length - 1 && <ArrowRight className="w-4 h-4 text-white/20 mt-1 hidden md:block" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Site Strategy */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Multi-Domain Strategy (from calls)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { domain: 'medrevolve.com', purpose: 'B2B Platform Hub', content: 'Merchant onboarding, platform features, B2B value prop. Consumer-facing landing.', warning: false },
                  { domain: '[merchant].medrevolve.com', purpose: 'White-Label Merchant Sites', content: '20 templates. Merchant logo + brand. Powered by MedRevolve infrastructure. LegitScript badge on each.', warning: false },
                  { domain: 'bacteriostaticwater.xyz (separate)', purpose: 'Bacteriostatic Water Only', content: 'SEPARATE domain — not on medrevolve. Sells ONLY water. No peptides. No syringes pictured. Low compliance risk.', warning: true },
                ].map(site => (
                  <div key={site.domain} className={`rounded-xl p-4 border ${site.warning ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/8 bg-white/[0.02]'}`}>
                    <div className="text-xs font-mono text-white/50 mb-1">{site.domain}</div>
                    <div className="font-semibold text-white text-sm mb-2">{site.purpose}</div>
                    <div className="text-xs text-white/50">{site.content}</div>
                    {site.warning && <div className="text-[10px] text-orange-400 mt-2 font-semibold">⚠ Keep completely separate from main platform</div>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── VENDORS ──────────────────────────────────────────────────── */}
        {activeTab === 'vendors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <SectionHeader icon={Link} title="Vendor & Partner Ecosystem" subtitle="All vendors, integrations, and partners discussed across 10 calls" />
            {ECOSYSTEM_VENDORS.map(vendor => (
              <Collapsible key={vendor.cat} title={vendor.cat} icon={vendor.icon} color={vendor.color} defaultOpen={vendor.cat === 'Payment Processing' || vendor.cat === 'Compliance & Certification'}>
                <ul className="space-y-2 mt-2">
                  {vendor.items.map(item => (
                    <li key={item} className="flex gap-2 text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: vendor.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Collapsible>
            ))}
          </motion.div>
        )}

        {/* ── PRODUCTS ─────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <SectionHeader icon={FlaskConical} title="Product Catalog" subtitle="What to sell, where to list it, and compliance status" />
            <div className="space-y-2">
              {PRODUCT_CATALOG.map(product => (
                <div key={product.name} className={`rounded-xl p-4 border flex flex-col md:flex-row md:items-start gap-3 ${
                  product.status === 'priority' ? 'border-yellow-500/30 bg-yellow-500/5' :
                  product.status === 'caution' ? 'border-red-500/20 bg-red-500/5' :
                  'border-white/8 bg-white/[0.02]'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{product.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">{product.type}</span>
                      {product.status === 'priority' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">★ PRIORITY</span>}
                      {product.status === 'caution' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">⚠ CAUTION</span>}
                    </div>
                    <p className="text-xs text-white/40 mt-1">{product.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ACTION ITEMS ─────────────────────────────────────────────── */}
        {activeTab === 'actions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <SectionHeader icon={Target} title="Action Items" subtitle="Prioritized tasks extracted from all 10 calls" />
            {['critical', 'high', 'medium', 'low'].map(prio => {
              const items = ACTION_ITEMS.filter(i => i.priority === prio);
              if (!items.length) return null;
              return (
                <div key={prio}>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 mt-4">{prio} Priority</div>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col md:flex-row md:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <PriorityBadge priority={item.priority} />
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/40">{item.area}</span>
                          </div>
                          <p className="text-sm text-white font-medium">{item.task}</p>
                          <div className="flex gap-4 mt-2">
                            <StatusBadge status={item.status} />
                            <span className="text-xs text-white/30">Owner: <span className="text-white/50">{item.owner}</span></span>
                            <span className="text-xs text-white/30">By: <span className="text-white/50">{item.deadline}</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── REVENUE ──────────────────────────────────────────────────── */}
        {activeTab === 'revenue' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <SectionHeader icon={DollarSign} title="Revenue Model" subtitle="All revenue streams identified across calls" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REVENUE_STREAMS.map(stream => (
                <div key={stream.name} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm">{stream.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      stream.potential === 'Very High' ? 'bg-green-500/20 text-green-400' :
                      stream.potential === 'High' ? 'bg-blue-500/20 text-blue-400' :
                      stream.potential === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/40'
                    }`}>{stream.potential}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs text-white/30">{stream.model}</span>
                    <span className="text-xs text-[#8FB88F] font-semibold">{stream.amount}</span>
                  </div>
                  <p className="text-xs text-white/40">{stream.note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── COMPLIANCE ───────────────────────────────────────────────── */}
        {activeTab === 'compliance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <SectionHeader icon={Shield} title="Compliance Rules" subtitle="Critical rules extracted from calls — violating any of these will get merchant accounts terminated or FDA letters" />
            <div className="space-y-3">
              {COMPLIANCE_RULES.map((rule, i) => (
                <div key={i} className={`rounded-xl p-4 border flex gap-3 items-start ${
                  rule.severity === 'critical' ? 'border-red-500/30 bg-red-500/5' :
                  rule.severity === 'high' ? 'border-orange-500/20 bg-orange-500/5' :
                  'border-white/8 bg-white/[0.02]'}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {rule.severity === 'critical' ? <XCircle className="w-4 h-4 text-red-500" /> :
                     rule.severity === 'high' ? <AlertCircle className="w-4 h-4 text-orange-500" /> :
                     <Shield className="w-4 h-4 text-white/30" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{rule.rule}</p>
                    <p className="text-xs text-white/40 mt-1">Reason: {rule.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}