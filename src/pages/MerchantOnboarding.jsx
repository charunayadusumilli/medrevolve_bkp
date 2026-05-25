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
  Sparkles, Store, Users, Stethoscope, Pill, Megaphone, CheckCircle2,
  Phone, Mail, MapPin, Calendar, DollarSign, TrendingUp, Award,
  FileText, Briefcase, User, Building, Globe2, Smartphone,
  CheckCircle, XCircle, Clock, BarChart3, Layers, Target
} from 'lucide-react';

// ─── PRICING & CONFIG ──────────────────────────────────────────────────────────
const SETUP_FEE = 5000;
const PLATFORM_MONTHLY_BASE = 2500;

const STOREFRONT_TEMPLATES = [
  { id: 'wellness', label: 'Wellness Store', desc: 'Health products & services', color: '#1A2A1A', img: 'https://images.unsplash.com/photo-1557804506-669714d25d1d?w=400&q=80' },
  { id: 'clinic', label: 'Medical Clinic', desc: 'Telehealth + products', color: '#0F1F2A', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80' },
  { id: 'fitness', label: 'Fitness & Wellness', desc: 'Performance & health', color: '#1F1A0A', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { id: 'longevity', label: 'Longevity Clinic', desc: 'Age optimization', color: '#1A1A2A', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
];

const MODULE_OPTIONS = [
  { key: 'telehealth', label: 'Provider Consultations', desc: 'Patient video calls & prescriptions', price: 0, icon: Stethoscope, popular: true },
  { key: 'payments', label: 'Payment Processing', desc: 'Secure checkout & merchant account', price: 0, icon: CreditCard, popular: true },
  { key: 'inventory', label: 'Inventory & Orders', desc: 'Stock management & fulfillment', price: 0, icon: Package, popular: false },
  { key: 'marketing', label: 'Marketing Tools', desc: 'Email, ads, SEO, analytics', price: 0, icon: Megaphone, popular: true },
  { key: 'pharmacy', label: 'Pharmacy Integration', desc: 'Automated prescription routing', price: 0, icon: Pill, popular: false },
  { key: 'compliance', label: 'Compliance Tools', desc: 'Built-in legal framework', price: 0, icon: ShieldCheck, popular: false },
];

const JOURNEY_STEPS = [
  { id: 1, label: 'Account', group: 'setup' },
  { id: 2, label: 'Business', group: 'setup' },
  { id: 3, label: 'Legal', group: 'verify' },
  { id: 4, label: 'Products', group: 'configure' },
  { id: 5, label: 'Storefront', group: 'build' },
  { id: 6, label: 'Domain', group: 'build' },
  { id: 7, label: 'Features', group: 'configure' },
  { id: 8, label: 'Review', group: 'launch' },
];

const ACTIVATION_SEQUENCE = [
  { icon: Store, label: 'Creating your branded storefront' },
  { icon: Globe, label: 'Provisioning domain & SSL' },
  { icon: Package, label: 'Loading product catalog' },
  { icon: Users, label: 'Assigning onboarding team (x10)' },
  { icon: CreditCard, label: 'Setting up merchant account' },
  { icon: Stethoscope, label: 'Connecting provider network' },
  { icon: Pill, label: 'Linking pharmacy network' },
  { icon: Megaphone, label: 'Activating marketing stack' },
  { icon: ShieldCheck, label: 'Running compliance checks' },
  { icon: CheckCircle2, label: 'Platform live — team notified' },
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
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    // Step 1 - Account
    email: '', phone: '', password: '', confirmPassword: '',
    // Step 2 - Business
    businessName: '', businessType: '', website: '', 
    businessAddress: '', businessCity: '', businessState: '', businessZip: '',
    yearsInBusiness: '', employeeCount: '', estimatedMonthlyRevenue: '',
    // Step 3 - Legal
    hasLLC: null, llcName: '', ein: '', stateOfIncorporation: '', 
    ownerSSNLast4: '', wantLLCFormation: false,
    // Step 4 - Products
    productCategories: [], primaryFocus: '', competitors: '',
    // Step 5 - Storefront
    templateId: 'wellness', brandName: '', brandColors: '', logoUrl: '',
    // Step 6 - Domain
    domainChoice: 'subdomain', domainName: '',
    // Step 7 - Modules
    selectedModules: ['compliance', 'telehealth', 'payments'],
    // Step 8 - Payment
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

  const monthlyTotal = PLATFORM_MONTHLY_BASE + 250;

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          if (currentUser.email) {
            set('email', currentUser.email);
          }
        }
      } catch (err) {
        console.log('User not authenticated');
      }
    };
    checkUser();
  }, []);

  const runActivationSequence = async (pId) => {
    setActivating(true);
    for (let i = 0; i < ACTIVATION_SEQUENCE.length; i++) {
      setActivationStep(i);
      await new Promise(r => setTimeout(r, 900));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
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

      const partnerCode = form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
        + Math.random().toString(36).substr(2, 5);

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

      setPartnerId(partner.id);

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

      await base44.entities.BusinessInquiry.create({
        company_name: form.businessName,
        contact_name: form.contactName,
        email: form.email, email: form.email,
        phone: form.phone,
        industry: form.businessType || 'Other',
        interest_type: 'White Label',
        company_size: form.productCategories.join(', '),
        message: `Merchant onboarding. Partner: ${partner.id}. Domain: ${form.domainName}. Modules: ${form.selectedModules.join(', ')}. Monthly: $${monthlyTotal}. LLC: ${form.llcName || 'formation requested: ' + form.wantLLCFormation}. Template: ${form.templateId}.`,
        status: 'new',
      });

      const checkoutRes = await base44.functions.invoke('createCheckout', {
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
      } catch (emailErr) {
        console.warn('Welcome email skipped (user not yet registered in app):', emailErr?.message);
      }

      trackDigestEvent('merchant_onboarding', {
        business_name: form.businessName, contact_name: form.contactName,
        email: form.email, phone: form.phone, monthly_fee: monthlyTotal,
        llc_formation: form.wantLLCFormation, template: form.templateId,
      });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0f0a] to-[#080808] py-10 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=40)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#0a0f0a]/90 to-[#080808]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4A6741]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6B8F5E]/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-5 py-2 mb-5 text-[#6B8F5E] text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5" /> Launch Your Business in 7 Days
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Build Your Wellness Empire</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Complete white-label platform. Website, payments, providers, compliance, marketing — everything you need to launch and scale.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {JOURNEY_STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${step > s.id ? 'bg-[#4A6741] text-white scale-110' : step === s.id ? 'bg-white text-black scale-110 shadow-lg shadow-[#4A6741]/30' : 'bg-white/10 text-white/30'}`}>
                  {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-[9px] hidden sm:block text-center font-medium leading-tight
                  ${step === s.id ? 'text-[#6B8F5E]' : 'text-white/25'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-white/10 rounded-full">
            <div 
              className="absolute h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (JOURNEY_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}>
            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm">
              <CardContent className="p-10 space-y-8">

                {/* STEP 1: Account Creation */}
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                      <p className="text-white/50">Start your journey. This takes less than 3 minutes.</p>
                    </div>
                    <div className="grid gap-5">
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" /> Business Email *
                        </Label>
                        <Input 
                          type="email" 
                          value={form.email} 
                          onChange={e => set('email', e.target.value)}
                          placeholder="you@company.com" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" /> Phone Number *
                        </Label>
                        <Input 
                          value={form.phone} 
                          onChange={e => set('phone', e.target.value)}
                          placeholder="(555) 123-4567" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      {!user && (
                        <>
                          <div>
                            <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5" /> Password *
                            </Label>
                            <Input 
                              type="password" 
                              value={form.password} 
                              onChange={e => set('password', e.target.value)}
                              placeholder="••••••••" 
                              className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                            />
                          </div>
                          <div>
                            <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5" /> Confirm Password *
                            </Label>
                            <Input 
                              type="password" 
                              value={form.confirmPassword} 
                              onChange={e => set('confirmPassword', e.target.value)}
                              placeholder="••••••••" 
                              className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                            />
                          </div>
                        </>
                      )}
                      <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-lg p-4 text-sm text-white/70">
                        <ShieldCheck className="w-4 h-4 text-[#6B8F5E] inline mr-2" />
                        Your information is encrypted and secure. We never share your data.
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: Business Details */}
                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Business Information</h2>
                      <p className="text-white/50">Tell us about your company and goals.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                          <Building className="w-3.5 h-3.5" /> Business Name *
                        </Label>
                        <Input 
                          value={form.businessName} 
                          onChange={e => set('businessName', e.target.value)}
                          placeholder="Elite Wellness Solutions" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold">Business Type *</Label>
                        <Select value={form.businessType} onValueChange={v => set('businessType', v)}>
                          <SelectTrigger className="mt-2 bg-white/90 border-white/20 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Clinic">Clinic / Med Spa</SelectItem>
                            <SelectItem value="Gym">Gym / Fitness Studio</SelectItem>
                            <SelectItem value="Wellness Center">Wellness Center</SelectItem>
                            <SelectItem value="Online Retailer">Online Retailer</SelectItem>
                            <SelectItem value="Nutrition Practice">Nutrition Practice</SelectItem>
                            <SelectItem value="Telehealth">Telehealth Platform</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                          <Globe2 className="w-3.5 h-3.5" /> Website (if any)
                        </Label>
                        <Input 
                          value={form.website} 
                          onChange={e => set('website', e.target.value)}
                          placeholder="https://yoursite.com" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> Business Address
                        </Label>
                        <Input 
                          value={form.businessAddress} 
                          onChange={e => set('businessAddress', e.target.value)}
                          placeholder="123 Main Street" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      <div>
                        <Input 
                          value={form.businessCity} 
                          onChange={e => set('businessCity', e.target.value)}
                          placeholder="City" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input 
                          value={form.businessState} 
                          onChange={e => set('businessState', e.target.value)}
                          placeholder="State" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                        <Input 
                          value={form.businessZip} 
                          onChange={e => set('businessZip', e.target.value)}
                          placeholder="ZIP" 
                          className="mt-2 bg-white/90 border-white/20 text-gray-900 placeholder:text-gray-400 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" 
                        />
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold">Years in Business</Label>
                        <Select value={form.yearsInBusiness} onValueChange={v => set('yearsInBusiness', v)}>
                          <SelectTrigger className="mt-2 bg-white/90 border-white/20 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Just starting</SelectItem>
                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5+">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold">Team Size</Label>
                        <Select value={form.employeeCount} onValueChange={v => set('employeeCount', v)}>
                          <SelectTrigger className="mt-2 bg-white/90 border-white/20 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Just me</SelectItem>
                            <SelectItem value="2-5">2-5 employees</SelectItem>
                            <SelectItem value="5-10">5-10 employees</SelectItem>
                            <SelectItem value="10+">10+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5" /> Est. Monthly Revenue
                        </Label>
                        <Select value={form.estimatedMonthlyRevenue} onValueChange={v => set('estimatedMonthlyRevenue', v)}>
                          <SelectTrigger className="mt-2 bg-white/90 border-white/20 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-10k">$0 - $10k</SelectItem>
                            <SelectItem value="10k-50k">$10k - $50k</SelectItem>
                            <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                            <SelectItem value="100k+">$100k+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* More steps would continue here... */}
                {step > 2 && (
                  <div className="text-center py-12">
                    <p className="text-white/50">Continue building your platform...</p>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              variant="ghost" 
              onClick={() => setStep(s => s - 1)} 
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : <div />}

          {step < 8 ? (
            <Button 
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && (!form.email || !form.phone)) ||
                (step === 2 && (!form.businessName || !form.businessType))
              }
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:from-[#5a7751] hover:to-[#7b9f6e] text-white px-8 font-bold rounded-sm shadow-lg shadow-[#4A6741]/30"
            >
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:from-[#5a7751] hover:to-[#7b9f6e] text-white px-10 font-bold rounded-sm text-base shadow-lg shadow-[#4A6741]/30"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Launching...</> : <>Launch Now — ${SETUP_FEE}</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}