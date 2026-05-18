import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Shared Gmail send helper — sends from rned@medrevolve.com
async function sendViaGmail(base44, { to, subject, html }) {
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
  const result = await res.json();
  if (!res.ok) throw new Error(result.error?.message || 'Gmail send failed');
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
}

function formatDateLong(dt) {
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(dt) {
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const TYPE_LABEL = {
  initial_consultation: 'Initial Consultation',
  follow_up: 'Follow-Up',
  dosage_adjustment: 'Dosage Adjustment',
  general_inquiry: 'General Inquiry',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    let body = {};
    try { body = await req.json(); } catch {}

    // ── Cancellation flow ────────────────────────────────────────────────
    if (body.action === 'cancel' && body.appointment_id) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

      const appointment = await base44.asServiceRole.entities.Appointment.get(body.appointment_id);
      if (!appointment) return Response.json({ error: 'Not found' }, { status: 404 });
      if (appointment.patient_email !== user.email && user.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }

      await base44.asServiceRole.entities.Appointment.update(body.appointment_id, { status: 'cancelled' });

      const apptDt = new Date(appointment.appointment_date);
      const providerName = body.provider_name || 'your provider';
      const typeLabel = TYPE_LABEL[appointment.type] || appointment.type;

      await sendViaGmail(base44, {
        to: appointment.patient_email,
        subject: `Appointment Cancelled — ${formatDateLong(apptDt)}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#111;">Appointment Cancelled</h2>
            <p>Your <strong>${typeLabel}</strong> appointment on <strong>${formatDateLong(apptDt)} at ${formatTime(apptDt)}</strong> with ${providerName} has been cancelled.</p>
            <p>To reschedule, visit <a href="https://medrevolve.base44.app" style="color:#4A6741;">medrevolve.base44.app</a> or reply to this email.</p>
            <p style="color:#999;font-size:12px;">MedRevolve Care Team · rned@medrevolve.com</p>
          </div>
        `,
      });

      if (body.patient_phone) {
        await sendSMS(body.patient_phone, `MedRevolve: Your appointment on ${formatDateLong(apptDt)} at ${formatTime(apptDt)} has been cancelled. Book again at medrevolve.com.`);
      }

      return Response.json({ success: true, message: 'Appointment cancelled and notifications sent via Gmail' });
    }

    // ── Reminder flow (scheduled) ────────────────────────────────────────
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const appointments = await base44.asServiceRole.entities.Appointment.filter({ status: 'scheduled' });
    const upcoming = appointments.filter(a => {
      const d = new Date(a.appointment_date);
      return d >= windowStart && d <= windowEnd;
    });

    let sent = 0;
    for (const appt of upcoming) {
      const apptDt = new Date(appt.appointment_date);
      let providerName = 'your provider';
      try {
        const prov = await base44.asServiceRole.entities.Provider.get(appt.provider_id);
        if (prov) providerName = `${prov.name}${prov.title ? ', ' + prov.title : ''}`;
      } catch {}

      const typeLabel = TYPE_LABEL[appt.type] || appt.type;

      await sendViaGmail(base44, {
        to: appt.patient_email,
        subject: `⏰ Reminder: ${typeLabel} tomorrow at ${formatTime(apptDt)}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#111;">Appointment Reminder</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
              <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;">Type</td><td style="padding:8px 12px;font-weight:600;">${typeLabel}</td></tr>
              <tr><td style="padding:8px 12px;color:#6b7280;">Provider</td><td style="padding:8px 12px;">${providerName}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;">Date</td><td style="padding:8px 12px;font-weight:600;">${formatDateLong(apptDt)}</td></tr>
              <tr><td style="padding:8px 12px;color:#6b7280;">Time</td><td style="padding:8px 12px;font-weight:600;">${formatTime(apptDt)}</td></tr>
            </table>
            <p>Join your video call from your <a href="https://medrevolve.base44.app" style="color:#4A6741;">patient portal</a>. We recommend joining 5 minutes early.</p>
            <p style="color:#999;font-size:12px;">MedRevolve Care Team · rned@medrevolve.com</p>
          </div>
        `,
      });
      sent++;
    }

    return Response.json({ success: true, reminders_sent: sent });
  } catch (error) {
    console.error('sendAppointmentReminder error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});