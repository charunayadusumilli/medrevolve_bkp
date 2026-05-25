import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, XCircle, Clock, Video } from 'lucide-react';
import { toast } from 'sonner';

export default function AppointmentsSyncPage() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments-sync'],
    queryFn: async () => {
      const all = await base44.entities.Appointment.list();
      return all.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
    },
  });

  const bulkSyncMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('bulkSyncAppointmentsToCalendar', {});
      return response.data;
    },
    onMutate: () => setSyncing(true),
    onSuccess: (data) => {
      setSyncing(false);
      queryClient.invalidateQueries({ queryKey: ['appointments-sync'] });
      toast.success(`Synced ${data.results.synced.length} appointments to Google Calendar!`);
    },
    onError: (error) => {
      setSyncing(false);
      toast.error(`Sync failed: ${error.message}`);
    },
  });

  const stats = {
    total: appointments?.length || 0,
    pending: appointments?.filter(a => a.status === 'pending').length || 0,
    synced: appointments?.filter(a => a.google_event_id).length || 0,
    unsynced: appointments?.filter(a => a.status === 'pending' && !a.google_event_id).length || 0,
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Appointment Sync Manager</h1>
            <p className="text-muted-foreground">Sync appointments to Google Calendar with Meet links</p>
          </div>
          <Button
            onClick={() => bulkSyncMutation.mutate()}
            disabled={syncing || stats.unsynced === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : `Sync ${stats.unsynced} Pending`}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Synced to Calendar</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.synced}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Needs Sync</CardTitle>
              <XCircle className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unsynced}</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-3">
                {appointments?.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        {apt.google_event_id ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{apt.patient_email}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(apt.appointment_date).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {apt.type} • Status: {apt.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {apt.google_meet_link ? (
                        <a
                          href={apt.google_meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          Join Meet
                        </a>
                      ) : (
                        <Badge variant="secondary">No Meet Link</Badge>
                      )}
                      <Badge variant={apt.status === 'pending' ? 'outline' : 'secondary'}>
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}