import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, html }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${from_name} <noreply@medrevolve.com>`,
      to: [to],
      subject,
      html
    })
  });
  if (!res.ok) {
    console.error('Resend error:', await res.text());
  } else {
    console.log('✅ Email sent via Resend to:', to);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.email || !data.full_name) {
      return Response.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const firstName = data.full_name.split(' ')[0];
    const completedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Patient welcome email (rich HTML) ──────────────────────────────
    const patientHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:32px;margin-bottom:8px;">🌿</div>
    <div style="color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Welcome to MedRevolve</div>
    <div style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:4px;">Your onboarding is complete</div>
  </td></tr>

  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:16px;font-weight:700;">✅ Onboarding Complete!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:5px;line-height:1.5;">Your patient profile is all set. You're ready to start your wellness journey with MedRevolve.</div>
    </div>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${firstName}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">Thank you for completing your profile. Here's what you can do next:</div>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ Get Started</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:6px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;line-height:28px;vertical-align:middle;">1</td>
              <td style="padding-left:12px;font-size:13px;color:#374151;">Browse available <strong>telehealth programs</strong> tailored to your goals</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:6px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;line-height:28px;vertical-align:middle;">2</td>
              <td style="padding-left:12px;font-size:13px;color:#374151;">Schedule a <strong>consultation</strong> with a licensed provider</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:6px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;line-height:28px;vertical-align:middle;">3</td>
              <td style="padding-left:12px;font-size:13px;color:#374151;">Get your personalized treatment plan and <strong>medications delivered</strong></td>
            </tr></table>
          </td></tr>
        </table>
        <div style="margin-top:18px;">
          <a href="https://medrevolve.base44.app" style="display:inline-block;background:#4A6741;color:#fff;font-size:14px;font-weight:700;padding:12px 24px;border-radius:9px;text-decoration:none;margin-right:10px;">Go to Patient Portal →</a>
          <a href="https://medrevolve.com/products" style="display:inline-block;background:#ffffff;color:#374151;font-size:14px;font-weight:600;padding:12px 24px;border-radius:9px;text-decoration:none;border:1px solid #d1d5db;">Browse Treatments</a>
        </div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📞 Questions?</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📧 <a href="mailto:support@medrevolve.com" style="color:#4A6741;text-decoration:none;font-weight:600;">support@medrevolve.com</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">🌐 <a href="https://medrevolve.com/patient-portal" style="color:#4A6741;text-decoration:none;font-weight:600;">medrevolve.com/patient-portal</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:14px;font-weight:700;margin-bottom:8px;">🌿 MedRevolve</div>
    <div style="margin-bottom:10px;">
      <a href="https://medrevolve.com/patient-portal" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 6px;">Patient Portal</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="https://medrevolve.com/products" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 6px;">Treatments</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="https://medrevolve.com/privacy" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 6px;">Privacy</a>
    </div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;">© 2024 MedRevolve. All rights reserved.</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // ── Admin notification (rich HTML) ──────────────────────────────────
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">Patient Onboarding Complete</span></td>
      <td align="right"><span style="background:#16a34a;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">✅ ONBOARDED</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Patient Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.full_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">State</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.state || 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Completed</td><td style="font-size:13px;color:#374151;padding:4px 0;">${completedAt} ET</td></tr>
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#16a34a;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Action Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Review patient profile in Admin Dashboard</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Verify uploaded documents (ID, insurance)</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Match with appropriate licensed provider</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Send consultation scheduling link</td></tr>
        </table>
        <div style="margin-top:14px;">
          <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Completed: ${completedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    // Send both emails — isolated try/catch so one failure doesn't block the other
    try {
      await sendEmail({
        from_name: 'MedRevolve Wellness Team',
        to: data.email,
        subject: `✅ Welcome to MedRevolve, ${firstName}! Your profile is ready`,
        html: patientHtml
      });
    } catch (err) {
      console.error('Failed to send patient onboarding email:', err);
    }

    try {
      await sendEmail({
        from_name: 'MedRevolve Platform',
        to: adminEmail,
        subject: `✅ Patient Onboarded — ${data.full_name}`,
        html: adminHtml
      });
    } catch (err) {
      console.error('Failed to send admin onboarding notification:', err);
    }

    return Response.json({
      success: true,
      message: 'Onboarding notification emails sent'
    });

  } catch (error) {
    console.error('Error in notifyOnboardingComplete:', error);
    return Response.json({ error: error.message || 'Failed to send onboarding notifications' }, { status: 500 });
  }
});
