import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';
const ADMIN_PHONE = '5302006352';

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
  const data = await res.json();
  if (!res.ok) { console.error('Gmail error:', JSON.stringify(data)); throw new Error(data.error?.message || 'Gmail send failed'); }
  console.log('✅ Gmail sent to:', to);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.full_name || !data.email || !data.platform || !data.followers_count) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const application = await base44.asServiceRole.entities.CreatorApplication.create({
      full_name: data.full_name, email: data.email, phone: data.phone || '',
      platform: data.platform, platform_handle: data.platform_handle || '',
      followers_count: data.followers_count, audience_niche: data.audience_niche || '',
      why_partner: data.why_partner || '', status: 'pending'
    });

    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const firstName = data.full_name.split(' ')[0];

    // Creator confirmation email
    const creatorHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">🎯</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Creator Program</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Application Received</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Application Submitted!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">Review within <strong>24–48 hours</strong>.</div>
    </div>
    <div style="font-size:17px;color:#111827;margin-bottom:8px;">Hi <strong>${firstName}</strong> 🎉</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:16px;">
      <tr><td style="background:#4A6741;padding:10px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">📋 Your Application</span></td></tr>
      <tr><td style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Platform</td><td style="padding:6px 0;font-size:13px;font-weight:600;">${data.platform}${data.platform_handle ? ' (@' + data.platform_handle + ')' : ''}</td></tr>
          <tr><td style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Followers</td><td style="padding:6px 0;font-size:13px;">${data.followers_count}</td></tr>
          <tr><td style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Niche</td><td style="padding:6px 0;font-size:13px;">${data.audience_niche || 'General Wellness'}</td></tr>
          <tr><td style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Phone</td><td style="padding:6px 0;font-size:13px;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Ref ID</td><td style="padding:6px 0;font-size:12px;color:#6b7280;">${application.id}</td></tr>
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#7c3aed;padding:10px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">🎁 If Approved, You'll Receive</span></td></tr>
      <tr><td style="padding:16px;font-size:13px;color:#4c1d95;line-height:1.8;">
        ✨ Personalized affiliate link & promo code<br/>
        💰 Commission up to <strong>20% per referral</strong><br/>
        🎨 Brand content guidelines & assets<br/>
        📊 Real-time earnings dashboard
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;">🌿 MedRevolve Creator Team</div>
    <div style="color:rgba(255,255,255,0.3);font-size:11px;margin-top:4px;">rned@medrevolve.com · medrevolve.com</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    // Admin notification
    const adminHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Creator Application — ${submittedAt} ET</span></td>
      <td align="right"><span style="background:#d97706;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">🎯 CREATOR</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">👤 Creator Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;font-weight:600;padding:4px 0;">${data.full_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Platform</td><td style="font-size:13px;font-weight:600;padding:4px 0;">${data.platform}${data.platform_handle ? ' (@' + data.platform_handle + ')' : ''}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Followers</td><td style="font-size:13px;font-weight:700;padding:4px 0;">${data.followers_count}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Niche</td><td style="font-size:13px;padding:4px 0;">${data.audience_niche || 'Not specified'}</td></tr>
          ${data.why_partner ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;vertical-align:top;">Why Partner</td><td style="font-size:13px;padding:4px 0;line-height:1.5;">${data.why_partner}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <div style="margin-top:12px;">
      <a href="mailto:${data.email}" style="display:inline-block;background:#d97706;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;margin-right:8px;">Reply to Creator →</a>
      <a href="https://medrevolve.base44.app/AdminDashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Admin Dashboard →</a>
    </div>
    <div style="margin-top:12px;font-size:11px;color:#94a3b8;">Ref: ${application.id} · ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Sent from rned@medrevolve.com — MedRevolve</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.allSettled([
      sendEmail(base44, { to: data.email, subject: `✅ Application Received — MedRevolve Creator Program`, html: creatorHtml }),
      sendEmail(base44, { to: ADMIN_EMAIL, subject: `🎯 New Creator Application — ${data.full_name} [${data.platform}, ${data.followers_count} followers]`, html: adminHtml }),
      base44.asServiceRole.functions.invoke('driveUploadIntakeForm', { form_type: 'creator', data, submitter_name: data.full_name, submitter_email: data.email })
        .catch(e => console.error('Drive upload failed:', e.message)),
    ]);

    // SMS alert
    await sendSMS(ADMIN_PHONE, `CREATOR APP: ${data.full_name} | ${data.platform} | ${data.followers_count} followers | ${data.email} | ${data.phone || 'no phone'}`);

    // Zapier webhook (non-blocking)
    let zapierStatus = 'pending', zapierError = null;
    const zapierSentAt = new Date().toISOString();
    try {
      const zr = await fetch('https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.full_name, email: data.email, phone: data.phone || '', platform: data.platform, followers_count: data.followers_count, audience_niche: data.audience_niche || '', message: data.why_partner || '', form_type: 'creator_application' })
      });
      zapierStatus = zr.ok ? 'success' : 'failed';
      if (!zr.ok) zapierError = `HTTP ${zr.status}`;
    } catch (e) {
      zapierStatus = 'failed'; zapierError = e.message;
      console.warn('Zapier webhook error (non-fatal):', e.message);
    }

    await base44.asServiceRole.entities.CreatorApplication.update(application.id, { zapier_status: zapierStatus, zapier_error: zapierError, zapier_sent_at: zapierSentAt });

    return Response.json({ success: true, application_id: application.id, zapier_status: zapierStatus });

  } catch (error) {
    console.error('submitCreatorApplication error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});