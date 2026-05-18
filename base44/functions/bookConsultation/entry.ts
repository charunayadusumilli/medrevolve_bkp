import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const DURATION_MAP = {
  initial_consultation: 45, follow_up: 20, dosage_adjustment: 15, general_inquiry: 15,
};
const TYPE_LABEL = {
  initial_consultation: 'Initial Consultation', follow_up: 'Follow-Up',
  dosage_adjustment: 'Dosage Adjustment', general_inquiry: 'General Inquiry',
};

function formatDateLong(dt) {
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(dt) {
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

async function sendViaGmail(base44, { to, subject, html }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const emailLines = [
    `From: MedRevolve Care Team <rned@medrevolve.com>`,
    `To: ${to}`, `Subject: ${subject}`,
    'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html,
  ];
  const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error?.message || 'Gmail send failed');
  console.log(`✅ Gmail sent to ${to}`);
  return result;
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
    headers: { 'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) console.error('SMS error:', await res.text());
  else console.log('✅ SMS sent to:', phoneE164);
}

async function createGoogleMeetEvent(base44, { appointmentId, appointment, provider, typeLabel, duration }) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const startDt = new Date(appointment.appointment_date);
    const endDt = new Date(startDt.getTime() + duration * 60000);
    const providerDisplay = provider ? `${provider.name}${provider.title ? ', ' + provider.title : ''}` : 'MedRevolve Provider';
    const attendees = [
      { email: appointment.patient_email },
      ...(provider?.email ? [{ email: provider.email }] : []),
      { email: 'rned@medrevolve.com' },
    ];

    const calEvent = {
      summary: `MedRevolve — ${typeLabel} · ${appointment.patient_email}`,
      description: `Type: ${typeLabel}\nProvider: ${providerDisplay}\nPatient: ${appointment.patient_email}\nReason: ${appointment.reason || 'Not specified'}\n\nJoin via Google Meet link in this event.\nPortal: https://medrevolve.base44.app`,
      start: { dateTime: startDt.toISOString(), timeZone: 'America/New_York' },
      end: { dateTime: endDt.toISOString(), timeZone: 'America/New_York' },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `mr-${appointmentId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: 'email', minutes: 24 * 60 }, { method: 'popup', minutes: 30 }],
      },
    };

    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(calEvent) }
    );
    const result = await res.json();
    if (!res.ok) { console.error('Google Calendar error:', result); return null; }

    const meetLink = result.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null;
    const calLink = result.htmlLink || null;

    // Persist Google data back to appointment
    await base44.asServiceRole.entities.Appointment.update(appointmentId, {
      google_event_id: result.id,
      google_meet_link: meetLink,
      google_calendar_link: calLink,
      google_synced_at: new Date().toISOString(),
      ...(meetLink ? { session_url: meetLink } : {}),
    });

    console.log(`✅ Google Meet created: ${meetLink}`);
    return { meetLink, calLink, eventId: result.id };
  } catch (e) {
    console.error('Google Meet creation failed (non-blocking):', e.message);
    return null;
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
    try { user = await base44.auth.me(); } catch { user = { email: data.patient_email, full_name: data.patient_name || null }; }

    const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return Response.json({ error: 'Appointment must be in the future' }, { status: 400 });
    }

    let provider = null;
    if (data.provider_id) {
      try { provider = await base44.asServiceRole.entities.Provider.get(data.provider_id); } catch {}
    }

    const duration = DURATION_MAP[data.type] || 30;
    const typeLabel = TYPE_LABEL[data.type] || data.type;
    const patientName = user?.full_name || user?.email || data.patient_email;
    const patientFirstName = patientName.split(' ')[0];
    const providerName = provider?.name || 'To Be Assigned';
    const providerTitle = provider?.title || '';
    const providerDisplay = provider
      ? `${providerName}${providerTitle ? ', ' + providerTitle : ''}`
      : 'Will be assigned within 2 hours';
    const dateStr = formatDateLong(appointmentDateTime);
    const timeStr = formatTime(appointmentDateTime);
    const patientEmailTo = data.patient_email || user?.email;
    const isConfirmed = !!data.provider_id;

    // ── Create appointment record ──────────────────────────────────────────
    const appointmentRecord = {
      patient_email: patientEmailTo,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: duration,
      type: data.type,
      reason: data.reason,
      notes: data.notes || '',
      status: isConfirmed ? 'scheduled' : 'pending',
      video_room_id: `room_${Date.now()}`,
    };
    if (data.provider_id) appointmentRecord.provider_id = data.provider_id;

    const appointment = await base44.asServiceRole.entities.Appointment.create(appointmentRecord);

    // ── Create Google Calendar event with Meet link (non-blocking) ─────────
    const googleData = await createGoogleMeetEvent(base44, {
      appointmentId: appointment.id,
      appointment: { ...appointmentRecord, appointment_date: appointmentDateTime.toISOString() },
      provider,
      typeLabel,
      duration,
    });

    const meetLink = googleData?.meetLink || null;
    const calLink = googleData?.calLink || null;

    const meetButton = meetLink
      ? `<div style="text-align:center;margin:20px 0;"><a href="${meetLink}" style="display:inline-block;background:#4285F4;color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:9px;text-decoration:none;">🎥 Join Google Meet →</a></div>`
      : '';
    const addCalButton = calLink
      ? `<div style="margin-bottom:8px;"><a href="${calLink}" style="display:inline-block;background:#4285F4;color:#fff;font-size:13px;font-weight:600;padding:9px 18px;border-radius:8px;text-decoration:none;">+ Google Calendar</a></div>`
      : '';

    // ── Patient email ──────────────────────────────────────────────────────
    const statusIcon = isConfirmed ? '✅' : '⏳';
    const statusText = isConfirmed ? 'Appointment Confirmed' : 'Request Received';

    const patientHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:30px;">🌿</div>
    <div style="color:#fff;font-size:23px;font-weight:800;">${statusIcon} ${statusText}</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">MedRevolve Telehealth</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px 0;">
    <div style="font-size:17px;color:#111827;">Hi <strong>${patientFirstName}</strong> 👋</div>
    <div style="font-size:14px;color:#6b7280;margin-top:6px;line-height:1.6;">
      ${isConfirmed ? 'Your telehealth appointment is booked. Here\'s everything you need:' : 'We received your request. A provider will be assigned within 2 hours.'}
    </div>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#4A6741;padding:11px 18px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Appointment Details</span></td></tr>
      <tr><td style="padding:16px 18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;">Type</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:600;">${typeLabel}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;">Provider</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:14px;">${providerDisplay}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;">📅 Date</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:600;">${dateStr}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-weight:600;">🕐 Time</td><td style="padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:600;">${timeStr} ET</td></tr>
          <tr><td style="padding:7px 0;font-size:12px;color:#9ca3af;font-weight:600;">Duration</td><td style="padding:7px 0;font-size:14px;">${duration} minutes</td></tr>
          ${meetLink ? `<tr><td colspan="2" style="padding:10px 0 0;"><div style="background:#e8f4fd;border-radius:8px;padding:10px 14px;font-size:13px;">🎥 <strong>Google Meet:</strong> <a href="${meetLink}" style="color:#4285F4;font-weight:700;">${meetLink}</a></div></td></tr>` : ''}
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 20px;">
    ${meetButton}
    ${addCalButton}
    <div style="padding:14px 18px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;margin-top:8px;">
      ⏰ You'll receive a reminder 24 hours before. Join your Meet link at your scheduled time.
    </div>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;">🌿 MedRevolve</div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:6px;">© 2025 MedRevolve · rned@medrevolve.com · Telehealth by licensed providers</div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    // ── Admin email ────────────────────────────────────────────────────────
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'rned@medrevolve.com';
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:17px;font-weight:700;">🌿 MedRevolve Admin</span><br/><span style="color:rgba(255,255,255,0.4);font-size:12px;">New Appointment</span></td>
      <td align="right"><span style="background:${isConfirmed ? '#16a34a' : '#d97706'};color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">${isConfirmed ? '✅ CONFIRMED' : '⚠️ ASSIGN PROVIDER'}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:22px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:9px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Details</span></td></tr>
      <tr><td style="padding:14px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="35%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Patient</td><td style="font-size:13px;padding:5px 0;">${patientName} · <a href="mailto:${patientEmailTo}" style="color:#4A6741;">${patientEmailTo}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Provider</td><td style="font-size:13px;padding:5px 0;color:${!isConfirmed ? '#d97706' : '#111827'};font-weight:${!isConfirmed ? '700' : '400'};">${!isConfirmed ? '⚠️ NOT ASSIGNED' : providerDisplay}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Type</td><td style="font-size:13px;padding:5px 0;">${typeLabel}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Date & Time</td><td style="font-size:13px;font-weight:600;padding:5px 0;">${dateStr} at ${timeStr} ET</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Reason</td><td style="font-size:13px;padding:5px 0;">${data.reason}</td></tr>
          ${meetLink ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">🎥 Meet Link</td><td style="font-size:13px;padding:5px 0;"><a href="${meetLink}" style="color:#4285F4;font-weight:700;">${meetLink}</a></td></tr>` : ''}
          ${calLink ? `<tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Calendar</td><td style="font-size:13px;padding:5px 0;"><a href="${calLink}" style="color:#4A6741;">View Event →</a></td></tr>` : ''}
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0;">Appt ID</td><td style="font-size:11px;color:#6b7280;padding:5px 0;">${appointment.id}</td></tr>
        </table>
      </td></tr>
    </table>
    <div style="margin-top:14px;">
      <a href="https://medrevolve.base44.app/AdminDashboard" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
    </div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Sent from rned@medrevolve.com — MedRevolve Platform</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    // Send emails in parallel
    await Promise.allSettled([
      sendViaGmail(base44, {
        to: patientEmailTo,
        subject: isConfirmed
          ? `✅ Appointment Confirmed — ${dateStr} at ${timeStr}`
          : `📋 Appointment Request Received — ${dateStr}`,
        html: patientHtml,
      }),
      sendViaGmail(base44, {
        to: adminEmail,
        subject: `📅 New Appointment${!isConfirmed ? ' [ASSIGN PROVIDER]' : ' ✅'} — ${patientName} · ${dateStr}`,
        html: adminHtml,
      }),
    ]);

    // SMS (opt-in only)
    if (data.phone && data.sms_consent) {
      const smsMsg = isConfirmed
        ? `MedRevolve: ${typeLabel} confirmed for ${dateStr} at ${timeStr}.${meetLink ? ' Join: ' + meetLink : ' Portal: medrevolve.base44.app'}`
        : `MedRevolve: ${typeLabel} request for ${dateStr} at ${timeStr} received. Provider assigned within 2 hours.`;
      await sendSMS(data.phone, smsMsg).catch(e => console.error('SMS error:', e.message));
    }

    return Response.json({
      success: true,
      appointment_id: appointment.id,
      appointment_date: appointmentDateTime.toISOString(),
      provider_assigned: isConfirmed,
      google_meet_link: meetLink,
      google_calendar_link: calLink,
      message: isConfirmed ? 'Appointment booked with Google Meet link' : 'Appointment request submitted. Provider will be assigned shortly.',
    });

  } catch (error) {
    console.error('bookConsultation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});