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
  ShoppingBag, Stethoscope, ShieldCheck, CheckCircle2,
  Calendar, Star, Sparkles, ExternalLink, Monitor, PartyPopper
} from 'lucide-react';

// ── Steps ──────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Business' },
  { id: 3, label: 'Your Goals' },
  { id: 3.5, label: 'See Your Site' },
  { id: 4, label: 'Get Started' },
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

const CALL_INCLUDES = [
  'Live walkthrough of your complete telehealth platform setup',
  'Domain, website & storefront configuration',
  'Provider & pharmacy network onboarding',
  'Compliance framework & legal structure guidance',
  'Payment processing & merchant account setup',
  'Marketing & growth strategy for your niche',
  '14-day free trial — no credit card required',
];

const NICHE_MAP = {
  weight_loss: 'weight_loss',
  hormones: 'hormones',
  mens_health: 'mens_health',
  womens_health: 'womens_health',
  longevity: 'longevity',
  peptides: 'peptides',
  telehealth: 'weight_loss',
  supplements: 'weight_loss',
};

const BRAND_COLORS = [
  { hex: '4A6741', label: 'Forest' },
  { hex: '1A3A6A', label: 'Navy' },
  { hex: '8B2252', label: 'Plum' },
  { hex: '2D6A9F', label: 'Ocean' },
  { hex: '6B3A2A', label: 'Copper' },
  { hex: '1A5C5C', label: 'Teal' },
  { hex: '4A3580', label: 'Purple' },
  { hex: '8B6914', label: 'Gold' },
];

export default function MerchantOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [demoOpened, setDemoOpened] = useState(false);
  const [selectedColor, setSelectedColor] = useState('4A6741');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    businessName: '', businessType: '', website: '',
    hasLLC: '', state: '',
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

  const buildDemoUrl = () => {
    const primaryNiche = NICHE_MAP[form.productInterests[0]] || 'weight_loss';
    const domainSlug = form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
    const params = new URLSearchParams({
      biz: form.businessName,
      niche: primaryNiche,
      color: selectedColor,
      domain: domainSlug,
    });
    return `${window.location.origin}/PersonalizedDemo?${params.toString()}`;
  };

  const openDemo = () => {
    const url = buildDemoUrl();
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    setDemoOpened(true);
  };

  const canProceed = () => {
    if (step === 1) return form.firstName && form.lastName && form.email && form.phone;
    if (step === 2) return form.businessName && form.businessType && form.hasLLC !== '';
    if (step === 3) return form.productInterests.length > 0 && form.currentRevenue;
    if (step === 3.5) return demoOpened;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const contactName = `${form.firstName} ${form.lastName}`.trim();

      const partnerCode = form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
        + Math.random().toString(36).substr(2, 4);

      // Save partner record as trial
      await base44.entities.Partner.create({
        business_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
        business_type: form.businessType,
        partner_code: partnerCode,
        subscription_status: 'trial',
        status: 'pending',
        enabled_products: form.productInterests,
        monthly_fee: 0,
      });

      // Save full intake / inquiry
      await base44.entities.BusinessInquiry.create({
        company_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
        industry: form.businessType,
        interest_type: 'White Label',
        company_size: form.currentRevenue,
        message: `Free trial onboarding intake. State: ${form.state}. LLC: ${form.hasLLC}. Interests: ${form.productInterests.join(', ')}. Revenue: ${form.currentRevenue}. Goals: ${form.goals || 'Not specified'}.`,
        status: 'new',
      });

      // Also capture as a contact request so it hits the inbox
      await base44.entities.ContactRequest.create({
        name: contactName,
        email: form.email,
        phone: form.phone,
        subject: `Free Trial Signup — ${form.businessName}`,
        message: `New free trial request from ${form.businessName} (${form.businessType}). Interests: ${form.productInterests.join(', ')}. Revenue: ${form.currentRevenue}. State: ${form.state}. LLC: ${form.hasLLC}. Goals: ${form.goals || 'None specified'}.`,
        source: 'website_form',
        status: 'new',
      });

      trackDigestEvent('merchant_onboarding_intake', {
        business_name: form.businessName,
        contact_name: contactName,
        email: form.email,
        phone: form.phone,
      });

      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0f0a] to-[#080808] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#4A6741]/20 border border-[#4A6741]/40 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-9 h-9 text-[#6B8F5E]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">You're on the List! 🎉</h1>
          <p className="text-white/50 text-base leading-relaxed mb-8">
            Thanks, <span className="text-white font-semibold">{form.firstName}</span>! Your 14-day free trial request for <span className="text-white font-semibold">{form.businessName}</span> has been received.
            A MedRevolve specialist will reach out within <span className="text-[#6B8F5E] font-bold">24 hours</span> to schedule your onboarding call and get your platform live.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 mb-8">
            <p className="text-[#6B8F5E] font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4" /> What happens next
            </p>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4A6741]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6B8F5E] font-bold text-xs">1</div>
                <p>A MedRevolve specialist contacts you at <span className="text-white">{form.email}</span> or <span className="text-white">{form.phone}</span></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4A6741]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6B8F5E] font-bold text-xs">2</div>
                <p>We schedule your <span className="text-white font-semibold">free onboarding strategy call</span> — no credit card needed</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4A6741]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6B8F5E] font-bold text-xs">3</div>
                <p>Your <span className="text-white font-semibold">14-day free trial</span> platform goes live — full access, no commitment</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4A6741]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6B8F5E] font-bold text-xs">4</div>
                <p>You decide if you want to continue — we handle everything from there</p>
              </div>
            </div>
          </div>

          <a href="tel:+12403875224">
            <Button className="w-full bg-[#4A6741] hover:bg-[#4A6741]/90 text-white font-bold rounded-sm h-12 text-base">
              <Phone className="w-4 h-4 mr-2" /> Call Us Now: 240-387-5224
            </Button>
          </a>
          <p className="text-white/25 text-xs mt-4">Mon–Fri 9am–6pm EST · We'll reach out within 24 hours</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0f0a] to-[#080808] py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-4 py-1.5 mb-4 text-[#6B8F5E] text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-3 h-3" /> 14-Day Free Trial — No Credit Card Required
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Launch Your Telehealth Business</h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Tell us about your business and we'll reach back to schedule your free onboarding call and activate your trial platform.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s) => {
              const stepIndex = STEPS.findIndex(x => x.id === s.id);
              const currentIndex = STEPS.findIndex(x => x.id === step);
              const isDone = currentIndex > stepIndex;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mx-auto
                    ${isDone ? 'bg-[#4A6741] text-white' : isCurrent ? 'bg-white text-black shadow-lg' : 'bg-white/10 text-white/30'}`}>
                    {isDone ? <Check className="w-4 h-4" /> : s.id === 3.5 ? <Monitor className="w-3.5 h-3.5" /> : stepIndex + 1}
                  </div>
                  <span className={`text-[9px] hidden sm:block text-center ${isCurrent ? 'text-[#6B8F5E] font-semibold' : 'text-white/25'}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
          <div className="relative h-1 bg-white/10 rounded-full">
            <div className="absolute h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full transition-all duration-500"
              style={{ width: `${(STEPS.findIndex(x => x.id === step) / (STEPS.length - 1)) * 100}%` }} />
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
                      <p className="text-white/50 text-sm">We'll use this to reach out and schedule your free onboarding call.</p>
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
                        <p className="text-white/30 text-xs mt-1">We'll call or text to schedule your free onboarding session</p>
                      </div>
                    </div>
                  </>
                )}

                {/* ─── STEP 2: Your Business ─── */}
                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">🏢 Tell us about your business</h2>
                      <p className="text-white/50 text-sm">This helps us tailor your free trial platform and onboarding agenda.</p>
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
                      <p className="text-white/50 text-sm">Pick everything you want to offer on your trial platform.</p>
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

                {/* ─── STEP 3.5: See Your Site ─── */}
                {step === 3.5 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">👀 See Your Site Before You Start</h2>
                      <p className="text-white/50 text-sm">We've built a personalized preview of <span className="text-white font-semibold">{form.businessName}</span> based on your selections. Pick your brand color and launch the demo.</p>
                    </div>

                    <div>
                      <p className="text-[#6B8F5E] text-xs uppercase font-semibold mb-3">Pick Your Brand Color</p>
                      <div className="flex flex-wrap gap-3">
                        {BRAND_COLORS.map(c => (
                          <button key={c.hex} type="button" onClick={() => setSelectedColor(c.hex)}
                            className="flex flex-col items-center gap-1.5 transition-all">
                            <div className={`w-10 h-10 rounded-xl border-2 transition-all ${selectedColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/30'}`}
                              style={{ backgroundColor: `#${c.hex}` }} />
                            <span className={`text-[9px] ${selectedColor === c.hex ? 'text-white' : 'text-white/30'}`}>{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                          style={{ backgroundColor: `#${selectedColor}` }}>
                          {form.businessName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold">{form.businessName}</p>
                          <p className="text-white/40 text-xs font-mono">
                            {form.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)}.com
                          </p>
                        </div>
                        <div className="ml-auto text-xs text-white/30 text-right hidden sm:block">
                          Focus: <span className="text-white/60 capitalize">{(form.productInterests[0] || 'weight_loss').replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="text-xs text-white/40 space-y-1.5">
                        <p>✓ Full branded homepage with hero, products, and how-it-works</p>
                        <p>✓ Personalized to your niche ({form.productInterests.slice(0, 2).map(i => i.replace('_', ' ')).join(', ')})</p>
                        <p>✓ Your brand color <span className="font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `#${selectedColor}20`, color: `#${selectedColor}` }}>#{selectedColor}</span> throughout</p>
                        <p>✓ Legal pages, trust badges, HIPAA compliance included</p>
                      </div>
                      <button
                        onClick={openDemo}
                        className="w-full py-3.5 rounded-sm font-bold text-white flex items-center justify-center gap-2 text-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: `#${selectedColor}` }}>
                        <ExternalLink className="w-4 h-4" />
                        {demoOpened ? 'Reopen My Site Preview' : 'Launch My Personalized Demo →'}
                      </button>
                      {demoOpened && (
                        <p className="text-center text-xs text-[#6B8F5E]">
                          ✅ Demo opened! Explore your site, then continue below.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* ─── STEP 4: Confirm & Get Started (no payment) ─── */}
                {step === 4 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-1">🚀 Start Your Free Trial</h2>
                      <p className="text-white/50 text-sm">No credit card. No commitment. A specialist will reach out within 24 hours to get you started.</p>
                    </div>

                    {/* Trial summary card */}
                    <div className="bg-white/8 border border-[#4A6741]/40 rounded-xl p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-bold text-lg">14-Day Free Trial</p>
                          <p className="text-white/50 text-sm">Full platform access · No credit card required</p>
                        </div>
                        <div className="bg-[#4A6741]/20 border border-[#4A6741]/40 rounded-full px-3 py-1 text-[#6B8F5E] text-xs font-black uppercase tracking-wide flex-shrink-0 ml-2">
                          FREE
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

                    {/* Info recap */}
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

                    {/* What happens next */}
                    <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-xl p-4 space-y-3">
                      <p className="text-[#6B8F5E] font-bold text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> What happens after you submit
                      </p>
                      <div className="space-y-2 text-sm text-white/60">
                        <p>1. A MedRevolve specialist reaches out within 24 hours</p>
                        <p>2. We schedule your <span className="text-white font-semibold">free onboarding strategy call</span></p>
                        <p>3. Your trial platform goes live — full access for 14 days</p>
                        <p>4. You decide if you want to continue — we take it from there</p>
                      </div>
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
            <Button variant="ghost"
              onClick={() => {
                const currentIndex = STEPS.findIndex(x => x.id === step);
                setStep(STEPS[currentIndex - 1].id);
                setError('');
              }}
              className="text-white/50 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : <div />}

          {step !== 4 ? (
            <Button
              onClick={() => {
                const currentIndex = STEPS.findIndex(x => x.id === step);
                setStep(STEPS[currentIndex + 1].id);
              }}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white px-8 font-bold rounded-sm shadow-lg disabled:opacity-40">
              {step === 3.5 ? (demoOpened ? 'Continue' : 'Open Demo First') : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}
              className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white px-10 font-black text-base rounded-sm shadow-lg shadow-[#4A6741]/30 disabled:opacity-50">
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                : <><Sparkles className="w-4 h-4 mr-2" /> Start My Free Trial</>
              }
            </Button>
          )}
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-8 text-white/20 text-xs">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliant</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> No Credit Card</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> 14-Day Free Trial</span>
        </div>
      </div>
    </div>
  );
}