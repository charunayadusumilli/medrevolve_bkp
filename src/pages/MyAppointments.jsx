import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Calendar, Video, MessageSquare, Clock, X, 
  ArrowLeft, Plus
} from 'lucide-react';

export default function MyAppointments() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['myAppointments', user?.email],
    queryFn: () => base44.entities.Appointment.filter(
      { patient_email: user?.email },
      '-appointment_date'
    ),
    enabled: !!user?.email
  });

  const cancelAppointment = useMutation({
    mutationFn: (id) => base44.entities.Appointment.update(id, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myAppointments']);
    }
  });

  const upcoming = appointments.filter(a => 
    ['scheduled', 'confirmed'].includes(a.status) && 
    new Date(a.appointment_date) > new Date()
  );

  const past = appointments.filter(a => 
    a.status === 'completed' || 
    (new Date(a.appointment_date) < new Date() && a.status !== 'cancelled')
  );

  const cancelled = appointments.filter(a => a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={createPageUrl('Consultations')}>
              <Button variant="ghost" className="mb-4 text-[#5A6B5A]">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-light text-[#2D3A2D]">
              My Appointments
            </h1>
          </div>
          <Link to={createPageUrl('BookAppointment')}>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
              <Plus className="mr-2 w-4 h-4" />
              Book New
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-white border border-[#E8E0D5] p-1 rounded-full mb-8">
            <TabsTrigger 
              value="upcoming"
              className="rounded-full px-6 data-[state=active]:bg-[#4A6741] data-[state=active]:text-white"
            >
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="rounded-full px-6 data-[state=active]:bg-[#4A6741] data-[state=active]:text-white"
            >
              Past ({past.length})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="rounded-full px-6 data-[state=active]:bg-[#4A6741] data-[state=active]:text-white"
            >
              Cancelled ({cancelled.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {upcoming.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onCancel={() => cancelAppointment.mutate(appointment.id)}
                    showActions
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No upcoming appointments"
                description="You don't have any scheduled consultations"
                action={
                  <Link to={createPageUrl('BookAppointment')}>
                    <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                      Book Consultation
                    </Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {past.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No past appointments"
                description="Your completed consultations will appear here"
              />
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {cancelled.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {cancelled.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No cancelled appointments"
                description="Cancelled consultations will appear here"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, onCancel, showActions }) {
  const appointmentDate = new Date(appointment.appointment_date);
  const isUpcoming = appointmentDate > new Date();
  const canJoin = isUpcoming && Math.abs(appointmentDate.getTime() - new Date().getTime()) < 15 * 60 * 1000;

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <Badge className={`${statusColors[appointment.status]} border-none`}>
          {appointment.status}
        </Badge>
        <Badge variant="outline" className="border-[#4A6741] text-[#4A6741]">
          {appointment.type.replace('_', ' ')}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#5A6B5A]" />
          <span className="text-[#2D3A2D] font-medium">
            {appointmentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#5A6B5A]" />
          <span className="text-[#5A6B5A]">
            {appointmentDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            })} ({appointment.duration_minutes} min)
          </span>
        </div>
      </div>

      {appointment.reason && (
        <div className="bg-[#F5F0E8] rounded-xl p-4 mb-4">
          <p className="text-sm text-[#5A6B5A] font-medium mb-1">Reason for visit:</p>
          <p className="text-sm text-[#2D3A2D]">{appointment.reason}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-3">
          {canJoin && (
            <Link to={createPageUrl(`VideoCall?appointment=${appointment.id}`)} className="flex-1">
              <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                <Video className="mr-2 w-4 h-4" />
                Join Call
              </Button>
            </Link>
          )}
          <Link to={createPageUrl(`Messages?appointment=${appointment.id}`)} className={canJoin ? '' : 'flex-1'}>
            <Button 
              variant="outline" 
              className={`${canJoin ? '' : 'w-full'} border-[#4A6741] text-[#4A6741] rounded-full`}
            >
              <MessageSquare className="mr-2 w-4 h-4" />
              Message
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCancel}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-20">
      <Calendar className="w-16 h-16 text-[#D4E5D7] mx-auto mb-4" />
      <h3 className="text-xl font-medium text-[#2D3A2D] mb-2">{title}</h3>
      <p className="text-[#5A6B5A] mb-6">{description}</p>
      {action}
    </div>
  );
}