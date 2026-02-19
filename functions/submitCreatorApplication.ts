import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, html }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `${from_name} <noreply@medrevolve.com>`, to: [to], subject, html })
  });
  if (!res.ok) console.error('Resend error:', await res.text());
  else console.log('✅ Email sent to:', to);
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

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const firstName = data.full_name.split(' ')[0];

    // Creator confirmation email
    const creatorHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">🎯</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Creator Program</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Application Received</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Application Submitted!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;line-height:1.5;">Our creator team will review your application within <strong>24–48 hours</strong>.</div>
    </div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${firstName}</strong> 🎉</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">We love your passion for wellness! Here's a summary of your application:</div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Your Application</span></td></tr>
      <tr><td style="padding:18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Platform</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:600;">${data.platform}${data.platform_handle ? ' (@' + data.platform_handle + ')' : ''}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Followers</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.followers_count}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Niche</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.audience_niche || 'General Wellness'}</td></tr>
          <tr><td style="padding:7px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td><td style="padding:7px 0;font-size:13px;color:#6b7280;">${application.id}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#7c3aed;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🎁 If Approved, You'll Receive</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:5px 0;font-size:13px;color:#4c1d95;">✨ &nbsp;Personalized affiliate link & promo code</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#4c1d95;">💰 &nbsp;Commission structure (up to <strong>20% per referral</strong>)</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#4c1d95;">🎨 &nbsp;Brand content guidelines & assets</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#4c1d95;">📊 &nbsp;Real-time earnings dashboard</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#4c1d95;">🤝 &nbsp;Dedicated creator support contact</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ What Happens Next</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">1</td><td style="padding-left:12px;font-size:13px;color:#374151;">Creator team reviews your profile & audience fit <strong>(24–48 hours)</strong></td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">2</td><td style="padding-left:12px;font-size:13px;color:#374151;">We assess engagement rate & content-wellness alignment</td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">3</td><td style="padding-left:12px;font-size:13px;color:#374151;">If approved: welcome email with your <strong>affiliate link + commission details</strong></td></tr></table></td></tr>
        </table>
        <div style="margin-top:16px;">
          <a href="https://medrevolve.com/for-creators" style="display:inline-block;background:#4A6741;color:#fff;font-size:13px;font-weight:700;padding:11px 22px;border-radius:9px;text-decoration:none;">Learn About the Program →</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📞 Questions?</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📧 <a href="mailto:creators@medrevolve.com" style="color:#4A6741;font-weight:600;text-decoration:none;">creators@medrevolve.com</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">🌐 <a href="https://medrevolve.com/for-creators" style="color:#4A6741;font-weight:600;text-decoration:none;">medrevolve.com/for-creators</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:6px;">🌿 MedRevolve Creator Team</div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;">© 2024 MedRevolve. All rights reserved.</div>
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
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Creator Application</span></td>
      <td align="right"><span style="background:#d97706;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">🎯 CREATOR</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Creator Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.full_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Platform</td><td style="font-size:13px;color:#374151;font-weight:600;padding:4px 0;">${data.platform}${data.platform_handle ? ' (@' + data.platform_handle + ')' : ''}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Followers</td><td style="font-size:13px;color:#111827;font-weight:700;padding:4px 0;">${data.followers_count}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Niche</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.audience_niche || 'Not specified'}</td></tr>
          ${data.why_partner ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;vertical-align:top;">Why Partner</td><td style="font-size:13px;color:#374151;padding:4px 0;line-height:1.5;">${data.why_partner}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#d97706;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Review Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">☐ &nbsp;Review profile & audience alignment</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">☐ &nbsp;Check engagement rate on their profile</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">☐ &nbsp;Assess content quality and compliance fit</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">☐ &nbsp;Approve or reject in Admin Dashboard</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">☐ &nbsp;If approved: send welcome + commission + affiliate link</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">☐ &nbsp;Respond within <strong>24–48 hours</strong></td></tr>
        </table>
        <div style="margin-top:12px;">
          <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${application.id} &nbsp;·&nbsp; ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.all([
      sendEmail({ from_name: 'MedRevolve Creator Program', to: data.email, subject: `✅ Application Received — MedRevolve Creator Program`, html: creatorHtml }),
      sendEmail({ from_name: 'MedRevolve Platform', to: adminEmail, subject: `🎯 New Creator Application — ${data.full_name} [${data.platform}, ${data.followers_count} followers]`, html: adminHtml })
    ]);

    // Zapier webhook (non-blocking)
    let zapierStatus = 'pending';
    let zapierError = null;
    const zapierSentAt = new Date().toISOString();
    try {
      const webhookResponse = await fetch('https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.full_name, email: data.email, phone: data.phone || '', platform: data.platform, followers_count: data.followers_count, audience_niche: data.audience_niche || '', message: data.why_partner || '', form_type: 'creator_application' })
      });
      zapierStatus = webhookResponse.ok ? 'success' : 'failed';
      if (!webhookResponse.ok) zapierError = `HTTP ${webhookResponse.status}`;
    } catch (e) {
      zapierStatus = 'failed'; zapierError = e.message;
      console.warn('Zapier webhook error (non-fatal):', e.message);
    }

    await base44.asServiceRole.entities.CreatorApplication.update(application.id, { zapier_status: zapierStatus, zapier_error: zapierError, zapier_sent_at: zapierSentAt });

    return Response.json({ success: true, application_id: application.id, message: 'Application submitted successfully', zapier_status: zapierStatus });

  } catch (error) {
    console.error('Error submitting creator application:', error);
    return Response.json({ error: error.message || 'Failed to submit application' }, { status: 500 });
  }
});