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
     patient_email: data.patient_email || user.email,
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

    // ── EMAIL to patient (HTML) ─────────────────────────────────────────
    const patientEmailTo = data.patient_email || user.email;
    const statusBadgeColor = data.provider_id ? '#22c55e' : '#f59e0b';
    const statusLabel = data.provider_id ? '✅ Confirmed' : '⏳ Pending Provider Assignment';
    const providerDisplay = data.provider_id
      ? `${providerName}${providerTitle ? ', ' + providerTitle : ''}`
      : 'Will be assigned within 2 hours';

    const patientEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment ${data.provider_id ? 'Confirmed' : 'Request Received'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER / LOGO -->
        <tr><td style="background:linear-gradient(135deg,#2D3A2D 0%,#4A6741 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <div style="width:40px;height:40px;background:rgba(255,255,255,0.15);border-radius:10px;display:inline-block;line-height:40px;font-size:20px;">🌿</div>
            <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">MedRevolve</span>
          </div>
          <p style="color:rgba(255,255,255,0.65);font-size:13px;margin:8px 0 0;">Personalized telehealth, delivered to your door</p>
        </td></tr>

        <!-- STATUS BANNER -->
        <tr><td style="background:#ffffff;padding:28px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:${statusBadgeColor}18;border:1.5px solid ${statusBadgeColor}40;border-radius:10px;padding:14px 20px;">
                <span style="color:${statusBadgeColor};font-weight:700;font-size:15px;">${statusLabel}</span>
                <p style="margin:4px 0 0;color:#4b5563;font-size:13px;">
                  ${data.provider_id
                    ? 'Your telehealth consultation is confirmed. Everything is set — see details below.'
                    : 'We received your request. Our care team will assign the best available provider within 2 hours and send you their profile + video link.'}
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- GREETING -->
        <tr><td style="background:#ffffff;padding:24px 40px 0;">
          <p style="margin:0;font-size:16px;color:#1f2937;">Hi <strong>${patientName}</strong>,</p>
          <p style="margin:8px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
            ${data.provider_id
              ? 'Your telehealth consultation has been booked successfully. Here is everything you need to know:'
              : 'Your appointment request has been received! Here is a summary of what you submitted:'}
          </p>
        </td></tr>

        <!-- APPOINTMENT DETAILS CARD -->
        <tr><td style="background:#ffffff;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr><td style="background:#4A6741;padding:12px 20px;">
              <span style="color:#ffffff;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">📋 Appointment Details</span>
            </td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40%" style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;font-weight:600;">Appointment Type</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:500;">${typeLabel}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;font-weight:600;">Provider</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:500;">${providerDisplay}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;font-weight:600;">📅 Date</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:500;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;font-weight:600;">🕐 Time</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:500;">${timeStr}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;font-weight:600;">⏱ Duration</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:500;">${duration} minutes</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;">Reason</td>
                  <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:500;">${data.reason}</td>
                </tr>
                ${data.notes ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;border-top:1px solid #f3f4f6;">Notes</td><td style="padding:8px 0;color:#111827;font-size:13px;font-weight:500;border-top:1px solid #f3f4f6;">${data.notes}</td></tr>` : ''}
              </table>
            </td></tr>
            <tr><td style="background:#f0fdf4;padding:10px 20px;border-top:1px solid #d1fae5;">
              <span style="color:#166534;font-size:12px;">🔒 Appointment ID: <strong>${appointment.id}</strong></span>
            </td></tr>
          </table>
        </td></tr>

        ${!data.provider_id ? `
        <!-- NEXT STEPS -->
        <tr><td style="background:#ffffff;padding:0 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;">
            <tr><td style="padding:0 0 10px;">
              <span style="color:#92400e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">⚡ What Happens Next</span>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">✅ &nbsp;Our care team reviews your request immediately</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">✅ &nbsp;We match you with the best available provider for your needs</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">✅ &nbsp;You receive an email with provider profile + video call link</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#78350f;">✅ &nbsp;All of this happens within <strong>2 hours</strong></td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>` : ''}

        <!-- HOW TO JOIN -->
        <tr><td style="background:#ffffff;padding:0 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;">
            <tr><td style="padding:0 0 12px;">
              <span style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">🎥 How to Join Your Call</span>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">1. &nbsp;Log in to your Patient Portal at medrevolve.com</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">2. &nbsp;Navigate to <strong>"My Appointments"</strong></td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">3. &nbsp;Click <strong>"Join Video Call"</strong> at your scheduled time</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">4. &nbsp;Join <strong>5 minutes early</strong> to test your camera & mic</td></tr>
              </table>
            </td></tr>
            <tr><td style="padding-top:16px;">
              <a href="https://medrevolve.com/patient-portal" style="display:inline-block;background:#4A6741;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">Go to My Patient Portal →</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- PREPARE / REMIND -->
        <tr><td style="background:#ffffff;padding:0 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
            <tr><td style="padding:0 0 12px;">
              <span style="color:#1e40af;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">📝 What to Prepare</span>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:13px;color:#334155;">💊 &nbsp;List of current medications and dosages</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#334155;">🧪 &nbsp;Any recent lab results or medical records</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#334155;">❓ &nbsp;Questions you would like to discuss with your provider</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#334155;">📱 &nbsp;A device with a working camera and microphone</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- RESCHEDULE / REMINDER NOTE -->
        <tr><td style="background:#ffffff;padding:0 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;">
            <tr><td style="font-size:13px;color:#991b1b;">
              <strong>⏰ Reminder:</strong> You will receive an automatic reminder email <strong>24 hours before</strong> your appointment.<br/><br/>
              <strong>🔁 Need to Reschedule?</strong> Cancel or reschedule up to <strong>24 hours before</strong> your appointment through your Patient Portal at no charge.
            </td></tr>
          </table>
        </td></tr>

        <!-- CONTACT CARD -->
        <tr><td style="background:#ffffff;padding:0 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
            <tr><td style="padding:0 0 12px;">
              <span style="color:#374151;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">📞 Contact Us</span>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#374151;">📧 Email: <a href="mailto:support@medrevolve.com" style="color:#4A6741;text-decoration:none;font-weight:600;">support@medrevolve.com</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#374151;">🌐 Portal: <a href="https://medrevolve.com/patient-portal" style="color:#4A6741;text-decoration:none;font-weight:600;">medrevolve.com/patient-portal</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#374151;">📚 How It Works: <a href="https://medrevolve.com/how-it-works" style="color:#4A6741;text-decoration:none;font-weight:600;">medrevolve.com/how-it-works</a></td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#2D3A2D;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
          <div style="margin-bottom:12px;">
            <span style="color:#ffffff;font-size:16px;font-weight:700;">MedRevolve</span>
            <span style="color:rgba(255,255,255,0.4);font-size:13px;"> · </span>
            <a href="https://medrevolve.com" style="color:rgba(255,255,255,0.6);font-size:13px;text-decoration:none;">medrevolve.com</a>
          </div>
          <div style="margin-bottom:14px;">
            <a href="https://medrevolve.com/patient-portal" style="color:rgba(255,255,255,0.7);font-size:12px;text-decoration:none;margin:0 8px;">Patient Portal</a>
            <span style="color:rgba(255,255,255,0.3);">|</span>
            <a href="https://medrevolve.com/consultations" style="color:rgba(255,255,255,0.7);font-size:12px;text-decoration:none;margin:0 8px;">Consultations</a>
            <span style="color:rgba(255,255,255,0.3);">|</span>
            <a href="https://medrevolve.com/privacy" style="color:rgba(255,255,255,0.7);font-size:12px;text-decoration:none;margin:0 8px;">Privacy Policy</a>
            <span style="color:rgba(255,255,255,0.3);">|</span>
            <a href="https://medrevolve.com/terms" style="color:rgba(255,255,255,0.7);font-size:12px;text-decoration:none;margin:0 8px;">Terms of Service</a>
          </div>
          <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:0 0 8px;">
            Telehealth services provided by licensed providers through affiliated medical groups.<br/>
            © 2024 MedRevolve. All rights reserved.
          </p>
          <p style="margin:0;">
            <a href="https://medrevolve.com/unsubscribe?email=${encodeURIComponent(patientEmailTo)}" style="color:rgba(255,255,255,0.3);font-size:11px;text-decoration:underline;">Unsubscribe from appointment emails</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Care Team',
        to: patientEmailTo,
        subject: data.provider_id ? `✅ Appointment Confirmed — ${dateStr} at ${timeStr}` : `📋 Appointment Request Received — ${dateStr} at ${timeStr}`,
        body: patientEmailHtml
      });
    } catch (emailErr) {
      console.error('Patient email send error:', emailErr);
    }

    // ── EMAIL to admin (HTML) ───────────────────────────────────────────
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const urgentColor = !data.provider_id ? '#dc2626' : '#16a34a';
    const urgentLabel = !data.provider_id ? '⚠️ ACTION REQUIRED — Assign Provider' : '✅ Appointment Confirmed';

    const adminEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:24px 16px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1a2a1a 0%,#2D3A2D 100%);border-radius:14px 14px 0 0;padding:24px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><span style="color:#ffffff;font-size:20px;font-weight:700;">🌿 MedRevolve</span><br/><span style="color:rgba(255,255,255,0.5);font-size:12px;">Admin Notification — Platform Alert</span></td>
              <td align="right"><span style="background:${urgentColor};color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:0.5px;">NEW APPOINTMENT</span></td>
            </tr>
          </table>
        </td></tr>

        <!-- URGENT BANNER -->
        <tr><td style="background:${urgentColor}18;border-left:4px solid ${urgentColor};padding:14px 36px;">
          <span style="color:${urgentColor};font-size:14px;font-weight:700;">${urgentLabel}</span>
          ${!data.provider_id ? `<p style="margin:4px 0 0;font-size:13px;color:#7f1d1d;">A patient has submitted an appointment request with no provider assigned. Please assign one within 2 hours to maintain our SLA.</p>` : `<p style="margin:4px 0 0;font-size:13px;color:#14532d;">This appointment is confirmed. Review details below and ensure the provider is ready.</p>`}
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:28px 36px;">

          <!-- Patient Card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:20px;">
            <tr><td style="background:#1e293b;border-radius:10px 10px 0 0;padding:10px 18px;">
              <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Patient Information</span>
            </td></tr>
            <tr><td style="padding:16px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="35%" style="padding:5px 0;font-size:12px;color:#64748b;font-weight:600;">Full Name</td>
                  <td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${patientName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:12px;color:#64748b;font-weight:600;">Email</td>
                  <td style="padding:5px 0;font-size:13px;color:#111827;"><a href="mailto:${patientEmailTo}" style="color:#4A6741;text-decoration:none;">${patientEmailTo}</a></td>
                </tr>
                ${data.phone ? `<tr><td style="padding:5px 0;font-size:12px;color:#64748b;font-weight:600;">Phone</td><td style="padding:5px 0;font-size:13px;color:#111827;"><a href="tel:${data.phone}" style="color:#4A6741;text-decoration:none;">${data.phone}</a></td></tr>` : ''}
              </table>
            </td></tr>
          </table>

          <!-- Appointment Card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:20px;">
            <tr><td style="background:#4A6741;border-radius:10px 10px 0 0;padding:10px 18px;">
              <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Appointment Details</span>
            </td></tr>
            <tr><td style="padding:16px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="35%" style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">Type</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;">${typeLabel}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">Provider</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:${!data.provider_id ? '#dc2626' : '#111827'};font-weight:${!data.provider_id ? '700' : '400'};">${!data.provider_id ? '⚠️ NOT ASSIGNED' : providerDisplay}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">📅 Date</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">🕐 Time</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;">${timeStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">Duration</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;">${duration} minutes</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">Reason</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;">${data.reason}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600;">Notes</td>
                  <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;">${data.notes || 'None'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#64748b;font-weight:600;">Status</td>
                  <td style="padding:6px 0;font-size:13px;"><span style="background:${appointment.status === 'scheduled' ? '#dcfce7' : '#fef9c3'};color:${appointment.status === 'scheduled' ? '#166534' : '#854d0e'};padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;">${appointment.status}</span></td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="background:#f0fdf4;border-radius:0 0 10px 10px;padding:8px 18px;border-top:1px solid #d1fae5;">
              <span style="color:#166534;font-size:11px;">🔒 ID: <strong>${appointment.id}</strong> &nbsp;·&nbsp; Room: <strong>${appointment.video_room_id}</strong></span>
            </td></tr>
          </table>

          <!-- Action Checklist -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${!data.provider_id ? '#fef2f2' : '#f0fdf4'};border:1px solid ${!data.provider_id ? '#fecaca' : '#bbf7d0'};border-radius:10px;margin-bottom:20px;">
            <tr><td style="background:${!data.provider_id ? '#dc2626' : '#16a34a'};border-radius:10px 10px 0 0;padding:10px 18px;">
              <span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Action Checklist</span>
            </td></tr>
            <tr><td style="padding:16px 18px;">
              <table cellpadding="0" cellspacing="0">
                ${!data.provider_id ? `
                <tr><td style="padding:4px 0;font-size:13px;color:#7f1d1d;">☐ &nbsp;<strong>URGENT:</strong> Assign a provider in the Admin Dashboard</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#7f1d1d;">☐ &nbsp;Update appointment status to "scheduled"</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#7f1d1d;">☐ &nbsp;Patient notified automatically once provider assigned</td></tr>
                ` : `
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☑ &nbsp;Appointment confirmed — patient emailed</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Confirm provider has been notified</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#166534;">☐ &nbsp;Ensure video room is ready before appointment</td></tr>
                `}
                <tr><td style="padding:4px 0;font-size:13px;color:${!data.provider_id ? '#7f1d1d' : '#166534'};">☐ &nbsp;Send reminder 24 hours before appointment</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:${!data.provider_id ? '#7f1d1d' : '#166534'};">☐ &nbsp;Follow up with patient after consultation</td></tr>
              </table>
              <div style="margin-top:14px;">
                <a href="https://medrevolve.com/admin-dashboard" style="display:inline-block;background:#2D3A2D;color:#ffffff;font-size:13px;font-weight:600;padding:10px 22px;border-radius:8px;text-decoration:none;">Open Admin Dashboard →</a>
              </div>
            </td></tr>
          </table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:20px 36px;text-align:center;">
          <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 6px;">This is an internal admin notification from MedRevolve Platform.</p>
          <a href="https://medrevolve.com/admin-dashboard" style="color:rgba(255,255,255,0.55);font-size:12px;text-decoration:none;">medrevolve.com/admin-dashboard</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Platform',
        to: adminEmail,
        subject: `📅 New Appointment${!data.provider_id ? ' [ASSIGN PROVIDER]' : ' ✅ Confirmed'} — ${patientName} · ${dateStr}`,
        body: adminEmailHtml
      });
    } catch (adminEmailErr) {
      console.error('Admin email send error:', adminEmailErr);
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