import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * masterAnalytics — unified analytics + notification hub
 * Called by: frontend trackEvent, entity automations, and form submission flows
 * 
 * Payload: { eventType, pageName, action, metadata, userEmail, severity }
 *   OR automation payload: { event, data, old_data }
 */

const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'rned@medrevolve.com';

const HIGH_VALUE_EVENTS = ['merchant_onboarding', 'booking', 'order', 'signup', 'consultation_booked', 'prescription_created'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Normalize payload — support both direct calls and entity automation calls
    let eventType = body.eventType || body.event_type;
    let pageName = body.pageName || body.page_name;
    let action = body.action;
    let metadata = body.metadata || {};
    let userEmail = body.userEmail || body.user_email || null;
    const severity = body.severity || 'info';

    // If this is an entity automation payload, build the event from it
    if (body.event?.entity_name) {
      eventType = `entity_${body.event.type}`;
      pageName = body.event.entity_name;
      action = body.event.type;
      metadata = { entity_id: body.event.entity_id, ...(body.data || {}) };
      userEmail = body.data?.email || body.data?.patient_email || body.data?.created_by || null;
    }

    if (!eventType) {
      return Response.json({ error: 'eventType required' }, { status: 400 });
    }

    // Get session/request context
    const referrer = req.headers.get('referer') || 'server';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const cookies = req.headers.get('cookie') || '';
    let sessionId = cookies.match(/mr_session=([^;]+)/)?.[1] || crypto.randomUUID();

    // Try to enrich with auth user if not provided
    if (!userEmail) {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          userEmail = user?.email;
        }
      } catch { /* public app — ignore */ }
    }

    // Write analytics record
    await base44.asServiceRole.entities.Analytics.create({
      event_type: eventType,
      page_name: pageName || 'unknown',
      action: action || null,
      user_email: userEmail,
      session_id: sessionId,
      referrer,
      user_agent: userAgent,
      metadata,
    });

    // Send immediate Gmail notification for high-value events
    const isHighValue = HIGH_VALUE_EVENTS.some(e => eventType?.toLowerCase().includes(e));
    if (isHighValue || severity === 'high' || severity === 'critical') {
      try {
        const label = eventType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const metaHtml = Object.entries(metadata)
          .filter(([k]) => !['user_agent', 'session_id'].includes(k))
          .map(([k, v]) => `<tr><td style="padding:4px 10px;color:#6b7280;font-size:12px;">${k}</td><td style="padding:4px 10px;font-size:12px;font-weight:600;">${v}</td></tr>`)
          .join('');

        await base44.asServiceRole.functions.invoke('sendGmailNotification', {
          to: ADMIN_EMAIL,
          subject: `🔔 ${label} — MedRevolve Platform`,
          event_type: eventType,
          html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:16px 24px;border-radius:8px 8px 0 0;">
    <p style="color:#fff;margin:0;font-size:15px;font-weight:800;">MEDREVOLVE</p>
    <p style="color:rgba(255,255,255,0.4);margin:2px 0 0;font-size:10px;letter-spacing:0.1em;">Platform Event</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:20px 24px;">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#14532d;">🔔 ${label}</p>
      <p style="margin:3px 0 0;font-size:11px;color:#15803d;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      ${userEmail ? `<tr><td style="padding:4px 10px;color:#6b7280;font-size:12px;">User</td><td style="padding:4px 10px;font-size:12px;font-weight:600;">${userEmail}</td></tr>` : ''}
      ${pageName ? `<tr><td style="padding:4px 10px;color:#6b7280;font-size:12px;">Page / Entity</td><td style="padding:4px 10px;font-size:12px;">${pageName}</td></tr>` : ''}
      ${metaHtml}
    </table>
  </div>
</div>`,
        });
      } catch (notifyErr) {
        console.error('masterAnalytics: Gmail notification failed (non-blocking):', notifyErr.message);
      }
    }

    return Response.json({ success: true, sessionId }, {
      headers: { 'Set-Cookie': `mr_session=${sessionId}; Path=/; Max-Age=86400; SameSite=Lax` },
    });
  } catch (error) {
    console.error('masterAnalytics error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});