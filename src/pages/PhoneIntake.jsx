import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, PhoneIncoming, MessageSquare, Mail, CheckCircle, Clock, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PhoneIntake() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'general_inquiry',
    message: '',
    preferred_contact: 'phone'
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('submitContactRequest', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: `Phone Intake Request - ${data.reason}`,
        message: data.message,
        source: 'website_form',
        preferred_contact: data.preferred_contact
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Request submitted! We\'ll call you shortly.');
      setFormData({ name: '', email: '', phone: '', reason: 'general_inquiry', message: '', preferred_contact: 'phone' });
    },
    onError: (error) => {
      toast.error('Failed to submit. Please try again.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const trackingNumber = '(234) 567-890'; // Replace with actual CTM number
  const formattedNumber = '234567890';

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/10 px-4 py-2 rounded-full mb-4">
            <Phone className="w-4 h-4 text-[#4A6741]" />
            <span className="text-sm font-semibold text-[#4A6741]">Fast Track Your Intake</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D3A2D] mb-4">
            Call Now for Instant Intake
          </h1>
          <p className="text-lg text-[#5A6B5A]/80 max-w-2xl mx-auto">
            Speak with our intake team directly. We'll verify your information, answer questions, 
            and send you personalized intake links via SMS or email.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Call Now Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-[#4A6741]/20 shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4A6741]/10 rounded-full flex items-center justify-center">
                    <PhoneIncoming className="w-6 h-6 text-[#4A6741]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#2D3A2D]">Call Our Intake Line</CardTitle>
                    <CardDescription>Available Mon-Fri, 9am-6pm EST</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-6 bg-gradient-to-br from-[#4A6741]/5 to-[#6B8F5E]/5 rounded-xl border border-[#4A6741]/10">
                  <a href={`tel:+1${formattedNumber}`} className="block">
                    <div className="text-3xl font-bold text-[#4A6741] mb-2">{trackingNumber}</div>
                    <div className="text-sm text-[#5A6B5A]/70">Click to call from mobile</div>
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#2D3A2D]">Instant Verification</div>
                      <div className="text-sm text-[#5A6B5A]/70">We match your caller ID with existing records for faster service</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#2D3A2D]">Live Intake Support</div>
                      <div className="text-sm text-[#5A6B5A]/70">Complete your intake over the phone with our team</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#2D3A2D]">SMS/Email Links</div>
                      <div className="text-sm text-[#5A6B5A]/70">Get digital intake forms sent directly to your phone or inbox</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#4A6741]/10">
                  <div className="flex items-center gap-2 text-sm text-[#5A6B5A]/70">
                    <Shield className="w-4 h-4" />
                    <span>HIPAA-compliant phone system with secure recordings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Request Callback Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-[#4A6741]/20 shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4A6741]/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#4A6741]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#2D3A2D]">Request a Callback</CardTitle>
                    <CardDescription>Prefer we call you? Fill out this form</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Contact</Label>
                    <select
                      id="reason"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    >
                      <option value="general_inquiry">General Inquiry</option>
                      <option value="new_patient">New Patient Intake</option>
                      <option value="existing_patient">Existing Patient</option>
                      <option value="prescription_refill">Prescription Refill</option>
                      <option value="billing">Billing Question</option>
                      <option value="technical_support">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <Label>Preferred Contact Method</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferred_contact"
                          value="phone"
                          checked={formData.preferred_contact === 'phone'}
                          onChange={(e) => setFormData({...formData, preferred_contact: e.target.value})}
                          className="text-[#4A6741]"
                        />
                        <span className="text-sm">Phone Call</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferred_contact"
                          value="sms"
                          checked={formData.preferred_contact === 'sms'}
                          onChange={(e) => setFormData({...formData, preferred_contact: e.target.value})}
                          className="text-[#4A6741]"
                        />
                        <span className="text-sm">SMS</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferred_contact"
                          value="email"
                          checked={formData.preferred_contact === 'email'}
                          onChange={(e) => setFormData({...formData, preferred_contact: e.target.value})}
                          className="text-[#4A6741]"
                        />
                        <span className="text-sm">Email</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us how we can help..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#4A6741] hover:bg-[#3D5636]"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Request Callback'}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#5A6B5A]/60">
                    <Clock className="w-3 h-3" />
                    <span>Typical response time: Under 2 hours</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-[#4A6741]/20 bg-gradient-to-br from-[#4A6741]/5 to-[#6B8F5E]/5">
            <CardHeader>
              <CardTitle className="text-[#2D3A2D]">How Phone Intake Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#4A6741] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                  <div className="font-semibold text-[#2D3A2D] mb-1">Call Us</div>
                  <div className="text-sm text-[#5A6B5A]/70">Dial our tracking number or request a callback</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#4A6741] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                  <div className="font-semibold text-[#2D3A2D] mb-1">Verify Identity</div>
                  <div className="text-sm text-[#5A6B5A]/70">We match your info with existing records instantly</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#4A6741] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                  <div className="font-semibold text-[#2D3A2D] mb-1">Complete Intake</div>
                  <div className="text-sm text-[#5A6B5A]/70">Over phone or via secure digital links</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#4A6741] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                  <div className="font-semibold text-[#2D3A2D] mb-1">Get Started</div>
                  <div className="text-sm text-[#5A6B5A]/70">Begin your telehealth journey immediately</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}