import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight, CheckCircle, Shield, Zap, Users, ClipboardList,
  Video, Pill, Truck, BarChart3, Lock, Globe, Star,
  ChevronRight, Play, Building2, HeartPulse, Package,
  FileText, CreditCard, Bell, Settings, Activity
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────────────────

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Smart Intake & Onboarding',
    description: 'Patients complete dynamic health questionnaires designed for each treatment pathway. Our drag-and-drop builder creates asynchronous telehealth forms tailored to your clinical needs.',
    features: ['Dynamic questionnaires', 'Photo & document uploads', 'Insurance verification', 'HIPAA-compliant intake'],
    color: '#4A6741',
    bg: '#D4E5D7',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
  },
  {
    step: '02',
    icon: Video,
    title: 'Telehealth Consultation',
    description: 'Licensed providers conduct secure video, phone, or asynchronous consultations. Built-in EMR tools let providers review history, take clinical notes, and recommend treatments instantly.',
    features: ['HD video & voice calls', 'Async consultations', 'Clinical note templates', 'AI-assisted summaries'],
    color: '#2D6A9F',
    bg: '#D0E8F5',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
  },
  {
    step: '03',
    icon: FileText,
    title: 'E-Prescribing & Clinical Decision',
    description: 'Providers issue e-prescriptions directly through the platform with full Surescripts integration. AI surfaces drug interactions, dosage guidance, and ICD-10 coding suggestions.',
    features: ['Surescripts certified', 'Drug interaction checks', 'AI ICD-10 coding', 'Digital prescription records'],
    color: '#7B5EA7',
    bg: '#EDE8F5',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
  },
  {
    step: '04',
    icon: Pill,
    title: 'Pharmacy Fulfillment',
    description: 'Prescriptions route automatically to our verified pharmacy network — compounding, commercial, and specialty. Nationwide fulfillment across all 50 states with real-time tracking.',
    features: ['Compounding pharmacy network', 'Commercial & specialty Rx', 'All 50 states coverage', 'Real-time order tracking'],
    color: '#B85C38',
    bg: '#F5E0D8',
    img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
  },
  {
    step: '05',
    icon: Truck,
    title: 'Doorstep Delivery',
    description: 'Medications ship direct to patients with cold-chain handling, custom branded packaging, and real-time delivery notifications — elevating the unboxing experience.',
    features: ['Cold-chain shipping', 'Custom branded packaging', 'Delivery notifications', '2-5 day nationwide delivery'],
    color: '#2D7D6B',
    bg: '#C8EAE4',
    img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80',
  },
  {
    step: '06',
    icon: BarChart3,
    title: 'Analytics & Growth',
    description: 'Full-stack reporting: cohort analysis, conversion funnels, revenue dashboards, refund management, and patient retention insights — all in one place.',
    features: ['Cohort analysis', 'Revenue dashboards', 'Patient retention metrics', 'Custom report builder'],
    color: '#4A6741',
    bg: '#D4E5D7',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
];

const PLATFORM_MODULES = [
  { icon: Building2, label: 'White-Label Builder', desc: 'Custom brand, domain & design' },
  { icon: Video, label: 'Virtual Care', desc: 'HIPAA video & async consults' },
  { icon: HeartPulse, label: 'EMR & Clinical Tools', desc: 'Full electronic medical records' },
  { icon: FileText, label: 'E-Prescribing', desc: 'Surescripts certified Rx' },
  { icon: Package, label: 'Compounding', desc: 'Custom compound orders' },
  { icon: Pill, label: 'Pharmacy Network', desc: 'Nationwide fulfillment' },
  { icon: Truck, label: 'Order Management', desc: 'End-to-end order tracking' },
  { icon: CreditCard, label: 'Payment Processing', desc: 'Integrated billing & invoicing' },
  { icon: Users, label: 'Patient Portal', desc: 'Self-service patient accounts' },
  { icon: BarChart3, label: 'Analytics', desc: 'Business intelligence suite' },
  { icon: Shield, label: 'Compliance', desc: 'HIPAA, LegitScript, state laws' },
  { icon: Bell, label: 'Automated Comms', desc: 'SMS, email, push alerts' },
];

const STATS = [
  { value: '2.4M+', label: 'Patients Served', icon: Users },
  { value: '3.5M+', label: 'Prescriptions Fulfilled', icon: Pill },
  { value: '$640M+', label: 'Transactions Processed', icon: CreditCard },
  { value: '50', label: 'States Covered', icon: Globe },
];

const TESTIMONIALS = [
  {
    quote: "MedRevolve's white-label telehealth solution transformed how we deliver care. The end-to-end workflow — from intake to pharmacy delivery — runs seamlessly without any manual intervention.",
    name: 'Dr. Sarah Chen',
    title: 'Medical Director, WellnessFirst Clinic',
    avatar: 'SC',
  },
  {
    quote: "The platform's analytics and patient management tools gave us visibility we never had before. We scaled from 50 to 500 patients per month in just 3 months.",
    name: 'Marcus Rivera',
    title: 'CEO, Revive Health',
    avatar: 'MR',
  },
  {
    quote: "Setting up our telehealth practice was surprisingly fast. The questionnaire builder, provider portal, and pharmacy integrations were all ready to go.",
    name: 'Dr. Priya Nair',
    title: 'Founder, NovaCare Telehealth',
    avatar: 'PN',
  },
];

const COMPLIANCE_BADGES = [
  { label: 'HIPAA Compliant', icon: Shield },
  { label: 'LegitScript Certified', icon: CheckCircle },
  { label: 'Surescripts Integrated', icon: FileText },
  { label: 'SOC 2 Type II', icon: Lock },
  { label: 'DEA Compliant', icon: Shield },
  { label: '50-State Licensed', icon: Globe },
  { label: 'Zoho SOC 2 Certified', icon: Lock },
  { label: 'ISO 27001 Aligned', icon: Shield },
  { label: 'GDPR Compliant', icon: CheckCircle },
  { label: 'CCPA Compliant', icon: CheckCircle },
  { label: 'PCI DSS (via Stripe)', icon: Lock },
  { label: 'PCAB Accredited Pharmacy Partners', icon: CheckCircle },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#4A6741]/15 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-[#4A6741]" />
      </div>
      <p className="text-4xl font-bold text-[#2D3A2D] mb-1">{stat.value}</p>
      <p className="text-[#5A6B5A] text-sm font-medium">{stat.label}</p>
    </motion.div>
  );
}

function WorkflowCard({ step, index }) {
  const Icon = step.icon;
  const isEven = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Text */}
      <div className={isEven ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl font-black text-gray-100 leading-none select-none">{step.step}</span>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: step.bg }}>
            <Icon className="w-6 h-6" style={{ color: step.color }} />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-[#2D3A2D] mb-3">{step.title}</h3>
        <p className="text-[#5A6B5A] leading-relaxed mb-6">{step.description}</p>
        <ul className="space-y-2">
          {step.features.map(f => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-[#2D3A2D]">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: step.color }} />
              {f}
            </li>
          ))}
        </ul>
      </div>
      {/* Image */}
      <div className={`relative ${isEven ? 'lg:order-1' : ''}`}>
        <div className="absolute inset-0 rounded-3xl opacity-20 -rotate-2" style={{ background: step.bg }} />
        <img
          src={step.img}
          alt={step.title}
          className="relative rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: step.color }}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function ModuleCard({ mod, index }) {
  const Icon = mod.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-5 border border-[#E8E0D5] hover:shadow-lg hover:border-[#4A6741]/30 transition-all group"
    >
      <div className="w-11 h-11 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-3 group-hover:bg-[#4A6741] transition-colors">
        <Icon className="w-5 h-5 text-[#4A6741] group-hover:text-white transition-colors" />
      </div>
      <p className="font-semibold text-[#2D3A2D] text-sm mb-1">{mod.label}</p>
      <p className="text-xs text-[#5A6B5A]">{mod.desc}</p>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TelehealthPlatform() {
  const [activeWorkflow, setActiveWorkflow] = useState(null);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6 lg:px-8">
        {/* BG gradient blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#4A6741]/6 blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#2D6A9F]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <Badge className="bg-[#D4E5D7] text-[#4A6741] border-none mb-6 text-xs font-semibold px-4 py-1.5 rounded-full">
              WHITE-LABEL TELEHEALTH PLATFORM
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2D3A2D] leading-tight mb-6">
              The Complete
              <span className="block font-semibold text-[#4A6741]">Telehealth Engine</span>
            </h1>
            <p className="text-xl text-[#5A6B5A] leading-relaxed max-w-3xl mx-auto mb-10">
              MedRevolve provides a full-service white-label telehealth platform — from patient onboarding and clinical consultations to e-prescribing, pharmacy fulfillment, and doorstep delivery. Everything your practice needs, fully branded as your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('PatientOnboarding')}>
                <Button size="lg" className="bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full px-10 py-6 text-base font-semibold shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="outline" className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full px-10 py-6 text-base">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Platform modules visual grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="bg-[#1A2A1A] rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {[
                  { label: 'BUILDER', icon: Settings, color: '#A8C99B' },
                  { label: 'PAYMENTS', icon: CreditCard, color: '#7BB8F0' },
                  { label: 'PATIENT PORTAL', icon: Users, color: '#F0A87B' },
                  { label: 'ANALYTICS', icon: BarChart3, color: '#B87BF0' },
                  { label: 'COMPLIANCE', icon: Shield, color: '#F0D07B' },
                  { label: 'EMR', icon: HeartPulse, color: '#F07B7B' },
                  { label: 'COMPOUNDING', icon: Pill, color: '#7BF0C8' },
                  { label: 'PHARMACY', icon: Package, color: '#A8C99B' },
                  { label: 'ORDER MGMT', icon: Truck, color: '#7BB8F0' },
                  { label: 'E-PRESCRIBE', icon: FileText, color: '#F0A87B' },
                ].map((mod, i) => {
                  const Icon = mod.icon;
                  return (
                    <div key={mod.label} className="bg-white/8 rounded-2xl p-3 flex flex-col items-center gap-2 hover:bg-white/12 transition-colors cursor-default">
                      <Icon className="w-6 h-6" style={{ color: mod.color }} />
                      <span className="text-[9px] font-bold text-white/60 text-center leading-tight">{mod.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4A6741] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">End-to-End Delivery Network</p>
                  <p className="text-white/50 text-xs">Prescription → Pharmacy → Patient's door in 2-5 days</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">Live</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 lg:px-8 bg-white border-y border-[#E8E0D5]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── What We Power ── */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">The Platform</p>
            <h2 className="text-4xl font-light text-[#2D3A2D] mb-4">
              Everything Built In, <span className="font-semibold">Nothing Left Out</span>
            </h2>
            <p className="text-[#5A6B5A] text-lg max-w-2xl mx-auto">
              12 integrated modules covering every touchpoint of your telehealth business — from first click to front door.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PLATFORM_MODULES.map((mod, i) => <ModuleCard key={mod.label} mod={mod} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Full Workflow ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">Complete Workflow</p>
            <h2 className="text-4xl font-light text-[#2D3A2D] mb-4">
              From Consultation <span className="font-semibold text-[#4A6741]">to Delivery</span>
            </h2>
            <p className="text-[#5A6B5A] text-lg max-w-2xl mx-auto">
              Every step of the patient journey — orchestrated, automated, and fully managed on one platform.
            </p>
          </div>

          <div className="space-y-24">
            {WORKFLOW_STEPS.map((step, i) => <WorkflowCard key={step.step} step={step} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── White-Label Callout ── */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-[#D4E5D7] text-[#4A6741] border-none mb-4 text-xs rounded-full px-4 py-1">
                WHITE-LABEL SOLUTION
              </Badge>
              <h2 className="text-4xl font-light text-[#2D3A2D] mb-5">
                Your Brand,<br /><span className="font-semibold text-[#4A6741]">Our Infrastructure</span>
              </h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-8">
                Launch a fully branded telehealth practice without building from scratch. 
                Customize colors, logo, domain, messaging, and patient experience — while we handle all the backend clinical, compliance, and fulfillment infrastructure.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Custom domain & full white-label branding',
                  'Configurable patient intake flows per treatment',
                  'Provider portal with your team or ours',
                  'Private-label pharmacy fulfillment',
                  'Revenue dashboard & payout management',
                  'HIPAA, LegitScript & state compliance built-in',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#2D3A2D]">
                    <CheckCircle className="w-5 h-5 text-[#4A6741] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('ForBusiness')}>
                  <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8">
                    Explore White-Label
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to={createPageUrl('PartnerProgram')}>
                  <Button variant="outline" className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full px-8">
                    Partner Program
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=700&q=80"
                alt="White-label telehealth dashboard"
                className="rounded-3xl shadow-2xl"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[#E8E0D5]">
                <p className="text-xs text-[#5A6B5A] mb-1">Active White-Label Partners</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['#4A6741','#2D6A9F','#7B5EA7','#B85C38'].map(c => (
                      <div key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="font-bold text-[#2D3A2D] text-sm">250+ brands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compliance ── */}
      <section className="py-16 px-6 lg:px-8 bg-[#2D3A2D]">
        <div className="max-w-5xl mx-auto text-center">
          <Shield className="w-12 h-12 text-[#A8C99B] mx-auto mb-4" />
          <h2 className="text-3xl font-light text-white mb-3">
            Built for <span className="font-semibold text-[#A8C99B]">Healthcare Compliance</span>
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Every layer of MedRevolve is architected to meet the highest regulatory standards so your practice is protected from day one.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {COMPLIANCE_BADGES.map(badge => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="bg-white/8 rounded-2xl px-5 py-4 flex items-center gap-3 border border-white/10">
                  <Icon className="w-5 h-5 text-[#A8C99B] flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-3xl font-light text-[#2D3A2D]">
              Trusted by <span className="font-semibold text-[#4A6741]">Leading Practices</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-[#E8E0D5] shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[#2D3A2D] text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D3A2D] text-sm">{t.name}</p>
                    <p className="text-xs text-[#5A6B5A]">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's For ── */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-light text-[#2D3A2D] mb-3">
              Built for <span className="font-semibold text-[#4A6741]">Every Stakeholder</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                audience: 'Entrepreneurs',
                icon: Zap,
                desc: 'Launch a telehealth brand in days with our white-label toolkit and pharmacy network.',
                cta: 'Start Your Practice',
                link: 'PatientOnboarding',
                color: '#4A6741',
              },
              {
                audience: 'Physicians & Providers',
                icon: HeartPulse,
                desc: 'Join our provider network and see patients remotely with full EMR and e-prescribing tools.',
                cta: 'Join as Provider',
                link: 'ProviderIntake',
                color: '#2D6A9F',
              },
              {
                audience: 'Clinics & Med Spas',
                icon: Building2,
                desc: 'Extend your services online with branded telehealth and fulfillment for your existing patients.',
                cta: 'Business Inquiry',
                link: 'ForBusiness',
                color: '#7B5EA7',
              },
              {
                audience: 'Pharmacies',
                icon: Pill,
                desc: 'Partner with MedRevolve to fulfill compounding and specialty prescriptions at scale.',
                cta: 'Partner with Us',
                link: 'PharmacyIntake',
                color: '#B85C38',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.audience}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl p-6 border border-[#E8E0D5] hover:shadow-xl transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: card.color + '20' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <h3 className="font-semibold text-[#2D3A2D] mb-2">{card.audience}</h3>
                  <p className="text-sm text-[#5A6B5A] mb-5 leading-relaxed">{card.desc}</p>
                  <Link to={createPageUrl(card.link)}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs w-full group-hover:text-white group-hover:border-transparent transition-all"
                      style={{ '--hover-bg': card.color }}
                    >
                      {card.cta}
                      <ChevronRight className="ml-1 w-3 h-3" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] via-[#3D5636] to-[#2D3A2D]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#A8C99B] text-sm font-semibold uppercase tracking-widest mb-4">Ready to Scale?</p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-5">
              Launch Your Telehealth<br /><span className="font-semibold">Practice Today</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              Join hundreds of telehealth brands powered by MedRevolve's end-to-end platform. 
              Get your first patients in days, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('PatientOnboarding')}>
                <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-full px-12 py-6 font-semibold text-base shadow-xl">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-12 py-6 text-base">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
            <p className="text-white/40 text-xs mt-6">No setup fees · HIPAA compliant · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}