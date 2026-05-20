import React, { useState } from 'react';
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
  Stethoscope, ChevronDown
} from 'lucide-react';

const JOURNEY = [
  {
    step: '01', icon: ClipboardList, tag: 'Intake',
    title: 'Tell Us About You', subtitle: 'Smart health intake — 3 minutes.',
    body: 'Complete a dynamic questionnaire tailored to your treatment goal. Upload labs, photos, or documents. Everything is encrypted and HIPAA-compliant.',
    bullets: ['Condition-specific forms', 'Photo & document upload', 'Insurance verification', 'Secure, private, encrypted'],
    color: '#4A6741', light: '#D4E5D7',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80',
  },
  {
    step: '02', icon: Video, tag: 'Consultation',
    title: 'Meet Your Provider', subtitle: 'Same-day or next-day appointments.',
    body: 'Connect via secure video or phone with a licensed MD, NP, or PA. Your provider reviews your intake, takes clinical notes, and builds a personalized protocol.',
    bullets: ['Licensed in all 50 states', 'Video, phone, or async', 'AI-assisted clinical notes', 'Full EMR access'],
    color: '#2D6A9F', light: '#D0E8F5',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&q=80',
  },
  {
    step: '03', icon: FileText, tag: 'Prescription',
    title: 'Your Rx — Issued Instantly', subtitle: 'E-prescribing with full clinical decision support.',
    body: 'Prescriptions are issued digitally via our Surescripts-certified system. Drug interaction checks, ICD-10 coding, and dosage guidance happen automatically.',
    bullets: ['Surescripts certified', 'Drug interaction checks', 'AI ICD-10 coding', 'Digital Rx records'],
    color: '#7B5EA7', light: '#EDE8F5',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&q=80',
  },
  {
    step: '04', icon: Pill, tag: 'Pharmacy',
    title: 'Routed to a Verified Pharmacy', subtitle: 'Compounding, commercial, specialty — nationwide.',
    body: 'Your prescription is automatically routed to our PCAB-accredited pharmacy network. 503A and 503B compounding available. Fulfillment across all 50 states.',
    bullets: ['PCAB-accredited partners', '503A & 503B compounding', 'All 50 states', 'Real-time order tracking'],
    color: '#B85C38', light: '#F5E0D8',
    img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=700&q=80',
  },
  {
    step: '05', icon: Truck, tag: 'Delivery',
    title: 'Delivered to Your Door', subtitle: '2–5 day nationwide delivery.',
    body: 'Medications ship direct with cold-chain handling, temperature logs, and custom-branded packaging. Real-time tracking updates sent via SMS and email.',
    bullets: ['Cold-chain compliant', 'Custom branded packaging', 'SMS + email tracking', '2–5 day nationwide'],
    color: '#2D7D6B', light: '#C8EAE4',
    img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=700&q=80',
  },
  {
    step: '06', icon: HeartPulse, tag: 'Ongoing Care',
    title: 'Continued Support & Refills', subtitle: "Your health journey doesn't end at delivery.",
    body: 'Automatic follow-up check-ins, dosage adjustment consultations, and refill management — all from your patient portal. Your provider is always a message away.',
    bullets: ['Automatic refill reminders', 'Dosage adjustment visits', 'Secure provider messaging', 'Lab result review'],
    color: '#4A6741', light: '#D4E5D7',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80',
  },
];

const CONSULT_TYPES = [
  { id: 'weight', emoji: '⚖️', label: 'Weight Loss', sub: 'GLP-1, Semaglutide, Tirzepatide', body: 'A licensed provider reviews your health history and prescribes the right GLP-1 protocol for your goals.', duration: '20–30 min', price: '$79', href: 'BookAppointment?type=weight_loss', accent: '#4A6741', tags: ['Most popular', 'Rx provided'] },
  { id: 'mens', emoji: '⚡', label: "Men's Health", sub: 'Testosterone, TRT, Performance', body: 'Comprehensive consultation covering testosterone levels, energy, libido, and vitality optimization.', duration: '25–30 min', price: '$79', href: 'BookAppointment?type=mens_health', accent: '#4338CA', tags: ['Bloodwork review', 'TRT protocols'] },
  { id: 'womens', emoji: '🌸', label: "Women's Health", sub: 'Hormones, Menopause, Wellness', body: 'Hormone panel review, BHRT consultation, and a personalized wellness protocol tailored to your phase of life.', duration: '25–30 min', price: '$79', href: 'BookAppointment?type=womens_health', accent: '#A21CAF', tags: ['BHRT consult', 'Hormone panel'] },
  { id: 'longevity', emoji: '🧬', label: 'Longevity & Peptides', sub: 'NAD+, Sermorelin, BPC-157', body: 'Explore cutting-edge peptide protocols, longevity biomarkers, and functional medicine strategies with a specialist.', duration: '30 min', price: '$99', href: 'BookAppointment?type=longevity', accent: '#7C3AED', tags: ['Biomarker review', 'Peptide protocols'] },
  { id: 'general', emoji: '🩺', label: 'General Wellness', sub: 'Labs, Referrals, Health Review', body: 'A comprehensive wellness consult covering labs, health goals, and a full protocol review across all categories.', duration: '30 min', price: '$79', href: 'BookAppointment?type=general', accent: '#0891B2', tags: ['Full review', 'Labs included'] },
  { id: 'followup', emoji: '📋', label: 'Follow-Up Visit', sub: 'Dosage Adjustment, Check-In', body: 'Already a member? Quick follow-up to adjust your dosage, review results, or address any questions.', duration: '15 min', price: '$49', href: 'BookAppointment?type=follow_up', accent: '#8B7355', tags: ['Members only', 'Quick visit'] },
];

const COMPLIANCE = [
  { label: 'HIPAA Compliant', icon: Shield },
  { label: 'LegitScript Certified', icon: CheckCircle },
  { label: 'Surescripts Integrated', icon: FileText },
  { label: 'SOC 2 Type II', icon: Lock },
  { label: 'DEA Compliant', icon: Shield },
  { label: '50-State Licensed', icon: Globe },
  { label: 'ISO 27001 Aligned', icon: Shield },
  { label: 'PCI DSS (Stripe)', icon: Lock },
  { label: 'PCAB Accredited Pharmacies', icon: CheckCircle },
  { label: 'GDPR Compliant', icon: CheckCircle },
  { label: 'CCPA Compliant', icon: CheckCircle },
  { label: '503A/B Compounding', icon: Pill },
];

const FAQS = [
  { q: 'Are your providers licensed in my state?', a: 'Yes. All providers are licensed to practice telemedicine across all 50 states. We match you to a licensed provider in your state automatically.' },
  { q: 'How quickly can I get an appointment?', a: 'Most patients can book same-day or next-day. Emergency slots are often available within hours.' },
  { q: 'Is this covered by insurance?', a: 'Currently we operate as a direct-pay model. We do not bill insurance, but we can provide superbills for out-of-network reimbursement.' },
  { q: 'What happens if I need a prescription?', a: 'If your provider determines a prescription is appropriate, it is issued digitally via Surescripts and routed to our verified pharmacy network — no additional steps needed.' },
  { q: 'Can I message my provider after the visit?', a: 'Yes. Secure in-app messaging with your provider is available for 30 days after every consultation.' },
];

export default function TelehealthPlatform() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ['upcomingAppointments', user?.email],
    queryFn: () => base44.entities.Appointment.filter(
      { patient_email: user?.email, status: ['scheduled', 'confirmed'] },
      'appointment_date', 5
    ),
    enabled: !!user?.email,
    retry: false,
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.Provider.list('-created_date', 6),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-[#0A1628]">

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-28 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=60"
            alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/60 to-[#0A1628]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
              <Shield className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">HIPAA-Compliant · 50 States · Same-Day Available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none" style={{ letterSpacing: '-0.03em' }}>
              Real Doctors.<br />
              <span className="text-[#A8C99B]">Intake to Doorstep.</span>
            </h1>
            <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a same-day consultation, get your prescription, and have it delivered to your door — one seamless platform, fully compliant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('BookAppointment')}>
                <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-10 font-bold text-base">
                  Book a Consultation <Calendar className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('ForBusiness')}>
                <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base">
                  Build Your Own Platform
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { v: '2.4M+', l: 'Patients Served' },
                { v: '3.5M+', l: 'Prescriptions Filled' },
                { v: '200+', l: 'Licensed Providers' },
                { v: '50', l: 'States Covered' },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-black text-white">{s.v}</p>
                  <p className="text-white/35 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Appointments (logged in) ── */}
      {upcomingAppointments.length > 0 && (
        <section className="py-10 px-6 lg:px-8 bg-white/5 border-y border-white/8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Your Upcoming Visits</h2>
              <Link to={createPageUrl('MyAppointments')}>
                <button className="text-[#A8C99B] text-xs font-medium hover:text-white flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {upcomingAppointments.slice(0, 3).map(apt => (
                <div key={apt.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#A8C99B]" />
                    <span className="text-[#A8C99B] text-[10px] font-bold uppercase tracking-widest">{apt.status}</span>
                  </div>
                  <p className="text-white font-semibold text-sm">
                    {new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {new Date(apt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Book a Visit ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A8C99B]/60 text-xs font-bold uppercase tracking-widest mb-3">Choose Your Visit</p>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>What Are You Here For?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONSULT_TYPES.map((ct, i) => (
              <motion.div key={ct.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={createPageUrl(ct.href)} onClick={() => window.scrollTo({ top: 0 })}>
                  <div className="group relative bg-[#111D30] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity -translate-y-1/2 translate-x-1/2" style={{ background: ct.accent }} />
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{ct.emoji}</div>
                      <div className="flex flex-col items-end gap-1">
                        {ct.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5" style={{ color: ct.accent }}>
                            {tag}
                          </span>
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
                      <span className="flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-2.5" style={{ color: ct.accent }}>
                        Book Now <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How the Full Journey Works ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">The Complete Journey</p>
            <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
              Booking to Delivery — <span className="font-semibold text-[#4A6741]">Step by Step</span>
            </h2>
            <p className="text-[#5A6B5A] text-lg max-w-2xl mx-auto">
              Every step automated, compliant, and tracked. You focus on your health.
            </p>
          </div>

          {/* Step nav */}
          <div className="flex overflow-x-auto gap-2 justify-start lg:justify-center mb-12 pb-2 scrollbar-hide">
            {JOURNEY.map((j, i) => (
              <button key={j.step} onClick={() => setActiveStep(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeStep === i ? 'text-white border-transparent' : 'text-[#5A6B5A] border-[#E8E0D5] bg-white hover:border-[#4A6741]/40'
                }`}
                style={{ background: activeStep === i ? JOURNEY[i].color : undefined }}>
                {j.step} · {j.tag}
              </button>
            ))}
          </div>

          {JOURNEY.map((step, i) => {
            if (i !== activeStep) return null;
            const Icon = step.icon;
            return (
              <motion.div key={step.step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: step.light }}>
                      <Icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>{step.tag}</p>
                      <p className="text-sm text-[#5A6B5A]">{step.subtitle}</p>
                    </div>
                  </div>
                  <h3 className="text-4xl font-light text-[#2D3A2D] mb-4">{step.title}</h3>
                  <p className="text-[#5A6B5A] leading-relaxed mb-8 text-lg">{step.body}</p>
                  <ul className="space-y-3">
                    {step.bullets.map(b => (
                      <li key={b} className="flex items-center gap-3 text-sm text-[#2D3A2D]">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: step.color }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 mt-10 items-center">
                    {i > 0 && (
                      <button onClick={() => setActiveStep(i - 1)} className="text-sm text-[#5A6B5A] hover:text-[#2D3A2D]">← Previous</button>
                    )}
                    {i < JOURNEY.length - 1 && (
                      <button onClick={() => setActiveStep(i + 1)}
                        className="ml-auto flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white"
                        style={{ background: step.color }}>
                        Next: {JOURNEY[i + 1].tag} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {i === JOURNEY.length - 1 && (
                      <Link to={createPageUrl('BookAppointment')} className="ml-auto">
                        <Button className="rounded-full text-white px-8" style={{ background: step.color }}>
                          Book Your Visit <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl opacity-20 rotate-1" style={{ background: step.light }} />
                  <img src={step.img} alt={step.title} className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" loading="lazy" />
                  <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center" style={{ background: step.color }}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="flex justify-center gap-2 mt-12">
            {JOURNEY.map((_, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className="h-2 rounded-full transition-all"
                style={{ background: i === activeStep ? JOURNEY[activeStep].color : '#D4D4C8', width: i === activeStep ? '24px' : '8px' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Providers ── */}
      {providers.length > 0 && (
        <section className="py-20 px-6 lg:px-8 bg-[#0D1E35]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Meet Your Providers</h2>
              <p className="text-white/35">Board-certified. Licensed in all 50 states. Dedicated to your results.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {providers.map((provider, i) => (
                <motion.div key={provider.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="bg-[#111D30] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all">
                    <div className="aspect-[4/3] bg-[#0D1E35] overflow-hidden">
                      <img src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'}
                        alt={provider.name} className="w-full h-full object-cover opacity-85" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-white text-base mb-0.5">{provider.name}, {provider.title}</h3>
                      <p className="text-[#A8C99B] text-sm mb-3">{provider.specialty}</p>
                      {provider.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">{[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(provider.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                          ))}</div>
                          <span className="text-white/25 text-xs">{provider.total_consultations}+ consults</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link to={createPageUrl(`ProviderProfile?id=${provider.id}`)} className="flex-1">
                          <Button size="sm" variant="ghost" className="w-full text-white/50 border border-white/10 hover:bg-white/5 rounded-lg text-xs">Profile</Button>
                        </Link>
                        <Link to={createPageUrl(`BookAppointment?provider=${provider.id}`)} className="flex-1">
                          <Button size="sm" className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg text-xs">Book</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── White Label Banner ── */}
      <section className="py-16 px-6 lg:px-8 bg-[#2D3A2D]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest mb-2">For Businesses</p>
            <h2 className="text-3xl font-light text-white">Want to run <span className="font-semibold text-[#A8C99B]">this platform under your brand?</span></h2>
            <p className="text-white/50 mt-2 max-w-xl">White-label telehealth for clinics, med spas, and wellness brands. Your brand, your domain, our infrastructure.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to={createPageUrl('ForBusiness')}>
              <Button className="bg-[#A8C99B] text-[#2D3A2D] hover:bg-[#8FB88F] rounded-none px-8 font-bold">
                Explore B2B Solutions <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none px-8">Launch Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Compliance ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto text-center">
          <Shield className="w-10 h-10 text-[#4A6741] mx-auto mb-4" />
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-2">Built for <span className="font-semibold">Full Compliance</span></h2>
          <p className="text-[#5A6B5A] mb-10 max-w-xl mx-auto">Every layer — clinical, technical, and operational — meets the highest healthcare regulatory standards.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMPLIANCE.map(b => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-[#E8E0D5] shadow-sm">
                  <Icon className="w-4 h-4 text-[#4A6741] flex-shrink-0" />
                  <span className="text-[#2D3A2D] text-sm font-medium">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#0D1E35]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left">
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

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] to-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light text-white mb-3">
            Ready to Talk to <span className="font-semibold">a Real Doctor?</span>
          </h2>
          <p className="text-white/50 mb-10">Same-day availability. Prescription sent within 24 hours. Delivered to your door.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('BookAppointment')}>
              <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold text-base">
                Book My Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('ProviderIntake')}>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base">
                Join as a Provider
              </Button>
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-6">HIPAA-compliant · All 50 states · No setup fees · Cancel anytime</p>
        </div>
      </section>

    </div>
  );
}