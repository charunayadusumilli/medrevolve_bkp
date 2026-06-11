import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Globe, CreditCard, Stethoscope, Pill, ShieldCheck,
  Megaphone, Building2, BarChart3, ArrowRight, CheckCircle
} from 'lucide-react';

const MODULES = [
  {
    key: 'storefront',
    icon: Globe,
    color: '#2D6A9F',
    light: '#E8F2FB',
    title: 'Website & Storefront',
    subtitle: 'Your branded telehealth platform, live in 7 days',
    desc: 'A fully white-labeled, HIPAA-compliant telehealth storefront under your domain and brand — optimized for conversion, compliance, and mobile.',
    features: [
      'Custom domain (yourname.com) provisioned',
      'Program pages — no drug/product names',
      'HIPAA-compliant patient intake forms',
      'Patient portal with appointment booking',
      'SEO-ready site architecture',
      'Mobile-first responsive design',
    ],
  },
  {
    key: 'payments',
    icon: CreditCard,
    color: '#4A6741',
    light: '#EEF5EB',
    title: 'Payments & Merchant Account',
    subtitle: 'High-risk merchant processing built in',
    desc: 'We provision and manage your high-risk merchant account, Stripe integration, and full payment infrastructure so you can accept patients on day one.',
    features: [
      'High-risk merchant account setup',
      'Stripe Checkout embedded on your site',
      'Subscription billing for recurring plans',
      'Refund & dispute management workflows',
      'PCI-DSS Level 1 compliant processing',
      'Revenue analytics dashboard',
    ],
  },
  {
    key: 'providers',
    icon: Stethoscope,
    color: '#7B5EA7',
    light: '#F3EEF9',
    title: 'Provider Network',
    subtitle: 'Board-certified physicians across all 50 states',
    desc: 'Access our credentialed, licensed provider network or integrate your own. We handle contracting, scheduling, EMR, e-prescribing, and clinical workflows.',
    features: [
      'Board-certified MD/NP/PA network',
      'Licensed in all 50 states',
      'E-prescribing & EMR integration',
      'Google Calendar scheduling',
      'Telehealth video call infrastructure',
      'Provider compliance monitoring',
    ],
  },
  {
    key: 'pharmacy',
    icon: Pill,
    color: '#B85C38',
    light: '#FAEEE8',
    title: 'Pharmacy Network',
    subtitle: 'NABP-verified 503A compounding pharmacies',
    desc: 'Your platform routes prescriptions automatically to our network of licensed, NABP-verified compounding pharmacies — fully tracked and audit-ready.',
    features: [
      'NABP-verified 503A pharmacy partners',
      'Automated prescription routing',
      'Real-time order tracking',
      'Patient shipping notifications',
      'Formulary management',
      'Pharmacy compliance documentation',
    ],
  },
  {
    key: 'compliance',
    icon: ShieldCheck,
    color: '#0B6B63',
    light: '#E6F4F3',
    title: 'Compliance & Legal',
    subtitle: 'HIPAA, LegitScript, and state-by-state coverage',
    desc: 'Built-in compliance infrastructure: BAAs, telehealth consent forms, state prescribing rules, automated audit trails, and LegitScript certification support.',
    features: [
      'HIPAA BAA executed with all vendors',
      'Telehealth consent & disclosure library',
      'State-by-state prescribing rule monitoring',
      'Automated compliance audit runs',
      'LegitScript certification process',
      'Regulatory change notifications',
    ],
  },
  {
    key: 'marketing',
    icon: Megaphone,
    color: '#C4822A',
    light: '#FDF3E7',
    title: 'Marketing & CRM',
    subtitle: 'Acquisition, retention, and automation stack',
    desc: 'We build and activate your full marketing stack — email drips, SMS automations, Google/Meta ad structure, creator affiliates, and HubSpot CRM.',
    features: [
      'HubSpot CRM integration & syncing',
      'Email drip sequences (welcome, follow-up)',
      'Twilio SMS automations',
      'Google & Meta ad account structure',
      'Creator/affiliate referral system',
      'Analytics tracking every lead source',
    ],
  },
  {
    key: 'llc',
    icon: Building2,
    color: '#5A6B5A',
    light: '#EFF4EF',
    title: 'Business Formation',
    subtitle: 'LLC, EIN, banking, and brand identity',
    desc: 'We handle the full legal and financial foundation your telehealth business needs — entity formation, business banking, domain, and brand identity.',
    features: [
      'LLC formation or verification',
      'EIN registration assistance',
      'Business banking setup (Brex or Stripe)',
      'Domain secured in your name',
      'Brand identity & logo',
      'Placeholder site live within 48 hrs',
    ],
  },
  {
    key: 'analytics',
    icon: BarChart3,
    color: '#2D6A9F',
    light: '#E8F2FB',
    title: 'Analytics & Reporting',
    subtitle: 'Real-time business intelligence dashboard',
    desc: 'Track every dollar, patient, and conversion in real time. Connected to HubSpot, Stripe, and your telehealth platform for a full business overview.',
    features: [
      'Real-time revenue dashboard',
      'Patient acquisition & LTV tracking',
      'Conversion funnel analytics',
      'Provider utilization reports',
      'Marketing ROI by channel',
      'Monthly operator review reports',
    ],
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay },
});

export default function Services() {
  const [active, setActive] = useState(null);

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative bg-[#0A0A0A] py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=30)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 to-[#0A0A0A]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#A8C99B] border border-[#A8C99B]/20 rounded-full px-4 py-1.5 mb-5">
            Platform Modules
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Everything Your Telehealth<br />
            <span className="text-[#A8C99B]">Business Needs to Operate</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto mb-8">
            Eight fully managed infrastructure modules. Pick what you need or take the complete stack — all white-labeled under your brand.
          </p>
          <Link to="/MerchantOnboarding">
            <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 font-black text-base h-auto py-4">
              Book a Free Demo <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Module Grid */}
      <section className="py-20 px-6 bg-[#F7F4ED]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              The Full Platform Stack
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Click any module to see what's included. Every module is fully managed — we build it, run it, and maintain it for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULES.map((mod, i) => {
              const Icon = mod.icon;
              const isActive = active === mod.key;
              return (
                <motion.button key={mod.key} {...fade(i * 0.05)}
                  onClick={() => setActive(isActive ? null : mod.key)}
                  className={`text-left rounded-2xl border p-6 transition-all ${
                    isActive
                      ? 'shadow-lg border-transparent'
                      : 'bg-white border-gray-100 hover:shadow-md hover:border-gray-200'
                  }`}
                  style={isActive ? { backgroundColor: mod.light, borderColor: mod.color + '40' } : {}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: isActive ? mod.color : mod.light }}>
                    <Icon className="w-5 h-5" style={{ color: isActive ? 'white' : mod.color }} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">{mod.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{mod.subtitle}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Expanded detail */}
          {active && (() => {
            const mod = MODULES.find(m => m.key === active);
            const Icon = mod.icon;
            return (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 rounded-2xl border p-8 grid md:grid-cols-2 gap-8 items-start"
                style={{ backgroundColor: mod.light, borderColor: mod.color + '30' }}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: mod.color }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{mod.title}</h3>
                      <p className="text-sm font-medium" style={{ color: mod.color }}>{mod.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{mod.desc}</p>
                  <Link to="/MerchantOnboarding">
                    <Button className="rounded-sm font-bold text-white text-sm px-6"
                      style={{ backgroundColor: mod.color }}>
                      Get This Module <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">What's Included</p>
                  <ul className="space-y-2.5">
                    {mod.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#0A0A0A] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Build Your Platform?</h2>
          <p className="text-white/40 mb-8">Talk to a specialist and get a custom build plan for your telehealth business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/MerchantOnboarding">
              <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 font-black">
                Book a Demo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="tel:+12403875224">
              <Button variant="ghost" className="text-white border border-white/15 rounded-sm px-8 font-bold hover:bg-white/5">
                Call 240-387-5224
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}