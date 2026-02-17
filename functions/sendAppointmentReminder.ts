import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Called by a scheduled automation — runs every hour and sends reminders for appointments ~24h away.
// Also handles cancellation notifications when called directly with { action: 'cancel', appointment_id }.

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
  general_inquiry: 'General Inquiry'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body = {};
    try { body = await req.json(); } catch {}

    // ── Cancellation flow ───────────────────────────────────────────────
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

      // Email patient
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Care Team',
        to: appointment.patient_email,
        subject: `Appointment Cancelled — ${formatDateLong(apptDt)}`,
        body: `Hi,

Your ${typeLabel} appointment scheduled for ${formatDateLong(apptDt)} at ${formatTime(apptDt)} with ${providerName} has been cancelled.

If you'd like to reschedule, please visit medrevolve.com/book or contact us at support@medrevolve.com.

MedRevolve Care Team
`
      });

      // SMS
      if (body.patient_phone) {
        await sendSMS(body.patient_phone, `MedRevolve: Your appointment on ${formatDateLong(apptDt)} at ${formatTime(apptDt)} has been cancelled. Book again at medrevolve.com.`);
      }

      return Response.json({ success: true, message: 'Appointment cancelled and notifications sent' });
    }

    // ── Reminder flow (scheduled / admin) ──────────────────────────────
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23h from now
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);   // 25h from now

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

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Reminders',
        to: appt.patient_email,
        subject: `⏰ Reminder: ${typeLabel} tomorrow at ${formatTime(apptDt)}`,
        body: `Hi,

This is a friendly reminder that you have an upcoming appointment tomorrow.

━━━━━━━━━━━━━━━━━━━━━━
  APPOINTMENT REMINDER
━━━━━━━━━━━━━━━━━━━━━━
  Type:      ${typeLabel}
  Provider:  ${providerName}
  Date:      ${formatDateLong(apptDt)}
  Time:      ${formatTime(apptDt)}
━━━━━━━━━━━━━━━━━━━━━━

Join your video call from your patient portal at medrevolve.com. We recommend joining 5 minutes early.

Questions? Reply to this email or visit medrevolve.com.

MedRevolve Care Team
`
      });
      sent++;
    }

    return Response.json({ success: true, reminders_sent: sent });

  } catch (error) {
    console.error('Reminder error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});