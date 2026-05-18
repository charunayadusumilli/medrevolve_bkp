import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  CheckCircle2, AlertCircle, Settings, CheckCircle,
  ExternalLink, Copy, Zap
} from 'lucide-react';

// Brand logo components using official brand colors & SVGs
const BrandLogo = ({ name, size = 48 }) => {
  const logos = {
    stripe: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#635BFF"/>
        <path d="M27.5 23.5c0-1.4 1.1-2 2.9-2 2.6 0 5.9.8 8.5 2.2V16c-2.8-1.1-5.6-1.5-8.5-1.5-7 0-11.6 3.6-11.6 9.7 0 9.5 13 8 13 12.1 0 1.7-1.5 2.2-3.4 2.2-3 0-6.7-1.2-9.7-2.9v7.8c3.3 1.4 6.6 2 9.7 2 7.2 0 12.1-3.5 12.1-9.7-.1-10.2-13.0-8.4-13.0-12.2z" fill="white"/>
      </svg>
    ),
    gmail: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1"/>
        <path d="M10 20h40v26H10z" fill="#F1F3F4" rx="2"/>
        <path d="M10 20l20 15 20-15" stroke="#EA4335" strokeWidth="2.5" fill="none"/>
        <path d="M10 20v26h6V28l14 10 14-10v18h6V20l-20 15z" fill="#4285F4"/>
        <path d="M10 20l20 15 20-15H10z" fill="#EA4335"/>
        <path d="M10 46h6V28l-6-8v26z" fill="#34A853"/>
        <path d="M50 46h-6V28l6-8v26z" fill="#FBBC04"/>
      </svg>
    ),
    googlecalendar: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1"/>
        <rect x="10" y="12" width="40" height="38" rx="4" fill="#ffffff" stroke="#4285F4" strokeWidth="2"/>
        <rect x="10" y="12" width="40" height="12" rx="4" fill="#4285F4"/>
        <rect x="10" y="20" width="40" height="4" fill="#4285F4"/>
        <text x="30" y="40" textAnchor="middle" fill="#4285F4" fontSize="16" fontWeight="bold">30</text>
        <line x1="20" y1="12" x2="20" y2="8" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="12" x2="40" y2="8" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    googledrive: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1"/>
        <path d="M30 10L44 36H16L30 10z" fill="#4285F4"/>
        <path d="M16 36L8 50h20L36 36H16z" fill="#34A853"/>
        <path d="M44 36L52 50H32L24 36h20z" fill="#FBBC04"/>
      </svg>
    ),
    twilio: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#F22F46"/>
        <circle cx="30" cy="30" r="14" fill="none" stroke="white" strokeWidth="3"/>
        <circle cx="23" cy="23" r="3.5" fill="white"/>
        <circle cx="37" cy="23" r="3.5" fill="white"/>
        <circle cx="23" cy="37" r="3.5" fill="white"/>
        <circle cx="37" cy="37" r="3.5" fill="white"/>
      </svg>
    ),
    zapier: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#FF4A00"/>
        <path d="M30 12v14M30 34v14M12 30h14M34 30h14M17.5 17.5l9.9 9.9M32.6 32.6l9.9 9.9M17.5 42.5l9.9-9.9M32.6 27.4l9.9-9.9" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
    ),
    zoho: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#E42527"/>
        <text x="30" y="38" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial">ZOHO</text>
      </svg>
    ),
    hubspot: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#FF7A59"/>
        <circle cx="37" cy="20" r="6" fill="white"/>
        <circle cx="37" cy="20" r="3" fill="#FF7A59"/>
        <path d="M31 20h-8a10 10 0 0 0-10 10v0a10 10 0 0 0 10 10h2" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="25" cy="40" r="5" fill="white"/>
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#25D366"/>
        <path d="M30 10C19 10 10 19 10 30c0 3.6 1 7 2.7 9.9L10 50l10.4-2.7C23.2 49 26.5 50 30 50c11 0 20-9 20-20S41 10 30 10z" fill="white"/>
        <path d="M39.5 35.5c-.5.5-1.1.9-1.8.9-.7 0-3.5-1.4-5.9-3.8-2.4-2.4-3.8-5.2-3.8-5.9 0-.7.4-1.3.9-1.8l1-1c.4-.4.9-.4 1.3 0l2.1 2.1c.4.4.4.9 0 1.3l-.7.7c-.2.2-.2.5 0 .7l2.9 2.9c.2.2.5.2.7 0l.7-.7c.4-.4.9-.4 1.3 0l2.1 2.1c.4.4.4.9 0 1.3l-1 1z" fill="#25D366"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#1877F2"/>
        <path d="M33 50V33h5.5l.8-6.5H33V23c0-1.8.5-3 3.1-3H39.5V14.2C38.7 14.1 36.6 14 34.2 14c-5 0-8.4 3-8.4 8.6V26.5H20V33h5.8v17H33z" fill="white"/>
      </svg>
    ),
    sendgrid: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#1A82E2"/>
        <rect x="12" y="12" width="16" height="16" rx="2" fill="white" opacity="0.9"/>
        <rect x="12" y="32" width="16" height="16" rx="2" fill="white" opacity="0.5"/>
        <rect x="32" y="12" width="16" height="16" rx="2" fill="white" opacity="0.5"/>
        <rect x="32" y="32" width="16" height="16" rx="2" fill="white" opacity="0.9"/>
      </svg>
    ),
    medrevolve: (
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <rect width="60" height="60" rx="12" fill="#2D3A2D"/>
        <text x="30" y="38" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial">MR</text>
      </svg>
    ),
  };
  return logos[name] || (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <rect width="60" height="60" rx="12" fill="#f3f4f6"/>
      <text x="30" y="35" textAnchor="middle" fill="#9ca3af" fontSize="10">{name}</text>
    </svg>
  );
};

function ZohoOAuthFlow() {
  const [step, setStep] = useState(1);
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState('');
  const [clientId, setClientId] = useState('');

  React.useEffect(() => {
    const fetchClientId = async () => {
      try {
        const { data } = await base44.functions.invoke('getZohoClientId');
        setClientId(data.client_id);
      } catch (error) {
        toast.error('Failed to load Zoho Client ID');
      }
    };
    fetchClientId();
  }, []);

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
            <Button 
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white"
              disabled={!clientId}
            >
              {clientId ? 'Authorize Zoho CRM' : 'Loading...'}
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
      logo: 'stripe',
      status: 'configured',
      description: 'Payment processing for subscriptions and products',
      type: 'payment',
      action: 'Configure in Dashboard → Payments',
      docs: 'https://stripe.com/docs'
    },
    {
      name: 'Gmail',
      logo: 'gmail',
      status: 'active',
      description: 'Transactional email from rned@medrevolve.com',
      type: 'communication',
      details: 'Connected via Google OAuth — sending all platform notifications',
      action: null
    },
    {
      name: 'Google Calendar',
      logo: 'googlecalendar',
      status: 'active',
      description: 'Appointment scheduling & Google Meet links',
      type: 'scheduling',
      details: 'Connected — auto-creates calendar events + Meet links on booking',
      action: null
    },
    {
      name: 'Google Drive',
      logo: 'googledrive',
      status: 'active',
      description: 'Intake form storage and document management',
      type: 'storage',
      details: 'Connected — intake forms and compliance docs synced to Drive',
      action: null
    },
    {
      name: 'HubSpot CRM',
      logo: 'hubspot',
      status: 'active',
      description: 'Lead and contact management',
      type: 'crm',
      details: 'Connected — contacts and deals synced automatically',
      action: null
    },
    {
      name: 'Twilio SMS',
      logo: 'twilio',
      status: 'configured',
      description: 'SMS reminders and appointment notifications',
      type: 'communication',
      details: 'Account SID + Auth Token configured',
      action: 'Test via test panel below',
      testable: true
    },
    {
      name: 'Zapier',
      logo: 'zapier',
      status: 'active',
      description: 'Connects to 5,000+ apps via webhooks',
      type: 'automation',
      details: 'Active webhooks: Creator Applications, Business Inquiries',
      action: 'View EmailAudit page for webhook URLs'
    },
    {
      name: 'Zoho CRM',
      logo: 'zoho',
      status: 'partial',
      description: 'Legacy CRM — being migrated to HubSpot',
      type: 'crm',
      details: 'Has client credentials, needs ZOHO_REFRESH_TOKEN to fully activate',
      action: 'Generate refresh token at api-console.zoho.com',
      testable: true
    },
    {
      name: 'WhatsApp Business',
      logo: 'whatsapp',
      status: 'available',
      description: 'Patient messaging via WhatsApp',
      type: 'communication',
      details: 'Available via Twilio WhatsApp API — requires additional setup',
      action: 'Enable via Twilio WhatsApp sandbox'
    },
    {
      name: 'Facebook / Meta',
      logo: 'facebook',
      status: 'available',
      description: 'Lead ads and Messenger integration',
      type: 'marketing',
      details: 'Connect Meta Ads for lead capture and Messenger support',
      action: 'Requires Meta Business account'
    },
    {
      name: 'SendGrid',
      logo: 'sendgrid',
      status: 'optional',
      description: 'High-volume email delivery (optional upgrade)',
      type: 'communication',
      details: 'Optional: Enhanced deliverability, email analytics and templates',
      action: 'Get API key from app.sendgrid.com'
    },
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
        <div className="mb-8 flex items-center gap-5">
          <BrandLogo name="medrevolve" size={56} />
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D]">Integrations Hub</h1>
            <p className="text-[#5A6B5A] mt-1">All connected services powering the MedRevolve platform</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Connected', count: integrations.filter(i => i.status === 'active').length, color: 'text-green-600', icon: '✅', bg: 'bg-green-50 border-green-200' },
            { label: 'Configured', count: integrations.filter(i => i.status === 'configured' || i.status === 'partial').length, color: 'text-blue-600', icon: '⚙️', bg: 'bg-blue-50 border-blue-200' },
            { label: 'Needs Setup', count: integrations.filter(i => ['needs_config','needs_auth'].includes(i.status)).length, color: 'text-amber-600', icon: '⚠️', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Available', count: integrations.filter(i => ['available','optional'].includes(i.status)).length, color: 'text-gray-500', icon: '🔌', bg: 'bg-gray-50 border-gray-200' },
          ].map(({ label, count, color, icon, bg }) => (
            <div key={label} className={`rounded-2xl border p-5 flex items-center justify-between ${bg}`}>
              <div>
                <p className={`text-3xl font-bold ${color}`}>{count}</p>
                <p className="text-sm text-gray-600 mt-0.5">{label}</p>
              </div>
              <span className="text-3xl">{icon}</span>
            </div>
          ))}
        </div>

        {/* Integrations by Category */}
        {['payment', 'communication', 'scheduling', 'storage', 'crm', 'automation', 'marketing'].map(type => {
          const categoryIntegrations = integrations.filter(i => i.type === type);
          if (categoryIntegrations.length === 0) return null;

          const typeNames = {
            payment: '💳 Payment Processing',
            communication: '📡 Communication',
            crm: '🏢 CRM & Business',
            scheduling: '📅 Scheduling',
            automation: '⚡ Automation',
            storage: '🗄️ Storage',
            marketing: '📣 Marketing',
          };

          return (
            <div key={type} className="mb-8">
              <h2 className="text-xl font-medium text-[#2D3A2D] mb-4">
                {typeNames[type]}
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {categoryIntegrations.map((integration) => (
                    <Card key={integration.name} className="overflow-hidden border border-[#E8E0D5] shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <BrandLogo name={integration.logo} size={48} />
                            </div>
                            <div>
                              <CardTitle className="text-base font-bold text-[#1a2a1a]">{integration.name}</CardTitle>
                              <CardDescription className="text-sm mt-0.5">{integration.description}</CardDescription>
                            </div>
                          </div>
                          {getStatusIcon(integration.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(integration.status)}
                          </div>
                          {integration.details && (
                            <p className="text-sm text-[#5A6B5A]">{integration.details}</p>
                          )}
                          {integration.action && (
                            <p className="text-sm font-medium text-[#4A6741]">→ {integration.action}</p>
                          )}
                          {integration.docs && (
                            <a href={integration.docs} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A6741] underline flex items-center gap-1">
                              View Documentation <ExternalLink className="w-3 h-3" />
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
                              <ZohoOAuthFlow />
                              <div className="mt-3">
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
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                ))}
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