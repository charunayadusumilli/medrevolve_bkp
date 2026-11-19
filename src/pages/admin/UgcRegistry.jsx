import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import UgcSlotForm from '@/components/admin/UgcSlotForm';

const SURFACES = ['home', 'catalog', 'product'];

export default function UgcRegistry() {
  const [slots, setSlots] = useState(null);
  const [editing, setEditing] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    base44.entities.UgcSlot.list({ sort: 'display_order', limit: 200 })
      .then((page) => { if (!cancelled) setSlots(page?.items ?? page ?? []); })
      .catch(() => { if (!cancelled) setSlots([]); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const refresh = () => { setEditing(null); setReloadKey((key) => key + 1); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Admin</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-slate-900">UGC asset registry</h1>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-500">
        Every slot on the research storefront, its current asset and where it points. Swapping a creative
        here changes the live store — no code deploy. Keep copy research-only: no dosing or human-use
        language.
      </p>

      <div className="mt-6">
        {editing ? (
          <UgcSlotForm slot={editing === 'new' ? null : editing} onSaved={refresh} onCancel={() => setEditing(null)} />
        ) : (
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="bg-slate-900 px-4 py-2 text-[12px] font-medium text-white"
          >
            Add slot
          </button>
        )}
      </div>

      {slots === null && <p className="mt-8 text-[12px] text-slate-400">Loading slots…</p>}

      {slots !== null && slots.length === 0 && (
        <p className="mt-8 border border-slate-200 bg-slate-50 p-6 text-[12px] text-slate-500">
          No slots yet. Add one per placement — the storefront hides a rail until it has an active slot.
        </p>
      )}

      {SURFACES.map((surface) => {
        const rows = (slots || []).filter((slot) => slot.surface === surface);
        if (rows.length === 0) return null;
        return (
          <section key={surface} className="mt-10">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">{surface}</h2>
            <div className="mt-3 overflow-x-auto border border-slate-200">
              <table className="w-full min-w-[720px] text-left text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.1em] text-slate-400">
                  <tr>
                    <th className="px-3 py-2 font-normal">Slot</th>
                    <th className="px-3 py-2 font-normal">Variant</th>
                    <th className="px-3 py-2 font-normal">Current asset</th>
                    <th className="px-3 py-2 font-normal">Destination</th>
                    <th className="px-3 py-2 font-normal">Live</th>
                    <th className="px-3 py-2 font-normal" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((slot) => (
                    <tr key={slot.id}>
                      <td className="px-3 py-3 font-mono text-[11px] text-slate-700">{slot.slot_id}</td>
                      <td className="px-3 py-3 text-slate-500">{slot.variant || 'video'}</td>
                      <td className="max-w-[240px] px-3 py-3 text-slate-500">
                        <span className="block truncate">{slot.video_url || slot.poster_url || '—'}</span>
                      </td>
                      <td className="max-w-[200px] px-3 py-3 text-slate-500">
                        <span className="block truncate">{slot.destination_url || '—'}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={slot.active === false ? 'text-slate-400' : 'text-emerald-700'}>
                          {slot.active === false ? 'Off' : 'On'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button type="button" onClick={() => setEditing(slot)} className="underline underline-offset-4">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}