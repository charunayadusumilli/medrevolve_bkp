import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Video, MessageCircle, CalendarClock, X, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * ConnectNow — "Talk to Raj" widget.
 * Shows live availability, offers an instant Google Meet when Raj is free,
 * a message that alerts him once, and the free Calendly intro call any time.
 *
 * <ConnectNow />          inline card (Contact page, ForBusiness)
 * <ConnectNow floating /> bottom-right launcher on every page
 */
export default function ConnectNow({ floating = false }) {
  const [open, setOpen] = useState(!floating);
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState(null); // 'meet' | 'chat'
  const [form, setForm] = useState({ name: '', email: '', company: '', topic: '' });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const loadStatus = async () => {
    try {
      const r = await base44.functions.invoke('connectNow', { action: 'status' });
      setStatus(r.data || r);
    } catch { setStatus({ available: false, reason: 'Availability unknown', booking_url: 'https://calendly.com/rned-medrevolve/medrevolve-intro-call' }); }
  };
  useEffect(() => { if (open) { loadStatus(); const t = setInterval(loadStatus, 60000); return () => clearInterval(t); } }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const r = await base44.functions.invoke('connectNow', { action: mode, ...form });
      const d = r.data || r;
      if (d.error) throw new Error(d.error);
      setResult(d);
      if (mode === 'meet' && d.meet_link) window.open(d.meet_link, '_blank', 'noopener');
    } catch (err) { setError(err.message || 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };

  const bookingUrl = status?.booking_url || 'https://calendly.com/rned-medrevolve/medrevolve-intro-call';
  const available = !!status?.available;

  const card = (
    <div className={`bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 ${floating ? 'w-[360px] max-w-[calc(100vw-32px)]' : 'w-full max-w-xl'} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-4 bg-[#0B0F0E] text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#4A6741] flex items-center justify-center font-bold">R</div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0F0E] ${status ? (available ? 'bg-green-400' : 'bg-gray-400') : 'bg-yellow-400'}`} />
          </div>
          <div>
            <div className="text-sm font-semibold">Talk to Raj</div>
            <div className="text-xs text-white/60">{status ? status.reason : 'Checking availability...'}</div>
          </div>
        </div>
        {floating && <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>}
      </div>

      <div className="p-5">
        {result ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[#4A6741] mx-auto mb-3" />
            <p className="font-semibold mb-1">{result.message}</p>
            {result.meet_link && <a href={result.meet_link} target="_blank" rel="noreferrer" className="inline-block mt-3 bg-[#4A6741] text-white px-5 py-2.5 rounded-lg font-semibold">Open Google Meet</a>}
            {result.mode === 'chat' && !result.raj_available && (
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="block mt-3 text-sm text-[#4A6741] font-semibold">Or book a free 20-min call</a>
            )}
            <p className="text-xs text-gray-500 mt-4">A confirmation was sent to {form.email}.</p>
          </div>
        ) : !mode ? (
          <div className="space-y-3">
            <button onClick={() => setMode('meet')} disabled={!available}
              className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${available ? 'border-[#4A6741] bg-[#4A6741]/5 hover:bg-[#4A6741]/10' : 'border-gray-200 opacity-50 cursor-not-allowed'}`}>
              <Video className="w-5 h-5 text-[#4A6741]" />
              <div>
                <div className="font-semibold text-sm">Google Meet right now</div>
                <div className="text-xs text-gray-500">{available ? '20 minutes, starts immediately' : status?.next_free_label ? `Raj is free again at ${status.next_free_label}` : (status?.hours ? `Live hours: ${status.hours}` : 'Not available right now')}</div>
              </div>
            </button>
            <button onClick={() => setMode('chat')} className="w-full flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 transition">
              <MessageCircle className="w-5 h-5 text-[#4A6741]" />
              <div>
                <div className="font-semibold text-sm">Send Raj a message</div>
                <div className="text-xs text-gray-500">He replies personally, usually within the hour</div>
              </div>
            </button>
            <a href={bookingUrl} target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 transition">
              <CalendarClock className="w-5 h-5 text-[#4A6741]" />
              <div>
                <div className="font-semibold text-sm">Book a free intro call</div>
                <div className="text-xs text-gray-500">Pick a time, 15 to 30 minutes, Google Meet</div>
              </div>
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="text-sm font-semibold mb-1">{mode === 'meet' ? 'Start a Google Meet with Raj' : 'Message Raj'}</div>
            <Input required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input required type="email" placeholder="Work email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Company (optional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <Textarea required={mode === 'chat'} rows={3} placeholder={mode === 'meet' ? 'What would you like to cover? (optional)' : 'Your message'} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => { setMode(null); setError(''); }} className="flex-1">Back</Button>
              <Button type="submit" disabled={busy} className="flex-1 bg-[#4A6741] hover:bg-[#3d5636] text-white">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'meet' ? 'Start Meet' : 'Send'}
              </Button>
            </div>
            <p className="text-[11px] text-gray-400">No patient or health information here, please. This channel is for business and partnership conversations.</p>
          </form>
        )}
      </div>
    </div>
  );

  if (!floating) return card;
  return (
    <div className="fixed bottom-6 left-6 z-[55]">
      {open ? card : (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-[#4A6741] hover:bg-[#3d5636] text-white px-4 py-3 rounded-full shadow-xl font-semibold text-sm">
          <Video className="w-4 h-4" /> Talk to Raj
        </button>
      )}
    </div>
  );
}
