import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    if (!data.company_name || !data.contact_name || !data.email || !data.interest_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await base44.asServiceRole.entities.BusinessInquiry.create({
      company_name: data.company_name, contact_name: data.contact_name, email: data.email,
      phone: data.phone || '', industry: data.industry || 'Other', interest_type: data.interest_type,
      company_size: data.company_size || '', message: data.message || '', status: 'new'
    });

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'krish@medrevolve.com';
    const adminEmail2 = 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Business confirmation email
    const bizHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">🏢</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Business</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Inquiry Received</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Inquiry Submitted Successfully</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;line-height:1.5;">Our business development team will reach out within <strong>1–2 business days</strong>.</div>
    </div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${data.contact_name}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">Thank you for your interest in partnering with MedRevolve! We're excited to explore this opportunity with <strong>${data.company_name}</strong>.</div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Inquiry Summary</span></td></tr>
      <tr><td style="padding:18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="38%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Company</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111827;font-weight:600;">${data.company_name}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Interest</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;font-weight:600;">${data.interest_type}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Industry</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${data.industry || 'Not specified'}</td></tr>
          <tr><td style="padding:7px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td><td style="padding:7px 0;font-size:13px;color:#6b7280;">${inquiry.id}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ What Happens Next</span></td></tr>
      <tr><td style="padding:18px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">1</td><td style="padding-left:12px;font-size:13px;color:#374151;">Business development team reviews your inquiry <strong>(1–2 business days)</strong></td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">2</td><td style="padding-left:12px;font-size:13px;color:#374151;">We prepare a tailored overview for <strong>${data.interest_type}</strong></td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">3</td><td style="padding-left:12px;font-size:13px;color:#374151;">Discovery call to understand your specific needs</td></tr></table></td></tr>
          <tr><td style="padding:6px 0;"><table cellpadding="0" cellspacing="0"><tr><td style="width:26px;height:26px;background:#4A6741;border-radius:50%;text-align:center;color:#fff;font-size:11px;font-weight:700;line-height:26px;">4</td><td style="padding-left:12px;font-size:13px;color:#374151;">Custom <strong>proposal + next steps</strong> delivered to you</td></tr></table></td></tr>
        </table>
        <div style="margin-top:16px;">
          <a href="https://medrevolve.com/for-business" style="display:inline-block;background:#4A6741;color:#fff;font-size:13px;font-weight:700;padding:11px 22px;border-radius:9px;text-decoration:none;">Explore Business Solutions →</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📞 Questions?</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📧 <a href="mailto:business@medrevolve.com" style="color:#4A6741;font-weight:600;text-decoration:none;">business@medrevolve.com</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">🌐 <a href="https://medrevolve.com/for-business" style="color:#4A6741;font-weight:600;text-decoration:none;">medrevolve.com/for-business</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:22px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:6px;">🌿 MedRevolve Business Development</div>
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
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Business Inquiry</span></td>
      <td align="right"><span style="background:#0f766e;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">🏢 BUSINESS</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🏢 Company Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Company</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${data.company_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Contact</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.contact_name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;text-decoration:none;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Industry</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.industry || 'Not specified'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Interest</td><td style="font-size:13px;color:#111827;font-weight:700;padding:4px 0;">${data.interest_type}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Company Size</td><td style="font-size:13px;color:#374151;padding:4px 0;">${data.company_size || 'Not specified'}</td></tr>
          ${data.message ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;vertical-align:top;">Message</td><td style="font-size:13px;color:#374151;padding:4px 0;line-height:1.5;">${data.message}</td></tr>` : ''}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#0f766e;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Action Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#134e4a;">☐ &nbsp;Qualify the lead (size, budget, timeline)</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#134e4a;">☐ &nbsp;Research company background</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#134e4a;">☐ &nbsp;Respond within <strong>1–2 business days</strong></td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#134e4a;">☐ &nbsp;Schedule a discovery call</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#134e4a;">☐ &nbsp;Send appropriate deck/proposal for <strong>${data.interest_type}</strong></td></tr>
        </table>
        <div style="margin-top:12px;">
          <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
          &nbsp;
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.interest_type + ' - ' + data.company_name)}" style="display:inline-block;background:#0f766e;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Reply to ${data.contact_name} →</a>
        </div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">Ref ID: ${inquiry.id} &nbsp;·&nbsp; ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.all([
      sendEmail({ from_name: 'MedRevolve Business Development', to: data.email, subject: `✅ Inquiry Received — MedRevolve is excited to connect with ${data.company_name}`, html: bizHtml }),
      sendEmail({ from_name: 'MedRevolve Platform', to: adminEmail, subject: `🏢 New Business Inquiry — ${data.company_name} [${data.interest_type}]`, html: adminHtml }),
      sendEmail({ from_name: 'MedRevolve Platform', to: adminEmail2, subject: `🏢 New Business Inquiry — ${data.company_name} [${data.interest_type}]`, html: adminHtml }),
      sendEmail({ from_name: 'MedRevolve Platform', to: 'solconsult@2024', subject: `🏢 New Business Inquiry — ${data.company_name} [${data.interest_type}]`, html: adminHtml }),
      base44.asServiceRole.functions.invoke('driveUploadIntakeForm', {
        form_type: 'business',
        data,
        submitter_name: data.company_name,
        submitter_email: data.email,
      }).catch(e => console.error('Drive upload failed (non-blocking):', e.message)),
    ]);

    // Zapier webhook (non-blocking)
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.contact_name, email: data.email, phone: data.phone || '', company_name: data.company_name, audience_niche: data.industry || '', message: data.message || '', form_type: 'business_inquiry' })
      });
    } catch (e) {
      console.warn('Zapier webhook error (non-fatal):', e.message);
    }

    return Response.json({ success: true, inquiry_id: inquiry.id, message: 'Inquiry submitted successfully' });

  } catch (error) {
    console.error('Error submitting business inquiry:', error);
    return Response.json({ error: error.message || 'Failed to submit inquiry' }, { status: 500 });
  }
});