import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { eventType, pageName, userEmail, action, metadata, severity = 'info' } = await req.json();

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'rned@medrevolve.com';

    // Only notify for meaningful events
    const notifiableEvents = ['button_click', 'form_submit', 'booking', 'order', 'error', 'signup'];
    if (!notifiableEvents.includes(eventType) && severity !== 'critical') {
      return Response.json({ success: true, notified: false });
    }

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const eventLabel = {
      page_view: '👁️ Page View', button_click: '🖱️ Button Click',
      form_submit: '📝 Form Submitted', booking: '📅 Booking',
      order: '🛒 Order', error: '⚠️ Error', signup: '✨ New Signup',
    }[eventType] || eventType;

    const subject = `${eventLabel} — ${pageName}${severity === 'critical' ? ' [URGENT]' : ''}`;
    const metaRows = metadata ? Object.entries(metadata)
      .map(([k, v]) => `<tr><td style="padding:4px 10px;color:#6b7280;font-size:12px;">${k}</td><td style="padding:4px 10px;font-size:12px;">${v}</td></tr>`)
      .join('') : '';

    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:16px 24px;border-radius:8px 8px 0 0;">
    <p style="color:#fff;margin:0;font-size:14px;font-weight:800;">MEDREVOLVE — Activity Monitor</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:20px 24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr style="background:#f9fafb;"><td style="padding:7px 10px;color:#6b7280;font-size:12px;">Event</td><td style="padding:7px 10px;font-size:13px;font-weight:600;">${eventLabel}</td></tr>
      <tr><td style="padding:7px 10px;color:#6b7280;font-size:12px;">Page</td><td style="padding:7px 10px;font-size:13px;">${pageName}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:7px 10px;color:#6b7280;font-size:12px;">Action</td><td style="padding:7px 10px;font-size:13px;">${action || 'N/A'}</td></tr>
      <tr><td style="padding:7px 10px;color:#6b7280;font-size:12px;">User</td><td style="padding:7px 10px;font-size:13px;">${userEmail || 'Anonymous'}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:7px 10px;color:#6b7280;font-size:12px;">Time</td><td style="padding:7px 10px;font-size:13px;">${timestamp} ET</td></tr>
      ${metaRows}
    </table>
  </div>
</div>`;

    // Send via Gmail connector (rned@medrevolve.com)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const emailLines = [
      `From: MedRevolve Activity Monitor <rned@medrevolve.com>`,
      `To: ${adminEmail}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
    ];
    const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    const gmailResult = await res.json();
    if (!res.ok) {
      console.error('Gmail send error:', JSON.stringify(gmailResult));
      return Response.json({ success: false, error: gmailResult.error?.message }, { status: 500 });
    }

    console.log(`✅ Activity notification sent [${eventType}] to ${adminEmail}`);
    return Response.json({ success: true, notified: true, messageId: gmailResult.id });
  } catch (error) {
    console.error('sendActivityNotification error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});