import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, AlertCircle, Settings, Mail, MessageSquare, 
  Calendar, Database, Zap, CreditCard, Send, Phone
} from 'lucide-react';

function ZohoOAuthFlow() {
  const [step, setStep] = useState(1);
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState('');

  const clientId = '1000.YOUR_CLIENT_ID'; // User needs to replace this

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=https://www.zoho.com`;

  const handleGetRefreshToken = async () => {
    if (!authCode.trim()) {
      toast.error('Please enter the authorization code');
      return;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('zohoGetRefreshToken', { code: authCode.trim() });
      
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
        setStep(3);
        toast.success('Refresh token obtained! Copy it and set as secret.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to get refresh token');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E8E0D5] space-y-6">
      <h4 className="font-medium text-[#2D3A2D]">Get Zoho Refresh Token</h4>

      {/* Step 1: Authorize */}
      <div className={`p-4 rounded-xl ${step === 1 ? 'bg-[#D4E5D7]' : 'bg-[#F5F0E8]'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 1 ? 'bg-green-500 text-white' : 'bg-[#4A6741] text-white'}`}>
            {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
          </div>
          <h5 className="font-medium text-[#2D3A2D]">Authorize with Zoho</h5>
        </div>
        <p className="text-sm text-[#5A6B5A] mb-3 ml-11">
          Click below to authorize MedRevolve with your Zoho CRM account
        </p>
        <div className="ml-11">
          <a href={authUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
              Authorize Zoho CRM
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Step 2: Enter Code */}
      <div className={`p-4 rounded-xl ${step === 2 ? 'bg-[#D4E5D7]' : 'bg-[#F5F0E8]'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-[#4A6741] text-white' : 'bg-gray-300 text-gray-600'}`}>
            {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
          </div>
          <h5 className="font-medium text-[#2D3A2D]">Paste Authorization Code</h5>
        </div>
        <p className="text-sm text-[#5A6B5A] mb-3 ml-11">
          After authorizing, copy the <code className="bg-white px-1 rounded">code</code> parameter from the redirect URL
        </p>
        {step >= 2 && (
          <div className="ml-11 space-y-3">
            <div>
              <Label htmlFor="authCode" className="text-sm text-[#5A6B5A]">Authorization Code</Label>
              <Input
                id="authCode"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Paste code here..."
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleGetRefreshToken}
              disabled={loading || !authCode.trim()}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white"
            >
              {loading ? 'Getting Token...' : 'Get Refresh Token'}
            </Button>
          </div>
        )}
      </div>

      {/* Step 3: Copy Token */}
      {step === 3 && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h5 className="font-medium text-green-900">Success! Copy Your Refresh Token</h5>
          </div>
          <p className="text-sm text-green-700 mb-3 ml-11">
            Copy this token and set it as <code className="bg-white px-1 rounded">ZOHO_REFRESH_TOKEN</code> in Dashboard → Settings → Secrets
          </p>
          <div className="ml-11 space-y-3">
            <div className="flex gap-2">
              <Input
                value={refreshToken}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                onClick={() => copyToClipboard(refreshToken)}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-green-600">
              ✓ After setting the secret, refresh this page to verify the connection
            </p>
          </div>
        </div>
      )}

      {step < 2 && (
        <div className="flex justify-center">
          <Button
            onClick={() => setStep(2)}
            variant="outline"
            className="text-[#4A6741] border-[#4A6741]"
          >
            I've Authorized, Enter Code
          </Button>
        </div>
      )}
    </div>
  );
}

export default function IntegrationsDashboard() {
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Test SMS from MedRevolve');

  const testSMSMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('sendSMS', data)
  });

  const testZohoMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('syncToZohoCRM', data)
  });

  const integrations = [
    {
      name: 'Stripe Payments',
      icon: CreditCard,
      status: 'configured',
      description: 'Payment processing for subscriptions and products',
      type: 'payment',
      action: 'Configure in Dashboard → Payments',
      docs: 'https://stripe.com/docs'
    },
    {
      name: 'Email (Core)',
      icon: Mail,
      status: 'active',
      description: 'Built-in transactional email service',
      type: 'communication',
      details: 'Sending to support@medrevolve.com and customers',
      action: null
    },
    {
      name: 'Twilio SMS',
      icon: Phone,
      status: 'needs_config',
      description: 'SMS reminders and notifications',
      type: 'communication',
      details: 'Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER',
      action: 'Set secrets in Environment Variables',
      testable: true
    },
    {
      name: 'Zapier Webhooks',
      icon: Zap,
      status: 'active',
      description: 'Connects to 5,000+ apps',
      type: 'automation',
      details: 'Active webhooks: Creator Applications, Business Inquiries',
      action: 'View EmailAudit page for details'
    },
    {
      name: 'Zoho CRM',
      icon: Database,
      status: 'partial',
      description: 'Lead and contact management',
      type: 'crm',
      details: 'Has client credentials, needs ZOHO_REFRESH_TOKEN',
      action: 'Generate refresh token at api-console.zoho.com',
      testable: true
    },
    {
      name: 'Google Calendar',
      icon: Calendar,
      status: 'needs_auth',
      description: 'Provider scheduling and appointments',
      type: 'scheduling',
      details: 'OAuth authorization required',
      action: 'Click Authorize below',
      authRequired: true
    },
    {
      name: 'SendGrid Email',
      icon: Send,
      status: 'optional',
      description: 'Enhanced email delivery (optional upgrade)',
      type: 'communication',
      details: 'Optional: Better deliverability, analytics, templates',
      action: 'Get API key from app.sendgrid.com'
    },
    {
      name: 'Gmail API',
      icon: Mail,
      status: 'available',
      description: 'Advanced email management',
      type: 'communication',
      details: 'OAuth authorization available',
      action: 'Can authorize if needed'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'configured':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'partial':
      case 'needs_config':
      case 'needs_auth':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      configured: { label: 'Configured', className: 'bg-green-100 text-green-800' },
      partial: { label: 'Partial Setup', className: 'bg-yellow-100 text-yellow-800' },
      needs_config: { label: 'Needs Config', className: 'bg-yellow-100 text-yellow-800' },
      needs_auth: { label: 'Needs Auth', className: 'bg-yellow-100 text-yellow-800' },
      optional: { label: 'Optional', className: 'bg-gray-100 text-gray-800' },
      available: { label: 'Available', className: 'bg-blue-100 text-blue-800' }
    };
    const { label, className } = config[status] || config.available;
    return <Badge className={className}>{label}</Badge>;
  };

  const handleTestSMS = () => {
    testSMSMutation.mutate({
      to: testPhone,
      message: testMessage
    });
  };

  const handleTestZoho = () => {
    testZohoMutation.mutate({
      recordType: 'lead',
      data: {
        full_name: 'Test Lead',
        email: 'test@example.com',
        phone: '+15551234567',
        company_name: 'Test Company',
        heard_about_us: 'Integration Test'
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
            Integrations <span className="font-medium">Dashboard</span>
          </h1>
          <p className="text-[#5A6B5A]">Manage all your third-party integrations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[#4A6741]">
                    {integrations.filter(i => i.status === 'active' || i.status === 'configured').length}
                  </p>
                  <p className="text-sm text-[#5A6B5A]">Active</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[#D4A574]">
                    {integrations.filter(i => i.status === 'partial' || i.status === 'needs_config' || i.status === 'needs_auth').length}
                  </p>
                  <p className="text-sm text-[#5A6B5A]">Needs Setup</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[#5A6B5A]">
                    {integrations.filter(i => i.status === 'available' || i.status === 'optional').length}
                  </p>
                  <p className="text-sm text-[#5A6B5A]">Available</p>
                </div>
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[#2D3A2D]">
                    {integrations.length}
                  </p>
                  <p className="text-sm text-[#5A6B5A]">Total</p>
                </div>
                <Zap className="w-8 h-8 text-[#4A6741]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations by Category */}
        {['payment', 'communication', 'crm', 'scheduling', 'automation'].map(type => {
          const categoryIntegrations = integrations.filter(i => i.type === type);
          if (categoryIntegrations.length === 0) return null;

          const typeNames = {
            payment: 'Payment Processing',
            communication: 'Communication',
            crm: 'CRM & Business',
            scheduling: 'Scheduling',
            automation: 'Automation'
          };

          return (
            <div key={type} className="mb-8">
              <h2 className="text-xl font-medium text-[#2D3A2D] mb-4">
                {typeNames[type]}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {categoryIntegrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <Card key={integration.name}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] flex items-center justify-center">
                              <Icon className="w-6 h-6 text-[#4A6741]" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription>{integration.description}</CardDescription>
                            </div>
                          </div>
                          {getStatusIcon(integration.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(integration.status)}
                          </div>
                          {integration.details && (
                            <p className="text-sm text-[#5A6B5A]">{integration.details}</p>
                          )}
                          {integration.action && (
                            <p className="text-sm font-medium text-[#4A6741]">
                              → {integration.action}
                            </p>
                          )}
                          {integration.docs && (
                            <a 
                              href={integration.docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#4A6741] underline"
                            >
                              View Documentation
                            </a>
                          )}

                          {/* Test Buttons */}
                          {integration.testable && integration.name === 'Twilio SMS' && (
                            <div className="mt-4 pt-4 border-t border-[#E8E0D5] space-y-3">
                              <div>
                                <Label className="text-xs">Test Phone</Label>
                                <Input
                                  value={testPhone}
                                  onChange={(e) => setTestPhone(e.target.value)}
                                  placeholder="+15551234567"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Message</Label>
                                <Input
                                  value={testMessage}
                                  onChange={(e) => setTestMessage(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <Button
                                onClick={handleTestSMS}
                                disabled={testSMSMutation.isPending || !testPhone}
                                size="sm"
                                className="w-full"
                              >
                                {testSMSMutation.isPending ? 'Sending...' : 'Test SMS'}
                              </Button>
                              {testSMSMutation.isSuccess && (
                                <p className="text-xs text-green-600">✓ SMS sent successfully!</p>
                              )}
                              {testSMSMutation.isError && (
                                <p className="text-xs text-red-600">✗ {testSMSMutation.error?.message}</p>
                              )}
                            </div>
                          )}

                          {integration.testable && integration.name === 'Zoho CRM' && (
                            <div className="mt-4 pt-4 border-t border-[#E8E0D5]">
                              <Button
                                onClick={handleTestZoho}
                                disabled={testZohoMutation.isPending}
                                size="sm"
                                className="w-full"
                              >
                                {testZohoMutation.isPending ? 'Testing...' : 'Test Zoho Sync'}
                              </Button>
                              {testZohoMutation.isSuccess && (
                                <p className="text-xs text-green-600 mt-2">✓ Lead created in Zoho!</p>
                              )}
                              {testZohoMutation.isError && (
                                <p className="text-xs text-red-600 mt-2">✗ {testZohoMutation.error?.message}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common integration tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/EmailAudit">View Email Audit & Webhooks</a>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              View Stripe Dashboard (Configure Stripe first)
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              Environment Variables (Set in Dashboard)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}