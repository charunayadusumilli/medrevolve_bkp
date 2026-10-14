import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle2, Mail, Phone, MessageCircle } from 'lucide-react';

const INTERESTS = ['Implementation', 'Infrastructure', 'Channel', 'Strategic', 'Not sure yet'];

export default function PartnershipInquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', partnership_interest: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.name.trim() && form.email.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(''); setSubmitting(true);
    try {
      await base44.functions.invoke('submitPartnershipInquiry', form);
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="bg-[#F7F4ED] py-24 px-6 lg:px-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Left: copy + contact */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">Partnership inquiry</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1F2D27] mt-4 mb-5" style={{ letterSpacing: '-0.02em' }}>
            Start a partnership.
          </h2>
          <p className="text-[#3A453E] text-sm leading-relaxed mb-8">
            Tell us where you are and what channel you need to open. We'll follow up with scope, timing, and a reference architecture overview.
          </p>

          <div className="space-y-4">
            <a href="mailto:rned@medrevolve.com" className="flex items-center gap-3 text-sm text-[#1F2D27] hover:text-[#A66B3C] transition-colors">
              <span className="w-10 h-10 bg-white border border-[#E4DED2] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-[#A66B3C]" />
              </span>
              rned@medrevolve.com
            </a>
            <a href="tel:+12403875224" className="flex items-center gap-3 text-sm text-[#1F2D27] hover:text-[#A66B3C] transition-colors">
              <span className="w-10 h-10 bg-white border border-[#E4DED2] flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-[#A66B3C]" />
              </span>
              (240) 387-5224
            </a>
            <a href="https://wa.me/12403875224" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[#1F2D27] hover:text-[#A66B3C] transition-colors">
              <span className="w-10 h-10 bg-white border border-[#E4DED2] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-[#A66B3C]" />
              </span>
              Message us on WhatsApp
            </a>
          </div>
        </div>

        {/* Right: form */}
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white border border-[#E4DED2] p-7 md:p-9">
          {done ? (
            <div className="text-center py-14">
              <div className="w-14 h-14 rounded-full bg-[#F7F4ED] border border-[#E4DED2] flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-[#A66B3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2D27] mb-2">Inquiry received.</h3>
              <p className="text-[#3A453E] text-sm max-w-xs mx-auto">
                Thank you — a MedRevolve partnerships lead will follow up shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3A453E]">Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required
                  className="w-full mt-1.5 px-4 py-3 border border-[#E4DED2] bg-[#FDFCFA] text-sm text-[#1F2D27] focus:border-[#A66B3C] outline-none"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3A453E]">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  className="w-full mt-1.5 px-4 py-3 border border-[#E4DED2] bg-[#FDFCFA] text-sm text-[#1F2D27] focus:border-[#A66B3C] outline-none"
                  placeholder="you@company.com" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3A453E]">Company</label>
                <input value={form.company} onChange={e => set('company', e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 border border-[#E4DED2] bg-[#FDFCFA] text-sm text-[#1F2D27] focus:border-[#A66B3C] outline-none"
                  placeholder="Company name" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3A453E]">Partnership interest</label>
                <select value={form.partnership_interest} onChange={e => set('partnership_interest', e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 border border-[#E4DED2] bg-[#FDFCFA] text-sm text-[#1F2D27] focus:border-[#A66B3C] outline-none">
                  <option value="">Select a model</option>
                  {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3A453E]">Message</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4}
                  className="w-full mt-1.5 px-4 py-3 border border-[#E4DED2] bg-[#FDFCFA] text-sm text-[#1F2D27] focus:border-[#A66B3C] outline-none resize-none"
                  placeholder="What channel are you trying to open?" />
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}

              <button type="submit" disabled={!canSubmit || submitting}
                className="w-full bg-[#A66B3C] text-white hover:bg-[#945E33] disabled:opacity-40 transition-colors py-4 text-sm font-bold inline-flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : 'Submit inquiry'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}