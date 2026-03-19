import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Entity automation handler — triggers Gmail notifications for all major workflow events
// Receives: { event: { type, entity_name, entity_id }, data, old_data }

const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';

const templates = {
  // ── Appointments ──────────────────────────────────────────────
  Appointment_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `📅 New Appointment Booked — ${d.type?.replace(/_/g, ' ')}`,
    html: `
      <h2>New Appointment Booked</h2>
      <p><b>Patient:</b> ${d.patient_email}</p>
      <p><b>Type:</b> ${d.type?.replace(/_/g, ' ')}</p>
      <p><b>Date:</b> ${d.appointment_date ? new Date(d.appointment_date).toLocaleString() : 'TBD'}</p>
      <p><b>Reason:</b> ${d.reason || '—'}</p>
    `,
  }),
  Appointment_update: (d, old) => {
    if (!old || d.status === old.status) return null;
    return {
      to: d.patient_email || ADMIN_EMAIL,
      subject: `🔔 Appointment Status Updated: ${d.status?.replace(/_/g, ' ')}`,
      html: `
        <h2>Your Appointment Has Been Updated</h2>
        <p><b>Status:</b> ${d.status?.replace(/_/g, ' ')}</p>
        <p><b>Type:</b> ${d.type?.replace(/_/g, ' ')}</p>
        <p><b>Date:</b> ${d.appointment_date ? new Date(d.appointment_date).toLocaleString() : 'TBD'}</p>
        ${d.follow_up_instructions ? `<p><b>Instructions:</b> ${d.follow_up_instructions}</p>` : ''}
      `,
    };
  },

  // ── Prescriptions ─────────────────────────────────────────────
  Prescription_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `💊 New Prescription Created — ${d.medication_name}`,
    html: `
      <h2>New Prescription</h2>
      <p><b>Patient:</b> ${d.patient_email}</p>
      <p><b>Medication:</b> ${d.medication_name} ${d.dosage}</p>
      <p><b>Provider:</b> ${d.provider_name || d.provider_id}</p>
      <p><b>Status:</b> ${d.status}</p>
    `,
  }),
  Prescription_update: (d, old) => {
    if (!old || d.status === old.status) return null;
    const notifyPatient = ['sent_to_pharmacy', 'dispensed', 'completed'].includes(d.status);
    return {
      to: notifyPatient ? d.patient_email : ADMIN_EMAIL,
      subject: `💊 Prescription Update: ${d.medication_name} — ${d.status?.replace(/_/g, ' ')}`,
      html: `
        <h2>Prescription Status Update</h2>
        <p><b>Medication:</b> ${d.medication_name} ${d.dosage}</p>
        <p><b>Status:</b> ${d.status?.replace(/_/g, ' ')}</p>
        ${d.pharmacy_name ? `<p><b>Pharmacy:</b> ${d.pharmacy_name}</p>` : ''}
        ${d.rx_number ? `<p><b>Rx #:</b> ${d.rx_number}</p>` : ''}
      `,
    };
  },

  // ── Patient Intake ────────────────────────────────────────────
  CustomerIntake_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🌱 New Patient Intake — ${d.full_name}`,
    html: `
      <h2>New Patient Intake Submitted</h2>
      <p><b>Name:</b> ${d.full_name}</p>
      <p><b>Email:</b> ${d.email}</p>
      <p><b>Interest:</b> ${d.primary_interest}</p>
      <p><b>Consultation Preference:</b> ${d.consultation_preference}</p>
    `,
  }),

  // ── Provider Applications ─────────────────────────────────────
  ProviderIntake_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `👨‍⚕️ New Provider Application — ${d.full_name}`,
    html: `
      <h2>New Provider Application</h2>
      <p><b>Name:</b> ${d.full_name} (${d.title})</p>
      <p><b>Email:</b> ${d.email}</p>
      <p><b>Specialty:</b> ${d.specialty}</p>
      <p><b>License #:</b> ${d.license_number}</p>
    `,
  }),
  ProviderIntake_update: (d, old) => {
    if (!old || d.status === old.status) return null;
    return {
      to: d.email,
      subject: `Your Provider Application: ${d.status?.replace(/_/g, ' ')}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${d.full_name},</p>
        <p>Your provider application status has been updated to: <b>${d.status?.replace(/_/g, ' ')}</b>.</p>
        ${d.status === 'approved' ? '<p>Welcome to MedRevolve! Our team will be in touch shortly.</p>' : ''}
      `,
    };
  },

  // ── Pharmacy Applications ─────────────────────────────────────
  PharmacyIntake_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🏪 New Pharmacy Application — ${d.pharmacy_name}`,
    html: `
      <h2>New Pharmacy Application</h2>
      <p><b>Pharmacy:</b> ${d.pharmacy_name}</p>
      <p><b>Contact:</b> ${d.contact_name} (${d.email})</p>
      <p><b>Type:</b> ${d.pharmacy_type}</p>
      <p><b>License #:</b> ${d.license_number}</p>
    `,
  }),

  // ── Creator Applications ──────────────────────────────────────
  CreatorApplication_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🎯 New Creator Application — ${d.full_name}`,
    html: `
      <h2>New Creator Application</h2>
      <p><b>Name:</b> ${d.full_name}</p>
      <p><b>Platform:</b> ${d.platform} — @${d.platform_handle}</p>
      <p><b>Followers:</b> ${d.followers_count}</p>
      <p><b>Email:</b> ${d.email}</p>
    `,
  }),

  // ── Business Inquiries ────────────────────────────────────────
  BusinessInquiry_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🏢 New Business Inquiry — ${d.company_name}`,
    html: `
      <h2>New Business Inquiry</h2>
      <p><b>Company:</b> ${d.company_name}</p>
      <p><b>Contact:</b> ${d.contact_name} (${d.email})</p>
      <p><b>Interest:</b> ${d.interest_type}</p>
      <p><b>Industry:</b> ${d.industry}</p>
      <p><b>Message:</b> ${d.message || '—'}</p>
    `,
  }),

  // ── Contact Requests ──────────────────────────────────────────
  ContactRequest_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `📬 New Contact Request — ${d.subject || 'General Inquiry'}`,
    html: `
      <h2>New Contact Request</h2>
      <p><b>From:</b> ${d.name} (${d.email})</p>
      <p><b>Subject:</b> ${d.subject || '—'}</p>
      <p><b>Message:</b> ${d.message}</p>
    `,
  }),

  // ── Consultation Bookings ─────────────────────────────────────
  ConsultationBooking_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🩺 New Consultation Booking — ${d.patient_email}`,
    html: `
      <h2>New Consultation Booking</h2>
      <p><b>Patient:</b> ${d.patient_email}</p>
      <p><b>Type:</b> ${d.consultation_type?.replace(/_/g, ' ')}</p>
      <p><b>Invoice:</b> ${d.invoice_number || '—'}</p>
      <p><b>Amount:</b> $${((d.amount || 0) / 100).toFixed(2)}</p>
    `,
  }),
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { event, data, old_data } = payload;

    const key = `${event.entity_name}_${event.type}`;
    const templateFn = templates[key];

    if (!templateFn) {
      console.log(`No template for ${key}, skipping`);
      return Response.json({ skipped: true, key });
    }

    const emailData = templateFn(data || {}, old_data || {});
    if (!emailData) {
      console.log(`Template returned null for ${key}, skipping`);
      return Response.json({ skipped: true, reason: 'no change' });
    }

    // Send via Gmail
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'noreply@medrevolve.com';
    const emailLines = [
      `From: MedRevolve <${adminEmail}>`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      emailData.html,
    ];
    const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    const gmailData = await gmailRes.json();
    if (!gmailRes.ok) {
      console.error('Gmail send error:', JSON.stringify(gmailData));
      return Response.json({ error: gmailData.error?.message }, { status: 500 });
    }

    console.log(`✅ Notification sent [${key}] to ${emailData.to}, messageId: ${gmailData.id}`);
    return Response.json({ success: true, key, messageId: gmailData.id });
  } catch (error) {
    console.error('workflowNotifications error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});