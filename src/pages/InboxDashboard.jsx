import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mail, Clock, CheckCircle, RefreshCw, User, Calendar,
  Phone, Zap, ExternalLink, PhoneCall, MessageSquare, FileText,
  BarChart2, Filter
} from 'lucide-react';

const STATUS_CONFIG = {
  new:               { label: 'New',               color: 'text-[#A8C99B]',  bg: 'bg-[#A8C99B]/10',  dot: 'bg-[#A8C99B]' },
  in_progress:       { label: 'In Progress',        color: 'text-amber-400',  bg: 'bg-amber-400/10',  dot: 'bg-amber-400' },
  meeting_scheduled: { label: 'Meeting Scheduled',  color: 'text-blue-400',   bg: 'bg-blue-400/10',   dot: 'bg-blue-400' },
  resolved:          { label: 'Resolved',           color: 'text-white/30',   bg: 'bg-white/5',       dot: 'bg-white/20' },
};

const SOURCE_ICONS = {
  ctm_call:    { icon: PhoneCall,     label: 'CTM Call',    color: 'text-purple-400' },
  ctm_text:    { icon: MessageSquare, label: 'CTM Text',    color: 'text-indigo-400' },
  ctm_form:    { icon: FileText,      label: 'CTM Form',    color: 'text-cyan-400' },
  gmail_inbox: { icon: Mail,          label: 'Gmail',       color: 'text-red-400' },
  website_form:{ icon: FileText,      label: 'Web Form',    color: 'text-[#A8C99B]' },
  twilio_sms:  { icon: MessageSquare, label: 'SMS',         color: 'text-yellow-400' },
  direct:      { icon: User,          label: 'Direct',      color: 'text-white/40' },
};

function stripGmailTag(subject) {
  return (subject || '').replace(/^\[Gmail:[^\]]+\]\s*/, '');
}

function formatDuration(secs) {
  if (!secs) return null;
  const m = Math.floor(secs / 60), s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function InboxDashboard() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [meetingTime, setMeetingTime] = useState('');
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState(null);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 200),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ContactRequest.update(id, { status }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
      if (selected?.id === vars.id) setSelected(prev => ({ ...prev, status: vars.status }));
    },
  });

  const updateNotes = useMutation({
    mutationFn: ({ id, notes }) => base44.entities.ContactRequest.update(id, { notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactRequests'] }),
  });

  const allSources = ['all', ...new Set(requests.map(r => r.source || 'website_form').filter(Boolean))];

  const filtered = requests.filter(r => {
    const statusOk = filter === 'all' || r.status === filter;
    const sourceOk = sourceFilter === 'all' || (r.source || 'website_form') === sourceFilter;
    return statusOk && sourceOk;
  });

  const newCount = requests.filter(r => r.status === 'new').length;
  const counts = {
    total: requests.length,
    new: newCount,
    calls: requests.filter(r => r.source === 'ctm_call').length,
    deals: requests.filter(r => r.hubspot_deal_id).length,
  };

  const openRequest = (r) => {
    setSelected(r);
    setCampaignResult(null);
    if (r.status === 'new') updateStatus.mutate({ id: r.id, status: 'in_progress' });
  };

  const handleTriggerCampaign = async () => {
    if (!selected) return;
    setCampaignLoading(true);
    setCampaignResult(null);
    try {
      const res = await base44.functions.invoke('triggerCRMCampaign', {
        contact_request_id: selected.id,
        meeting_time: meetingTime || undefined,
      });
      setCampaignResult({ success: true, data: res.data });
      setSelected(prev => ({
        ...prev,
        campaign_sent: true,
        hubspot_deal_id: res.data?.hubspot_deal_id,
        meeting_link: res.data?.meeting_link,
        status: meetingTime ? 'meeting_scheduled' : prev.status,
      }));
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    } catch (e) {
      setCampaignResult({ success: false, error: e.message });
    }
    setCampaignLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#A8C99B]" />
              <h1 className="text-2xl font-black" style={{ letterSpacing: '-0.02em' }}>Lead Inbox</h1>
              {newCount > 0 && (
                <span className="bg-[#A8C99B] text-[#0A1628] text-xs font-black px-2 py-0.5 rounded-full">{newCount} new</span>
              )}
            </div>
            <p className="text-white/35 text-sm mt-1">Gmail · CTM Calls · Web Forms — all in one place</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}
            className="text-white/50 hover:text-white border border-white/10 gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Leads', value: counts.total, color: 'text-white' },
            { label: 'New', value: counts.new, color: 'text-[#A8C99B]' },
            { label: 'CTM Calls', value: counts.calls, color: 'text-purple-400' },
            { label: 'HubSpot Deals', value: counts.deals, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/5 rounded-xl px-4 py-3">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex gap-1.5">
            {['all', 'new', 'in_progress', 'meeting_scheduled', 'resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  filter === f ? 'bg-white text-[#0A1628] border-white' : 'text-white/40 border-white/10 hover:border-white/30 hover:text-white/70'
                }`}>
                {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 ml-auto">
            {allSources.filter(s => s !== 'all' && SOURCE_ICONS[s]).map(s => {
              const cfg = SOURCE_ICONS[s];
              const Icon = cfg?.icon;
              return (
                <button key={s} onClick={() => setSourceFilter(sourceFilter === s ? 'all' : s)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                    sourceFilter === s ? `bg-white/10 border-white/30 ${cfg?.color}` : 'text-white/30 border-white/8 hover:border-white/20'
                  }`}>
                  {Icon && <Icon className="w-3 h-3" />} {cfg?.label || s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* List */}
          <div className="lg:col-span-2 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
            {isLoading && <div className="text-white/30 text-sm py-10 text-center">Loading leads...</div>}
            {!isLoading && filtered.length === 0 && (
              <div className="text-white/30 text-sm py-10 text-center border border-white/5 rounded-2xl">
                No leads match this filter.
              </div>
            )}
            <AnimatePresence>
              {filtered.map(r => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.new;
                const srcCfg = SOURCE_ICONS[r.source || 'website_form'] || SOURCE_ICONS.direct;
                const SrcIcon = srcCfg.icon;
                const isActive = selected?.id === r.id;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <button onClick={() => openRequest(r)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isActive ? 'bg-white/8 border-white/20' : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'
                      }`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-sm text-white truncate">{r.name || r.email}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <SrcIcon className={`w-3 h-3 ${srcCfg.color}`} />
                          <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        </div>
                      </div>
                      <p className="text-white/50 text-xs truncate mb-1">{stripGmailTag(r.subject) || '(no subject)'}</p>
                      {r.phone && <p className="text-white/35 text-xs mb-1">📞 {r.phone}</p>}
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-white/20 text-[10px]">
                          {new Date(r.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {r.campaign_sent && <span className="text-[10px] text-blue-400 font-semibold">✓ CRM</span>}
                        {r.hubspot_deal_id && <span className="text-[10px] text-orange-400 font-semibold">🟠 Deal</span>}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-2xl text-white/20">
                <Mail className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Select a lead to view details & take action</p>
              </div>
            ) : (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-5">

                {/* Title row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white mb-2">{stripGmailTag(selected.subject) || '(no subject)'}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/40">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selected.name}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />
                        <a href={`mailto:${selected.email}`} className="hover:text-white transition-colors">{selected.email}</a>
                      </span>
                      {selected.phone && (
                        <span className="flex items-center gap-1 text-[#A8C99B]"><Phone className="w-3 h-3" />
                          <a href={`tel:${selected.phone}`} className="hover:text-white transition-colors">{selected.phone}</a>
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                        {new Date(selected.created_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {selected.source && (
                        <span className={`flex items-center gap-1 ${SOURCE_ICONS[selected.source]?.color || 'text-white/40'}`}>
                          {selected.source.replace(/_/g, ' ')}
                        </span>
                      )}
                      {selected.call_duration_seconds && (
                        <span className="flex items-center gap-1 text-purple-400">⏱ {formatDuration(selected.call_duration_seconds)}</span>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${STATUS_CONFIG[selected.status]?.bg} ${STATUS_CONFIG[selected.status]?.color}`}>
                    {STATUS_CONFIG[selected.status]?.label}
                  </div>
                </div>

                {/* Call recording */}
                {selected.call_recording_url && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-center gap-3">
                    <PhoneCall className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-xs text-purple-300 flex-1">Call recording available</span>
                    <a href={selected.call_recording_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-200 flex items-center gap-1">
                      Listen <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Message */}
                <div className="bg-[#060F1E] rounded-xl p-4 whitespace-pre-wrap text-sm text-white/70 leading-relaxed max-h-56 overflow-y-auto">
                  {selected.message || '(empty)'}
                </div>

                {/* HubSpot / Meeting links */}
                {(selected.hubspot_deal_id || selected.meeting_link) && (
                  <div className="flex gap-3 flex-wrap">
                    {selected.hubspot_deal_id && (
                      <a href={`https://app.hubspot.com/contacts/deals/${selected.hubspot_deal_id}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-400 border border-orange-400/20 hover:bg-orange-400/10 transition-all">
                        🟠 View HubSpot Deal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selected.meeting_link && (
                      <a href={selected.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 border border-blue-400/20 hover:bg-blue-400/10 transition-all">
                        📅 Meeting Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* CRM Campaign section */}
                {!selected.campaign_sent && (
                  <div className="bg-[#0A1628] border border-white/10 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#A8C99B]" /> Launch CRM Campaign
                    </p>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Sends a personalized follow-up email, creates a HubSpot deal, and optionally schedules a Google Meet.
                    </p>
                    <div>
                      <label className="text-xs text-white/40 mb-1 block">Schedule Meeting (optional)</label>
                      <Input type="datetime-local" value={meetingTime} onChange={e => setMeetingTime(e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-xs h-8 rounded-lg" />
                    </div>
                    <Button size="sm" onClick={handleTriggerCampaign} disabled={campaignLoading}
                      className="bg-[#4A6741] hover:bg-[#3D5636] text-white gap-2 w-full">
                      <Zap className="w-3.5 h-3.5" />
                      {campaignLoading ? 'Launching...' : 'Launch Campaign + Book Meeting'}
                    </Button>
                    {campaignResult && (
                      <div className={`text-xs p-2 rounded-lg ${campaignResult.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {campaignResult.success
                          ? `✅ Campaign sent! Deal: ${campaignResult.data?.hubspot_deal_id || 'created'}`
                          : `❌ Error: ${campaignResult.error}`}
                      </div>
                    )}
                  </div>
                )}

                {selected.campaign_sent && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-xs text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> CRM campaign already launched for this lead
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block font-semibold uppercase tracking-wider">Internal Notes</label>
                  <textarea
                    defaultValue={selected.notes || ''}
                    onBlur={e => updateNotes.mutate({ id: selected.id, notes: e.target.value })}
                    placeholder="Add notes..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/70 resize-none h-20 focus:outline-none focus:border-white/20"
                  />
                </div>

                {/* Status actions */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {selected.status !== 'in_progress' && (
                    <Button size="sm" variant="outline" className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                      onClick={() => updateStatus.mutate({ id: selected.id, status: 'in_progress' })}>
                      Mark In Progress
                    </Button>
                  )}
                  {selected.status !== 'meeting_scheduled' && (
                    <Button size="sm" variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                      onClick={() => updateStatus.mutate({ id: selected.id, status: 'meeting_scheduled' })}>
                      <Calendar className="w-3.5 h-3.5 mr-1" /> Meeting Scheduled
                    </Button>
                  )}
                  {selected.status !== 'resolved' && (
                    <Button size="sm" variant="outline" className="border-[#A8C99B]/30 text-[#A8C99B] hover:bg-[#A8C99B]/10"
                      onClick={() => updateStatus.mutate({ id: selected.id, status: 'resolved' })}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolved
                    </Button>
                  )}
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white/50 border border-white/10 hover:border-white/30 hover:text-white transition-all">
                    <Mail className="w-3.5 h-3.5" /> Reply
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#A8C99B]/70 border border-[#A8C99B]/20 hover:border-[#A8C99B]/40 hover:text-[#A8C99B] transition-all">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}