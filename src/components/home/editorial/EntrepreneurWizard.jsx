import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const BUSINESS_TYPES = [
  ['Med Spa / Clinic', 'Med Spa'],
  ['Gym / Fitness', 'Fitness / Gym'],
  ['Entrepreneur / Startup', 'Entrepreneur / Startup'],
  ['Wellness Center', 'Wellness Clinic'],
  ['Healthcare Provider', 'Healthcare Provider'],
  ['Other', 'Other'],
];
const STAGES = [
  ['Pre-launch', 'Pre-launch'],
  ['Startup (under $10k/mo)', 'Startup (under $10k/mo)'],
  ['Growth ($10k–$50k/mo)', 'Growth ($10k–$50k/mo)'],
  ['Established ($50k+/mo)', 'Established ($50k+/mo)'],
];
const GOALS = [
  ['Launch a B2B telehealth platform', 'Launch B2B Platform'],
  ['White-label telehealth', 'White Label Telehealth'],
  ['Add GLP-1 to my business', 'Add GLP-1 to Existing Business'],
  ['RUO research products', 'RUO Research Products'],
  ['Other', 'Other'],
];

const STEPS = ['Your business', 'Your stage', 'Your goal', 'Contact'];

export default function EntrepreneurWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    business_type: '', business_size: '', primary_interest: '',
    full_name: '', email: '', phone: '', business_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const canNext = step === 0 ? !!data.business_type
    : step === 1 ? !!data.business_size
      : step === 2 ? !!data.primary_interest
        : !!data.full_name && !!data.email;

  const submit = async () => {
    setSubmitting(true); setError('');
    try {
      await base44.functions.invoke('submitCustomerIntake', {
        ...data,
        customer_type: 'B2B Merchant',
        preferred_next_step: 'Book consultation / demo call',
        consultation_preference: 'ASAP',
      });
      setDone(true);
    } catch (e) { setError(e.message || 'Something went wrong. Please try again.'); }
    finally { setSubmitting(false); }
  };
  const next = () => (step < 3 ? setStep(s => s + 1) : submit());
  const back = () => setStep(s => Math.max(0, s - 1));

  const Choice = ({ value, label, onClick }) => (
    <button onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-semibold transition-all ${
        value ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
      }`}>
      {label}
    </button>
  );

  return (
    <section id="qualify" className="bg-white py-20 px-6 scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">See if you qualify</span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mt-3" style={{ letterSpacing: '-0.02em' }}>
            Build your launch profile.
          </h2>
          <p className="text-stone-500 mt-3 text-sm">A few questions — a specialist will follow up within 24 hours.</p>
        </div>

        <div className="bg-[#F9F7F2] rounded-3xl p-7 md:p-10 border border-stone-200">
          {/* progress */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-[#1A1A1A]' : 'bg-stone-200'}`} />
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${i <= step ? 'text-[#1A1A1A]' : 'text-stone-400'}`}>{s}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-display text-2xl text-[#1A1A1A] mb-2">You're qualified.</h3>
                <p className="text-stone-600 text-sm max-w-sm mx-auto">
                  We've received your details. A MedRevolve specialist will reach out within 24 hours to build your launch roadmap.
                </p>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-2.5">
                    {BUSINESS_TYPES.map(([label, val]) => (
                      <Choice key={val} value={data.business_type === val} label={label} onClick={() => set('business_type', val)} />
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-2.5">
                    {STAGES.map(([label, val]) => (
                      <Choice key={val} value={data.business_size === val} label={label} onClick={() => set('business_size', val)} />
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-2.5">
                    {GOALS.map(([label, val]) => (
                      <Choice key={val} value={data.primary_interest === val} label={label} onClick={() => set('primary_interest', val)} />
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Full name</label>
                      <input value={data.full_name} onChange={e => set('full_name', e.target.value)}
                        className="w-full mt-1.5 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:border-stone-400 outline-none" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Email</label>
                      <input type="email" value={data.email} onChange={e => set('email', e.target.value)}
                        className="w-full mt-1.5 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:border-stone-400 outline-none" placeholder="jane@brand.com" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Phone (optional)</label>
                      <input value={data.phone} onChange={e => set('phone', e.target.value)}
                        className="w-full mt-1.5 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:border-stone-400 outline-none" placeholder="(240) 387-5224" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Business name (optional)</label>
                      <input value={data.business_name} onChange={e => set('business_name', e.target.value)}
                        className="w-full mt-1.5 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:border-stone-400 outline-none" placeholder="Your Brand Co." />
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-xs mt-4">{error}</p>}

                <div className="flex items-center justify-between mt-8">
                  <button onClick={back} disabled={step === 0}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-[#1A1A1A] disabled:opacity-30 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={next} disabled={!canNext || submitting}
                    className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-black disabled:opacity-40 transition-colors">
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</>
                      : step < 3 ? <>Continue <ArrowRight className="w-4 h-4" /></>
                        : <>Submit <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}