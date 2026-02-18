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
    const data = await req.json();

    // Validate required fields (provider_id is now optional)
    if (!data.appointment_date || !data.appointment_time || !data.type || !data.reason || !data.patient_email) {
      return Response.json({ error: 'Missing required fields: appointment_date, appointment_time, type, reason, patient_email' }, { status: 400 });
    }

    let user = null;
    try {
      user = await base44.auth.me();
    } catch (e) {
      // User not authenticated - use patient_email from form
      user = { email: data.patient_email, full_name: data.patient_name || null };
    }

    const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return Response.json({ error: 'Appointment must be in the future' }, { status: 400 });
    }

    // Fetch provider if selected, otherwise null
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
    const providerName = provider?.name || 'To Be Assigned';
    const providerTitle = provider?.title || '';
    const dateStr = formatDateLong(appointmentDateTime);
    const timeStr = formatTime(appointmentDateTime);

    // Create appointment (provider_id optional, will be assigned later if not provided)
    const appointmentData = {
      patient_email: user.email,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: duration,
      type: data.type,
      reason: data.reason,
      notes: data.notes || '',
      status: data.provider_id ? 'scheduled' : 'pending',
      video_room_id: `room_${Date.now()}`
    };
    
    if (data.provider_id) {
      appointmentData.provider_id = data.provider_id;
    }

    const appointment = await base44.asServiceRole.entities.Appointment.create(appointmentData);

    // ── EMAIL to patient ────────────────────────────────────────────────
    const providerSection = data.provider_id 
      ? `  Provider:   ${providerName}${providerTitle ? ', ' + providerTitle : ''}`
      : `  Provider:   Will be assigned shortly`;
    
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Care Team',
        to: user.email,
        subject: data.provider_id ? `✅ Appointment Confirmed — ${dateStr} at ${timeStr}` : `📋 Appointment Request Received — ${dateStr} at ${timeStr}`,
        body: `Hi ${patientName},

${data.provider_id ? 'Your telehealth consultation has been confirmed!' : 'Your appointment request has been received and we are assigning the best available provider.'} Here are your details:

━━━━━━━━━━━━━━━━━━━━━━
  APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
  Type:       ${typeLabel}
${providerSection}
  Date:       ${dateStr}
  Time:       ${timeStr}
  Duration:   ${duration} minutes
  Reason:     ${data.reason}
━━━━━━━━━━━━━━━━━━━━━━

${!data.provider_id ? `NEXT STEPS
We will match you with the best available provider based on your needs and send you a follow-up email with their profile and a video call link. This typically happens within 2 hours.

` : ''}HOW TO JOIN
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
    } catch (emailErr) {
      console.error('Patient email send error:', emailErr);
    }

    // ── EMAIL to admin ──────────────────────────────────────────────────
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Appointments',
          to: adminEmail,
          subject: `📅 New Appointment: ${patientName} — ${dateStr}${!data.provider_id ? ' [NEEDS PROVIDER ASSIGNMENT]' : ''}`,
          body: `New appointment ${data.provider_id ? 'booked' : 'request received (needs provider assignment)'}.

Patient:  ${patientName} (${user.email})
Provider: ${providerName}${providerTitle ? ', ' + providerTitle : ''}
Type:     ${typeLabel}
Date:     ${dateStr} at ${timeStr}
Duration: ${duration} min
Reason:   ${data.reason}
Notes:    ${data.notes || 'None'}
Appt ID:  ${appointment.id}
Room:     ${appointment.video_room_id}
Status:   ${appointment.status}
${data.phone ? `Phone:    ${data.phone}` : ''}

${!data.provider_id ? 'ACTION REQUIRED: Please assign a provider and update the appointment to trigger patient notification with provider details.' : ''}
`
        });
      } catch (adminEmailErr) {
        console.error('Admin email send error:', adminEmailErr);
      }
    }

    // ── SMS to patient ──────────────────────────────────────────────────
    if (data.phone) {
      try {
        await sendSMS(
          data.phone,
          data.provider_id
            ? `MedRevolve: Your ${typeLabel} with ${providerName} is confirmed for ${dateStr} at ${timeStr}. Log in at medrevolve.com to join. Reply HELP for support.`
            : `MedRevolve: Your ${typeLabel} appointment request for ${dateStr} at ${timeStr} is received. We are assigning a provider and will send details via email within 2 hours.`
        );
      } catch (smsErr) {
        console.error('SMS send error:', smsErr);
      }
    }

    return Response.json({
      success: true,
      appointment_id: appointment.id,
      appointment_date: appointmentDateTime.toISOString(),
      provider_assigned: !!data.provider_id,
      message: data.provider_id ? 'Appointment booked successfully' : 'Appointment request submitted. Provider will be assigned shortly.'
    });

  } catch (error) {
    console.error('Error booking consultation:', error);
    return Response.json({ error: error.message || 'Failed to book appointment' }, { status: 500 });
  }
});