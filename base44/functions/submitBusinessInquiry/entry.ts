import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';

async function sendEmail(base44, { to, subject, html }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const emailLines = [
    `From: MedRevolve <rned@medrevolve.com>`,
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
  const result = await res.json();
  if (!res.ok) { console.error('Gmail error:', JSON.stringify(result)); throw new Error(result.error?.message || 'Gmail send failed'); }
  console.log('✅ Gmail sent to:', to);
}

async function createCalendarMeeting(base44, { summary, description, attendeeEmail }) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    // Schedule meeting 24 hours from now, 30-minute slot
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60000);
    const event = {
      summary,
      description,
      start: { dateTime: start.toISOString(), timeZone: 'America/New_York' },
      end: { dateTime: end.toISOString(), timeZone: 'America/New_York' },
      attendees: [
        { email: ADMIN_EMAIL },
        ...(attendeeEmail ? [{ email: attendeeEmail }] : []),
      ],
      conferenceData: {
        createRequest: {
          requestId: `mr-inquiry-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 60 }, { method: 'popup', minutes: 15 }] },
    };
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(event) }
    );
    const result = await res.json();
    if (!res.ok) { console.error('Calendar error:', result); return null; }
    const meetLink = result.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null;
    console.log('✅ Calendar meeting created:', meetLink);
    return { meetLink, calLink: result.htmlLink, eventId: result.id };
  } catch (e) {
    console.error('Calendar creation failed (non-blocking):', e.message);
    return null;
  }
}

async function sendSMS(to, body) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!accountSid || !authToken || !fromPhone || !to) return;
  let normalized = to.replace(/\D/g, '');
  if (normalized.startsWith('1') && normalized.length === 11) normalized = normalized.slice(1);
  const phoneE164 = normalized.length === 10 ? `+1${normalized}` : `+${normalized}`;
  const params = new URLSearchParams({ To: phoneE164, From: fromPhone, Body: body });
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.company_name || !data.contact_name || !data.email || !data.interest_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await base44.asServiceRole.entities.BusinessInquiry.create({
      company_name: data.company_name, contact_name: data.contact_name, email: data.email,
      phone: data.phone || '', industry: data.industry || 'Other', interest_type: data.interest_type,
      company_size: data.company_size || '', message: data.message || '', status: 'new'
    });

    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Auto-create Google Calendar meeting with Meet link
    const calData = await createCalendarMeeting(base44, {
      summary: `B2B Inquiry: ${data.company_name} — ${data.interest_type}`,
      description: `Business inquiry from ${data.contact_name} at ${data.company_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nInterest: ${data.interest_type}\nIndustry: ${data.industry || 'N/A'}\n\nMessage: ${data.message || 'No message'}`,
      attendeeEmail: data.email,
    });

    const meetSection = calData?.meetLink
      ? `<div style="background:#e8f5fd;border:1.5px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin:16px 0;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1d4ed8;">📅 Discovery Call Scheduled</p>
          <p style="margin:0 0 8px;font-size:13px;color:#374151;">A preliminary discovery call has been set up. Join via Google Meet when you're ready to connect:</p>
          <a href="${calData.meetLink}" style="display:inline-block;background:#4285F4;color:#fff;font-size:13px;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;">🎥 Join Google Meet →</a>
        </div>`
      : '';

    // Customer confirmation email
    const bizHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">🏢</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Business</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Inquiry Received</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Inquiry Submitted!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">Our team will reach out within <strong>24 hours</strong>.</div>
    </div>
    ${meetSection}
    <div style="font-size:16px;color:#111827;margin-bottom:8px;">Hi <strong>${data.contact_name}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:16px;">Thank you for your interest in the MedRevolve platform. We're reviewing your inquiry for <strong>${data.company_name}</strong> and will be in touch shortly.</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:16px;">
      <tr><td style="background:#4A6741;padding:10px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">📋 Your Inquiry</span></td></tr>
      <tr><td style="padding:16px;">
        <table width="100%">
          <tr><td width="38%" style="padding:5px 0;font-size:12px;color:#9ca3af;font-weight:600;">Company</td><td style="padding:5px 0;font-size:13px;font-weight:600;">${data.company_name}</td></tr>
          <tr><td style="padding:5px 0;font-size:12px;color:#9ca3af;font-weight:600;">Interest</td><td style="padding:5px 0;font-size:13px;">${data.interest_type}</td></tr>
          <tr><td style="padding:5px 0;font-size:12px;color:#9ca3af;font-weight:600;">Industry</td><td style="padding:5px 0;font-size:13px;">${data.industry || 'Not specified'}</td></tr>
          <tr><td style="padding:5px 0;font-size:12px;color:#9ca3af;font-weight:600;">Ref ID</td><td style="padding:5px 0;font-size:12px;color:#6b7280;">${inquiry.id}</td></tr>
        </table>
      </td></tr>
    </table>
    <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;">⚡ What Happens Next</p>
      <p style="margin:0 0 6px;font-size:13px;color:#374151;">1. Business development team reviews your inquiry</p>
      <p style="margin:0 0 6px;font-size:13px;color:#374151;">2. We prepare a tailored overview for <strong>${data.interest_type}</strong></p>
      <p style="margin:0 0 6px;font-size:13px;color:#374151;">3. Discovery call to understand your specific needs</p>
      <p style="margin:0;font-size:13px;color:#374151;">4. Custom proposal + next steps delivered to you</p>
    </div>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
    <p style="color:#fff;font-size:13px;font-weight:700;margin:0 0 4px;">Raj Nedunuri — President & CEO</p>
    <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">📞 240-387-5224 | ✉️ rned@medrevolve.com</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    // Admin alert with meeting link
    const adminHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🏢 New B2B Inquiry</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">${submittedAt} ET</span></td>
      <td align="right"><span style="background:#0f766e;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">HIGH PRIORITY</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    ${calData?.meetLink ? `<div style="background:#dbeafe;border:1.5px solid #93c5fd;border-radius:10px;padding:14px;margin-bottom:16px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1d4ed8;">📅 Auto-scheduled Discovery Call</p>
      <a href="${calData.meetLink}" style="display:inline-block;background:#4285F4;color:#fff;font-size:13px;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:4px;">Join Google Meet →</a>
      ${calData.calLink ? `<a href="${calData.calLink}" style="display:inline-block;margin-left:8px;font-size:12px;color:#4285F4;text-decoration:none;">View Calendar Event →</a>` : ''}
    </div>` : ''}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">🏢 Company Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Company</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.company_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Contact</td><td style="font-size:13px;padding:4px 0;">${data.contact_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;font-size:13px;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Interest</td><td style="font-size:13px;font-weight:700;color:#111827;padding:4px 0;">${data.interest_type}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Industry</td><td style="font-size:13px;padding:4px 0;">${data.industry || 'Not specified'}</td></tr>
          ${data.message ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;vertical-align:top;">Message</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.message}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <div style="margin-top:12px;">
      <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.interest_type + ' - ' + data.company_name)}" style="display:inline-block;background:#4A6741;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;margin-right:8px;">Reply to ${data.contact_name} →</a>
      <a href="https://medrevolve.base44.app/AdminDashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Admin Dashboard →</a>
    </div>
    <div style="margin-top:10px;font-size:11px;color:#94a3b8;">Ref: ${inquiry.id} · ${submittedAt} ET</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.allSettled([
      sendEmail(base44, { to: data.email, subject: `✅ Inquiry Received — MedRevolve will connect with ${data.company_name} within 24 hours`, html: bizHtml }),
      sendEmail(base44, { to: ADMIN_EMAIL, subject: `🏢 [B2B Inquiry] ${data.company_name} — ${data.interest_type}`, html: adminHtml }),
      base44.asServiceRole.functions.invoke('syncToHubspot', { source: 'business_inquiry', data }).catch(e => console.error('HubSpot sync failed:', e.message)),
    ]);

    if (data.phone) {
      await sendSMS(ADMIN_EMAIL.replace('@', '').replace('.', ''), `[B2B] ${data.company_name} · ${data.contact_name} · ${data.phone} · ${data.interest_type}`).catch(() => {});
    }

    try {
      const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
      if (zapierUrl) {
        await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form_type: 'business_inquiry', name: data.contact_name, email: data.email, phone: data.phone || '', company_name: data.company_name, industry: data.industry || '', interest_type: data.interest_type, message: data.message || '', submitted_at: new Date().toISOString() })
        });
      }
    } catch (e) { console.warn('Zapier error (non-fatal):', e.message); }

    return Response.json({ success: true, inquiry_id: inquiry.id, meet_link: calData?.meetLink || null });

  } catch (error) {
    console.error('submitBusinessInquiry error:', error);
    return Response.json({ error: error.message || 'Failed to submit inquiry' }, { status: 500 });
  }
});