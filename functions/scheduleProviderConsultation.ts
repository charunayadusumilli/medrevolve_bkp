import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

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
  if (!res.ok) throw new Error(data.error?.message || 'Gmail send failed');
  console.log('✅ Email sent to:', to);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, provider_name } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate consultation meeting link
    const consultationId = crypto.randomUUID();
    const meetingLink = `https://medrevolve.com/provider-consultation/${consultationId}`;
    
    // Schedule in the next 2-3 business days
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 2);
    const timeSlots = ['10:00 AM', '2:00 PM', '4:00 PM'];
    const selectedTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];

    // Create consultation record
    const consultation = await base44.asServiceRole.entities.ProviderConsultation.create({
      provider_email: email,
      provider_name: provider_name || 'Provider',
      scheduled_date: scheduledDate.toISOString().split('T')[0],
      scheduled_time: selectedTime,
      status: 'scheduled',
      meeting_link: meetingLink,
      consultation_type: 'initial_credentialing',
    });

    // Send confirmation email to provider
    const providerHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="color:#fff;font-size:28px;font-weight:800;">🎥 Your Consultation is Scheduled!</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Meeting Confirmed</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">Your credentialing consultation is all set!</div>
    </div>

    <div style="font-size:15px;color:#111827;margin-bottom:6px;font-weight:600;">📅 Meeting Details:</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;overflow:hidden;">
      <tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
        <span style="font-size:12px;color:#94a3b8;font-weight:600;">DATE</span><br/>
        <span style="font-size:14px;color:#111827;font-weight:600;">${scheduledDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </td></tr>
      <tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
        <span style="font-size:12px;color:#94a3b8;font-weight:600;">TIME</span><br/>
        <span style="font-size:14px;color:#111827;font-weight:600;">${selectedTime} EST</span>
      </td></tr>
      <tr><td style="padding:12px 16px;">
        <span style="font-size:12px;color:#94a3b8;font-weight:600;">DURATION</span><br/>
        <span style="font-size:14px;color:#111827;font-weight:600;">20-30 minutes</span>
      </td></tr>
    </table>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:20px;">
      <div style="font-size:13px;color:#374151;font-weight:600;margin-bottom:10px;">📋 What to Expect:</div>
      <ul style="margin:0;padding:0;list-style:none;font-size:13px;color:#6b7280;line-height:1.6;">
        <li style="padding:4px 0;">• Discussion of your credentials and experience</li>
        <li style="padding:4px 0;">• Overview of MedRevolve platform and processes</li>
        <li style="padding:4px 0;">• Q&A about provider requirements and compensation</li>
        <li style="padding:4px 0;">• Next steps upon approval</li>
      </ul>
    </div>

    <a href="${meetingLink}" style="display:inline-block;background:#4A6741;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:20px;">
      Join Video Call →
    </a>

    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
      <div style="color:#92400e;font-size:13px;">
        <strong>Tip:</strong> Join 5 minutes early. Make sure your camera and microphone are working!
      </div>
    </div>

    <div style="border-top:1px solid #e5e7eb;padding-top:20px;font-size:12px;color:#6b7280;">
      <strong>Can't make this time?</strong><br/>
      Reply to this email and we'll reschedule for a time that works better for you.
    </div>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;">🌿 MedRevolve Provider Relations</div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:6px;">© 2026 MedRevolve. All rights reserved.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    // Send notification to admin
    const adminHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <div style="color:#fff;font-size:17px;font-weight:700;">🎥 Provider Consultation Scheduled</div>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Provider</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${provider_name || 'N/A'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${email}" style="color:#4A6741;text-decoration:none;">${email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Scheduled Date</td><td style="font-size:13px;color:#111827;padding:4px 0;">${scheduledDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Scheduled Time</td><td style="font-size:13px;color:#111827;padding:4px 0;">${selectedTime} EST</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Meeting Link</td><td style="font-size:13px;color:#4A6741;padding:4px 0;"><a href="${meetingLink}" style="text-decoration:none;">${meetingLink}</a></td></tr>
        </table>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${consultation.id}</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'krish@medrevolve.com';

    await Promise.all([
      sendEmail(base44, { 
        to: email, 
        subject: `🎥 Your MedRevolve Credentialing Consultation is Scheduled`,
        html: providerHtml 
      }),
      sendEmail(base44, { 
        to: adminEmail, 
        subject: `🎥 Provider Consultation Scheduled - ${provider_name || 'N/A'}`,
        html: adminHtml 
      }),
    ]);

    return Response.json({ 
      success: true, 
      consultation_id: consultation.id,
      meeting_link: meetingLink,
      scheduled_date: scheduledDate.toISOString().split('T')[0],
      scheduled_time: selectedTime,
    });

  } catch (error) {
    console.error('Error scheduling consultation:', error);
    return Response.json({ error: error.message || 'Failed to schedule consultation' }, { status: 500 });
  }
});