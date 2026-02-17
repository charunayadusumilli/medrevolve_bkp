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

async function sendSMS(to, body) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!accountSid || !authToken || !fromPhone || !to) return;

  // Normalize phone number
  const normalized = to.replace(/\D/g, '');
  const phoneE164 = normalized.startsWith('1') ? `+${normalized}` : `+1${normalized}`;

  const params = new URLSearchParams({
    To: phoneE164,
    From: fromPhone,
    Body: body
  });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('SMS send error:', err);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    if (!data.provider_id || !data.appointment_date || !data.appointment_time || !data.type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return Response.json({ error: 'Appointment must be in the future' }, { status: 400 });
    }

    const provider = await base44.asServiceRole.entities.Provider.get(data.provider_id);
    const duration = DURATION_MAP[data.type] || 30;
    const typeLabel = TYPE_LABEL[data.type] || data.type;
    const patientName = user.full_name || user.email;
    const providerName = provider?.name || 'Licensed Provider';
    const providerTitle = provider?.title || '';
    const dateStr = formatDateLong(appointmentDateTime);
    const timeStr = formatTime(appointmentDateTime);

    // Create appointment
    const appointment = await base44.asServiceRole.entities.Appointment.create({
      provider_id: data.provider_id,
      patient_email: user.email,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: duration,
      type: data.type,
      reason: data.reason || '',
      notes: data.notes || '',
      status: 'scheduled',
      video_room_id: `room_${Date.now()}`
    });

    // ── EMAIL to patient ────────────────────────────────────────────────
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Care Team',
      to: user.email,
      subject: `✅ Appointment Confirmed — ${dateStr} at ${timeStr}`,
      body: `Hi ${patientName},

Your telehealth consultation has been confirmed! Here are your details:

━━━━━━━━━━━━━━━━━━━━━━
  APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
  Type:       ${typeLabel}
  Provider:   ${providerName}${providerTitle ? ', ' + providerTitle : ''}
  Date:       ${dateStr}
  Time:       ${timeStr}
  Duration:   ${duration} minutes
  Reason:     ${data.reason || 'Not specified'}
━━━━━━━━━━━━━━━━━━━━━━

HOW TO JOIN
Log in to your patient portal at medrevolve.com and navigate to "My Appointments" to start your video call at the scheduled time. We recommend joining 5 minutes early to test your connection.

WHAT TO PREPARE
• List of current medications and dosages
• Any recent lab results or medical records
• Questions you'd like to discuss

NEED TO RESCHEDULE?
You can cancel or reschedule up to 24 hours before your appointment through your patient portal.

We'll send you a reminder 24 hours before your appointment.

Warm regards,
MedRevolve Care Team
support@medrevolve.com
`
    });

    // ── EMAIL to admin ──────────────────────────────────────────────────
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Appointments',
        to: adminEmail,
        subject: `📅 New Appointment: ${patientName} — ${dateStr}`,
        body: `New appointment booked.

Patient:  ${patientName} (${user.email})
Provider: ${providerName}${providerTitle ? ', ' + providerTitle : ''}
Type:     ${typeLabel}
Date:     ${dateStr} at ${timeStr}
Duration: ${duration} min
Reason:   ${data.reason || 'N/A'}
Notes:    ${data.notes || 'None'}
Appt ID:  ${appointment.id}
Room:     ${appointment.video_room_id}
`
      });
    }

    // ── SMS to patient ──────────────────────────────────────────────────
    if (data.phone) {
      await sendSMS(
        data.phone,
        `MedRevolve: Your ${typeLabel} with ${providerName} is confirmed for ${dateStr} at ${timeStr}. Log in at medrevolve.com to join. Reply HELP for support.`
      );
    }

    return Response.json({
      success: true,
      appointment_id: appointment.id,
      appointment_date: appointmentDateTime.toISOString(),
      message: 'Appointment booked successfully'
    });

  } catch (error) {
    console.error('Error booking consultation:', error);
    return Response.json({ error: error.message || 'Failed to book appointment' }, { status: 500 });
  }
});