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

async function createCalendarMeeting(base44, { summary, description, startISO, durationMinutes, attendeeEmail, attendeePhone }) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const start = new Date(startISO);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const attendees = [
      { email: ADMIN_EMAIL },
      ...(attendeeEmail ? [{ email: attendeeEmail }] : []),
    ];
    const event = {
      summary,
      description: description + (attendeePhone ? `\n\nPhone: ${attendeePhone}` : ''),
      start: { dateTime: start.toISOString(), timeZone: 'America/New_York' },
      end: { dateTime: end.toISOString(), timeZone: 'America/New_York' },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `mr-contact-${Date.now()}`,
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
    console.log('✅ Calendar invite created:', result.htmlLink);
    return { meetLink, calLink: result.htmlLink, eventId: result.id };
  } catch (e) {
    console.error('Calendar creation failed (non-blocking):', e.message);
    return null;
  }
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
      phone: data.phone || '',
      subject: data.subject || '', message: data.message,
      source: 'website_form',
      status: 'new'
    });

    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const firstName = data.name.split(' ')[0];

    // Detect workflow path from subject + message
    const textForDetection = ((data.subject || '') + ' ' + (data.message || '')).toLowerCase();
    let workflowPath = 'General Inquiry';
    let workflowCategory = 'Unclassified';
    let workflowIcon = '📬';
    let workflowPriority = 'MEDIUM';
    let workflowActions = 'Reply within 24 hours · Qualify the lead · Book discovery call';
    let workflowColor = '#3b82f6';

    if (/incorporat|llc|formation|business entity|registered agent/i.test(textForDetection)) {
      workflowPath = 'Legal / Business Formation'; workflowCategory = 'LLC & Incorporation';
      workflowIcon = '🏛️'; workflowPriority = 'HIGH'; workflowColor = '#7c3aed';
      workflowActions = '1. Identify state & entity type needed · 2. Send LLC formation checklist · 3. Schedule consultation call';
    } else if (/white.?label|merchant|b2b|clinic setup|launch.*platform|platform.*launch/i.test(textForDetection)) {
      workflowPath = 'Merchant Onboarding'; workflowCategory = 'White Label Platform';
      workflowIcon = '🏢'; workflowPriority = 'HIGH'; workflowColor = '#059669';
      workflowActions = '1. Send platform deck & pricing · 2. Book live demo · 3. Create HubSpot deal';
    } else if (/wholesale|bulk.*order|supply/i.test(textForDetection)) {
      workflowPath = 'Wholesale / Supply'; workflowCategory = 'Product Wholesale';
      workflowIcon = '📦'; workflowPriority = 'HIGH'; workflowColor = '#d97706';
      workflowActions = '1. Confirm product categories · 2. Send wholesale pricing sheet · 3. Verify licensing';
    } else if (/provider|physician|md|np|pa|license|specialty/i.test(textForDetection)) {
      workflowPath = 'Provider Network'; workflowCategory = 'Provider Application';
      workflowIcon = '👨‍⚕️'; workflowPriority = 'HIGH'; workflowColor = '#0891b2';
      workflowActions = '1. Review license & credentials · 2. Send Qualiphy exam link · 3. Schedule onboarding call';
    } else if (/pharmac|compounding|dispensing/i.test(textForDetection)) {
      workflowPath = 'Pharmacy Network'; workflowCategory = 'Pharmacy Partnership';
      workflowIcon = '💊'; workflowPriority = 'HIGH'; workflowColor = '#be185d';
      workflowActions = '1. Verify pharmacy license & NPI · 2. Confirm shipping capabilities · 3. Schedule partnership call';
    } else if (/partner|affiliate|referral|gym|spa|fitness/i.test(textForDetection)) {
      workflowPath = 'Partner Program'; workflowCategory = 'Affiliate / Referral';
      workflowIcon = '🤝'; workflowPriority = 'MEDIUM'; workflowColor = '#7c3aed';
      workflowActions = '1. Send partner program overview · 2. Qualify fit · 3. Set up referral code';
    } else if (/creator|influencer|instagram|tiktok|youtube/i.test(textForDetection)) {
      workflowPath = 'Creator Program'; workflowCategory = 'Influencer Partnership';
      workflowIcon = '🎨'; workflowPriority = 'MEDIUM'; workflowColor = '#db2777';
      workflowActions = '1. Review platform & follower metrics · 2. Send creator agreement · 3. Assign referral code';
    } else if (/glp|semaglutide|tirzepatide|weight loss|consultation|patient/i.test(textForDetection)) {
      workflowPath = 'Patient / Telehealth'; workflowCategory = 'Patient Inquiry';
      workflowIcon = '🏥'; workflowPriority = 'MEDIUM'; workflowColor = '#059669';
      workflowActions = '1. Send intake questionnaire · 2. Assign to provider · 3. Book consultation';
    } else if (/payment|billing|invoice|refund|charge/i.test(textForDetection)) {
      workflowPath = 'Billing / Payments'; workflowCategory = 'Payment Issue';
      workflowIcon = '💳'; workflowPriority = 'HIGH'; workflowColor = '#dc2626';
      workflowActions = '1. Pull Stripe record · 2. Verify charge/refund status · 3. Respond with resolution';
    }

    // Create a Google Calendar follow-up reminder in 24 hours
    const followUpTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const calData = await createCalendarMeeting(base44, {
      summary: `Follow-up: ${data.name} — ${data.subject || 'Contact Inquiry'}`,
      description: `Contact inquiry from ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject || 'N/A'}\n\nMessage:\n${data.message}`,
      startISO: followUpTime,
      durationMinutes: 30,
      attendeeEmail: data.email,
      attendeePhone: data.phone,
    });

    const meetSection = calData?.meetLink
      ? `<div style="background:#e8f4fd;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:13px;">📅 A follow-up meeting has been scheduled. <a href="${calData.meetLink}" style="color:#4285F4;font-weight:700;">Join Google Meet →</a></div>`
      : '';

    // Patient confirmation
    const patientHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;margin-bottom:8px;">🌿</div>
    <div style="color:#fff;font-size:22px;font-weight:800;">MedRevolve Support</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">We received your message</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Message Received!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">Our team will respond within <strong>24 hours</strong> to ${data.email}.</div>
    </div>
    ${meetSection}
    <div style="font-size:17px;color:#111827;margin-bottom:8px;">Hi <strong>${firstName}</strong> 👋</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-top:12px;">
      <tr><td style="background:#4A6741;padding:10px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">📬 Your Message</span></td></tr>
      <tr><td style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="30%" style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Subject</td><td style="padding:6px 0;font-size:13px;font-weight:600;">${data.subject || 'General Inquiry'}</td></tr>
          <tr><td style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Phone</td><td style="padding:6px 0;font-size:13px;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="padding:6px 0;font-size:12px;color:#9ca3af;font-weight:600;">Ref ID</td><td style="padding:6px 0;font-size:12px;color:#6b7280;">${contactRequest.id}</td></tr>
          <tr><td colspan="2" style="padding:10px 0 0;font-size:13px;color:#374151;line-height:1.7;">${data.message.replace(/\n/g, '<br/>')}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:24px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding-bottom:12px;">
        <img src="https://media.base44.com/images/public/698bb392815cbad420c2ec1a/74d6bc580_generated_image.png" alt="MedRevolve" style="height:36px;width:auto;" />
      </td></tr>
      <tr><td align="center" style="padding-bottom:8px;">
        <span style="color:#fff;font-size:14px;font-weight:700;">Raj Nedunuri</span><br/>
        <span style="color:#86efac;font-size:12px;">President & CEO</span><br/>
        <span style="color:rgba(255,255,255,0.4);font-size:12px;">MedRevolve Corporation</span>
      </td></tr>
      <tr><td align="center" style="padding-bottom:12px;">
        <span style="color:rgba(255,255,255,0.5);font-size:11px;">📞 240-387-5224 | ✉️ rned@medrevolve.com</span>
      </td></tr>
      <tr><td align="center" style="border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;padding-bottom:8px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 6px;"><a href="https://instagram.com/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="Instagram" style="width:16px;height:16px;opacity:0.7;" /></a></td>
            <td style="padding:0 6px;"><a href="https://twitter.com/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" style="width:16px;height:16px;opacity:0.7;" /></a></td>
            <td style="padding:0 6px;"><a href="https://facebook.com/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174848.png" alt="Facebook" style="width:16px;height:16px;opacity:0.7;" /></a></td>
            <td style="padding:0 6px;"><a href="https://youtube.com/@medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174860.png" alt="YouTube" style="width:16px;height:16px;opacity:0.7;" /></a></td>
            <td style="padding:0 6px;"><a href="https://linkedin.com/company/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" style="width:16px;height:16px;opacity:0.7;" /></a></td>
          </tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding-top:8px;">
        <span style="color:rgba(255,255,255,0.25);font-size:10px;">MedRevolve Corporation | Launch a compliant telehealth, GLP-1, or RUO business under your own brand</span>
      </td></tr>
    </table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    // Admin notification
    const adminHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;"><tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve — New Service Request</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">${submittedAt} ET · Website Form</span></td>
      <td align="right"><span style="background:${workflowColor};color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">${workflowIcon} ${workflowPriority}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">

    <!-- WORKFLOW PATH BANNER -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${workflowColor}15;border:2px solid ${workflowColor}40;border-radius:12px;margin-bottom:18px;overflow:hidden;">
      <tr><td style="background:${workflowColor};padding:10px 16px;">
        <span style="color:#fff;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">⚡ WORKFLOW TRIGGERED</span>
      </td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding:4px 0;">
              <div style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;margin-bottom:3px;">Path</div>
              <div style="font-size:15px;font-weight:800;color:#111827;">${workflowIcon} ${workflowPath}</div>
            </td>
            <td width="50%" style="padding:4px 0;">
              <div style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;margin-bottom:3px;">Service Category</div>
              <div style="font-size:14px;font-weight:700;color:#374151;">${workflowCategory}</div>
            </td>
          </tr>
        </table>
        <div style="margin-top:12px;background:#fff;border-radius:8px;padding:10px 14px;border:1px solid ${workflowColor}30;">
          <div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:5px;">📋 Recommended Actions</div>
          <div style="font-size:13px;color:#374151;line-height:1.8;">${workflowActions}</div>
        </div>
      </td></tr>
    </table>

    <!-- CONTACT INFO -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">👤 Contact Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="30%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;font-weight:600;padding:4px 0;">${data.name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${data.email}" style="color:#4A6741;">${data.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;">${data.phone ? `<a href="tel:${data.phone}" style="color:#4A6741;">${data.phone}</a>` : 'Not provided'}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Subject</td><td style="font-size:13px;font-weight:600;padding:4px 0;">${data.subject || 'No subject'}</td></tr>
          ${calData?.meetLink ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Follow-Up Meet</td><td style="font-size:13px;padding:4px 0;"><a href="${calData.meetLink}" style="color:#4285F4;font-weight:700;">Join Google Meet →</a></td></tr>` : ''}
        </table>
      </td></tr>
    </table>

    <!-- MESSAGE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;">💬 Message</span></td></tr>
      <tr><td style="padding:16px;font-size:13px;color:#374151;line-height:1.8;">${data.message.replace(/\n/g, '<br/>')}</td></tr>
    </table>

    <div style="margin-top:12px;">
      <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your MedRevolve Inquiry')}" style="display:inline-block;background:#3b82f6;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;margin-right:8px;">Reply to ${firstName} →</a>
      <a href="https://medrevolve.base44.app/AdminDashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Admin Dashboard →</a>
    </div>
    <div style="margin-top:12px;font-size:11px;color:#94a3b8;">Ref: ${contactRequest.id} · Source: Website Form · ${submittedAt} ET</div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:20px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding-bottom:10px;">
        <img src="https://media.base44.com/images/public/698bb392815cbad420c2ec1a/74d6bc580_generated_image.png" alt="MedRevolve" style="height:32px;width:auto;" />
      </td></tr>
      <tr><td align="center" style="padding-bottom:6px;">
        <span style="color:#fff;font-size:13px;font-weight:700;">Raj Nedunuri</span><br/>
        <span style="color:#86efac;font-size:11px;">President & CEO</span><br/>
        <span style="color:rgba(255,255,255,0.35);font-size:11px;">MedRevolve Corporation</span>
      </td></tr>
      <tr><td align="center" style="padding-bottom:10px;">
        <span style="color:rgba(255,255,255,0.45);font-size:10px;">📞 240-387-5224 | ✉️ rned@medrevolve.com</span>
      </td></tr>
      <tr><td align="center" style="border-top:1px solid rgba(255,255,255,0.12);padding-top:10px;padding-bottom:6px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 5px;"><a href="https://instagram.com/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="Instagram" style="width:14px;height:14px;opacity:0.65;" /></a></td>
            <td style="padding:0 5px;"><a href="https://twitter.com/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" style="width:14px;height:14px;opacity:0.65;" /></a></td>
            <td style="padding:0 5px;"><a href="https://facebook.com/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174848.png" alt="Facebook" style="width:14px;height:14px;opacity:0.65;" /></a></td>
            <td style="padding:0 5px;"><a href="https://youtube.com/@medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174860.png" alt="YouTube" style="width:14px;height:14px;opacity:0.65;" /></a></td>
            <td style="padding:0 5px;"><a href="https://linkedin.com/company/medrevolve" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" style="width:14px;height:14px;opacity:0.65;" /></a></td>
          </tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding-top:6px;">
        <span style="color:rgba(255,255,255,0.2);font-size:9px;">MedRevolve Corporation | Launch a compliant telehealth, GLP-1, or RUO business under your own brand</span>
      </td></tr>
    </table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await Promise.allSettled([
      sendEmail(base44, { to: data.email, subject: `✅ We got your message, ${firstName}! We'll respond within 24 hours`, html: patientHtml }),
      sendEmail(base44, { to: ADMIN_EMAIL, subject: `${workflowIcon} [${workflowPath}] ${data.name} — ${data.subject || 'No Subject'}`, html: adminHtml }),
      base44.asServiceRole.functions.invoke('syncToHubspot', { source: 'contact_request', data })
        .catch(e => console.error('HubSpot sync failed (non-blocking):', e.message)),
    ]);

    // SMS to admin
    await sendSMS(ADMIN_PHONE, `[${workflowPath}] ${workflowPriority} | ${data.name} | ${data.phone || 'no phone'} | ${data.email} | ${data.subject || 'No subject'} | ${data.message.substring(0, 60)}`);

    return Response.json({ success: true, request_id: contactRequest.id });

  } catch (error) {
    console.error('submitContactRequest error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});