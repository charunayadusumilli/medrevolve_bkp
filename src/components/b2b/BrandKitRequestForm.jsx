import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { trackEvent } from '@/lib/tracking';

const FIELD =
  'mt-1.5 w-full rounded-lg border border-site-line bg-site-cream px-3 py-2.5 text-[14px] outline-none focus:border-site-moss';

export default function BrandKitRequestForm({ serviceName }) {
  const [form, setForm] = useState({ name: '', email: '', business_name: '' });
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
        business_name: form.business_name.trim() || undefined,
        service_interest: serviceName,
        referred_by: 'Media kit request',
        notes: `Full brand kit requested for ${serviceName}.`,
        status: 'new',
      });
      trackEvent('form_submit', { service_interest: serviceName });
      base44.functions
        .invoke('notifyPartnerReferral', {
          name: form.name.trim(),
          email: form.email.trim(),
          service_interest: serviceName,
          business_name: form.business_name.trim() || undefined,
          notes: 'Full brand kit requested',
        })
        .catch(() => {});
      setSaved(true);
    } catch (err) {
      setError(err?.message || 'That did not save. Try again, or email us directly.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="border border-site-line bg-site-surface p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Request received</p>
        <h3 className="mt-3 font-display text-[24px] leading-tight text-site-moss">
          The full brand kit is on its way.
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-site-greige">
          A media partner contact will send the logo files, colours, typography and approved copy within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-site-line bg-site-surface p-6 sm:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
        Brand kit
      </p>
      <h3 className="mt-2 font-display text-[24px] leading-tight text-site-moss">
        Request the full brand kit
      </h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-site-greige">
        Logos, colour values, typography and approved copy for {serviceName}.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Full name</span>
          <input type="text" value={form.name} onChange={update('name')} className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Email</span>
          <input type="email" value={form.email} onChange={update('email')} className={FIELD} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[12px] font-semibold text-site-moss">Channel or business name</span>
          <input
            type="text"
            value={form.business_name}
            onChange={update('business_name')}
            className={FIELD}
          />
        </label>
      </div>

      {error && <p className="mt-4 text-[12px] font-medium text-site-rust">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 w-full rounded-lg bg-site-rust px-6 py-3.5 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {saving ? 'Sending...' : 'Request the kit'}
      </button>
    </form>
  );
}