/**
 * PersonalizedDemo — live white-label site preview personalized with the
 * prospect's business name, niche, and brand color from the onboarding wizard.
 * Opened in a new tab. Shows a fully branded demo then CTAs back to pay.
 *
 * URL params:
 *   biz   — business name (e.g. "Elite Wellness Co.")
 *   niche — primary niche key (weight_loss | hormones | mens_health | womens_health | longevity | peptides)
 *   color — hex color without # (e.g. 4A6741)
 *   domain — suggested domain slug (e.g. elitewellness)
 */
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck, CheckCircle, Stethoscope, Phone, ArrowRight,
  Star, Clock, Users, Lock, Zap, Heart, Activity, User, Package
} from 'lucide-react';

// ── Niche configurations ──────────────────────────────────────────────────────
const NICHES = {
  weight_loss: {
    label: 'Medical Weight Loss',
    tagline: 'Physician-Supervised Weight Loss Programs',
    subtitle: 'GLP-1 medications, personalized protocols, and ongoing physician support — all from home.',
    heroHeadline: (biz) => `${biz} Weight Loss`,
    heroSub: 'Clinically proven weight loss with physician-prescribed GLP-1 programs. No insurance required.',
    badge: 'LegitScript Certified · Licensed Physicians',
    products: [
      { name: 'Semaglutide Program', desc: 'Physician-prescribed compounded semaglutide. Monthly supply included. Provider check-ins every 4 weeks.', price: 299, freq: 'mo', tag: 'Most Popular', specs: ['Physician consultation included', '503A licensed pharmacy', 'Monthly dosage titration', 'Unlimited messaging'] },
      { name: 'Tirzepatide Protocol', desc: 'Dual GLP-1/GIP receptor agonist. Superior clinical outcomes. Provider-supervised monthly protocol.', price: 349, freq: 'mo', tag: 'Premium', specs: ['Board-certified physician', '503B pharmacy dispensed', 'Initial + monthly visits', 'Personalized titration'] },
      { name: 'Metabolic Reset', desc: 'Comprehensive weight management: GLP-1 + metabolic panel + nutrition coaching. Full-service program.', price: 449, freq: 'mo', tag: null, specs: ['Full metabolic panel', 'Nutrition coaching', 'Physician supervised', 'Lab results included'] },
    ],
    ctaLabel: 'Start My Program',
    ctaSub: 'Physician consultation required. Results may vary.',
    trustBadges: ['HIPAA Compliant', '503A/B Pharmacy', 'Licensed Physicians', 'All 50 States'],
    bgLight: '#F9F7F4',
    cardBg: '#FFFFFF',
  },
  hormones: {
    label: 'Hormone Therapy',
    tagline: 'Personalized Hormone Replacement Programs',
    subtitle: 'BHRT, TRT, and hormone optimization — physician-prescribed and pharmacy-dispensed.',
    heroHeadline: (biz) => `${biz} Hormone Clinic`,
    heroSub: 'Restore balance. Optimize vitality. Physician-supervised hormone therapy for men and women.',
    badge: 'Board-Certified Physicians · Licensed Compounding Pharmacy',
    products: [
      { name: "Men's TRT Program", desc: 'Testosterone replacement therapy with comprehensive lab panel. Physician-supervised monthly protocol.', price: 199, freq: 'mo', tag: 'Most Popular', specs: ['Full hormone panel included', 'Physician consultation', 'Licensed compounding Rx', 'Monthly follow-ups'] },
      { name: "Women's BHRT", desc: 'Bioidentical hormone replacement therapy. Estrogen, progesterone, and more — personalized to your labs.', price: 229, freq: 'mo', tag: 'Top Rated', specs: ['Comprehensive labs included', 'Female hormone specialist', '503A pharmacy', 'Ongoing monitoring'] },
      { name: 'Hormone Optimization+', desc: 'Advanced panel: testosterone, thyroid, adrenal, growth hormone optimization for peak performance.', price: 349, freq: 'mo', tag: null, specs: ['12-panel lab workup', 'Anti-aging physician', 'Custom compounding', 'Quarterly reassessment'] },
    ],
    ctaLabel: 'Get My Hormone Panel',
    ctaSub: 'Requires physician consultation and valid prescription.',
    trustBadges: ['HIPAA Compliant', 'Licensed Pharmacy', 'Board-Certified MDs', 'All 50 States'],
    bgLight: '#F7F8FA',
    cardBg: '#FFFFFF',
  },
  mens_health: {
    label: "Men's Health",
    tagline: "Men's Health & Performance Programs",
    subtitle: 'TRT, ED treatment, hair loss, and weight management — all from home, physician-supervised.',
    heroHeadline: (biz) => `${biz} Men's Health`,
    heroSub: "Reclaim your edge. Physician-prescribed men's health programs delivered to your door.",
    badge: 'Licensed Male Health Physicians · Discreet Shipping',
    products: [
      { name: 'TRT Starter Plan', desc: 'Complete testosterone replacement therapy with labs, physician consult, and monthly Rx.', price: 199, freq: 'mo', tag: 'Most Popular', specs: ['Full hormone panel', 'Physician consultation', 'Testosterone Rx included', 'Monthly follow-ups'] },
      { name: 'ED Treatment Program', desc: 'Physician-prescribed sildenafil or tadalafil. Discreet delivery. Licensed provider supervision.', price: 89, freq: 'mo', tag: 'Discreet', specs: ['Same-day consult available', 'Licensed physician', 'Pharmacy dispensed', 'Discreet packaging'] },
      { name: 'Weight + Hormone Bundle', desc: 'GLP-1 weight loss + testosterone optimization. The complete male health transformation protocol.', price: 399, freq: 'mo', tag: 'Best Value', specs: ['Dual protocol', 'Two physician consults', 'Dedicated care team', 'Priority support'] },
    ],
    ctaLabel: 'Start My Program',
    ctaSub: 'Prescription required. Physician consultation included.',
    trustBadges: ['HIPAA Compliant', 'Discreet Delivery', 'Licensed Physicians', 'All 50 States'],
    bgLight: '#F4F6F9',
    cardBg: '#FFFFFF',
  },
  womens_health: {
    label: "Women's Health",
    tagline: "Women's Health & Wellness Programs",
    subtitle: 'BHRT, weight loss, and women\'s wellness — physician-supervised and personalized to you.',
    heroHeadline: (biz) => `${biz} Women's Wellness`,
    heroSub: 'Feel like yourself again. Physician-supervised women\'s health programs tailored to your biology.',
    badge: 'Female Health Specialists · Licensed Compounding Pharmacy',
    products: [
      { name: 'BHRT Hormone Balance', desc: 'Bioidentical hormone replacement for menopause, perimenopause, and hormone optimization.', price: 229, freq: 'mo', tag: 'Top Rated', specs: ['Full hormone panel', 'Female health specialist', 'Compounded BHRT Rx', 'Monthly monitoring'] },
      { name: 'GLP-1 Weight Loss', desc: 'Physician-prescribed semaglutide for sustainable, medically supervised weight management.', price: 299, freq: 'mo', tag: 'Most Popular', specs: ['Physician consultation', '503A pharmacy', 'Monthly titration', 'Nutrition guidance'] },
      { name: 'Complete Wellness Plan', desc: 'Hormones + weight + thyroid optimization. Full-spectrum women\'s health in one physician-managed plan.', price: 399, freq: 'mo', tag: 'Best Value', specs: ['Complete lab panel', 'Dedicated physician', 'Multi-protocol Rx', 'Quarterly labs'] },
    ],
    ctaLabel: 'Start My Consultation',
    ctaSub: 'Physician consultation required. Prescription dispensed by licensed pharmacy.',
    trustBadges: ['HIPAA Compliant', 'Female Specialists', 'Licensed Pharmacy', 'All 50 States'],
    bgLight: '#FAF7F9',
    cardBg: '#FFFFFF',
  },
  longevity: {
    label: 'Longevity & Anti-Aging',
    tagline: 'Longevity & Performance Medicine',
    subtitle: 'NAD+, peptides, and precision longevity protocols — physician-prescribed and science-backed.',
    heroHeadline: (biz) => `${biz} Longevity`,
    heroSub: 'Optimize your healthspan. Evidence-based longevity protocols with board-certified physicians.',
    badge: 'Longevity Physicians · 503A Licensed Pharmacy',
    products: [
      { name: 'NAD+ IV Protocol', desc: 'Physician-ordered NAD+ therapy. Energy, cognitive performance, and cellular repair.', price: 349, freq: 'mo', tag: 'Signature', specs: ['Physician consultation', 'Licensed compounding pharmacy', 'Monthly supply', 'Provider monitored'] },
      { name: 'Peptide Optimization', desc: 'BPC-157, TB-500, and longevity peptide protocols. Physician supervised. Pharmacy dispensed.', price: 279, freq: 'mo', tag: 'Most Popular', specs: ['Multi-peptide protocol', 'Board-certified physician', 'COA included', 'Monthly adjustment'] },
      { name: 'Elite Longevity Bundle', desc: 'NAD+ + peptides + hormone optimization. Complete physician-supervised longevity program.', price: 549, freq: 'mo', tag: 'Best Value', specs: ['Full panel included', 'Dedicated longevity MD', 'Quarterly reassessment', 'Priority support'] },
    ],
    ctaLabel: 'Start My Protocol',
    ctaSub: 'Physician consultation required. Not available in all states.',
    trustBadges: ['HIPAA Compliant', '503A Pharmacy', 'Board-Certified MDs', 'All 50 States'],
    bgLight: '#F4F9F7',
    cardBg: '#FFFFFF',
  },
  peptides: {
    label: 'Peptide Therapy',
    tagline: 'Physician-Supervised Peptide Protocols',
    subtitle: 'Performance, recovery, and wellness peptides — physician-prescribed and pharmacy-compounded.',
    heroHeadline: (biz) => `${biz} Peptide Clinic`,
    heroSub: 'Precision peptide therapy. Physician-prescribed protocols for performance, recovery, and vitality.',
    badge: 'Board-Certified Physicians · Licensed Compounding Pharmacy',
    products: [
      { name: 'Recovery & Repair Protocol', desc: 'Physician-prescribed BPC-157 and TB-500 protocol for musculoskeletal recovery and cellular repair.', price: 249, freq: 'mo', tag: 'Top Rated', specs: ['Physician consultation', '503A pharmacy', 'Dosage guidance included', 'Monthly monitoring'] },
      { name: 'Growth Hormone Peptides', desc: 'Sermorelin or Ipamorelin/CJC-1295 protocol. Physician-supervised growth hormone optimization.', price: 299, freq: 'mo', tag: 'Most Popular', specs: ['Board-certified physician', 'Licensed compounding Rx', 'Lab panel included', 'Quarterly reassessment'] },
      { name: 'Elite Performance Stack', desc: 'Multi-peptide physician protocol: recovery + GH + cognitive performance in one managed plan.', price: 449, freq: 'mo', tag: 'Best Value', specs: ['Full hormone + peptide panel', 'Dedicated physician', 'Monthly optimization', 'Priority care team'] },
    ],
    ctaLabel: 'Start My Protocol',
    ctaSub: 'Physician consultation required. Prescription dispensed by licensed pharmacy.',
    trustBadges: ['HIPAA Compliant', '503A Pharmacy', 'Licensed Physicians', 'All 50 States'],
    bgLight: '#F6F7F4',
    cardBg: '#FFFFFF',
  },
};

const DEFAULT_NICHE = NICHES.weight_loss;

function hexToRgb(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function darken(hex, amount = 30) {
  let r = parseInt(hex.slice(0, 2), 16) - amount;
  let g = parseInt(hex.slice(2, 4), 16) - amount;
  let b = parseInt(hex.slice(4, 6), 16) - amount;
  r = Math.max(0, r); g = Math.max(0, g); b = Math.max(0, b);
  return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function ProductCard({ product, color, onStart }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {product.tag && (
        <div className="text-white text-[10px] font-bold uppercase tracking-widest text-center py-2"
          style={{ backgroundColor: `#${color}` }}>
          {product.tag}
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{product.desc}</p>
        <ul className="space-y-1.5 mb-5">
          {product.specs.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `#${color}` }} />
              {s}
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-2xl font-black text-gray-900">${product.price}</div>
            <div className="text-xs text-gray-400">/ {product.freq}</div>
          </div>
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: `#${color}` }}>
            <Stethoscope className="w-3.5 h-3.5" /> Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PersonalizedDemo() {
  const params = new URLSearchParams(window.location.search);
  const bizRaw = params.get('biz') || 'Your Wellness Brand';
  const nicheKey = params.get('niche') || 'weight_loss';
  const colorHex = (params.get('color') || '4A6741').replace('#', '');
  const domainSlug = params.get('domain') || bizRaw.toLowerCase().replace(/[^a-z0-9]/g, '');

  const niche = NICHES[nicheKey] || DEFAULT_NICHE;
  const [ctaClicked, setCtaClicked] = useState(false);

  const handleCTA = () => {
    setCtaClicked(true);
    setTimeout(() => setCtaClicked(false), 4000);
  };

  const handlePay = () => {
    // Close this window and let parent know to proceed to payment
    if (window.opener) {
      window.opener.postMessage({ type: 'DEMO_COMPLETE' }, '*');
      window.close();
    } else {
      window.location.href = '/MerchantOnboarding?demo=done';
    }
  };

  const mainColor = `#${colorHex}`;
  const darkColor = `#${darken(colorHex, 20)}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: niche.bgLight }}>

      {/* ── Demo Banner ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#1a1a5e] text-white py-2.5 px-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-bold text-blue-200">LIVE DEMO</span>
          <span className="text-white/60">— This is your personalized preview of</span>
          <span className="font-bold text-white">{bizRaw}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-[10px] hidden sm:block">
            Domain: <span className="text-white/70 font-mono">{domainSlug}.com</span>
          </span>
          <button
            onClick={handlePay}
            className="bg-white text-[#1a1a5e] text-[11px] font-black px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Launch This Site — Pay Now
          </button>
        </div>
      </div>

      {/* ── Simulated Browser Bar ──────────────────────────────────────────── */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500 flex items-center gap-2 max-w-xl mx-auto">
          <Lock className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span className="font-mono">{domainSlug}.com</span>
          <span className="ml-auto text-[10px] text-green-600 font-semibold">Your Domain</span>
        </div>
      </div>

      {/* ── Merchant Nav ────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center text-white font-black text-xs"
              style={{ backgroundColor: mainColor }}>
              {bizRaw.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-bold text-gray-900 text-base">{bizRaw}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <span className="cursor-default hover:text-gray-900 transition-colors">Programs</span>
            <span className="cursor-default hover:text-gray-900 transition-colors">How It Works</span>
            <span className="cursor-default hover:text-gray-900 transition-colors">About</span>
            <span className="cursor-default hover:text-gray-900 transition-colors">Contact</span>
          </div>
          <button
            onClick={handleCTA}
            className="text-white text-sm font-semibold px-5 py-2 rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: mainColor }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-14 px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 border"
                style={{ backgroundColor: `rgba(${hexToRgb(colorHex)}, 0.08)`, borderColor: `rgba(${hexToRgb(colorHex)}, 0.2)` }}>
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: mainColor }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: mainColor }}>
                  {niche.badge}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {niche.heroHeadline(bizRaw)}<br />
                <span style={{ color: mainColor }}>Starts Here.</span>
              </h1>
              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">
                {niche.heroSub}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {niche.trustBadges.map(b => (
                  <div key={b} className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3" style={{ color: mainColor }} /> {b}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleCTA}
                  className="text-white font-bold px-7 py-3.5 rounded-sm text-sm flex items-center gap-2 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: mainColor }}>
                  {niche.ctaLabel} <ArrowRight className="w-4 h-4" />
                </button>
                <button className="border border-gray-200 text-gray-600 font-medium px-6 py-3.5 rounded-sm text-sm hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4 inline mr-2" /> Call Us
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">{niche.ctaSub}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:block">
              <div className="rounded-2xl p-8 text-center"
                style={{ background: `linear-gradient(135deg, rgba(${hexToRgb(colorHex)},0.08), rgba(${hexToRgb(colorHex)},0.03))`, border: `1px solid rgba(${hexToRgb(colorHex)},0.15)` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: mainColor }}>
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{niche.tagline}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{niche.subtitle}</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[['10K+', 'Patients Served'], ['50', 'States Covered'], ['4.9★', 'Avg Rating']].map(([n, l]) => (
                    <div key={l} className="text-center">
                      <div className="text-xl font-black" style={{ color: mainColor }}>{n}</div>
                      <div className="text-xs text-gray-400">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-8" style={{ backgroundColor: niche.bgLight }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Programs</h2>
            <p className="text-gray-500 text-sm">All programs include physician consultation and licensed pharmacy dispensing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {niche.products.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={p} color={colorHex} onStart={handleCTA} />
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-8">
            These medications require physician consultation and valid prescription. Results may vary. Not available in all states.
          </p>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Stethoscope, title: 'Online Consultation', desc: 'Complete your health intake. A licensed physician reviews and approves your treatment plan.' },
              { step: '02', icon: Package, title: 'Pharmacy Dispenses', desc: 'Your prescription is filled by a licensed 503A compounding pharmacy and shipped to your door.' },
              { step: '03', icon: Activity, title: 'Ongoing Support', desc: 'Monthly check-ins with your provider. Dosage adjustments based on your progress and labs.' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `rgba(${hexToRgb(colorHex)}, 0.1)` }}>
                    <Icon className="w-6 h-6" style={{ color: mainColor }} />
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: mainColor }}>STEP {s.step}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Social Proof ──────────────────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-8 border-t border-gray-100" style={{ backgroundColor: niche.bgLight }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Sarah M.', review: 'I lost 28 pounds in 4 months. The physician was incredibly supportive and the process was completely seamless.', stars: 5 },
              { name: 'David K.', review: 'Finally a service that actually works. My energy levels are back, my labs are great, and the team is always available.', stars: 5 },
              { name: 'Jennifer R.', review: 'Best investment I\'ve made in my health. The physician consultation was thorough and the program is exactly what I needed.', stars: 5 },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: mainColor }} />)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 italic">"{r.review}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: mainColor }}>
                    {r.name[0]}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{r.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 ml-auto" style={{ color: mainColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-sm flex items-center justify-center text-white font-black text-xs"
                  style={{ backgroundColor: mainColor }}>
                  {bizRaw.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-bold">{bizRaw}</span>
              </div>
              <p className="text-gray-400 text-xs max-w-xs">Physician-supervised telehealth programs. Licensed providers. Licensed pharmacy network. All 50 states.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs text-gray-400">
              {['Privacy Policy', 'Terms of Service', 'HIPAA Notice', 'Telehealth Consent', 'Medical Disclaimer', 'Contact Us'].map(l => (
                <span key={l} className="cursor-default hover:text-gray-200 transition-colors">{l}</span>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {bizRaw}. All rights reserved. | Powered by MedRevolve White-Label Platform<br />
              <span className="text-gray-600 mt-1 block">
                All treatments require physician consultation and valid prescription. These medications have not been evaluated by the FDA for all indicated uses. Results may vary. Not available in all states. This is a physician-supervised telehealth service.
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* ── CTA Toast when demo buttons clicked ───────────────────────────── */}
      {ctaClicked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a5e] text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm text-center border border-white/20">
          <p className="font-bold text-sm mb-1">🎯 This is your site!</p>
          <p className="text-white/60 text-xs mb-3">Ready to launch {bizRaw}? Go back and complete payment to get this live on <span className="font-mono text-white/80">{domainSlug}.com</span></p>
          <button onClick={handlePay}
            className="w-full bg-white text-[#1a1a5e] font-bold text-xs py-2 rounded-full hover:bg-blue-50 transition-colors">
            Launch My Site — Pay Now →
          </button>
        </motion.div>
      )}
    </div>
  );
}