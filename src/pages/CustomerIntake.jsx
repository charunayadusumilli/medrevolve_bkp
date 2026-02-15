import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, User } from 'lucide-react';

export default function CustomerIntake() {
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#D4E5D7] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#4A6741]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D3A2D] mb-3">Welcome to MedRevolve!</h2>
              <p className="text-[#5A6B5A] mb-6">
                Your wellness journey starts here. We'll contact you within 24 hours to schedule your initial consultation.
              </p>
              <p className="text-sm text-[#5A6B5A]">
                Check your email for next steps and a special welcome offer!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#4A6741] flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-3">
            Welcome to <span className="font-medium">MedRevolve</span>
          </h1>
          <p className="text-[#5A6B5A]">Let's start your wellness journey together</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Los Angeles"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="CA"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    placeholder="90001"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Primary Wellness Interest *</Label>
                  <Select value={formData.primary_interest} onValueChange={(val) => setFormData({ ...formData, primary_interest: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weight Management">Weight Management</SelectItem>
                      <SelectItem value="Hormone Therapy">Hormone Therapy</SelectItem>
                      <SelectItem value="Longevity">Longevity</SelectItem>
                      <SelectItem value="Hair Health">Hair Health</SelectItem>
                      <SelectItem value="Skin Health">Skin Health</SelectItem>
                      <SelectItem value="General Wellness">General Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>How Did You Hear About Us?</Label>
                  <Select value={formData.heard_about_us} onValueChange={(val) => setFormData({ ...formData, heard_about_us: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Search Engine">Search Engine</SelectItem>
                      <SelectItem value="Friend/Family">Friend/Family</SelectItem>
                      <SelectItem value="Healthcare Provider">Healthcare Provider</SelectItem>
                      <SelectItem value="Advertisement">Advertisement</SelectItem>
                      <SelectItem value="Creator/Influencer">Creator/Influencer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Referral Code (Optional)</Label>
                  <Input
                    value={formData.referral_code}
                    onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                    placeholder="Enter code if you have one"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>When Would You Like a Consultation?</Label>
                  <Select value={formData.consultation_preference} onValueChange={(val) => setFormData({ ...formData, consultation_preference: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASAP">ASAP</SelectItem>
                      <SelectItem value="Within a week">Within a week</SelectItem>
                      <SelectItem value="Within a month">Within a month</SelectItem>
                      <SelectItem value="Just browsing">Just browsing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Insurance Provider</Label>
                  <Input
                    value={formData.insurance_provider}
                    onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                    placeholder="Blue Cross, Aetna, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Insurance Member ID</Label>
                  <Input
                    value={formData.insurance_id}
                    onChange={(e) => setFormData({ ...formData, insurance_id: e.target.value })}
                    placeholder="Member ID"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Relevant Medical History (Optional)</Label>
                <Textarea
                  value={formData.medical_history_notes}
                  onChange={(e) => setFormData({ ...formData, medical_history_notes: e.target.value })}
                  placeholder="Any conditions, medications, or allergies we should know about..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white py-6"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Complete Intake'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}