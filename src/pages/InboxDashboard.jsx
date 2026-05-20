import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Mail, Clock, CheckCircle, AlertCircle, ArrowLeft,
  RefreshCw, Tag, User, Calendar, ChevronRight
} from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'text-[#A8C99B]', bg: 'bg-[#A8C99B]/10', dot: 'bg-[#A8C99B]' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
  resolved: { label: 'Resolved', color: 'text-white/30', bg: 'bg-white/5', dot: 'bg-white/20' },
};

function stripGmailTag(subject) {
  return (subject || '').replace(/^\[Gmail:[^\]]+\]\s*/, '');
}

export default function InboxDashboard() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 100),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ContactRequest.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactRequests'] }),
  });

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const newCount = requests.filter(r => r.status === 'new').length;

  const openRequest = (r) => {
    setSelected(r);
    if (r.status === 'new') updateStatus.mutate({ id: r.id, status: 'in_progress' });
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#A8C99B]" />
              <h1 className="text-2xl font-black" style={{ letterSpacing: '-0.02em' }}>Inbox</h1>
              {newCount > 0 && (
                <span className="bg-[#A8C99B] text-[#0A1628] text-xs font-black px-2 py-0.5 rounded-full">{newCount} new</span>
              )}
            </div>
            <p className="text-white/35 text-sm mt-1">Incoming inquiries from rned@medrevolve.com</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}
            className="text-white/50 hover:text-white border border-white/10 gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'new', 'in_progress', 'resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                filter === f ? 'bg-white text-[#0A1628] border-white' : 'text-white/40 border-white/10 hover:border-white/30 hover:text-white/70'
              }`}>
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {isLoading && (
              <div className="text-white/30 text-sm py-10 text-center">Loading emails...</div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="text-white/30 text-sm py-10 text-center border border-white/5 rounded-2xl">
                No inquiries yet. New emails from Gmail will appear here automatically.
              </div>
            )}
            <AnimatePresence>
              {filtered.map(r => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.new;
                const isActive = selected?.id === r.id;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <button onClick={() => openRequest(r)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isActive ? 'bg-white/8 border-white/20' : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'
                      }`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-sm text-white truncate">{r.name || r.email}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        </div>
                      </div>
                      <p className="text-white/50 text-xs truncate mb-1">{stripGmailTag(r.subject) || '(no subject)'}</p>
                      <p className="text-white/25 text-xs line-clamp-2">{r.message?.substring(0, 100)}</p>
                      <p className="text-white/20 text-[10px] mt-2">
                        {new Date(r.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-2xl text-white/20">
                <Mail className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Select an inquiry to read it</p>
              </div>
            ) : (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/3 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white mb-1">{stripGmailTag(selected.subject) || '(no subject)'}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selected.name}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                        {new Date(selected.created_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[selected.status]?.bg} ${STATUS_CONFIG[selected.status]?.color}`}>
                    {STATUS_CONFIG[selected.status]?.label}
                  </div>
                </div>

                <div className="bg-[#060F1E] rounded-xl p-5 mb-5 whitespace-pre-wrap text-sm text-white/70 leading-relaxed max-h-96 overflow-y-auto">
                  {selected.message || '(empty)'}
                </div>

                <div className="flex gap-3 flex-wrap">
                  {selected.status !== 'in_progress' && (
                    <Button size="sm" variant="outline"
                      className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                      onClick={() => { updateStatus.mutate({ id: selected.id, status: 'in_progress' }); setSelected({ ...selected, status: 'in_progress' }); }}>
                      Mark In Progress
                    </Button>
                  )}
                  {selected.status !== 'resolved' && (
                    <Button size="sm" variant="outline"
                      className="border-[#A8C99B]/30 text-[#A8C99B] hover:bg-[#A8C99B]/10"
                      onClick={() => { updateStatus.mutate({ id: selected.id, status: 'resolved' }); setSelected({ ...selected, status: 'resolved' }); }}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                    </Button>
                  )}
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white/50 border border-white/10 hover:border-white/30 hover:text-white transition-all">
                    <Mail className="w-3.5 h-3.5" /> Reply via Email
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}