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
import { trackDigestEvent } from '@/lib/digestTracker';
import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function BusinessInquiry() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
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

  const validateForm = () => {
    const errors = {};
    if (!formData.company_name?.trim()) errors.company_name = 'Company name is required';
    if (!formData.contact_name?.trim()) errors.contact_name = 'Your name is required';
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.industry) errors.industry = 'Please select an industry';
    if (!formData.interest_type) errors.interest_type = 'Please select an interest type';
    return errors;
  };

  const submitInquiry = useMutation({
    mutationFn: async (data) => {
      console.log('📤 Submitting business inquiry...', data);
      
      // Save to DB
      console.log('💾 Creating database record...');
      const record = await base44.entities.BusinessInquiry.create({ ...data, status: 'new' });
      console.log('✅ Record created:', record.id);

      // Notify rned@medrevolve.com immediately
      console.log('📧 Sending email to rned@medrevolve.com...');
      await base44.integrations.Core.SendEmail({
        from_name: 'MedRevolve B2B',
        to: 'rned@medrevolve.com',
        subject: `💼 New B2B Inquiry — ${data.company_name} (${data.interest_type})`,
        body: `
<h2>New Business Inquiry</h2>
<p><strong>⚡ Action Required:</strong> Review and respond to this inquiry</p>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
  <tr><td style="padding:8px;color:#666;width:140px;"><b>Company</b></td><td style="padding:8px;">${data.company_name}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Contact</b></td><td style="padding:8px;">${data.contact_name}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Email</b></td><td style="padding:8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Phone</b></td><td style="padding:8px;">${data.phone || '—'}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Industry</b></td><td style="padding:8px;">${data.industry}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Interest</b></td><td style="padding:8px;font-weight:bold;color:#2d7a2d;">${data.interest_type}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Company Size</b></td><td style="padding:8px;">${data.company_size || '—'}</td></tr>
  <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;"><b>Message</b></td><td style="padding:8px;white-space:pre-wrap;">${data.message || '—'}</td></tr>
  <tr><td style="padding:8px;color:#666;"><b>Submitted</b></td><td style="padding:8px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td></tr>
</table>
<p style="color:#888;font-size:12px;margin-top:16px;">Record ID: ${record.id}</p>
        `.trim(),
      });
      console.log('✅ Email sent to rned@medrevolve.com');

      // Track the event
      console.log('📊 Tracking event...');
      trackDigestEvent('business_inquiry', { 
        company_name: data.company_name, 
        contact_name: data.contact_name, 
        email: data.email, 
        interest_type: data.interest_type, 
        industry: data.industry 
      });
      console.log('✅ Event tracked');
      
      return record;
    },
    onSuccess: () => {
      console.log('✅ Submission successful!');
      setSubmitted(true);
    },
    onError: (error) => {
      console.error('❌ Submission error:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🚀 Form submission triggered');
    
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.error('❌ Validation failed:', errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    console.log('✅ Validation passed, submitting...');
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
            {/* Validation Errors Display */}
            {Object.keys(validationErrors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium mb-2">Please correct the following:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Error from submission */}
            {submitInquiry.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Submission failed</p>
                  <p className="text-sm text-red-700">{submitInquiry.error?.message || 'An error occurred while submitting your inquiry. Please try again.'}</p>
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => {
                    setFormData({...formData, company_name: e.target.value});
                    if (validationErrors.company_name) {
                      setValidationErrors({...validationErrors, company_name: ''});
                    }
                  }}
                  placeholder="Your Company LLC"
                  className={`mt-2 rounded-xl ${validationErrors.company_name ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.company_name && <p className="text-red-600 text-xs mt-1">{validationErrors.company_name}</p>}
              </div>
              <div>
                <Label htmlFor="contact_name">Your Name *</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => {
                    setFormData({...formData, contact_name: e.target.value});
                    if (validationErrors.contact_name) {
                      setValidationErrors({...validationErrors, contact_name: ''});
                    }
                  }}
                  placeholder="John Doe"
                  className={`mt-2 rounded-xl ${validationErrors.contact_name ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.contact_name && <p className="text-red-600 text-xs mt-1">{validationErrors.contact_name}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (validationErrors.email) {
                      setValidationErrors({...validationErrors, email: ''});
                    }
                  }}
                  placeholder="you@company.com"
                  className={`mt-2 rounded-xl ${validationErrors.email ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.email && <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>}
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