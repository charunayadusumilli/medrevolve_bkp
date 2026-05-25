import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2, User, FlaskConical, Droplets, ChevronDown, ChevronUp,
  Phone, ExternalLink, CheckCircle, DollarSign, Clock, Users,
  AlertTriangle, ArrowRight, Zap
} from 'lucide-react';

const SEGMENTS = [
  {
    id: 'b2b',
    icon: Building2,
    color: 'from-blue-600 to-blue-800',
    badge: 'B2B',
    badgeColor: 'bg-blue-500',
    title: 'White-Label Merchant Platform',
    subtitle: 'Launch your own telehealth or GLP-1 business',
    price: '$2,999/month',
    priceType: 'Recurring Subscription',
    paymentLink: '/MerchantOnboarding',
    targetAudience: ['Med spa owners', 'Wellness clinic owners', 'Fitness centers / gyms', 'Healthcare providers', 'Entrepreneurs', 'Pharmacies', 'Chiropractors / nutritionists'],
    products: [
      { name: 'Custom Branded Website', desc: 'Domain included or bring your own', included: true },
      { name: 'Payment Processing Setup', desc: 'Stripe-powered, fully configured', included: true },
      { name: 'Patient Portal + Booking', desc: 'Scheduling, intake, telehealth rooms', included: true },
      { name: 'Licensed Provider Network', desc: 'MDs, NPs, PAs — all 50 states', included: true },
      { name: 'Pharmacy Fulfillment', desc: 'Discreet shipping under your brand', included: true },
      { name: 'Marketing Automation Suite', desc: 'Social, email, CRM, AI content', included: true },
      { name: 'Compliance Management', desc: 'HIPAA, DEA, state medical boards', included: true },
      { name: 'HubSpot CRM Integration', desc: 'Lead tracking and pipeline', included: true },
      { name: 'Inventory Management', desc: 'Stock tracking and reorder automation', included: true },
      { name: '24/7 Partner Support', desc: 'Onboarding training + ongoing', included: true },
    ],
    intakeFields: [
      'Full name', 'Email', 'Phone', 'Business name', 'Business type',
      'Current revenue stage', 'Primary goal', 'Timeline', 'Has LLC?', 'Main challenge'
    ],
    objections: [
      { q: '"Too expensive"', a: 'Partners recoup $2,999 with just 7–10 patients/month. Traditional setup costs $50k+. You\'re live in 2 weeks.' },
      { q: '"Need to think about it"', a: 'What specific concern can I address? Can connect you with an existing partner or schedule a free demo.' },
      { q: '"Compliance worries"', a: 'Compliance is our core product — HIPAA, DEA, state boards, pharmacy regs. You focus on growth.' },
    ],
    callScript: 'Great! Our white-label platform lets you launch a complete telehealth business under your own brand. Everything included — website, payment processing, licensed providers, pharmacy network, and compliance management. The platform is $2,999/month and most partners launch within 2 weeks. Want to schedule a free demo or shall I send you the details?',
  },
  {
    id: 'b2c',
    icon: User,
    color: 'from-green-600 to-green-800',
    badge: 'B2C',
    badgeColor: 'bg-green-500',
    title: 'Patient / Consumer Health',
    subtitle: 'Telehealth consultations + prescription fulfillment',
    price: '$199 consultation / $399/mo plans',
    priceType: 'One-time + Subscription',
    paymentLink: '/BookAppointment',
    targetAudience: ['Adults 25–65 seeking weight loss', 'Men seeking TRT/ED treatment', 'Women seeking BHRT/menopause care', 'Biohackers & longevity enthusiasts', 'People without insurance or preferring privacy'],
    products: [
      { name: 'GLP-1 / Semaglutide Program', desc: '$399/mo — weekly injectable, provider oversight', included: true },
      { name: 'GLP-1 / Tirzepatide Program', desc: '$399/mo — weekly injectable, dosage adjustments', included: true },
      { name: 'Men\'s Health / TRT', desc: 'From $299/mo — testosterone, ED, hair loss', included: true },
      { name: 'Women\'s Health / BHRT', desc: 'From $349/mo — hormones, menopause, thyroid', included: true },
      { name: 'Longevity / Peptide Therapy', desc: '$399–$599/mo — BPC-157, NAD+, growth hormones', included: true },
      { name: 'Initial Consultation', desc: '$199 one-time — board-certified provider, video call', included: true },
      { name: 'Follow-up Appointments', desc: 'Included in all monthly plans', included: true },
      { name: 'Prescription Fulfillment', desc: 'Ships to door in 3–5 business days', included: true },
    ],
    intakeFields: [
      'Full name', 'Email', 'Phone', 'Date of birth', 'State of residence',
      'Primary health goal', 'Current medications', 'Medical history notes',
      'Tried GLP-1 before?', 'Insurance situation', 'Shipping address', 'Consultation preference'
    ],
    objections: [
      { q: '"Is this safe?"', a: 'All consultations with licensed, board-certified providers. All medications from certified US compounding pharmacies.' },
      { q: '"Will it work for me?"', a: 'GLP-1 patients typically see 15–20% body weight reduction over 3–6 months with adherence. Your provider guides your protocol.' },
      { q: '"Do I need insurance?"', a: 'No insurance needed. We\'re cash-pay. Many patients use HSA/FSA funds.' },
    ],
    callScript: 'We offer telehealth consultations with licensed providers for weight loss, men\'s health, women\'s health, and wellness programs. Our initial consultation is $199, and monthly plans start at $399 including medications and ongoing support. All consultations are virtual, medications shipped directly to you. Would you like to book a consultation?',
  },
  {
    id: 'ruo',
    icon: FlaskConical,
    color: 'from-purple-600 to-purple-800',
    badge: 'RUO',
    badgeColor: 'bg-purple-500',
    title: 'Research Use Only Products',
    subtitle: 'Pharmaceutical-grade research reagents & lab supplies',
    price: 'Contact for pricing',
    priceType: 'One-time / Wholesale',
    paymentLink: '/ResearchProducts',
    targetAudience: ['Medical researchers & scientists', 'University & private labs', 'Compounding pharmacies', 'Clinics (research departments)', 'Peptide researchers', 'Wellness coaches (research/education)'],
    products: [
      { name: '5mL Bacteriostatic Water Vials', desc: 'USP-grade, sterile, research use only', included: true },
      { name: '10mL Bacteriostatic Water Vials', desc: 'USP-grade, sterile, research use only', included: true },
      { name: '30mL Bacteriostatic Water Vials', desc: 'USP-grade, sterile, research use only', included: true },
      { name: 'Sterile Saline Solution', desc: '5mL, 10mL — USP-grade', included: true },
      { name: 'Bulk Wholesale Kits', desc: 'Custom orders, min 50 units, significant discounts', included: true },
    ],
    intakeFields: [
      'Full name', 'Email', 'Phone', 'Organization / company name',
      'Research purpose', 'Product interest', 'Quantity needed', 'Shipping address'
    ],
    objections: [
      { q: '"What is RUO?"', a: 'Research Use Only means the product is sold for laboratory/research purposes and not intended for human use. This is a regulatory designation.' },
      { q: '"Do you have bulk pricing?"', a: 'Yes — significant discounts at 50+ unit orders. Let me connect you with our sales team for a custom quote.' },
    ],
    callScript: 'We offer pharmaceutical-grade bacteriostatic water vials in 5mL, 10mL, and 30mL sizes, with bulk wholesale pricing available. All products are USP-grade and ship nationwide. These are sold for research purposes only. Are you looking for retail quantities or wholesale for your clinic or research facility?',
    disclaimer: '⚠️ RUO products are for research purposes only — not for human administration. Always state this clearly.',
  },
  {
    id: 'water',
    icon: Droplets,
    color: 'from-cyan-600 to-cyan-800',
    badge: 'WATER',
    badgeColor: 'bg-cyan-500',
    title: 'Sterile Vials — Retail & Wholesale',
    subtitle: 'Bacteriostatic water vials, direct-to-consumer and wholesale',
    price: 'See site for current rates',
    priceType: 'One-time / Wholesale',
    paymentLink: '/WaterHome',
    targetAudience: ['Retail buyers (individual)', 'Clinics and practices', 'Wholesale distributors', 'Researchers and labs', 'Repeat / subscription buyers'],
    products: [
      { name: '5mL BAC Water Vials', desc: 'Sterile, USP-grade, fast shipping', included: true },
      { name: '10mL BAC Water Vials', desc: 'Sterile, USP-grade, fast shipping', included: true },
      { name: '30mL BAC Water Vials', desc: 'Sterile, USP-grade, fast shipping', included: true },
      { name: 'Multi-pack Bundles', desc: '5-pack, 10-pack, 25-pack — volume savings', included: true },
      { name: 'Wholesale Pallets', desc: '100+ units, 30–50% below retail', included: true },
    ],
    intakeFields: [
      'Full name', 'Email', 'Phone', 'Product and quantity',
      'Shipping address', 'Retail or wholesale?', 'Repeat customer?'
    ],
    objections: [
      { q: '"Do you have wholesale pricing?"', a: 'Yes — 30–50% below retail for qualifying orders of 100+ units. Let me get your contact details for a custom quote.' },
      { q: '"How fast do you ship?"', a: 'Standard 2–5 business days nationwide. Express options available.' },
    ],
    callScript: 'We carry sterile bacteriostatic water vials in 5mL, 10mL, and 30mL sizes with fast nationwide shipping. We also offer bulk wholesale pricing for larger orders. Are you looking for a retail order or wholesale quantities?',
  },
];

const STRIPE_TABLE = [
  { service: 'B2B Merchant Platform', price: '$2,999/month', type: 'Subscription', link: '/MerchantOnboarding' },
  { service: 'B2C Initial Consultation', price: '$199', type: 'One-time', link: '/BookAppointment' },
  { service: 'B2C GLP-1 Monthly Plan', price: '$399/month', type: 'Subscription', link: '/Checkout' },
  { service: 'RUO Products (retail)', price: 'Varies', type: 'One-time', link: '/ResearchProducts' },
  { service: 'Water Vials (retail)', price: 'Varies', type: 'One-time', link: '/WaterHome' },
  { service: 'Bulk / Wholesale', price: 'Custom', type: 'Contact', link: null },
];

function SegmentCard({ segment }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = segment.icon;

  return (
    <Card className="border border-white/10 bg-[#111] overflow-hidden">
      <div className={`bg-gradient-to-r ${segment.color} p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`${segment.badgeColor} text-white text-xs font-bold px-2`}>{segment.badge}</Badge>
              </div>
              <h3 className="text-white font-bold text-lg leading-tight">{segment.title}</h3>
              <p className="text-white/70 text-sm">{segment.subtitle}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-white font-bold text-base">{segment.price}</div>
            <div className="text-white/60 text-xs">{segment.priceType}</div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Call Script */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Call Script</span>
          </div>
          <p className="text-white/80 text-sm italic">"{segment.callScript}"</p>
        </div>

        {segment.disclaimer && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-xs">{segment.disclaimer}</p>
          </div>
        )}

        {/* Products */}
        <div>
          <h4 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Products & Services</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {segment.products.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-medium">{p.name}</div>
                  <div className="text-white/45 text-xs">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-white/50 hover:text-white/80 text-sm py-2 border-t border-white/10 transition-colors"
        >
          <span>Intake Fields, Target Audience & Objection Handling</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="space-y-4 pt-2">
            {/* Target Audience */}
            <div>
              <h4 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Target Audience</h4>
              <div className="flex flex-wrap gap-1.5">
                {segment.targetAudience.map((t, i) => (
                  <span key={i} className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>

            {/* Intake Fields */}
            <div>
              <h4 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5" /> Required Intake Fields</h4>
              <div className="flex flex-wrap gap-1.5">
                {segment.intakeFields.map((f, i) => (
                  <span key={i} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">{f}</span>
                ))}
              </div>
            </div>

            {/* Objections */}
            <div>
              <h4 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Objection Handling</h4>
              <div className="space-y-2">
                {segment.objections.map((o, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3">
                    <div className="text-yellow-400 text-xs font-bold mb-1">{o.q}</div>
                    <div className="text-white/70 text-xs">→ {o.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Link */}
            <a href={segment.paymentLink} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors w-fit">
              <DollarSign className="w-4 h-4 text-green-400" />
              Go to Payment / Booking Page
              <ExternalLink className="w-3.5 h-3.5 text-white/50" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProductsAndServices() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-black text-[11px]">MR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Products & Services</h1>
              <p className="text-white/50 text-sm">IONOS Training Reference — Sales & Customer Support</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs font-medium">All payments via Stripe</span>
            </div>
            <a href="tel:+12403875224" className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-white/70 text-xs hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              240-387-5224
            </a>
            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-medium">4 Customer Segments</span>
            </div>
          </div>
        </div>

        {/* Quick Routing Guide */}
        <Card className="bg-[#111] border-white/10 mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" />
              Call Routing — Opening Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 text-sm italic mb-4">
              "Thank you for calling MedRevolve! Are you: a business owner wanting to launch your own telehealth platform, a patient looking for weight loss or health treatments, calling about research products or water vials, or something else?"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'B2B / Business Owner', color: 'border-blue-500/40 text-blue-300', route: '→ B2B Script' },
                { label: 'Patient / Health Goals', color: 'border-green-500/40 text-green-300', route: '→ B2C Script' },
                { label: 'Research / RUO', color: 'border-purple-500/40 text-purple-300', route: '→ RUO Script' },
                { label: 'Water / Vials', color: 'border-cyan-500/40 text-cyan-300', route: '→ Water Script' },
              ].map((r, i) => (
                <div key={i} className={`border rounded-lg p-3 text-center ${r.color}`}>
                  <div className="text-xs font-medium mb-1">{r.label}</div>
                  <div className="text-xs opacity-70">{r.route}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Segments */}
        <div className="space-y-6 mb-8">
          {SEGMENTS.map(seg => <SegmentCard key={seg.id} segment={seg} />)}
        </div>

        {/* Stripe Pricing Table */}
        <Card className="bg-[#111] border-white/10 mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              Stripe Payment Links — Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/40 text-xs font-bold py-2 pr-4">Service</th>
                    <th className="text-left text-white/40 text-xs font-bold py-2 pr-4">Price</th>
                    <th className="text-left text-white/40 text-xs font-bold py-2 pr-4">Type</th>
                    <th className="text-left text-white/40 text-xs font-bold py-2">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {STRIPE_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/3">
                      <td className="text-white py-2.5 pr-4">{row.service}</td>
                      <td className="text-green-400 font-bold py-2.5 pr-4">{row.price}</td>
                      <td className="py-2.5 pr-4">
                        <Badge className={row.type === 'Subscription' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : row.type === 'Contact' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}>
                          {row.type}
                        </Badge>
                      </td>
                      <td className="py-2.5">
                        {row.link ? (
                          <a href={row.link} className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors">
                            medrevolve.com{row.link} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-white/40 text-xs">Call 240-387-5224</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Reminders */}
        <Card className="bg-red-950/30 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Compliance — Never / Always
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-red-400 font-bold text-xs mb-2">🚫 NEVER</h4>
                <ul className="space-y-1 text-white/60 text-xs">
                  <li>• Guarantee specific medical outcomes</li>
                  <li>• Prescribe or recommend specific medications</li>
                  <li>• Share patient information with anyone</li>
                  <li>• Quote prices you're unsure of — say "let our team confirm"</li>
                  <li>• Dismiss or minimize a health concern</li>
                  <li>• Tell RUO/water buyers it's for human use</li>
                </ul>
              </div>
              <div>
                <h4 className="text-green-400 font-bold text-xs mb-2">✅ ALWAYS</h4>
                <ul className="space-y-1 text-white/60 text-xs">
                  <li>• Say consultations are with licensed, board-certified providers</li>
                  <li>• Mention results vary by individual</li>
                  <li>• State RUO products are for research purposes only</li>
                  <li>• Maintain HIPAA compliance in all communications</li>
                  <li>• Capture full intake info before ending any call</li>
                  <li>• End every call with a clear next step for the customer</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}