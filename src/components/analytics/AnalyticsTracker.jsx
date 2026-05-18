import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackDigestEvent, startDigestTracker } from '@/lib/digestTracker';
import { base44 } from '@/api/base44Client';

let digestStarted = false;
let startupEmailSent = false;

// Send a direct startup email from the frontend (not backend) to verify delivery
async function sendDirectStartupEmail() {
  if (startupEmailSent) return;
  try {
    const already = sessionStorage.getItem('mr_startup_v2');
    if (already) return;
    sessionStorage.setItem('mr_startup_v2', '1');
    startupEmailSent = true;
    const nowStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    await base44.integrations.Core.SendEmail({
      from_name: 'MedRevolve Platform',
      to: 'rned@medrevolve.com',
      subject: `✅ MedRevolve Notifications Active — ${nowStr} ET`,
      body: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
  <div style="background:#0a0a0a;padding:16px 24px;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:15px;font-weight:800;letter-spacing:0.05em;">MEDREVOLVE PLATFORM</h1>
    <p style="color:rgba(255,255,255,0.4);margin:2px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;">Notification System — Active Confirmation</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:24px;">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-bottom:18px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#14532d;">✅ Email delivery is working correctly</p>
      <p style="margin:4px 0 0;font-size:12px;color:#15803d;">Platform session started ${nowStr} ET</p>
    </div>
    <p style="font-size:14px;color:#374151;margin-bottom:12px;">Hi Rned — your MedRevolve notification system is active. You will now receive:</p>
    <table style="width:100%;font-size:13px;border-collapse:collapse;">
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;border:1px solid #e5e7eb;">📧 Merchant Onboarding</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#16a34a;font-weight:600;">Immediate email on every submission</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;">✉️ Contact Form</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#16a34a;font-weight:600;">Immediate email on every submission</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;border:1px solid #e5e7eb;">🎥 Creator Applications</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#16a34a;font-weight:600;">Immediate email on every submission</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;">💼 Business Inquiries</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#16a34a;font-weight:600;">Immediate email on every submission</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;border:1px solid #e5e7eb;">🏥 Patient Intakes</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#16a34a;font-weight:600;">Immediate email on every submission</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;">📊 Activity Digest</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#16a34a;font-weight:600;">Every 5 minutes when traffic detected</td></tr>
    </table>
    <p style="font-size:11px;color:#9ca3af;margin-top:16px;">Sent from: MedRevolve Frontend · To: rned@medrevolve.com · ${window.location.href}</p>
  </div>
</div>`.trim(),
    });
    console.log('[MedRevolve] ✅ Startup email sent to rned@medrevolve.com');
  } catch (err) {
    console.error('[MedRevolve] ❌ Startup email failed:', err);
  }
}

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Start digest tracker (startup email disabled until domain verification completes)
    if (!digestStarted) {
      startDigestTracker();
      digestStarted = true;
    }
  }, []);

  useEffect(() => {
    const pageName = location.pathname.replace('/', '') || 'Home';
    trackDigestEvent('page_view', { page: pageName, path: location.pathname, search: location.search });
  }, [location]);

  return null;
}

// Helper function to track custom events — feeds digest AND backend analytics
export const trackEvent = (action, pageName, metadata = {}) => {
  trackDigestEvent('button_click', { action, page: pageName, ...metadata });
  // Also persist high-value events to backend analytics db
  const highValue = ['submit', 'onboard', 'book', 'checkout', 'purchase', 'apply', 'signup'];
  if (highValue.some(k => action?.toLowerCase().includes(k))) {
    base44.functions.invoke('masterAnalytics', {
      eventType: 'button_click',
      pageName,
      action,
      metadata,
      severity: 'high',
    }).catch(() => {});
  }
};

// Track form submissions with full backend persistence
export const trackFormSubmit = (formName, pageName, data = {}) => {
  trackDigestEvent(formName, { ...data, page: pageName });
  base44.functions.invoke('masterAnalytics', {
    eventType: formName,
    pageName,
    action: 'form_submit',
    userEmail: data.email || null,
    metadata: data,
    severity: 'high',
  }).catch(() => {});
};