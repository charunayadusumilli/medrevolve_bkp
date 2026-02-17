import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle, ArrowRight, ChevronDown, ChevronUp, Leaf,
  DollarSign, Shield, Zap, Users, Building2, Star,
  Pill, Activity, Heart, Sparkles, Clock, Phone, Mail
} from 'lucide-react';

const FADE_UP = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

// ─── DATA ───────────────────────────────────────────────────────────────────

const perks = [
  'Custom Pricing on Medications',
  'White-Label App & Branded Portal',
  'Access to 25+ High-Demand Products',
  'Nationwide Licensed Physician Network',
  'Nationwide Compounding Pharmacy Network',
  'Affiliate Referral Structure',
  'Marketing Guides, Training & Resources',
  'No Inventory. No Medical Liability.',
  'HIPAA-Compliant Infrastructure',
  'Fast Setup — Go Live Same Day',
];

const technology = [
  { name: 'White-Label App', desc: 'Your brand, your clients' },
  { name: 'Partner Portal', desc: 'Links, analytics, payouts' },
  { name: 'Managed Website', desc: 'Custom URL & interface' },
  { name: 'Partner Badge', desc: 'Download & build trust' },
  { name: 'Marketing Hub', desc: 'Ready-made social posts' },
  { name: 'Training Center', desc: 'Tutorials & guides' },
];

const lifecycle = [
  { step: 1, title: 'You Attract the Client', desc: 'Share your branded link or use in-store kiosk.' },
  { step: 2, title: 'Client Fills Intake Form', desc: 'Simple 5-minute medical questionnaire.' },
  { step: 3, title: 'Physician Reviews & Payment', desc: 'Our licensed doctors handle everything. Payment processed.' },
  { step: 4, title: 'Prescription Sent to Pharmacy', desc: 'Routed to our partner compounding pharmacy network.' },
  { step: 5, title: 'Medication Mailed to Patient', desc: 'Delivered to their door in 2–5 business days.' },
];

const earnings = [
  { clients: 10, monthly: '$1,200 – $2,000', annual: '$14,400 – $24,000' },
  { clients: 25, monthly: '$3,000 – $5,000', annual: '$36,000 – $60,000' },
  { clients: 50, monthly: '$6,000 – $10,000', annual: '$72,000 – $120,000' },
  { clients: 100, monthly: '$12,000 – $20,000', annual: '$144,000 – $240,000' },
  { clients: 200, monthly: '$24,000 – $40,000', annual: '$288,000 – $480,000' },
];

const idealFor = [
  'Gyms & Fitness Centers', 'Chiropractic Offices', 'Salons & Beauty Studios',
  'Online Influencers', 'Wellness Studios', 'Cryotherapy Centers',
  'Weight-Loss Clinics', 'Massage Studios', 'Physical Therapists',
  'Nurse Practitioners', 'Medical Spas', 'Entrepreneurs',
];

const medications = {
  'Weight Loss': [
    'Injectable Semaglutide with Additives', 'Injectable Tirzepatide with Additives',
    'Sublingual Semaglutide', 'Microdose Semaglutide with B12',
    'Lipo-C Injections', 'Lipo-B Injections', 'Ozempic®', 'Wegovy®', 'Mounjaro®', 'Zepbound®'
  ],
  'Peptides & Wellness': [
    'Injectable NAD+', 'NAD+ Nasal Spray', 'NAD+ Cream',
    'Injectable Glutathione', 'Injectable Sermorelin', 'Injectable B-12'
  ],
  'Hair & Esthetics': [
    'Minoxidil Tablets', 'Finasteride Tablets',
    'Minoxidil / Finasteride / Retinoic Acid Topical Solution'
  ],
  "Men's & Women's Health": [
    'Enclomiphene Tablets', 'Progesterone Capsules', 'Estradiol Cream',
    'Estradiol Patches', 'Estradiol Tablets', 'Estradiol Gel',
    'Sildenafil Tablets', 'Tadalafil Tablets', 'Cialis®', 'Viagra®'
  ],
};

const pricing = [
  { med: 'Injectable Semaglutide w/ Additives', price: '$174' },
  { med: 'Injectable Tirzepatide w/ Additives', price: '$299' },
  { med: 'Microdose Semaglutide w/ B12', price: '$124' },
  { med: 'Microdose Tirzepatide w/ B12', price: '$149' },
  { med: 'Sublingual Semaglutide', price: '$99' },
  { med: 'Lipo-C Injections', price: '$99' },
  { med: 'Lipo-B Injections', price: '$99' },
  { med: 'Injectable NAD+', price: '$174' },
  { med: 'NAD+ Nasal Spray', price: '$99' },
  { med: 'Injectable Glutathione', price: '$99' },
  { med: 'Injectable Sermorelin', price: '$174' },
  { med: 'Minoxidil Tablets', price: '$74' },
  { med: 'Finasteride Tablets', price: '$74' },
  { med: 'Enclomiphene', price: '$124' },
  { med: 'Sildenafil Tablets', price: '$74' },
  { med: 'Tadalafil Tablets', price: '$74' },
];

const whyUs = [
  'Among the highest payout compensation in telehealth',
  'No inventory to purchase or manage',
  'Zero medical liability for your business',
  'White-label app and managed website included',
  'Instant same-day setup',
  'Fully HIPAA-compliant model',
  'No paying for medications upfront',
  'Access to 25+ high-demand prescription products',
  'Supports single or multi-location businesses',
  'Pure referral compensation — never tied to prescribing decisions',
];

const compliancePoints = [
  'Partners never take medical payments',
  'Partners don\'t buy, hold, or prescribe medications',
  'Licensed physicians and pharmacies handle all clinical care',
  'Partners never access any HIPAA-protected patient information',
  'Pure referral compensation model — no CPOM risk',
  'No payment-processor risk since partners don\'t take payment for medical services',
  'MedRevolve\'s affiliated physicians are responsible for all medical treatment',
];

const faqs = [
  { q: 'Do I need a medical license?', a: 'No. MedRevolve handles all physician licensing and clinical operations for you.' },
  { q: 'What states are you available in?', a: 'All 50 states. Availability of specific medications may vary by state based on clinical and regulatory guidance.' },
  { q: 'How do I get paid?', a: 'We set you up with our payment partner to pay via direct ACH or your preferred method.' },
  { q: 'Who handles the physician side?', a: "MedRevolve's network of affiliated licensed physicians through separate clinical entities." },
  { q: 'Do I need to buy inventory?', a: 'Absolutely not. No upfront medication costs ever.' },
  { q: 'How fast can I go live?', a: 'Minutes. Self-register, get your links, and start sharing the same day.' },
  { q: 'Is there a contract?', a: 'No long-term contracts. Cancel any time before your next billing period.' },
];

const steps = [
  { n: '1', text: 'Pick your plan below' },
  { n: '2', text: 'Account activated instantly' },
  { n: '3', text: 'Get your links, portal access & training right away' },
  { n: '4', text: 'Start sharing and earning same day' },
  { n: '5', text: 'Receive payment onboarding within 48 hours' },
];

// ─── FAQ ITEM ────────────────────────────────────────────────────────────────

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="font-semibold text-[#2D3A2D]">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#4A6741] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#4A6741] shrink-0" />}
      </button>
      {open && <p className="pb-5 text-[#5A6B5A] leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function PartnerProgram() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2D3A2D] to-[#4A6741] pt-24 pb-32 px-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #6B8F5E 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div {...FADE_UP}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Leaf className="w-3.5 h-3.5 mr-2" /> MedRevolve Partner Program
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Add Telehealth to<br />
              <span className="text-[#A8C99B]">Your Business Today</span>
            </h1>
            <p className="text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
              MedRevolve is a white-label telehealth platform that lets your business offer prescription medical programs under your brand. Our licensed doctors and pharmacies handle all care and fulfillment — fully compliant, and you earn on every qualified client.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('PartnerSignup')}>
                <Button size="lg" className="bg-white text-[#4A6741] hover:bg-white/90 font-bold rounded-full px-10">
                  Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#earnings">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-10">
                  See Earnings Potential
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PARTNER PERKS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Partner Perks</h2>
            <p className="text-[#5A6B5A]">Everything included when you join the MedRevolve partner network</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map((perk, i) => (
              <motion.div key={i} {...FADE_UP} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 bg-[#F5F0E8] rounded-2xl p-5">
                <CheckCircle className="w-5 h-5 text-[#4A6741] shrink-0 mt-0.5" />
                <span className="font-medium text-[#2D3A2D]">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVAILABLE TECHNOLOGY ── */}
      <section className="py-20 px-6 bg-[#2D3A2D]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-3">Available Technology</h2>
            <p className="text-white/60">A full suite of tools to run and grow your telehealth business</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technology.map((t, i) => (
              <motion.div key={i} {...FADE_UP} transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <CheckCircle className="w-6 h-6 text-[#A8C99B] mb-4" />
                <h3 className="text-white font-bold text-lg mb-1">{t.name}</h3>
                <p className="text-white/50 text-sm">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATIENT LIFECYCLE ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Patient Lifecycle</h2>
            <p className="text-[#5A6B5A]">From your referral to their doorstep — we handle everything in between</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-[#4A6741]/20 hidden md:block" />
            <div className="space-y-6">
              {lifecycle.map((step, i) => (
                <motion.div key={i} {...FADE_UP} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6">
                  <div className="relative z-10 w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <div className="pt-3">
                    <h3 className="font-bold text-[#2D3A2D] text-lg">{step.title}</h3>
                    <p className="text-[#5A6B5A] mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EARNINGS ── */}
      <section id="earnings" className="py-20 px-6 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">How Much Can You Earn?</h2>
            <p className="text-[#5A6B5A] max-w-2xl mx-auto">
              Partners set their own program pricing above MedRevolve's established minimums. Earnings are based on pricing strategy, client volume, and retention — earned for completed, qualified intakes.
            </p>
          </motion.div>
          <motion.div {...FADE_UP}>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#4A6741] text-white">
                    <th className="px-6 py-4 text-left font-semibold">Clients</th>
                    <th className="px-6 py-4 text-left font-semibold">Monthly Earnings</th>
                    <th className="px-6 py-4 text-left font-semibold">Annual Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F0E8]'}>
                      <td className="px-6 py-4 font-bold text-[#4A6741] text-lg">{row.clients}</td>
                      <td className="px-6 py-4 font-semibold text-[#2D3A2D]">{row.monthly}</td>
                      <td className="px-6 py-4 text-[#5A6B5A]">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#5A6B5A] mt-4 text-center">
              Earnings are estimates and vary based on pricing, client volume, and retention. Partner compensation is earned for completed, qualified intakes and is not tied to prescribing decisions. Results are not guaranteed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Who Is This For?</h2>
            <p className="text-[#5A6B5A] font-medium">
              MedRevolve is ideal for businesses that want to offer telehealth without handling fulfillment or medical operations.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {idealFor.map((item, i) => (
              <motion.span key={i} {...FADE_UP} transition={{ delay: i * 0.04 }}
                className="px-5 py-3 bg-[#4A6741] text-white rounded-full font-medium text-sm">
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDICATIONS CATALOG ── */}
      <section className="py-20 px-6 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Available Medications</h2>
            <p className="text-[#5A6B5A]">25+ high-demand prescription products across all major categories</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(medications).map(([category, meds], i) => (
              <motion.div key={i} {...FADE_UP} transition={{ delay: i * 0.1 }}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-[#4A6741] mb-4 pb-3 border-b border-[#E8E0D5]">{category}</h3>
                    <ul className="space-y-2">
                      {meds.map((med, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#4A6741] shrink-0 mt-0.5" />
                          <span className="text-[#5A6B5A]">{med}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MINIMUM PRICING ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Minimum Medication Pricing</h2>
            <p className="text-[#5A6B5A]">Set your own price above these minimums. You keep the difference. <span className="text-xs">*Subject to change</span></p>
          </motion.div>
          <motion.div {...FADE_UP}>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#4A6741] text-white">
                    <th className="px-6 py-4 text-left font-semibold">Medication</th>
                    <th className="px-6 py-4 text-right font-semibold">Monthly Minimum</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F0E8]'}>
                      <td className="px-6 py-3 text-[#2D3A2D]">{row.med}</td>
                      <td className="px-6 py-3 text-right font-bold text-[#4A6741]">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY MEDREVOLVE ── */}
      <section className="py-20 px-6 bg-[#2D3A2D]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3">Why Partners Choose MedRevolve</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} {...FADE_UP} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-[#A8C99B] shrink-0 mt-0.5" />
                <span className="text-white/80">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Why Our Model Is Safe & Compliant</h2>
            <p className="text-[#5A6B5A]">Designed by licensed pharmacists and healthcare attorneys</p>
          </motion.div>
          <div className="bg-[#4A6741] rounded-3xl p-8">
            <div className="space-y-4">
              {compliancePoints.map((point, i) => (
                <motion.div key={i} {...FADE_UP} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#A8C99B] shrink-0 mt-0.5" />
                  <span className="text-white">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PLANS ── */}
      <section className="py-20 px-6 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">What Does It Cost?</h2>
            <p className="text-[#5A6B5A]">Simple, transparent pricing. Cancel anytime.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Annual */}
            <motion.div {...FADE_UP}>
              <Card className="border-2 border-[#4A6741] relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#4A6741] text-white">Best Value</Badge>
                </div>
                <CardContent className="pt-8 pb-8">
                  <p className="text-sm font-semibold text-[#4A6741] uppercase tracking-widest mb-2">Annual Plan</p>
                  <p className="text-5xl font-extrabold text-[#2D3A2D] mb-1">$167<span className="text-xl font-normal text-[#5A6B5A]">/mo</span></p>
                  <p className="text-sm text-[#5A6B5A] mb-6">Billed annually · Save $384/year</p>
                  <ul className="space-y-3 mb-8">
                    {['Go Live in Minutes', 'Branded Product Links', 'White-Label App & Website', 'Training & Marketing Guides', 'Sell Online or In-Person', 'HIPAA Compliant', 'Free iPad & Kiosk Stand Included'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#4A6741]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={createPageUrl('PartnerSignup')}>
                    <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-xl">
                      Get Started — Annual
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            {/* Monthly */}
            <motion.div {...FADE_UP} transition={{ delay: 0.1 }}>
              <Card className="border border-gray-200">
                <CardContent className="pt-8 pb-8">
                  <p className="text-sm font-semibold text-[#5A6B5A] uppercase tracking-widest mb-2">Monthly Plan</p>
                  <p className="text-5xl font-extrabold text-[#2D3A2D] mb-1">$199<span className="text-xl font-normal text-[#5A6B5A]">/mo</span></p>
                  <p className="text-sm text-[#5A6B5A] mb-6">Month-to-month · Cancel anytime</p>
                  <ul className="space-y-3 mb-8">
                    {['Go Live in Minutes', 'Branded Product Links', 'White-Label App & Website', 'Training & Marketing Guides', 'Sell Online or In-Person', 'HIPAA Compliant'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#4A6741]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={createPageUrl('PartnerSignup')}>
                    <Button variant="outline" className="w-full border-[#4A6741] text-[#4A6741] rounded-xl">
                      Get Started — Monthly
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <p className="text-center text-sm text-[#5A6B5A] mt-6">Financing available. No long-term contracts. Cancel before next billing period.</p>
        </div>
      </section>

      {/* ── STEPS TO GET STARTED ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#4A6741] to-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...FADE_UP}>
            <h2 className="text-4xl font-bold text-white mb-12">Steps to Get Started</h2>
            <div className="space-y-5 mb-12">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-5 bg-white/10 rounded-2xl px-6 py-4 text-left">
                  <span className="w-10 h-10 rounded-full bg-white text-[#4A6741] font-extrabold flex items-center justify-center shrink-0">{s.n}</span>
                  <span className="text-white font-medium">{s.text}</span>
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm mb-8">⏳ Limited time: Free iPad & Kiosk Stand on all annual plans</p>
            <Link to={createPageUrl('PartnerSignup')}>
              <Button size="lg" className="bg-white text-[#4A6741] hover:bg-white/90 font-bold rounded-full px-12">
                Join Now — It's Free to Start <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-3">Frequently Asked Questions</h2>
          </motion.div>
          <Card>
            <CardContent className="pt-6">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </CardContent>
          </Card>
          <p className="text-center mt-8 text-[#5A6B5A]">
            Still have questions?{' '}
            <Link to={createPageUrl('Contact')} className="text-[#4A6741] font-semibold underline">Contact us</Link>
            {' '}— we reply within 1 business day.
          </p>
        </div>
      </section>
    </div>
  );
}