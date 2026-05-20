import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ArrowRight, CheckCircle, Shield, Zap, Users, ClipboardList,
  Video, Pill, Truck, Lock, Globe, Star,
  HeartPulse, FileText, Calendar, Clock,
  Stethoscope, ChevronDown, Building2, Package,
  FlaskConical, CreditCard, BarChart3, Megaphone,
  Store, Layers, Link2, ShieldCheck, Check,
  ClipboardCheck, MessageCircle, Leaf
} from 'lucide-react';

// ─── TAB CONFIG ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'telehealth', label: 'Telehealth' },
  { id: 'business',   label: 'For Business' },
  { id: 'how',        label: 'How It Works' },
  { id: 'book',       label: 'Book a Call' },
];

// ─── TELEHEALTH DATA ─────────────────────────────────────────────────────────
const CONSULT_TYPES = [
  { id: 'weight', emoji: '⚖️', label: 'Weight Loss', sub: 'GLP-1, Semaglutide, Tirzepatide', body: 'A licensed provider reviews your health history and prescribes the right protocol for your goals.', duration: '20–30 min', price: '$79', href: 'BookAppointment?type=weight_loss', accent: '#4A6741', tags: ['Most popular', 'Rx provided'] },
  { id: 'mens', emoji: '⚡', label: "Men's Health", sub: 'Testosterone, TRT, Performance', body: 'Comprehensive consultation covering testosterone levels, energy, libido, and vitality optimization.', duration: '25–30 min', price: '$79', href: 'BookAppointment?type=mens_health', accent: '#4338CA', tags: ['Bloodwork review', 'TRT protocols'] },
  { id: 'womens', emoji: '🌸', label: "Women's Health", sub: 'Hormones, Menopause, Wellness', body: 'Hormone panel review, BHRT consultation, and a personalized wellness protocol tailored to your phase of life.', duration: '25–30 min', price: '$79', href: 'BookAppointment?type=womens_health', accent: '#A21CAF', tags: ['BHRT consult', 'Hormone panel'] },
  { id: 'longevity', emoji: '🧬', label: 'Longevity & Peptides', sub: 'NAD+, Sermorelin, BPC-157', body: 'Explore cutting-edge peptide protocols, longevity biomarkers, and functional medicine strategies.', duration: '30 min', price: '$99', href: 'BookAppointment?type=longevity', accent: '#7C3AED', tags: ['Biomarker review', 'Peptide protocols'] },
  { id: 'general', emoji: '🩺', label: 'General Wellness', sub: 'Labs, Referrals, Health Review', body: 'A comprehensive wellness consult covering labs, health goals, and a full protocol review.', duration: '30 min', price: '$79', href: 'BookAppointment?type=general', accent: '#0891B2', tags: ['Full review', 'Labs included'] },
  { id: 'followup', emoji: '📋', label: 'Follow-Up Visit', sub: 'Dosage Adjustment, Check-In', body: 'Already a member? Quick follow-up to adjust dosage, review results, or address questions.', duration: '15 min', price: '$49', href: 'BookAppointment?type=follow_up', accent: '#8B7355', tags: ['Members only', 'Quick visit'] },
];

const COMPLIANCE_BADGES = [
  { label: 'HIPAA Compliant', icon: Shield },
  { label: 'LegitScript Certified', icon: CheckCircle },
  { label: 'Surescripts Integrated', icon: FileText },
  { label: 'SOC 2 Type II', icon: Lock },
  { label: 'DEA Compliant', icon: Shield },
  { label: '50-State Licensed', icon: Globe },
  { label: 'PCAB Accredited Pharmacies', icon: CheckCircle },
  { label: '503A/B Compounding', icon: Pill },
];

const JOURNEY_STEPS = [
  { step: '01', icon: ClipboardList, tag: 'Intake', title: 'Tell Us About You', subtitle: 'Smart health intake — 3 minutes.', body: 'Complete a dynamic questionnaire tailored to your treatment goal. Upload labs, photos, or documents. Everything is encrypted and HIPAA-compliant.', bullets: ['Condition-specific forms', 'Photo & document upload', 'Insurance verification', 'Secure, private, encrypted'], color: '#4A6741', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80' },
  { step: '02', icon: Video, tag: 'Consultation', title: 'Meet Your Provider', subtitle: 'Same-day or next-day appointments.', body: 'Connect via secure video or phone with a licensed MD, NP, or PA. Your provider reviews your intake and builds a personalized protocol.', bullets: ['Licensed in all 50 states', 'Video, phone, or async', 'AI-assisted clinical notes', 'Full EMR access'], color: '#2D6A9F', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&q=80' },
  { step: '03', icon: FileText, tag: 'Prescription', title: 'Your Rx — Issued Instantly', subtitle: 'E-prescribing with full clinical decision support.', body: 'Prescriptions are issued digitally. Drug interaction checks, ICD-10 coding, and dosage guidance happen automatically.', bullets: ['Surescripts certified', 'Drug interaction checks', 'AI ICD-10 coding', 'Digital Rx records'], color: '#7B5EA7', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&q=80' },
  { step: '04', icon: Pill, tag: 'Pharmacy', title: 'Routed to a Verified Pharmacy', subtitle: 'Compounding, commercial, specialty — nationwide.', body: 'Your prescription is automatically routed to our PCAB-accredited pharmacy network. 503A and 503B compounding available.', bullets: ['PCAB-accredited partners', '503A & 503B compounding', 'All 50 states', 'Real-time order tracking'], color: '#B85C38', img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=700&q=80' },
  { step: '05', icon: Truck, tag: 'Delivery', title: 'Delivered to Your Door', subtitle: '2–5 day nationwide delivery.', body: 'Medications ship direct with cold-chain handling, temperature logs, and custom-branded packaging. Real-time tracking via SMS and email.', bullets: ['Cold-chain compliant', 'Custom branded packaging', 'SMS + email tracking', '2–5 day nationwide'], color: '#2D7D6B', img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=700&q=80' },
  { step: '06', icon: HeartPulse, tag: 'Ongoing Care', title: 'Continued Support & Refills', subtitle: "Your health journey doesn't end at delivery.", body: 'Automatic follow-up check-ins, dosage adjustment consultations, and refill management — all from your patient portal.', bullets: ['Automatic refill reminders', 'Dosage adjustment visits', 'Secure provider messaging', 'Lab result review'], color: '#4A6741', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80' },
];

// ─── FOR BUSINESS DATA ────────────────────────────────────────────────────────
const PRODUCT_TRACKS = [
  { id: 'glp', label: 'GLP-1 & Rx Telehealth', tag: 'Prescription Required', tagColor: '#B85C38', icon: Stethoscope, color: '#2D6A9F', headline: 'Full Prescription Commerce Stack', body: 'Sell physician-supervised treatments through a fully compliant telehealth funnel. Every order flows through a licensed provider visit, then routes to a 503A/B pharmacy.', products: ['GLP-1 Telehealth Protocols', 'Testosterone / BHRT', 'Sermorelin / GHRPs', 'Custom Compound Protocols', 'Hormone Optimization', 'Peptide Therapy'], requirements: ['Licensed provider on platform', '503A or 503B pharmacy partner', 'HIPAA-compliant checkout', 'State-by-state Rx laws covered'], cta: 'Start Telehealth Platform', link: 'MerchantOnboarding' },
  { id: 'ruo', label: 'Research-Use Only (RUO)', tag: 'No Rx Required', tagColor: '#7B5EA7', icon: FlaskConical, color: '#7B5EA7', headline: 'Institutional & Research Commerce', body: 'Sell HPLC-certified research compounds to licensed researchers and institutions. Age-gated, COA-required, with mandatory RUO disclaimers and institutional ordering workflows.', products: ['BPC-157', 'TB-500', 'PT-141', 'CJC-1295', 'NAD+ (research grade)', 'Epithalon'], requirements: ['Age verification gate (18+)', 'COA documentation per batch', '"Research Use Only" labeling', 'Institutional ordering forms'], cta: 'Start RUO Platform', link: 'MerchantOnboarding' },
  { id: 'wellness', label: 'Supplements & Wellness', tag: 'OTC — No Rx', tagColor: '#4A6741', icon: Package, color: '#4A6741', headline: 'Direct-to-Consumer Wellness Products', body: 'Launch a branded supplement and wellness storefront. Standard e-commerce checkout, no compliance hurdles. Ideal for gyms, nutrition practices, and health coaches.', products: ['Protein supplements', 'Vitamins & minerals', 'Weight management OTC', 'Sleep & recovery', 'Pre/post-workout', 'Adaptogens & nootropics'], requirements: ['Standard e-commerce checkout', 'FDA-compliant labeling', 'No prescription required', 'Standard merchant processing'], cta: 'Start Wellness Store', link: 'MerchantOnboarding' },
];

const TECH_INTEGRATIONS = [
  { name: 'Stripe', cat: 'Payments', icon: CreditCard, desc: 'PCI-compliant checkout, subscriptions, refunds, and split payouts' },
  { name: 'HubSpot', cat: 'CRM', icon: BarChart3, desc: 'Auto-sync leads, contacts, and deals from every form submission' },
  { name: 'Twilio', cat: 'Communications', icon: Zap, desc: 'SMS, voice, and WhatsApp patient communications' },
  { name: 'Google Calendar', cat: 'Scheduling', icon: Video, desc: 'Provider availability and appointment sync' },
  { name: 'Zapier', cat: 'Automation', icon: Link2, desc: '5,000+ app integrations via webhook automation' },
  { name: 'Qualiphy', cat: 'eConsent', icon: FileText, desc: 'Digital consent forms and identity verification' },
  { name: 'Google Drive', cat: 'Documents', icon: Layers, desc: 'Compliance document storage and intake form archiving' },
  { name: 'PEPMD', cat: 'Compliance', icon: Shield, desc: 'Automated compliance monitoring and audit trail' },
];

// ─── HOW IT WORKS DATA ────────────────────────────────────────────────────────
const HOW_STEPS = [
  { number: '01', title: 'Complete Health Questionnaire', description: 'Start by creating your profile and completing a comprehensive health questionnaire tailored to your needs.', icon: ClipboardCheck, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', details: ['Create your secure account', 'Answer questions about your medical history', 'Share your wellness goals', 'Upload any relevant health documents'] },
  { number: '02', title: 'Medical Review & Consultation', description: 'A licensed, board-certified physician reviews your health information and determines the best treatment plan.', icon: Stethoscope, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', details: ['Review by licensed physician', 'Personalized treatment recommendation', 'Custom dosage determination', 'Video, phone, or async visit'] },
  { number: '03', title: 'Pharmacy Fulfillment', description: 'Once approved, your prescription is sent to our partner pharmacy. Your medication arrives at your door in discreet packaging.', icon: Package, image: 'https://images.unsplash.com/photo-1580281657702-257584239a55?w=600&q=80', details: ['NABP-certified pharmacy partners', 'Discreet, secure packaging', 'Fast 3-5 day shipping', 'Temperature-controlled when needed'] },
  { number: '04', title: 'Ongoing Support', description: "Your journey doesn't end with delivery. Our medical team is available for questions, adjustments, and continued care.", icon: MessageCircle, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', details: ['24/7 messaging with care team', 'Regular check-ins and progress tracking', 'Easy prescription refills', 'Dosage adjustments as needed'] },
];

// ─── BOOK A CALL DATA ─────────────────────────────────────────────────────────
const CALL_TYPES = [
  { id: 'patient', icon: Stethoscope, title: 'Patient Consultation', sub: 'Book a telehealth visit with a licensed provider', color: '#4A6741', bg: '#D4E5D7', href: 'BookAppointment', bullets: ['Same-day availability', 'Video or phone visit', 'Prescription if appropriate', 'HIPAA-compliant platform'] },
  { id: 'business', icon: Building2, title: 'Business Discovery Call', sub: 'Learn how to launch your own telehealth platform', color: '#2D6A9F', bg: '#D0E8F5', href: 'Contact', bullets: ['White-label platform walkthrough', 'Compliance & licensing overview', 'Pricing & module selection', '30-minute strategy call'] },
  { id: 'partner', icon: Users, title: 'Partner Onboarding', sub: 'Providers, pharmacies, or creator partners', color: '#7B5EA7', bg: '#EDE8F5', href: 'Contact', bullets: ['Provider network overview', 'Pharmacy integration process', 'Creator program details', 'Revenue share structure'] },
];

const FAQS = [
  { q: 'Are your providers licensed in my state?', a: 'Yes. All providers are licensed to practice telemedicine across all 50 states. We match you to a licensed provider in your state automatically.' },
  { q: 'How quickly can I get an appointment?', a: 'Most patients can book same-day or next-day. Emergency slots are often available within hours.' },
  { q: 'Is this covered by insurance?', a: 'Currently we operate as a direct-pay model. We do not bill insurance, but we can provide superbills for out-of-network reimbursement.' },
  { q: 'What happens if I need a prescription?', a: 'If your provider determines a prescription is appropriate, it is issued digitally via Surescripts and routed to our verified pharmacy network — no additional steps needed.' },
  { q: 'How fast can I launch a business platform?', a: 'Most merchants go live within 7–30 days. The onboarding wizard provisions your domain, storefront, modules, and team automatically.' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Platform() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'telehealth';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [window.location.search]);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [activeTrack, setActiveTrack] = useState('glp');
  const [activeFaq, setActiveFaq] = useState(null);

  const track = PRODUCT_TRACKS.find(t => t.id === activeTrack);
  const TrackIcon = track.icon;

  const { data: providers = [] } = useQuery({
    queryKey: ['providers-platform'],
    queryFn: () => base44.entities.Provider.list('-created_date', 6),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=50" alt="" className="w-full h-full object-cover opacity-8" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 to-[#0A0A0A]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6">
              <Shield className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">HIPAA-Compliant · 50 States · Same-Day Available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-none" style={{ letterSpacing: '-0.03em' }}>
              MedRevolve<br />
              <span className="text-[#A8C99B]">Platform</span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto mb-8">
              Telehealth for patients. White-label infrastructure for businesses. Everything you need in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[{ v: '200+', l: 'Providers' }, { v: '50', l: 'States' }, { v: '200+', l: 'Merchants' }, { v: 'Day 1', l: 'Live in days' }].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-black text-white">{s.v}</p>
                  <p className="text-white/30 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Tab Bar ── */}
      <div className="sticky top-16 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-[#A8C99B]'
                    : 'text-white/35 border-transparent hover:text-white/60'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

          {/* ══ TELEHEALTH TAB ══ */}
          {activeTab === 'telehealth' && (
            <div className="bg-[#0A1628]">

              {/* Choose Visit */}
              <section className="py-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <p className="text-[#A8C99B]/60 text-xs font-bold uppercase tracking-widest mb-3">Telehealth Consultations</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>What Brings You In?</h2>
                    <p className="text-white/40 mt-3 max-w-xl mx-auto">Same-day availability. Licensed providers. Prescription sent within 24 hours.</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CONSULT_TYPES.map((ct, i) => (
                      <motion.div key={ct.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                        <Link to={createPageUrl(ct.href)} onClick={() => window.scrollTo({ top: 0 })}>
                          <div className="group relative bg-[#111D30] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden">
                            <div className="flex items-start justify-between mb-4">
                              <div className="text-3xl">{ct.emoji}</div>
                              <div className="flex flex-col items-end gap-1">
                                {ct.tags.map(tag => (
                                  <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5" style={{ color: ct.accent }}>{tag}</span>
                                ))}
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{ct.label}</h3>
                            <p className="text-xs font-semibold mb-3" style={{ color: ct.accent }}>{ct.sub}</p>
                            <p className="text-white/40 text-sm leading-relaxed flex-1">{ct.body}</p>
                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/8">
                              <div className="flex items-baseline gap-2">
                                <span className="text-white font-black text-xl">{ct.price}</span>
                                <span className="text-white/25 text-xs flex items-center gap-0.5"><Clock className="w-3 h-3" /> {ct.duration}</span>
                              </div>
                              <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: ct.accent }}>Book <ArrowRight className="w-3.5 h-3.5" /></span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Providers */}
              {providers.length > 0 && (
                <section className="py-16 px-6 lg:px-8 bg-[#0D1E35]">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-8 text-center">Meet Your Providers</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {providers.map((p, i) => (
                        <div key={p.id} className="bg-[#111D30] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all">
                          <div className="aspect-[4/3] bg-[#0D1E35] overflow-hidden">
                            <img src={p.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'} alt={p.name} className="w-full h-full object-cover opacity-85" loading="lazy" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-white text-sm">{p.name}, {p.title}</h3>
                            <p className="text-[#A8C99B] text-xs mb-3">{p.specialty}</p>
                            <div className="flex gap-2">
                              <Link to={createPageUrl(`ProviderProfile?id=${p.id}`)} className="flex-1">
                                <Button size="sm" variant="ghost" className="w-full text-white/50 border border-white/10 hover:bg-white/5 text-xs">Profile</Button>
                              </Link>
                              <Link to={createPageUrl('BookAppointment')} className="flex-1">
                                <Button size="sm" className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white text-xs">Book</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Compliance Badges */}
              <section className="py-16 px-6 lg:px-8 bg-[#F5F0E8]">
                <div className="max-w-5xl mx-auto text-center">
                  <Shield className="w-8 h-8 text-[#4A6741] mx-auto mb-3" />
                  <h2 className="text-2xl font-light text-[#2D3A2D] mb-2">Built for <span className="font-semibold">Full Compliance</span></h2>
                  <p className="text-[#5A6B5A] mb-8 max-w-xl mx-auto text-sm">Every layer meets the highest healthcare regulatory standards.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {COMPLIANCE_BADGES.map(b => {
                      const Icon = b.icon;
                      return (
                        <div key={b.label} className="bg-white rounded-xl px-4 py-3 flex items-center gap-2 border border-[#E8E0D5] shadow-sm">
                          <Icon className="w-4 h-4 text-[#4A6741] flex-shrink-0" />
                          <span className="text-[#2D3A2D] text-xs font-medium">{b.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ══ FOR BUSINESS TAB ══ */}
          {activeTab === 'business' && (
            <div className="bg-[#FDFBF7]">

              {/* Hero Banner */}
              <section className="relative bg-[#060606] py-16 px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=40)', backgroundSize: 'cover' }} />
                <div className="relative max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6">
                    <Building2 className="w-3.5 h-3.5 text-[#A8C99B]" />
                    <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">B2B Platform for Wellness Merchants</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                    Build. Launch. Comply.<br /><span className="text-[#A8C99B]">Under Your Brand.</span>
                  </h2>
                  <p className="text-white/45 text-lg max-w-2xl mx-auto mb-8">
                    The complete operating system for wellness merchants — telehealth, compliance, website, marketing, and payments, all white-labeled as yours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to={createPageUrl('MerchantOnboarding')}>
                      <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold">
                        Launch Your Platform <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

              {/* Product Tracks */}
              <section className="py-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">Products & Classification</p>
                    <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D]">Three Distinct Business Models</h2>
                    <p className="text-[#5A6B5A] mt-3 max-w-xl mx-auto">Each with its own compliance rules, checkout flow, and fulfillment path.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {PRODUCT_TRACKS.map(t => {
                      const Icon = t.icon;
                      return (
                        <button key={t.id} onClick={() => setActiveTrack(t.id)}
                          className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-semibold transition-all ${activeTrack === t.id ? 'text-white border-transparent shadow-lg' : 'text-[#5A6B5A] border-[#E8E0D5] bg-white hover:border-[#4A6741]/40'}`}
                          style={{ background: activeTrack === t.id ? t.color : undefined }}>
                          <Icon className="w-4 h-4" /> {t.label}
                        </button>
                      );
                    })}
                  </div>
                  <motion.div key={activeTrack} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white mb-4 inline-block" style={{ background: track.tagColor }}>{track.tag}</span>
                      <h3 className="text-3xl font-light text-[#2D3A2D] mb-4">{track.headline}</h3>
                      <p className="text-[#5A6B5A] leading-relaxed mb-8">{track.body}</p>
                      <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#5A6B5A] mb-3">Compliance Requirements</p>
                        <ul className="space-y-2">
                          {track.requirements.map(r => (
                            <li key={r} className="flex items-center gap-2.5 text-sm text-[#2D3A2D]">
                              <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: track.color }} /> {r}
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
                      <p className="text-xs font-bold uppercase tracking-widest text-[#5A6B5A] mb-4">Products / Services In This Category</p>
                      <div className="grid grid-cols-2 gap-2">
                        {track.products.map(p => (
                          <div key={p} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#E8E0D5] bg-[#FDFBF7] text-sm text-[#2D3A2D]">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: track.color }} /> {p}
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-[#E8E0D5] flex items-center gap-3">
                        <TrackIcon className="w-5 h-5" style={{ color: track.color }} />
                        <p className="text-xs text-[#5A6B5A]">Full catalog available in your merchant dashboard after onboarding.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Tech Stack */}
              <section className="py-16 px-6 lg:px-8 bg-[#F5F0E8]">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">Tech Stack</p>
                    <h2 className="text-3xl font-light text-[#2D3A2D]">Pre-Built <span className="font-semibold">Integrations</span></h2>
                    <p className="text-[#5A6B5A] mt-2 text-sm">Every tool your operation needs — already connected.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {TECH_INTEGRATIONS.map((t, i) => {
                      const Icon = t.icon;
                      return (
                        <motion.div key={t.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
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

              {/* CTA */}
              <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] to-[#2D3A2D]">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-light text-white mb-3">Ready to Launch <span className="font-semibold">Your Platform?</span></h2>
                  <p className="text-white/55 mb-8">Products, providers, pharmacy, payments, compliance — all on Day 1.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to={createPageUrl('MerchantOnboarding')}>
                      <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold">
                        Launch My Platform <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <button onClick={() => setActiveTab('book')} className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base transition-colors">
                      Book a Discovery Call
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ══ HOW IT WORKS TAB ══ */}
          {activeTab === 'how' && (
            <div className="bg-[#FDFBF7]">
              {/* Journey Navigator (for B2B) */}
              <section className="py-16 px-6 lg:px-8 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-14">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">The Complete Journey</p>
                    <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D]">
                      Booking to Delivery — <span className="font-semibold text-[#4A6741]">Step by Step</span>
                    </h2>
                    <p className="text-[#5A6B5A] mt-3 max-w-xl mx-auto">Every step automated, compliant, and tracked. You focus on your health.</p>
                  </div>
                  <div className="flex overflow-x-auto gap-2 justify-start lg:justify-center mb-10 pb-2 scrollbar-hide">
                    {JOURNEY_STEPS.map((j, i) => (
                      <button key={j.step} onClick={() => setActiveJourneyStep(i)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${activeJourneyStep === i ? 'text-white border-transparent' : 'text-[#5A6B5A] border-[#E8E0D5] bg-white hover:border-[#4A6741]/40'}`}
                        style={{ background: activeJourneyStep === i ? j.color : undefined }}>
                        {j.step} · {j.tag}
                      </button>
                    ))}
                  </div>
                  {JOURNEY_STEPS.map((s, i) => {
                    if (i !== activeJourneyStep) return null;
                    const Icon = s.icon;
                    return (
                      <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: s.color + '20' }}>
                              <Icon className="w-7 h-7" style={{ color: s.color }} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.tag}</p>
                              <p className="text-sm text-[#5A6B5A]">{s.subtitle}</p>
                            </div>
                          </div>
                          <h3 className="text-3xl font-light text-[#2D3A2D] mb-4">{s.title}</h3>
                          <p className="text-[#5A6B5A] leading-relaxed mb-8">{s.body}</p>
                          <ul className="space-y-3">
                            {s.bullets.map(b => (
                              <li key={b} className="flex items-center gap-3 text-sm text-[#2D3A2D]">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} /> {b}
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-3 mt-10 items-center">
                            {i > 0 && <button onClick={() => setActiveJourneyStep(i - 1)} className="text-sm text-[#5A6B5A] hover:text-[#2D3A2D]">← Prev</button>}
                            {i < JOURNEY_STEPS.length - 1 && (
                              <button onClick={() => setActiveJourneyStep(i + 1)} className="ml-auto flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white" style={{ background: s.color }}>
                                Next: {JOURNEY_STEPS[i + 1].tag} <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {i === JOURNEY_STEPS.length - 1 && (
                              <button onClick={() => setActiveTab('book')} className="ml-auto flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white" style={{ background: s.color }}>
                                Book Your Visit <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 rounded-3xl opacity-20 rotate-1" style={{ background: s.color + '30' }} />
                          <img src={s.img} alt={s.title} className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" loading="lazy" />
                          <div className="absolute -bottom-5 -right-5 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center" style={{ background: s.color }}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div className="flex justify-center gap-2 mt-10">
                    {JOURNEY_STEPS.map((_, i) => (
                      <button key={i} onClick={() => setActiveJourneyStep(i)} className="h-2 rounded-full transition-all"
                        style={{ background: i === activeJourneyStep ? JOURNEY_STEPS[activeJourneyStep].color : '#D4D4C8', width: i === activeJourneyStep ? '24px' : '8px' }} />
                    ))}
                  </div>
                </div>
              </section>

              {/* For Business — 4 simple steps */}
              <section className="py-16 px-6 lg:px-8 bg-[#0A1628]">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <p className="text-[#A8C99B]/70 text-xs font-bold uppercase tracking-widest mb-3">For Businesses</p>
                    <h2 className="text-3xl font-black text-white">Launching a Platform — <span className="text-[#A8C99B]">How It Works</span></h2>
                  </div>
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { n: '01', t: 'Complete Onboarding', d: 'Fill out the business wizard — entity, brand, domain, modules. Takes 10 minutes.', icon: ClipboardCheck },
                      { n: '02', t: 'We Build Your Stack', d: 'Our team provisions your storefront, compliance docs, and provider/pharmacy access.', icon: Globe },
                      { n: '03', t: 'Go Live in Days', d: 'Your domain is live, products are loaded, and your onboarding manager is assigned.', icon: Zap },
                      { n: '04', t: 'Scale with Support', d: 'Ongoing compliance monitoring, marketing tools, university training, and merchant support.', icon: BarChart3 },
                    ].map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                          <div className="w-12 h-12 rounded-xl bg-[#4A6741]/20 flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-6 h-6 text-[#A8C99B]" />
                          </div>
                          <p className="text-[#A8C99B] text-xs font-bold tracking-widest mb-2">{s.n}</p>
                          <h3 className="text-white font-bold mb-2">{s.t}</h3>
                          <p className="text-white/40 text-sm">{s.d}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-10 text-center">
                    <Link to={createPageUrl('MerchantOnboarding')}>
                      <Button className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold">
                        Start Onboarding <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section className="py-16 px-6 lg:px-8 bg-[#0D1E35]">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-black text-white mb-8 text-center">Common Questions</h2>
                  <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                      <div key={i} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                        <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                          <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeFaq === i && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                              <p className="px-6 pb-5 text-white/45 text-sm leading-relaxed">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ══ BOOK A CALL TAB ══ */}
          {activeTab === 'book' && (
            <div className="bg-[#0A1628] min-h-screen">
              <section className="py-20 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-14">
                    <p className="text-[#A8C99B]/60 text-xs font-bold uppercase tracking-widest mb-3">Get Started</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Talk to Someone</h2>
                    <p className="text-white/40 text-lg max-w-xl mx-auto">Choose what you need — a patient visit, a business discovery call, or a partner conversation.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {CALL_TYPES.map((ct, i) => {
                      const Icon = ct.icon;
                      return (
                        <motion.div key={ct.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                          className="bg-[#111D30] border border-white/8 hover:border-white/20 rounded-2xl p-7 flex flex-col transition-all hover:-translate-y-1">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: ct.bg }}>
                            <Icon className="w-7 h-7" style={{ color: ct.color }} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{ct.title}</h3>
                          <p className="text-white/40 text-sm mb-6 flex-1">{ct.sub}</p>
                          <ul className="space-y-2 mb-7">
                            {ct.bullets.map(b => (
                              <li key={b} className="flex items-center gap-2 text-sm text-white/60">
                                <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ct.color }} /> {b}
                              </li>
                            ))}
                          </ul>
                          <Link to={createPageUrl(ct.href)} onClick={() => window.scrollTo({ top: 0 })}>
                            <Button className="w-full rounded-none font-bold text-white" style={{ background: ct.color }}>
                              {ct.id === 'patient' ? 'Book Now' : 'Schedule Call'} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Direct contact info */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <h3 className="text-white font-bold text-lg mb-2">Prefer Email?</h3>
                    <p className="text-white/40 text-sm mb-4">Our team responds to all inquiries within 24 hours, usually sooner.</p>
                    <a href="mailto:rned@medrevolve.com" className="inline-flex items-center gap-2 text-[#A8C99B] font-bold hover:text-white transition-colors text-lg">
                      rned@medrevolve.com <ArrowRight className="w-5 h-5" />
                    </a>
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                      {[
                        { label: 'Patient Support', href: 'BookAppointment' },
                        { label: 'Business Inquiry', href: 'Contact' },
                        { label: 'Provider Intake', href: 'ProviderIntake' },
                        { label: 'Pharmacy Intake', href: 'PharmacyIntake' },
                      ].map(l => (
                        <Link key={l.label} to={createPageUrl(l.href)} onClick={() => window.scrollTo({ top: 0 })}
                          className="text-white/40 hover:text-white text-sm transition-colors border-b border-white/20 hover:border-white pb-0.5">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}