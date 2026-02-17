import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, Building2, Stethoscope, Pill, UserPlus, 
  MessageSquare, DollarSign, TrendingUp, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    }
  });

  // Fetch all submission types
  const { data: customers, refetch: refetchCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.CustomerIntake.list('-created_date', 100)
  });

  const { data: providers, refetch: refetchProviders } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.ProviderIntake.list('-created_date', 100)
  });

  const { data: pharmacies, refetch: refetchPharmacies } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: () => base44.entities.PharmacyIntake.list('-created_date', 100)
  });

  const { data: businesses, refetch: refetchBusinesses } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => base44.entities.BusinessInquiry.list('-created_date', 100)
  });

  const { data: creators, refetch: refetchCreators } = useQuery({
    queryKey: ['creators'],
    queryFn: () => base44.entities.CreatorApplication.list('-created_date', 100)
  });

  const { data: contacts, refetch: refetchContacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 100)
  });

  const { data: partners, refetch: refetchPartners } = useQuery({
    queryKey: ['partners'],
    queryFn: () => base44.entities.Partner.list('-created_date', 100)
  });

  const { data: referrals, refetch: refetchReferrals } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => base44.entities.PartnerReferral.list('-created_date', 100)
  });

  React.useEffect(() => {
    if (currentUser) setUser(currentUser);
  }, [currentUser]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#4A6741]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You must be logged in as an administrator to access this page.
            </p>
            <Button 
              onClick={() => window.location.href = createPageUrl('Home')}
              className="w-full"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This page is restricted to administrators only.
            </p>
            <Button 
              onClick={() => window.location.href = createPageUrl('Home')}
              className="w-full"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: 'Customer Intakes', value: customers?.length || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Provider Applications', value: providers?.length || 0, icon: Stethoscope, color: 'bg-green-500' },
    { label: 'Pharmacy Applications', value: pharmacies?.length || 0, icon: Pill, color: 'bg-purple-500' },
    { label: 'Business Inquiries', value: businesses?.length || 0, icon: Building2, color: 'bg-orange-500' },
    { label: 'Creator Applications', value: creators?.length || 0, icon: UserPlus, color: 'bg-pink-500' },
    { label: 'Contact Requests', value: contacts?.length || 0, icon: MessageSquare, color: 'bg-cyan-500' },
    { label: 'Active Partners', value: partners?.filter(p => p.status === 'active').length || 0, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Partner Referrals', value: referrals?.length || 0, icon: TrendingUp, color: 'bg-amber-500' }
  ];

  const refetchAll = () => {
    refetchCustomers();
    refetchProviders();
    refetchPharmacies();
    refetchBusinesses();
    refetchCreators();
    refetchContacts();
    refetchPartners();
    refetchReferrals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D]">Admin Dashboard</h1>
            <p className="text-muted-foreground">View and manage all submissions</p>
          </div>
          <Button onClick={refetchAll} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Submissions Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="customers" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="providers">Providers</TabsTrigger>
                <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
                <TabsTrigger value="businesses">Business</TabsTrigger>
                <TabsTrigger value="creators">Creators</TabsTrigger>
                <TabsTrigger value="contacts">Contact</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="space-y-4">
                {customers?.map(c => (
                  <Card key={c.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{c.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{c.email}</p>
                          <p className="text-sm mt-2"><strong>Interest:</strong> {c.primary_interest}</p>
                          <p className="text-sm"><strong>Source:</strong> {c.heard_about_us}</p>
                          {c.referral_code && <p className="text-sm"><strong>Referral:</strong> {c.referral_code}</p>}
                        </div>
                        <Badge>{c.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Submitted: {new Date(c.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="providers" className="space-y-4">
                {providers?.map(p => (
                  <Card key={p.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{p.full_name} - {p.title}</h3>
                          <p className="text-sm text-muted-foreground">{p.email}</p>
                          <p className="text-sm mt-2"><strong>Specialty:</strong> {p.specialty}</p>
                          <p className="text-sm"><strong>License:</strong> {p.license_number}</p>
                          <p className="text-sm"><strong>Experience:</strong> {p.years_experience} years</p>
                        </div>
                        <Badge>{p.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Submitted: {new Date(p.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="pharmacies" className="space-y-4">
                {pharmacies?.map(ph => (
                  <Card key={ph.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{ph.pharmacy_name}</h3>
                          <p className="text-sm text-muted-foreground">{ph.email}</p>
                          <p className="text-sm mt-2"><strong>Type:</strong> {ph.pharmacy_type}</p>
                          <p className="text-sm"><strong>License:</strong> {ph.license_number}</p>
                          <p className="text-sm"><strong>Location:</strong> {ph.city}, {ph.state}</p>
                        </div>
                        <Badge>{ph.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Submitted: {new Date(ph.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="businesses" className="space-y-4">
                {businesses?.map(b => (
                  <Card key={b.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{b.company_name}</h3>
                          <p className="text-sm text-muted-foreground">{b.email}</p>
                          <p className="text-sm mt-2"><strong>Contact:</strong> {b.contact_name}</p>
                          <p className="text-sm"><strong>Industry:</strong> {b.industry}</p>
                          <p className="text-sm"><strong>Interest:</strong> {b.interest_type}</p>
                        </div>
                        <Badge>{b.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Submitted: {new Date(b.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="creators" className="space-y-4">
                {creators?.map(cr => (
                  <Card key={cr.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{cr.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{cr.email}</p>
                          <p className="text-sm mt-2"><strong>Platform:</strong> {cr.platform} (@{cr.platform_handle})</p>
                          <p className="text-sm"><strong>Followers:</strong> {cr.followers_count}</p>
                          <p className="text-sm"><strong>Niche:</strong> {cr.audience_niche}</p>
                        </div>
                        <Badge>{cr.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Submitted: {new Date(cr.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                {contacts?.map(c => (
                  <Card key={c.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <p className="text-sm text-muted-foreground">{c.email}</p>
                          <p className="text-sm mt-2"><strong>Subject:</strong> {c.subject}</p>
                          <p className="text-sm mt-1">{c.message}</p>
                        </div>
                        <Badge>{c.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Submitted: {new Date(c.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="partners" className="space-y-4">
                {partners?.map(p => (
                  <Card key={p.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{p.business_name}</h3>
                          <p className="text-sm text-muted-foreground">{p.email}</p>
                          <p className="text-sm mt-2"><strong>Code:</strong> {p.partner_code}</p>
                          <p className="text-sm"><strong>Type:</strong> {p.business_type}</p>
                          <p className="text-sm"><strong>Referrals:</strong> {p.total_referrals}</p>
                          <p className="text-sm"><strong>Earnings:</strong> ${p.total_earnings?.toFixed(2) || '0.00'}</p>
                        </div>
                        <Badge>{p.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Joined: {new Date(p.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="referrals" className="space-y-4">
                {referrals?.map(r => (
                  <Card key={r.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm"><strong>Customer:</strong> {r.customer_email}</p>
                          <p className="text-sm"><strong>Product:</strong> {r.product_id}</p>
                          <p className="text-sm"><strong>Order Value:</strong> ${r.order_value?.toFixed(2)}</p>
                          <p className="text-sm"><strong>Partner Earnings:</strong> ${r.partner_earnings?.toFixed(2)}</p>
                        </div>
                        <Badge>{r.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Date: {new Date(r.created_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}