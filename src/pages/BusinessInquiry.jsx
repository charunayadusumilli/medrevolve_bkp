import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function BusinessInquiry() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    industry: 'Med Spa/Clinic',
    interest_type: 'General Inquiry',
    company_size: '',
    message: ''
  });

  const submitInquiry = useMutation({
    mutationFn: async (data) => {
      const inquiry = await base44.entities.BusinessInquiry.create(data);
      
      // Send notification to business@medrevolve.com
      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve Business Development',
        to: 'business@medrevolve.com',
        subject: `New Business Inquiry - ${data.company_name}`,
        body: `
New business inquiry received:

Company: ${data.company_name}
Contact: ${data.contact_name}
Email: ${data.email}
Phone: ${data.phone}
Industry: ${data.industry}
Interest: ${data.interest_type}
Company Size: ${data.company_size}

Message:
${data.message}

Inquiry ID: ${inquiry.id}
Submitted: ${new Date().toLocaleString()}
        `
      });

      // Send confirmation to business
      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve Business Development',
        to: data.email,
        subject: 'Thank You for Your Interest - MedRevolve',
        body: `
Hi ${data.contact_name},

Thank you for your interest in partnering with MedRevolve! We're excited to explore how we can support ${data.company_name}.

Our business development team will review your inquiry and reach out within 1-2 business days to discuss next steps.

Best regards,
MedRevolve Business Team
        `
      });

      return inquiry;
    },
    onSuccess: () => {
      setSubmitted(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitInquiry.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#E5D4C8] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#8B7355]" />
          </div>
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">
            Inquiry Submitted!
          </h2>
          <p className="text-[#5A6B5A] mb-8">
            Thank you for your interest! Our business development team will reach out within 1-2 business days.
          </p>
          <Link to={createPageUrl('ForBusiness')}>
            <Button className="bg-[#8B7355] hover:bg-[#6B5A45] text-white rounded-full px-8">
              Back to Business Solutions
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to={createPageUrl('ForBusiness')}>
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
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">Business Inquiry</h1>
          <p className="text-[#5A6B5A] mb-8">Let's discuss how we can support your business</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="Your Company LLC"
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_name">Your Name *</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                  placeholder="John Doe"
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@company.com"
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="mt-2 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Industry *</Label>
              <RadioGroup 
                value={formData.industry} 
                onValueChange={(value) => setFormData({...formData, industry: value})}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {['Med Spa/Clinic', 'Wellness Center', 'Telehealth Platform', 'Fitness Studio', 'Healthcare Provider', 'Corporate Wellness', 'Other'].map((industry) => (
                  <div key={industry} className="flex items-center space-x-2 border border-[#E8E0D5] rounded-xl p-3 hover:border-[#8B7355] transition-colors">
                    <RadioGroupItem value={industry} id={industry} />
                    <Label htmlFor={industry} className="cursor-pointer">{industry}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3 block">Interest Type *</Label>
              <RadioGroup 
                value={formData.interest_type} 
                onValueChange={(value) => setFormData({...formData, interest_type: value})}
                className="grid grid-cols-2 gap-3"
              >
                {['White Label', 'Wholesale', 'Partnership', 'General Inquiry'].map((type) => (
                  <div key={type} className="flex items-center space-x-2 border border-[#E8E0D5] rounded-xl p-3 hover:border-[#8B7355] transition-colors">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="company_size">Company Size</Label>
              <Input
                id="company_size"
                value={formData.company_size}
                onChange={(e) => setFormData({...formData, company_size: e.target.value})}
                placeholder="e.g., 10-50 employees, 5 locations"
                className="mt-2 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="message">Tell us more about your needs</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Share details about what you're looking for..."
                className="mt-2 rounded-xl h-32"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B7355] hover:bg-[#6B5A45] text-white rounded-full py-6"
              disabled={submitInquiry.isPending}
            >
              {submitInquiry.isPending ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Inquiry'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}