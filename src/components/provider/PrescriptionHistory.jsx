import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Pill, Search, RefreshCw, CheckCircle2, XCircle,
  Send, Clock, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  sent_to_pharmacy: 'bg-blue-100 text-blue-700',
  dispensed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
  refill_requested: 'bg-amber-100 text-amber-700',
};

export default function PrescriptionHistory({ providerId }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [refillModal, setRefillModal] = useState(null);

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['prescriptions', providerId],
    queryFn: () => base44.entities.Prescription.filter({ provider_id: providerId }, '-created_date', 100),
    enabled: !!providerId,
  });

  const updateRx = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Prescription.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prescriptions', providerId] }),
  });

  const approveRefill = async (rx) => {
    await updateRx.mutateAsync({
      id: rx.id,
      data: {
        status: 'sent_to_pharmacy',
        refills_used: (rx.refills_used || 0) + 1,
        sent_to_pharmacy_at: new Date().toISOString(),
        refill_requested_at: null,
      }
    });
    // Notify pharmacy
    if (rx.pharmacy_email) {
      await base44.integrations.Core.SendEmail({
        to: rx.pharmacy_email,
        subject: `Refill Approved — ${rx.rx_number}`,
        body: `Refill approved for ${rx.medication_name} ${rx.dosage} for patient ${rx.patient_email}.\nRx#: ${rx.rx_number}\nRefills remaining: ${rx.refills - (rx.refills_used || 0) - 1}`,
      });
    }
    setRefillModal(null);
  };

  const filtered = prescriptions.filter(rx => {
    const matchSearch = !search ||
      rx.medication_name?.toLowerCase().includes(search.toLowerCase()) ||
      rx.patient_email?.toLowerCase().includes(search.toLowerCase()) ||
      rx.rx_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const refillRequests = prescriptions.filter(rx => rx.status === 'refill_requested');

  return (
    <div className="space-y-6">
      {/* Refill Requests Banner */}
      {refillRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">{refillRequests.length} Refill Request{refillRequests.length > 1 ? 's' : ''} Pending</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {refillRequests.map(rx => (
                <button key={rx.id} onClick={() => setRefillModal(rx)}
                  className="text-xs bg-white border border-amber-300 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium">
                  {rx.medication_name} — {rx.patient_email?.split('@')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, medication, Rx#…" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="sent_to_pharmacy">Sent to Pharmacy</SelectItem>
            <SelectItem value="refill_requested">Refill Requested</SelectItem>
            <SelectItem value="dispensed">Dispensed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prescriptions List */}
      {isLoading ? (
        <p className="text-[#5A6B5A] text-sm py-8 text-center">Loading prescriptions…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Pill className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#5A6B5A]">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(rx => {
            const expanded = expandedId === rx.id;
            const refillsLeft = (rx.refills || 0) - (rx.refills_used || 0);
            return (
              <div key={rx.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                {/* Row */}
                <button
                  className="w-full flex items-center gap-4 px-4 py-3.5 text-left"
                  onClick={() => setExpandedId(expanded ? null : rx.id)}
                >
                  <div className="w-9 h-9 rounded-full bg-[#D4E5D7] flex items-center justify-center flex-shrink-0">
                    <Pill className="w-4 h-4 text-[#4A6741]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#2D3A2D] text-sm">{rx.medication_name}</span>
                      <span className="text-[#5A6B5A] text-xs">{rx.dosage}</span>
                      <Badge className={`${STATUS_STYLES[rx.status]} border-none text-xs`}>{rx.status?.replace('_', ' ')}</Badge>
                      {rx.status === 'refill_requested' && <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[#5A6B5A]">
                      <span>{rx.patient_email}</span>
                      {rx.rx_number && <span className="font-mono">{rx.rx_number}</span>}
                      <span>Refills: {refillsLeft}/{rx.refills || 0}</span>
                    </div>
                  </div>
                  {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>

                {/* Expanded details */}
                {expanded && (
                  <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                      <Detail label="Frequency" value={rx.frequency} />
                      <Detail label="Quantity" value={rx.quantity} />
                      <Detail label="Days Supply" value={rx.days_supply ? `${rx.days_supply} days` : '—'} />
                      <Detail label="Pharmacy" value={rx.pharmacy_name || '—'} />
                      {rx.instructions && <Detail label="Sig" value={rx.instructions} full />}
                      {rx.diagnosis_code && <Detail label="ICD-10" value={rx.diagnosis_code} />}
                      {rx.start_date && <Detail label="Start Date" value={rx.start_date} />}
                      {rx.expiry_date && <Detail label="Expires" value={rx.expiry_date} />}
                      {rx.sent_to_pharmacy_at && (
                        <Detail label="Sent" value={format(parseISO(rx.sent_to_pharmacy_at), 'MMM d, yyyy h:mm a')} />
                      )}
                    </div>
                    {rx.refill_request_notes && (
                      <div className="bg-amber-50 rounded-lg px-3 py-2 text-xs">
                        <span className="font-medium text-amber-800">Refill note:</span>
                        <span className="text-amber-700 ml-1">{rx.refill_request_notes}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {rx.status === 'refill_requested' && (
                        <Button size="sm" className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full text-xs"
                          onClick={() => setRefillModal(rx)}>
                          <RefreshCw className="w-3 h-3 mr-1" /> Approve Refill
                        </Button>
                      )}
                      {rx.status === 'sent_to_pharmacy' && (
                        <Button size="sm" variant="outline" className="rounded-full text-xs"
                          onClick={() => updateRx.mutate({ id: rx.id, data: { status: 'dispensed', dispensed_at: new Date().toISOString() } })}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Dispensed
                        </Button>
                      )}
                      {['active', 'dispensed', 'sent_to_pharmacy'].includes(rx.status) && (
                        <Button size="sm" variant="outline" className="rounded-full text-xs border-red-200 text-red-500 hover:bg-red-50"
                          onClick={() => updateRx.mutate({ id: rx.id, data: { status: 'cancelled' } })}>
                          <XCircle className="w-3 h-3 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Refill Approval Modal */}
      {refillModal && (
        <Dialog open onOpenChange={() => setRefillModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-600" /> Approve Refill
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-[#F5F0E8] rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-[#5A6B5A]">Patient</span><span className="font-medium">{refillModal.patient_email}</span></div>
                <div className="flex justify-between"><span className="text-[#5A6B5A]">Medication</span><span className="font-medium">{refillModal.medication_name} {refillModal.dosage}</span></div>
                <div className="flex justify-between"><span className="text-[#5A6B5A]">Refills left</span><span className="font-medium">{(refillModal.refills || 0) - (refillModal.refills_used || 0)}</span></div>
                <div className="flex justify-between"><span className="text-[#5A6B5A]">Pharmacy</span><span className="font-medium">{refillModal.pharmacy_name}</span></div>
              </div>
              {refillModal.refill_request_notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  <strong>Patient note:</strong> {refillModal.refill_request_notes}
                </div>
              )}
              {(refillModal.refills || 0) - (refillModal.refills_used || 0) <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> No refills remaining — you must write a new prescription.
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => setRefillModal(null)}>Cancel</Button>
                <Button
                  className="flex-1 bg-[#4A6741] hover:bg-[#3D5636] rounded-full text-white"
                  disabled={(refillModal.refills || 0) - (refillModal.refills_used || 0) <= 0 || updateRx.isPending}
                  onClick={() => approveRefill(refillModal)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Approve & Send to Pharmacy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Detail({ label, value, full }) {
  if (!value) return null;
  return (
    <div className={full ? 'col-span-2' : ''}>
      <span className="text-[#8A9A8A]">{label}: </span>
      <span className="text-[#2D3A2D] font-medium">{value}</span>
    </div>
  );
}