import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    if (!data.full_name || !data.email || !data.title || !data.specialty || !data.license_number) {
      return Response.json({ error: 'Full name, email, title, specialty, and license number are required' }, { status: 400 });
    }

    const providerIntake = await base44.asServiceRole.entities.ProviderIntake.create({ ...data, status: 'pending' });
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const firstName = data.full_name.split(' ')[0];

    // Provider confirmation email
    const providerHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">👨‍⚕️</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Provider Program</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Application Received</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Application Submitted Successfully</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;line-height:1.5;">Our credentialing team will review your application within <strong>2–3 business days</strong>.</div>
    </div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Dear <strong>${data.full_name}, ${data.title}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">Thank you for your interest in joining MedRevolve as a licensed provider. Here's your application summary:</div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Application Summary</span></td></tr>
      <tr><td style="padding:18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Specialty</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:600;">${data.specialty}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">License #</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.license_number}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Practice Type</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.practice_type || 'Not specified'}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">States Licensed</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.states_licensed?.join(', ') || 'Not provided'}</td></tr>
          <tr><td style="padding:7px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td><td style="padding:7px 0;font-size:13px;color:#6b7280;">${providerIntake.id}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ What Happens Next</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">1</td><td style="padding-left:12px;font-size:13px;color:#374151;">Credentialing team reviews your application <strong>(2–3 business days)</strong></td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">2</td><td style="padding-left:12px;font-size:13px;color:#374151;">License verified with state medical board & NPI registry</td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">3</td><td style="padding-left:12px;font-size:13px;color:#374151;">We schedule a credentialing call with you</td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">4</td><td style="padding-left:12px;font-size:13px;color:#374151;">Upon approval, you receive your <strong>onboarding package + contract</strong></td></tr></table></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📞 Questions?</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📧 <a href="mailto:providers@medrevolve.com" style="color:#4A6741;font-weight:600;text-decoration:none;">providers@medrevolve.com</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">🌐 <a href="https://medrevolve.com" style="color:#4A6741;font-weight:600;text-decoration:none;">medrevolve.com</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:6px;">🌿 MedRevolve Provider Relations</div>
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
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Provider Application</span></td>
      <td align="right"><span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">👨‍⚕️ PROVIDER</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Provider Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.full_name}, ${data.title}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Specialty</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.specialty}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;text-decoration:none;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">License #</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.license_number}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">States Licensed</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.states_licensed?.join(', ') || 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Exp. Years</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.years_experience || 'Not specified'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Practice Type</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.practice_type || 'Not specified'}</td></tr>
          ${data.bio ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;vertical-align:top;">Bio</td><td style="font-size:13px;color:#374151;padding:4px 0;line-height:1.5;">${data.bio}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#7c3aed;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Credentialing Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#4c1d95;">☐ &nbsp;Verify license with state medical board</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#4c1d95;">☐ &nbsp;Check NPI registry</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#4c1d95;">☐ &nbsp;Schedule credentialing call</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#4c1d95;">☐ &nbsp;Review malpractice insurance</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#4c1d95;">☐ &nbsp;Send contract & onboarding if approved</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#4c1d95;">☐ &nbsp;Respond within <strong>2–3 business days</strong></td></tr>
        </table>
        <div style="margin-top:12px;">
          <a href="https://medrevolve.com/provider-contracts" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Provider Contracts →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${providerIntake.id} &nbsp;·&nbsp; ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.all([
      sendEmail({ from_name: 'MedRevolve Provider Relations', to: data.email, subject: `✅ Application Received — MedRevolve Provider Program`, html: providerHtml }),
      sendEmail({ from_name: 'MedRevolve Platform', to: adminEmail, subject: `👨‍⚕️ New Provider Application — ${data.full_name}, ${data.title} [${data.specialty}]`, html: adminHtml })
    ]);

    // SMS to admin
    await sendSMS('5302006352', `PROVIDER APP: ${data.full_name}, ${data.title} | ${data.specialty} | ${data.email} | ${data.phone || 'N/A'}`);

    return Response.json({ success: true, intake_id: providerIntake.id, message: 'Provider application submitted successfully' });

  } catch (error) {
    console.error('Error submitting provider intake:', error);
    return Response.json({ error: error.message || 'Failed to submit provider application' }, { status: 500 });
  }
});