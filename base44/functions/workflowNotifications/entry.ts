import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Entity automation handler — triggers Gmail notifications for all major workflow events
// Receives: { event: { type, entity_name, entity_id }, data, old_data }

const ADMIN_EMAIL = 'rned@medrevolve.com';

// Shared branded email wrapper
function brandedEmail({ icon, title, subtitle, rows, actionUrl, actionLabel, footerNote }) {
  const rowsHtml = rows.map(([label, value, highlight]) =>
    `<tr style="${highlight ? 'background:#f0fdf4;' : ''}">
      <td style="padding:8px 16px;font-size:12px;color:#9ca3af;font-weight:600;width:38%;">${label}</td>
      <td style="padding:8px 16px;font-size:13px;color:#111827;font-weight:${highlight ? '700' : '400'};">${value || '—'}</td>
    </tr>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:28px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:12px 12px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:16px;font-weight:700;">🌿 MedRevolve</span><br/><span style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.05em;">ADMIN NOTIFICATION</span></td>
      <td align="right" style="font-size:22px;">${icon}</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:20px 28px;">
    <div style="margin-bottom:16px;">
      <div style="font-size:17px;font-weight:700;color:#111827;">${title}</div>
      ${subtitle ? `<div style="font-size:13px;color:#6b7280;margin-top:3px;">${subtitle}</div>` : ''}
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      ${rowsHtml}
    </table>
    ${actionUrl ? `<div style="margin-top:18px;"><a href="${actionUrl}" style="display:inline-block;background:#2D3A2D;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">${actionLabel || 'View →'}</a></div>` : ''}
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 12px 12px;padding:12px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">${footerNote || 'Internal notification — MedRevolve Platform · rned@medrevolve.com'}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// Patient-facing branded email wrapper
function patientEmail({ firstName, title, subtitle, rows, meetLink, calLink, bodyHtml }) {
  const rowsHtml = (rows || []).map(([label, value]) =>
    `<tr><td style="padding:7px 16px;font-size:12px;color:#9ca3af;font-weight:600;width:38%;border-bottom:1px solid #f3f4f6;">${label}</td>
     <td style="padding:7px 16px;font-size:13px;color:#111827;border-bottom:1px solid #f3f4f6;">${value || '—'}</td></tr>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:28px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
    <div style="font-size:28px;margin-bottom:6px;">🌿</div>
    <div style="color:#fff;font-size:21px;font-weight:800;">${title}</div>
    ${subtitle ? `<div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:4px;">${subtitle}</div>` : ''}
  </td></tr>
  <tr><td style="background:#fff;padding:24px 32px;">
    ${firstName ? `<p style="font-size:16px;color:#111827;">Hi <strong>${firstName}</strong> 👋</p>` : ''}
    ${bodyHtml || ''}
    ${rows?.length ? `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-top:16px;">${rowsHtml}</table>` : ''}
    ${meetLink ? `<div style="text-align:center;margin-top:20px;"><a href="${meetLink}" style="display:inline-block;background:#4285F4;color:#fff;font-size:14px;font-weight:700;padding:13px 28px;border-radius:8px;text-decoration:none;">🎥 Join Google Meet →</a></div>` : ''}
    ${calLink ? `<div style="margin-top:12px;text-align:center;"><a href="${calLink}" style="font-size:13px;color:#4A6741;text-decoration:none;">+ Add to Google Calendar</a></div>` : ''}
    <div style="margin-top:20px;padding:12px 16px;background:#f9fafb;border-radius:8px;font-size:12px;color:#6b7280;text-align:center;">
      Questions? Reply to this email or contact <a href="mailto:rned@medrevolve.com" style="color:#4A6741;">rned@medrevolve.com</a>
    </div>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 12px 12px;padding:14px 32px;text-align:center;">
    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">© 2025 MedRevolve · rned@medrevolve.com · Telehealth by licensed providers</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const templates = {
  // ── Appointments ──────────────────────────────────────────────
  Appointment_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `📅 New Appointment — ${d.type?.replace(/_/g, ' ')} · ${d.patient_email}`,
    html: brandedEmail({
      icon: '📅', title: 'New Appointment Booked',
      subtitle: `${d.type?.replace(/_/g, ' ')} — ${d.patient_email}`,
      rows: [
        ['Patient', d.patient_email],
        ['Type', d.type?.replace(/_/g, ' ')],
        ['Date & Time', d.appointment_date ? new Date(d.appointment_date).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET' : 'TBD', true],
        ['Reason', d.reason],
        ['Status', d.status],
        ...(d.google_meet_link ? [['🎥 Meet Link', `<a href="${d.google_meet_link}" style="color:#4285F4;">${d.google_meet_link}</a>`]] : []),
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'Open Admin Dashboard →',
    }),
  }),

  Appointment_update: (d, old) => {
    if (!old || d.status === old.status) return null;
    const isPatientFacing = ['confirmed', 'completed', 'cancelled'].includes(d.status);
    if (isPatientFacing && d.patient_email) {
      return {
        to: d.patient_email,
        subject: `🔔 Your Appointment: ${d.status?.replace(/_/g, ' ')}`,
        html: patientEmail({
          firstName: d.patient_email?.split('@')[0],
          title: `Appointment ${d.status?.replace(/_/g, ' ')}`,
          subtitle: 'MedRevolve Telehealth',
          rows: [
            ['Type', d.type?.replace(/_/g, ' ')],
            ['Date & Time', d.appointment_date ? new Date(d.appointment_date).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET' : 'TBD'],
            ['Status', d.status?.replace(/_/g, ' ')],
          ],
          meetLink: d.google_meet_link,
          calLink: d.google_calendar_link,
          bodyHtml: d.follow_up_instructions ? `<div style="padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;margin-bottom:12px;"><strong>📋 Follow-up Instructions:</strong><br/>${d.follow_up_instructions}</div>` : '',
        }),
      };
    }
    return {
      to: ADMIN_EMAIL,
      subject: `🔔 Appointment Status Changed: ${d.status} — ${d.patient_email}`,
      html: brandedEmail({
        icon: '🔔', title: 'Appointment Status Updated',
        rows: [
          ['Patient', d.patient_email],
          ['New Status', d.status?.replace(/_/g, ' '), true],
          ['Previous', old.status?.replace(/_/g, ' ')],
          ['Type', d.type?.replace(/_/g, ' ')],
          ['Date', d.appointment_date ? new Date(d.appointment_date).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET' : 'TBD'],
        ],
        actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
        actionLabel: 'Open Admin Dashboard →',
      }),
    };
  },

  // ── Prescriptions ─────────────────────────────────────────────
  Prescription_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `💊 New Prescription — ${d.medication_name} · ${d.patient_email}`,
    html: brandedEmail({
      icon: '💊', title: 'New Prescription Created',
      rows: [
        ['Patient', d.patient_email],
        ['Medication', `${d.medication_name} ${d.dosage}`, true],
        ['Frequency', d.frequency],
        ['Provider', d.provider_name || d.provider_id],
        ['Status', d.status],
        ['Pharmacy', d.pharmacy_name],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'Review in Dashboard →',
    }),
  }),

  Prescription_update: (d, old) => {
    if (!old || d.status === old.status) return null;
    const notifyPatient = ['sent_to_pharmacy', 'dispensed', 'completed'].includes(d.status);
    if (notifyPatient && d.patient_email) {
      return {
        to: d.patient_email,
        subject: `💊 Prescription Update: ${d.medication_name} is ${d.status?.replace(/_/g, ' ')}`,
        html: patientEmail({
          firstName: d.patient_email?.split('@')[0],
          title: 'Prescription Status Update',
          subtitle: `${d.medication_name} ${d.dosage}`,
          rows: [
            ['Medication', `${d.medication_name} ${d.dosage}`],
            ['Status', d.status?.replace(/_/g, ' '), true],
            ...(d.pharmacy_name ? [['Pharmacy', d.pharmacy_name]] : []),
            ...(d.rx_number ? [['Rx #', d.rx_number]] : []),
          ],
          bodyHtml: d.status === 'dispensed' ? `<div style="padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;margin-bottom:12px;">✅ Your prescription has been dispensed and is on its way!</div>` : '',
        }),
      };
    }
    return {
      to: ADMIN_EMAIL,
      subject: `💊 Prescription Update: ${d.medication_name} → ${d.status}`,
      html: brandedEmail({
        icon: '💊', title: 'Prescription Status Changed',
        rows: [
          ['Patient', d.patient_email],
          ['Medication', `${d.medication_name} ${d.dosage}`],
          ['New Status', d.status?.replace(/_/g, ' '), true],
          ...(d.pharmacy_name ? [['Pharmacy', d.pharmacy_name]] : []),
          ...(d.rx_number ? [['Rx #', d.rx_number]] : []),
        ],
      }),
    };
  },

  // ── Patient Intake ────────────────────────────────────────────
  CustomerIntake_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🌱 New Patient Intake — ${d.full_name}`,
    html: brandedEmail({
      icon: '🌱', title: 'New Patient Intake',
      subtitle: d.full_name,
      rows: [
        ['Name', d.full_name, true],
        ['Email', `<a href="mailto:${d.email}" style="color:#4A6741;">${d.email}</a>`],
        ['Phone', d.phone],
        ['Interest', d.primary_interest],
        ['Consultation', d.consultation_preference],
        ['Heard Via', d.heard_about_us],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'View in Dashboard →',
    }),
  }),

  // ── Provider Applications ─────────────────────────────────────
  ProviderIntake_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `👨‍⚕️ New Provider Application — ${d.full_name}, ${d.title}`,
    html: brandedEmail({
      icon: '👨‍⚕️', title: 'New Provider Application',
      rows: [
        ['Name', `${d.full_name}, ${d.title}`, true],
        ['Email', `<a href="mailto:${d.email}" style="color:#4A6741;">${d.email}</a>`],
        ['Specialty', d.specialty],
        ['License #', d.license_number],
        ['Experience', d.years_experience ? `${d.years_experience} years` : null],
        ['Practice Type', d.practice_type],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'Review Application →',
    }),
  }),

  ProviderIntake_update: (d, old) => {
    if (!old || d.status === old.status) return null;
    return {
      to: d.email,
      subject: `Your MedRevolve Provider Application: ${d.status?.replace(/_/g, ' ')}`,
      html: patientEmail({
        firstName: d.full_name?.split(' ')[0],
        title: 'Application Status Update',
        subtitle: 'MedRevolve Provider Network',
        bodyHtml: `<p style="font-size:14px;color:#374151;">Your provider application has been updated to: <strong style="color:${d.status === 'approved' ? '#166534' : '#374151'};">${d.status?.replace(/_/g, ' ')}</strong>.</p>
          ${d.status === 'approved' ? '<div style="padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;margin:12px 0;">🎉 Welcome to MedRevolve! Our team will reach out shortly with next steps.</div>' : ''}`,
      }),
    };
  },

  // ── Pharmacy Applications ─────────────────────────────────────
  PharmacyIntake_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🏪 New Pharmacy Application — ${d.pharmacy_name}`,
    html: brandedEmail({
      icon: '🏪', title: 'New Pharmacy Application',
      rows: [
        ['Pharmacy', d.pharmacy_name, true],
        ['Contact', `${d.contact_name} — <a href="mailto:${d.email}" style="color:#4A6741;">${d.email}</a>`],
        ['Type', d.pharmacy_type],
        ['License #', d.license_number],
        ['Shipping', d.shipping_capabilities],
        ['State', d.state],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'Review Application →',
    }),
  }),

  // ── Creator Applications ──────────────────────────────────────
  CreatorApplication_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🎯 New Creator Application — ${d.full_name} (@${d.platform_handle})`,
    html: brandedEmail({
      icon: '🎯', title: 'New Creator Application',
      rows: [
        ['Name', d.full_name, true],
        ['Email', `<a href="mailto:${d.email}" style="color:#4A6741;">${d.email}</a>`],
        ['Platform', `${d.platform} — @${d.platform_handle}`],
        ['Followers', d.followers_count],
        ['Niche', d.audience_niche],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'Review Application →',
    }),
  }),

  // ── Business Inquiries ────────────────────────────────────────
  BusinessInquiry_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🏢 Business Inquiry — ${d.company_name} · ${d.interest_type}`,
    html: brandedEmail({
      icon: '🏢', title: 'New Business Inquiry',
      rows: [
        ['Company', d.company_name, true],
        ['Contact', `${d.contact_name} — <a href="mailto:${d.email}" style="color:#4A6741;">${d.email}</a>`],
        ['Interest', d.interest_type],
        ['Industry', d.industry],
        ['Company Size', d.company_size],
        ['Message', d.message],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'View in Dashboard →',
    }),
  }),

  // ── Contact Requests ──────────────────────────────────────────
  ContactRequest_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `📬 Contact Request — ${d.subject || 'General Inquiry'} · ${d.name}`,
    html: brandedEmail({
      icon: '📬', title: 'New Contact Request',
      rows: [
        ['From', `${d.name} — <a href="mailto:${d.email}" style="color:#4A6741;">${d.email}</a>`, true],
        ['Subject', d.subject],
        ['Message', d.message],
      ],
      actionUrl: `mailto:${d.email}`,
      actionLabel: `Reply to ${d.name} →`,
    }),
  }),

  // ── Consultation Bookings ─────────────────────────────────────
  ConsultationBooking_create: (d) => ({
    to: ADMIN_EMAIL,
    subject: `🩺 New Consultation Booking — ${d.patient_email}`,
    html: brandedEmail({
      icon: '🩺', title: 'New Consultation Booking',
      rows: [
        ['Patient', d.patient_email, true],
        ['Type', d.consultation_type?.replace(/_/g, ' ')],
        ['Invoice', d.invoice_number],
        ['Amount', d.amount ? `$${((d.amount || 0) / 100).toFixed(2)}` : null],
        ['Status', d.status],
      ],
      actionUrl: 'https://medrevolve.base44.app/AdminDashboard',
      actionLabel: 'View in Dashboard →',
    }),
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

    // Always send from rned@medrevolve.com
    const emailLines = [
      `From: MedRevolve <rned@medrevolve.com>`,
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