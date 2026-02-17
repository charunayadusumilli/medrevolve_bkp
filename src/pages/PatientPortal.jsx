import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RequireAuth from '@/components/auth/RequireAuth';
import { 
  Calendar, FileText, Pill, MessageSquare, User, 
  Clock, CheckCircle, Video, Download, ArrowRight
} from 'lucide-react';

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('appointments');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['allAppointments', user?.email],
    queryFn: () => base44.entities.Appointment.filter(
      { patient_email: user?.email },
      '-appointment_date',
      50
    ),
    enabled: !!user?.email
  });

  const { data: summaries = [] } = useQuery({
    queryKey: ['consultationSummaries', user?.email],
    queryFn: () => base44.entities.ConsultationSummary.filter(
      { patient_email: user?.email },
      '-created_date',
      50
    ),
    enabled: !!user?.email
  });

  const { data: prescriptions = [] } = useQuery({
    queryKey: ['prescriptions', user?.email],
    queryFn: () => base44.entities.Prescription.filter(
      { patient_email: user?.email },
      '-created_date',
      50
    ),
    enabled: !!user?.email
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['allMessages', user?.email],
    queryFn: () => base44.entities.Message.filter(
      { patient_email: user?.email },
      '-created_date',
      50
    ),
    enabled: !!user?.email
  });

  return (
    <RequireAuth portalName="Patient Portal">
    <>
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4A6741] to-[#3D5636] text-white py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-light mb-2">Patient Portal</h1>
            <p className="text-white/80">Welcome back, {user.full_name || user.email}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-white rounded-2xl p-2 mb-8">
            <TabsTrigger value="appointments" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="summaries" className="rounded-xl">
              <FileText className="w-4 h-4 mr-2" />
              Consultation Notes
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-xl">
              <Pill className="w-4 h-4 mr-2" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-xl">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-[#2D3A2D]">My Appointments</h2>
              <Link to={createPageUrl('BookAppointment')}>
                <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                  <Calendar className="mr-2 w-4 h-4" />
                  Book New
                </Button>
              </Link>
            </div>

            {appointmentsLoading ? (
              <div className="text-center py-12 text-[#5A6B5A]">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <EmptyState 
                icon={Calendar}
                title="No Appointments Yet"
                description="Book your first consultation to get started"
                action={
                  <Link to={createPageUrl('BookAppointment')}>
                    <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                      Book Consultation
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Consultation Summaries Tab */}
          <TabsContent value="summaries" className="space-y-6">
            <h2 className="text-2xl font-light text-[#2D3A2D] mb-6">Consultation Summaries</h2>
            {summaries.length === 0 ? (
              <EmptyState 
                icon={FileText}
                title="No Consultation Summaries"
                description="Summaries will appear here after your consultations"
              />
            ) : (
              <div className="space-y-6">
                {summaries.map((summary) => (
                  <SummaryCard key={summary.id} summary={summary} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <h2 className="text-2xl font-light text-[#2D3A2D] mb-6">My Prescriptions</h2>
            {prescriptions.length === 0 ? (
              <EmptyState 
                icon={Pill}
                title="No Prescriptions"
                description="Your prescriptions will appear here"
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {prescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-[#2D3A2D]">My Messages</h2>
              <Link to={createPageUrl('Messages')}>
                <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                  New Message
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            {messages.length === 0 ? (
              <EmptyState 
                icon={MessageSquare}
                title="No Messages"
                description="Start a conversation with your provider"
                action={
                  <Link to={createPageUrl('Messages')}>
                    <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                      Send Message
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
    </RequireAuth>
  );
}

function AppointmentCard({ appointment }) {
  const appointmentDate = new Date(appointment.appointment_date);
  const isPast = appointmentDate < new Date();
  const isUpcoming = !isPast && appointment.status !== 'cancelled';

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    in_progress: 'bg-purple-100 text-purple-800',
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
        <div>
          <Badge className={statusColors[appointment.status]}>
            {appointment.status.replace('_', ' ')}
          </Badge>
          <h3 className="font-medium text-[#2D3A2D] mt-3 mb-1">
            {appointment.type.replace('_', ' ').toUpperCase()}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
            <Clock className="w-4 h-4" />
            {appointmentDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })} at {appointmentDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {appointment.reason && (
        <p className="text-sm text-[#5A6B5A] mb-4">{appointment.reason}</p>
      )}

      {isUpcoming && (
        <Link to={createPageUrl(`VideoCall?id=${appointment.id}`)}>
          <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full" size="sm">
            <Video className="mr-2 w-4 h-4" />
            Join Call
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

function SummaryCard({ summary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium text-[#2D3A2D] mb-1">Consultation Summary</h3>
          <p className="text-sm text-[#5A6B5A]">
            {new Date(summary.created_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {summary.chief_complaint && (
        <div className="mb-4">
          <p className="text-xs font-medium text-[#5A6B5A] mb-1">Chief Complaint</p>
          <p className="text-sm text-[#2D3A2D]">{summary.chief_complaint}</p>
        </div>
      )}

      {summary.diagnosis && (
        <div className="mb-4">
          <p className="text-xs font-medium text-[#5A6B5A] mb-1">Diagnosis</p>
          <p className="text-sm text-[#2D3A2D]">{summary.diagnosis}</p>
        </div>
      )}

      {summary.treatment_plan && (
        <div className="mb-4">
          <p className="text-xs font-medium text-[#5A6B5A] mb-1">Treatment Plan</p>
          <p className="text-sm text-[#2D3A2D]">{summary.treatment_plan}</p>
        </div>
      )}

      {summary.follow_up_instructions && (
        <div className="bg-[#F5F0E8] rounded-xl p-4 mt-4">
          <p className="text-xs font-medium text-[#5A6B5A] mb-1">Follow-Up Instructions</p>
          <p className="text-sm text-[#2D3A2D]">{summary.follow_up_instructions}</p>
        </div>
      )}
    </motion.div>
  );
}

function PrescriptionCard({ prescription }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <Badge className={statusColors[prescription.status]}>
            {prescription.status}
          </Badge>
          <h3 className="font-medium text-[#2D3A2D] mt-3 text-lg">
            {prescription.medication_name}
          </h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#5A6B5A]">Dosage:</span>
          <span className="text-[#2D3A2D] font-medium">{prescription.dosage}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#5A6B5A]">Frequency:</span>
          <span className="text-[#2D3A2D] font-medium">{prescription.frequency}</span>
        </div>
        {prescription.refills !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-[#5A6B5A]">Refills:</span>
            <span className="text-[#2D3A2D] font-medium">{prescription.refills} remaining</span>
          </div>
        )}
      </div>

      {prescription.instructions && (
        <div className="bg-[#F5F0E8] rounded-xl p-4 mb-4">
          <p className="text-xs font-medium text-[#5A6B5A] mb-1">Instructions</p>
          <p className="text-sm text-[#2D3A2D]">{prescription.instructions}</p>
        </div>
      )}

      {prescription.pharmacy_name && (
        <div className="text-sm text-[#5A6B5A]">
          Pharmacy: {prescription.pharmacy_name}
        </div>
      )}
    </motion.div>
  );
}

function MessageCard({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          message.sender_type === 'provider' ? 'bg-[#D4E5D7]' : 'bg-[#E8E0D5]'
        }`}>
          {message.sender_type === 'provider' ? (
            <User className="w-5 h-5 text-[#4A6741]" />
          ) : (
            <MessageSquare className="w-5 h-5 text-[#8B7355]" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-[#2D3A2D]">
              {message.sender_type === 'provider' ? 'Provider' : 'You'}
            </span>
            <span className="text-xs text-[#5A6B5A]">
              {new Date(message.created_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <p className="text-sm text-[#5A6B5A]">{message.message_text}</p>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-[#5A6B5A]" />
      </div>
      <h3 className="text-xl font-light text-[#2D3A2D] mb-2">{title}</h3>
      <p className="text-[#5A6B5A] mb-6">{description}</p>
      {action}
    </div>
  );
}