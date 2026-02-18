import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Video, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

const APPOINTMENT_TYPES = [
  { value: 'initial_consultation', label: 'Initial Consultation' },
  { value: 'follow_up', label: 'Follow-Up' },
  { value: 'dosage_adjustment', label: 'Dosage Adjustment' },
  { value: 'general_inquiry', label: 'General Inquiry' },
];

const DURATIONS = [15, 30, 45, 60];

function generateVideoRoomId() {
  return 'mr-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
}

export default function ScheduleAppointmentModal({ open, onClose, providerId, providerName }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    patient_email: '',
    appointment_date: '',
    appointment_time: '09:00',
    type: 'initial_consultation',
    duration_minutes: 30,
    reason: '',
    notes: '',
  });
  const [done, setDone] = useState(null); // holds created appointment on success

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const roomId = generateVideoRoomId();
      const dateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
      const videoUrl = `${window.location.origin}/VideoCall?id=${roomId}`;
      return base44.entities.Appointment.create({
        provider_id: providerId,
        patient_email: data.patient_email,
        appointment_date: dateTime.toISOString(),
        type: data.type,
        duration_minutes: data.duration_minutes,
        reason: data.reason,
        notes: data.notes,
        status: 'scheduled',
        video_room_id: roomId,
        session_url: videoUrl,
      });
    },
    onSuccess: async (appt) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Email patient
      if (form.patient_email) {
        const dateLabel = format(new Date(`${form.appointment_date}T${form.appointment_time}`), 'EEEE, MMMM d, yyyy \'at\' h:mm a');
        await base44.integrations.Core.SendEmail({
          to: form.patient_email,
          subject: `Your Appointment is Scheduled — ${dateLabel}`,
          body: `Hi,\n\nYour virtual appointment with ${providerName} has been scheduled.\n\nDate & Time: ${dateLabel}\nType: ${form.type.replace(/_/g, ' ')}\nDuration: ${form.duration_minutes} minutes\n\nJoin your video call here:\n${appt.session_url}\n\nPlease join a few minutes early. If you need to reschedule, contact us through the patient portal.\n\n— MedRevolve`,
        });
      }
      setDone(appt);
    },
  });

  const isValid = form.patient_email && form.appointment_date && form.appointment_time && form.type;

  const handleClose = () => {
    setForm({ patient_email: '', appointment_date: '', appointment_time: '09:00', type: 'initial_consultation', duration_minutes: 30, reason: '', notes: '' });
    setDone(null);
    onClose();
  };

  // Min date = today
  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#2D3A2D]">
            <Calendar className="w-5 h-5 text-[#4A6741]" />
            Schedule Appointment
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-[#2D3A2D]">Appointment Scheduled!</p>
              <p className="text-sm text-[#5A6B5A] mt-1">Confirmation emailed to patient.</p>
            </div>
            <div className="bg-[#F5F0E8] rounded-xl p-4 text-sm text-left space-y-1.5">
              <div className="flex justify-between"><span className="text-[#5A6B5A]">Patient</span><span className="font-medium">{done.patient_email}</span></div>
              <div className="flex justify-between"><span className="text-[#5A6B5A]">Date</span><span className="font-medium">{format(new Date(done.appointment_date), 'MMM d, yyyy · h:mm a')}</span></div>
              <div className="flex justify-between"><span className="text-[#5A6B5A]">Type</span><span className="font-medium capitalize">{done.type?.replace(/_/g, ' ')}</span></div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 break-all">
              <p className="font-semibold mb-1 flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Video Call Link</p>
              <a href={done.session_url} target="_blank" rel="noreferrer" className="underline">{done.session_url}</a>
            </div>
            <Button className="w-full bg-[#4A6741] rounded-full text-white" onClick={handleClose}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Patient Email *</Label>
              <Input value={form.patient_email} onChange={e => setForm(f => ({ ...f, patient_email: e.target.value }))} placeholder="patient@email.com" type="email" className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Date *</Label>
                <Input type="date" min={minDate} value={form.appointment_date} onChange={e => setForm(f => ({ ...f, appointment_date: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Time *</Label>
                <Input type="time" value={form.appointment_time} onChange={e => setForm(f => ({ ...f, appointment_time: e.target.value }))} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Type *</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Duration</Label>
                <Select value={String(form.duration_minutes)} onValueChange={v => setForm(f => ({ ...f, duration_minutes: parseInt(v) }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => <SelectItem key={d} value={String(d)}>{d} min</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Reason for Visit</Label>
              <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Weight loss follow-up" className="mt-1" />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Internal Notes</Label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Prep notes visible only to you…" className="mt-1 w-full text-sm rounded-xl border border-gray-200 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 focus:border-[#4A6741]" />
            </div>

            <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              <Video className="w-4 h-4 flex-shrink-0" />
              A unique video call link will be generated and emailed to the patient automatically.
            </div>

            <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full" disabled={!isValid || createMutation.isPending} onClick={() => createMutation.mutate(form)}>
              {createMutation.isPending ? 'Scheduling…' : 'Schedule & Send Invite'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}