import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function CatalogPackRequest() {
  const [form, setForm] = useState({ email: '', business_name: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setError('Enter the email the catalog should go to.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await base44.entities.PartnerReferral.create({
        name: form.business_name.trim() || 'RUO catalog request',
        email: form.email.trim(),
        business_name: form.business_name.trim() || undefined,
        service_interest: 'RUO bulk supply',
        notes: 'Requested the current RUO catalog and COA pack.',
        status: 'new',
      });
      setSent(true);
    } catch (err) {
      setError(err?.message || 'That request did not save. Try again, or email us directly.');
    } finally {
      setSaving(false);
    }
  };

  if (sent) {
    return (
      <div className="border border-site-line bg-site-surface p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Request received</p>
        <p className="mt-3 text-[14px] leading-relaxed text-site-moss">
          The current catalog and COA pack are on their way to {form.email}. A team member will respond
          within one business day for volume quotes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-site-line bg-site-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Catalog and COA pack</p>
      <h3 className="mt-3 font-display text-[24px] leading-tight text-site-moss">
        Request the current catalog and COA pack
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-site-greige">
        Sent as a document set. No cart, no account, no checkout on this site.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@lab.com"
            className="mt-1.5 w-full rounded-lg border border-site-line bg-site-cream px-3 py-2.5 text-[14px] outline-none focus:border-site-moss"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-site-moss">Lab or business name</span>
          <input
            type="text"
            value={form.business_name}
            onChange={update('business_name')}
            placeholder="Optional"
            className="mt-1.5 w-full rounded-lg border border-site-line bg-site-cream px-3 py-2.5 text-[14px] outline-none focus:border-site-moss"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-[12px] font-medium text-site-rust">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 w-full rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {saving ? 'Sending request...' : 'Request the catalog'}
      </button>
    </form>
  );
}