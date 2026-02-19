import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RequireAuth from '@/components/auth/RequireAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon, Clock, User, FileText, Video,
  CheckCircle2, Plus, Stethoscope
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { format, parseISO, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';

import ProviderScheduleManager from '@/components/provider/ProviderScheduleManager';
import AppointmentCalendar from '@/components/provider/AppointmentCalendar';
import AppointmentDetailPanel from '@/components/provider/AppointmentDetailPanel';
import ProviderNotifications from '@/components/provider/ProviderNotifications';
import PrescriptionHistory from '@/components/provider/PrescriptionHistory';
import EPrescribeModal from '@/components/provider/EPrescribeModal';
import ScheduleAppointmentModal from '@/components/provider/ScheduleAppointmentModal';
import ProviderStatsCards from '@/components/provider/ProviderStatsCards';
import PatientFeedback from '@/components/provider/PatientFeedback';
import ProviderContractsPanel from '@/components/provider/ProviderContracts';

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ProviderDashboard() {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [quickPrescribeOpen, setQuickPrescribeOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.Provider.list(),
    enabled: !!user,
  });

  const currentProvider = providers.find(p => p.created_by === user?.email);

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', currentProvider?.id],
    queryFn: () => base44.entities.Appointment.filter({ provider_id: currentProvider?.id }, '-appointment_date'),
    enabled: !!currentProvider?.id,
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', currentProvider?.id],
    queryFn: () => base44.entities.ProviderSchedule.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  const { data: blockedTimes = [] } = useQuery({
    queryKey: ['blockedTimes', currentProvider?.id],
    queryFn: () => base44.entities.BlockedTime.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['provider-contracts-self', user?.email],
    queryFn: () => base44.entities.ProviderContract.filter({ contact_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: consultations = [] } = useQuery({
    queryKey: ['consultations', currentProvider?.id],
    queryFn: () => base44.entities.ConsultationSummary.filter({ provider_id: currentProvider?.id }),
    enabled: !!currentProvider?.id,
  });

  const upcomingAppointments = useMemo(() =>
    appointments.filter(apt =>
      ['scheduled', 'confirmed'].includes(apt.status) &&
      new Date(apt.appointment_date) >= new Date()
    ), [appointments]);

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Appointment.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });

  return (
    <RequireAuth portalName="Provider Portal">
      <div className="min-h-screen bg-[#FDFBF7] py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!currentProvider ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-full bg-[#D4E5D7] flex items-center justify-center mb-6">
                <Stethoscope className="w-10 h-10 text-[#4A6741]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2D3A2D] mb-2">No Provider Profile Found</h2>
              <p className="text-[#5A6B5A] mb-6">Your account is not linked to a provider profile yet.</p>
              <Link to={createPageUrl('ProviderIntake')}>
                <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-6">
                  Apply to Join Network
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-light text-[#2D3A2D] mb-1">
                    Welcome back, <span className="font-semibold">{currentProvider.name}</span>
                  </h1>
                  <p className="text-[#5A6B5A]">{currentProvider.title} · {currentProvider.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ProviderNotifications providerId={currentProvider.id} />
                  <Button size="sm" variant="outline" className="rounded-full border-[#4A6741] text-[#4A6741]"
                    onClick={() => setScheduleOpen(true)}>
                    <CalendarIcon className="w-4 h-4 mr-1.5" /> Schedule Appointment
                  </Button>
                  <Button size="sm" className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
                    onClick={() => setQuickPrescribeOpen(true)}>
                    <Plus className="w-4 h-4 mr-1.5" /> New Rx
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <ProviderStatsCards
                provider={currentProvider}
                appointments={appointments}
                consultations={consultations}
                contracts={contracts}
              />

              {/* Main Tabs */}
              <Tabs defaultValue="calendar" className="space-y-6">
                <TabsList className="bg-white border border-[#E8E0D5] rounded-xl p-1 w-full md:w-auto">
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="feedback">Patient Feedback</TabsTrigger>
                  <TabsTrigger value="contracts">My Contracts</TabsTrigger>
                </TabsList>

                {/* Calendar */}
                <TabsContent value="calendar">
                  <AppointmentCalendar
                    appointments={appointments}
                    onSelectAppointment={setSelectedAppointment}
                  />
                </TabsContent>

                {/* Appointments List */}
                <TabsContent value="appointments" className="space-y-4">
                  {appointmentsLoading ? (
                    <p className="text-[#5A6B5A] text-sm">Loading...</p>
                  ) : upcomingAppointments.length === 0 ? (
                    <Card className="border-[#E8E0D5]">
                      <CardContent className="py-12 text-center">
                        <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-[#5A6B5A]">No upcoming appointments</p>
                      </CardContent>
                    </Card>
                  ) : (
                    upcomingAppointments.map(apt => (
                      <Card key={apt.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border-[#E8E0D5]"
                        onClick={() => setSelectedAppointment(apt)}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-[#4A6741]" />
                              </div>
                              <div>
                                <p className="font-medium text-[#2D3A2D]">{apt.patient_email}</p>
                                <p className="text-sm text-[#5A6B5A]">
                                  {format(parseISO(apt.appointment_date), 'MMM d · h:mm a')} · {apt.type?.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${STATUS_COLORS[apt.status]} border-none`}>{apt.status}</Badge>
                              {['scheduled', 'confirmed'].includes(apt.status) && apt.session_url && (
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs"
                                  onClick={e => { e.stopPropagation(); window.location.href = createPageUrl(`VideoCall?id=${apt.id}`); }}>
                                  <Video className="w-3.5 h-3.5 mr-1" /> Join
                                </Button>
                              )}
                            </div>
                          </div>
                          {apt.reason && (
                            <p className="text-xs text-[#5A6B5A] mt-3 ml-13 pl-13 border-t border-[#E8E0D5] pt-2">
                              Reason: {apt.reason}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Prescriptions */}
                <TabsContent value="prescriptions">
                  <PrescriptionHistory providerId={currentProvider.id} />
                </TabsContent>

                {/* Availability */}
                <TabsContent value="availability">
                  <ProviderScheduleManager
                    providerId={currentProvider.id}
                    appointments={appointments}
                  />
                </TabsContent>

                {/* Patient Feedback */}
                <TabsContent value="feedback">
                  <PatientFeedback provider={currentProvider} />
                </TabsContent>

                {/* Contracts */}
                <TabsContent value="contracts">
                  <ProviderContractsPanel providerEmail={user?.email} />
                </TabsContent>
              </Tabs>

              {/* Appointment Detail Panel */}
              {selectedAppointment && (
                <AppointmentDetailPanel
                  appointment={selectedAppointment}
                  onClose={() => setSelectedAppointment(null)}
                  providerId={currentProvider.id}
                  providerName={`${currentProvider.name} ${currentProvider.title || ''}`}
                />
              )}

              <ScheduleAppointmentModal
                open={scheduleOpen}
                onClose={() => setScheduleOpen(false)}
                providerId={currentProvider.id}
                providerName={`${currentProvider.name}${currentProvider.title ? ', ' + currentProvider.title : ''}`}
              />

              <EPrescribeModal
                open={quickPrescribeOpen}
                onClose={() => setQuickPrescribeOpen(false)}
                appointment={null}
                providerId={currentProvider.id}
                providerName={`${currentProvider.name} ${currentProvider.title || ''}`}
              />
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}