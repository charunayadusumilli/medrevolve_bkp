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
  ShieldCheck, Package, CreditCard, Zap, Lock, Star, AlertCircle
} from 'lucide-react';

const MODULE_OPTIONS = [
  { key: 'inventory', label: 'Inventory Management', description: 'Track stock, alerts, reorders', price: 49, icon: Package, popular: false },
  { key: 'compliance', label: 'Compliance / PEPMD', description: 'Automated compliance monitoring', price: 99, icon: ShieldCheck, popular: true },
  { key: 'telehealth', label: 'Telehealth Integration', description: 'Patient consultations & Rx', price: 149, icon: Zap, popular: true },
  { key: 'pharmacy', label: 'Pharmacy Integration', description: 'Direct pharmacy routing & fulfillment', price: 79, icon: Package, popular: false },
  { key: 'website_builder', label: 'Website Builder', description: '25 themes + 5 checkout themes', price: 59, icon: Globe, popular: false },
  { key: 'marketing', label: 'Marketing Module', description: 'SEO, ads, analytics', price: 69, icon: Star, popular: false },
  { key: 'card_processing', label: 'Card Processing', description: 'Card Group Intl merchant accounts', price: 0, icon: CreditCard, popular: true, comingSoon: false },
  { key: 'lms', label: 'Peptide University', description: 'Team training & certifications', price: 39, icon: Star, popular: false },
];

const STEPS = [
  { id: 1, label: 'Business Info' },
  { id: 2, label: 'Legal & Compliance' },
  { id: 3, label: 'Domain Setup' },
  { id: 4, label: 'Select Modules' },
  { id: 5, label: 'Launch' },
];

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    // Step 1 — Business
    businessName: '', businessType: '', contactName: '', email: '', phone: '',
    website: '',
    // Step 2 — Legal
    llcName: '', ein: '', stateOfIncorporation: '', ownerSSNLast4: '',
    productCategories: [],
    // Step 3 — Domain
    domainChoice: 'new', domainName: '', useSubdomain: false,
    // Step 4 — Modules
    selectedModules: ['compliance'],
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleModule = (key) => {
    setForm(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(key)
        ? prev.selectedModules.filter(m => m !== key)
        : [...prev.selectedModules, key]
    }));
  };

  const toggleCategory = (cat) => {
    setForm(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(cat)
        ? prev.productCategories.filter(c => c !== cat)
        : [...prev.productCategories, cat]
    }));
  };

  const monthlyTotal = MODULE_OPTIONS
    .filter(m => form.selectedModules.includes(m.key))
    .reduce((sum, m) => sum + m.price, 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
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
        monthly_fee: monthlyTotal + 99,
      });

      // Create domain record
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

      // Create module records
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

      // Also save as BusinessInquiry for admin capture
      await base44.entities.BusinessInquiry.create({
        company_name: form.businessName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        industry: form.businessType || 'Other',
        interest_type: 'White Label',
        company_size: form.productCategories.join(', '),
        message: `Merchant onboarding submitted. Partner ID: ${partner.id}. Domain: ${form.domainName || 'none'}. Modules: ${form.selectedModules.join(', ')}. Monthly: $${monthlyTotal + 99}. LLC: ${form.llcName}. EIN: ${form.ein}. State: ${form.stateOfIncorporation}.`,
        status: 'new',
      });

      // Send notification email to rned@medrevolve.com
      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve Platform',
        to: 'rned@medrevolve.com',
        subject: `🚀 New Merchant Application — ${form.businessName}`,
        body: `
<h2>New Merchant Onboarding Submitted</h2>

<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
  <tr><td style="padding:8px;color:#666;width:160px;"><b>Business Name</b></td><td style="padding:8px;">${form.businessName}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Business Type</b></td><td style="padding:8px;">${form.businessType}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Contact Name</b></td><td style="padding:8px;">${form.contactName}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Email</b></td><td style="padding:8px;">${form.email}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Phone</b></td><td style="padding:8px;">${form.phone || 'Not provided'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Website</b></td><td style="padding:8px;">${form.website || 'Not provided'}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>LLC / Entity</b></td><td style="padding:8px;">${form.llcName || 'Not provided'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>EIN</b></td><td style="padding:8px;">${form.ein || 'Not provided'}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>State of Inc.</b></td><td style="padding:8px;">${form.stateOfIncorporation || 'Not provided'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Domain</b></td><td style="padding:8px;">${form.domainName ? form.domainName + (form.domainChoice === 'subdomain' ? '.medrevolve.co' : '') : 'Not set'} (${form.domainChoice})</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Product Categories</b></td><td style="padding:8px;">${form.productCategories.join(', ') || 'None selected'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Modules Selected</b></td><td style="padding:8px;">${form.selectedModules.join(', ')}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Monthly Revenue</b></td><td style="padding:8px;font-weight:bold;color:#2d7a2d;">$${monthlyTotal + 99}/month</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Partner Code</b></td><td style="padding:8px;font-family:monospace;">${partnerCode}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Partner ID</b></td><td style="padding:8px;font-family:monospace;font-size:12px;">${partner.id}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Submitted At</b></td><td style="padding:8px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td></tr>
</table>

<br/>
<p style="color:#888;font-size:12px;">This is an automated notification from MedRevolve Platform. Log in to the Admin Dashboard to review and activate this merchant.</p>
        `.trim(),
      });

      // Also send confirmation email to the merchant
      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve',
        to: form.email,
        subject: `Welcome to MedRevolve — Your Platform is Being Set Up`,
        body: `
<h2>Welcome to MedRevolve, ${form.contactName}!</h2>

<p>Your merchant platform application for <strong>${form.businessName}</strong> has been received and is being reviewed by our team.</p>

<h3>What happens next:</h3>
<ol>
  <li><strong>Review (24–48 hours)</strong> — Our team will review your application and verify your information.</li>
  <li><strong>Account Activation</strong> — You'll receive an email once your account is activated.</li>
  <li><strong>Onboarding Call</strong> — A dedicated onboarding manager will schedule a kickoff call with you.</li>
</ol>

<h3>Your Application Summary:</h3>
<ul>
  <li>Business: ${form.businessName}</li>
  <li>Modules: ${form.selectedModules.join(', ')}</li>
  <li>Monthly Plan: $${monthlyTotal + 99}/month (7-day free trial)</li>
  <li>Domain: ${form.domainName || 'Not configured yet'}</li>
</ul>

<p>In the meantime, you can log in to your <a href="https://app.medrevolve.com/MerchantDashboard">Merchant Dashboard</a> to explore the platform.</p>

<p>Questions? Reply to this email or contact us at <a href="mailto:rned@medrevolve.com">rned@medrevolve.com</a></p>

<p>— The MedRevolve Team</p>
        `.trim(),
      });

      trackDigestEvent('merchant_onboarding', { business_name: form.businessName, contact_name: form.contactName, email: form.email, phone: form.phone, monthly_fee: monthlyTotal + 99, business_type: form.businessType });
      navigate(createPageUrl('MerchantDashboard'));
    } catch (e) {
      setError('Setup failed. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1A0F] via-[#1A2A1A] to-[#2D3A2D] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4 text-white/70 text-sm">
            <Zap className="w-3.5 h-3.5 text-[#6B8F5E]" /> Merchant Platform Setup
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Launch Your Business</h1>
          <p className="text-white/60">Complete setup in under 5 minutes</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 -z-0" />
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step > s.id ? 'bg-[#4A6741] text-white' : step === s.id ? 'bg-white text-[#2D3A2D]' : 'bg-white/20 text-white/40'}`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-xs hidden sm:block ${step === s.id ? 'text-white font-medium' : 'text-white/40'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
              <CardContent className="p-8 space-y-6">

                {/* STEP 1: Business Info */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-bold">Business Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label className="text-white/70">Business Name *</Label>
                        <Input value={form.businessName} onChange={e => set('businessName', e.target.value)}
                          placeholder="Elite Peptide Solutions LLC" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70">Business Type *</Label>
                        <Select value={form.businessType} onValueChange={v => set('businessType', v)}>
                          <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Clinic">Clinic / Med Spa</SelectItem>
                            <SelectItem value="Gym">Gym / Fitness Studio</SelectItem>
                            <SelectItem value="Wellness Center">Wellness Center</SelectItem>
                            <SelectItem value="Pharmacy">Compounding Pharmacy</SelectItem>
                            <SelectItem value="Online Retailer">Online Retailer</SelectItem>
                            <SelectItem value="Nutrition Practice">Nutrition Practice</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white/70">Website (if existing)</Label>
                        <Input value={form.website} onChange={e => set('website', e.target.value)}
                          placeholder="https://yoursite.com" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70">Your Full Name *</Label>
                        <Input value={form.contactName} onChange={e => set('contactName', e.target.value)}
                          placeholder="John Doe" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70">Phone *</Label>
                        <Input value={form.phone} onChange={e => set('phone', e.target.value)}
                          placeholder="(555) 123-4567" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-white/70">Business Email *</Label>
                        <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                          placeholder="owner@business.com" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: Legal & Compliance */}
                {step === 2 && (
                  <>
                    <h2 className="text-2xl font-bold">Legal & Compliance</h2>
                    <p className="text-white/60 text-sm">Required for merchant account processing and regulatory compliance.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label className="text-white/70">LLC / Entity Name *</Label>
                        <Input value={form.llcName} onChange={e => set('llcName', e.target.value)}
                          placeholder="Elite Peptide Solutions LLC" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70">EIN (Tax ID) *</Label>
                        <Input value={form.ein} onChange={e => set('ein', e.target.value)}
                          placeholder="XX-XXXXXXX" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70">State of Incorporation *</Label>
                        <Select value={form.stateOfIncorporation} onValueChange={v => set('stateOfIncorporation', v)}>
                          <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white/70 flex items-center gap-2">
                          Owner SSN (Last 4) *
                          <Lock className="w-3 h-3 text-white/40" />
                        </Label>
                        <Input value={form.ownerSSNLast4} onChange={e => set('ownerSSNLast4', e.target.value.slice(0,4))}
                          placeholder="XXXX" maxLength={4} className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                        <p className="text-xs text-white/40 mt-1">Encrypted & used for KYC only</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Product Categories You'll Sell *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['GLP-1 (Semaglutide/Tirzepatide)', 'Peptides (RUO)', 'Hormones', "Men's Health", "Women's Health", 'Longevity/Anti-Aging', 'Weight Loss', 'Hair & Skin'].map(cat => (
                          <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left
                              ${form.productCategories.includes(cat)
                                ? 'bg-[#4A6741] border-[#4A6741] text-white'
                                : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'}`}>
                            {form.productCategories.includes(cat) && <Check className="w-3 h-3 inline mr-1" />}
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-200 flex gap-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>All data is encrypted and used solely for regulatory compliance and merchant account processing. We never sell or share your information.</p>
                    </div>
                  </>
                )}

                {/* STEP 3: Domain Setup */}
                {step === 3 && (
                  <>
                    <h2 className="text-2xl font-bold">Domain Setup</h2>
                    <p className="text-white/60 text-sm">Choose how you want to set up your storefront domain.</p>
                    <div className="grid gap-3">
                      {[
                        { value: 'new', label: 'Purchase a New Domain', desc: 'We buy & configure it automatically via GoDaddy/Namecheap', icon: Globe },
                        { value: 'existing', label: 'Use My Existing Domain', desc: 'Point your current domain to our platform (DNS update)', icon: ArrowRight },
                        { value: 'subdomain', label: 'Use a MedRevolve Subdomain', desc: 'e.g. yourname.medrevolve.co — fastest setup, free', icon: Zap },
                      ].map(opt => (
                        <button key={opt.value} type="button" onClick={() => set('domainChoice', opt.value)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                            ${form.domainChoice === opt.value
                              ? 'bg-[#4A6741]/30 border-[#4A6741]'
                              : 'bg-white/5 border-white/20 hover:border-white/40'}`}>
                          <opt.icon className="w-6 h-6 text-[#6B8F5E] flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-white">{opt.label}</p>
                            <p className="text-xs text-white/50">{opt.desc}</p>
                          </div>
                          {form.domainChoice === opt.value && <Check className="w-5 h-5 text-[#6B8F5E] ml-auto" />}
                        </button>
                      ))}
                    </div>
                    <div>
                      <Label className="text-white/70">
                        {form.domainChoice === 'new' ? 'Domain Name to Purchase *' :
                         form.domainChoice === 'existing' ? 'Your Existing Domain *' :
                         'Subdomain Name *'}
                      </Label>
                      <div className="flex items-center mt-1 gap-2">
                        <Input value={form.domainName} onChange={e => set('domainName', e.target.value)}
                          placeholder={form.domainChoice === 'subdomain' ? 'yourname' : 'yoursite.com'}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 flex-1" />
                        {form.domainChoice === 'subdomain' && (
                          <span className="text-white/50 text-sm whitespace-nowrap">.medrevolve.co</span>
                        )}
                      </div>
                      {form.domainChoice === 'new' && (
                        <p className="text-xs text-white/40 mt-1">Domain cost: ~$12–18/year, auto-provisioned in minutes</p>
                      )}
                    </div>
                  </>
                )}

                {/* STEP 4: Select Modules */}
                {step === 4 && (
                  <>
                    <h2 className="text-2xl font-bold">Select Your Modules</h2>
                    <p className="text-white/60 text-sm">Start with what you need. Add more anytime from your dashboard.</p>
                    <div className="grid gap-3">
                      {MODULE_OPTIONS.map(mod => (
                        <button key={mod.key} type="button" onClick={() => toggleModule(mod.key)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all w-full
                            ${form.selectedModules.includes(mod.key)
                              ? 'bg-[#4A6741]/30 border-[#4A6741]'
                              : 'bg-white/5 border-white/20 hover:border-white/40'}`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${form.selectedModules.includes(mod.key) ? 'bg-[#4A6741]' : 'bg-white/10'}`}>
                            <mod.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white">{mod.label}</p>
                              {mod.popular && <Badge className="bg-[#4A6741]/50 text-green-300 text-xs border-[#4A6741]">Popular</Badge>}
                            </div>
                            <p className="text-xs text-white/50">{mod.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-white">{mod.price === 0 ? 'Custom' : `$${mod.price}/mo`}</p>
                          </div>
                          {form.selectedModules.includes(mod.key) && (
                            <Check className="w-5 h-5 text-[#6B8F5E] flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Platform base fee</p>
                        <p className="text-sm text-white/60">{form.selectedModules.length} module{form.selectedModules.length !== 1 ? 's' : ''} selected</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">${monthlyTotal + 99}<span className="text-sm text-white/40">/mo</span></p>
                        <p className="text-xs text-white/40">7-day free trial</p>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 5: Review & Launch */}
                {step === 5 && (
                  <>
                    <h2 className="text-2xl font-bold">Ready to Launch 🚀</h2>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-4 space-y-2">
                        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Business Summary</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-white/50">Business</span><span className="text-white font-medium">{form.businessName}</span>
                          <span className="text-white/50">Contact</span><span className="text-white">{form.contactName}</span>
                          <span className="text-white/50">Email</span><span className="text-white">{form.email}</span>
                          <span className="text-white/50">LLC</span><span className="text-white">{form.llcName || 'Not provided'}</span>
                          <span className="text-white/50">Domain</span><span className="text-white">{form.domainName || 'Not set'}{form.domainChoice === 'subdomain' ? '.medrevolve.co' : ''}</span>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Modules Selected</p>
                        <div className="flex flex-wrap gap-2">
                          {form.selectedModules.map(key => {
                            const mod = MODULE_OPTIONS.find(m => m.key === key);
                            return <Badge key={key} className="bg-[#4A6741]/50 text-green-200 border-[#4A6741]">{mod?.label}</Badge>;
                          })}
                        </div>
                        <p className="text-white font-bold mt-3">${monthlyTotal + 99}/month <span className="text-white/40 text-sm font-normal">after 7-day trial</span></p>
                      </div>
                    </div>
                    {error && (
                      <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-300 text-sm flex gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                      </div>
                    )}
                  </>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-white/60 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                  ) : <div />}
                  {step < 5 ? (
                    <Button onClick={() => setStep(s => s + 1)}
                      disabled={step === 1 && (!form.businessName || !form.email || !form.contactName)}
                      className="bg-[#4A6741] hover:bg-[#3D5636] text-white px-8">
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={loading}
                      className="bg-white text-[#2D3A2D] hover:bg-white/90 px-8 font-bold text-base">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Setting up...</> : <>Launch My Platform <Zap className="ml-2 w-4 h-4" /></>}
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