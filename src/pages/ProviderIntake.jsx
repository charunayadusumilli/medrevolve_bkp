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
import { CheckCircle2, Stethoscope } from 'lucide-react';

export default function ProviderIntake() {
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
              <h2 className="text-2xl font-medium text-[#2D3A2D] mb-3">Application Submitted!</h2>
              <p className="text-[#5A6B5A] mb-6">
                Thank you for your interest in joining MedRevolve. We'll review your application and contact you within 2-3 business days.
              </p>
              <p className="text-sm text-[#5A6B5A]">
                Check your email for confirmation and next steps.
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
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-3">
            Provider <span className="font-medium">Application</span>
          </h1>
          <p className="text-[#5A6B5A]">Join our network of healthcare professionals</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Dr. Jane Smith"
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
                    placeholder="jane@example.com"
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
                  <Label>Title *</Label>
                  <Select value={formData.title} onValueChange={(val) => setFormData({ ...formData, title: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MD">MD</SelectItem>
                      <SelectItem value="DO">DO</SelectItem>
                      <SelectItem value="NP">NP</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                      <SelectItem value="PharmD">PharmD</SelectItem>
                      <SelectItem value="RN">RN</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Specialty *</Label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Family Medicine, Endocrinology, etc."
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Medical License Number *</Label>
                  <Input
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="License #"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                    placeholder="10"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Practice Type</Label>
                  <Select value={formData.practice_type} onValueChange={(val) => setFormData({ ...formData, practice_type: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Telehealth">Telehealth</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              <div>
                <Label>Professional Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your practice philosophy and experience..."
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div>
                <Label>Availability</Label>
                <Textarea
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  placeholder="Describe your typical weekly availability..."
                  className="mt-2 min-h-[80px]"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white py-6"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}