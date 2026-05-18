import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Triggered by Appointment entity create automation
// Sends confirmation emails via Gmail (rned@medrevolve.com) to patient and admin

async function sendViaGmail(base44, { to, subject, html }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const emailLines = [
    `From: MedRevolve Care Team <rned@medrevolve.com>`,
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
  const result = await res.json();
  if (!res.ok) throw new Error(result.error?.message || 'Gmail send failed');
  console.log(`✅ Gmail sent to ${to} — messageId: ${result.id}`);
  return result;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (event?.type !== 'create' || event?.entity_name !== 'Appointment') {
      return Response.json({ skipped: true, reason: 'Not an Appointment create event' });
    }

    const appointment = data;
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'rned@medrevolve.com';
    const appointmentDate = new Date(appointment.appointment_date)
      .toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

    let providerName = 'Provider (to be assigned)';
    try {
      const providers = await base44.asServiceRole.entities.Provider.filter({ id: appointment.provider_id });
      if (providers?.length > 0) providerName = providers[0].name;
    } catch {}

    const meetRow = appointment.google_meet_link
      ? `<tr style="background:#e8f4fd;"><td style="padding:9px 0;font-size:12px;color:#9ca3af;font-weight:600;">🎥 Meet Link</td><td style="padding:9px 0;"><a href="${appointment.google_meet_link}" style="color:#4285F4;font-weight:700;font-size:14px;">${appointment.google_meet_link}</a></td></tr>`
      : '';

    // Patient confirmation email
    const patientHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#1f2d1f,#4A6741);padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
    <div style="font-size:28px;">🌿</div>
    <h1 style="color:#fff;margin:8px 0 4px;font-size:22px;">Appointment Confirmed</h1>
    <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px;">MedRevolve Telehealth</p>
  </div>
  <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <tr style="background:#4A6741;"><td colspan="2" style="padding:10px 16px;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Your Appointment Details</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:9px 16px;font-size:12px;color:#9ca3af;font-weight:600;">Type</td><td style="padding:9px 16px;font-size:14px;font-weight:600;">${appointment.type?.replace(/_/g, ' ')}</td></tr>
      <tr><td style="padding:9px 16px;font-size:12px;color:#9ca3af;font-weight:600;">Provider</td><td style="padding:9px 16px;font-size:14px;">${providerName}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:9px 16px;font-size:12px;color:#9ca3af;font-weight:600;">📅 Date & Time</td><td style="padding:9px 16px;font-size:14px;font-weight:600;">${appointmentDate} ET</td></tr>
      <tr><td style="padding:9px 16px;font-size:12px;color:#9ca3af;font-weight:600;">Duration</td><td style="padding:9px 16px;font-size:14px;">${appointment.duration_minutes || 30} minutes</td></tr>
      ${meetRow}
    </table>
    ${appointment.google_meet_link ? `
    <div style="margin-top:20px;text-align:center;">
      <a href="${appointment.google_meet_link}" style="display:inline-block;background:#4285F4;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">🎥 Join Google Meet →</a>
    </div>` : ''}
    <div style="margin-top:20px;padding:14px 18px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;">
      ⏰ You'll receive an automatic reminder 24 hours before your appointment via email.
    </div>
    <div style="margin-top:14px;text-align:center;">
      <a href="https://medrevolve.base44.app" style="display:inline-block;background:#1f2d1f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Open My Patient Portal →</a>
    </div>
  </div>
  <div style="background:#1f2d1f;padding:16px 32px;border-radius:0 0 12px 12px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">MedRevolve · rned@medrevolve.com · Telehealth services by licensed providers</p>
  </div>
</div>`;

    // Admin notification
    const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:16px 24px;border-radius:8px 8px 0 0;">
    <p style="color:#fff;margin:0;font-size:14px;font-weight:800;">MEDREVOLVE — New Appointment</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:20px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;width:35%;">Patient</td><td style="padding:8px 12px;font-weight:600;">${appointment.patient_email}</td></tr>
      <tr><td style="padding:8px 12px;color:#6b7280;">Provider</td><td style="padding:8px 12px;">${providerName}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;">Type</td><td style="padding:8px 12px;">${appointment.type?.replace(/_/g, ' ')}</td></tr>
      <tr><td style="padding:8px 12px;color:#6b7280;">Date & Time</td><td style="padding:8px 12px;font-weight:600;">${appointmentDate} ET</td></tr>
      ${appointment.google_meet_link ? `<tr style="background:#e8f4fd;"><td style="padding:8px 12px;color:#6b7280;">Google Meet</td><td style="padding:8px 12px;"><a href="${appointment.google_meet_link}" style="color:#4285F4;">${appointment.google_meet_link}</a></td></tr>` : ''}
      ${appointment.google_calendar_link ? `<tr><td style="padding:8px 12px;color:#6b7280;">Calendar Event</td><td style="padding:8px 12px;"><a href="${appointment.google_calendar_link}" style="color:#4A6741;">View in Google Calendar</a></td></tr>` : ''}
    </table>
    <div style="margin-top:16px;">
      <a href="https://medrevolve.base44.app/AdminDashboard" style="display:inline-block;background:#1f2d1f;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Open Admin Dashboard →</a>
    </div>
  </div>
</div>`;

    // Send emails in parallel (non-blocking errors)
    await Promise.allSettled([
      appointment.patient_email ? sendViaGmail(base44, {
        to: appointment.patient_email,
        subject: `✅ Appointment Confirmed — ${appointmentDate}`,
        html: patientHtml,
      }) : Promise.resolve(),
      sendViaGmail(base44, {
        to: adminEmail,
        subject: `📅 New Appointment — ${appointment.patient_email} · ${appointmentDate}`,
        html: adminHtml,
      }),
    ]);

    return Response.json({ success: true, message: 'Appointment notifications sent via Gmail' });

  } catch (error) {
    console.error('notifyAppointmentBooked error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});