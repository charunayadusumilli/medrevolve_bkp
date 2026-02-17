import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, DollarSign, Users, Package, Copy, Check,
  Eye, EyeOff, Settings, Link2, BarChart3, Palette, Sparkles
} from 'lucide-react';

const productCategories = {
  weight_loss: ['Semaglutide', 'Tirzepatide', 'Phentermine', 'Lipo-C Injection', 'Lipo-B Injection'],
  mens_health: ['Viagra', 'Cialis', 'Sildenafil', 'Tadalafil'],
  womens_health: ['Estradiol Gel', 'Estradiol Patch', 'Progesterone', 'Enclomiphene'],
  hair_loss: ['Minoxidil Tablets', 'Finasteride', 'Minoxidil/Finasteride Topical'],
  longevity: ['NAD+ Therapy', 'Metformin', 'Rapamycin'],
  peptides: ['Sermorelin', 'B-12 Injection', 'Glutathione', 'NAD+ Nasal Spray']
};

export default function PartnerPortal() {
  const [copied, setCopied] = useState('');
  const [partner, setPartner] = useState(null);

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: () => base44.entities.Partner.list(),
    initialData: []
  });

  const { data: referrals } = useQuery({
    queryKey: ['partner-referrals'],
    queryFn: () => base44.entities.PartnerReferral.list(),
    initialData: []
  });

  useEffect(() => {
    if (partners.length > 0) {
      setPartner(partners[0]);
    }
  }, [partners]);

  const copyLink = (productName) => {
    const link = `${window.location.origin}${createPageUrl('Products')}?partner=${partner?.partner_code}&product=${productName}`;
    navigator.clipboard.writeText(link);
    setCopied(productName);
    setTimeout(() => setCopied(''), 2000);
  };

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${partner?.total_earnings?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      change: '+12.5%',
      color: 'text-green-600'
    },
    {
      title: 'Total Referrals',
      value: partner?.total_referrals || 0,
      icon: Users,
      change: '+8 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Active Products',
      value: partner?.enabled_products?.length || 0,
      icon: Package,
      change: '25 available',
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '24%',
      icon: TrendingUp,
      change: '+3.2%',
      color: 'text-orange-600'
    }
  ];

  if (!partner) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#2D3A2D] mb-4">
              No Partner Account Found
            </h2>
            <p className="text-[#5A6B5A] mb-6">
              Create a partner account to access the portal
            </p>
            <Link to={createPageUrl('PartnerSignup')}>
              <Button className="bg-[#4A6741] hover:bg-[#3D5636]">
                Become a Partner
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D] mb-2">
              Partner Portal
            </h1>
            <p className="text-[#5A6B5A]">
              Welcome back, {partner.business_name}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            {partner.subscription_status}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-[#E8E0D5]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-xs text-[#5A6B5A]">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#2D3A2D] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[#5A6B5A]">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border border-[#E8E0D5]">
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products & Links
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Palette className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="border-[#E8E0D5]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-[#4A6741]" />
                  Your Partner Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-[#F5F0E8] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#4A6741] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#2D3A2D] mb-1">
                        Your Partner Code: <span className="text-[#4A6741]">{partner.partner_code}</span>
                      </p>
                      <p className="text-sm text-[#5A6B5A]">
                        Share these links with your customers. You'll earn {partner.pricing_markup_percentage}% on every qualified intake.
                      </p>
                    </div>
                  </div>
                </div>

                {Object.entries(productCategories).map(([category, products]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-[#2D3A2D] mb-3 capitalize">
                      {category.replace('_', ' ')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {products.map((product) => (
                        <div
                          key={product}
                          className="flex items-center justify-between p-4 bg-white border border-[#E8E0D5] rounded-lg hover:shadow-md transition-shadow"
                        >
                          <span className="font-medium text-[#2D3A2D]">{product}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLink(product)}
                            className="text-[#4A6741]"
                          >
                            {copied === product ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="border-[#E8E0D5]">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-[#D4E5D7] mx-auto mb-4" />
                  <p className="text-[#5A6B5A] mb-6">
                    Detailed analytics coming soon
                  </p>
                  <p className="text-sm text-[#5A6B5A]">
                    Track clicks, conversions, and earnings over time
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card className="border-[#E8E0D5]">
              <CardHeader>
                <CardTitle>Customize Your Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Business Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-[#F5F0E8] flex items-center justify-center">
                      {partner.branding_logo_url ? (
                        <img src={partner.branding_logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Package className="w-8 h-8 text-[#5A6B5A]" />
                      )}
                    </div>
                    <Button variant="outline" className="border-[#4A6741] text-[#4A6741]">
                      Upload Logo
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={partner.branding_primary_color}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <Input
                      type="color"
                      value={partner.branding_secondary_color}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <Button className="bg-[#4A6741] hover:bg-[#3D5636]">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-[#E8E0D5]">
              <CardHeader>
                <CardTitle>Partner Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Pricing Markup Percentage</Label>
                  <Input
                    type="number"
                    value={partner.pricing_markup_percentage}
                    className="mt-2"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm text-[#5A6B5A] mt-2">
                    Your earnings per qualified intake based on this markup
                  </p>
                </div>

                <div>
                  <Label>Business Information</Label>
                  <div className="mt-2 space-y-3">
                    <Input value={partner.business_name} placeholder="Business Name" />
                    <Input value={partner.contact_name} placeholder="Contact Name" />
                    <Input value={partner.email} type="email" placeholder="Email" />
                    <Input value={partner.phone} placeholder="Phone" />
                  </div>
                </div>

                <Button className="bg-[#4A6741] hover:bg-[#3D5636]">
                  Update Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}