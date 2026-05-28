import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, BookOpen, Users, Building2, ChevronDown, ChevronUp, FileText, Video, Zap } from 'lucide-react';

const OPERATOR_TRACKS = [
  {
    id: 'launch',
    icon: Zap,
    title: 'Launch Track',
    subtitle: 'For first-time operators',
    desc: 'Everything you need to go from idea to live telehealth business — step by step.',
    modules: [
      'What is a compliant telehealth business?',
      'LLC formation & business banking',
      'How to set up a merchant account for telehealth',
      'Domain, website & branding basics',
      'Connecting to a licensed provider network',
      'Pharmacy integrations & fulfillment 101',
      'Your first 10 patients — acquisition playbook',
    ],
    color: '#4A6741',
    tag: 'Beginner',
  },
  {
    id: 'compliance',
    icon: FileText,
    title: 'Compliance Track',
    subtitle: 'LegitScript, HIPAA & state law',
    desc: 'Understand the regulatory landscape and how to operate a telehealth business safely and legally.',
    modules: [
      'HIPAA basics for telehealth operators',
      'LegitScript certification — what it means & how to get it',
      'State-by-state telehealth prescribing laws overview',
      'Avoiding Corporate Practice of Medicine (CPOM) risk',
      'Required disclosures, consent forms & patient rights',
      'Data privacy: CCPA & GDPR for health businesses',
      'DEA & controlled substance rules for telehealth platforms',
    ],
    color: '#7B3F6E',
    tag: 'Essential',
  },
  {
    id: 'scale',
    icon: Building2,
    title: 'Scale Track',
    subtitle: 'For established operators',
    desc: 'Advanced strategies for growing your telehealth business — multi-state, multi-channel.',
    modules: [
      'Building a provider network at scale',
      'Multi-pharmacy routing & inventory management',
      'Creator & affiliate programs for telehealth',
      'B2B partnership development — gyms, spas, clinics',
      'Email, SMS & CRM automation for patient retention',
      'Subscription billing models & revenue optimization',
      'Analytics, attribution & growth reporting',
    ],
    color: '#2D6A9F',
    tag: 'Advanced',
  },
];

const PATIENT_TOPICS = [
  {
    title: 'Understanding Your Care Plan',
    desc: 'What your physician-directed care plan means and what to expect at each stage.',
    icon: '📋',
  },
  {
    title: 'Telehealth Consultations — What to Expect',
    desc: 'How your video or async consultation works and how to prepare.',
    icon: '💻',
  },
  {
    title: 'Your Prescription & Pharmacy',
    desc: 'How prescriptions are issued, fulfilled, and delivered through licensed pharmacies.',
    icon: '📦',
  },
  {
    title: 'Refills, Follow-Ups & Check-Ins',
    desc: 'How to manage ongoing care, request dosage adjustments, and message your provider.',
    icon: '🔄',
  },
  {
    title: 'HIPAA & Your Health Privacy',
    desc: 'Your rights as a patient and how MedRevolve protects your health information.',
    icon: '🔒',
  },
  {
    title: 'Understanding Medical Disclaimers',
    desc: 'What it means that MedRevolve is a services platform, not a pharmacy or prescriber.',
    icon: '⚖️',
  },
];

const RESOURCES = [
  { label: 'Privacy Policy', href: '/Privacy', icon: FileText },
  { label: 'HIPAA Notice', href: '/HIPAANotice', icon: FileText },
  { label: 'Telehealth Consent', href: '/TelehealthConsent', icon: FileText },
  { label: 'Medical Disclaimer', href: '/MedicalDisclaimer', icon: FileText },
  { label: 'Cookie Policy', href: '/CookiePolicy', icon: FileText },
  { label: 'Terms of Service', href: '/Terms', icon: FileText },
];

const FAQS = [
  {
    q: 'Does MedRevolve sell medications?',
    a: 'No. MedRevolve is a services company. We connect patients with independently licensed healthcare providers. If a prescription is appropriate, it is issued by a licensed physician and fulfilled by a licensed pharmacy — not by MedRevolve.',
  },
  {
    q: 'Are MedRevolve\'s providers licensed in my state?',
    a: 'Yes. All providers in our network are licensed to practice telemedicine in all 50 states. Your intake form helps us match you with the right licensed provider for your state.',
  },
  {
    q: 'What is a physician-supervised wellness program?',
    a: 'It means your treatment plan is designed and supervised by a licensed physician. The physician reviews your health history, determines if a treatment is medically appropriate, issues a prescription if warranted, and provides ongoing oversight of your care.',
  },
  {
    q: 'Do I need insurance?',
    a: 'No. MedRevolve operates on a direct-pay model. You pay for your consultation and care plan directly — no insurance billing. We can provide a superbill for potential out-of-network reimbursement.',
  },
  {
    q: 'What is the difference between a B2B partner and a patient?',
    a: 'Patients use MedRevolve to access physician-supervised wellness programs for their own health. B2B partners (clinics, wellness operators, entrepreneurs) work with MedRevolve to build their own branded telehealth business using our infrastructure.',
  },
  {
    q: 'Is MedRevolve a pharmacy?',
    a: 'No. MedRevolve is not a pharmacy and does not dispense medications. Prescriptions are routed to licensed 503A compounding pharmacies or licensed retail pharmacies that fulfill orders independently.',
  },
  {
    q: 'What is LegitScript certification?',
    a: 'LegitScript is an independent verification service that certifies online healthcare businesses as operating safely and legally. MedRevolve supports LegitScript certification for our B2B merchant partners as part of the onboarding process.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && <p className="pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function University() {
  const [activeTrack, setActiveTrack] = useState('launch');
  const track = OPERATOR_TRACKS.find(t => t.id === activeTrack);
  const TrackIcon = track.icon;

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#1F2D27] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GraduationCap className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-400 border border-green-400/30 rounded-full px-4 py-1.5 mb-5">
              MedRevolve University
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Education for Operators<br />
              <span className="text-white/35">and Patients</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
              Free resources for telehealth business operators, wellness entrepreneurs, and patients who want to understand how physician-supervised care works.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#operator">
                <Button className="bg-white text-[#1F2D27] hover:bg-white/90 rounded-sm px-8 font-bold">
                  <Building2 className="w-4 h-4 mr-2" /> Operator Education
                </Button>
              </a>
              <a href="#patient">
                <Button variant="ghost" className="text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-sm px-8">
                  <Users className="w-4 h-4 mr-2" /> Patient Education
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Operator Tracks */}
      <section id="operator" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">For Business Operators</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Operator Learning Tracks</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Structured learning for anyone building or running a telehealth or wellness business using MedRevolve infrastructure.
            </p>
          </div>

          {/* Track selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {OPERATOR_TRACKS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTrack(t.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                    activeTrack === t.id
                      ? 'text-white border-transparent'
                      : 'text-gray-600 border-gray-200 bg-white hover:border-gray-400'
                  }`}
                  style={{ background: activeTrack === t.id ? t.color : undefined }}>
                  <Icon className="w-4 h-4" /> {t.title}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTrack === t.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                    {t.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active track */}
          <motion.div key={activeTrack}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: track.color + '18' }}>
                <TrackIcon className="w-7 h-7" style={{ color: track.color }} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: track.color }}>{track.tag}</span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{track.title}</h3>
                <p className="text-sm text-gray-400">{track.subtitle}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{track.desc}</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {track.modules.map((mod, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: track.color }} />
                  <span className="text-sm text-gray-700">{mod}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/MerchantOnboarding">
                <Button className="rounded-sm font-bold text-white" style={{ backgroundColor: track.color }}>
                  Start Your Platform Setup <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/Contact">
                <Button variant="outline" className="rounded-sm border-gray-300 text-gray-700">
                  Talk to a Specialist
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Patient Education */}
      <section id="patient" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">For Patients</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Understanding Your Care</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Clear, honest information about how physician-supervised telehealth works and what to expect as a patient.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATIENT_TOPICS.map((topic, i) => (
              <motion.div key={topic.title} {...fade(i * 0.06)}
                className="border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-gray-200 transition-all">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{topic.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/CustomerIntake">
              <Button className="rounded-sm px-8 font-bold text-white" style={{ backgroundColor: '#A66B3C' }}>
                Start Your Free Intake <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Resource Library */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Resource Library</p>
            <h2 className="text-2xl font-black text-gray-900">Legal & Compliance Documents</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RESOURCES.map(({ label, href, icon: Icon }) => (
              <Link key={label} to={href}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                <Icon className="w-4 h-4 text-[#4A6741] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <ArrowRight className="w-3 h-3 text-gray-300 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Frequently Asked Questions</p>
            <h2 className="text-3xl font-black text-gray-900">Common Questions</h2>
          </div>
          <div className="bg-gray-50 rounded-2xl px-6 divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            Still have questions?{' '}
            <Link to="/Contact" className="text-[#4A6741] font-semibold underline">Contact our team</Link>
            {' '}— we respond within 1 business day.
          </p>
        </div>
      </section>

    </div>
  );
}