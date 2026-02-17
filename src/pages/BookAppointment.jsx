import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2,
  User, Video, Phone, MessageSquare, Stethoscope, RefreshCw,
  Star, ChevronLeft, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

const APPOINTMENT_TYPES = [
  {
    value: 'initial_consultation',
    label: 'Initial Consultation',
    description: 'First-time visit — comprehensive assessment & treatment plan',
    duration: '45 min',
    icon: Stethoscope,
    color: 'from-blue-500 to-blue-600'
  },
  {
    value: 'follow_up',
    label: 'Follow-Up',
    description: 'Check in on your progress and adjust your protocol',
    duration: '20 min',
    icon: RefreshCw,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    value: 'dosage_adjustment',
    label: 'Dosage Adjustment',
    description: 'Discuss and modify your current medication dosage',
    duration: '15 min',
    icon: MessageSquare,
    color: 'from-purple-500 to-purple-600'
  },
  {
    value: 'general_inquiry',
    label: 'General Inquiry',
    description: 'Questions about your treatment or general wellness advice',
    duration: '15 min',
    icon: Phone,
    color: 'from-amber-500 to-amber-600'
  }
];

const STEP_LABELS = ['Appointment Type', 'Provider & Time', 'Visit Details', 'Confirm'];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-between mb-10">
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const isComplete = currentStep > step;
        const isActive = currentStep === step;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                isComplete ? 'bg-[#4A6741] text-white' :
                isActive ? 'bg-[#4A6741] text-white ring-4 ring-[#4A6741]/20' :
                'bg-[#E8E0D5] text-[#9A8B7A]'
              }`}>
                {isComplete ? <CheckCircle2 className="w-5 h-5" /> : step}
              </div>
              <span className={`text-xs mt-2 hidden sm:block font-medium ${isActive ? 'text-[#4A6741]' : 'text-[#9A8B7A]'}`}>
                {label}
              </span>
            </div>
            {step < 4 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${currentStep > step ? 'bg-[#4A6741]' : 'bg-[#E8E0D5]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Step 1 – Appointment Type
function StepType({ formData, setFormData, onNext }) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#2D3A2D]">What brings you in today?</h2>
        <p className="text-[#5A6B5A] mt-1">Select the type of appointment that best fits your needs.</p>
      </div>
      <div className="grid gap-3">
        {APPOINTMENT_TYPES.map((type) => {
          const Icon = type.icon;
          const selected = formData.type === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.value })}
              className={`w-full text-left border-2 rounded-2xl p-5 transition-all duration-200 group ${
                selected
                  ? 'border-[#4A6741] bg-[#4A6741]/5 shadow-md'
                  : 'border-[#E8E0D5] hover:border-[#4A6741]/40 hover:bg-[#F5F0E8]/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[#2D3A2D]">{type.label}</span>
                    <Badge variant="outline" className="text-xs text-[#5A6B5A] border-[#C8C0B5]">{type.duration}</Badge>
                  </div>
                  <p className="text-sm text-[#5A6B5A] leading-snug">{type.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                  selected ? 'border-[#4A6741] bg-[#4A6741]' : 'border-[#C8C0B5]'
                }`}>
                  {selected && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Button
        type="button"
        onClick={onNext}
        disabled={!formData.type}
        className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6 mt-4 text-base font-semibold"
      >
        Continue <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}

// Step 2 – Provider & Time Slot
function StepProviderTime({ formData, setFormData, onNext, onBack }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
    return base;
  }, [weekOffset]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const { data: providers = [], isLoading: loadingProviders } = useQuery({
    queryKey: ['activeProviders'],
    queryFn: () => base44.entities.Provider.filter({ is_active: true }, '-rating')
  });

  const { data: availableSlots, isLoading: loadingSlots } = useQuery({
    queryKey: ['availableSlots', formData.provider_id, formData.appointment_date],
    queryFn: async () => {
      if (!formData.provider_id || !formData.appointment_date) return null;
      const res = await base44.functions.invoke('getProviderAvailability', {
        provider_id: formData.provider_id,
        date: new Date(formData.appointment_date).toISOString()
      });
      return res.data;
    },
    enabled: !!formData.provider_id && !!formData.appointment_date
  });

  const fallbackSlots = [
    '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'
  ];
  const slots = availableSlots?.available_slots?.map(s => s.display_time) ?? (!formData.appointment_date ? [] : fallbackSlots);

  const selectedProvider = providers.find(p => p.id === formData.provider_id);

  const canNext = formData.provider_id && formData.appointment_date && formData.appointment_time;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#2D3A2D]">Choose your provider & time</h2>
        <p className="text-[#5A6B5A] mt-1">Select a licensed provider and pick a time that works for you.</p>
      </div>

      {/* Provider selection */}
      <div>
        <Label className="text-sm font-semibold text-[#2D3A2D] mb-3 block">Select Provider</Label>
        {loadingProviders ? (
          <div className="flex items-center gap-2 text-[#5A6B5A] py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading providers...
          </div>
        ) : (
          <div className="grid gap-3">
            {providers.map((provider) => {
              const selected = formData.provider_id === provider.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, provider_id: provider.id, appointment_time: '' })}
                  className={`w-full text-left border-2 rounded-2xl p-4 transition-all duration-200 ${
                    selected ? 'border-[#4A6741] bg-[#4A6741]/5' : 'border-[#E8E0D5] hover:border-[#4A6741]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80'}
                      alt={provider.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2D3A2D]">{provider.name}, {provider.title}</p>
                      <p className="text-sm text-[#5A6B5A]">{provider.specialty}</p>
                      {provider.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-[#5A6B5A]">{provider.rating} · {provider.total_consultations || 0} consultations</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selected ? 'border-[#4A6741] bg-[#4A6741]' : 'border-[#C8C0B5]'}`}>
                      {selected && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Date picker — weekly calendar strip */}
      {formData.provider_id && (
        <div>
          <Label className="text-sm font-semibold text-[#2D3A2D] mb-3 block">Select Date</Label>
          <div className="bg-[#F5F0E8] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
                disabled={weekOffset === 0}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-[#2D3A2D]">
                {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset(w => w + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => {
                const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
                const dateStr = format(day, 'yyyy-MM-dd');
                const selected = formData.appointment_date === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isPast}
                    onClick={() => setFormData({ ...formData, appointment_date: dateStr, appointment_time: '' })}
                    className={`flex flex-col items-center py-2 rounded-xl transition-all text-xs font-medium ${
                      isPast ? 'opacity-30 cursor-not-allowed' :
                      selected ? 'bg-[#4A6741] text-white shadow-md' :
                      isToday(day) ? 'bg-white border-2 border-[#4A6741] text-[#4A6741]' :
                      'bg-white hover:bg-[#4A6741]/10 text-[#2D3A2D]'
                    }`}
                  >
                    <span className="uppercase tracking-wider text-[10px]">{format(day, 'EEE')}</span>
                    <span className="text-base font-bold mt-0.5">{format(day, 'd')}</span>
                    {isToday(day) && !selected && <div className="w-1 h-1 rounded-full bg-[#4A6741] mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Time slots */}
      {formData.appointment_date && (
        <div>
          <Label className="text-sm font-semibold text-[#2D3A2D] mb-3 block flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Available Times
          </Label>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-[#5A6B5A] py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8 bg-[#F5F0E8] rounded-2xl text-[#5A6B5A]">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#9A8B7A]" />
              No available slots for this date. Please try a different day.
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setFormData({ ...formData, appointment_time: time })}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formData.appointment_time === time
                      ? 'bg-[#4A6741] text-white shadow-md'
                      : 'bg-[#F5F0E8] text-[#5A6B5A] hover:bg-[#E8E0D5]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 rounded-full border-[#4A6741] text-[#4A6741]">
          <ChevronLeft className="mr-1 w-4 h-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="flex-2 flex-grow-[2] bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
        >
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 3 – Reason & Notes
function StepDetails({ formData, setFormData, onNext, onBack }) {
  const selectedType = APPOINTMENT_TYPES.find(t => t.value === formData.type);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#2D3A2D]">Tell us about your visit</h2>
        <p className="text-[#5A6B5A] mt-1">Help your provider prepare for your consultation.</p>
      </div>

      <div>
        <Label htmlFor="reason" className="text-sm font-semibold text-[#2D3A2D] mb-2 block">
          Primary reason for visit <span className="text-red-500">*</span>
        </Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder={`e.g., ${selectedType?.label === 'Initial Consultation' ? 'Starting a weight management program' : 'Review my current treatment plan'}`}
          className="rounded-xl border-[#E8E0D5] focus-visible:ring-[#4A6741]"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-semibold text-[#2D3A2D] mb-2 block">
          Phone number <span className="text-[#9A8B7A] font-normal">(for SMS reminders)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
          className="rounded-xl border-[#E8E0D5] focus-visible:ring-[#4A6741]"
        />
        <p className="text-xs text-[#9A8B7A] mt-1.5">We'll send you a reminder 24 hours before your appointment.</p>
      </div>

      <div className="bg-[#4A6741]/5 border border-[#4A6741]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="recordingConsent"
            checked={formData.recording_consent || false}
            onChange={(e) => setFormData({ ...formData, recording_consent: e.target.checked })}
            className="w-4 h-4 rounded border-[#4A6741] accent-[#4A6741] mt-0.5"
          />
          <label htmlFor="recordingConsent" className="flex-1 text-sm text-[#2D3A2D]">
            <span className="font-semibold">I consent to recording this consultation</span>
            <p className="text-[#5A6B5A] text-xs mt-1">Recordings will be securely stored and available for your review only. This helps you reference your provider's recommendations later.</p>
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-semibold text-[#2D3A2D] mb-2 block">
          Additional notes <span className="text-[#9A8B7A] font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Current medications, allergies, specific questions, or anything else your provider should know..."
          className="rounded-xl border-[#E8E0D5] focus-visible:ring-[#4A6741] h-28"
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 rounded-full border-[#4A6741] text-[#4A6741]">
          <ChevronLeft className="mr-1 w-4 h-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!formData.reason.trim()}
          className="flex-2 flex-grow-[2] bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
        >
          Review & Confirm <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 4 – Confirm
function StepConfirm({ formData, providers, onSubmit, onBack, isSubmitting }) {
  const provider = providers.find(p => p.id === formData.provider_id);
  const apptType = APPOINTMENT_TYPES.find(t => t.value === formData.type);
  const Icon = apptType?.icon || Stethoscope;

  const dateDisplay = formData.appointment_date
    ? format(new Date(formData.appointment_date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#2D3A2D]">Confirm your appointment</h2>
        <p className="text-[#5A6B5A] mt-1">Please review your details before booking.</p>
      </div>

      <div className="bg-gradient-to-br from-[#F5F0E8] to-[#EDE8DE] rounded-2xl p-6 space-y-4">
        {/* Type */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#D8D0C5]">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${apptType?.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#2D3A2D]">{apptType?.label}</p>
            <p className="text-sm text-[#5A6B5A]">{apptType?.duration} session</p>
          </div>
        </div>

        {/* Provider */}
        {provider && (
          <div className="flex items-center gap-3 pb-4 border-b border-[#D8D0C5]">
            <img
              src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80'}
              alt={provider.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="font-semibold text-[#2D3A2D]">{provider.name}, {provider.title}</p>
              <p className="text-sm text-[#5A6B5A]">{provider.specialty}</p>
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div className="flex items-start gap-3 pb-4 border-b border-[#D8D0C5]">
          <Calendar className="w-5 h-5 text-[#4A6741] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#2D3A2D]">{dateDisplay}</p>
            <p className="text-sm text-[#5A6B5A] flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formData.appointment_time}</p>
          </div>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-[#4A6741] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#2D3A2D] mb-0.5">Reason</p>
            <p className="text-sm text-[#5A6B5A]">{formData.reason}</p>
            {formData.notes && <p className="text-sm text-[#5A6B5A] mt-1 italic">{formData.notes}</p>}
          </div>
        </div>
      </div>

      <div className="bg-[#4A6741]/5 border border-[#4A6741]/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#4A6741] mt-0.5 flex-shrink-0" />
        <p className="text-sm text-[#4A6741]">
          A confirmation email{formData.phone ? ' and SMS' : ''} will be sent immediately. A reminder will follow 24 hours before your appointment.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting} className="flex-1 rounded-full border-[#4A6741] text-[#4A6741]">
          <ChevronLeft className="mr-1 w-4 h-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-2 flex-grow-[2] bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white rounded-full font-semibold"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Booking...</>
          ) : (
            <>Confirm Appointment <CheckCircle2 className="ml-2 w-4 h-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}

// Success screen
function SuccessScreen({ formData, providers }) {
  const provider = providers.find(p => p.id === formData.provider_id);
  const apptType = APPOINTMENT_TYPES.find(t => t.value === formData.type);
  const dateDisplay = formData.appointment_date
    ? format(new Date(formData.appointment_date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-3xl font-bold text-[#2D3A2D] mb-2">You're all set!</h2>
      <p className="text-[#5A6B5A] mb-6">Your appointment has been confirmed.</p>

      <div className="bg-[#F5F0E8] rounded-2xl p-5 text-left mb-6 max-w-sm mx-auto">
        <p className="font-semibold text-[#2D3A2D] mb-1">{apptType?.label}</p>
        {provider && <p className="text-sm text-[#5A6B5A]">with {provider.name}, {provider.title}</p>}
        <div className="mt-3 flex items-center gap-2 text-sm text-[#4A6741] font-medium">
          <Calendar className="w-4 h-4" /> {dateDisplay} at {formData.appointment_time}
        </div>
      </div>

      <p className="text-sm text-[#5A6B5A] mb-8">
        A confirmation email{formData.phone ? ' and SMS' : ''} has been sent. You'll receive a reminder 24 hours before your appointment.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={createPageUrl('PatientPortal')}>
          <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8">
            View in My Portal
          </Button>
        </Link>
        <Link to={createPageUrl('Consultations')}>
          <Button variant="outline" className="border-[#4A6741] text-[#4A6741] rounded-full px-8">
            Back to Consultations
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function BookAppointment() {
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedProvider = urlParams.get('provider');

  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);
  const [formData, setFormData] = useState({
    provider_id: preSelectedProvider || '',
    appointment_date: '',
    appointment_time: '',
    type: '',
    reason: '',
    notes: '',
    phone: ''
  });

  const queryClient = useQueryClient();

  const { data: providers = [] } = useQuery({
    queryKey: ['activeProviders'],
    queryFn: () => base44.entities.Provider.filter({ is_active: true }, '-rating')
  });

  const bookMutation = useMutation({
    mutationFn: async (data) => {
      const res = await base44.functions.invoke('bookConsultation', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingAppointments']);
      setBooked(true);
    }
  });

  const handleSubmit = () => bookMutation.mutate(formData);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {!booked && (
          <Link to={createPageUrl('Consultations')}>
            <Button variant="ghost" className="mb-6 text-[#5A6B5A] hover:text-[#2D3A2D] -ml-2">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Consultations
            </Button>
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#E8E0D5]"
        >
          {!booked && (
            <>
              <div className="mb-8">
                <Badge className="bg-[#4A6741]/10 text-[#4A6741] border-none mb-3">
                  <Video className="w-3.5 h-3.5 mr-1.5" /> Telehealth Consultation
                </Badge>
                <h1 className="text-3xl font-bold text-[#2D3A2D]">Book an Appointment</h1>
                <p className="text-[#5A6B5A] mt-1">Schedule with a licensed provider in just a few steps.</p>
              </div>
              <StepIndicator currentStep={step} />
            </>
          )}

          <AnimatePresence mode="wait">
            {booked ? (
              <SuccessScreen key="success" formData={formData} providers={providers} />
            ) : step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <StepType formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <StepProviderTime formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />
              </motion.div>
            ) : step === 3 ? (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <StepDetails formData={formData} setFormData={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />
              </motion.div>
            ) : (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <StepConfirm
                  formData={formData}
                  providers={providers}
                  onSubmit={handleSubmit}
                  onBack={() => setStep(3)}
                  isSubmitting={bookMutation.isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {bookMutation.isError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {bookMutation.error?.message || 'Something went wrong. Please try again.'}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}