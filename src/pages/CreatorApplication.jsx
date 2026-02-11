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

export default function CreatorApplication() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    platform: 'Instagram',
    platform_handle: '',
    followers_count: '',
    audience_niche: '',
    why_partner: ''
  });

  const submitApplication = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('submitCreatorApplication', data);
      return response.data;
    },
    onSuccess: () => {
      setSubmitted(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitApplication.mutate(formData);
  };

  if (submitted) {
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
            Application Submitted!
          </h2>
          <p className="text-[#5A6B5A] mb-8">
            Thanks for applying! We'll review your application within 24-48 hours and reach out via email.
          </p>
          <Link to={createPageUrl('ForCreators')}>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8">
              Back to Creator Program
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to={createPageUrl('ForCreators')}>
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
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">Creator Application</h1>
          <p className="text-[#5A6B5A] mb-8">Join our community of wellness influencers</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="John Doe"
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
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

            <div>
              <Label className="mb-3 block">Primary Platform *</Label>
              <RadioGroup 
                value={formData.platform} 
                onValueChange={(value) => setFormData({...formData, platform: value})}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {['Instagram', 'TikTok', 'YouTube', 'Blog', 'Podcast', 'Other'].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2 border border-[#E8E0D5] rounded-xl p-3 hover:border-[#4A6741] transition-colors">
                    <RadioGroupItem value={platform} id={platform} />
                    <Label htmlFor={platform} className="cursor-pointer">{platform}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="platform_handle">Platform Handle/Username</Label>
                <Input
                  id="platform_handle"
                  value={formData.platform_handle}
                  onChange={(e) => setFormData({...formData, platform_handle: e.target.value})}
                  placeholder="@yourusername"
                  className="mt-2 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="followers_count">Follower Count *</Label>
                <Input
                  id="followers_count"
                  value={formData.followers_count}
                  onChange={(e) => setFormData({...formData, followers_count: e.target.value})}
                  placeholder="e.g., 50K, 100K+"
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="audience_niche">Audience Niche</Label>
              <Input
                id="audience_niche"
                value={formData.audience_niche}
                onChange={(e) => setFormData({...formData, audience_niche: e.target.value})}
                placeholder="e.g., Fitness, Wellness, Lifestyle"
                className="mt-2 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="why_partner">Why do you want to partner with MedRevolve?</Label>
              <Textarea
                id="why_partner"
                value={formData.why_partner}
                onChange={(e) => setFormData({...formData, why_partner: e.target.value})}
                placeholder="Tell us about your content and why you'd be a great fit..."
                className="mt-2 rounded-xl h-32"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6"
              disabled={submitApplication.isPending}
            >
              {submitApplication.isPending ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}