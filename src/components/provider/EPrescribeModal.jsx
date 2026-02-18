import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pill, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

const COMMON_MEDICATIONS = [
  { name: 'Semaglutide', dosages: ['0.25mg', '0.5mg', '1mg', '1.7mg', '2.4mg'], freq: 'Once weekly', qty: '4 vials', days: 28 },
  { name: 'Tirzepatide', dosages: ['2.5mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg'], freq: 'Once weekly', qty: '4 vials', days: 28 },
  { name: 'Testosterone Cypionate', dosages: ['100mg/mL', '200mg/mL'], freq: 'Weekly injection', qty: '10mL vial', days: 70 },
  { name: 'Sermorelin', dosages: ['0.2mg', '0.3mg'], freq: 'Nightly subcutaneous', qty: '3mg vial', days: 30 },
  { name: 'NAD+ Injection', dosages: ['100mg', '200mg', '500mg'], freq: 'Daily x 10 days', qty: '10 vials', days: 10 },
  { name: 'B12 (Methylcobalamin)', dosages: ['1000mcg', '2500mcg'], freq: 'Weekly injection', qty: '10mL vial', days: 70 },
  { name: 'Glutathione', dosages: ['200mg', '400mg', '600mg'], freq: 'Weekly IV push', qty: '10 vials', days: 30 },
  { name: 'Estradiol', dosages: ['0.5mg', '1mg', '2mg'], freq: 'Once daily', qty: '30 capsules', days: 30 },
  { name: 'Progesterone', dosages: ['100mg', '200mg'], freq: 'Once nightly', qty: '30 capsules', days: 30 },
  { name: 'Liothyronine (T3)', dosages: ['5mcg', '10mcg', '25mcg'], freq: 'Once daily', qty: '30 capsules', days: 30 },
  { name: 'Custom / Other', dosages: [], freq: '', qty: '', days: 30 },
];

const BLANK_FORM = {
  medication_name: '',
  dosage: '',
  frequency: '',
  quantity: '',
  days_supply: 30,
  refills: 0,
  instructions: '',
  diagnosis_code: '',
  pharmacy_id: '',
  pharmacy_name: '',
  pharmacy_email: '',
  is_controlled_substance: false,
};

export default function EPrescribeModal({ open, onClose, appointment, providerId, providerName }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(BLANK_FORM);
  const [selectedMed, setSelectedMed] = useState('');
  const [step, setStep] = useState('write'); // 'write' | 'confirm' | 'sent'

  const { data: pharmacies = [] } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: () => base44.entities.PharmacyContract.filter({ status: 'active' }, 'pharmacy_name', 50),
  });

  const createRx = useMutation({
    mutationFn: async (data) => {
      const rxNumber = `RX-${Date.now().toString(36).toUpperCase()}`;
      const today = new Date();
      const expiry = addDays(today, 365);
      const rx = await base44.entities.Prescription.create({
        ...data,
        rx_number: rxNumber,
        provider_id: providerId,
        provider_name: providerName,
        appointment_id: appointment?.id,
        patient_email: appointment?.patient_email,
        status: 'sent_to_pharmacy',
        start_date: format(today, 'yyyy-MM-dd'),
        expiry_date: format(expiry, 'yyyy-MM-dd'),
        sent_to_pharmacy_at: today.toISOString(),
      });
      // Mark appointment as prescription provided
      if (appointment?.id) {
        await base44.entities.Appointment.update(appointment.id, { prescription_provided: true });
      }
      // Send email to pharmacy
      if (data.pharmacy_email) {
        await base44.integrations.Core.SendEmail({
          to: data.pharmacy_email,
          subject: `New Electronic Prescription — ${rxNumber}`,
          body: buildPharmacyEmail(rx, data, rxNumber),
        });
      }
      // Send email to patient
      if (appointment?.patient_email) {
        await base44.integrations.Core.SendEmail({
          to: appointment.patient_email,
          subject: `Your Prescription Has Been Sent — ${rxNumber}`,
          body: buildPatientEmail(data, rxNumber, data.pharmacy_name),
        });
      }
      return rx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setStep('sent');
    },
  });

  const handleMedSelect = (name) => {
    setSelectedMed(name);
    const med = COMMON_MEDICATIONS.find(m => m.name === name);
    if (med) {
      setForm(f => ({
        ...f,
        medication_name: name === 'Custom / Other' ? '' : name,
        frequency: med.freq,
        quantity: med.qty,
        days_supply: med.days,
        dosage: '',
      }));
    }
  };

  const handlePharmacySelect = (id) => {
    if (id === '__manual__') {
      setForm(f => ({ ...f, pharmacy_id: '', pharmacy_name: '', pharmacy_email: '' }));
      return;
    }
    const ph = pharmacies.find(p => p.id === id);
    if (ph) setForm(f => ({ ...f, pharmacy_id: id, pharmacy_name: ph.pharmacy_name, pharmacy_email: ph.contact_email }));
  };

  const isValid = form.medication_name && form.dosage && form.frequency && form.quantity && form.pharmacy_name;

  const handleClose = () => {
    setForm(BLANK_FORM);
    setSelectedMed('');
    setStep('write');
    onClose();
  };

  const selectedMedData = COMMON_MEDICATIONS.find(m => m.name === selectedMed);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#2D3A2D]">
            <Pill className="w-5 h-5 text-[#4A6741]" />
            {step === 'sent' ? 'Prescription Sent' : 'Write e-Prescription'}
          </DialogTitle>
          {appointment && step !== 'sent' && (
            <p className="text-sm text-[#5A6B5A]">
              Patient: <span className="font-medium text-[#2D3A2D]">{appointment.patient_email}</span>
            </p>
          )}
        </DialogHeader>

        {/* SENT SUCCESS */}
        {step === 'sent' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2D3A2D] text-lg">Prescription Sent!</h3>
              <p className="text-sm text-[#5A6B5A] mt-1">
                Sent to <strong>{form.pharmacy_name}</strong> and confirmation emailed to patient.
              </p>
            </div>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] rounded-full text-white" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}

        {/* CONFIRM STEP */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-2 text-sm">
              <Row label="Medication" value={`${form.medication_name} ${form.dosage}`} />
              <Row label="Sig" value={`${form.frequency} — ${form.instructions || 'As directed'}`} />
              <Row label="Qty / Supply" value={`${form.quantity} (${form.days_supply} days)`} />
              <Row label="Refills" value={String(form.refills)} />
              {form.diagnosis_code && <Row label="ICD-10" value={form.diagnosis_code} />}
              <Row label="Send to" value={form.pharmacy_name} />
              {form.pharmacy_email && <Row label="Pharmacy email" value={form.pharmacy_email} />}
              {form.is_controlled_substance && (
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Controlled Substance — ensure DEA compliance</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep('write')}>Back</Button>
              <Button
                className="flex-1 bg-[#4A6741] hover:bg-[#3D5636] rounded-full text-white"
                disabled={createRx.isPending}
                onClick={() => createRx.mutate(form)}
              >
                <Send className="w-4 h-4 mr-2" />
                {createRx.isPending ? 'Sending…' : 'Confirm & Send'}
              </Button>
            </div>
          </div>
        )}

        {/* WRITE STEP */}
        {step === 'write' && (
          <div className="space-y-4 pt-1">
            {/* Quick-select medication */}
            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Quick Select Medication</Label>
              <Select value={selectedMed} onValueChange={handleMedSelect}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Choose common medication…" /></SelectTrigger>
                <SelectContent>
                  {COMMON_MEDICATIONS.map(m => (
                    <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Medication name (editable) */}
            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Medication Name *</Label>
              <Input value={form.medication_name} onChange={e => setForm(f => ({ ...f, medication_name: e.target.value }))} placeholder="e.g. Semaglutide" className="mt-1" />
            </div>

            {/* Dosage */}
            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Dosage *</Label>
              {selectedMedData?.dosages?.length > 0 ? (
                <Select value={form.dosage} onValueChange={v => setForm(f => ({ ...f, dosage: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select dosage" /></SelectTrigger>
                  <SelectContent>
                    {selectedMedData.dosages.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    <SelectItem value="__custom__">Custom…</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} placeholder="e.g. 0.5mg" className="mt-1" />
              )}
              {form.dosage === '__custom__' && (
                <Input value={''} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} placeholder="Enter custom dosage" className="mt-1" autoFocus />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Frequency *</Label>
                <Input value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} placeholder="e.g. Once weekly" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Quantity *</Label>
                <Input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="e.g. 4 vials" className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Days Supply</Label>
                <Input type="number" min="1" value={form.days_supply} onChange={e => setForm(f => ({ ...f, days_supply: parseInt(e.target.value) || 30 }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Refills</Label>
                <Input type="number" min="0" max="11" value={form.refills} onChange={e => setForm(f => ({ ...f, refills: parseInt(e.target.value) || 0 }))} className="mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Sig / Instructions</Label>
              <Input value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="e.g. Inject subcutaneously into abdomen once weekly" className="mt-1" />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">ICD-10 Diagnosis Code</Label>
              <Input value={form.diagnosis_code} onChange={e => setForm(f => ({ ...f, diagnosis_code: e.target.value }))} placeholder="e.g. E66.01 (Morbid obesity)" className="mt-1" />
            </div>

            {/* Pharmacy */}
            <div>
              <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Send to Pharmacy *</Label>
              <Select onValueChange={handlePharmacySelect}>
                <SelectTrigger className="mt-1"><SelectValue placeholder={pharmacies.length ? 'Select pharmacy…' : 'Enter manually below'} /></SelectTrigger>
                <SelectContent>
                  {pharmacies.map(ph => (
                    <SelectItem key={ph.id} value={ph.id}>{ph.pharmacy_name}</SelectItem>
                  ))}
                  <SelectItem value="__manual__">Enter manually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Manual pharmacy fields if none selected from list */}
            {!form.pharmacy_id && (
              <div className="space-y-2">
                <Input value={form.pharmacy_name} onChange={e => setForm(f => ({ ...f, pharmacy_name: e.target.value }))} placeholder="Pharmacy name *" />
                <Input value={form.pharmacy_email} onChange={e => setForm(f => ({ ...f, pharmacy_email: e.target.value }))} placeholder="Pharmacy email (for transmission)" />
              </div>
            )}

            {/* Controlled substance flag */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.is_controlled_substance} onChange={e => setForm(f => ({ ...f, is_controlled_substance: e.target.checked }))} className="rounded" />
              <span className="text-sm text-[#2D3A2D]">Controlled substance</span>
            </label>

            <Button
              className="w-full bg-[#4A6741] hover:bg-[#3D5636] rounded-full text-white mt-2"
              disabled={!isValid}
              onClick={() => setStep('confirm')}
            >
              Review Prescription →
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[#5A6B5A] text-xs flex-shrink-0">{label}</span>
      <span className="text-[#2D3A2D] font-medium text-xs text-right">{value}</span>
    </div>
  );
}

function buildPharmacyEmail(rx, form, rxNumber) {
  return `
ELECTRONIC PRESCRIPTION

Rx Number: ${rxNumber}
Date: ${new Date().toLocaleDateString()}

PATIENT: ${form.patient_email || rx.patient_email}
PRESCRIBER: ${rx.provider_name || 'Provider'}

MEDICATION: ${form.medication_name}
DOSAGE: ${form.dosage}
SIG: ${form.frequency}
QTY: ${form.quantity}
DAYS SUPPLY: ${form.days_supply}
REFILLS: ${form.refills}
${form.instructions ? `INSTRUCTIONS: ${form.instructions}` : ''}
${form.diagnosis_code ? `DIAGNOSIS (ICD-10): ${form.diagnosis_code}` : ''}
${form.is_controlled_substance ? '\n⚠ CONTROLLED SUBSTANCE — DEA compliance required\n' : ''}

This prescription was electronically transmitted via MedRevolve.
Please process promptly and contact us with any questions.
  `.trim();
}

function buildPatientEmail(form, rxNumber, pharmacyName) {
  return `
Your prescription has been sent!

Rx Number: ${rxNumber}
Medication: ${form.medication_name} ${form.dosage}
Instructions: ${form.frequency}
Quantity: ${form.quantity} (${form.days_supply}-day supply)
Refills: ${form.refills}

Pharmacy: ${pharmacyName}

Your provider has electronically transmitted this prescription to ${pharmacyName}. They will contact you when it is ready for pickup or shipment.

If you have questions, please message your provider through the MedRevolve patient portal.

— MedRevolve Team
  `.trim();
}