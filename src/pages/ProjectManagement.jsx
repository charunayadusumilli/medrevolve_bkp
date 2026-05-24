import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/auth/RequireAuth';
import TicketCard from '@/components/pm/TicketCard';
import NewTicketModal from '@/components/pm/NewTicketModal';
import MeetingTranscriptPanel from '@/components/pm/MeetingTranscriptPanel';
import {
  Plus, RefreshCw, Video, FileText, Filter,
  Ticket, Users, CheckCircle2, Clock, AlertTriangle, Zap,
  ChevronRight, Mic, Calendar, LayoutGrid
} from 'lucide-react';

const BUCKETS = ['all', 'support', 'engineering', 'marketing', 'operations', 'compliance', 'product', 'other'];
const BUCKET_EMOJI = { support: '🎧', engineering: '⚙️', marketing: '📣', operations: '🏗️', compliance: '🛡️', product: '🎯', other: '📋' };
const STATUSES = ['all', 'open', 'in_progress', 'review', 'resolved', 'closed'];

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function MeetingRow({ meeting, onProcess }) {
  const [showPanel, setShowPanel] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{meeting.title}</p>
            <div className="flex items-center gap-3 mt-0.5">
              {meeting.meet_link && (
                <a href={meeting.meet_link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline">Join Meeting</a>
              )}
              {meeting.start_time && (
                <span className="text-xs text-gray-400">{new Date(meeting.start_time).toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            meeting.transcription_status === 'completed' ? 'bg-green-100 text-green-700' :
            meeting.transcription_status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {meeting.transcription_status === 'completed' ? '✓ Processed' :
             meeting.transcription_status === 'processing' ? '⏳ Processing' : '◦ Pending'}
          </span>
          {meeting.tickets_created?.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
              🎫 {meeting.tickets_created.length} tickets
            </span>
          )}
          {meeting.transcription_status !== 'completed' && (
            <Button size="sm" variant="outline" onClick={() => setShowPanel(!showPanel)}
              className="text-xs border-violet-300 text-violet-700 hover:bg-violet-50">
              <Mic className="w-3 h-3 mr-1" /> Process
            </Button>
          )}
        </div>
      </div>

      {showPanel && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <MeetingTranscriptPanel
            meetingId={meeting.id}
            meeting={meeting}
            onComplete={() => { setShowPanel(false); onProcess?.(); }}
          />
        </div>
      )}

      {meeting.transcript_summary && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">AI Summary</p>
          <p className="text-xs text-gray-600">{meeting.transcript_summary}</p>
        </div>
      )}
    </div>
  );
}

function ProjectManagementInner() {
  const queryClient = useQueryClient();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [bucketFilter, setBucketFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [creatingMeeting, setCreatingMeeting] = useState(false);

  const { data: tickets = [], refetch: refetchTickets } = useQuery({
    queryKey: ['pm_tickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date', 200),
  });

  const { data: meetings = [], refetch: refetchMeetings } = useQuery({
    queryKey: ['pm_meetings'],
    queryFn: () => base44.entities.MeetingRecord.list('-created_date', 50),
  });

  const refresh = () => { refetchTickets(); refetchMeetings(); };

  // Stats
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length;
  const urgent = tickets.filter(t => t.priority === 'urgent' && t.status !== 'closed').length;

  // Filter tickets
  const filtered = tickets.filter(t => {
    if (bucketFilter !== 'all' && t.bucket !== bucketFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  // Group by bucket for board view
  const byBucket = BUCKETS.filter(b => b !== 'all').reduce((acc, b) => {
    acc[b] = filtered.filter(t => t.bucket === b);
    return acc;
  }, {});

  const handleCreateMeeting = async () => {
    if (!newMeetingTitle.trim()) return;
    setCreatingMeeting(true);
    const res = await base44.functions.invoke('createMedRevolveMeeting', {});
    const meetData = res.data;
    await base44.entities.MeetingRecord.create({
      title: newMeetingTitle,
      google_event_id: meetData.eventId,
      meet_link: meetData.meetLink,
      event_link: meetData.eventLink,
      organizer_email: 'rned@medrevolve.com',
      status: 'scheduled',
      transcription_status: 'pending',
    });
    setNewMeetingTitle('');
    setShowNewMeeting(false);
    setCreatingMeeting(false);
    refetchMeetings();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
            <p className="text-sm text-gray-500">Tickets, meetings, transcripts & AI-generated tasks</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewMeeting(true)}
              className="border-violet-300 text-violet-700 hover:bg-violet-50">
              <Video className="w-4 h-4 mr-1" /> New Meeting
            </Button>
            <Button size="sm" onClick={() => setShowNewTicket(true)} className="bg-[#4A6741] hover:bg-[#3d5636] text-white">
              <Plus className="w-4 h-4 mr-1" /> New Ticket
            </Button>
            <Button variant="ghost" size="icon" onClick={refresh}><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Open Tickets" value={open} icon={Ticket} color="bg-blue-500" />
          <StatCard label="In Progress" value={inProgress} icon={Clock} color="bg-purple-500" />
          <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="bg-green-500" />
          <StatCard label="Urgent" value={urgent} icon={AlertTriangle} color="bg-red-500" />
        </div>

        {/* New Meeting modal */}
        <AnimatePresence>
          {showNewMeeting && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-violet-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-violet-600" /> Create Google Meet + Record
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={e => setNewMeetingTitle(e.target.value)}
                  placeholder="Meeting title (e.g. Sprint Planning, Support Review)"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  onKeyDown={e => e.key === 'Enter' && handleCreateMeeting()}
                />
                <Button onClick={handleCreateMeeting} disabled={creatingMeeting || !newMeetingTitle.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white">
                  {creatingMeeting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Create'}
                </Button>
                <Button variant="ghost" onClick={() => setShowNewMeeting(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                📎 A Google Meet link will be created on your calendar. After the meeting, upload the recording or paste the transcript to auto-generate tickets.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="tickets">
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="tickets" className="rounded-lg text-xs data-[state=active]:bg-[#4A6741] data-[state=active]:text-white">
              <Ticket className="w-3.5 h-3.5 mr-1" /> All Tickets ({tickets.length})
            </TabsTrigger>
            <TabsTrigger value="board" className="rounded-lg text-xs data-[state=active]:bg-[#4A6741] data-[state=active]:text-white">
              <Filter className="w-3.5 h-3.5 mr-1" /> By Bucket
            </TabsTrigger>
            <TabsTrigger value="meetings" className="rounded-lg text-xs data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Video className="w-3.5 h-3.5 mr-1" /> Meetings & Transcripts ({meetings.length})
            </TabsTrigger>
          </TabsList>

          {/* ALL TICKETS */}
          <TabsContent value="tickets" className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {BUCKETS.map(b => (
                  <button key={b} onClick={() => setBucketFilter(b)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all font-medium capitalize ${
                      bucketFilter === b ? 'bg-[#4A6741] text-white border-[#4A6741]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>
                    {b !== 'all' ? BUCKET_EMOJI[b] + ' ' : ''}{b}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 flex-wrap">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all font-medium capitalize ${
                      statusFilter === s ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No tickets found</p>
                <p className="text-sm mt-1">Create a ticket manually or process a meeting recording</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} onUpdate={refetchTickets} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* BOARD VIEW */}
          <TabsContent value="board" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(byBucket).map(([bucket, bucketTickets]) => (
                <div key={bucket} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{BUCKET_EMOJI[bucket]}</span>
                      <span className="text-sm font-semibold text-gray-700 capitalize">{bucket}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">{bucketTickets.length}</span>
                  </div>
                  <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {bucketTickets.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No tickets</p>
                    ) : bucketTickets.map(t => (
                      <div key={t.id} className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-sm transition-shadow ${
                        t.priority === 'urgent' ? 'border-l-2 border-l-red-500 bg-red-50' :
                        t.priority === 'high' ? 'border-l-2 border-l-orange-400 bg-orange-50' : 'bg-gray-50'
                      }`}>
                        <p className="font-medium text-gray-800 line-clamp-2">{t.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'open' ? 'bg-blue-100 text-blue-700' :
                            t.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                            t.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>{t.status?.replace('_', ' ')}</span>
                          {t.priority === 'urgent' && <span className="text-red-500 font-bold text-[10px]">URGENT</span>}
                        </div>
                        {t.assigned_to_name && (
                          <p className="text-gray-400 mt-1 truncate">→ {t.assigned_to_name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* MEETINGS */}
          <TabsContent value="meetings" className="mt-4 space-y-3">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
              <Mic className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-violet-800">AI-Powered Meeting Pipeline</p>
                <p className="text-xs text-violet-600 mt-0.5">
                  Create a Google Meet → Hold the meeting → Upload the recording or paste the transcript → 
                  AI transcribes, summarizes, extracts action items, and auto-creates tickets assigned to your team.
                </p>
              </div>
            </div>

            {meetings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No meetings yet</p>
                <p className="text-sm mt-1">Click "New Meeting" to create a Google Meet link</p>
              </div>
            ) : (
              meetings.map(meeting => (
                <MeetingRow key={meeting.id} meeting={meeting} onProcess={refetchMeetings} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showNewTicket && (
        <NewTicketModal
          onClose={() => setShowNewTicket(false)}
          onCreated={() => { refetchTickets(); setShowNewTicket(false); }}
        />
      )}
    </div>
  );
}

export default function ProjectManagement() {
  return (
    <RequireAuth portalName="Project Management" requiredRole="admin">
      <ProjectManagementInner />
    </RequireAuth>
  );
}