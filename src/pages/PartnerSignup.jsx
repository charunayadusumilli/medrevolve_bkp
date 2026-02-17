import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Check, Sparkles, TrendingUp, Shield, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';

const benefits = [
  { icon: Shield, text: 'No medical license needed' },
  { icon: Zap, text: 'Launch in under 2 minutes' },
  { icon: TrendingUp, text: 'Set your own pricing' },
  { icon: Check, text: 'White-label solution' }
];

export default function PartnerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const partnerCode = formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substr(2, 6);
      
      await base44.entities.Partner.create({
        business_name: formData.businessName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        business_type: formData.businessType,
        partner_code: partnerCode,
        subscription_status: 'trial',
        status: 'active',
        enabled_products: [],
        pricing_markup_percentage: 30
      });

      // Navigate to partner portal
      navigate(createPageUrl('PartnerPortal'));
    } catch (error) {
      console.error('Error creating partner:', error);
      alert('Failed to create partner account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D3A2D] via-[#3D4A3D] to-[#4A6741] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#6B8F5E]" />
              <span className="text-sm">Join 250+ Partners</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Start Your Telehealth Business
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Offer 25+ proven telehealth programs with zero medical license needed. 
              Launch in minutes, earn immediately.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                  >
                    <Icon className="w-8 h-8 text-[#6B8F5E] mb-3 mx-auto" />
                    <p className="text-sm">{benefit.text}</p>
                  </motion.div>
                );
              })}
            </div>

            <Button
              size="lg"
              onClick={() => setStep(2)}
              className="bg-white text-[#2D3A2D] hover:bg-white/90 text-lg px-12 py-6 rounded-full"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-sm text-white/60 mt-6">
              $299/month • No contracts • Cancel anytime
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-[#6B8F5E] mb-2">30%</div>
                <p className="text-white/80">Average partner markup</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-[#6B8F5E] mb-2">25+</div>
                <p className="text-white/80">Telehealth programs</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-[#6B8F5E] mb-2">50</div>
                <p className="text-white/80">States available</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-[#E8E0D5]">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-[#2D3A2D] mb-2">
                Create Your Partner Account
              </h2>
              <p className="text-[#5A6B5A] mb-8">
                Get started in under 2 minutes
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Elite Fitness Studio"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select 
                    required
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({...formData, businessType: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gym">Gym/Fitness Studio</SelectItem>
                      <SelectItem value="Spa">Spa/Med Spa</SelectItem>
                      <SelectItem value="Wellness Center">Wellness Center</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                      <SelectItem value="Chiropractic">Chiropractic Practice</SelectItem>
                      <SelectItem value="Nutrition Practice">Nutrition Practice</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Your Name *</Label>
                    <Input
                      id="contactName"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@business.com"
                    className="mt-1"
                  />
                </div>

                <div className="bg-[#F5F0E8] rounded-xl p-6">
                  <h3 className="font-semibold text-[#2D3A2D] mb-3">What's Included</h3>
                  <ul className="space-y-2 text-sm text-[#5A6B5A]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4A6741]" />
                      White-label client portal with your branding
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4A6741]" />
                      25+ telehealth programs ready to offer
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4A6741]" />
                      Full medical & compliance handling
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4A6741]" />
                      Partner dashboard with analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4A6741]" />
                      Marketing guides & resources
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Start 7-Day Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-[#5A6B5A]">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}