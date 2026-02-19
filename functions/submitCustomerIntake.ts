import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, html }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  // Until domain is verified, Resend only allows sending to the account owner email
  // Route all emails to ADMIN_EMAIL which should be the Resend account owner email
  const deliverTo = Deno.env.get('ADMIN_EMAIL') || to;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${from_name} <onboarding@resend.dev>`,
      to: [deliverTo],
      subject: `[To: ${to}] ${subject}`,
      html
    })
  });
  if (!res.ok) {
    console.error('Resend error:', await res.text());
  } else {
    console.log('✅ Email sent via Resend to:', to);
  }
}

async function sendSMS(to, body) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!accountSid || !authToken || !fromPhone || !to) return;
  const normalized = to.replace(/\D/g, '');
  const phoneE164 = normalized.startsWith('1') ? `+${normalized}` : `+1${normalized}`;
  const params = new URLSearchParams({ To: phoneE164, From: fromPhone, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  if (!res.ok) {
    console.error('SMS send error:', await res.text());
  } else {
    console.log('✅ SMS sent to:', phoneE164);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.full_name || !data.email || !data.primary_interest) {
      return Response.json({ error: 'Full name, email, and primary interest are required' }, { status: 400 });
    }

    const customerIntake = await base44.asServiceRole.entities.CustomerIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ CustomerIntake record created:', customerIntake.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const firstName = data.full_name.split(' ')[0];
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Patient confirmation email (rich HTML) ──────────────────────────────
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
    <div style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:4px;">Your wellness journey starts here</div>
  </td></tr>

  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:16px;font-weight:700;">✅ Intake Form Received!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:5px;line-height:1.5;">We've received your information and our wellness team is reviewing it now. Expect to hear from us within <strong>24 hours</strong>.</div>
    </div>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${firstName}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">Thank you for taking the first step toward better health. Here's a summary of what you submitted:</div>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Your Intake Summary</span></td></tr>
      <tr><td style="padding:18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="40%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Wellness Interest</td>
            <td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:600;">${data.primary_interest}</td>
          </tr>
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Consultation Pref</td>
            <td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.consultation_preference || 'Flexible'}</td>
          </tr>
          ${data.state ? `<tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">State</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.state}</td></tr>` : ''}
          <tr>
            <td style="padding:7px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td>
            <td style="padding:7px 0;font-size:13px;color:#6b7280;">${customerIntake.id}</td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ What Happens Next</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:6px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;line-height:28px;vertical-align:middle;">1</td>
              <td style="padding-left:12px;font-size:13px;color:#374151;">Our wellness team reviews your information <strong>(within 24 hours)</strong></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:6px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;line-height:28px;vertical-align:middle;">2</td>
              <td style="padding-left:12px;font-size:13px;color:#374151;">We match you with the best licensed provider for your needs</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:6px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="width:28px;height:28px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;line-height:28px;vertical-align:middle;">3</td>
              <td style="padding-left:12px;font-size:13px;color:#374151;">You receive a follow-up email with <strong>provider details + booking link</strong></td>
            </tr></table>
          </td></tr>
        </table>
        <div style="margin-top:18px;">
          <a href="https://medrevolve.com/consultations" style="display:inline-block;background:#4A6741;color:#fff;font-size:14px;font-weight:700;padding:12px 24px;border-radius:9px;text-decoration:none;margin-right:10px;">Book Now →</a>
          <a href="https://medrevolve.com/products" style="display:inline-block;background:#ffffff;color:#374151;font-size:14px;font-weight:600;padding:12px 24px;border-radius:9px;text-decoration:none;border:1px solid #d1d5db;">Browse Treatments</a>
        </div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fff;padding:0 40px 28px;">
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

    // ── Admin notification (rich HTML) ──────────────────────────────────────
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Customer Intake</span></td>
      <td align="right"><span style="background:#16a34a;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">🆕 NEW INTAKE</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Customer Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.full_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;text-decoration:none;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">State</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.state || 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Interest</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.primary_interest}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Consult Pref</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.consultation_preference || 'Not specified'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Heard About Us</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.heard_about_us || 'Not specified'}</td></tr>
          ${data.referral_code ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Referral Code</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.referral_code}</td></tr>` : ''}
          ${data.medical_history_notes ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Medical Notes</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.medical_history_notes}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#16a34a;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Action Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Review intake in Admin Dashboard</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Match with appropriate licensed provider</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Send provider match email or schedule consultation</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Follow up within <strong>24 hours</strong></td></tr>
        </table>
        <div style="margin-top:14px;">
          <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${customerIntake.id} &nbsp;·&nbsp; Submitted: ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    await sendEmail({ from_name: 'MedRevolve Wellness Team', to: data.email, subject: `✅ Welcome to MedRevolve, ${firstName}! Here's what happens next`, html: patientHtml });
    await sendEmail({ from_name: 'MedRevolve Platform', to: adminEmail, subject: `🆕 New Customer Intake — ${data.full_name} [${data.primary_interest}]`, html: adminHtml });

    // SMS if phone provided
    if (data.phone) {
      await sendSMS(data.phone, `MedRevolve 🌿 Hi ${firstName}! We received your intake for ${data.primary_interest}. Our team will reach out within 24 hours. Book now: medrevolve.com/consultations`);
    }

    return Response.json({
      success: true,
      intake_id: customerIntake.id,
      message: 'Customer intake completed successfully'
    });

  } catch (error) {
    console.error('Error submitting customer intake:', error);
    return Response.json({ error: error.message || 'Failed to submit customer intake' }, { status: 500 });
  }
});