import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, FileText, MessageSquare, LayoutDashboard } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import ComplianceOverview from '@/components/compliance/ComplianceOverview';
import ComplianceDocuments from '@/components/compliance/ComplianceDocuments';
import ComplianceMessaging from '@/components/compliance/ComplianceMessaging';

export default function PartnerCompliance() {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: partner, isLoading: partnerLoading } = useQuery({
    queryKey: ['partner', user?.email],
    queryFn: async () => {
      const partners = await base44.entities.Partner.filter({ email: user.email });
      return partners[0] || null;
    },
    enabled: !!user
  });

  const { data: complianceRecord, isLoading: complianceLoading } = useQuery({
    queryKey: ['partner-compliance', partner?.id],
    queryFn: async () => {
      const records = await base44.entities.ComplianceRecord.filter({ partner_id: partner.id });
      return records[0] || null;
    },
    enabled: !!partner
  });

  const { data: unreadMessages = [] } = useQuery({
    queryKey: ['unread-compliance-messages', complianceRecord?.id],
    queryFn: () => base44.entities.ComplianceMessage.filter({
      compliance_id: complianceRecord.id,
      is_read: false,
      sender_role: 'admin'
    }),
    enabled: !!complianceRecord,
    refetchInterval: 15000
  });

  if (userLoading || partnerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to view your compliance portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="bg-[#4A6741]">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Partner Account Found</CardTitle>
            <CardDescription>You don't have an active partner account linked to {user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(createPageUrl('PartnerSignup'))} className="bg-[#4A6741]">
              Become a Partner
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (complianceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
      </div>
    );
  }

  if (!complianceRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-lg text-center">
          <CardContent className="pt-10 pb-10">
            <div className="w-16 h-16 rounded-full bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#4A6741]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Compliance Review Pending</h2>
            <p className="text-gray-600">
              Your account is being reviewed by our compliance team. You'll receive an email at <strong>{user.email}</strong> once the review is initiated.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4A6741]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#4A6741]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Compliance Portal</h1>
                <p className="text-sm text-gray-500">{partner.business_name}</p>
              </div>
            </div>
            {unreadMessages.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-50 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <MessageSquare className="w-4 h-4" />
                {unreadMessages.length} new message{unreadMessages.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue={unreadMessages.length > 0 ? 'messages' : 'overview'}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
              {complianceRecord.documents_required?.filter(d => d.status === 'pending').length > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                  {complianceRecord.documents_required.filter(d => d.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
              {unreadMessages.length > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                  {unreadMessages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ComplianceOverview
              compliance={complianceRecord}
              partner={partner}
              unreadMessages={unreadMessages.length}
            />
          </TabsContent>

          <TabsContent value="documents">
            <ComplianceDocuments
              compliance={complianceRecord}
              partnerType={complianceRecord.partner_type}
            />
          </TabsContent>

          <TabsContent value="messages">
            <ComplianceMessaging
              compliance={complianceRecord}
              user={user}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}