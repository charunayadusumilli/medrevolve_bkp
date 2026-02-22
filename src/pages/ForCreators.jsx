import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, Users, DollarSign, Sparkles, CheckCircle, 
  Instagram, Youtube, Twitter, Zap, BarChart3, Award,
  Target, Rocket, Shield, ArrowRight, Star
} from 'lucide-react';
import { trackEvent } from '@/components/analytics/AnalyticsTracker';

export default function ForCreators() {
  const [email, setEmail] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: creatorMetrics } = useQuery({
    queryKey: ['creatorMetrics', user?.email],
    queryFn: () => base44.entities.CreatorMetrics.filter({ creator_email: user?.email }),
    enabled: !!user?.email,
    initialData: [],
  });

  const metrics = creatorMetrics?.[0];

  const tiers = [
    { name: 'Bronze', rate: '10%', revenue: '$0-$20K', color: 'from-amber-700 to-amber-500' },
    { name: 'Silver', rate: '15%', revenue: '$20K-$50K', color: 'from-gray-400 to-gray-200' },
    { name: 'Gold', rate: '20%', revenue: '$50K-$100K', color: 'from-yellow-500 to-yellow-300' },
    { name: 'Platinum', rate: '25%', revenue: '$100K+', color: 'from-purple-600 to-purple-400' }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Recurring Commission',
      description: 'Earn 10-25% monthly recurring revenue on all subscriptions',
      highlight: 'Monthly Passive Income'
    },
    {
      icon: TrendingUp,
      title: 'Automatic Tier Upgrades',
      description: 'Commission increases as your referral revenue grows',
      highlight: 'Performance-Based'
    },
    {
      icon: Sparkles,
      title: 'Dedicated Creator Portal',
      description: 'Real-time analytics, custom links, and performance tracking',
      highlight: 'Full Transparency'
    },
    {
      icon: Target,
      title: 'Marketing Support',
      description: 'Professional content, graphics, and campaign templates',
      highlight: 'Ready-to-Use Assets'
    },
    {
      icon: Users,
      title: 'Exclusive Community',
      description: 'Connect with other creators, share strategies, network',
      highlight: 'Private Discord'
    },
    {
      icon: Shield,
      title: 'Brand Protection',
      description: 'Trusted telehealth platform, HIPAA-compliant, licensed providers',
      highlight: 'Your Reputation Safe'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Apply in 2 Minutes',
      description: 'Quick application - we review within 24 hours',
      icon: Rocket
    },
    {
      step: 2,
      title: 'Get Your Custom Link',
      description: 'Receive unique tracking link and marketing materials',
      icon: Zap
    },
    {
      step: 3,
      title: 'Share with Audience',
      description: 'Post to your channels using our content templates',
      icon: Instagram
    },
    {
      step: 4,
      title: 'Earn Recurring Income',
      description: 'Get paid monthly as your referrals subscribe',
      icon: DollarSign
    }
  ];

  const platforms = [
    { name: 'Instagram', icon: Instagram, followers: '10K+' },
    { name: 'YouTube', icon: Youtube, followers: '5K+' },
    { name: 'TikTok', icon: Twitter, followers: '10K+' },
    { name: 'Blog/Podcast', icon: BarChart3, followers: 'Active Audience' }
  ];

  const successStories = [
    {
      name: 'Sarah M.',
      platform: 'Instagram',
      followers: '150K',
      earnings: '$4,200/mo',
      quote: 'MedRevolve helped me monetize my wellness content authentically. My audience loves the service!'
    },
    {
      name: 'Mike T.',
      platform: 'YouTube',
      followers: '80K',
      earnings: '$3,800/mo',
      quote: 'The recurring commission model is amazing. I promote it once and earn every month.'
    },
    {
      name: 'Jessica L.',
      platform: 'TikTok',
      followers: '200K',
      earnings: '$6,100/mo',
      quote: 'Best partnership I\'ve done. Great products, responsive team, and my followers are thriving!'
    }
  ];

  const handleQuickApply = () => {
    trackEvent('Quick Apply Email Submit', 'ForCreators', { email });
    window.location.href = createPageUrl(`CreatorApplication?email=${encodeURIComponent(email)}`);
  };

  // If user is logged in and has creator metrics, show their dashboard at top
  const showDashboard = user && metrics;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Creator Dashboard Banner — only for logged-in creators */}
      {showDashboard && (
        <div className="bg-gradient-to-br from-[#2D3A2D] to-[#4A6741] text-white py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/60 text-sm mb-1">Creator Dashboard</p>
                <h2 className="text-2xl font-bold">Welcome back, {user.full_name || user.email}</h2>
              </div>
              <div className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-semibold uppercase tracking-widest">
                {metrics.current_tier} Tier
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Clicks', value: metrics.total_clicks?.toLocaleString() || '0' },
                { label: 'Conversions', value: metrics.total_conversions?.toLocaleString() || '0' },
                { label: 'Total Earned', value: `$${metrics.total_commission_earned?.toFixed(2) || '0.00'}` },
                { label: 'This Month', value: `$${metrics.monthly_commission?.toFixed(2) || '0.00'}` },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-5">
                  <p className="text-white/60 text-xs mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
            {metrics.referral_code && (
              <div className="mt-4 bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">Your Referral Code</p>
                  <p className="font-mono font-bold text-lg">{metrics.referral_code}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-white text-[#4A6741] hover:bg-white/90"
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}?ref=${metrics.referral_code}`); }}
                >
                  Copy Link
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A6741]/5 via-transparent to-[#6B8F5E]/5" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] text-white border-none">
                <Sparkles className="w-4 h-4 mr-2" />
                Creator Partnership Program
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-[#2D3A2D] mb-6 leading-tight">
                Turn Your Influence Into
                <span className="block bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] bg-clip-text text-transparent">
                  Recurring Revenue
                </span>
              </h1>
              
              <p className="text-xl text-[#5A6B5A] mb-8 leading-relaxed">
                Partner with MedRevolve and earn 10-25% monthly recurring commissions. 
                We provide the products, support, and tools - you provide the audience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to={createPageUrl('CreatorApplication')}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] hover:opacity-90 text-white rounded-full px-8 shadow-lg"
                    onClick={() => trackEvent('Apply Now CTA', 'ForCreators', { location: 'hero' })}
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full px-8"
                  onClick={() => document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' })}
                >
                  Calculate Earnings
                  <BarChart3 className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-[#4A6741]">$500K+</p>
                  <p className="text-sm text-[#5A6B5A]">Paid to Creators</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#4A6741]">150+</p>
                  <p className="text-sm text-[#5A6B5A]">Active Creators</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#4A6741]">25%</p>
                  <p className="text-sm text-[#5A6B5A]">Max Commission</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
                alt="Content Creator"
                className="rounded-3xl shadow-2xl"
                loading="lazy"
                decoding="async"
              />
              
              {/* Floating Earnings Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6"
              >
                <p className="text-sm text-[#5A6B5A] mb-1">Monthly Earnings</p>
                <p className="text-3xl font-bold text-[#4A6741]">$4,200</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+28% this month</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-white to-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Performance-Based Commission Tiers
            </h2>
            <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
              Your commission rate grows automatically as your referral revenue increases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="relative overflow-hidden border-2 hover:border-[#4A6741] transition-all">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tier.name}</span>
                      <Award className="w-6 h-6 text-[#4A6741]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-[#4A6741] mb-2">{tier.rate}</p>
                    <p className="text-sm text-[#5A6B5A] mb-4">Commission Rate</p>
                    <p className="text-sm">
                      <strong>Revenue:</strong> {tier.revenue}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Why Creators Choose MedRevolve
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge className="mb-3 bg-[#D4E5D7] text-[#4A6741] border-none">
                        {benefit.highlight}
                      </Badge>
                      <h3 className="text-xl font-semibold text-[#2D3A2D] mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-[#5A6B5A]">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Get Started in 4 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#4A6741] text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2D3A2D] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#5A6B5A]">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2D3A2D] mb-4">
              Real Creators, Real Results
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, idx) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[#5A6B5A] mb-6 italic">"{story.quote}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#2D3A2D]">{story.name}</p>
                        <p className="text-sm text-[#5A6B5A]">{story.platform} • {story.followers}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#4A6741]">{story.earnings}</p>
                        <p className="text-xs text-[#5A6B5A]">monthly</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section id="calculator" className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-[#4A6741]">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Earnings Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Referrals</label>
                  <Input 
                    type="number" 
                    placeholder="e.g., 50" 
                    className="mb-4"
                  />
                  <label className="block text-sm font-medium mb-2">Avg. Product Price</label>
                  <Input 
                    type="number" 
                    placeholder="$299" 
                    defaultValue="299"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] rounded-2xl p-8 text-white text-center">
                    <p className="text-sm mb-2">Estimated Monthly Earnings</p>
                    <p className="text-5xl font-bold mb-2">$1,495</p>
                    <p className="text-sm opacity-80">at 10% commission</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join 150+ creators building passive income with MedRevolve
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-6">
              <Input 
                placeholder="Your email"
                className="bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                size="lg"
                className="bg-white text-[#4A6741] hover:bg-white/90"
                onClick={handleQuickApply}
              >
                Apply Now
              </Button>
            </div>
            
            <p className="text-white/60 text-sm">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              2-minute application • 24-hour approval • Start earning this week
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}