import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Video, Calendar, Clock, Star,
  ArrowRight, Shield, Users, CheckCircle, FileText,
  Stethoscope, Zap, Lock, MessageSquare, HeartPulse, Pill, ChevronDown
} from 'lucide-react';

const CONSULT_TYPES = [
  {
    id: 'weight',
    emoji: '⚖️',
    label: 'Weight Loss',
    sub: 'GLP-1, Semaglutide, Tirzepatide',
    body: 'A licensed provider reviews your health history and prescribes the right GLP-1 protocol for your goals. Most patients see results within 4–8 weeks.',
    duration: '20–30 min',
    price: '$79',
    href: 'BookAppointment?type=weight_loss',
    accent: '#4A6741',
    bg: '#D4E5D7',
    tags: ['Most popular', 'Rx provided'],
  },
  {
    id: 'mens',
    emoji: '⚡',
    label: "Men's Health",
    sub: 'Testosterone, TRT, Performance',
    body: 'Comprehensive consultation covering testosterone levels, energy, libido, and vitality optimization. Bloodwork review included.',
    duration: '25–30 min',
    price: '$79',
    href: 'BookAppointment?type=mens_health',
    accent: '#4338CA',
    bg: '#E0E7FF',
    tags: ['Bloodwork review', 'TRT protocols'],
  },
  {
    id: 'womens',
    emoji: '🌸',
    label: "Women's Health",
    sub: 'Hormones, Menopause, Wellness',
    body: 'Hormone panel review, BHRT consultation, and a personalized wellness protocol tailored to your phase of life.',
    duration: '25–30 min',
    price: '$79',
    href: 'BookAppointment?type=womens_health',
    accent: '#A21CAF',
    bg: '#F5E8FF',
    tags: ['BHRT consult', 'Hormone panel'],
  },
  {
    id: 'longevity',
    emoji: '🧬',
    label: 'Longevity & Peptides',
    sub: 'NAD+, Sermorelin, BPC-157',
    body: 'Explore cutting-edge peptide protocols, longevity biomarkers, and functional medicine strategies with a specialist.',
    duration: '30 min',
    price: '$99',
    href: 'BookAppointment?type=longevity',
    accent: '#7C3AED',
    bg: '#EDE8FF',
    tags: ['Biomarker review', 'Peptide protocols'],
  },
  {
    id: 'general',
    emoji: '🩺',
    label: 'General Wellness',
    sub: 'Labs, Referrals, Health Review',
    body: 'A comprehensive wellness consult covering labs, health goals, and a full protocol review across all categories.',
    duration: '30 min',
    price: '$79',
    href: 'BookAppointment?type=general',
    accent: '#0891B2',
    bg: '#D0F0FA',
    tags: ['Full review', 'Labs included'],
  },
  {
    id: 'followup',
    emoji: '📋',
    label: 'Follow-Up Visit',
    sub: 'Dosage Adjustment, Check-In',
    body: 'Already a member? Quick follow-up to adjust your dosage, review bloodwork results, or address any questions.',
    duration: '15 min',
    price: '$49',
    href: 'BookAppointment?type=follow_up',
    accent: '#8B7355',
    bg: '#F0E8D8',
    tags: ['Members only', 'Quick visit'],
  },
];

const HOW_IT_WORKS = [
  { n: '01', icon: Calendar, title: 'Pick Your Visit Type', desc: 'Choose a consult category, select a provider, and pick a date and time that works for you.' },
  { n: '02', icon: FileText, title: 'Complete Your Intake', desc: 'Short health questionnaire before your appointment. Takes 3 minutes. Encrypted and HIPAA-compliant.' },
  { n: '03', icon: Video, title: 'Meet Your Provider', desc: 'Secure video call with a licensed MD or NP. Ask everything — they have your full intake.' },
  { n: '04', icon: Pill, title: 'Receive Your Protocol', desc: 'Prescription issued (if appropriate) and routed directly to a verified pharmacy. Delivered to your door in 2–5 days.' },
];

const FAQS = [
  { q: 'Are your providers licensed in my state?', a: 'Yes. All providers are licensed to practice telemedicine across all 50 states. We match you to a licensed provider in your state automatically.' },
  { q: 'How quickly can I get an appointment?', a: 'Most patients can book same-day or next-day. Emergency slots are often available within hours.' },
  { q: 'Is this covered by insurance?', a: 'Currently we operate as a direct-pay model. We do not bill insurance, but we can provide superbills for out-of-network reimbursement.' },
  { q: 'What happens if I need a prescription?', a: 'If your provider determines a prescription is appropriate, it is issued digitally via Surescripts and routed to our verified pharmacy network — no additional steps needed.' },
  { q: 'Can I message my provider after the visit?', a: 'Yes. Secure in-app messaging with your provider is available for 30 days after every consultation.' },
];

export default function Consultations() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [hoveredConsult, setHoveredConsult] = useState(null);

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
      <section className="relative pt-20 pb-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=70"
            alt="" className="w-full h-full object-cover opacity-12" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 to-[#0A1628]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
              <Shield className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">HIPAA-Compliant · 50 States · Same-Day Available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none" style={{ letterSpacing: '-0.03em' }}>
              Real Doctors.<br />
              <span className="text-[#A8C99B]">Real Results.</span>
            </h1>
            <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a telehealth consultation with a licensed physician or nurse practitioner. Same-day availability. Prescription delivered in 24–48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('BookAppointment')}>
                <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-10 font-bold text-base">
                  Book a Consultation <Calendar className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              {user && (
                <Link to={createPageUrl('MyAppointments')}>
                  <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-8 text-base">
                    My Appointments
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
              {[
                { icon: Shield, label: 'HIPAA-Compliant' },
                { icon: Users, label: '200+ Providers' },
                { icon: Star, label: '4.9★ Rating' },
                { icon: Zap, label: 'Same-Day Visits' },
                { icon: Lock, label: 'Encrypted & Private' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/35 text-xs">
                  <Icon className="w-3.5 h-3.5 text-[#A8C99B]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming (if logged in) ── */}
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

      {/* ── Consult Types ── */}
      <section className="py-24 px-6 lg:px-8">
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
                  <div
                    className="group relative bg-[#111D30] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col overflow-hidden"
                    onMouseEnter={() => setHoveredConsult(ct.id)}
                    onMouseLeave={() => setHoveredConsult(null)}
                  >
                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity -translate-y-1/2 translate-x-1/2"
                      style={{ background: ct.accent }} />

                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{ct.emoji}</div>
                      <div className="flex flex-col items-end gap-1">
                        {ct.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: ct.accent, background: ct.bg + '30' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{ct.label}</h3>
                    <p className="text-xs font-semibold mb-3" style={{ color: ct.accent }}>{ct.sub}</p>
                    <p className="text-white/40 text-sm leading-relaxed flex-1">{ct.body}</p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/8">
                      <div>
                        <span className="text-white font-black text-xl">{ct.price}</span>
                        <span className="text-white/25 text-xs ml-1.5 flex items-center gap-0.5 inline-flex">
                          <Clock className="w-3 h-3" /> {ct.duration}
                        </span>
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

      {/* ── How It Works ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#0D1E35]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>From Booking to Delivery</h2>
            <p className="text-white/35">4 steps. Fully guided. Nothing complicated.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#A8C99B]" />
                  </div>
                  <p className="text-[10px] font-bold text-[#A8C99B]/40 uppercase tracking-widest mb-1">{p.n}</p>
                  <h3 className="font-bold text-white text-sm mb-2">{p.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Provider Grid ── */}
      {providers.length > 0 && (
        <section className="py-20 px-6 lg:px-8">
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

      {/* ── FAQ ── */}
      <section className="py-20 px-6 lg:px-8 bg-[#0D1E35]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    >
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
      <section className="py-24 px-6 lg:px-8 bg-[#0A1628]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            Ready to Talk to a Doctor?
          </h2>
          <p className="text-white/35 mb-10">Same-day availability. Prescription sent within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('BookAppointment')}>
              <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-12 font-bold text-base">
                Schedule My Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('ProviderIntake')}>
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base">
                Join as a Provider
              </Button>
            </Link>
          </div>
          <p className="text-white/20 text-xs mt-6">HIPAA-compliant · Secure · Licensed providers · All 50 states</p>
        </div>
      </section>

    </div>
  );
}