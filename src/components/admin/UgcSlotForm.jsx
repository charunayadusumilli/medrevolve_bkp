import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const EMPTY = {
  slot_id: '', surface: 'home', variant: 'video', poster_url: '', video_url: '',
  duration_seconds: 0, caption: '', headline: '', cta_label: '', destination_url: '',
  display_order: 0, active: true,
};

const input =
  'h-9 w-full border border-slate-200 bg-white px-2 text-[12px] outline-none focus:border-slate-400';

export default function UgcSlotForm({ slot, onSaved, onCancel }) {
  const [form, setForm] = useState(slot || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const save = async () => {
    if (!form.slot_id || !form.surface) {
      setError('A slot id and surface are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      duration_seconds: Number(form.duration_seconds) || 0,
      display_order: Number(form.display_order) || 0,
      active: form.active !== false,
    };
    try {
      if (slot?.id) await base44.entities.UgcSlot.update(slot.id, payload);
      else await base44.entities.UgcSlot.create(payload);
      onSaved();
    } catch (err) {
      setError(err?.message || 'The slot could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-[11px] text-slate-500">
          Slot id
          <input value={form.slot_id} onChange={set('slot_id')} placeholder="home-01" className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Surface
          <select value={form.surface} onChange={set('surface')} className={input}>
            <option value="home">Home</option>
            <option value="catalog">Catalog</option>
            <option value="product">Product</option>
          </select>
        </label>
        <label className="text-[11px] text-slate-500">
          Variant
          <select value={form.variant} onChange={set('variant')} className={input}>
            <option value="video">9:16 video</option>
            <option value="creative">Square creative</option>
          </select>
        </label>
        <label className="text-[11px] text-slate-500">
          Poster image URL
          <input value={form.poster_url} onChange={set('poster_url')} className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Video URL
          <input value={form.video_url} onChange={set('video_url')} className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Duration (seconds)
          <input value={form.duration_seconds} onChange={set('duration_seconds')} inputMode="numeric" className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Caption
          <input value={form.caption} onChange={set('caption')} className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Creative headline
          <input value={form.headline} onChange={set('headline')} className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          CTA label
          <input value={form.cta_label} onChange={set('cta_label')} className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Destination URL
          <input value={form.destination_url} onChange={set('destination_url')} className={input} />
        </label>
        <label className="text-[11px] text-slate-500">
          Display order
          <input value={form.display_order} onChange={set('display_order')} inputMode="numeric" className={input} />
        </label>
        <label className="flex items-center gap-2 pt-5 text-[11px] text-slate-500">
          <input
            type="checkbox"
            checked={form.active !== false}
            onChange={(event) => setForm({ ...form, active: event.target.checked })}
          />
          Active on the storefront
        </label>
      </div>

      {error && <p className="mt-3 text-[11px] text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-slate-900 px-4 py-2 text-[12px] font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : slot?.id ? 'Save slot' : 'Add slot'}
        </button>
        <button type="button" onClick={onCancel} className="border border-slate-300 px-4 py-2 text-[12px]">
          Cancel
        </button>
      </div>
    </div>
  );
}