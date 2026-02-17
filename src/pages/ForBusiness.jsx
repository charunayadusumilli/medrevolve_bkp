import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, Users, Zap, Shield, TrendingUp, CheckCircle, 
  Sparkles, Package, Stethoscope, Award, Globe, Clock,
  ArrowRight, Pill, HeartPulse, DollarSign
} from 'lucide-react';
import { trackEvent } from '@/components/analytics/AnalyticsTracker';

export default function ForBusiness() {
  const [selectedSolution, setSelectedSolution] = useState('white-label');

  const solutions = [
    {
      id: 'white-label',
      name: 'White Label Platform',
      icon: Sparkles,
      tagline: 'Your Brand, Our Infrastructure',
      description: 'Launch your own branded telehealth platform in days, not months',
      price: '$2,999/mo',
      features: [
        'Full platform customization with your branding',
        'Custom domain (yourcompany.com)',
        'Your logo, colors, and styling throughout',
        'Licensed providers in all 50 states',
        'Partner pharmacy network',
        'Payment processing included',
        'HIPAA-compliant infrastructure',
        'Dedicated account manager'
      ],
      idealFor: ['Med Spas', 'Wellness Centers', 'Clinics', 'Health Coaches']
    },
    {
      id: 'wholesale',
      name: 'Wholesale Partnership',
      icon: Package,
      tagline: 'Bulk Pricing, Your Distribution',
      description: 'Purchase products at wholesale rates for your existing practice',
      price: '30-40% off retail',
      features: [
        'Wholesale pricing on all products',
        'Bulk order discounts',
        'Fast fulfillment (3-5 days)',
        'Quality guarantee',
        'Provider consultation included',
        'Flexible payment terms',
        'Marketing materials provided',
        'Ongoing product training'
      ],
      idealFor: ['Medical Practices', 'Pharmacies', 'Health Retailers', 'Distributors']
    },
    {
      id: 'corporate',
      name: 'Corporate Wellness',
      icon: Building2,
      tagline: 'Employee Health Benefits',
      description: 'Comprehensive wellness program for your team',
      price: 'Custom pricing',
      features: [
        'Employee telehealth access',
        'Preventive care programs',
        'Weight management solutions',
        'Mental health support',
        'Nutrition counseling',
        'Usage analytics dashboard',
        'Flexible benefits integration',
        'Dedicated support team'
      ],
      idealFor: ['Corporations', 'HR Departments', 'Insurance Providers', 'Benefits Consultants']
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Fast Setup',
      description: 'Launch in 7-14 days with turnkey solution'
    },
    {
      icon: Shield,
      title: 'Fully Compliant',
      description: 'HIPAA, state licensing, and pharmacy regulations covered'
    },
    {
      icon: Users,
      title: 'Scalable',
      description: 'Grow from 10 to 10,000 patients seamlessly'
    },
    {
      icon: DollarSign,
      title: 'Revenue Share',
      description: 'Flexible pricing models that grow with you'
    }
  ];

  const integrations = [
    { name: 'Stripe', logo: '💳', category: 'Payments', featured: true },
    { name: 'Twilio', logo: '📞', category: 'Communications' },
    { name: 'Zoom', logo: '📹', category: 'Video Calls' },
    { name: 'Google Calendar', logo: '📅', category: 'Scheduling' },
    { name: 'Zapier', logo: '⚡', category: 'Automation' },
    { name: 'HubSpot', logo: '🎯', category: 'CRM' }
  ];

  const paymentFeatures = [
    { label: 'Instant Checkout', desc: 'Frictionless payment flow for patients' },
    { label: 'Subscriptions', desc: 'Recurring billing for ongoing programs' },
    { label: 'Split Payouts', desc: 'Automatic revenue share to partners' },
    { label: 'Refunds & Disputes', desc: 'Handled automatically via Stripe' },
    { label: 'Multi-currency', desc: 'Accept payments in 135+ currencies' },
    { label: 'PCI Compliant', desc: 'Bank-level security, no PCI burden on you' }
  ];

  const caseStudies = [
    {
      company: 'Elite Wellness Spa',
      industry: 'Med Spa',
      results: {
        revenue: '+$45K/mo',
        patients: '200+',
        retention: '94%'
      },
      quote: 'MedRevolve white-label platform let us launch telehealth without the overhead. We\'re now generating $45K/month in additional revenue.'
    },
    {
      company: 'FitLife Corporate',
      industry: 'Corporate Wellness',
      results: {
        revenue: '$120K saved',
        patients: '1,200 employees',
        retention: '88%'
      },
      quote: 'Our employees love the convenience. We\'ve seen a 40% increase in preventive care visits.'
    }
  ];

  const currentSolution = solutions.find(s => s.id === selectedSolution);
  const Icon = currentSolution?.icon;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A6741]/5 via-transparent to-[#6B8F5E]/5" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] text-white border-none">
                <Building2 className="w-4 h-4 mr-2" />
                Enterprise Solutions
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-[#2D3A2D] mb-6 leading-tight">
                Launch Your Telehealth Business
                <span className="block bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] bg-clip-text text-transparent">
                  In 7 Days, Not 7 Months
                </span>
              </h1>
              
              <p className="text-xl text-[#5A6B5A] mb-8 leading-relaxed">
                White-label platform, wholesale partnerships, or corporate wellness programs. 
                We provide the infrastructure, you provide the vision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl('BusinessInquiry')}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white rounded-full px-8 shadow-lg"
                    onClick={() => trackEvent('Schedule Demo', 'ForBusiness', { location: 'hero' })}
                  >
                    Schedule Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full px-8"
                  onClick={() => document.getElementById('solutions').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Solutions
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {[
              { value: '50+', label: 'Business Partners' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '7 days', label: 'Avg. Launch Time' },
              { value: '$2M+', label: 'Partner Revenue' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-[#4A6741] mb-2">{stat.value}</p>
                <p className="text-sm text-[#5A6B5A]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Choose Your Business Model
            </h2>
            <p className="text-lg text-[#5A6B5A]">
              Flexible solutions designed for different business needs
            </p>
          </div>

          <Tabs value={selectedSolution} onValueChange={setSelectedSolution} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto mb-12">
              {solutions.map(solution => (
                <TabsTrigger key={solution.id} value={solution.id}>
                  {solution.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {solutions.map(solution => {
              const SolutionIcon = solution.icon;
              return (
                <TabsContent key={solution.id} value={solution.id}>
                  <Card className="border-2 border-[#4A6741]">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                          <SolutionIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl">{solution.name}</CardTitle>
                          <p className="text-[#5A6B5A]">{solution.tagline}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <p className="text-lg text-[#5A6B5A] mb-6">{solution.description}</p>
                          <div className="bg-[#F5F0E8] rounded-xl p-6 mb-6">
                            <p className="text-sm text-[#5A6B5A] mb-2">Starting at</p>
                            <p className="text-4xl font-bold text-[#4A6741]">{solution.price}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {solution.idealFor.map(type => (
                              <Badge key={type} variant="secondary">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <Link to={createPageUrl('BusinessInquiry')}>
                            <Button 
                              className="w-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] text-white"
                              onClick={() => trackEvent('Get Started', 'ForBusiness', { solution: solution.id })}
                            >
                              Get Started
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2D3A2D] mb-4">What's Included</h4>
                          <div className="space-y-3">
                            {solution.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-[#4A6741] flex-shrink-0 mt-0.5" />
                                <span className="text-[#5A6B5A]">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-4">
                        <BenefitIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-[#2D3A2D] mb-2">{benefit.title}</h3>
                      <p className="text-sm text-[#5A6B5A]">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Seamless Integrations
            </h2>
            <p className="text-lg text-[#5A6B5A]">
              Works with tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, idx) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">{integration.logo}</div>
                    <p className="font-medium text-[#2D3A2D] text-sm">{integration.name}</p>
                    <p className="text-xs text-[#5A6B5A]">{integration.category}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#4A6741] text-white flex items-center justify-center font-bold text-xl">
                        {study.company[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2D3A2D]">{study.company}</h3>
                        <p className="text-sm text-[#5A6B5A]">{study.industry}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(study.results).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-2xl font-bold text-[#4A6741]">{value}</p>
                          <p className="text-xs text-[#5A6B5A] capitalize">{key}</p>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-[#5A6B5A] italic">"{study.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] to-[#3D5636]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Schedule a demo and see how MedRevolve can power your telehealth vision
            </p>
            <Link to={createPageUrl('BusinessInquiry')}>
              <Button 
                size="lg"
                className="bg-white text-[#4A6741] hover:bg-white/90 rounded-full px-10 text-lg"
                onClick={() => trackEvent('CTA Schedule Demo', 'ForBusiness', { location: 'bottom' })}
              >
                Schedule Your Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-white/60 text-sm mt-4">
              <Clock className="w-4 h-4 inline mr-1" />
              30-minute consultation • No obligation • Expert guidance
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}