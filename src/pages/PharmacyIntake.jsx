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
import { CheckCircle2, Pill, Building, MapPin, FileText, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';

const STEPS = [
  { id: 1, title: 'Pharmacy Info', icon: Pill },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Licensing', icon: Building },
  { id: 4, title: 'Services', icon: FileText }
];

export default function PharmacyIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pharmacy_name: '',
    contact_name: '',
    email: '',
    phone: '',
    license_number: '',
    npi_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    pharmacy_type: '',
    services_offered: [],
    shipping_capabilities: '',
    partnership_interest: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('submitPharmacyIntake', data),
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
                <h2 className="text-3xl font-medium text-[#2D3A2D] mb-3">Partnership Request Received! 🤝</h2>
                <p className="text-lg text-[#5A6B5A] mb-4">
                  Excited to explore this partnership
                </p>
                <p className="text-[#5A6B5A] mb-8">
                  Our pharmacy partnerships team will review your information and contact you within 3-5 business days
                  to discuss next steps. Check your email for confirmation!
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-[#4A6741]">
                  <Sparkles className="w-4 h-4" />
                  <span>Average partnership setup: 4-6 weeks</span>
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
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
            Pharmacy <span className="font-medium">Partnership</span>
          </h1>
          <p className="text-[#5A6B5A]">Join our trusted pharmacy network</p>
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Pharmacy Information</h2>
                      <p className="text-[#5A6B5A]">Tell us about your pharmacy</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Pharmacy Name *</Label>
                        <Input
                          autoComplete="organization"
                          value={formData.pharmacy_name}
                          onChange={(e) => setFormData({ ...formData, pharmacy_name: e.target.value })}
                          placeholder="ABC Pharmacy"
                          required
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label>Contact Name *</Label>
                        <Input
                          autoComplete="name"
                          value={formData.contact_name}
                          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                          placeholder="John Smith"
                          required
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="contact@pharmacy.com"
                          required
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <PhoneInput
                          value={formData.phone}
                          onChange={(v) => setFormData({ ...formData, phone: v })}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Pharmacy Type *</Label>
                      <Select value={formData.pharmacy_type} onValueChange={(val) => setFormData({ ...formData, pharmacy_type: val })}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select pharmacy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Compounding">Compounding Pharmacy</SelectItem>
                          <SelectItem value="Retail">Retail Pharmacy</SelectItem>
                          <SelectItem value="Mail Order">Mail Order Pharmacy</SelectItem>
                          <SelectItem value="Specialty">Specialty Pharmacy</SelectItem>
                          <SelectItem value="Hospital">Hospital Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Location Details</h2>
                      <p className="text-[#5A6B5A]">Where is your pharmacy located?</p>
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

                    <div>
                      <Label>Shipping Capabilities</Label>
                      <Select value={formData.shipping_capabilities} onValueChange={(val) => setFormData({ ...formData, shipping_capabilities: val })}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select shipping reach" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Local Only">Local Only</SelectItem>
                          <SelectItem value="State-Wide">State-Wide</SelectItem>
                          <SelectItem value="National">National</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Licensing & Credentials</h2>
                      <p className="text-[#5A6B5A]">Verify your pharmacy's credentials</p>
                    </div>

                    <div>
                      <Label>Pharmacy License Number *</Label>
                      <Input
                        value={formData.license_number}
                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                        placeholder="License #"
                        required
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label>NPI Number</Label>
                      <Input
                        value={formData.npi_number}
                        onChange={(e) => setFormData({ ...formData, npi_number: e.target.value })}
                        placeholder="National Provider Identifier"
                        className="mt-2 h-12"
                      />
                    </div>

                    <div className="bg-[#F5F0E8] rounded-xl p-6">
                      <h3 className="font-medium text-[#2D3A2D] mb-3">What we verify:</h3>
                      <ul className="space-y-2 text-sm text-[#5A6B5A]">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Active pharmacy license</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>NABP accreditation status</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Compliance and quality standards</span>
                        </li>
                      </ul>
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
                      <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Final Step!</h2>
                      <p className="text-[#5A6B5A]">Tell us why you want to partner</p>
                    </div>

                    <div>
                      <Label>Why Partner With MedRevolve?</Label>
                      <Textarea
                        value={formData.partnership_interest}
                        onChange={(e) => setFormData({ ...formData, partnership_interest: e.target.value })}
                        placeholder="Tell us about your interest in partnering with us, your capacity, and what makes your pharmacy a great fit..."
                        className="mt-2 min-h-[140px]"
                      />
                    </div>

                    <div className="bg-[#F5F0E8] rounded-xl p-6">
                      <h3 className="font-medium text-[#2D3A2D] mb-3">Partnership Benefits:</h3>
                      <ul className="space-y-2 text-sm text-[#5A6B5A]">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Steady prescription volume</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Streamlined fulfillment process</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Competitive pricing structure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                          <span>Dedicated support team</span>
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
                    disabled={submitMutation.isPending || !formData.pharmacy_name || !formData.contact_name || !formData.email || !formData.license_number || !formData.pharmacy_type}
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