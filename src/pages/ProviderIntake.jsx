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
import { CheckCircle2, Stethoscope, FileText, Award, Calendar, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: Stethoscope },
  { id: 2, title: 'Credentials', icon: Award },
  { id: 3, title: 'Experience', icon: FileText },
  { id: 4, title: 'Availability', icon: Calendar }
];

export default function ProviderIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    title: '',
    specialty: '',
    license_number: '',
    states_licensed: [],
    years_experience: '',
    practice_type: '',
    availability: '',
    bio: '',
    education: '',
    certifications: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('submitProviderIntake', data),
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
                <h2 className="text-3xl font-medium text-[#2D3A2D] mb-3">Application Submitted! 🎉</h2>
                <p className="text-lg text-[#5A6B5A] mb-4">
                  Welcome to the MedRevolve provider network
                </p>
                <p className="text-[#5A6B5A] mb-8">
                  Our credentialing team will review your application and contact you within 2-3 business days.
                  Check your email for next steps and what to expect!
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-[#4A6741]">
                  <Sparkles className="w-4 h-4" />
                  <span>Typical approval: 7-10 business days</span>
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
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
            Join Our <span className="font-medium">Provider Network</span>
          </h1>
          <p className="text-[#5A6B5A]">4 simple steps to start making an impact</p>
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Tell us about yourself</h2>
                      <p className="text-[#5A6B5A]">Your professional journey starts here</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Full Name *</Label>
                        <Input
                          autoComplete="name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Dr. Jane Smith"
                          required
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@example.com"
                          required
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Phone</Label>
                        <PhoneInput
                          value={formData.phone}
                          onChange={(v) => setFormData({ ...formData, phone: v })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Title *</Label>
                        <Select value={formData.title} onValueChange={(val) => setFormData({ ...formData, title: val })}>
                          <SelectTrigger className="mt-2 h-12">
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MD">MD - Doctor of Medicine</SelectItem>
                            <SelectItem value="DO">DO - Doctor of Osteopathic Medicine</SelectItem>
                            <SelectItem value="NP">NP - Nurse Practitioner</SelectItem>
                            <SelectItem value="PA">PA - Physician Assistant</SelectItem>
                            <SelectItem value="PharmD">PharmD - Doctor of Pharmacy</SelectItem>
                            <SelectItem value="RN">RN - Registered Nurse</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Specialty *</Label>
                      <Input
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        placeholder="e.g., Family Medicine, Endocrinology, Internal Medicine"
                        required
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Credentials & Licensing</h2>
                      <p className="text-[#5A6B5A]">We verify all credentials to ensure quality care</p>
                    </div>

                    <div>
                      <Label>Medical License Number *</Label>
                      <Input
                        value={formData.license_number}
                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                        placeholder="License #"
                        required
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label>Education</Label>
                      <Textarea
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder="Medical school, residency, fellowships..."
                        className="mt-2 min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label>Certifications</Label>
                      <Textarea
                        value={formData.certifications}
                        onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        placeholder="Board certifications, additional training..."
                        className="mt-2 min-h-[100px]"
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Your Experience</h2>
                      <p className="text-[#5A6B5A]">Help patients learn about you</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Years of Experience</Label>
                        <Input
                          type="number"
                          value={formData.years_experience}
                          onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                          placeholder="10"
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label>Practice Type</Label>
                        <Select value={formData.practice_type} onValueChange={(val) => setFormData({ ...formData, practice_type: val })}>
                          <SelectTrigger className="mt-2 h-12">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Telehealth">Telehealth Only</SelectItem>
                            <SelectItem value="In-Person">In-Person Only</SelectItem>
                            <SelectItem value="Both">Both Telehealth & In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Professional Bio</Label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell patients about your approach to care, areas of expertise, and what makes you unique..."
                        className="mt-2 min-h-[140px]"
                      />
                      <p className="text-xs text-[#5A6B5A] mt-2">This will be displayed on your provider profile</p>
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Almost done!</h2>
                      <p className="text-[#5A6B5A]">Let us know when you're available</p>
                    </div>

                    <div>
                      <Label>Typical Weekly Availability</Label>
                      <Textarea
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        placeholder="Example: Monday-Friday 9am-5pm, flexible evenings on Tuesday/Thursday"
                        className="mt-2 min-h-[100px]"
                      />
                      <p className="text-xs text-[#5A6B5A] mt-2">You'll set your exact schedule after approval</p>
                    </div>

                    <div className="bg-[#F5F0E8] rounded-xl p-6">
                      <h3 className="font-medium text-[#2D3A2D] mb-3">What happens next?</h3>
                      <ul className="space-y-2 text-sm text-[#5A6B5A]">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Credential verification (2-3 business days)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Interview with our medical director</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Platform training and orientation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Start accepting patients!</span>
                        </li>
                      </ul>
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
                    disabled={submitMutation.isPending || !formData.full_name || !formData.email || !formData.title || !formData.specialty || !formData.license_number}
                    className="bg-[#4A6741] hover:bg-[#3D5636] text-white px-8 ml-auto"
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}