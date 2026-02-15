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
import { CheckCircle2, Pill } from 'lucide-react';

export default function PharmacyIntake() {
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
                Thank you for your interest in partnering with MedRevolve. Our pharmacy partnerships team will contact you within 3-5 business days.
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
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-3">
            Pharmacy <span className="font-medium">Partnership</span>
          </h1>
          <p className="text-[#5A6B5A]">Partner with us to provide exceptional patient care</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Pharmacy Name *</Label>
                  <Input
                    value={formData.pharmacy_name}
                    onChange={(e) => setFormData({ ...formData, pharmacy_name: e.target.value })}
                    placeholder="ABC Pharmacy"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Contact Name *</Label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="John Smith"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@pharmacy.com"
                    required
                    className="mt-2"
                  />
                </div>
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Pharmacy License Number *</Label>
                  <Input
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="License #"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>NPI Number</Label>
                  <Input
                    value={formData.npi_number}
                    onChange={(e) => setFormData({ ...formData, npi_number: e.target.value })}
                    placeholder="NPI #"
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
                  <Label>Pharmacy Type *</Label>
                  <Select value={formData.pharmacy_type} onValueChange={(val) => setFormData({ ...formData, pharmacy_type: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compounding">Compounding</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Mail Order">Mail Order</SelectItem>
                      <SelectItem value="Specialty">Specialty</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shipping Capabilities</Label>
                  <Select value={formData.shipping_capabilities} onValueChange={(val) => setFormData({ ...formData, shipping_capabilities: val })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select reach" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Local Only">Local Only</SelectItem>
                      <SelectItem value="State-Wide">State-Wide</SelectItem>
                      <SelectItem value="National">National</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Why Partner With MedRevolve?</Label>
                <Textarea
                  value={formData.partnership_interest}
                  onChange={(e) => setFormData({ ...formData, partnership_interest: e.target.value })}
                  placeholder="Tell us about your interest in partnering with us..."
                  className="mt-2 min-h-[120px]"
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