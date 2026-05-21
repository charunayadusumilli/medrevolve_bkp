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
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Zap,
  Send, Search, Settings, Activity, List, ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function QualiphyIntegration() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteResult, setInviteResult] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const queryClient = useQueryClient();

  // Fetch provider intakes for Qualiphy invite management
  const { data: providers = [], isLoading: loadingProviders, refetch: refetchProviders } = useQuery({
    queryKey: ['providerIntakesQualiphy'],
    queryFn: () => base44.entities.ProviderIntake.list('-created_date', 100)
  });

  // Fetch available exams from Qualiphy
  const { data: examsData, isLoading: loadingExams, refetch: refetchExams } = useQuery({
    queryKey: ['qualiphyExams'],
    queryFn: async () => {
      const res = await base44.functions.invoke('qualiphyGetExams', {});
      return res.data;
    },
    retry: false,
  });

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await base44.functions.invoke('qualiphyGetExams', {});
      if (res.data?.error) {
        setConnectionStatus({ connected: false, message: `Connection failed: ${res.data.error}` });
      } else {
        const examCount = Array.isArray(res.data) ? res.data.length : Object.keys(res.data || {}).length;
        setConnectionStatus({ connected: true, message: `Connected to Qualiphy — ${examCount} exam type(s) available` });
      }
    } catch (e) {
      setConnectionStatus({ connected: false, message: `Error: ${e.message}` });
    }
    setTestingConnection(false);
  };

  const sendInvite = async () => {
    if (!inviteEmail || !inviteName) return;
    setSendingInvite(true);
    setInviteResult(null);
    try {
      const res = await base44.functions.invoke('qualiphySendInvite', { email: inviteEmail, name: inviteName });
      setInviteResult({ success: true, message: 'Exam invite sent successfully!', data: res.data });
      setInviteEmail('');
      setInviteName('');
    } catch (e) {
      setInviteResult({ success: false, message: e.message });
    }
    setSendingInvite(false);
  };

  const sendInviteToProvider = async (provider) => {
    try {
      await base44.functions.invoke('qualiphySendInvite', { email: provider.email, name: provider.full_name });
      await base44.entities.ProviderIntake.update(provider.id, { status: 'under_review' });
      refetchProviders();
      queryClient.invalidateQueries(['providers']);
    } catch (e) {
      alert('Failed to send invite: ' + e.message);
    }
  };

  const approveProvider = async (provider) => {
    await base44.entities.ProviderIntake.update(provider.id, { status: 'approved' });
    refetchProviders();
    queryClient.invalidateQueries(['providers']);
  };

  const rejectProvider = async (provider) => {
    await base44.entities.ProviderIntake.update(provider.id, { status: 'rejected' });
    refetchProviders();
    queryClient.invalidateQueries(['providers']);
  };

  const filteredProviders = providers.filter(p =>
    !searchQuery ||
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const stats = [
    { label: 'Total Applicants', value: providers.length, color: 'text-blue-600' },
    { label: 'Pending Review', value: providers.filter(p => p.status === 'pending').length, color: 'text-amber-600' },
    { label: 'Under Review', value: providers.filter(p => p.status === 'under_review').length, color: 'text-blue-600' },
    { label: 'Approved', value: providers.filter(p => p.status === 'approved').length, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#2D3A2D]">Qualiphy Integration</h1>
            </div>
            <p className="text-[#5A6B5A] text-sm ml-13">
              Send medical qualification exam invites to providers & manage credentialing
            </p>
          </div>
          <Button
            size="sm"
            onClick={testConnection}
            disabled={testingConnection}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Zap className={`w-4 h-4 mr-1.5 ${testingConnection ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-2xl p-4 flex items-center gap-3 border ${
              connectionStatus.connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            {connectionStatus.connected
              ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            }
            <p className={`font-semibold text-sm ${connectionStatus.connected ? 'text-green-800' : 'text-red-800'}`}>
              {connectionStatus.message}
            </p>
            <button onClick={() => setConnectionStatus(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-lg">&times;</button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card key={i} className="border-[#E8E0D5]">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-[#5A6B5A] mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="providers">
          <TabsList className="mb-6 bg-[#F5F0E8] rounded-xl p-1">
            <TabsTrigger value="providers" className="rounded-lg text-sm">
              <List className="w-4 h-4 mr-1.5" /> Provider Applications ({providers.length})
            </TabsTrigger>
            <TabsTrigger value="send_invite" className="rounded-lg text-sm">
              <Send className="w-4 h-4 mr-1.5" /> Send Invite
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg text-sm">
              <Activity className="w-4 h-4 mr-1.5" /> Available Exams
            </TabsTrigger>
            <TabsTrigger value="setup" className="rounded-lg text-sm">
              <Settings className="w-4 h-4 mr-1.5" /> Setup
            </TabsTrigger>
          </TabsList>

          {/* PROVIDERS TAB */}
          <TabsContent value="providers">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-[#E8E0D5]"
              />
            </div>
            <div className="space-y-3">
              {filteredProviders.map(p => (
                <Card key={p.id} className="border-[#E8E0D5]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-[#2D3A2D]">{p.full_name}, {p.title}</span>
                          <Badge className={`text-xs ${statusColor[p.status] || 'bg-gray-100 text-gray-700'}`}>
                            {p.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#5A6B5A]">{p.email} · {p.specialty}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          License: {p.license_number} · States: {p.states_licensed?.join(', ') || 'N/A'} · {p.years_experience || '?'} yrs exp
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied: {format(new Date(p.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {p.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-violet-300 text-violet-700 hover:bg-violet-50"
                            onClick={() => sendInviteToProvider(p)}
                          >
                            <Send className="w-3 h-3 mr-1" /> Send Qualiphy Exam
                          </Button>
                        )}
                        {(p.status === 'under_review' || p.status === 'pending') && (
                          <Button
                            size="sm"
                            className="text-xs bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => approveProvider(p)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                          </Button>
                        )}
                        {p.status !== 'rejected' && p.status !== 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => rejectProvider(p)}
                          >
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredProviders.length === 0 && (
                <div className="text-center py-12 text-[#5A6B5A]">No provider applications yet.</div>
              )}
            </div>
          </TabsContent>

          {/* SEND INVITE TAB */}
          <TabsContent value="send_invite">
            <Card className="border-[#E8E0D5] max-w-lg">
              <CardHeader>
                <CardTitle className="text-base">Send Qualiphy Exam Invite</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#2D3A2D]">Provider Name</Label>
                  <Input
                    placeholder="Dr. Jane Smith"
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                    className="mt-1 border-[#E8E0D5] rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#2D3A2D]">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="provider@example.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="mt-1 border-[#E8E0D5] rounded-xl"
                  />
                </div>
                {inviteResult && (
                  <div className={`p-3 rounded-xl text-sm ${inviteResult.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    {inviteResult.success ? '✅' : '❌'} {inviteResult.message}
                    {inviteResult.data?.invite_url && (
                      <div className="mt-1">
                        <a href={inviteResult.data.invite_url} target="_blank" rel="noopener noreferrer" className="text-violet-600 underline text-xs">
                          Exam link → {inviteResult.data.invite_url}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                  onClick={sendInvite}
                  disabled={sendingInvite || !inviteEmail || !inviteName}
                >
                  {sendingInvite ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Exam Invite
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EXAMS TAB */}
          <TabsContent value="exams">
            {loadingExams ? (
              <div className="text-center py-12 text-[#5A6B5A]">Loading exam types from Qualiphy...</div>
            ) : examsData?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-700 font-medium">Could not load exams</p>
                <p className="text-red-500 text-sm mt-1">{examsData.error}</p>
                <Button variant="outline" size="sm" onClick={refetchExams} className="mt-4">
                  <RefreshCw className="w-4 h-4 mr-1" /> Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {(Array.isArray(examsData) ? examsData : []).map((exam, i) => (
                  <Card key={i} className="border-[#E8E0D5]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm text-[#2D3A2D]">{exam.name || exam.exam_name || JSON.stringify(exam).substring(0, 60)}</p>
                          {exam.description && <p className="text-xs text-[#5A6B5A] mt-0.5">{exam.description}</p>}
                          {exam.id && <p className="text-xs text-gray-400 font-mono mt-1">ID: {exam.id}</p>}
                        </div>
                        {exam.duration && <Badge variant="outline" className="text-xs">{exam.duration} min</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!Array.isArray(examsData) || examsData.length === 0) && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E0D5]">
                    <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#5A6B5A]">No exam types returned. Check your API key or click Test Connection.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* SETUP TAB */}
          <TabsContent value="setup">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-[#E8E0D5]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="w-5 h-5 text-violet-500" />
                    Qualiphy API Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, title: 'Get API Key', desc: 'Log in to qualiphy.me → Settings → API to find your API key.' },
                    { step: 2, title: 'Set Secret', desc: 'In Base44 Dashboard → Settings → Secrets, set QUALIPHY_API_KEY to your key. ✅ Already configured.' },
                    { step: 3, title: 'Test Connection', desc: 'Click "Test Connection" above to verify the API is working and fetch available exam types.' },
                    { step: 4, title: 'Send Invites', desc: 'Use the "Send Invite" tab or click "Send Qualiphy Exam" on any pending provider application.' },
                  ].map(s => (
                    <div key={s.step} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#2D3A2D]">{s.title}</p>
                        <p className="text-xs text-[#5A6B5A]">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-[#E8E0D5]">
                <CardHeader>
                  <CardTitle className="text-base">Provider Credentialing Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { step: '1. Apply', desc: 'Provider fills out application at /ProviderIntake — saved to DB, email + SMS alert sent to admin.' },
                    { step: '2. Review', desc: 'Admin reviews in this dashboard. Click "Send Qualiphy Exam" to trigger credential verification.' },
                    { step: '3. Qualiphy Exam', desc: 'Provider receives email with exam link. Completes medical knowledge & licensing verification.' },
                    { step: '4. Approve/Reject', desc: 'Admin approves or rejects based on exam results. Status updates in DB.' },
                    { step: '5. Onboarding', desc: 'Approved providers move to contract stage and get added to the telehealth provider pool.' },
                  ].map(s => (
                    <div key={s.step} className="flex gap-3 text-sm">
                      <span className="font-bold text-violet-700 flex-shrink-0 w-20">{s.step}</span>
                      <span className="text-[#5A6B5A]">{s.desc}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}