import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Activity, Zap, CheckCircle2, XCircle, AlertCircle, RefreshCw,
  Settings, Building2, BarChart3, List, Eye, ToggleLeft, ToggleRight,
  Search, Filter, Clock, ArrowRight, Pill, Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const CATEGORY_COLORS = {
  'Weight Loss': 'bg-violet-100 text-violet-700',
  'Hormonal Support': 'bg-pink-100 text-pink-700',
  'Longevity': 'bg-amber-100 text-amber-700',
  'Sexual Health': 'bg-rose-100 text-rose-700',
  'Skin Care': 'bg-emerald-100 text-emerald-700',
  'Chronic Care': 'bg-blue-100 text-blue-700',
  'Preventative Care': 'bg-teal-100 text-teal-700',
  'Behavioral Health': 'bg-purple-100 text-purple-700',
  'Urgent Care Visit Types': 'bg-orange-100 text-orange-700',
  'Specialty Visits': 'bg-cyan-100 text-cyan-700',
};

export default function BelugaIntegration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const queryClient = useQueryClient();

  // Visit types
  const { data: visitTypes = [], isLoading: loadingVisitTypes, refetch: refetchVisitTypes } = useQuery({
    queryKey: ['belugaVisitTypes'],
    queryFn: () => base44.entities.BelugaVisitType.list('sort_order', 200)
  });

  // Visit logs
  const { data: visitLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['belugaVisitLogs'],
    queryFn: () => base44.entities.BelugaVisitLog.list('-created_date', 100)
  });

  // Dashboard stats from backend
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['belugaStats'],
    queryFn: async () => {
      const res = await base44.functions.invoke('belugaSyncStatus', { action: 'status' });
      return res.data;
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('belugaSyncStatus', { action: 'test_connection' });
      return res.data;
    },
    onSuccess: (data) => {
      setConnectionStatus(data);
    }
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('belugaSyncStatus', { action: 'sync_pending' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['belugaVisitLogs']);
      queryClient.invalidateQueries(['belugaStats']);
    }
  });

  const toggleBelugaMutation = useMutation({
    mutationFn: async ({ id, enabled }) => {
      await base44.entities.BelugaVisitType.update(id, { beluga_enabled: enabled });
    },
    onSuccess: () => refetchVisitTypes()
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }) => {
      await base44.entities.BelugaVisitType.update(id, { is_active: active });
    },
    onSuccess: () => refetchVisitTypes()
  });

  const categories = [...new Set(visitTypes.map(v => v.category))].filter(Boolean);

  const filteredVisitTypes = visitTypes.filter(v => {
    const matchesSearch = !searchQuery || 
      v.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.beluga_visit_type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || v.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    submitted: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#2D3A2D]">Beluga Health Integration</h1>
            </div>
            <p className="text-[#5A6B5A] text-sm ml-13">
              Manage the Beluga Health API handshake and your whitelabel visit types
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="rounded-full border-[#4A6741] text-[#4A6741]"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              Sync Pending
            </Button>
            <Button
              size="sm"
              onClick={() => testConnectionMutation.mutate()}
              disabled={testConnectionMutation.isPending}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Zap className="w-4 h-4 mr-1.5" />
              Test Connection
            </Button>
          </div>
        </div>

        {/* Connection Status Banner */}
        {connectionStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-2xl p-4 flex items-center gap-3 border ${
              connectionStatus.connected
                ? 'bg-green-50 border-green-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            {connectionStatus.connected
              ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            }
            <div>
              <p className={`font-semibold text-sm ${connectionStatus.connected ? 'text-green-800' : 'text-amber-800'}`}>
                {connectionStatus.message}
              </p>
              {!connectionStatus.connected && (
                <p className="text-xs text-amber-700 mt-0.5">
                  Set BELUGA_API_KEY and BELUGA_PARTNER_ID in Dashboard → Settings → Secrets to activate the API. All visits will use whitelabel mode until then.
                </p>
              )}
            </div>
            <button onClick={() => setConnectionStatus(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-lg">&times;</button>
          </motion.div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Visits', value: stats?.total ?? visitLogs.length, color: 'text-blue-600' },
            { label: 'Beluga API', value: stats?.beluga ?? 0, color: 'text-indigo-600' },
            { label: 'Whitelabel', value: stats?.whitelabel ?? visitLogs.filter(l => l.submission_mode === 'whitelabel').length, color: 'text-teal-600' },
            { label: 'Approved', value: stats?.approved ?? visitLogs.filter(l => l.status === 'approved').length, color: 'text-green-600' },
            { label: 'Pending', value: stats?.pending ?? visitLogs.filter(l => l.status === 'pending' || l.status === 'submitted').length, color: 'text-amber-600' },
            { label: 'Errors', value: stats?.errors ?? visitLogs.filter(l => l.status === 'error').length, color: 'text-red-600' },
          ].map((stat, i) => (
            <Card key={i} className="border-[#E8E0D5]">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-[#5A6B5A] mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="visit_types">
          <TabsList className="mb-6 bg-[#F5F0E8] rounded-xl p-1">
            <TabsTrigger value="visit_types" className="rounded-lg text-sm">
              <List className="w-4 h-4 mr-1.5" /> Visit Types ({visitTypes.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-lg text-sm">
              <Activity className="w-4 h-4 mr-1.5" /> Visit Logs ({visitLogs.length})
            </TabsTrigger>
            <TabsTrigger value="setup" className="rounded-lg text-sm">
              <Settings className="w-4 h-4 mr-1.5" /> Setup Guide
            </TabsTrigger>
          </TabsList>

          {/* VISIT TYPES TAB */}
          <TabsContent value="visit_types">
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search visit types..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl border-[#E8E0D5]"
                />
              </div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8E0D5] bg-white text-sm text-[#2D3A2D]"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {filteredVisitTypes.map((vt) => (
                <Card key={vt.id} className={`border-[#E8E0D5] transition-all ${!vt.is_active ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-[#2D3A2D] text-sm">{vt.display_name}</span>
                          <Badge className={`text-xs ${CATEGORY_COLORS[vt.category] || 'bg-gray-100 text-gray-700'}`}>
                            {vt.category}
                          </Badge>
                          {!vt.is_active && <Badge variant="outline" className="text-xs text-gray-400">Inactive</Badge>}
                          {vt.requires_lab && <Badge className="text-xs bg-yellow-100 text-yellow-700">Requires Lab</Badge>}
                          {vt.requires_photo && <Badge className="text-xs bg-blue-100 text-blue-700">Requires Photo</Badge>}
                        </div>
                        <p className="text-xs text-[#5A6B5A]">{vt.description}</p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">Beluga: {vt.beluga_visit_type || '—'}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Beluga toggle */}
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={() => toggleBelugaMutation.mutate({ id: vt.id, enabled: !vt.beluga_enabled })}
                            className="flex items-center gap-1 text-xs"
                            title="Toggle Beluga API routing"
                          >
                            {vt.beluga_enabled
                              ? <ToggleRight className="w-5 h-5 text-blue-500" />
                              : <ToggleLeft className="w-5 h-5 text-gray-400" />
                            }
                          </button>
                          <span className="text-[10px] text-gray-400">Beluga API</span>
                        </div>
                        {/* Active toggle */}
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={() => toggleActiveMutation.mutate({ id: vt.id, active: !vt.is_active })}
                            className="flex items-center gap-1 text-xs"
                            title="Toggle active status"
                          >
                            {vt.is_active
                              ? <ToggleRight className="w-5 h-5 text-green-500" />
                              : <ToggleLeft className="w-5 h-5 text-gray-400" />
                            }
                          </button>
                          <span className="text-[10px] text-gray-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* VISIT LOGS TAB */}
          <TabsContent value="logs">
            {loadingLogs ? (
              <div className="text-center py-12 text-[#5A6B5A]">Loading logs...</div>
            ) : visitLogs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E0D5]">
                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-[#5A6B5A]">No visit logs yet. Visits will appear here as patients submit intake forms.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visitLogs.map(log => (
                  <Card key={log.id} className="border-[#E8E0D5]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm text-[#2D3A2D]">{log.patient_email}</span>
                            <Badge className={`text-xs ${statusColor[log.status] || 'bg-gray-100 text-gray-700'}`}>
                              {log.status}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${log.submission_mode === 'beluga' ? 'border-blue-300 text-blue-600' : 'border-teal-300 text-teal-600'}`}>
                              {log.submission_mode === 'beluga' ? '🔗 Beluga' : '🏥 Whitelabel'}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#5A6B5A]">{log.beluga_visit_type}</p>
                          {log.beluga_visit_id && (
                            <p className="text-xs text-gray-400 mt-0.5 font-mono">Beluga ID: {log.beluga_visit_id}</p>
                          )}
                          {log.error_message && (
                            <p className="text-xs text-red-500 mt-0.5">{log.error_message}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">
                            {log.submitted_at ? format(new Date(log.submitted_at), 'MMM d, yyyy h:mm a') : '—'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* SETUP GUIDE TAB */}
          <TabsContent value="setup">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-[#E8E0D5]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    Beluga Health API Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { step: 1, title: 'Get API Credentials', desc: 'Contact Beluga Health at api@belugahealth.com to request your Partner API Key and Partner ID.' },
                      { step: 2, title: 'Set Secrets', desc: 'In Dashboard → Settings → Secrets, add: BELUGA_API_KEY and BELUGA_PARTNER_ID.' },
                      { step: 3, title: 'Test Connection', desc: 'Click "Test Connection" above to verify the API is reachable.' },
                      { step: 4, title: 'Enable Visit Types', desc: 'Toggle "Beluga API" on each visit type to route submissions through Beluga.' },
                    ].map(s => (
                      <div key={s.step} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {s.step}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#2D3A2D]">{s.title}</p>
                          <p className="text-xs text-[#5A6B5A]">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8E0D5]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-500" />
                    Whitelabel Mode (Current)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[#5A6B5A]">
                    While Beluga credentials are not configured, all visits run in <strong>Whitelabel Mode</strong>:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Patient intake forms captured in your database',
                      'Admin notified of every new visit request',
                      'Patient receives confirmation email',
                      'Appointment record created for provider assignment',
                      'Full prescribing and fulfillment via your pharmacy network',
                      'AutoRx plans for recurring prescriptions',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#5A6B5A]">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                    <p className="text-xs text-teal-700 font-medium">
                      You are fully operational in whitelabel mode. Beluga integration is an optional enhancement that routes clinical decisions through their provider network.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}