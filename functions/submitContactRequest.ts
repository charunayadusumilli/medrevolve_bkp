import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function sendSMS(to, body) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!accountSid || !authToken || !fromPhone || !to) return;
  let normalized = to.replace(/\D/g, '');
  if (normalized.startsWith('1') && normalized.length === 11) normalized = normalized.slice(1);
  const phoneE164 = normalized.length === 10 ? `+1${normalized}` : `+${normalized}`;
  const params = new URLSearchParams({ To: phoneE164, From: fromPhone, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  if (!res.ok) console.error('SMS error:', await res.text());
  else console.log('✅ SMS sent to:', phoneE164);
}

async function sendEmail(base44, { to, subject, html }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const emailLines = [
    `From: MedRevolve <noreply@medrevolve.com>`,
    `To: ${to}`,
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
  const data = await res.json();
  if (!res.ok) { console.error('Gmail error:', JSON.stringify(data)); throw new Error(data.error?.message || 'Gmail send failed'); }
  console.log('✅ Gmail sent to:', to);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.name || !data.email || !data.message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const contactRequest = await base44.asServiceRole.entities.ContactRequest.create({
      name: data.name, email: data.email,
      subject: data.subject || '', message: data.message, status: 'new'
    });

    const adminEmail = 'krish@medrevolve.com';
    const adminEmail2 = 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const firstName = data.name.split(' ')[0];

    // Patient confirmation
    const patientHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">🌿</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Support</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">We received your message</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Message Received!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;line-height:1.5;">Our support team will respond within <strong>24 hours</strong>.</div>
    </div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${firstName}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">Thanks for reaching out! Here's a copy of your message:</div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📬 Your Message</span></td></tr>
      <tr><td style="padding:18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Subject</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:600;">${data.subject || 'General Inquiry'}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Ref ID</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">${contactRequest.id}</td></tr>
          <tr><td colspan="2" style="padding:12px 0 0;font-size:13px;color:#374151;line-height:1.7;">${data.message.replace(/\n/g, '<br/>')}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">💡 While You Wait</span></td></tr>
      <tr><td style="padding:16px 18px;">
        <div style="font-size:13px;color:#374151;margin-bottom:12px;">Explore our resources — you might find your answer right away:</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;"><a href="https://medrevolve.com/consultations" style="color:#4A6741;text-decoration:none;font-size:13px;font-weight:600;">📅 Book a Consultation →</a></td></tr>
          <tr><td style="padding:4px 0;"><a href="https://medrevolve.com/products" style="color:#4A6741;text-decoration:none;font-size:13px;font-weight:600;">💊 Browse Treatments →</a></td></tr>
          <tr><td style="padding:4px 0;"><a href="https://medrevolve.com/how-it-works" style="color:#4A6741;text-decoration:none;font-size:13px;font-weight:600;">❓ How It Works →</a></td></tr>
          <tr><td style="padding:4px 0;"><a href="https://medrevolve.com/patient-portal" style="color:#4A6741;text-decoration:none;font-size:13px;font-weight:600;">🏥 Patient Portal →</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:6px;">🌿 MedRevolve Support</div>
    <div style="color:rgba(255,255,255,0.4);font-size:11px;">📧 support@medrevolve.com &nbsp;|&nbsp; medrevolve.com</div>
    <div style="color:rgba(255,255,255,0.2);font-size:11px;margin-top:8px;">© 2024 MedRevolve. All rights reserved.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    // Admin notification
    const adminHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Contact Message</span></td>
      <td align="right"><span style="background:#3b82f6;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">📬 CONTACT</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 From</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="30%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Subject</td><td style="font-size:13px;color:#374151;font-weight:600;padding:4px 0;">${data.subject || 'No subject'}</td></tr>
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">💬 Message</span></td></tr>
      <tr><td style="padding:16px;font-size:13px;color:#374151;line-height:1.7;">${data.message.replace(/\n/g, '<br/>')}</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#2563eb;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Action Required</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#1e40af;">☐ &nbsp;Reply to <a href="mailto:${data.email}" style="color:#1d4ed8;font-weight:700;">${data.email}</a> within 24 hours</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#1e40af;">☐ &nbsp;Mark request as In Progress in Admin Dashboard</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#1e40af;">☐ &nbsp;Mark as Resolved once complete</td></tr>
        </table>
        <div style="margin-top:12px;">
          <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
          &nbsp;
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your MedRevolve Inquiry')}" style="display:inline-block;background:#3b82f6;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Reply to ${firstName} →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${contactRequest.id} &nbsp;·&nbsp; ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.all([
      sendEmail(base44, { to: data.email, subject: `✅ We got your message, ${firstName}! We'll respond within 24 hours`, html: patientHtml }),
      sendEmail(base44, { to: adminEmail, subject: `📬 New Contact Message — "${data.subject || 'No Subject'}" from ${data.name}`, html: adminHtml }),
      sendEmail(base44, { to: adminEmail2, subject: `📬 New Contact Message — "${data.subject || 'No Subject'}" from ${data.name}`, html: adminHtml }),
      base44.asServiceRole.functions.invoke('syncToHubspot', { source: 'contact_request', data })
        .catch(e => console.error('HubSpot sync failed (non-blocking):', e.message)),
    ]);

    // SMS to admin
    const msgSnippet = data.message.substring(0, 80) + (data.message.length > 80 ? '...' : '');
    await sendSMS('5302006352', `CONTACT: ${data.name} | ${data.email} | ${data.subject || 'No subject'} | ${msgSnippet}`);

    return Response.json({ success: true, request_id: contactRequest.id, message: 'Contact request submitted successfully' });

  } catch (error) {
    console.error('Error submitting contact request:', error);
    return Response.json({ error: error.message || 'Failed to submit contact request' }, { status: 500 });
  }
});