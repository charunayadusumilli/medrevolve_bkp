/**
 * Client-side 30-minute digest tracker.
 * Stores events in localStorage and fires a digest email to rned@medrevolve.com
 * every 30 minutes if there is any accumulated activity.
 */

import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'mr_digest_events';
const LAST_SENT_KEY = 'mr_digest_last_sent';
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes (was 30)
const NOTIFY_EMAIL = 'rned@medrevolve.com';

export function trackDigestEvent(type, data) {
  try {
    const events = getStoredEvents();
    events.push({
      type,
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // silently ignore storage errors
  }
}

function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function clearStoredEvents() {
  localStorage.removeItem(STORAGE_KEY);
}

function getLastSent() {
  try {
    return parseInt(localStorage.getItem(LAST_SENT_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function setLastSent() {
  localStorage.setItem(LAST_SENT_KEY, Date.now().toString());
}

async function sendDigest() {
  const events = getStoredEvents();
  if (events.length === 0) return;

  const nowStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  // Group by type
  const grouped = events.reduce((acc, e) => {
    acc[e.type] = acc[e.type] || [];
    acc[e.type].push(e);
    return acc;
  }, {});

  const fmtTime = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const typeLabels = {
    merchant_onboarding: '🚀 Merchant Onboardings',
    contact_request: '✉️ Contact Requests',
    creator_application: '🎥 Creator Applications',
    patient_onboarding: '🏥 Patient Onboardings',
    business_inquiry: '💼 Business Inquiries',
    page_view: '👁️ Page Views',
    button_click: '🖱️ Button Clicks',
    other: '📋 Other Events',
  };

  let sectionsHtml = '';

  for (const [type, typeEvents] of Object.entries(grouped)) {
    if (type === 'page_view' || type === 'button_click') continue; // skip noise

    const label = typeLabels[type] || `📋 ${type}`;
    sectionsHtml += `
<h3 style="margin:20px 0 8px;font-size:14px;color:#111;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">${label} (${typeEvents.length})</h3>
<table style="width:100%;border-collapse:collapse;font-size:12px;">
  <thead><tr style="background:#f3f4f6;">
    <th style="padding:6px 10px;text-align:left;border:1px solid #e5e7eb;">Time (ET)</th>
    <th style="padding:6px 10px;text-align:left;border:1px solid #e5e7eb;">Details</th>
  </tr></thead>
  <tbody>
    ${typeEvents.map((e, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
      <td style="padding:5px 10px;border:1px solid #e5e7eb;white-space:nowrap;">${fmtTime(e.timestamp)}</td>
      <td style="padding:5px 10px;border:1px solid #e5e7eb;">${formatEventData(e.data)}</td>
    </tr>`).join('')}
  </tbody>
</table>`;
  }

  // Page view stats summary
  const pageViews = grouped['page_view'] || [];
  const clicks = grouped['button_click'] || [];
  const pageStats = pageViews.reduce((acc, e) => {
    const p = e.data?.page || 'Unknown';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const trafficHtml = Object.keys(pageStats).length > 0 ? `
<h3 style="margin:20px 0 8px;font-size:14px;color:#111;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">👁️ Page Traffic (${pageViews.length} views, ${clicks.length} clicks)</h3>
<table style="width:100%;border-collapse:collapse;font-size:12px;">
  <thead><tr style="background:#f3f4f6;">
    <th style="padding:6px 10px;text-align:left;border:1px solid #e5e7eb;">Page</th>
    <th style="padding:6px 10px;text-align:left;border:1px solid #e5e7eb;">Views</th>
  </tr></thead>
  <tbody>
    ${Object.entries(pageStats).sort((a, b) => b[1] - a[1]).map(([page, count], i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
      <td style="padding:5px 10px;border:1px solid #e5e7eb;">${page}</td>
      <td style="padding:5px 10px;border:1px solid #e5e7eb;font-weight:600;">${count}</td>
    </tr>`).join('')}
  </tbody>
</table>` : '';

  const highValueCount = events.filter(e =>
    ['merchant_onboarding', 'creator_application', 'business_inquiry', 'patient_onboarding', 'contact_request'].includes(e.type)
  ).length;

  const body = `
<div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#111;">
  <div style="background:#0a0a0a;padding:18px 24px;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:16px;font-weight:800;letter-spacing:0.05em;">MEDREVOLVE</h1>
    <p style="color:rgba(255,255,255,0.4);margin:3px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">30-Minute Activity Digest</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:20px 24px;">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#14532d;">${events.length} events tracked · ${highValueCount} high-value conversions</p>
      <p style="margin:3px 0 0;font-size:11px;color:#15803d;">Period ending ${nowStr} ET</p>
    </div>
    ${sectionsHtml}
    ${trafficHtml}
  </div>
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;padding:10px 24px;border-radius:0 0 8px 8px;text-align:center;">
    <p style="margin:0;font-size:10px;color:#9ca3af;">MedRevolve Client-Side Digest · Sent every 30 minutes when activity detected</p>
  </div>
</div>
  `.trim();

  try {
    await base44.integrations.Core.SendEmail({
      from_name: 'MedRevolve Platform',
      to: NOTIFY_EMAIL,
      subject: `📊 [${events.length} Events] MedRevolve 30-Min Digest — ${nowStr}`,
      body,
    });
    clearStoredEvents();
    setLastSent();
    console.log(`[Digest] Sent ${events.length} events to ${NOTIFY_EMAIL}`);
  } catch (err) {
    console.error('[Digest] Failed to send digest:', err);
  }
}

function formatEventData(data) {
  if (!data) return '—';
  const parts = [];
  if (data.name || data.full_name || data.business_name || data.company_name) {
    parts.push(`<b>${data.name || data.full_name || data.business_name || data.company_name}</b>`);
  }
  if (data.email) parts.push(`📧 ${data.email}`);
  if (data.phone) parts.push(`📞 ${data.phone}`);
  if (data.platform) parts.push(`${data.platform}`);
  if (data.followers_count) parts.push(`${data.followers_count} followers`);
  if (data.interest_type) parts.push(data.interest_type);
  if (data.primary_interest) parts.push(data.primary_interest);
  if (data.monthly_fee) parts.push(`💰 $${data.monthly_fee}/mo`);
  if (data.page) parts.push(`→ ${data.page}`);
  if (data.action) parts.push(data.action);
  return parts.join(' · ') || JSON.stringify(data).slice(0, 120);
}

// ── Startup test email — fires once per session to confirm delivery ─────────
async function sendStartupPing() {
  try {
    const already = sessionStorage.getItem('mr_ping_sent');
    if (already) return;
    sessionStorage.setItem('mr_ping_sent', '1');

    const nowStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    await base44.integrations.Core.SendEmail({
      from_name: 'MedRevolve Platform',
      to: NOTIFY_EMAIL,
      subject: `✅ MedRevolve Platform Active — ${nowStr} ET`,
      body: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:18px 24px;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:16px;font-weight:800;letter-spacing:0.05em;">MEDREVOLVE</h1>
    <p style="color:rgba(255,255,255,0.4);margin:3px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Platform Activity Ping</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:24px;">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#14532d;">✅ Email delivery confirmed — platform is live</p>
      <p style="margin:4px 0 0;font-size:12px;color:#15803d;">Session started at ${nowStr} ET</p>
    </div>
    <p style="font-size:13px;color:#374151;">This confirms the MedRevolve email notification system is working correctly. You will receive:</p>
    <ul style="font-size:13px;color:#374151;line-height:1.8;">
      <li>📧 <b>Immediate alerts</b> for every form submission (merchant, contact, creator, patient)</li>
      <li>📊 <b>Activity digests</b> every 5 minutes when traffic is detected</li>
      <li>🚀 <b>Startup ping</b> each new browser session (this email)</li>
    </ul>
    <p style="font-size:12px;color:#9ca3af;margin-top:16px;">Sent to: ${NOTIFY_EMAIL} · Page: ${window.location.pathname || '/'}</p>
  </div>
</div>`.trim(),
    });
    console.log('[Ping] Startup email sent to', NOTIFY_EMAIL);
  } catch (err) {
    console.error('[Ping] Failed to send startup ping:', err);
  }
}

// Start the 5-min interval checker
let digestInterval = null;

export function startDigestTracker() {
  if (digestInterval) return;

  // Send startup ping immediately to verify email delivery
  sendStartupPing();

  // Fire digest immediately if there are stored events from last session
  sendDigest();

  digestInterval = setInterval(() => {
    sendDigest();
  }, INTERVAL_MS);
}

export function stopDigestTracker() {
  if (digestInterval) {
    clearInterval(digestInterval);
    digestInterval = null;
  }
}