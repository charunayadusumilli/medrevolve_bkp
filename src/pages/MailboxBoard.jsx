import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ExternalLink, RefreshCw, Search, Inbox, Users, Briefcase, Pill, Stethoscope, Scale, Wrench, Bell, Receipt } from 'lucide-react';

/**
 * MailboxBoard — a clean reader board for rned@medrevolve.com.
 * Reads the MailItem table (filled by the mailboxOrganizer function), so every subject
 * and sender is already decoded. Junk is filed in Gmail but never shown here.
 */

const FOLDERS = [
  { key: 'Inbox',               label: 'Inbox',             icon: Inbox,       hint: 'Human mail not yet matched to a partner' },
  { key: 'Partners/Telehealth', label: 'Telehealth',        icon: Stethoscope, hint: 'Medical groups and telehealth brands' },
  { key: 'Partners/Pharmacy',   label: 'Pharmacy',          icon: Pill,        hint: 'Compounding, wholesale, fulfillment' },
  { key: 'Partners/Providers',  label: 'Providers',         icon: Users,       hint: 'Clinics, med spas, medical directors' },
  { key: 'Partners/Attorneys',  label: 'Attorneys',         icon: Scale,       hint: 'Healthcare counsel' },
  { key: 'Partners/Vendors',    label: 'Vendors',           icon: Wrench,      hint: 'Payments, compliance, marketing, software' },
  { key: 'People',              label: 'People',            icon: Users,       hint: 'Noel, Karthik, Pehuen and the team' },
  { key: 'Leads/B2B',           label: 'B2B Leads',         icon: Briefcase,   hint: 'White-label and clinic inquiries' },
  { key: 'Accounts & Billing',  label: 'Accounts & Billing',icon: Receipt,     hint: 'Receipts, logins, renewals (archived)' },
  { key: 'System Alerts',       label: 'System Alerts',     icon: Bell,        hint: 'Mail the app sends to itself (archived)' },
];

const fmtDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                 : d.toLocaleDateString([], { month: 'short', day: 'numeric', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
};

export default function MailboxBoard() {
  const [folder, setFolder] = useState('Inbox');
  const [q, setQ] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data: user } = useQuery({ queryKey: ['user'], queryFn: () => base44.auth.me() });

  const { data: items = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['mailItems'],
    queryFn: () => base44.entities.MailItem.list('-received_at', 2000),
    enabled: user?.role === 'admin',
    refetchInterval: 120000,
  });

  const { data: states = [] } = useQuery({
    queryKey: ['mailboxState'],
    queryFn: () => base44.entities.MailboxState.list(),
    enabled: user?.role === 'admin',
    refetchInterval: 120000,
  });
  const cleanup = states.find(s => s.key === 'cleanup');

  const counts = useMemo(() => {
    const c = {};
    for (const it of items) {
      c[it.folder] = c[it.folder] || { total: 0, unread: 0 };
      c[it.folder].total++;
      if (it.is_unread) c[it.folder].unread++;
    }
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(it => it.folder === folder)
      .filter(it => !unreadOnly || it.is_unread)
      .filter(it => !needle || `${it.subject} ${it.from_name} ${it.from_email} ${it.snippet} ${it.partner_name || ''}`.toLowerCase().includes(needle));
  }, [items, folder, q, unreadOnly]);

  // Group by thread so a long back-and-forth shows once
  const threads = useMemo(() => {
    const seen = new Map();
    for (const it of shown) {
      const k = it.thread_id || it.gmail_id;
      const t = seen.get(k);
      if (!t) seen.set(k, { ...it, count: 1 });
      else { t.count++; if (it.is_unread) t.is_unread = true; }
    }
    return [...seen.values()];
  }, [shown]);

  if (user && user.role !== 'admin') {
    return <div className="max-w-3xl mx-auto p-10 text-center text-gray-500">Admin access required.</div>;
  }

  const active = FOLDERS.find(f => f.key === folder);

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2"><Mail className="w-6 h-6 text-[#A8C99B]" /> Mailbox Board</h1>
            <p className="text-sm text-white/50 mt-1">rned@medrevolve.com, organized by partner type. Subjects and senders are cleaned; junk is filed away and not shown.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/50">
            {cleanup && (
              <span>{cleanup.done ? `All ${cleanup.processed} existing messages organized` : `Cleanup in progress: ${cleanup.processed} organized so far`}</span>
            )}
            <Button variant="outline" size="sm" onClick={() => refetch()} className="border-white/10 text-white/70 hover:bg-white/5">
              <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-1">
            {FOLDERS.map(f => {
              const Icon = f.icon;
              const c = counts[f.key] || { total: 0, unread: 0 };
              const on = f.key === folder;
              return (
                <button key={f.key} onClick={() => setFolder(f.key)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${on ? 'bg-[#A8C99B]/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                  <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {f.label}</span>
                  <span className="flex items-center gap-2 text-xs">
                    {c.unread > 0 && <span className="rounded-full bg-[#A8C99B] text-black px-1.5 py-0.5 font-medium">{c.unread}</span>}
                    <span className="text-white/30">{c.total}</span>
                  </span>
                </button>
              );
            })}
          </aside>

          <main>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${active?.label || ''}`}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} className="accent-[#A8C99B]" /> Unread only
              </label>
              <span className="text-xs text-white/30">{active?.hint}</span>
            </div>

            {isLoading ? (
              <div className="text-white/40 text-sm py-20 text-center">Loading mail…</div>
            ) : threads.length === 0 ? (
              <div className="text-white/40 text-sm py-20 text-center">Nothing here{q ? ' for that search' : ''}.</div>
            ) : (
              <div className="divide-y divide-white/5 rounded-xl border border-white/10 overflow-hidden">
                {threads.map(t => (
                  <a key={t.gmail_id} href={t.gmail_url} target="_blank" rel="noreferrer"
                    className={`grid grid-cols-[minmax(140px,200px)_1fr_auto] gap-4 px-4 py-3 items-start hover:bg-white/5 transition ${t.is_unread ? 'bg-white/[0.03]' : ''}`}>
                    <div className="min-w-0">
                      <div className={`truncate text-sm ${t.is_unread ? 'font-semibold text-white' : 'text-white/80'}`} title={t.from_email}>{t.from_name || t.from_email}</div>
                      {t.partner_name && <div className="truncate text-xs text-[#A8C99B]/80">{t.partner_name}</div>}
                    </div>
                    <div className="min-w-0">
                      <div className={`truncate text-sm ${t.is_unread ? 'font-semibold text-white' : 'text-white/90'}`}>
                        {t.subject}{t.count > 1 && <span className="ml-2 text-xs text-white/30">({t.count})</span>}
                      </div>
                      <div className="truncate text-xs text-white/40 mt-0.5">{t.snippet}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40 whitespace-nowrap">
                      {fmtDate(t.received_at)} <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
