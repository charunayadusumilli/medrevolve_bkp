import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RequireAuth from '@/components/auth/RequireAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  Plus,
  Edit,
  Video,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Ban
} from 'lucide-react';
import { format, parseISO, addDays, startOfWeek, isSameDay } from 'date-fns';

export default function ProviderDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [blockTimeDialogOpen, setBlockTimeDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get current provider (assumes logged-in user is a provider)
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // Fetch provider details
  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.Provider.list(),
    enabled: !!user,
  });

  const currentProvider = providers.find(p => p.created_by === user?.email);

  // Fetch appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', currentProvider?.id],
    queryFn: () => base44.entities.Appointment.filter({ provider_id: currentProvider?.id }, '-appointment_date'),
    enabled: !!currentProvider?.id,
  });

  // Fetch blocked times
  const { data: blockedTimes = [] } = useQuery({
    queryKey: ['blockedTimes', currentProvider?.id],
    queryFn: () => base44.entities.BlockedTime.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  // Fetch provider schedule
  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', currentProvider?.id],
    queryFn: () => base44.entities.ProviderSchedule.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  // Fetch consultation summaries
  const { data: consultations = [] } = useQuery({
    queryKey: ['consultations', currentProvider?.id],
    queryFn: () => base44.entities.ConsultationSummary.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  // Fetch prescriptions
  const { data: prescriptions = [] } = useQuery({
    queryKey: ['prescriptions', currentProvider?.id],
    queryFn: () => base44.entities.Prescription.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  // Filter appointments by status
  const upcomingAppointments = useMemo(() => {
    return appointments.filter(apt => 
      ['scheduled', 'confirmed'].includes(apt.status) &&
      new Date(apt.appointment_date) >= new Date()
    );
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.appointment_date), new Date())
    );
  }, [appointments]);

  // Block time mutation
  const blockTimeMutation = useMutation({
    mutationFn: (data) => base44.entities.BlockedTime.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedTimes'] });
      setBlockTimeDialogOpen(false);
    },
  });

  // Schedule mutation
  const scheduleMutation = useMutation({
    mutationFn: (data) => base44.entities.ProviderSchedule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setScheduleDialogOpen(false);
    },
  });

  // Update appointment status
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Appointment.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPatientHistory = (patientEmail) => {
    const patientConsultations = consultations.filter(c => c.patient_email === patientEmail);
    const patientPrescriptions = prescriptions.filter(p => p.patient_email === patientEmail);
    const patientAppointments = appointments.filter(a => a.patient_email === patientEmail);
    return { consultations: patientConsultations, prescriptions: patientPrescriptions, appointments: patientAppointments };
  };

  return (
    <RequireAuth portalName="Provider Portal">
      <div className="min-h-screen bg-[#FDFBF7] py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!currentProvider ? (
          <div className="flex items-center justify-center py-32 text-center">
            <div>
              <h2 className="text-2xl font-bold text-[#2D3A2D] mb-2">No Provider Profile Found</h2>
              <p className="text-[#5A6B5A]">Your account is not linked to a provider profile yet. Please contact an admin.</p>
            </div>
          </div>
        ) : (
        <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
            Welcome back, <span className="font-medium">{currentProvider.name}</span>
          </h1>
          <p className="text-[#5A6B5A]">{currentProvider.title} • {currentProvider.specialty}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5A6B5A]">Today's Appointments</p>
                  <p className="text-3xl font-semibold text-[#2D3A2D]">{todayAppointments.length}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-[#4A6741]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5A6B5A]">Upcoming</p>
                  <p className="text-3xl font-semibold text-[#2D3A2D]">{upcomingAppointments.length}</p>
                </div>
                <Clock className="w-8 h-8 text-[#4A6741]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5A6B5A]">Total Consultations</p>
                  <p className="text-3xl font-semibold text-[#2D3A2D]">{currentProvider.total_consultations || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-[#4A6741]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5A6B5A]">Rating</p>
                  <p className="text-3xl font-semibold text-[#2D3A2D]">{currentProvider.rating || 'N/A'}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-[#4A6741]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Time</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {appointmentsLoading ? (
              <p className="text-[#5A6B5A]">Loading appointments...</p>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-[#5A6B5A] mx-auto mb-4" />
                  <p className="text-[#5A6B5A]">No upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const history = getPatientHistory(appointment.patient_email);
                  return (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-[#4A6741]" />
                              </div>
                              <div>
                                <p className="font-medium text-[#2D3A2D]">{appointment.patient_email}</p>
                                <p className="text-sm text-[#5A6B5A]">{appointment.type.replace('_', ' ')}</p>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
                                <CalendarIcon className="w-4 h-4" />
                                {format(parseISO(appointment.appointment_date), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(appointment.appointment_date), 'h:mm a')}
                              </div>
                            </div>

                            {appointment.reason && (
                              <p className="text-sm text-[#5A6B5A] mb-3">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                            )}

                            {appointment.notes && (
                              <p className="text-sm text-[#5A6B5A] mb-3">
                                <span className="font-medium">Patient Notes:</span> {appointment.notes}
                              </p>
                            )}

                            {/* Patient History */}
                            {history.appointments.length > 1 && (
                              <div className="mt-4 p-3 bg-[#F5F3EF] rounded-lg">
                                <p className="text-xs font-medium text-[#2D3A2D] mb-2">Patient History</p>
                                <div className="grid grid-cols-3 gap-4 text-xs text-[#5A6B5A]">
                                  <div>
                                    <span className="font-medium">Previous Visits:</span> {history.appointments.length - 1}
                                  </div>
                                  <div>
                                    <span className="font-medium">Consultations:</span> {history.consultations.length}
                                  </div>
                                  <div>
                                    <span className="font-medium">Prescriptions:</span> {history.prescriptions.length}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            {appointment.status === 'scheduled' && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentMutation.mutate({ id: appointment.id, status: 'confirmed' })}
                                className="bg-[#4A6741] hover:bg-[#3D5636]"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirm
                              </Button>
                            )}
                            {['scheduled', 'confirmed'].includes(appointment.status) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    updateAppointmentMutation.mutate({ id: appointment.id, status: 'in_progress' });
                                    window.location.href = createPageUrl(`VideoCall?id=${appointment.id}`);
                                  }}
                                >
                                  <Video className="w-4 h-4 mr-2" />
                                  Start Call
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentMutation.mutate({ id: appointment.id, status: 'cancelled' })}
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium text-[#2D3A2D]">Weekly Schedule</h2>
              <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4A6741] hover:bg-[#3D5636]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Weekly Schedule</DialogTitle>
                  </DialogHeader>
                  <ScheduleForm 
                    providerId={currentProvider.id} 
                    onSubmit={(data) => scheduleMutation.mutate(data)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
                const daySchedules = schedules.filter(s => s.day_of_week === index);
                return (
                  <Card key={day}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-[#2D3A2D]">{day}</h3>
                          {daySchedules.length === 0 ? (
                            <p className="text-sm text-[#5A6B5A]">No schedule set</p>
                          ) : (
                            <div className="mt-2 space-y-1">
                              {daySchedules.map(schedule => (
                                <p key={schedule.id} className="text-sm text-[#5A6B5A]">
                                  {schedule.start_time} - {schedule.end_time}
                                  {!schedule.is_available && ' (Unavailable)'}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Blocked Time Tab */}
          <TabsContent value="blocked" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium text-[#2D3A2D]">Blocked Time Slots</h2>
              <Dialog open={blockTimeDialogOpen} onOpenChange={setBlockTimeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4A6741] hover:bg-[#3D5636]">
                    <Plus className="w-4 h-4 mr-2" />
                    Block Time
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block Time Slot</DialogTitle>
                  </DialogHeader>
                  <BlockTimeForm 
                    providerId={currentProvider.id} 
                    onSubmit={(data) => blockTimeMutation.mutate(data)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {blockedTimes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Ban className="w-12 h-12 text-[#5A6B5A] mx-auto mb-4" />
                  <p className="text-[#5A6B5A]">No blocked time slots</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {blockedTimes.map((blocked) => (
                  <Card key={blocked.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#2D3A2D]">{blocked.reason}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[#5A6B5A]">
                            <span>{format(parseISO(blocked.start_datetime), 'MMM dd, yyyy h:mm a')}</span>
                            <span>→</span>
                            <span>{format(parseISO(blocked.end_datetime), 'MMM dd, yyyy h:mm a')}</span>
                          </div>
                          {blocked.is_recurring && (
                            <Badge className="mt-2">Recurring</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>
        )}
      </div>
      </div>
    </RequireAuth>
  );
}



function ScheduleForm({ providerId, onSubmit }) {
  const [formData, setFormData] = useState({
    day_of_week: '1',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      provider_id: providerId,
      day_of_week: parseInt(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      slot_duration_minutes: parseInt(formData.slot_duration_minutes),
      is_available: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Day of Week</Label>
        <Select value={formData.day_of_week} onValueChange={(val) => setFormData({ ...formData, day_of_week: val })}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sunday</SelectItem>
            <SelectItem value="1">Monday</SelectItem>
            <SelectItem value="2">Tuesday</SelectItem>
            <SelectItem value="3">Wednesday</SelectItem>
            <SelectItem value="4">Thursday</SelectItem>
            <SelectItem value="5">Friday</SelectItem>
            <SelectItem value="6">Saturday</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>End Time</Label>
          <Input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>
      <div>
        <Label>Slot Duration (minutes)</Label>
        <Input
          type="number"
          value={formData.slot_duration_minutes}
          onChange={(e) => setFormData({ ...formData, slot_duration_minutes: e.target.value })}
          className="mt-2"
        />
      </div>
      <Button type="submit" className="w-full bg-[#4A6741] hover:bg-[#3D5636]">
        Add Schedule
      </Button>
    </form>
  );
}

function BlockTimeForm({ providerId, onSubmit }) {
  const [formData, setFormData] = useState({
    start_datetime: '',
    end_datetime: '',
    reason: '',
    is_recurring: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      provider_id: providerId,
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      reason: formData.reason,
      is_recurring: formData.is_recurring,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Reason</Label>
        <Input
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Vacation, Meeting, etc."
          className="mt-2"
          required
        />
      </div>
      <div>
        <Label>Start Date & Time</Label>
        <Input
          type="datetime-local"
          value={formData.start_datetime}
          onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
          className="mt-2"
          required
        />
      </div>
      <div>
        <Label>End Date & Time</Label>
        <Input
          type="datetime-local"
          value={formData.end_datetime}
          onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
          className="mt-2"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-[#4A6741] hover:bg-[#3D5636]">
        Block Time
      </Button>
    </form>
  );
}