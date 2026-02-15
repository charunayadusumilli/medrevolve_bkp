import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmailAudit() {
  const emailNotifications = [
    {
      trigger: 'New User Signup',
      function: 'notifyNewSignup',
      automation: 'Yes (Entity: User, Event: create)',
      emails: [
        { to: 'ADMIN_EMAIL (env variable)', subject: 'New User Signup', status: 'active' },
      ],
      integration: 'Zoho CRM sync',
      notes: 'Also creates contact in Zoho CRM (requires ZOHO_REFRESH_TOKEN)'
    },
    {
      trigger: 'Creator Application Submitted',
      function: 'submitCreatorApplication',
      automation: 'No (Direct form submission)',
      emails: [
        { to: 'support@medrevolve.com', subject: 'New Creator Application', status: 'active' },
        { to: 'Applicant email', subject: 'Creator Application Received', status: 'active' },
      ],
      integration: 'Zapier webhook + Zoho CRM sync',
      notes: 'POSTs to Zapier webhook (https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/). Tracks zapier_status, zapier_error, zapier_sent_at.'
    },
    {
      trigger: 'Business Inquiry Submitted',
      function: 'submitBusinessInquiry',
      automation: 'No (Direct form submission)',
      emails: [
        { to: 'support@medrevolve.com', subject: 'New Business Partnership Inquiry', status: 'active' },
        { to: 'Contact email', subject: 'Partnership Inquiry Received', status: 'active' },
      ],
      integration: 'Zapier webhook + Zoho CRM sync',
      notes: 'POSTs to Zapier webhook (https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/)'
    },
    {
      trigger: 'Health Questionnaire Completed',
      function: 'submitQuestionnaire',
      automation: 'No (Direct form submission)',
      emails: [
        { to: 'support@medrevolve.com', subject: 'New Health Questionnaire - {email}', status: 'active' },
        { to: 'Patient email', subject: 'Health Questionnaire Received - Next Steps', status: 'active' },
      ],
      integration: 'None',
      notes: 'Saves to PatientIntake entity. NO Zapier webhook currently.'
    },
    {
      trigger: 'Appointment Booked',
      function: 'notifyAppointmentBooked',
      automation: 'Yes (Entity: Appointment, Event: create)',
      emails: [
        { to: 'ADMIN_EMAIL (env variable)', subject: 'New Appointment Booked', status: 'active' },
        { to: 'Patient email', subject: 'Appointment Confirmation', status: 'active' },
      ],
      integration: 'None',
      notes: 'NO Zapier webhook currently.'
    },
    {
      trigger: 'Contact Form Submitted',
      function: 'submitContactRequest',
      automation: 'No (Direct form submission)',
      emails: [
        { to: 'support@medrevolve.com', subject: 'New Contact Request: {subject}', status: 'active' },
        { to: 'Customer email', subject: 'We received your message', status: 'active' },
      ],
      integration: 'None',
      notes: 'Saves to ContactRequest entity. NO Zapier webhook currently.'
    },
    {
      trigger: 'Appointment Reminder (Scheduled)',
      function: 'sendAppointmentReminder',
      automation: 'Inactive (no automation configured)',
      emails: [
        { to: 'Patient email', subject: 'Appointment Reminder', status: 'inactive' },
      ],
      integration: 'None',
      notes: 'Function exists but NO automation is active to trigger it.'
    },
  ];

  const criticalIssues = [
    {
      issue: 'Zoho Integration Blocked',
      severity: 'critical',
      details: 'ZOHO_REFRESH_TOKEN is missing. New signups, creator applications, and business inquiries cannot sync to Zoho CRM.',
      affectedFunctions: ['notifyNewSignup', 'syncCreatorToZoho', 'syncBusinessToZoho']
    },
    {
      issue: 'Appointment Reminders Inactive',
      severity: 'high',
      details: 'sendAppointmentReminder function exists but no automation is configured to trigger it.',
      affectedFunctions: ['sendAppointmentReminder']
    },
    {
      issue: 'Missing Zapier Webhooks',
      severity: 'medium',
      details: 'Questionnaire, Contact Form, and Appointment bookings do not send to Zapier.',
      affectedFunctions: ['submitQuestionnaire', 'submitContactRequest', 'notifyAppointmentBooked']
    }
  ];

  const emailRecipients = {
    'support@medrevolve.com': [
      'Creator Applications',
      'Business Inquiries',
      'Health Questionnaires',
      'Contact Form Submissions'
    ],
    'ADMIN_EMAIL (env)': [
      'New User Signups',
      'Appointment Bookings'
    ],
    'User/Customer Email': [
      'Application confirmations',
      'Inquiry confirmations',
      'Questionnaire confirmations',
      'Appointment confirmations',
      'Contact form confirmations',
      'Appointment reminders (inactive)'
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
            Email & Integration <span className="font-medium">Audit</span>
          </h1>
          <p className="text-[#5A6B5A]">Complete overview of all email notifications and integrations</p>
        </div>

        {/* Critical Issues */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-[#2D3A2D] mb-4">⚠️ Critical Issues</h2>
          <div className="space-y-4">
            {criticalIssues.map((issue, idx) => (
              <Card key={idx} className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-[#2D3A2D]">{issue.issue}</h3>
                        <Badge className={
                          issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#5A6B5A] mb-2">{issue.details}</p>
                      <p className="text-xs text-[#5A6B5A]">
                        <span className="font-medium">Affected:</span> {issue.affectedFunctions.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Recipients Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-[#2D3A2D] mb-4">📧 Email Recipients</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(emailRecipients).map(([recipient, types]) => (
              <Card key={recipient}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#4A6741]" />
                    {recipient}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {types.map((type, idx) => (
                      <li key={idx} className="text-sm text-[#5A6B5A] flex items-start gap-2">
                        <span className="text-[#4A6741] mt-1">•</span>
                        {type}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Email Notifications */}
        <div>
          <h2 className="text-xl font-medium text-[#2D3A2D] mb-4">📋 All Email Notifications</h2>
          <div className="space-y-6">
            {emailNotifications.map((notification, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{notification.trigger}</CardTitle>
                    <Badge className={notification.automation !== 'No (Direct form submission)' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {notification.automation.includes('Yes') ? 'Automated' : 'Form Trigger'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#2D3A2D] mb-2">Function:</p>
                    <code className="text-sm bg-[#F5F3EF] px-2 py-1 rounded">{notification.function}</code>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-[#2D3A2D] mb-2">Emails Sent:</p>
                    <div className="space-y-2">
                      {notification.emails.map((email, emailIdx) => (
                        <div key={emailIdx} className="flex items-center gap-3 text-sm">
                          {email.status === 'active' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <div>
                            <span className="text-[#2D3A2D] font-medium">To:</span> {email.to}
                            <span className="text-[#5A6B5A] mx-2">|</span>
                            <span className="text-[#2D3A2D] font-medium">Subject:</span> {email.subject}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {notification.integration && (
                    <div>
                      <p className="text-sm font-medium text-[#2D3A2D] mb-1">Integration:</p>
                      <p className="text-sm text-[#5A6B5A]">{notification.integration}</p>
                    </div>
                  )}

                  {notification.notes && (
                    <div className="bg-[#F5F3EF] p-3 rounded-lg">
                      <p className="text-xs text-[#5A6B5A]">{notification.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Summary */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-[#2D3A2D] mb-4">🔗 Integration Summary</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#2D3A2D] mb-2">Zapier Webhook</h3>
                  <p className="text-sm text-[#5A6B5A] mb-2">
                    URL: <code className="bg-[#F5F3EF] px-2 py-1 rounded text-xs">https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/</code>
                  </p>
                  <p className="text-sm text-[#5A6B5A]">
                    ✅ Connected: Creator Applications, Business Inquiries<br />
                    ❌ Missing: Health Questionnaires, Contact Forms, Appointments
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-[#2D3A2D] mb-2">Zoho CRM</h3>
                  <p className="text-sm text-red-600">
                    ❌ BLOCKED: Missing ZOHO_REFRESH_TOKEN<br />
                    Cannot sync new users, creator applications, or business inquiries to Zoho CRM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}