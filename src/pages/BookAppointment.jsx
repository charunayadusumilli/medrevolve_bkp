import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function BookAppointment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedProvider = urlParams.get('provider');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    provider_id: preSelectedProvider || '',
    appointment_date: '',
    appointment_time: '',
    type: 'initial_consultation',
    reason: '',
    notes: ''
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['activeProviders'],
    queryFn: () => base44.entities.Provider.filter({ is_active: true }, '-rating')
  });

  const createAppointment = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('bookConsultation', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingAppointments']);
      setStep(4);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAppointment.mutate(formData);
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30'
  ];

  const appointmentTypes = [
    { value: 'initial_consultation', label: 'Initial Consultation', description: 'First-time visit for assessment' },
    { value: 'follow_up', label: 'Follow-Up', description: 'Check progress and adjust treatment' },
    { value: 'dosage_adjustment', label: 'Dosage Adjustment', description: 'Modify medication dosage' },
    { value: 'general_inquiry', label: 'General Inquiry', description: 'Questions or concerns' }
  ];

  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#D4E5D7] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#4A6741]" />
          </div>
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">
            Appointment Scheduled!
          </h2>
          <p className="text-[#5A6B5A] mb-8">
            You'll receive a confirmation email shortly. We'll send you a reminder 24 hours before your appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('MyAppointments')}>
              <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8">
                View My Appointments
              </Button>
            </Link>
            <Link to={createPageUrl('Consultations')}>
              <Button variant="outline" className="border-[#4A6741] text-[#4A6741] rounded-full px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to={createPageUrl('Consultations')}>
          <Button variant="ghost" className="mb-6 text-[#5A6B5A]">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm"
        >
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">Book Consultation</h1>
          <p className="text-[#5A6B5A] mb-8">Schedule your appointment with a licensed provider</p>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s ? 'bg-[#4A6741] text-white' : 'bg-[#E8E0D5] text-[#5A6B5A]'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-[#4A6741]' : 'bg-[#E8E0D5]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Appointment Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-[#2D3A2D] mb-4 block">What type of appointment do you need?</Label>
                  <RadioGroup 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({...formData, type: value})}
                    className="space-y-3"
                  >
                    {appointmentTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-3 border border-[#E8E0D5] rounded-xl p-4 hover:border-[#4A6741] transition-colors">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-[#2D3A2D]">{type.label}</div>
                          <div className="text-sm text-[#5A6B5A]">{type.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="reason" className="text-[#2D3A2D]">Brief reason for visit *</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="e.g., Weight management consultation"
                    className="mt-2 rounded-xl"
                    required
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6"
                  disabled={!formData.type || !formData.reason}
                >
                  Continue to Provider Selection
                </Button>
              </div>
            )}

            {/* Step 2: Select Provider & Date/Time */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-[#2D3A2D] mb-4 block">Select a Provider</Label>
                  <div className="grid gap-4">
                    {providers.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => setFormData({...formData, provider_id: provider.id})}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          formData.provider_id === provider.id
                            ? 'border-[#4A6741] bg-[#4A6741]/5'
                            : 'border-[#E8E0D5] hover:border-[#4A6741]/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80'}
                            alt={provider.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-[#2D3A2D]">{provider.name}, {provider.title}</p>
                            <p className="text-sm text-[#5A6B5A]">{provider.specialty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="appointment_date" className="text-[#2D3A2D]">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Select Date *
                  </Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#2D3A2D] mb-3 block">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Select Time *
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({...formData, appointment_time: time})}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          formData.appointment_time === time
                            ? 'bg-[#4A6741] text-white'
                            : 'bg-[#F5F0E8] text-[#5A6B5A] hover:bg-[#E8E0D5]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
                    disabled={!formData.provider_id || !formData.appointment_date || !formData.appointment_time}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Notes & Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="notes" className="text-[#2D3A2D]">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional information you'd like your provider to know..."
                    className="mt-2 rounded-xl h-32"
                  />
                </div>

                <div className="bg-[#F5F0E8] rounded-xl p-6">
                  <h3 className="font-medium text-[#2D3A2D] mb-4">Appointment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5A6B5A]">Type:</span>
                      <span className="text-[#2D3A2D] font-medium">
                        {appointmentTypes.find(t => t.value === formData.type)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A6B5A]">Date:</span>
                      <span className="text-[#2D3A2D] font-medium">
                        {new Date(formData.appointment_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A6B5A]">Time:</span>
                      <span className="text-[#2D3A2D] font-medium">{formData.appointment_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? 'Booking...' : 'Confirm Appointment'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}