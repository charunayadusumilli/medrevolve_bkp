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
  CheckCircle, XCircle, Clock, BarChart3, Layers, Target, Heart,
  Activity, ShoppingBag, Truck, Headphones
} from 'lucide-react';

const SETUP_FEE = 5000;
const PLATFORM_MONTHLY_BASE = 2500;

const STOREFRONT_TEMPLATES = [
  { id: 'wellness', label: 'Wellness Store', desc: 'Health products & services', color: '#1A2A1A', img: 'https://images.unsplash.com/photo-1557804506-669714d25d1d?w=400&q=80' },
  { id: 'clinic', label: 'Medical Clinic', desc: 'Telehealth + products', color: '#0F1F2A', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80' },
  { id: 'fitness', label: 'Fitness Studio', desc: 'Performance & supplements', color: '#1F1A0A', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { id: 'longevity', label: 'Longevity Clinic', desc: 'Age optimization', color: '#1A1A2A', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
];

const MODULE_OPTIONS = [
  { key: 'telehealth', label: 'Telehealth', desc: 'Video consultations', price: 0, icon: Stethoscope, popular: true },
  { key: 'payments', label: 'Payments', desc: 'Card processing', price: 0, icon: CreditCard, popular: true },
  { key: 'inventory', label: 'Inventory', desc: 'Stock management', price: 0, icon: Package, popular: false },
  { key: 'marketing', label: 'Marketing', desc: 'Ads & automation', price: 0, icon: Megaphone, popular: true },
  { key: 'pharmacy', label: 'Pharmacy', desc: 'Rx routing', price: 0, icon: Pill, popular: false },
  { key: 'compliance', label: 'Compliance', desc: 'Legal framework', price: 0, icon: ShieldCheck, popular: false },
];

const PRODUCT_CATEGORIES = [
  { id: 'weight_loss', label: 'Weight Loss', icon: Activity },
  { id: 'hormones', label: 'Hormones', icon: Heart },
  { id: 'longevity', label: 'Longevity', icon: Clock },
  { id: 'mens_health', label: "Men's Health", icon: User },
  { id: 'womens_health', label: "Women's Health", icon: User },
  { id: 'supplements', label: 'Supplements', icon: ShoppingBag },
];

const JOURNEY_STEPS = [
  { id: 1, label: 'You' },
  { id: 2, label: 'Business' },
  { id: 3, label: 'Legal' },
  { id: 4, label: 'Products' },
  { id: 5, label: 'Brand' },
  { id: 6, label: 'Domain' },
  { id: 7, label: 'Features' },
  { id: 8, label: 'Review' },
];

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [partnerId, setPartnerId] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    // Step 1 - You (Personal Info)
    firstName: '', lastName: '', email: '', phone: '',
    // Step 2 - Business
    businessName: '', businessType: '', website: '',
    businessAddress: '', businessCity: '', businessState: '', businessZip: '',
    // Step 3 - Legal
    hasLLC: null, llcName: '', ein: '', stateOfIncorporation: '',
    // Step 4 - Products
    productCategories: [], primaryFocus: '',
    // Step 5 - Brand
    templateId: 'wellness', brandName: '',
    // Step 6 - Domain
    domainChoice: 'subdomain', domainName: '',
    // Step 7 - Modules
    selectedModules: ['telehealth', 'payments', 'compliance'],
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          if (currentUser.email) set('email', currentUser.email);
          if (currentUser.full_name) {
            const names = currentUser.full_name.split(' ');
            if (names[0]) set('firstName', names[0]);
            if (names[1]) set('lastName', names.slice(1).join(' '));
          }
        }
      } catch (err) { console.log('Not authenticated'); }
    };
    checkUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const contactName = `${form.firstName} ${form.lastName}`.trim();
      const partnerCode = form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) + Math.random().toString(36).substr(2, 5);

      const partner = await base44.entities.Partner.create({
        business_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
        business_type: form.businessType,
        partner_code: partnerCode,
        subscription_status: 'trial',
        status: 'pending',
        enabled_products: form.productCategories,
        monthly_fee: PLATFORM_MONTHLY_BASE,
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
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
        industry: form.businessType || 'Other',
        interest_type: 'White Label',
        company_size: form.productCategories.join(', '),
        message: `Partner: ${partner.id}. Domain: ${form.domainName}. Modules: ${form.selectedModules.join(', ')}. Template: ${form.templateId}. LLC: ${form.hasLLC ? form.llcName : 'No'}`,
        status: 'new',
      });

      const checkoutRes = await base44.functions.invoke('createCheckout', {
        businessName: form.businessName,
        contactName: contactName,
        email: form.email,
        partnerCode,
        successUrl: `${window.location.origin}/MerchantDashboard?setup=success&partner=${partner.id}`,
        cancelUrl: `${window.location.origin}/MerchantOnboarding?canceled=1`,
      });

      if (!checkoutRes?.data?.url) throw new Error('Payment failed');

      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve',
        to: 'rned@medrevolve.com',
        subject: `🚀 New Merchant: ${form.businessName}`,
        body: `<h2>${contactName}</h2><p>${form.email} | ${form.phone}</p><p>Business: ${form.businessName}</p><p>Domain: ${form.domainName}</p><p>Products: ${form.productCategories.join(', ')}</p>`,
      });

      trackDigestEvent('merchant_onboarding', {
        business_name: form.businessName, contact_name: contactName,
        email: form.email, phone: form.phone,
      });

      window.location.href = checkoutRes.data.url;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return form.firstName && form.lastName && form.email && form.phone;
    if (step === 2) return form.businessName && form.businessType;
    if (step === 3) return form.hasLLC === null || (form.hasLLC ? (form.llcName && form.ein) : true);
    if (step === 4) return form.productCategories.length > 0;
    if (step === 5) return form.templateId;
    if (step === 6) return form.domainName;
    if (step === 7) return form.selectedModules.length > 0;
    if (step === 8) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0f0a] to-[#080808] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-4 py-1.5 mb-4 text-[#6B8F5E] text-xs font-bold uppercase">
            <Zap className="w-3 h-3" /> 5-Minute Setup
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Launch Your Wellness Business</h1>
          <p className="text-white/50">Complete platform — website, payments, providers, compliance included</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {JOURNEY_STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${step > s.id ? 'bg-[#4A6741] text-white' : step === s.id ? 'bg-white text-black shadow-lg' : 'bg-white/10 text-white/30'}`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-[8px] hidden sm:block ${step === s.id ? 'text-[#6B8F5E]' : 'text-white/25'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-white/10 rounded-full">
            <div className="absolute h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 7) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-8 space-y-6">

                {/* STEP 1: Personal Info */}
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Hi! Let's start with you</h2>
                      <p className="text-white/50 text-sm">Your contact information</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">First Name *</Label>
                        <Input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Last Name *</Label>
                        <Input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email *</Label>
                        <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone *</Label>
                        <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: Business Info */}
                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Tell us about your business</h2>
                      <p className="text-white/50 text-sm">What are you building?</p>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5"><Building className="w-3 h-3" /> Business Name *</Label>
                        <Input value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Elite Wellness Solutions" className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Business Type *</Label>
                        <Select value={form.businessType} onValueChange={v => set('businessType', v)}>
                          <SelectTrigger className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741]"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Clinic">Clinic / Med Spa</SelectItem>
                            <SelectItem value="Gym">Gym / Fitness</SelectItem>
                            <SelectItem value="Wellness">Wellness Center</SelectItem>
                            <SelectItem value="Retail">Online Retail</SelectItem>
                            <SelectItem value="Telehealth">Telehealth</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5"><Globe2 className="w-3 h-3" /> Website (optional)</Label>
                        <Input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yoursite.com" className="mt-1.5 bg-white/90 text-gray-900 focus:border-[#4A6741]" />
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 3: Legal */}
                {step === 3 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Legal Structure</h2>
                      <p className="text-white/50 text-sm">Do you have an LLC?</p>
                    </div>
                    {form.hasLLC === null ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => set('hasLLC', true)} className="p-4 rounded-xl border border-white/20 bg-white/5 hover:border-[#4A6741] hover:bg-[#4A6741]/10 text-left transition-all">
                          <span className="text-white font-semibold text-sm">Yes, I have an LLC</span>
                          <p className="text-white/40 text-xs mt-1">I have EIN & registration</p>
                        </button>
                        <button onClick={() => set('hasLLC', false)} className="p-4 rounded-xl border border-white/20 bg-white/5 hover:border-[#4A6741] hover:bg-[#4A6741]/10 text-left transition-all">
                          <span className="text-white font-semibold text-sm">No, not yet</span>
                          <p className="text-white/40 text-xs mt-1">I'll add it later</p>
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {form.hasLLC && (
                          <>
                            <div>
                              <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">LLC Name *</Label>
                              <Input value={form.llcName} onChange={e => set('llcName', e.target.value)} placeholder="Elite Wellness LLC" className="mt-1.5 bg-white/90 text-gray-900" />
                            </div>
                            <div>
                              <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">EIN *</Label>
                              <Input value={form.ein} onChange={e => set('ein', e.target.value)} placeholder="XX-XXXXXXX" className="mt-1.5 bg-white/90 text-gray-900" />
                            </div>
                          </>
                        )}
                        <button onClick={() => set('hasLLC', null)} className="text-xs text-white/40 hover:text-white/70 underline">← Change answer</button>
                      </div>
                    )}
                  </>
                )}

                {/* STEP 4: Products */}
                {step === 4 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">What will you sell?</h2>
                      <p className="text-white/50 text-sm">Select your product categories</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {PRODUCT_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const selected = form.productCategories.includes(cat.id);
                        return (
                          <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${selected ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
                            <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-white' : 'text-white/50'}`} />
                            <p className="font-medium text-sm">{cat.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* STEP 5: Brand */}
                {step === 5 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Choose Your Style</h2>
                      <p className="text-white/50 text-sm">Pick a template for your storefront</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {STOREFRONT_TEMPLATES.map((t) => (
                        <button key={t.id} onClick={() => set('templateId', t.id)}
                          className={`relative rounded-xl overflow-hidden border transition-all ${form.templateId === t.id ? 'border-[#4A6741] ring-1 ring-[#4A6741]' : 'border-white/15 hover:border-white/30'}`}>
                          <img src={t.img} alt={t.label} className="w-full h-28 object-cover opacity-60" />
                          <div className="p-3" style={{ background: t.color }}>
                            <p className="text-white font-semibold text-sm">{t.label}</p>
                            <p className="text-white/40 text-xs">{t.desc}</p>
                          </div>
                          {form.templateId === t.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#4A6741] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* STEP 6: Domain */}
                {step === 6 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Choose Your Domain</h2>
                      <p className="text-white/50 text-sm">Your web address</p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { value: 'subdomain', label: 'Free Subdomain', desc: 'yourname.medrevolve.co', icon: Zap },
                        { value: 'new', label: 'New Domain', desc: 'We register it (~$15/yr)', icon: Globe },
                        { value: 'existing', label: 'Use Existing', desc: 'Point your domain', icon: ArrowRight },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.value} onClick={() => set('domainChoice', opt.value)}
                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${form.domainChoice === opt.value ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
                            <Icon className="w-5 h-5 text-[#6B8F5E]" />
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">{opt.label}</p>
                              <p className="text-white/40 text-xs">{opt.desc}</p>
                            </div>
                            {form.domainChoice === opt.value && <Check className="w-4 h-4 text-[#6B8F5E]" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Domain Name *</Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Input value={form.domainName} onChange={e => set('domainName', e.target.value)}
                          placeholder={form.domainChoice === 'subdomain' ? 'yourname' : 'yoursite.com'}
                          className="bg-white/90 text-gray-900 flex-1" />
                        {form.domainChoice === 'subdomain' && <span className="text-white/40 text-sm">.medrevolve.co</span>}
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 7: Features */}
                {step === 7 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Select Features</h2>
                      <p className="text-white/50 text-sm">All included — pick what you need</p>
                    </div>
                    <div className="grid gap-3">
                      {MODULE_OPTIONS.map((mod) => {
                        const Icon = mod.icon;
                        const selected = form.selectedModules.includes(mod.key);
                        return (
                          <button key={mod.key} onClick={() => toggleModule(mod.key)}
                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all w-full ${selected ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? 'bg-[#4A6741]' : 'bg-white/10'}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium text-sm">{mod.label}</p>
                                {mod.popular && <Badge className="bg-[#6B8F5E] text-white text-[10px]">Popular</Badge>}
                              </div>
                              <p className="text-white/40 text-xs">{mod.desc}</p>
                            </div>
                            {selected && <Check className="w-5 h-5 text-[#6B8F5E]" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* STEP 8: Review */}
                {step === 8 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Review & Launch</h2>
                      <p className="text-white/50 text-sm">Almost there!</p>
                    </div>
                    <div className="bg-white/8 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-white/60 text-sm">Setup Fee</span>
                        <span className="text-3xl font-bold text-white">${SETUP_FEE}</span>
                      </div>
                      <div className="text-white/40 text-xs space-y-1">
                        <p>✓ Branded storefront ({STOREFRONT_TEMPLATES.find(t => t.id === form.templateId)?.label})</p>
                        <p>✓ Domain: {form.domainName}{form.domainChoice === 'subdomain' ? '.medrevolve.co' : ''}</p>
                        <p>✓ Products: {form.productCategories.length} categories</p>
                        <p>✓ Features: {form.selectedModules.length} modules</p>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-white text-xs">Monthly: ${PLATFORM_MONTHLY_BASE} after 30-day trial</p>
                      </div>
                    </div>
                    {error && (
                      <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm flex gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
                      </div>
                    )}
                  </>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-white/50 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : <div />}

          {step < 8 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:from-[#5a7751] hover:to-[#7b9f6e] text-white px-8 font-bold rounded-sm shadow-lg shadow-[#4A6741]/30 disabled:opacity-50">
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !canProceed()}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:from-[#5a7751] hover:to-[#7b9f6e] text-white px-10 font-bold rounded-sm shadow-lg shadow-[#4A6741]/30 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Launching...</> : <>Launch — ${SETUP_FEE}</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}