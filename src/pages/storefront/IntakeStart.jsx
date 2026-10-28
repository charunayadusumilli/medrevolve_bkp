import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { STOREFRONT_CATEGORIES, US_STATES, categoryLabel } from '@/lib/storefront/catalog';
import { applyStoreSeo } from '@/lib/storefront/seo';

const INTEREST = {
  'weight-loss': 'GLP-1 / Weight Loss',
  'sexual-health': "Men's Health / TRT",
  hair: 'Hair Health',
  skin: 'Skin Health',
  'mental-health': 'General Wellness',
  testosterone: "Men's Health / TRT",
  labs: 'General Wellness',
  'daily-wellness': 'Longevity / Peptides',
};

export default function IntakeStart() {
  const { category } = useParams();
  const location = useLocation();
  const banner = location.state?.banner;
  const productSlug = new URLSearchParams(location.search).get('product');
  const known = STOREFRONT_CATEGORIES.some((c) => c.slug === category);

  const [form, setForm] = useState({ full_name: '', email: '', state: '', notes: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    applyStoreSeo({
      title: `${categoryLabel(category)} intake — licensed provider review | MedRevolve`,
      description: `Start a secure ${categoryLabel(category).toLowerCase()} intake. A US-licensed provider reviews your history, usually within 24 hours.`,
      path: `/intake/${category}`,
    });
  }, [category]);

  useEffect(() => {
    base44.auth
      .me()
      .then((me) => setForm((f) => ({ ...f, full_name: f.full_name || me.full_name || '', email: f.email || me.email || '' })))
      .catch(() => {});
  }, []);

  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('saving');
    setError('');
    try {
      await base44.entities.CustomerIntake.create({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        customer_type: 'B2C Patient',
        primary_interest: INTEREST[category] || 'General Wellness',
        state: form.state,
        main_challenge: form.notes,
        preferred_contact_method: 'Email',
        status: 'new_lead',
        priority: 'warm',
        internal_notes: `Storefront intake · ${category}${productSlug ? ` · product: ${productSlug}` : ''}`,
      });
      setStatus('done');
    } catch (err) {
      setStatus('idle');
      setError(err?.message || 'We could not start your intake. Please try again.');
    }
  };

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
        <CheckCircle2 className="h-9 w-9 text-sf-accent" />
        <h1 className="mt-4 font-display text-[36px] tracking-tight">Intake started</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-sf-muted">
          We've saved your details for {categoryLabel(category).toLowerCase()}. Next, a licensed provider
          reviews your health history — usually within 24 hours — and you'll get an email with the clinical
          questionnaire and any follow-up questions.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/shop" className="rounded-full bg-sf-ink px-6 py-3 text-[13px] font-semibold text-white">
            Browse shop
          </Link>
          <Link to="/cart" className="rounded-full border border-sf-ink px-6 py-3 text-[13px] font-semibold text-sf-ink">
            View basket
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <nav className="flex items-center gap-2 text-[12px] text-sf-muted">
        <Link to="/" className="hover:text-sf-ink">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-sf-ink">Shop</Link>
        <span>/</span>
        <span className="text-sf-ink">Intake</span>
      </nav>

      {banner && (
        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-sf-sun/40 bg-sf-sun/10 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-[#8a5a12]" />
          <p className="text-[13px] leading-relaxed text-[#6d4710]">{banner}</p>
        </div>
      )}

      <h1 className="mt-6 font-display text-[38px] leading-tight tracking-tight sm:text-[44px]">
        {known ? `${categoryLabel(category)} intake` : 'Start your intake'}
      </h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-sf-muted">
        Tell us where to send your questionnaire. A US-licensed provider reviews your history before any
        prescription is written — nothing is charged for medication until treatment is approved.
      </p>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-sf-line bg-sf-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-semibold">Full name</span>
            <input
              required
              value={form.full_name}
              onChange={update('full_name')}
              className="mt-1.5 w-full rounded-xl border border-sf-line bg-sf-paper px-3 py-2.5 text-[13px] outline-none focus:border-sf-ink"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              className="mt-1.5 w-full rounded-xl border border-sf-line bg-sf-paper px-3 py-2.5 text-[13px] outline-none focus:border-sf-ink"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold">State</span>
            <select
              required
              value={form.state}
              onChange={update('state')}
              className="mt-1.5 w-full rounded-xl border border-sf-line bg-sf-paper px-3 py-2.5 text-[13px] outline-none focus:border-sf-ink"
            >
              <option value="">Select your state</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold">What are you hoping to treat? (optional)</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={update('notes')}
              className="mt-1.5 w-full rounded-xl border border-sf-line bg-sf-paper px-3 py-2.5 text-[13px] outline-none focus:border-sf-ink"
            />
          </label>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-[12px] text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={status === 'saving'}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sf-ink px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'saving' ? 'Starting intake…' : 'Continue intake'}
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-sf-muted">
          <Lock className="h-3.5 w-3.5" /> HIPAA-secure. We never sell your health information.
        </p>
      </form>

      <p className="mt-4 text-[11px] leading-relaxed text-sf-muted">
        Submitting this form does not create a provider-patient relationship or guarantee a prescription.
        A licensed provider will determine whether treatment is appropriate.
      </p>
    </div>
  );
}