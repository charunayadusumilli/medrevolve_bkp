import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Calendar, Play, ExternalLink, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function TelephonyDashboard() {
  const [filter, setFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: contactRequests, isLoading, refetch } = useQuery({
    queryKey: ['ctm-contacts', filter, refreshKey],
    queryFn: async () => {
      return await base44.entities.ContactRequest.list('-created_date', 200);
    },
  });

  const stats = {
    total: contactRequests?.length || 0,
    calls: contactRequests?.filter(r => r.source === 'ctm_call').length || 0,
    callbacks: contactRequests?.filter(r => ['website_form', 'direct'].includes(r.source)).length || 0,
    texts: contactRequests?.filter(r => ['ctm_text', 'twilio_sms'].includes(r.source)).length || 0,
    avgDuration: (() => {
      const calls = contactRequests?.filter(r => r.source === 'ctm_call' && r.call_duration_seconds) || [];
      if (!calls.length) return 0;
      const total = calls.reduce((sum, c) => sum + (c.call_duration_seconds || 0), 0);
      return Math.round(total / calls.length);
    })(),
  };

  const filteredData = contactRequests?.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'callbacks') return ['website_form', 'direct'].includes(r.source);
    if (filter === 'texts') return ['ctm_text', 'twilio_sms'].includes(r.source);
    if (filter === 'calls') return r.source === 'ctm_call';
    return true;
  }) || [];

  const getSourceIcon = (source) => {
    switch (source) {
      case 'ctm_call': return <PhoneIncoming className="w-4 h-4" />;
      case 'ctm_form': return <Phone className="w-4 h-4" />;
      case 'ctm_text': return <PhoneOutgoing className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const getSourceBadge = (source) => {
    const config = {
      ctm_call: { label: 'CTM Call', color: 'bg-blue-500/10 text-blue-600' },
      ctm_form: { label: 'CTM Form', color: 'bg-cyan-500/10 text-cyan-600' },
      ctm_text: { label: 'CTM Text', color: 'bg-purple-500/10 text-purple-600' },
      twilio_sms: { label: 'SMS', color: 'bg-purple-500/10 text-purple-600' },
      website_form: { label: 'Callback Request', color: 'bg-green-500/10 text-green-600' },
      direct: { label: 'Direct', color: 'bg-orange-500/10 text-orange-600' },
    };
    const c = config[source] || { label: source, color: 'bg-gray-500/10 text-gray-600' };
    return <Badge className={c.color}>{c.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D] mb-2">Telephony Dashboard</h1>
            <p className="text-[#5A6B5A]/70">Google Voice intake line (704) 426-3311 · CTM · SMS lead capture</p>
          </div>
          <Button onClick={() => { setRefreshKey(k => k + 1); refetch(); }} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-4 p-3 bg-[#4A6741]/10 border border-[#4A6741]/20 rounded-lg flex items-center gap-2 text-sm text-[#2D3A2D]">
          <Phone className="w-4 h-4 text-[#4A6741]" />
          <span>Google Voice Intake Line: <strong>(704) 426-3311</strong> — All callback form submissions are tracked below.</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-[#4A6741]/20">
            <CardHeader className="pb-3">
              <CardDescription>Total Intakes</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#4A6741]/20">
            <CardHeader className="pb-3">
              <CardDescription>CTM Calls</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.calls}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#4A6741]/20">
            <CardHeader className="pb-3">
              <CardDescription>Callback Requests</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.callbacks}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#4A6741]/20">
            <CardHeader className="pb-3">
              <CardDescription>Texts / SMS</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{stats.texts}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="text-xs">
            All
          </Button>
          <Button variant={filter === 'calls' ? 'default' : 'outline'} onClick={() => setFilter('calls')} className="text-xs gap-1">
            <PhoneIncoming className="w-3 h-3" /> CTM Calls
          </Button>
          <Button variant={filter === 'callbacks' ? 'default' : 'outline'} onClick={() => setFilter('callbacks')} className="text-xs gap-1">
            <Phone className="w-3 h-3" /> Callbacks
          </Button>
          <Button variant={filter === 'texts' ? 'default' : 'outline'} onClick={() => setFilter('texts')} className="text-xs gap-1">
            <PhoneOutgoing className="w-3 h-3" /> Texts
          </Button>
        </div>

        {/* Leads Table */}
        <Card className="border-[#4A6741]/20">
          <CardHeader>
            <CardTitle className="text-[#2D3A2D]">Recent Leads</CardTitle>
            <CardDescription>All intake submissions — callback requests, CTM calls, and SMS leads</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-[#5A6B5A]/50">Loading leads...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-[#5A6B5A]/50">No leads yet. CTM webhook will populate this table when calls/forms/texts come in.</div>
            ) : (
              <div className="space-y-3">
                {filteredData.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#4A6741]/5 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center text-[#4A6741]">
                        {getSourceIcon(lead.source)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#2D3A2D]">{lead.name}</span>
                          {getSourceBadge(lead.source)}
                          {lead.call_duration_seconds && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {Math.floor(lead.call_duration_seconds / 60)}m {lead.call_duration_seconds % 60}s
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-[#5A6B5A]/70">
                          {lead.phone} • {lead.subject}
                        </div>
                        <div className="text-xs text-[#5A6B5A]/50 mt-1">
                          {format(new Date(lead.created_date), 'MMM d, yyyy h:mm a')} • Tracking #: {lead.call_tracking_number}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.call_recording_url && (
                        <Button variant="outline" size="sm" onClick={() => window.open(lead.call_recording_url, '_blank')} className="gap-1">
                          <Play className="w-3 h-3" /> Recording
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => window.open(`https://app.calltrackingmetrics.com`, '_blank')} className="gap-1">
                        <ExternalLink className="w-3 h-3" /> CTM
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-[#4A6741]/20 mt-6">
          <CardHeader>
            <CardTitle className="text-[#2D3A2D]">CTM Setup Guide</CardTitle>
            <CardDescription>Configure Call Tracking Metrics to capture leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-[#5A6B5A]">
            <ol className="list-decimal list-inside space-y-2">
              <li>Create account at <a href="https://www.calltrackingmetrics.com" target="_blank" className="text-[#4A6741] hover:underline">calltrackingmetrics.com</a></li>
              <li>Add tracking numbers (local/toll-free) for each campaign</li>
              <li>Configure call forwarding to your business line or Google Voice</li>
              <li>Enable call recording and transcription in CTM settings</li>
              <li>Go to Settings → Integrations → Webhooks</li>
              <li>Add webhook URL: <code className="bg-[#1a1a1a] text-[#8B9A8B] px-2 py-1 rounded text-xs">https://your-app.base44.app/functions/ctmWebhook</code></li>
              <li>Subscribe to events: <strong>call.completed</strong>, <strong>form.submitted</strong>, <strong>text.received</strong></li>
              <li>Set webhook secret (optional): Add <code className="bg-[#1a1a1a] text-[#8B9A8B] px-2 py-1 rounded text-xs">CTM_WEBHOOK_SECRET</code> to app secrets</li>
            </ol>
            <div className="mt-4 p-4 bg-[#4A6741]/10 rounded-lg">
              <strong className="text-[#2D3A2D]">💡 Pro Tip:</strong> Use CTM's dynamic number insertion (DNI) on your website to show different tracking numbers per visitor source (Google Ads, Facebook, organic, etc.)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}