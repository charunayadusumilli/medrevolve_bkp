import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { trackDigestEvent } from '@/lib/digestTracker';
import {
  Check, ArrowRight, ArrowLeft, Loader2, Zap, Lock, AlertCircle,
  Phone, Mail, Building, Globe2, User, Heart, Activity, Clock,
  ShoppingBag, Stethoscope, CreditCard, ShieldCheck, CheckCircle2,
  Calendar, DollarSign, Star, Sparkles
} from 'lucide-react';

// ── Steps ──────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Business' },
  { id: 3, label: 'Your Goals' },
  { id: 4, label: 'Confirm & Pay' },
];

const BUSINESS_TYPES = [
  { value: 'Clinic', label: '🏥 Clinic / Med Spa' },
  { value: 'Gym', label: '💪 Gym / Fitness Studio' },
  { value: 'Wellness', label: '🌿 Wellness Center' },
  { value: 'Chiropractor', label: '🦴 Chiropractic / PT' },
  { value: 'Telehealth', label: '📱 Telehealth Platform' },
  { value: 'Retail', label: '🛒 Online Retail / E-comm' },
  { value: 'Other', label: '✨ Other' },
];

const PRODUCT_INTERESTS = [
  { id: 'weight_loss', label: 'Weight Loss / GLP-1', icon: Activity },
  { id: 'hormones', label: 'Hormone Therapy', icon: Heart },
  { id: 'longevity', label: 'Longevity / Anti-Aging', icon: Clock },
  { id: 'mens_health', label: "Men's Health", icon: User },
  { id: 'womens_health', label: "Women's Health", icon: User },
  { id: 'peptides', label: 'Peptides / Performance', icon: Zap },
  { id: 'supplements', label: 'Supplements', icon: ShoppingBag },
  { id: 'telehealth', label: 'Telehealth Services', icon: Stethoscope },
];

const REVENUE_RANGES = [
  { value: '0', label: 'Just starting out' },
  { value: '10k', label: 'Under $10k/mo' },
  { value: '10k-50k', label: '$10k – $50k/mo' },
  { value: '50k-100k', label: '$50k – $100k/mo' },
  { value: '100k+', label: '$100k+/mo' },
];

// ── What's included in the $100 onboarding call ────────────────────────────────
const CALL_INCLUDES = [
  'Live walkthrough of your complete telehealth platform setup',
  'How to open your business bank account (Brex/Stripe)',
  'Domain, website & storefront configuration',
  'Provider & pharmacy network onboarding',
  'Compliance framework & legal structure guidance',
  'Payment processing & merchant account setup',
  'Marketing & growth strategy for your niche',
];

export default function MerchantOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Step 1 – About You
    firstName: '', lastName: '', email: '', phone: '',
    // Step 2 – Business
    businessName: '', businessType: '', website: '',
    hasLLC: '', state: '',
    // Step 3 – Goals
    productInterests: [], currentRevenue: '', goals: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (id) =>
    setForm(prev => ({
      ...prev,
      productInterests: prev.productInterests.includes(id)
        ? prev.productInterests.filter(x => x !== id)
        : [...prev.productInterests, id],
    }));

  // Pre-fill from logged-in user
  useEffect(() => {
    base44.auth.isAuthenticated().then(async (isAuth) => {
      if (!isAuth) return;
      try {
        const u = await base44.auth.me();
        if (u.email) set('email', u.email);
        if (u.full_name) {
          const parts = u.full_name.split(' ');
          set('firstName', parts[0] || '');
          set('lastName', parts.slice(1).join(' ') || '');
        }
      } catch {}
    });
  }, []);

  const canProceed = () => {
    if (step === 1) return form.firstName && form.lastName && form.email && form.phone;
    if (step === 2) return form.businessName && form.businessType && form.hasLLC !== '';
    if (step === 3) return form.productInterests.length > 0 && form.currentRevenue;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Block in iframe
      if (window.self !== window.top) {
        throw new Error('Please open medrevolve.com directly to complete payment — checkout is blocked inside previews.');
      }

      const contactName = `${form.firstName} ${form.lastName}`.trim();

      // 1. Save partner record
      const partnerCode = form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
        + Math.random().toString(36).substr(2, 4);

      const partner = await base44.entities.Partner.create({
        business_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
        business_type: form.businessType,
        partner_code: partnerCode,
        subscription_status: 'trial',
        status: 'pending',
        enabled_products: form.productInterests,
        monthly_fee: 0, // set after onboarding call
      });

      // 2. Save business inquiry with all details
      await base44.entities.BusinessInquiry.create({
        company_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
        industry: form.businessType,
        interest_type: 'White Label',
        company_size: form.currentRevenue,
        message: `Onboarding call intake. State: ${form.state}. LLC: ${form.hasLLC}. Interests: ${form.productInterests.join(', ')}. Revenue: ${form.currentRevenue}. Goals: ${form.goals || 'Not specified'}. Partner ID: ${partner.id}`,
        status: 'new',
      });

      // 3. Create $100 Stripe checkout for onboarding consultation
      const checkoutRes = await base44.functions.invoke('merchantSetupCheckout', {
        businessName: form.businessName,
        contactName: contactName,
        email: form.email,
        partnerCode,
        amount: 100,
        description: 'MedRevolve Onboarding Consultation — 1-hour guided platform setup call with a MedRevolve specialist.',
        successUrl: `${window.location.origin}/MerchantDashboard?onboarding=paid&partner=${partner.id}`,
        cancelUrl: `${window.location.origin}/MerchantOnboarding?canceled=1`,
      });

      if (!checkoutRes?.data?.url) throw new Error('Could not create payment. Please try again.');

      trackDigestEvent('merchant_onboarding_intake', {
        business_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
      });

      window.location.href = checkoutRes.data.url;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0f0a] to-[#080808] py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-4 py-1.5 mb-4 text-[#6B8F5E] text-xs font-bold uppercase tracking-wide">
            <Zap className="w-3 h-3" /> Launch Your Telehealth Business
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Start with a $100 Onboarding Call</h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Book your 1-hour guided setup session. We'll walk you through everything — platform, payments, compliance, and launch — live on the call.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mx-auto
                  ${step > s.id ? 'bg-[#4A6741] text-white' : step === s.id ? 'bg-white text-black shadow-lg' : 'bg-white/10 text-white/30'}`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-[9px] hidden sm:block text-center ${step === s.id ? 'text-[#6B8F5E] font-semibold' : 'text-white/25'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-white/10 rounded-full">
            <div className="absolute h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}>
            <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-8 space-y-6">

                {/* ─── STEP 1: About You ─── */}
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">👋 Hi! Tell us about yourself</h2>
                      <p className="text-white/50 text-sm">We'll use this to send your calendar invite and onboarding details.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">First Name *</Label>
                        <Input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                          placeholder="John" autoFocus
                          className="mt-1.5 bg-white/90 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Last Name *</Label>
                        <Input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                          placeholder="Doe"
                          className="mt-1.5 bg-white/90 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> Email *
                        </Label>
                        <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                          placeholder="you@company.com"
                          className="mt-1.5 bg-white/90 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> Phone *
                        </Label>
                        <Input value={form.phone} onChange={e => set('phone', e.target.value)}
                          placeholder="(555) 123-4567"
                          className="mt-1.5 bg-white/90 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4A6741]/50" />
                        <p className="text-white/30 text-xs mt-1">We'll text your call details and Google Meet link</p>
                      </div>
                    </div>
                  </>
                )}

                {/* ─── STEP 2: Your Business ─── */}
                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">🏢 Tell us about your business</h2>
                      <p className="text-white/50 text-sm">This helps us tailor your onboarding call agenda.</p>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5">
                          <Building className="w-3 h-3" /> Business / Brand Name *
                        </Label>
                        <Input value={form.businessName} onChange={e => set('businessName', e.target.value)}
                          placeholder="Elite Wellness Co."
                          className="mt-1.5 bg-white/90 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4A6741]/50" />
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Business Type *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1.5">
                          {BUSINESS_TYPES.map(bt => (
                            <button key={bt.value} type="button" onClick={() => set('businessType', bt.value)}
                              className={`p-3 rounded-xl border text-left text-sm transition-all ${form.businessType === bt.value ? 'bg-[#4A6741] border-[#4A6741] text-white font-semibold' : 'bg-white/5 border-white/15 text-white/70 hover:border-white/30'}`}>
                              {bt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5">
                            <Globe2 className="w-3 h-3" /> State *
                          </Label>
                          <Select value={form.state} onValueChange={v => set('state', v)}>
                            <SelectTrigger className="mt-1.5 bg-white/90 text-gray-900">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent className="max-h-48">
                              {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Do you have an LLC? *</Label>
                          <div className="grid grid-cols-2 gap-2 mt-1.5">
                            {[{ v: 'yes', l: '✅ Yes' }, { v: 'no', l: '❌ Not yet' }].map(opt => (
                              <button key={opt.v} type="button" onClick={() => set('hasLLC', opt.v)}
                                className={`p-3 rounded-xl border text-sm font-semibold transition-all ${form.hasLLC === opt.v ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'bg-white/5 border-white/15 text-white/70 hover:border-white/30'}`}>
                                {opt.l}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#6B8F5E] text-xs uppercase font-semibold flex items-center gap-1.5">
                          <Globe2 className="w-3 h-3" /> Website (optional)
                        </Label>
                        <Input value={form.website} onChange={e => set('website', e.target.value)}
                          placeholder="https://yoursite.com"
                          className="mt-1.5 bg-white/90 text-gray-900 placeholder:text-gray-400" />
                      </div>
                    </div>
                  </>
                )}

                {/* ─── STEP 3: Goals ─── */}
                {step === 3 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">🎯 What are your goals?</h2>
                      <p className="text-white/50 text-sm">Pick everything you want to offer. We'll build your call agenda around this.</p>
                    </div>
                    <div>
                      <Label className="text-[#6B8F5E] text-xs uppercase font-semibold mb-3 block">Services / Products You Want to Offer *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PRODUCT_INTERESTS.map((pi) => {
                          const Icon = pi.icon;
                          const sel = form.productInterests.includes(pi.id);
                          return (
                            <button key={pi.id} type="button" onClick={() => toggleInterest(pi.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${sel ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'bg-white/5 border-white/15 text-white/70 hover:border-white/30'}`}>
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm font-medium">{pi.label}</span>
                              {sel && <Check className="w-3.5 h-3.5 ml-auto" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Current Monthly Revenue *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        {REVENUE_RANGES.map(r => (
                          <button key={r.value} type="button" onClick={() => set('currentRevenue', r.value)}
                            className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${form.currentRevenue === r.value ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'bg-white/5 border-white/15 text-white/70 hover:border-white/30'}`}>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#6B8F5E] text-xs uppercase font-semibold">Anything specific you want covered on the call? (optional)</Label>
                      <textarea value={form.goals} onChange={e => set('goals', e.target.value)}
                        placeholder="e.g. I want to know how to set up my bank account, compliance for GLP-1, how to hire providers..."
                        rows={3}
                        className="mt-1.5 w-full bg-white/90 text-gray-900 placeholder:text-gray-400 rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/50" />
                    </div>
                  </>
                )}

                {/* ─── STEP 4: Confirm & Pay ─── */}
                {step === 4 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">✅ Confirm & Book Your Call</h2>
                      <p className="text-white/50 text-sm">One payment locks in your onboarding session.</p>
                    </div>

                    {/* Summary card */}
                    <div className="bg-white/8 border border-white/10 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold text-lg">Onboarding Consultation</p>
                          <p className="text-white/50 text-sm">1-hour live setup session with a MedRevolve specialist</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-white">$100</p>
                          <p className="text-white/40 text-xs">one-time</p>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-3 space-y-2">
                        {CALL_INCLUDES.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <CheckCircle2 className="w-4 h-4 text-[#6B8F5E] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Your submitted info recap */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
                      <p className="text-white/40 text-xs uppercase font-semibold mb-2">Your Details</p>
                      <div className="flex justify-between"><span className="text-white/50">Name</span><span className="text-white font-medium">{form.firstName} {form.lastName}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Email</span><span className="text-white">{form.email}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Phone</span><span className="text-white">{form.phone}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Business</span><span className="text-white font-medium">{form.businessName}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Type</span><span className="text-white">{form.businessType}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">State</span><span className="text-white">{form.state}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">LLC</span><span className="text-white">{form.hasLLC === 'yes' ? 'Yes ✅' : 'Not yet'}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Interests</span><span className="text-white text-right max-w-[60%]">{form.productInterests.join(', ')}</span></div>
                    </div>

                    {/* What happens after payment */}
                    <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-xl p-4 space-y-3">
                      <p className="text-[#6B8F5E] font-bold text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> What happens after you pay
                      </p>
                      <div className="space-y-2 text-sm text-white/60">
                        <p>1. You'll receive a Google Meet invite within minutes</p>
                        <p>2. We review your intake form before the call</p>
                        <p>3. 1-hour live walkthrough of your entire platform setup</p>
                        <p>4. After the call — full platform launch for $5,000 setup + $2,500/mo</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      Secure payment via Stripe. Your card is never stored on our servers.
                    </div>

                    {error && (
                      <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
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
            <Button variant="ghost" onClick={() => { setStep(s => s - 1); setError(''); }} className="text-white/50 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white px-8 font-bold rounded-sm shadow-lg disabled:opacity-40">
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white px-10 font-black text-base rounded-sm shadow-lg shadow-[#4A6741]/30 disabled:opacity-50">
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                : <><CreditCard className="w-4 h-4 mr-2" /> Pay $100 & Book My Call</>
              }
            </Button>
          )}
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-8 text-white/20 text-xs">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliant</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Stripe Secured</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> 100% Satisfaction</span>
        </div>
      </div>
    </div>
  );
}