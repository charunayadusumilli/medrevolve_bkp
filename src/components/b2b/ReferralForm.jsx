import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_OPTIONS } from '@/lib/partner/offerings';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  business_name: '',
  website_url: '',
  service_interest: SERVICE_OPTIONS[0],
  referred_by: '',
};

const FIELD =
  'mt-1.5 w-full rounded-lg border border-site-line bg-site-cream px-3 py-2.5 text-[14px] outline-none focus:border-site-moss';

export default function ReferralForm() {
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await base44.entities.PartnerReferral.create({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        business_name: form.business_name.trim() || undefined,
        website_url: form.website_url.trim() || undefined,
        service_interest: form.service_interest,
        referred_by: form.referred_by.trim() || undefined,
        status: 'new',
      });
      setSaved(true);
    } catch (err) {
      setError(err?.message || 'That did not save. Try again, or email us directly.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="border border-site-line bg-site-surface p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Referral received</p>
        <h3 className="mt-3 font-display text-[26px] leading-tight text-site-moss">
          A team member will respond within one business day.
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-site-greige">
          You will get a named point of contact and a fixed-price scope for {form.service_interest.toLowerCase()}{' '}
          before any hourly work begins.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-site-line bg-site-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Full name</span>
          <input type="text" value={form.name} onChange={update('name')} className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Email</span>
          <input type="email" value={form.email} onChange={update('email')} className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Phone</span>
          <input type="tel" value={form.phone} onChange={update('phone')} className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Business name</span>
          <input type="text" value={form.business_name} onChange={update('business_name')} className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Website URL</span>
          <input type="text" value={form.website_url} onChange={update('website_url')} placeholder="https://" className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">What you need</span>
          <select value={form.service_interest} onChange={update('service_interest')} className={FIELD}>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[12px] font-semibold text-site-moss">How were you referred</span>
          <input type="text" value={form.referred_by} onChange={update('referred_by')} className={FIELD} />
        </label>
      </div>

      {error && <p className="mt-4 text-[12px] font-medium text-site-rust">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 w-full rounded-lg bg-site-rust px-6 py-3.5 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {saving ? 'Sending...' : 'Send referral'}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-site-greige">
        Referral details are stored so the team can track the kickoff. No marketing signup is created.
      </p>
    </form>
  );
}