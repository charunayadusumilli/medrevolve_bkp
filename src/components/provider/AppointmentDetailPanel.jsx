import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';
import {
  X, Video, CheckCircle2, Ban, User, Clock,
  FileText, Pill, Calendar, Save, ChevronDown, ChevronUp, Copy, Link2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import EPrescribeModal from '@/components/provider/EPrescribeModal';
import AIClinicalAssistant from '@/components/provider/AIClinicalAssistant';

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AppointmentDetailPanel({ appointment, onClose, providerId, providerName }) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(appointment?.consultation_notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [prescribeOpen, setPrescribeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyVideoLink = () => {
    if (appointment?.session_url) {
      navigator.clipboard.writeText(appointment.session_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { data: patientHistory } = useQuery({
    queryKey: ['patientHistory', appointment?.patient_email],
    queryFn: async () => {
      const [apts, summaries, prescriptions] = await Promise.all([
        base44.entities.Appointment.filter({ patient_email: appointment.patient_email }, '-appointment_date', 10),
        base44.entities.ConsultationSummary.filter({ patient_email: appointment.patient_email }, '-created_date', 5),
        base44.entities.Prescription.filter({ patient_email: appointment.patient_email }, '-created_date', 5),
      ]);
      return { apts, summaries, prescriptions };
    },
    enabled: !!appointment?.patient_email
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Appointment.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const saveNotes = async () => {
    await updateMutation.mutateAsync({ id: appointment.id, data: { consultation_notes: notes } });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  if (!appointment) return null;

  const apptDate = (() => { try { return parseISO(appointment.appointment_date); } catch { return new Date(); } })();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#2D3A2D]">Appointment Details</h2>
            <p className="text-xs text-[#5A6B5A] mt-0.5">{format(apptDate, 'EEEE, MMM d · h:mm a')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-[#5A6B5A]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status + Type */}
          <div className="flex items-center gap-3">
            <Badge className={`${STATUS_COLORS[appointment.status]} border-none`}>{appointment.status}</Badge>
            <Badge variant="outline" className="capitalize">{appointment.type?.replace('_', ' ')}</Badge>
          </div>

          {/* Patient */}
          <div className="bg-[#F5F0E8] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4A6741]/20 flex items-center justify-center">
                <User className="w-5 h-5 text-[#4A6741]" />
              </div>
              <div>
                <p className="font-medium text-[#2D3A2D]">{appointment.patient_email}</p>
                {patientHistory && (
                  <p className="text-xs text-[#5A6B5A]">
                    {patientHistory.apts.length} visits · {patientHistory.prescriptions.length} prescriptions
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Video Call Link */}
          {appointment.session_url && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Video Call Link
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-blue-800 font-mono truncate flex-1">{appointment.session_url}</p>
                <button onClick={copyVideoLink} className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Reason */}
          {appointment.reason && (
            <div>
              <p className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider mb-1.5">Reason for Visit</p>
              <p className="text-sm text-[#2D3A2D] bg-gray-50 rounded-xl p-3">{appointment.reason}</p>
            </div>
          )}

          {/* Consultation Notes */}
          <div>
            <p className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider mb-1.5">Consultation Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this consultation, diagnosis, treatment plan..."
              rows={5}
              className="w-full text-sm rounded-xl border border-gray-200 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 focus:border-[#4A6741] transition-all"
            />
            <Button size="sm" onClick={saveNotes} disabled={updateMutation.isPending}
              className={`mt-2 rounded-full ${notesSaved ? 'bg-green-600 hover:bg-green-600' : 'bg-[#4A6741] hover:bg-[#3D5636]'} text-white`}>
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {notesSaved ? 'Saved!' : 'Save Notes'}
            </Button>
          </div>

          {/* Patient History Accordion */}
          {patientHistory && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setHistoryOpen(h => !h)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-[#2D3A2D]"
              >
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#4A6741]" />Patient History</span>
                {historyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {historyOpen && (
                <div className="p-4 space-y-4">
                  {patientHistory.summaries.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#5A6B5A] mb-2">Recent Consultations</p>
                      <div className="space-y-1.5">
                        {patientHistory.summaries.slice(0, 3).map(s => (
                          <div key={s.id} className="text-xs bg-gray-50 rounded-lg p-2.5">
                            <span className="font-medium">{format(parseISO(s.created_date), 'MMM d, yyyy')}</span>
                            {s.diagnosis && <span className="text-[#5A6B5A] ml-2">· {s.diagnosis}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {patientHistory.prescriptions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#5A6B5A] mb-2 flex items-center gap-1"><Pill className="w-3 h-3" /> Active Prescriptions</p>
                      <div className="space-y-1.5">
                        {patientHistory.prescriptions.filter(p => p.status === 'active').map(p => (
                          <div key={p.id} className="text-xs bg-green-50 rounded-lg p-2.5 flex justify-between">
                            <span className="font-medium">{p.medication_name}</span>
                            <span className="text-[#5A6B5A]">{p.dosage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {patientHistory.summaries.length === 0 && patientHistory.prescriptions.length === 0 && (
                    <p className="text-xs text-[#5A6B5A] text-center py-2">No history found</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex-shrink-0 p-5 border-t border-gray-100 space-y-2">
          <Button
            variant="outline"
            className="w-full rounded-full border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741] hover:text-white"
            onClick={() => setPrescribeOpen(true)}
          >
            <Pill className="w-4 h-4 mr-2" /> Write e-Prescription
          </Button>
          {['scheduled', 'confirmed'].includes(appointment.status) && (
            <Button
              className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
              onClick={() => { updateMutation.mutate({ id: appointment.id, data: { status: 'in_progress' } }); window.location.href = createPageUrl(`VideoCall?id=${appointment.id}`); }}
            >
              <Video className="w-4 h-4 mr-2" /> Start Video Call
            </Button>
          )}
          {appointment.status === 'scheduled' && (
            <Button variant="outline" className="w-full rounded-full border-[#4A6741] text-[#4A6741]"
              onClick={() => updateMutation.mutate({ id: appointment.id, data: { status: 'confirmed' } })}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Appointment
            </Button>
          )}
          {appointment.status === 'in_progress' && (
            <Button variant="outline" className="w-full rounded-full border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => updateMutation.mutate({ id: appointment.id, data: { status: 'completed' } })}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
            </Button>
          )}
          {['scheduled', 'confirmed'].includes(appointment.status) && (
            <Button variant="outline" className="w-full rounded-full border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => { updateMutation.mutate({ id: appointment.id, data: { status: 'cancelled' } }); onClose(); }}>
              <Ban className="w-4 h-4 mr-2" /> Cancel Appointment
            </Button>
          )}
        </div>
      </motion.div>

      <EPrescribeModal
        open={prescribeOpen}
        onClose={() => setPrescribeOpen(false)}
        appointment={appointment}
        providerId={providerId}
        providerName={providerName}
      />
    </AnimatePresence>
  );
}