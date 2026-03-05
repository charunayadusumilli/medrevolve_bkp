import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Video, Calendar, MessageSquare, Clock, Star,
  ArrowRight, Shield, Users, CheckCircle, FileText,
  Stethoscope, Zap, Lock
} from 'lucide-react';

const consultTypes = [
  {
    id: 'weight',
    icon: '⚖️',
    label: 'Weight Loss',
    sub: 'GLP-1, Semaglutide, Tirzepatide',
    desc: 'A licensed provider will review your health history and prescribe the right GLP-1 protocol for your goals.',
    duration: '20–30 min',
    price: '$79',
    href: 'BookAppointment?type=weight_loss',
    accent: '#4A6741',
  },
  {
    id: 'mens',
    icon: '⚡',
    label: "Men's Health",
    sub: 'Testosterone, TRT, Performance',
    desc: 'Comprehensive consultation covering testosterone levels, energy, and vitality optimization.',
    duration: '25–30 min',
    price: '$79',
    href: 'BookAppointment?type=mens_health',
    accent: '#4338CA',
  },
  {
    id: 'womens',
    icon: '🌸',
    label: "Women's Health",
    sub: 'Hormones, Menopause, Wellness',
    desc: 'Hormone panel review, BHRT consultation, and a personalized wellness protocol.',
    duration: '25–30 min',
    price: '$79',
    href: 'BookAppointment?type=womens_health',
    accent: '#A21CAF',
  },
  {
    id: 'longevity',
    icon: '🧬',
    label: 'Longevity & Peptides',
    sub: 'NAD+, Sermorelin, BPC-157',
    desc: 'Explore cutting-edge peptide protocols and longevity biomarkers with a specialist.',
    duration: '30 min',
    price: '$99',
    href: 'BookAppointment?type=longevity',
    accent: '#7C3AED',
  },
  {
    id: 'general',
    icon: '🩺',
    label: 'General Wellness',
    sub: 'Labs, Referrals, Health Review',
    desc: 'A comprehensive wellness consult covering labs, health goals, and a full protocol review.',
    duration: '30 min',
    price: '$79',
    href: 'BookAppointment?type=general',
    accent: '#0891B2',
  },
  {
    id: 'followup',
    icon: '📋',
    label: 'Follow-Up Visit',
    sub: 'Dosage Adjustment, Check-In',
    desc: 'Already a member? Schedule a quick follow-up to adjust your dosage or review results.',
    duration: '15 min',
    price: '$49',
    href: 'BookAppointment?type=follow_up',
    accent: '#8B7355',
  },
];

const process = [
  { step: '01', icon: Calendar, title: 'Book Your Visit', desc: 'Pick a consult type, choose your provider (or let us match you), and pick a time.' },
  { step: '02', icon: FileText, title: 'Complete Intake', desc: 'Fill out a short health questionnaire before your appointment. Takes 3 minutes.' },
  { step: '03', icon: Video, title: 'Video Consultation', desc: 'Connect with your provider via secure HIPAA-compliant video. Ask everything.' },
  { step: '04', icon: Stethoscope, title: 'Receive Your Rx', desc: 'Your provider writes a prescription (if appropriate) — sent directly to your pharmacy.' },
];

export default function Consultations() {
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

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=70&fm=webp"
            alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/85 to-[#0A1628]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
              <Shield className="w-3.5 h-3.5 text-[#A8C99B]" />
              <span className="text-[#A8C99B] text-xs font-bold tracking-widest uppercase">HIPAA-Compliant Telehealth</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-tight" style={{ letterSpacing: '-0.03em' }}>
              Real Doctors.<br />
              <span className="text-[#A8C99B]">Real Results.</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Same-day or next-day telehealth consultations with licensed physicians and NPs. Get your personalized protocol, prescription, and ongoing support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={createPageUrl('BookAppointment')}>
                <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-10 font-bold text-base shadow-2xl">
                  Book a Consultation <Calendar className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              {user && (
                <Link to={createPageUrl('MyAppointments')}>
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-none px-8 border border-white/20 text-base">
                    My Appointments
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              {[
                { icon: Shield, label: 'HIPAA-Compliant' },
                { icon: Users, label: '200+ Providers' },
                { icon: Star, label: '4.9★ Rating' },
                { icon: Zap, label: 'Same-Day Visits' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/40 text-sm">
                  <Icon className="w-4 h-4 text-[#A8C99B]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Appointments (if logged in) ──────────────────────── */}
      {upcomingAppointments.length > 0 && (
        <section className="py-12 px-6 lg:px-8 bg-white/5 border-y border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Your Upcoming Appointments</h2>
              <Link to={createPageUrl('MyAppointments')}>
                <button className="text-[#A8C99B] text-sm font-medium hover:text-white transition-colors flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingAppointments.slice(0, 3).map(apt => (
                <div key={apt.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#A8C99B]" />
                    <span className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest">{apt.status}</span>
                  </div>
                  <p className="text-white font-semibold text-sm">
                    {new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {new Date(apt.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Consult Types ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#A8C99B]/60 mb-3">Choose Your Visit Type</p>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              What Are You Looking For?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {consultTypes.map((ct, i) => (
              <motion.div key={ct.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={createPageUrl(ct.href)} onClick={() => window.scrollTo({ top: 0 })}>
                  <div className="group bg-[#1E293B] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{ct.icon}</div>
                      <span className="text-xs font-bold text-white/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ct.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{ct.label}</h3>
                    <p className="text-xs font-medium mb-3" style={{ color: ct.accent }}>{ct.sub}</p>
                    <p className="text-white/45 text-sm leading-relaxed flex-1">{ct.desc}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                      <span className="text-white font-bold text-lg">{ct.price}</span>
                      <span className="flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-2.5"
                        style={{ color: ct.accent }}>
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

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>How It Works</h2>
            <p className="text-white/40">From booking to prescription in 4 steps.</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#A8C99B]" />
                  </div>
                  <p className="text-[10px] font-bold text-[#A8C99B]/50 uppercase tracking-widest mb-1">{p.step}</p>
                  <h3 className="font-bold text-white text-sm mb-2">{p.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Meet Our Providers ────────────────────────────────────────── */}
      {providers.length > 0 && (
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Meet Your Providers</h2>
              <p className="text-white/40">Board-certified. Licensed. Dedicated to your results.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider, i) => (
                <motion.div key={provider.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="bg-[#1E293B] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all">
                    <div className="aspect-[4/3] bg-[#0F172A] overflow-hidden">
                      <img src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'}
                        alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-white text-base mb-0.5">{provider.name}, {provider.title}</h3>
                      <p className="text-[#A8C99B] text-sm mb-3">{provider.specialty}</p>
                      {provider.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(provider.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                            ))}
                          </div>
                          <span className="text-white/30 text-xs">{provider.total_consultations}+ consults</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link to={createPageUrl(`ProviderProfile?id=${provider.id}`)} className="flex-1">
                          <Button size="sm" variant="ghost" className="w-full text-white/60 border border-white/10 hover:bg-white/5 rounded-none text-xs">Profile</Button>
                        </Link>
                        <Link to={createPageUrl(`BookAppointment?provider=${provider.id}`)} className="flex-1">
                          <Button size="sm" className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-none text-xs">Book</Button>
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

      {/* ── No providers placeholder ──────────────────────────────────── */}
      {providers.length === 0 && (
        <section className="py-16 px-6 text-center">
          <Users className="w-14 h-14 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 mb-6">Our provider team is being set up. You can still book below.</p>
          <Link to={createPageUrl('BookAppointment')}>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-none px-8">Book a Consultation</Button>
          </Link>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            Ready to Talk to a Doctor?
          </h2>
          <p className="text-white/40 mb-10">Book today. Same-day availability. Prescription sent in 24 hours.</p>
          <Link to={createPageUrl('BookAppointment')}>
            <Button size="lg" className="bg-white text-[#0A1628] hover:bg-white/90 rounded-none px-12 font-bold text-base">
              Schedule My Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}