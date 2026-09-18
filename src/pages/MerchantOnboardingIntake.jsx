import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import {
  Building2, CreditCard, Users, Package, FileCheck, ArrowLeft, ArrowRight,
  CheckCircle2, Loader2, ShieldCheck, Phone, AlertCircle
} from 'lucide-react';

const ENTITY_TYPES = ['LLC', 'C-Corporation', 'S-Corporation', 'Partnership', 'Sole Proprietor', 'Non-Profit', 'Other'];
const INDUSTRIES = ['Telehealth Platform', 'Med Spa', 'Wellness Clinic', 'Pharmacy', 'Fitness/Health', 'Healthcare Provider', 'E-commerce', 'Other'];
const CARD_BRANDS = ['Visa', 'Mastercard', 'American Express', 'Discover', 'EBT'];
const SERVICES = [
  { key: 'platform', label: 'B2B Platform ($2,999/mo)' },
  { key: 'full_bundle', label: 'Full Platform Bundle ($250/mo)' },
  { key: 'marketing', label: 'Marketing Integration ($150/mo)' },
  { key: 'product', label: 'Product Integration ($750 one-time)' },
  { key: 'pharmacy', label: 'Pharmacy Integration ($100/mo)' },
  { key: 'payment', label: 'Payment Integration ($100/mo)' },
  { key: 'llc_formation', label: 'LLC Formation ($1,500 one-time)' },
  { key: 'telehealth', label: 'Telehealth Module' },
  { key: 'compliance', label: 'Compliance Module' },
  { key: 'inventory', label: 'Inventory Management' },
  { key: 'website_builder', label: 'Website Builder' },
  { key: 'domain_hosting', label: 'Domain & Hosting' },
];

const STEPS = [
  { key: 'business', label: 'Business Info', icon: Building2 },
  { key: 'processing', label: 'Processing', icon: CreditCard },
  { key: 'ownership', label: 'Ownership', icon: Users },
  { key: 'services', label: 'Services', icon: Package },
  { key: 'review', label: 'Review & Submit', icon: FileCheck },
];

const initialState = {
  legal_business_name: '', dba_name: '', entity_type: 'LLC', state_of_formation: '', ein: '',
  business_address: '', business_city: '', business_state: '', business_zip: '',
  business_phone: '', business_website: '', business_description: '', industry: 'Telehealth Platform',
  expected_monthly_volume: '', average_ticket_amount: '', highest_ticket_amount: '',
  accepted_card_brands: ['Visa', 'Mastercard'],
  bank_name: '', bank_account_type: 'Checking', bank_account_last4: '', bank_routing_number: '',
  beneficial_owners: [{ name: '', ownership_pct: '', dob: '', address: '', ssn_last4: '' }],
  signing_officer_name: '', signing_officer_title: '', signing_officer_email: '', signing_officer_phone: '',
  signing_officer_dob: '', signing_officer_ssn_last4: '', signing_officer_home_address: '',
  personal_guarantee_accepted: false,
  selected_services: ['platform'], service_term_months: 12, monthly_fee: 2999, start_date: '',
  handles_phi: true, phi_services_description: '',
};

export default function MerchantOnboardingIntake() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialState);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const ok = await base44.auth.isAuthenticated();
        if (ok) {
          const me = await base44.auth.me();
          setUser(me);
          setData(d => ({
            ...d,
            signing_officer_email: me.email || '',
            signing_officer_name: me.full_name || '',
            merchant_email: me.email || '',
          }));
        }
      } catch {}
    })();
  }, []);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const setOwner = (i, k, v) => setData(d => {
    const owners = [...d.beneficial_owners];
    owners[i] = { ...owners[i], [k]: v };
    return { ...d, beneficial_owners: owners };
  });
  const addOwner = () => setData(d => ({ ...d, beneficial_owners: [...d.beneficial_owners, { name: '', ownership_pct: '', dob: '', address: '', ssn_last4: '' }] }));
  const removeOwner = (i) => setData(d => ({ ...d, beneficial_owners: d.beneficial_owners.filter((_, idx) => idx !== i) }));

  const toggleBrand = (b) => set('accepted_card_brands', data.accepted_card_brands.includes(b)
    ? data.accepted_card_brands.filter(x => x !== b) : [...data.accepted_card_brands, b]);
  const toggleService = (s) => set('selected_services', data.selected_services.includes(s)
    ? data.selected_services.filter(x => x !== s) : [...data.selected_services, s]);

  const canProceed = () => {
    if (step === 0) return data.legal_business_name && data.entity_type && data.business_address && data.business_state;
    if (step === 1) return data.expected_monthly_volume && data.bank_name && data.bank_account_last4;
    if (step === 2) return data.signing_officer_name && data.signing_officer_email && data.personal_guarantee_accepted;
    if (step === 3) return data.selected_services.length > 0 && data.start_date;
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        merchant_email: user?.email || data.signing_officer_email,
        application_status: 'submitted',
        submitted_at: new Date().toISOString(),
        expected_monthly_volume: Number(data.expected_monthly_volume) || 0,
        average_ticket_amount: Number(data.average_ticket_amount) || 0,
        highest_ticket_amount: Number(data.highest_ticket_amount) || 0,
        monthly_fee: Number(data.monthly_fee) || 0,
        service_term_months: Number(data.service_term_months) || 12,
      };
      const created = await base44.entities.MerchantApplication.create(payload);
      setAppId(created.id);

      // Generate docs + send email
      await base44.functions.invoke('generateMerchantDocuments', {
        applicationId: created.id,
        action: 'send_email',
      });

      setSubmitted(true);
      toast({ title: 'Application submitted!', description: 'Check your email for documents to sign.' });
    } catch (e) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-28 pb-20 px-6 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-lg text-center bg-white/[0.03] border border-white/10 rounded-2xl p-10">
          <div className="w-16 h-16 rounded-full bg-[#4A6741]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#A8C99B]" />
          </div>
          <h1 className="text-2xl font-black mb-3">Application Submitted!</h1>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            We've sent your onboarding documents to <strong className="text-white">{user?.email}</strong>.
            Please check your inbox (and spam folder) to review and electronically sign your:
          </p>
          <ul className="text-left text-white/60 text-sm space-y-2 mb-8 inline-block">
            <li className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#A8C99B]" /> Merchant Processing Application</li>
            <li className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#A8C99B]" /> B2B Platform Service Agreement</li>
            <li className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#A8C99B]" /> HIPAA Business Associate Agreement</li>
          </ul>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate(`/MerchantDocuments?app=${appId}`)}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold">
              Review & Sign Documents Now →
            </Button>
            <Link to="/" className="text-white/40 hover:text-white text-sm">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <Link to="/" className="inline-flex items-center text-white/40 hover:text-white text-sm mb-4">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Link>
        <h1 className="text-3xl font-black mb-1">Merchant Onboarding</h1>
        <p className="text-white/40 text-sm mb-8">Complete this intake to generate your onboarding documents. All fields are required for compliance.</p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.key} className="flex items-center flex-1">
                <div className={`flex flex-col items-center gap-1.5 ${active ? '' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${active ? 'bg-[#4A6741]' : done ? 'bg-[#4A6741]/30' : 'bg-white/5'}`}>
                    {done ? <CheckCircle2 className="w-5 h-5 text-[#A8C99B]" /> : <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white/30'}`} />}
                  </div>
                  <span className={`text-[10px] ${active ? 'text-white font-bold' : 'text-white/30'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${done ? 'bg-[#4A6741]/40' : 'bg-white/10'}`} />}
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">

            {/* Step 0: Business */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-[#A8C99B]" /> Business Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label className="text-white/60 mb-1.5">Legal Business Name *</Label><Input value={data.legal_business_name} onChange={e => set('legal_business_name', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">DBA Name</Label><Input value={data.dba_name} onChange={e => set('dba_name', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div>
                    <Label className="text-white/60 mb-1.5">Entity Type *</Label>
                    <select value={data.entity_type} onChange={e => set('entity_type', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
                      {ENTITY_TYPES.map(t => <option key={t} value={t} className="bg-[#0A0A0A]">{t}</option>)}
                    </select>
                  </div>
                  <div><Label className="text-white/60 mb-1.5">State of Formation</Label><Input value={data.state_of_formation} onChange={e => set('state_of_formation', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">EIN (XX-XXXXXXX)</Label><Input value={data.ein} onChange={e => set('ein', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div>
                    <Label className="text-white/60 mb-1.5">Industry</Label>
                    <select value={data.industry} onChange={e => set('industry', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
                      {INDUSTRIES.map(t => <option key={t} value={t} className="bg-[#0A0A0A]">{t}</option>)}
                    </select>
                  </div>
                </div>
                <div><Label className="text-white/60 mb-1.5">Business Address *</Label><Input value={data.business_address} onChange={e => set('business_address', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><Label className="text-white/60 mb-1.5">City</Label><Input value={data.business_city} onChange={e => set('business_city', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">State *</Label><Input value={data.business_state} onChange={e => set('business_state', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">ZIP</Label><Input value={data.business_zip} onChange={e => set('business_zip', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label className="text-white/60 mb-1.5">Business Phone</Label><Input value={data.business_phone} onChange={e => set('business_phone', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Website</Label><Input value={data.business_website} onChange={e => set('business_website', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                </div>
                <div><Label className="text-white/60 mb-1.5">Business Description</Label><Textarea value={data.business_description} onChange={e => set('business_description', e.target.value)} className="bg-white/5 border-white/10 text-white" rows={3} /></div>
              </div>
            )}

            {/* Step 1: Processing */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#A8C99B]" /> Processing Information</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><Label className="text-white/60 mb-1.5">Expected Monthly Volume ($) *</Label><Input type="number" value={data.expected_monthly_volume} onChange={e => set('expected_monthly_volume', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Average Ticket ($)</Label><Input type="number" value={data.average_ticket_amount} onChange={e => set('average_ticket_amount', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Highest Ticket ($)</Label><Input type="number" value={data.highest_ticket_amount} onChange={e => set('highest_ticket_amount', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                </div>
                <div>
                  <Label className="text-white/60 mb-2">Card Brands to Accept</Label>
                  <div className="flex flex-wrap gap-2">
                    {CARD_BRANDS.map(b => (
                      <button key={b} onClick={() => toggleBrand(b)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${data.accepted_card_brands.includes(b) ? 'bg-[#4A6741]/20 border-[#4A6741]/60 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white/80 pt-2 border-t border-white/10">Settlement Bank Account</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label className="text-white/60 mb-1.5">Bank Name *</Label><Input value={data.bank_name} onChange={e => set('bank_name', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div>
                    <Label className="text-white/60 mb-1.5">Account Type</Label>
                    <select value={data.bank_account_type} onChange={e => set('bank_account_type', e.target.value)} className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm">
                      <option className="bg-[#0A0A0A]">Checking</option>
                      <option className="bg-[#0A0A0A]">Savings</option>
                    </select>
                  </div>
                  <div><Label className="text-white/60 mb-1.5">Account Number (last 4) *</Label><Input maxLength={4} value={data.bank_account_last4} onChange={e => set('bank_account_last4', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Routing Number</Label><Input maxLength={9} value={data.bank_routing_number} onChange={e => set('bank_routing_number', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                </div>
                <p className="text-white/30 text-xs flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Only the last 4 digits of your account number are stored. Full banking details are collected securely during underwriting.</p>
              </div>
            )}

            {/* Step 2: Ownership */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-[#A8C99B]" /> Ownership & Signer</h2>
                <p className="text-white/40 text-sm">List all individuals with 25% or greater ownership (FINCEN/AML requirement).</p>
                {data.beneficial_owners.map((o, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white/70">Owner {i + 1}</span>
                      {data.beneficial_owners.length > 1 && <button onClick={() => removeOwner(i)} className="text-red-400/60 text-xs hover:text-red-400">Remove</button>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div><Label className="text-white/50 mb-1 text-xs">Full Name</Label><Input value={o.name} onChange={e => setOwner(i, 'name', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                      <div><Label className="text-white/50 mb-1 text-xs">Ownership %</Label><Input type="number" value={o.ownership_pct} onChange={e => setOwner(i, 'ownership_pct', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                      <div><Label className="text-white/50 mb-1 text-xs">Date of Birth</Label><Input type="date" value={o.dob} onChange={e => setOwner(i, 'dob', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                      <div><Label className="text-white/50 mb-1 text-xs">SSN (last 4)</Label><Input maxLength={4} value={o.ssn_last4} onChange={e => setOwner(i, 'ssn_last4', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                    </div>
                    <div><Label className="text-white/50 mb-1 text-xs">Address</Label><Input value={o.address} onChange={e => setOwner(i, 'address', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  </div>
                ))}
                <button onClick={addOwner} className="w-full py-2.5 border border-dashed border-white/15 rounded-xl text-white/50 hover:text-white hover:border-white/30 text-sm">+ Add Owner</button>

                <h3 className="text-sm font-bold text-white/80 pt-4 border-t border-white/10">Authorized Signer</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label className="text-white/60 mb-1.5">Signer Name *</Label><Input value={data.signing_officer_name} onChange={e => set('signing_officer_name', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Title *</Label><Input value={data.signing_officer_title} onChange={e => set('signing_officer_title', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Email *</Label><Input type="email" value={data.signing_officer_email} onChange={e => set('signing_officer_email', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Phone</Label><Input value={data.signing_officer_phone} onChange={e => set('signing_officer_phone', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Date of Birth</Label><Input type="date" value={data.signing_officer_dob} onChange={e => set('signing_officer_dob', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">SSN (last 4)</Label><Input maxLength={4} value={data.signing_officer_ssn_last4} onChange={e => set('signing_officer_ssn_last4', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                </div>
                <div><Label className="text-white/60 mb-1.5">Home Address (for personal guarantee)</Label><Input value={data.signing_officer_home_address} onChange={e => set('signing_officer_home_address', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>

                <label className="flex items-start gap-3 bg-[#4A6741]/5 border border-[#4A6741]/20 rounded-xl p-4 cursor-pointer">
                  <Checkbox checked={data.personal_guarantee_accepted} onCheckedChange={v => set('personal_guarantee_accepted', v)} className="mt-0.5" />
                  <span className="text-white/70 text-xs leading-relaxed">
                    <strong className="text-white">Personal Guarantee Acknowledgment.</strong> I personally guarantee the full and timely performance of all obligations of the business under the Merchant Processing Application, including payment of all fees, chargebacks, and adjustments. This guarantee is irrevocable.
                  </span>
                </label>
              </div>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-[#A8C99B]" /> Services & PHI</h2>
                <div>
                  <Label className="text-white/60 mb-2">Select Services</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SERVICES.map(s => (
                      <button key={s.key} onClick={() => toggleService(s.key)}
                        className={`text-left p-3 rounded-lg border text-sm transition-all ${data.selected_services.includes(s.key) ? 'bg-[#4A6741]/15 border-[#4A6741]/50 text-white' : 'bg-white/5 border-white/10 text-white/50'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><Label className="text-white/60 mb-1.5">Term (months)</Label><Input type="number" value={data.service_term_months} onChange={e => set('service_term_months', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Monthly Fee ($)</Label><Input type="number" value={data.monthly_fee} onChange={e => set('monthly_fee', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                  <div><Label className="text-white/60 mb-1.5">Start Date *</Label><Input type="date" value={data.start_date} onChange={e => set('start_date', e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                </div>
                <label className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl p-4 cursor-pointer">
                  <Checkbox checked={data.handles_phi} onCheckedChange={v => set('handles_phi', v)} />
                  <span className="text-white/70 text-sm">This business handles Protected Health Information (PHI) — requires BAA</span>
                </label>
                <div><Label className="text-white/60 mb-1.5">PHI Services Description</Label><Textarea value={data.phi_services_description} onChange={e => set('phi_services_description', e.target.value)} placeholder="Describe the services involving PHI..." className="bg-white/5 border-white/10 text-white" rows={2} /></div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2"><FileCheck className="w-5 h-5 text-[#A8C99B]" /> Review & Submit</h2>
                <p className="text-white/40 text-sm">Review your information below. On submit, we'll generate your three onboarding documents (MPA, Service Agreement, BAA) and email them to <strong className="text-white">{user?.email}</strong> for electronic signature.</p>

                <div className="space-y-3">
                  <ReviewCard title="Business" icon={Building2}>
                    <strong>{data.legal_business_name}</strong> ({data.entity_type})<br/>
                    {data.business_address}, {data.business_city}, {data.business_state} {data.business_zip}<br/>
                    EIN: {data.ein || '—'} · Industry: {data.industry}
                  </ReviewCard>
                  <ReviewCard title="Processing" icon={CreditCard}>
                    Volume: ${data.expected_monthly_volume}/mo · Avg: ${data.average_ticket_amount}<br/>
                    Cards: {data.accepted_card_brands.join(', ')}<br/>
                    Bank: {data.bank_name} ****{data.bank_account_last4}
                  </ReviewCard>
                  <ReviewCard title="Ownership" icon={Users}>
                    Signer: <strong>{data.signing_officer_name}</strong> ({data.signing_officer_title})<br/>
                    {data.signing_officer_email} · {data.signing_officer_phone}<br/>
                    Beneficial owners: {data.beneficial_owners.length} · Personal guarantee: {data.personal_guarantee_accepted ? '✓' : '✗'}
                  </ReviewCard>
                  <ReviewCard title="Services" icon={Package}>
                    {data.selected_services.length} services selected · ${data.monthly_fee}/mo · {data.service_term_months}mo term<br/>
                    Start: {data.start_date} · PHI: {data.handles_phi ? 'Yes' : 'No'}
                  </ReviewCard>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs">By submitting, you confirm all information is accurate. Your documents will be pre-filled with this data. You'll need to electronically sign each one.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="text-white/50 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={!canProceed()}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold">
              Continue <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={saving}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold">
              {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Submitting...</> : <>Submit & Generate Documents <FileCheck className="w-4 h-4 ml-1.5" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {title}</p>
      <p className="text-white/70 text-sm leading-relaxed">{children}</p>
    </div>
  );
}