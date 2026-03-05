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

async function getZohoAccessToken() {
  const clientId = Deno.env.get("ZOHO_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_REFRESH_TOKEN");
  const response = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ refresh_token: refreshToken, client_id: clientId, client_secret: clientSecret, grant_type: "refresh_token" })
  });
  const data = await response.json();
  return data.access_token;
}

async function sendEmail({ to, from_name, subject, html }) {
  const token = await getZohoAccessToken();
  const res = await fetch('https://mail.zoho.com/api/accounts/2234922000000008002/messages', {
    method: 'POST',
    headers: { 'Authorization': `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromAddress: 'charunya.adusumilli@hanu-consulting.com', toAddress: to, subject, content: html, mailFormat: 'html' })
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Zoho Mail error:', errText);
    throw new Error(`Zoho Mail failed: ${errText}`);
  } else {
    console.log('✅ Email sent via Zoho Mail to:', to);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.pharmacy_name || !data.contact_name || !data.email || !data.license_number || !data.pharmacy_type) {
      return Response.json({ error: 'Pharmacy name, contact name, email, license number, and pharmacy type are required' }, { status: 400 });
    }

    const pharmacyIntake = await base44.asServiceRole.entities.PharmacyIntake.create({ ...data, status: 'pending' });
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Pharmacy confirmation email
    const pharmacyHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">💊</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Pharmacy Partners</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Partnership Application Received</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Application Submitted Successfully</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;line-height:1.5;">Our partnerships team will review your application within <strong>3–5 business days</strong>.</div>
    </div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Dear <strong>${data.contact_name}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">Thank you for <strong>${data.pharmacy_name}</strong>'s interest in partnering with MedRevolve! Here's your application summary:</div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Application Summary</span></td></tr>
      <tr><td style="padding:18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Pharmacy</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:600;">${data.pharmacy_name}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Type</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.pharmacy_type}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">License #</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.license_number}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Shipping</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.shipping_capabilities || 'Not specified'}</td></tr>
          <tr><td style="padding:7px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td><td style="padding:7px 0;font-size:13px;color:#6b7280;">${pharmacyIntake.id}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ What Happens Next</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">1</td><td style="padding-left:12px;font-size:13px;color:#374151;">Partnerships team reviews your application <strong>(3–5 business days)</strong></td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">2</td><td style="padding-left:12px;font-size:13px;color:#374151;">License and accreditation verification</td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">3</td><td style="padding-left:12px;font-size:13px;color:#374151;">Introductory call to discuss integration details</td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">4</td><td style="padding-left:12px;font-size:13px;color:#374151;">Upon approval: <strong>partnership contract + onboarding guide</strong></td></tr></table></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📞 Questions?</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📧 <a href="mailto:pharmacy@medrevolve.com" style="color:#4A6741;font-weight:600;text-decoration:none;">pharmacy@medrevolve.com</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">🌐 <a href="https://medrevolve.com" style="color:#4A6741;font-weight:600;text-decoration:none;">medrevolve.com</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:6px;">🌿 MedRevolve Pharmacy Partnerships</div>
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
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Pharmacy Application</span></td>
      <td align="right"><span style="background:#0891b2;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">💊 PHARMACY</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">💊 Pharmacy Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Pharmacy</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.pharmacy_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Contact</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.contact_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;text-decoration:none;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">License #</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.license_number}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">NPI</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.npi_number || 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Type</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.pharmacy_type}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Shipping</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.shipping_capabilities || 'Not specified'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Location</td><td style="font-size:13px;color:#374151;padding:4px 0;">${[data.city, data.state].filter(Boolean).join(', ') || 'Not provided'}</td></tr>
          ${data.partnership_interest ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;vertical-align:top;">Why Partner</td><td style="font-size:13px;color:#374151;padding:4px 0;line-height:1.5;">${data.partnership_interest}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#0891b2;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Review Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#164e63;">☐ &nbsp;Verify pharmacy license with state board</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#164e63;">☐ &nbsp;Confirm NPI in registry</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#164e63;">☐ &nbsp;Review compounding capabilities</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#164e63;">☐ &nbsp;Check shipping coverage for patient base</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#164e63;">☐ &nbsp;Schedule intro call</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#164e63;">☐ &nbsp;Respond within <strong>3–5 business days</strong></td></tr>
        </table>
        <div style="margin-top:12px;">
          <a href="https://medrevolve.com/pharmacy-contracts" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Pharmacy Contracts →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${pharmacyIntake.id} &nbsp;·&nbsp; ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.all([
      sendEmail({ from_name: 'MedRevolve Pharmacy Partnerships', to: data.email, subject: `✅ Partnership Application Received — MedRevolve`, html: pharmacyHtml }),
      sendEmail({ from_name: 'MedRevolve Platform', to: adminEmail, subject: `💊 New Pharmacy Application — ${data.pharmacy_name} [${data.pharmacy_type}]`, html: adminHtml }),
      base44.asServiceRole.functions.invoke('driveUploadIntakeForm', {
        form_type: 'pharmacy',
        data,
        submitter_name: data.pharmacy_name,
        submitter_email: data.email,
      }).catch(e => console.error('Drive upload failed (non-blocking):', e.message)),
    ]);

    // SMS to admin
    await sendSMS('5302006352', `PHARMACY APP: ${data.pharmacy_name} | ${data.contact_name} | ${data.email} | ${data.phone || 'N/A'} | ${data.pharmacy_type}`);

    return Response.json({ success: true, intake_id: pharmacyIntake.id, message: 'Pharmacy application submitted successfully' });

  } catch (error) {
    console.error('Error submitting pharmacy intake:', error);
    return Response.json({ error: error.message || 'Failed to submit pharmacy application' }, { status: 500 });
  }
});