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
  MessageSquare, DollarSign, TrendingUp, RefreshCw, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AutoRxAdminTab from '@/components/admin/AutoRxAdminTab';
import { Link } from 'react-router-dom';
import RequireAuth from '@/components/auth/RequireAuth';

function AdminDashboardInner() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessStatus, setBusinessStatus] = useState({});

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
  const { data: autoRxPlans } = useQuery({
    queryKey: ['autoRxPlansStats'],
    queryFn: () => base44.entities.AutoRxPlan.list('-created_date', 200)
  });

  const stats = [
    { label: 'Customer Intakes', value: customers?.length || 0, icon: Users, color: 'bg-blue-500', loading: !customers },
    { label: 'Provider Applications', value: providers?.length || 0, icon: Stethoscope, color: 'bg-green-500', loading: !providers },
    { label: 'Pharmacy Applications', value: pharmacies?.length || 0, icon: Pill, color: 'bg-purple-500', loading: !pharmacies },
    { label: 'Business Inquiries', value: businesses?.length || 0, icon: Building2, color: 'bg-orange-500', loading: !businesses },
    { label: 'Creator Applications', value: creators?.length || 0, icon: UserPlus, color: 'bg-pink-500', loading: !creators },
    { label: 'Contact Requests', value: contacts?.length || 0, icon: MessageSquare, color: 'bg-cyan-500', loading: !contacts },
    { label: 'Active Partners', value: partners?.filter(p => p.status === 'active').length || 0, icon: DollarSign, color: 'bg-emerald-500', loading: !partners },
    { label: 'Partner Referrals', value: referrals?.length || 0, icon: TrendingUp, color: 'bg-amber-500', loading: !referrals },
    { label: 'AutoRx Plans', value: autoRxPlans?.filter(p => p.status === 'active').length || 0, icon: Pill, color: 'bg-teal-500', loading: !autoRxPlans }
  ];

  const refetchAll = () => {
    refetchCustomers(); refetchProviders(); refetchPharmacies();
    refetchBusinesses(); refetchCreators(); refetchContacts();
    refetchPartners(); refetchReferrals();
  };

  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'analytics';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D]">Admin Dashboard</h1>
            <p className="text-muted-foreground">Internal use only — MedRevolve operations</p>
          </div>
          <div className="flex gap-2">
            <Link to={createPageUrl('BelugaIntegration')}>
              <Button variant="outline" size="sm" className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-50">
                🔗 Beluga Integration
              </Button>
            </Link>
            <Button onClick={refetchAll} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stat.loading ? <RefreshCw className="w-5 h-5 inline animate-spin" /> : stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader><CardTitle>Dashboard</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 mb-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="analytics" className="rounded-lg text-xs"><BarChart3 className="w-3.5 h-3.5 mr-1" /> Analytics</TabsTrigger>
                <TabsTrigger value="autorx" className="rounded-lg text-xs">
                  <Pill className="w-3.5 h-3.5 mr-1" /> AutoRx
                  {autoRxPlans?.filter(p => p.status === 'paused').length > 0 && (
                    <span className="ml-1 w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="customers" className="rounded-lg text-xs">Customers</TabsTrigger>
                <TabsTrigger value="providers" className="rounded-lg text-xs">Providers</TabsTrigger>
                <TabsTrigger value="pharmacies" className="rounded-lg text-xs">Pharmacies</TabsTrigger>
                <TabsTrigger value="businesses" className="rounded-lg text-xs">Business</TabsTrigger>
                <TabsTrigger value="creators" className="rounded-lg text-xs">Creators</TabsTrigger>
                <TabsTrigger value="contacts" className="rounded-lg text-xs">Contact</TabsTrigger>
                <TabsTrigger value="partners" className="rounded-lg text-xs">Partners</TabsTrigger>
                <TabsTrigger value="referrals" className="rounded-lg text-xs">Referrals</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
              <TabsContent value="autorx"><AutoRxAdminTab /></TabsContent>

              <TabsContent value="customers" className="space-y-4">
                {customers?.map(c => (
                  <Card key={c.id}><CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{c.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{c.email}</p>
                        <p className="text-sm mt-2"><strong>Primary Interest:</strong> {c.primary_interest || 'N/A'}</p>
                        <p className="text-sm"><strong>Phone:</strong> {c.phone || 'N/A'}</p>
                      </div>
                      <Badge>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(c.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>

              <TabsContent value="providers" className="space-y-4">
                {providers?.map(p => (
                  <Card key={p.id}><CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{p.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{p.email}</p>
                        <p className="text-sm mt-2"><strong>License:</strong> {p.license_number}</p>
                        <p className="text-sm"><strong>Specialty:</strong> {p.specialty}</p>
                        <p className="text-sm"><strong>States:</strong> {p.states_licensed?.join(', ') || 'N/A'}</p>
                      </div>
                      <Badge>{p.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(p.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>

              <TabsContent value="pharmacies" className="space-y-4">
                {pharmacies?.map(ph => (
                  <Card key={ph.id}><CardContent className="pt-6">
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
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(ph.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>

              <TabsContent value="businesses" className="space-y-4">
                {businesses?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No business inquiries yet</p>
                ) : businesses?.map(b => (
                  <Card key={b.id} className={selectedBusiness?.id === b.id ? 'border-blue-500 border-2' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <button type="button" onClick={() => setSelectedBusiness(selectedBusiness?.id === b.id ? null : b)}
                          className="flex-1 text-left cursor-pointer hover:opacity-80 transition">
                          <h3 className="font-semibold text-lg">{b.company_name}</h3>
                          <p className="text-sm text-muted-foreground">{b.email}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <p className="text-sm"><strong>Contact:</strong> {b.contact_name}</p>
                            <p className="text-sm"><strong>Industry:</strong> {b.industry}</p>
                            <p className="text-sm"><strong>Interest:</strong> {b.interest_type}</p>
                            <p className="text-sm"><strong>Phone:</strong> {b.phone || 'N/A'}</p>
                          </div>
                          {selectedBusiness?.id === b.id && b.message && (
                            <div className="mt-4 p-3 bg-gray-50 rounded border">
                              <p className="text-sm font-medium mb-1">Message:</p>
                              <p className="text-sm text-gray-700">{b.message}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-3">Submitted: {new Date(b.created_date).toLocaleString()}</p>
                        </button>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Badge>{b.status || 'pending'}</Badge>
                          <select value={businessStatus[b.id] || b.status || 'pending'}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              setBusinessStatus(prev => ({...prev, [b.id]: newStatus}));
                              await base44.entities.BusinessInquiry.update(b.id, {status: newStatus});
                              refetchBusinesses();
                            }}
                            className="text-xs px-2 py-1 border rounded">
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="creators" className="space-y-4">
                {creators?.map(cr => (
                  <Card key={cr.id}><CardContent className="pt-6">
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
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(cr.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                {contacts?.map(c => (
                  <Card key={c.id}><CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-sm text-muted-foreground">{c.email}</p>
                        <p className="text-sm mt-2"><strong>Message:</strong> {c.message}</p>
                      </div>
                      <Badge>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(c.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>

              <TabsContent value="partners" className="space-y-4">
                {partners?.map(p => (
                  <Card key={p.id}><CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{p.business_name}</h3>
                        <p className="text-sm text-muted-foreground">{p.email}</p>
                        <p className="text-sm mt-2"><strong>Contact:</strong> {p.contact_name}</p>
                        <p className="text-sm"><strong>Type:</strong> {p.business_type}</p>
                        <p className="text-sm"><strong>Code:</strong> {p.partner_code}</p>
                      </div>
                      <Badge>{p.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(p.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>

              <TabsContent value="referrals" className="space-y-4">
                {referrals?.map(r => (
                  <Card key={r.id}><CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Referral from Partner</h3>
                        <p className="text-sm text-muted-foreground">{r.customer_email}</p>
                        <p className="text-sm mt-2"><strong>Product:</strong> {r.product_id}</p>
                        <p className="text-sm"><strong>Order Value:</strong> ${r.order_value}</p>
                        <p className="text-sm"><strong>Earnings:</strong> ${r.partner_earnings}</p>
                      </div>
                      <Badge>{r.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Submitted: {new Date(r.created_date).toLocaleString()}</p>
                  </CardContent></Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RequireAuth portalName="Admin Dashboard" requiredRole="admin">
      <AdminDashboardInner />
    </RequireAuth>
  );
}