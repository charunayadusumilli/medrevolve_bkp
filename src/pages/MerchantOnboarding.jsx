import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { trackDigestEvent } from '@/lib/digestTracker';
import {
  Check, ArrowRight, ArrowLeft, Loader2, Building2, Globe,
  ShieldCheck, Package, CreditCard, Zap, Lock, Star, AlertCircle,
  Sparkles, Store, Users, Stethoscope, Pill, Megaphone, CheckCircle2
} from 'lucide-react';

// ─── CONFIG ────────────────────────────────────────────────────────────────────

const SETUP_FEE = 5000;          // one-time: website, integrations, merchant account, analytics
const PLATFORM_MONTHLY_BASE = 2500; // monthly base for marketing & scaling + support
const STOREFRONT_TEMPLATES = [
  { id: 'peptide_pro', label: 'Peptide Pro', niche: 'Peptides & Research', color: '#1A2A1A', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  { id: 'glp_clinic',  label: 'GLP-1 Clinic', niche: 'Weight Management', color: '#0F1F2A', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80' },
  { id: 'longevity',   label: 'Longevity Labs', niche: 'Anti-Aging / Hormones', color: '#1F1A0A', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 'wellness_co', label: 'Wellness Co.', niche: 'Holistic Wellness', color: '#1A1A2A', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' },
];

const MODULE_OPTIONS = [
  { key: 'telehealth',    label: 'Telehealth Platform',     desc: 'Patient consultations & Rx',               price: 0, icon: Stethoscope, popular: true  },
  { key: 'pharmacy',      label: 'Pharmacy Integration',    desc: 'Direct pharmacy routing & fulfillment',    price: 0,  icon: Pill,         popular: false },
  { key: 'compliance',    label: 'Compliance / PEPMD',      desc: 'Automated compliance monitoring',          price: 0,  icon: ShieldCheck,  popular: true  },
  { key: 'inventory',     label: 'Inventory Management',    desc: 'Track stock, alerts, auto-reorders',       price: 0,  icon: Package,      popular: false },
  { key: 'marketing',     label: 'Marketing & Scaling',     desc: 'SEO, paid ads, analytics, drip sequences', price: 0,  icon: Megaphone,    popular: false },
  { key: 'card_processing', label: 'Merchant Card Processing', desc: 'High-risk card processing included',   price: 0,   icon: CreditCard,   popular: true  },
  { key: 'lms',           label: 'Peptide University',      desc: 'Staff training & certifications',          price: 0,  icon: Star,         popular: false },
  { key: 'website_builder', label: 'Website Builder',       desc: '25 themes + 5 checkout themes + hosting',  price: 0,  icon: Globe,        popular: false },
];

const JOURNEY_STEPS = [
  { id: 1,  label: 'Business Info',    group: 'intake'    },
  { id: 2,  label: 'Legal & LLC',      group: 'intake'    },
  { id: 3,  label: 'Storefront',       group: 'build'     },
  { id: 4,  label: 'Domain',           group: 'build'     },
  { id: 5,  label: 'Modules',          group: 'build'     },
  { id: 6,  label: 'Payment & Launch', group: 'activate'  },
];

const ACTIVATION_SEQUENCE = [
  { icon: Store,        label: 'Creating your branded storefront'   },
  { icon: Globe,        label: 'Provisioning domain & SSL'          },
  { icon: Package,      label: 'Loading product catalog'            },
  { icon: Users,        label: 'Assigning onboarding team (x10)'    },
  { icon: CreditCard,   label: 'Setting up merchant account'        },
  { icon: Stethoscope,  label: 'Connecting provider network'        },
  { icon: Pill,         label: 'Linking pharmacy network'           },
  { icon: Megaphone,    label: 'Activating marketing stack'         },
  { icon: ShieldCheck,  label: 'Running compliance checks'          },
  { icon: CheckCircle2, label: 'Platform live — team notified'      },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activationStep, setActivationStep] = useState(0);
  const [error, setError] = useState('');
  const [partnerId, setPartnerId] = useState(null);

  const [form, setForm] = useState({
    // Step 1 — Business
    businessName: '', businessType: '', contactName: '', email: '', phone: '', website: '',
    // Step 2 — Legal / LLC
    hasLLC: null,          // true | false | null (not answered)
    llcName: '', ein: '', stateOfIncorporation: '', ownerSSNLast4: '',
    wantLLCFormation: false,
    productCategories: [],
    // Step 3 — Storefront
    templateId: 'peptide_pro',
    brandName: '',
    // Step 4 — Domain
    domainChoice: 'subdomain', domainName: '',
    // Step 5 — Modules
    selectedModules: ['compliance', 'telehealth'],
    // Step 6 — Payment
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleModule = (key) =>
    setForm(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(key)
        ? prev.selectedModules.filter(m => m !== key)
        : [...prev.selectedModules, key],
    }));

  const toggleCategory = (cat) =>
    setForm(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(cat)
        ? prev.productCategories.filter(c => c !== cat)
        : [...prev.productCategories, cat],
    }));

  const monthlyTotal = PLATFORM_MONTHLY_BASE + 250; // Base + 5% revenue share (estimated ~$250/mo starting)

  const totalToday = SETUP_FEE;

  // ── Activation sequence (simulated while backend processes) ──
  const runActivationSequence = async (pId) => {
    setActivating(true);
    for (let i = 0; i < ACTIVATION_SEQUENCE.length; i++) {
      setActivationStep(i);
      await new Promise(r => setTimeout(r, 900));
    }
  };

  // ── Final submit ──
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    console.log('Starting merchant onboarding submission...', form);
    try {
      // Validate required fields
      if (!form.businessName || !form.email || !form.contactName || !form.phone) {
        throw new Error('Please fill in all required business information');
      }
      if (form.hasLLC === null) {
        throw new Error('Please select whether you have an LLC');
      }
      if (form.hasLLC === true && (!form.llcName || !form.ein || !form.stateOfIncorporation)) {
        throw new Error('Please fill in all LLC information');
      }
      if (!form.domainName) {
        throw new Error('Please provide a domain name');
      }

      console.log('Validation passed, generating partner code...');
      const partnerCode = form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
        + Math.random().toString(36).substr(2, 5);

      console.log('Creating Partner record...');
      const partner = await base44.entities.Partner.create({
        business_name: form.businessName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        business_type: form.businessType,
        partner_code: partnerCode,
        subscription_status: 'trial',
        status: 'pending',
        enabled_products: form.productCategories,
        pricing_markup_percentage: 30,
        monthly_fee: monthlyTotal,
      });

      console.log('✅ Partner created:', partner.id);
      setPartnerId(partner.id);

      // Domain record
      console.log('Creating MerchantDomain record...');
      if (form.domainName) {
        await base44.entities.MerchantDomain.create({
          merchant_id: partner.id,
          merchant_name: form.businessName,
          domain: form.domainName,
          domain_type: form.domainChoice === 'new' ? 'new_purchase' : form.domainChoice === 'existing' ? 'existing' : 'subdomain',
          registrar: form.domainChoice === 'subdomain' ? 'medrevolve_subdomain' : 'godaddy',
          status: 'pending_dns',
        });
      }

      console.log('✅ Domain record created');

      // Module records
      console.log('Creating MerchantModule records...', form.selectedModules);
      for (const key of form.selectedModules) {
        const mod = MODULE_OPTIONS.find(m => m.key === key);
        await base44.entities.MerchantModule.create({
          merchant_id: partner.id,
          merchant_name: form.businessName,
          module_key: key,
          is_active: false,
          status: 'trial',
          monthly_fee: mod?.price || 0,
        });
      }

      console.log('✅ Module records created');

      // BusinessInquiry capture
      console.log('Creating BusinessInquiry record...');
      await base44.entities.BusinessInquiry.create({
        company_name: form.businessName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        industry: form.businessType || 'Other',
        interest_type: 'White Label',
        company_size: form.productCategories.join(', '),
        message: `Merchant onboarding. Partner: ${partner.id}. Domain: ${form.domainName}. Modules: ${form.selectedModules.join(', ')}. Monthly: $${monthlyTotal}. LLC: ${form.llcName || 'formation requested: ' + form.wantLLCFormation}. Template: ${form.templateId}.`,
        status: 'new',
      });

      console.log('✅ BusinessInquiry created');

      // ── Stripe Checkout for $5,000 setup fee ──
      console.log('Creating Stripe checkout for $5,000 setup fee...');
      const checkoutRes = await base44.functions.invoke('merchantSetupCheckout', {
        businessName: form.businessName,
        contactName: form.contactName,
        email: form.email,
        partnerCode,
        successUrl: `${window.location.origin}/MerchantDashboard?setup=success&partner=${partner.id}`,
        cancelUrl: `${window.location.origin}/MerchantOnboarding?canceled=1`,
      });

      if (!checkoutRes?.data?.url) {
        throw new Error('Failed to create payment session. Please try again.');
      }

      console.log('✅ Stripe checkout created, redirecting...');

      // Admin notification
      console.log('Sending admin notification email...');
      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve Platform',
        to: 'rned@medrevolve.com',
        subject: `🚀 New Merchant — ${form.businessName} | $${SETUP_FEE} setup + $${PLATFORM_MONTHLY_BASE}–$3,000/mo + 5% revenue`,
        body: `
<h2>New Merchant Onboarding</h2>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
  <tr><td style="padding:8px;color:#666;width:180px;"><b>Business</b></td><td style="padding:8px;">${form.businessName}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Contact</b></td><td style="padding:8px;">${form.contactName} · ${form.email} · ${form.phone}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>LLC Status</b></td><td style="padding:8px;">${form.hasLLC ? 'Has LLC: ' + form.llcName : 'No LLC'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>EIN</b></td><td style="padding:8px;">${form.ein || 'N/A'}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>State of Inc.</b></td><td style="padding:8px;">${form.stateOfIncorporation || 'N/A'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Storefront Template</b></td><td style="padding:8px;">${form.templateId} / Brand: ${form.brandName || form.businessName}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Domain</b></td><td style="padding:8px;">${form.domainName}${form.domainChoice === 'subdomain' ? '.medrevolve.co' : ''} (${form.domainChoice})</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Products</b></td><td style="padding:8px;">${form.productCategories.join(', ') || 'All'}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Modules</b></td><td style="padding:8px;">${form.selectedModules.join(', ')}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Monthly Cost</b></td><td style="padding:8px;font-weight:bold;color:#2d7a2d;">$${PLATFORM_MONTHLY_BASE}–$3,000 + 5% of revenue</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Charged Today</b></td><td style="padding:8px;font-weight:bold;color:#c00;">$${SETUP_FEE} (setup fee)</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Partner Code</b></td><td style="padding:8px;font-family:monospace;">${partnerCode}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Submitted</b></td><td style="padding:8px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td></tr>
</table>
<p style="color:#888;font-size:12px;margin-top:16px;">ACTION NEEDED: Assign 10-person onboarding team and provision storefront.</p>
        `.trim(),
      });

      console.log('✅ Admin email sent');

      // Merchant welcome email — best effort (may fail if user not yet registered)
      try {
        await base44.integrations.Core.SendEmail({
          from_name: 'MedRevolve',
          to: form.email,
          subject: `Your MedRevolve platform is LIVE — you're launched!`,
          body: `
<h2>You're Live, ${form.contactName}! 🚀</h2>
<p>Your <strong>${form.businessName}</strong> platform is launching right now — instantly. Here's what's been activated:</p>
<h3>What's live for you:</h3>
<ul>
  <li>✅ White-label storefront (${STOREFRONT_TEMPLATES.find(t => t.id === form.templateId)?.label} template)</li>
  <li>✅ Domain provisioning: ${form.domainName}${form.domainChoice === 'subdomain' ? '.medrevolve.co' : ''}</li>
  <li>✅ Pre-loaded product catalog (peptides, GLP-1s, wellness)</li>
  ${form.wantLLCFormation ? '<li>✅ LLC formation in progress — you\'ll receive documents within 3–5 business days</li>' : ''}
  <li>✅ Merchant card processing setup</li>
  <li>✅ Provider & pharmacy network access</li>
  <li>✅ A dedicated 10-person onboarding team assigned to your account</li>
</ul>
<h3>Your investment:</h3>
<p>Setup fee: <strong>$5,000</strong> (just paid). Monthly: <strong>$2,500–$3,000 + 5% revenue share</strong> starting after your first 30 days.</p>
<p><a href="https://app.medrevolve.com/MerchantDashboard">Access your dashboard →</a></p>
<p>Your onboarding manager will contact you within 24 hours.<br/>— The MedRevolve Team</p>
          `.trim(),
        });
        console.log('✅ Welcome email sent');
      } catch (emailErr) {
        // Non-fatal — admin email already sent, onboarding still completes
        console.warn('Welcome email skipped (user not yet registered in app):', emailErr?.message);
      }

      trackDigestEvent('merchant_onboarding', {
        business_name: form.businessName, contact_name: form.contactName,
        email: form.email, phone: form.phone, monthly_fee: monthlyTotal,
        llc_formation: form.wantLLCFormation, template: form.templateId,
      });

      console.log('✅ Tracking event logged');

      // Redirect to Stripe Checkout
      console.log('Redirecting to Stripe Checkout...');
      window.location.href = checkoutRes.data.url;
    } catch (e) {
      const errorMessage = e.message || 'Unknown error occurred';
      console.error('Merchant onboarding error:', e);
      setError(`Setup failed: ${errorMessage}. Please contact support if this persists.`);
      setActivating(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Activation overlay ──────────────────────────────────────────────────────
  if (activating) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#4A6741] rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Launching Your Platform</h2>
          <p className="text-white/40 text-sm mb-10">Sit tight — we're setting everything up automatically.</p>
          <div className="space-y-3">
            {ACTIVATION_SEQUENCE.map((s, i) => {
              const Icon = s.icon;
              const done = i < activationStep;
              const active = i === activationStep;
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500
                  ${active ? 'bg-[#4A6741]/20 border border-[#4A6741]/50' : done ? 'opacity-50' : 'opacity-20'}`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#6B8F5E]' : done ? 'text-white/40' : 'text-white/20'}`} />
                  <span className={`text-sm text-left ${active ? 'text-white font-medium' : 'text-white/50'}`}>{s.label}</span>
                  {done && <Check className="w-4 h-4 text-[#6B8F5E] ml-auto" />}
                  {active && <Loader2 className="w-4 h-4 text-[#6B8F5E] ml-auto animate-spin" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Main wizard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] py-10 px-4 relative">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=40)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 to-[#080808]" />
      <div className="relative max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-4 text-white/50 text-xs tracking-widest uppercase">
           <Zap className="w-3.5 h-3.5 text-[#6B8F5E]" /> $5K Setup + $2–3K/mo + 5% Revenue
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Launch Your White-Label Telehealth Business</h1>
          <p className="text-white/40 text-sm">Complete platform with website, integrations, merchant account, analytics & support. Live in days.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-white/10" />
          {JOURNEY_STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1.5 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step > s.id ? 'bg-[#4A6741] text-white' : step === s.id ? 'bg-white text-black' : 'bg-white/10 text-white/30'}`}>
                {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
              </div>
              <span className={`text-[10px] hidden sm:block text-center max-w-[64px] leading-tight
                ${step === s.id ? 'text-white font-medium' : 'text-white/25'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}>
            <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-8 space-y-6">

                {/* ── STEP 1: Business Info ── */}
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold">Business Information</h2>
                      <p className="text-white/40 text-sm mt-1">Tell us about your business. Setup: $5,000 one-time. Monthly: $2,500–$3,000 + 5% of your revenue.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label className="text-white/60 text-xs uppercase tracking-widest">Business Name *</Label>
                        <Input value={form.businessName} onChange={e => set('businessName', e.target.value)}
                          placeholder="Elite Peptide Solutions" className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-widest">Business Type *</Label>
                        <Select value={form.businessType} onValueChange={v => set('businessType', v)}>
                          <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]"><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Clinic">Clinic / Med Spa</SelectItem>
                            <SelectItem value="Gym">Gym / Fitness Studio</SelectItem>
                            <SelectItem value="Wellness Center">Wellness Center</SelectItem>
                            <SelectItem value="Online Retailer">Online Retailer</SelectItem>
                            <SelectItem value="Nutrition Practice">Nutrition Practice</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-widest">Website (if any)</Label>
                        <Input 
                          value={form.website} 
                          onChange={e => set('website', e.target.value)}
                          className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]"
                          placeholder="https://yoursite.com" />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-widest">Your Full Name *</Label>
                        <Input value={form.contactName} onChange={e => set('contactName', e.target.value)}
                          placeholder="John Doe" className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-widest">Phone *</Label>
                        <Input value={form.phone} onChange={e => set('phone', e.target.value)}
                          placeholder="(555) 123-4567" className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-white/60 text-xs uppercase tracking-widest">Business Email *</Label>
                        <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                          placeholder="owner@business.com" className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 2: Legal / LLC ── */}
                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold">Legal Entity & Compliance</h2>
                      <p className="text-white/40 text-sm mt-1">Required to open merchant accounts and process payments legally.</p>
                    </div>

                    {/* Do they have an LLC? */}
                     {form.hasLLC === null && (
                       <div className="space-y-3">
                         <p className="text-white/70 text-sm font-medium">Do you already have an LLC or legal business entity?</p>
                         <div className="grid grid-cols-2 gap-3">
                           {[
                             { val: true,  label: 'Yes, I have an LLC',      sub: 'I have my EIN and state registration' },
                             { val: false, label: "No, I don't have one yet", sub: 'You can add one later via dashboard'    },
                           ].map(opt => (
                             <button key={String(opt.val)} type="button" onClick={() => set('hasLLC', opt.val)}
                               className="flex flex-col gap-1 p-4 rounded-xl border border-white/20 bg-white/5 hover:border-[#4A6741] hover:bg-[#4A6741]/10 text-left transition-all">
                               <span className="text-white font-semibold text-sm">{opt.label}</span>
                               <span className="text-white/40 text-xs">{opt.sub}</span>
                             </button>
                           ))}
                         </div>
                       </div>
                     )}

                    {/* Has LLC → collect info */}
                    {form.hasLLC === true && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label className="text-white/60 text-xs uppercase tracking-widest">LLC / Entity Name *</Label>
                          <Input value={form.llcName} onChange={e => set('llcName', e.target.value)}
                            placeholder="Elite Peptide Solutions LLC" className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                        </div>
                        <div>
                          <Label className="text-white/60 text-xs uppercase tracking-widest">EIN (Tax ID) *</Label>
                          <Input value={form.ein} onChange={e => set('ein', e.target.value)}
                            placeholder="XX-XXXXXXX" className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                        </div>
                        <div>
                          <Label className="text-white/60 text-xs uppercase tracking-widest">State of Incorporation *</Label>
                          <Select value={form.stateOfIncorporation} onValueChange={v => set('stateOfIncorporation', v)}>
                            <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]"><SelectValue placeholder="Select state" /></SelectTrigger>
                            <SelectContent>
                              {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-1.5">
                            Owner SSN Last 4 <Lock className="w-3 h-3 text-white/30" />
                          </Label>
                          <Input value={form.ownerSSNLast4} onChange={e => set('ownerSSNLast4', e.target.value.slice(0,4))}
                            placeholder="XXXX" maxLength={4} className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                          <p className="text-xs text-white/30 mt-1">Encrypted · KYC only</p>
                        </div>
                        <div className="sm:col-span-2">
                          <button type="button" onClick={() => set('hasLLC', null)}
                            className="text-xs text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors">
                            ← Change answer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* No LLC → skip or add later */}
                     {form.hasLLC === false && (
                       <div className="space-y-4">
                         <div className="bg-white/8 rounded-xl border border-white/10 p-4">
                           <p className="text-white/70 text-sm">No problem! You can add an LLC later from your merchant dashboard, or we can help set one up. For now, let's continue with your platform setup.</p>
                         </div>
                         <button type="button" onClick={() => set('hasLLC', null)}
                           className="text-xs text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors">
                           ← Change answer
                         </button>
                       </div>
                     )}

                    {/* Product categories — shown once LLC Q is answered */}
                    {form.hasLLC !== null && (
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-widest mb-3 block">Products You'll Sell</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['GLP-1 (Semaglutide/Tirzepatide)', 'Peptides (RUO)', 'Hormones', "Men's Health", "Women's Health", 'Longevity / Anti-Aging', 'Weight Loss', 'Hair & Skin'].map(cat => (
                            <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all
                                ${form.productCategories.includes(cat) ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'bg-white/5 border-white/15 text-white/50 hover:border-white/30'}`}>
                              {form.productCategories.includes(cat) && <Check className="w-3 h-3 inline mr-1" />}
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── STEP 3: Storefront Template ── */}
                {step === 3 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold">Choose Your Storefront</h2>
                      <p className="text-white/40 text-sm mt-1">We'll pre-load it with products matching your niche. Fully customizable after launch.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {STOREFRONT_TEMPLATES.map(t => (
                        <button key={t.id} type="button" onClick={() => set('templateId', t.id)}
                          className={`relative rounded-xl overflow-hidden border text-left transition-all
                            ${form.templateId === t.id ? 'border-[#4A6741] ring-1 ring-[#4A6741]' : 'border-white/15 hover:border-white/30'}`}>
                          <img src={t.img} alt={t.label} className="w-full h-24 object-cover opacity-60" />
                          <div className="p-3" style={{ background: t.color }}>
                            <p className="text-white font-semibold text-sm">{t.label}</p>
                            <p className="text-white/40 text-xs mt-0.5">{t.niche}</p>
                          </div>
                          {form.templateId === t.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#4A6741] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-widest">Brand Display Name</Label>
                      <Input value={form.brandName} onChange={e => set('brandName', e.target.value)}
                        placeholder={form.businessName || 'Your Brand Name'}
                        className="mt-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]" />
                      <p className="text-white/30 text-xs mt-1">This appears on your storefront. Default: your business name.</p>
                    </div>
                    <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-lg p-4 text-sm text-white/60">
                      <Sparkles className="w-4 h-4 text-[#6B8F5E] inline mr-2" />
                      Your storefront will be pre-loaded with 10–15 curated products from our catalog, a checkout flow, and a telehealth booking widget — ready to sell day one.
                    </div>
                  </>
                )}

                {/* ── STEP 4: Domain ── */}
                {step === 4 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold">Your Domain</h2>
                      <p className="text-white/40 text-sm mt-1">Where customers will find your store.</p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { value: 'subdomain', label: 'MedRevolve Subdomain', desc: 'yourname.medrevolve.co — free, live in minutes', icon: Zap },
                        { value: 'new',       label: 'Purchase a New Domain', desc: 'We register & configure it for you (~$15/yr)',    icon: Globe },
                        { value: 'existing',  label: 'Use Existing Domain',   desc: 'Point your current domain via DNS update',        icon: ArrowRight },
                      ].map(opt => (
                        <button key={opt.value} type="button" onClick={() => set('domainChoice', opt.value)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                            ${form.domainChoice === opt.value ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
                          <opt.icon className="w-5 h-5 text-[#6B8F5E] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{opt.label}</p>
                            <p className="text-white/40 text-xs">{opt.desc}</p>
                          </div>
                          {form.domainChoice === opt.value && <Check className="w-4 h-4 text-[#6B8F5E]" />}
                        </button>
                      ))}
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-widest">
                        {form.domainChoice === 'subdomain' ? 'Your Subdomain *' : form.domainChoice === 'new' ? 'Domain to Purchase *' : 'Your Domain *'}
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={form.domainName} onChange={e => set('domainName', e.target.value)}
                          placeholder={form.domainChoice === 'subdomain' ? 'yourname' : 'yoursite.com'}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741] flex-1" />
                        {form.domainChoice === 'subdomain' && (
                          <span className="text-white/40 text-sm whitespace-nowrap">.medrevolve.co</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 5: Modules ── */}
                {step === 5 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold">Platform Modules</h2>
                      <p className="text-white/40 text-sm mt-1">Select the services you need. Add or remove anytime.</p>
                    </div>
                    <div className="grid gap-2">
                      {MODULE_OPTIONS.map(mod => (
                        <button key={mod.key} type="button" onClick={() => toggleModule(mod.key)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all w-full
                            ${form.selectedModules.includes(mod.key) ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                            ${form.selectedModules.includes(mod.key) ? 'bg-[#4A6741]' : 'bg-white/10'}`}>
                            <mod.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium text-sm">{mod.label}</p>
                              {mod.popular && <Badge className="bg-[#4A6741]/40 text-green-300 border-[#4A6741] text-[10px]">Popular</Badge>}
                            </div>
                            <p className="text-white/40 text-xs">{mod.desc}</p>
                          </div>
                          <p className="text-white font-bold text-sm flex-shrink-0">{mod.price === 0 ? 'Custom' : `$${mod.price}/mo`}</p>
                          {form.selectedModules.includes(mod.key) && <Check className="w-4 h-4 text-[#6B8F5E] flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                    <div className="bg-white/8 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Base + {form.selectedModules.length} module{form.selectedModules.length !== 1 ? 's' : ''}</p>
                        <p className="text-white/30 text-xs">7-day free trial, then billed monthly</p>
                      </div>
                      <p className="text-2xl font-bold text-white">${monthlyTotal}<span className="text-sm text-white/40 font-normal">/mo</span></p>
                    </div>
                  </>
                )}

                {/* ── STEP 6: Payment & Launch ── */}
                {step === 6 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold">Activate Your Platform</h2>
                      <p className="text-white/40 text-sm mt-1">Review your order and confirm to launch.</p>
                    </div>

                    {/* Order summary */}
                     <div className="bg-white/8 rounded-xl p-4 space-y-3">
                       <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Order Summary</p>
                       <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
                           <span className="text-white/60">Platform Setup Fee</span>
                           <span className="text-white font-medium">${SETUP_FEE}</span>
                         </div>
                         <div className="flex justify-between text-white/40 text-xs">
                           <span>Website · Integrations · Merchant Account · Analytics & Reporting</span>
                         </div>
                         <div className="flex justify-between border-t border-white/10 pt-2 mt-1">
                           <span className="text-white/60">Monthly Support & Scaling</span>
                           <span className="text-white font-medium">${PLATFORM_MONTHLY_BASE}–$3,000</span>
                         </div>
                         <div className="flex justify-between text-white/40 text-xs">
                           <span>Marketing, support, 24/7 ops</span>
                         </div>
                         <div className="flex justify-between text-white/40 text-xs">
                           <span>Plus 5% of your revenue (after first 30 days)</span>
                         </div>
                         <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
                           <span className="text-white">Due Today (Setup)</span>
                           <span className="text-white">${SETUP_FEE}</span>
                         </div>
                       </div>
                     </div>

                    {/* Stripe Checkout notice */}
                     <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-lg p-4 flex items-start gap-3">
                       <Lock className="w-4 h-4 text-[#6B8F5E] flex-shrink-0 mt-0.5" />
                       <div>
                         <p className="text-white/80 text-sm font-medium">Secure Payment via Stripe</p>
                         <p className="text-white/40 text-xs mt-0.5">Clicking "Pay $5,000 & Launch" will redirect you to Stripe's secure checkout page to complete your payment. Your card details are never stored on our servers.</p>
                       </div>
                     </div>

                    {/* What's included */}
                     <div className="space-y-2">
                       <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Your Launch Includes</p>
                       {[
                         `${STOREFRONT_TEMPLATES.find(t=>t.id===form.templateId)?.label} white-label storefront`,
                         `${form.domainName}${form.domainChoice==='subdomain'?'.medrevolve.co':''} domain & SSL provisioned`,
                         '10–15 pre-loaded products (your selected categories)',
                         'Merchant card processing setup',
                         'Provider & pharmacy network access',
                         'HIPAA-compliant infrastructure',
                         'Analytics & reporting dashboard',
                         'Dedicated onboarding & support team',
                         'Marketing & compliance toolkit',
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-2.5 text-sm text-white/60">
                           <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F5E] flex-shrink-0" /> {item}
                         </div>
                       ))}
                     </div>

                    {error && (
                      <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm flex gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                      </div>
                    )}
                  </>
                )}

                {/* ── Navigation ── */}
                <div className="flex justify-between pt-4 border-t border-white/10">
                  {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-white/40 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                    </Button>
                  ) : <div />}

                  {step < 6 ? (
                    <Button onClick={() => setStep(s => s + 1)}
                      disabled={
                        (step === 1 && (!form.businessName || !form.email || !form.contactName || !form.phone)) ||
                        (step === 2 && form.hasLLC === null)
                      }
                      className="bg-white text-black hover:bg-white/90 px-6 font-bold rounded-sm">
                      Continue <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={loading}
                     className="bg-white text-black hover:bg-white/90 px-8 font-bold rounded-sm text-base">
                     {loading
                       ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                       : <><Zap className="w-4 h-4 mr-2" /> Pay $${SETUP_FEE} & Launch</>
                     }
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}