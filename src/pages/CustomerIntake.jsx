import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, User, MapPin, Heart, Calendar, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';

const STEPS = [
  { id: 1, title: 'About You', icon: User },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Your Goals', icon: Heart },
  { id: 4, title: 'Medical Info', icon: Calendar }
];

export default function CustomerIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    primary_interest: '',
    heard_about_us: '',
    referral_code: '',
    insurance_provider: '',
    insurance_id: '',
    medical_history_notes: '',
    consultation_preference: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('submitCustomerIntake', data),
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progress = (currentStep / STEPS.length) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-none shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-medium text-[#2D3A2D] mb-3">Welcome to MedRevolve! 🌿</h2>
                <p className="text-lg text-[#5A6B5A] mb-4">
                  Your wellness journey starts now
                </p>
                <p className="text-[#5A6B5A] mb-8">
                  We'll contact you within 24 hours to schedule your personalized consultation.
                  Check your email for next steps and a special welcome offer!
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-[#4A6741]">
                  <Sparkles className="w-4 h-4" />
                  <span>Your journey to better health begins</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
            Start Your <span className="font-medium">Wellness Journey</span>
          </h1>
          <p className="text-[#5A6B5A]">Just 4 quick steps to personalized care</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center gap-2 transition-all ${isActive ? 'scale-110' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-[#4A6741] text-white' :
                      isActive ? 'bg-[#4A6741] text-white shadow-lg' :
                      'bg-white text-[#5A6B5A] border-2 border-[#E8E0D5]'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`hidden sm:block text-sm font-medium transition-colors ${
                      isActive ? 'text-[#4A6741]' : 'text-[#5A6B5A]'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      currentStep > step.id ? 'bg-[#4A6741]' : 'bg-[#E8E0D5]'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="border-none shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Let's get to know you</h2>
                      <p className="text-[#5A6B5A]">Your information is safe and secure</p>
                    </div>

                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        autoComplete="name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label>Phone Number</Label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(v) => setFormData({ ...formData, phone: v })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        autoComplete="bday"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="mt-2 h-12"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Where should we deliver?</h2>
                      <p className="text-[#5A6B5A]">We ship nationwide, discreetly</p>
                    </div>

                    <div>
                      <Label>Street Address</Label>
                      <Input
                        autoComplete="street-address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Main Street"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          autoComplete="address-level2"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Los Angeles"
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          autoComplete="address-level1"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="CA"
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>ZIP Code</Label>
                      <Input
                        autoComplete="postal-code"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                        placeholder="90001"
                        className="mt-2 h-12"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">What brings you here today?</h2>
                      <p className="text-[#5A6B5A]">Help us personalize your experience</p>
                    </div>

                    <div>
                      <Label>Primary Wellness Interest *</Label>
                      <Select value={formData.primary_interest} onValueChange={(val) => setFormData({ ...formData, primary_interest: val })}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select your main goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weight Management">Weight Management</SelectItem>
                          <SelectItem value="Hormone Therapy">Hormone Therapy</SelectItem>
                          <SelectItem value="Longevity">Longevity & Anti-Aging</SelectItem>
                          <SelectItem value="Hair Health">Hair Health</SelectItem>
                          <SelectItem value="Skin Health">Skin Health</SelectItem>
                          <SelectItem value="General Wellness">General Wellness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>When would you like to start?</Label>
                      <Select value={formData.consultation_preference} onValueChange={(val) => setFormData({ ...formData, consultation_preference: val })}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select your timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ASAP">As soon as possible</SelectItem>
                          <SelectItem value="Within a week">Within the next week</SelectItem>
                          <SelectItem value="Within a month">Within the next month</SelectItem>
                          <SelectItem value="Just browsing">Just exploring options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>How did you hear about us?</Label>
                      <Select value={formData.heard_about_us} onValueChange={(val) => setFormData({ ...formData, heard_about_us: val })}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Search Engine">Search Engine</SelectItem>
                          <SelectItem value="Friend/Family">Friend or Family</SelectItem>
                          <SelectItem value="Healthcare Provider">Healthcare Provider</SelectItem>
                          <SelectItem value="Creator/Influencer">Creator/Influencer</SelectItem>
                          <SelectItem value="Advertisement">Advertisement</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Referral Code (Optional)</Label>
                      <Input
                        value={formData.referral_code}
                        onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                        placeholder="Enter code for discount"
                        className="mt-2 h-12"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Almost there!</h2>
                      <p className="text-[#5A6B5A]">This helps us provide better care</p>
                    </div>

                    <div>
                      <Label>Insurance Provider (Optional)</Label>
                      <Input
                        value={formData.insurance_provider}
                        onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                        placeholder="e.g., Blue Cross, Aetna, UnitedHealthcare"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label>Insurance Member ID (Optional)</Label>
                      <Input
                        value={formData.insurance_id}
                        onChange={(e) => setFormData({ ...formData, insurance_id: e.target.value })}
                        placeholder="Member ID"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label>Medical History (Optional)</Label>
                      <Textarea
                        value={formData.medical_history_notes}
                        onChange={(e) => setFormData({ ...formData, medical_history_notes: e.target.value })}
                        placeholder="Any conditions, medications, or allergies we should know about..."
                        className="mt-2 min-h-[120px]"
                      />
                      <p className="text-xs text-[#5A6B5A] mt-2">This information helps your provider create a safe, personalized plan</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8E0D5]">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-6"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : <div />}

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#4A6741] hover:bg-[#3D5636] text-white px-8 ml-auto"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending || !formData.full_name || !formData.email || !formData.primary_interest}
                    className="bg-[#4A6741] hover:bg-[#3D5636] text-white px-8 ml-auto"
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Complete Journey'}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-6 text-sm text-[#5A6B5A]"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />
            <span>Private & Secure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}