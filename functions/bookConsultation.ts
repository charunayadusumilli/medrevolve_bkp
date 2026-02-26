import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const DURATION_MAP = {
  initial_consultation: 45,
  follow_up: 20,
  dosage_adjustment: 15,
  general_inquiry: 15
};

const TYPE_LABEL = {
  initial_consultation: 'Initial Consultation',
  follow_up: 'Follow-Up',
  dosage_adjustment: 'Dosage Adjustment',
  general_inquiry: 'General Inquiry'
};

function formatDateLong(dt) {
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(dt) {
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Format date for iCal / Google Calendar: YYYYMMDDTHHmmss
function toCalDateTime(dt) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}

function buildGoogleCalLink({ title, description, location, start, end }) {
  const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: title,
    dates: `${toCalDateTime(start)}/${toCalDateTime(end)}`,
    details: description,
    location: location || 'MedRevolve Telehealth — medrevolve.com/patient-portal'
  });
  return `${base}&${params.toString()}`;
}

function buildICSLink({ title, description, location, start, end }) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${toCalDateTime(start)}`,
    `DTEND:${toCalDateTime(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location || 'MedRevolve Telehealth'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
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

async function sendEmailResend({ to, from_name, subject, html }) {
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

    if (!data.appointment_date || !data.appointment_time || !data.type || !data.reason || !data.patient_email) {
      return Response.json({ error: 'Missing required fields: appointment_date, appointment_time, type, reason, patient_email' }, { status: 400 });
    }

    let user = null;
    try {
      user = await base44.auth.me();
    } catch (e) {
      user = { email: data.patient_email, full_name: data.patient_name || null };
    }

    const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return Response.json({ error: 'Appointment must be in the future' }, { status: 400 });
    }

    let provider = null;
    if (data.provider_id) {
      try {
        provider = await base44.asServiceRole.entities.Provider.get(data.provider_id);
      } catch (err) {
        console.error('Provider fetch error:', err);
      }
    }

    const duration = DURATION_MAP[data.type] || 30;
    const typeLabel = TYPE_LABEL[data.type] || data.type;
    const patientName = user.full_name || user.email;
    const patientFirstName = patientName.split(' ')[0];
    const providerName = provider?.name || 'To Be Assigned';
    const providerTitle = provider?.title || '';
    const providerDisplay = provider
      ? `${providerName}${providerTitle ? ', ' + providerTitle : ''}`
      : 'Will be assigned within 2 hours';
    const dateStr = formatDateLong(appointmentDateTime);
    const timeStr = formatTime(appointmentDateTime);
    const patientEmailTo = data.patient_email || user.email;
    const isConfirmed = !!data.provider_id;

    // Calendar event data
    const apptEnd = new Date(appointmentDateTime.getTime() + duration * 60000);
    const calTitle = `MedRevolve — ${typeLabel} with ${providerName}`;
    const calDesc = `Telehealth consultation via MedRevolve.\nType: ${typeLabel}\nProvider: ${providerDisplay}\nPortal: https://medrevolve.com/patient-portal`;
    const googleCalLink = buildGoogleCalLink({ title: calTitle, description: calDesc, start: appointmentDateTime, end: apptEnd });

    // Create appointment
    const appointmentData = {
      patient_email: patientEmailTo,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: duration,
      type: data.type,
      reason: data.reason,
      notes: data.notes || '',
      status: isConfirmed ? 'scheduled' : 'pending',
      video_room_id: `room_${Date.now()}`
    };
    if (data.provider_id) appointmentData.provider_id = data.provider_id;

    const appointment = await base44.asServiceRole.entities.Appointment.create(appointmentData);

    // ─────────────────────────────────────────────────────────────────────────
    // PATIENT EMAIL — rich HTML
    // ─────────────────────────────────────────────────────────────────────────
    const statusColor = isConfirmed ? '#16a34a' : '#d97706';
    const statusBg = isConfirmed ? '#f0fdf4' : '#fffbeb';
    const statusBorder = isConfirmed ? '#bbf7d0' : '#fde68a';
    const statusIcon = isConfirmed ? '✅' : '⏳';
    const statusText = isConfirmed ? 'Confirmed' : 'Pending Provider Assignment';

    const patientHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Appointment ${isConfirmed ? 'Confirmed' : 'Request Received'} — MedRevolve</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#1f2d1f 0%,#4A6741 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:28px;margin-bottom:6px;">🌿</div>
    <div style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">MedRevolve</div>
    <div style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:4px;">Personalized telehealth, delivered to you</div>
  </td></tr>

  <!-- STATUS BADGE -->
  <tr><td style="background:#ffffff;padding:28px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:${statusBg};border:1.5px solid ${statusBorder};border-radius:12px;padding:16px 20px;">
        <div style="color:${statusColor};font-size:16px;font-weight:700;">${statusIcon} Appointment ${statusText}</div>
        <div style="color:#6b7280;font-size:13px;margin-top:5px;line-height:1.5;">
          ${isConfirmed
            ? 'Your consultation is locked in. Everything you need is below.'
            : 'We received your request. Our care team will assign the best provider within <strong>2 hours</strong> and email you their profile + video link.'}
        </div>
      </td></tr>
    </table>
  </td></tr>

  <!-- GREETING -->
  <tr><td style="background:#ffffff;padding:20px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${patientFirstName}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">
      ${isConfirmed ? 'Your telehealth appointment is booked. Here\'s your complete summary:' : 'Your appointment request has been submitted. Here\'s a summary:'}
    </div>
  </td></tr>

  <!-- APPOINTMENT CARD -->
  <tr><td style="background:#ffffff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:12px 20px;">
        <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Your Appointment</span>
      </td></tr>
      <tr><td style="padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="38%" style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Type</td>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-weight:600;">${typeLabel}</td>
          </tr>
          <tr>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Provider</td>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:${isConfirmed ? '#111827' : '#d97706'};font-weight:${isConfirmed ? '500' : '600'};">${providerDisplay}</td>
          </tr>
          <tr>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">📅 Date</td>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-weight:600;">${dateStr}</td>
          </tr>
          <tr>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">🕐 Time</td>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-weight:600;">${timeStr}</td>
          </tr>
          <tr>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">⏱ Duration</td>
            <td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;">${duration} minutes</td>
          </tr>
          <tr>
            <td style="padding:9px 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reason</td>
            <td style="padding:9px 0;font-size:14px;color:#374151;">${data.reason}</td>
          </tr>
          ${data.notes ? `<tr><td style="padding:9px 0 0;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #f3f4f6;">Notes</td><td style="padding:9px 0 0;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;font-style:italic;">${data.notes}</td></tr>` : ''}
        </table>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:10px 20px;border-top:1px solid #f0f0f0;">
        <span style="font-size:11px;color:#9ca3af;">Ref ID: <strong style="color:#6b7280;">${appointment.id}</strong></span>
      </td></tr>
    </table>
  </td></tr>

  <!-- ADD TO CALENDAR -->
  <tr><td style="background:#ffffff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 20px;">
      <tr><td>
        <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:12px;">📅 Add to Your Calendar</div>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:10px;">
              <a href="${googleCalLink}" target="_blank" style="display:inline-block;background:#4285F4;color:#fff;font-size:13px;font-weight:600;padding:9px 18px;border-radius:8px;text-decoration:none;">
                + Google Calendar
              </a>
            </td>
            <td>
              <a href="https://medrevolve.com/patient-portal" style="display:inline-block;background:#ffffff;color:#374151;font-size:13px;font-weight:600;padding:9px 18px;border-radius:8px;text-decoration:none;border:1px solid #d1d5db;">
                🍎 Apple / Outlook (.ics)
              </a>
            </td>
          </tr>
        </table>
        <div style="font-size:12px;color:#4ade80;margin-top:10px;">⏰ You'll also receive an automatic reminder 24 hours before your appointment.</div>
      </td></tr>
    </table>
  </td></tr>

  <!-- HOW TO JOIN -->
  <tr><td style="background:#ffffff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 20px;">
        <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🎥 How to Join Your Consultation</span>
      </td></tr>
      <tr><td style="padding:18px 20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:4px 0;font-size:13px;color:#374151;"><span style="color:#4A6741;font-weight:700;">1.</span>&nbsp; Log in to your <a href="https://medrevolve.com/patient-portal" style="color:#4A6741;font-weight:600;text-decoration:none;">Patient Portal</a></td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#374151;"><span style="color:#4A6741;font-weight:700;">2.</span>&nbsp; Go to <strong>My Appointments</strong></td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#374151;"><span style="color:#4A6741;font-weight:700;">3.</span>&nbsp; Click <strong>Join Video Call</strong> at your scheduled time</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#374151;"><span style="color:#4A6741;font-weight:700;">4.</span>&nbsp; Join <strong>5 minutes early</strong> to test your camera & mic</td></tr>
        </table>
        <div style="margin-top:16px;">
          <a href="https://medrevolve.com/patient-portal" style="display:inline-block;background:#4A6741;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:9px;text-decoration:none;">Open My Patient Portal →</a>
        </div>
      </td></tr>
    </table>
  </td></tr>

  <!-- WHAT TO PREPARE -->
  <tr><td style="background:#ffffff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#92400e;padding:11px 20px;">
        <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📝 What to Prepare</span>
      </td></tr>
      <tr><td style="padding:18px 20px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">💊&nbsp; List of current medications & dosages</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">🧪&nbsp; Any recent lab results or medical records</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">❓&nbsp; Questions you'd like to discuss with your provider</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">📱&nbsp; A device with a working camera and microphone</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">🔇&nbsp; A quiet, private space for your call</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  ${!isConfirmed ? `
  <!-- NEXT STEPS (unassigned) -->
  <tr><td style="background:#ffffff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#c2410c;padding:11px 20px;">
        <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ What Happens Next</span>
      </td></tr>
      <tr><td style="padding:18px 20px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:5px 0;font-size:13px;color:#7c2d12;">✅&nbsp; Care team reviews your request immediately</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#7c2d12;">✅&nbsp; Best available provider matched to your needs</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#7c2d12;">✅&nbsp; You receive provider profile + video call link by email</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#7c2d12;">✅&nbsp; All within <strong>2 hours</strong></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>` : ''}

  <!-- RESCHEDULE NOTICE -->
  <tr><td style="background:#ffffff;padding:0 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;">
      <tr><td style="font-size:13px;color:#991b1b;line-height:1.6;">
        <strong>🔁 Need to Reschedule?</strong> Cancel or reschedule up to <strong>24 hours before</strong> your appointment at no charge via your Patient Portal.<br/>
        <strong>⏰ Reminder:</strong> We'll email you a reminder 24 hours before your appointment.
      </td></tr>
    </table>
  </td></tr>

  <!-- CONTACT -->
  <tr><td style="background:#ffffff;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;">
      <tr><td>
        <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">📞 Need Help?</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📧 <a href="mailto:support@medrevolve.com" style="color:#4A6741;text-decoration:none;font-weight:600;">support@medrevolve.com</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">🌐 <a href="https://medrevolve.com/patient-portal" style="color:#4A6741;text-decoration:none;font-weight:600;">medrevolve.com/patient-portal</a></td></tr>
          <tr><td style="padding:3px 0;font-size:13px;color:#374151;">📚 <a href="https://medrevolve.com/how-it-works" style="color:#4A6741;text-decoration:none;font-weight:600;">How It Works</a></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:26px 40px;text-align:center;">
    <div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:8px;">🌿 MedRevolve</div>
    <div style="margin-bottom:12px;">
      <a href="https://medrevolve.com/patient-portal" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 8px;">Patient Portal</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="https://medrevolve.com/consultations" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 8px;">Consultations</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="https://medrevolve.com/privacy" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 8px;">Privacy</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="https://medrevolve.com/terms" style="color:rgba(255,255,255,0.6);font-size:12px;text-decoration:none;margin:0 8px;">Terms</a>
    </div>
    <div style="color:rgba(255,255,255,0.3);font-size:11px;margin-bottom:6px;">Telehealth services provided by licensed providers through affiliated medical groups.</div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;">© 2024 MedRevolve. All rights reserved.</div>
    <div style="margin-top:10px;"><a href="https://medrevolve.com/unsubscribe?email=${encodeURIComponent(patientEmailTo)}" style="color:rgba(255,255,255,0.25);font-size:11px;text-decoration:underline;">Unsubscribe</a></div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    try {
      await sendEmailResend({
        from_name: 'MedRevolve Care Team',
        to: patientEmailTo,
        subject: isConfirmed
          ? `✅ Appointment Confirmed — ${dateStr} at ${timeStr}`
          : `📋 Appointment Request Received — ${dateStr} at ${timeStr}`,
        html: patientHtml
      });
    } catch (e) { console.error('Patient email error:', e); }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN EMAIL
    // ─────────────────────────────────────────────────────────────────────────
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const urgentColor = !isConfirmed ? '#dc2626' : '#16a34a';

    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:22px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><span style="color:#fff;font-size:18px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.45);font-size:12px;">New Appointment Alert</span></td>
        <td align="right"><span style="background:${urgentColor};color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">${!isConfirmed ? '⚠️ ASSIGN PROVIDER' : '✅ CONFIRMED'}</span></td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:${urgentColor}15;border-left:4px solid ${urgentColor};padding:14px 32px;">
    <span style="color:${urgentColor};font-size:14px;font-weight:700;">${!isConfirmed ? 'ACTION REQUIRED — No provider assigned yet' : 'Appointment confirmed successfully'}</span>
    <div style="font-size:13px;color:#374151;margin-top:4px;">Patient: <strong>${patientName}</strong> &nbsp;·&nbsp; ${dateStr} at ${timeStr}</div>
  </td></tr>

  <tr><td style="background:#fff;padding:24px 32px;">

    <!-- Patient Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:18px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Patient</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="30%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Name</td><td style="font-size:13px;color:#111827;font-weight:600;padding:4px 0;">${patientName}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Email</td><td style="font-size:13px;padding:4px 0;"><a href="mailto:${patientEmailTo}" style="color:#4A6741;text-decoration:none;">${patientEmailTo}</a></td></tr>
          ${data.phone ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:4px 0;">Phone</td><td style="font-size:13px;padding:4px 0;"><a href="tel:${data.phone}" style="color:#4A6741;text-decoration:none;">${data.phone}</a></td></tr>` : ''}
        </table>
      </td></tr>
    </table>

    <!-- Appointment Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:18px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Appointment</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="30%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">Type</td><td style="font-size:13px;color:#111827;padding:5px 0;border-bottom:1px solid #f1f5f9;">${typeLabel}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">Provider</td><td style="font-size:13px;color:${!isConfirmed ? '#dc2626' : '#111827'};font-weight:${!isConfirmed ? '700' : '400'};padding:5px 0;border-bottom:1px solid #f1f5f9;">${!isConfirmed ? '⚠️ NOT ASSIGNED' : providerDisplay}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">Date</td><td style="font-size:13px;color:#111827;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">${dateStr}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">Time</td><td style="font-size:13px;color:#111827;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">${timeStr}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;border-bottom:1px solid #f1f5f9;">Duration</td><td style="font-size:13px;color:#111827;padding:5px 0;border-bottom:1px solid #f1f5f9;">${duration} min</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Reason</td><td style="font-size:13px;color:#111827;padding:5px 0;">${data.reason}</td></tr>
        </table>
      </td></tr>
      <tr><td style="background:#f0fdf4;padding:8px 16px;border-top:1px solid #d1fae5;"><span style="font-size:11px;color:#166534;">ID: <strong>${appointment.id}</strong></span></td></tr>
    </table>

    <!-- Action Checklist -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${!isConfirmed ? '#fef2f2' : '#f0fdf4'};border:1px solid ${!isConfirmed ? '#fecaca' : '#bbf7d0'};border-radius:10px;margin-bottom:18px;overflow:hidden;">
      <tr><td style="background:${urgentColor};padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Action Checklist</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0">
          ${!isConfirmed ? `
          <tr><td style="padding:4px 0;font-size:13px;color:#7f1d1d;">☐ &nbsp;<strong>URGENT:</strong> Assign a provider in Admin Dashboard</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#7f1d1d;">☐ &nbsp;Update appointment status to "scheduled"</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#7f1d1d;">☐ &nbsp;Notify patient once provider is assigned</td></tr>
          ` : `
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☑ &nbsp;Appointment confirmed — patient emailed</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Confirm provider has been notified</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Ensure video room is ready before appointment</td></tr>
          `}
          <tr><td style="padding:4px 0;font-size:13px;color:${!isConfirmed ? '#7f1d1d' : '#166534'};">☐ &nbsp;Send reminder 24 hours before appointment</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:${!isConfirmed ? '#7f1d1d' : '#166534'};">☐ &nbsp;Follow up with patient after consultation</td></tr>
        </table>
        <div style="margin-top:14px;">
          <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 22px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
        </div>
      </td></tr>
    </table>

  </td></tr>

  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:18px 32px;text-align:center;">
    <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:0;">Internal admin notification — MedRevolve Platform</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    try {
      await sendEmailResend({
        from_name: 'MedRevolve Platform',
        to: adminEmail,
        subject: `📅 New Appointment${!isConfirmed ? ' [ASSIGN PROVIDER]' : ' ✅'} — ${patientName} · ${dateStr}`,
        html: adminHtml
      });
    } catch (e) { console.error('Admin email error:', e); }

    // ─────────────────────────────────────────────────────────────────────────
    // SMS to patient (only if they explicitly opted in)
    // ─────────────────────────────────────────────────────────────────────────
    if (data.phone && data.sms_consent) {
      try {
        await sendSMS(
          data.phone,
          isConfirmed
            ? `MedRevolve: Your ${typeLabel} with ${providerName} is confirmed for ${dateStr} at ${timeStr}. Portal: medrevolve.com/patient-portal`
            : `MedRevolve: Your ${typeLabel} request for ${dateStr} at ${timeStr} is received. Provider assigned within 2 hours. Portal: medrevolve.com/patient-portal`
        );
      } catch (smsErr) {
        console.error('SMS send error:', smsErr);
      }
    }

    return Response.json({
      success: true,
      appointment_id: appointment.id,
      appointment_date: appointmentDateTime.toISOString(),
      provider_assigned: isConfirmed,
      message: isConfirmed ? 'Appointment booked successfully' : 'Appointment request submitted. Provider will be assigned shortly.'
    });

  } catch (error) {
    console.error('Error booking consultation:', error);
    return Response.json({ error: error.message || 'Failed to book appointment' }, { status: 500 });
  }
});