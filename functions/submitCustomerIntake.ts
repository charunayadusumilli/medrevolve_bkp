import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, body }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${from_name} <onboarding@resend.dev>`,
      to: [to],
      subject,
      html: body
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
  } else {
    console.log('✅ Email sent via Resend to:', to);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.full_name || !data.email || !data.primary_interest) {
      return Response.json({ error: 'Full name, email, and primary interest are required' }, { status: 400 });
    }

    const customerIntake = await base44.asServiceRole.entities.CustomerIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ CustomerIntake record created:', customerIntake.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Admin notification ──────────────────────────────────────────────────
    await sendEmail({
      from_name: 'MedRevolve Platform',
      to: adminEmail,
      subject: `🆕 New Customer Intake — ${data.full_name} [${data.primary_interest}]`,
      body: `<pre style="font-family:monospace;font-size:13px;">A new customer has completed their intake form.

CUSTOMER DETAILS
────────────────────────────────
Name:                  ${data.full_name}
Email:                 ${data.email}
Phone:                 ${data.phone || 'Not provided'}
Date of Birth:         ${data.date_of_birth || 'Not provided'}
State:                 ${data.state || 'Not provided'}
Primary Interest:      ${data.primary_interest}
Consultation Pref:     ${data.consultation_preference || 'Not specified'}
How They Found Us:     ${data.heard_about_us || 'Not specified'}
Referral Code:         ${data.referral_code || 'None'}
Medical History Notes: ${data.medical_history_notes || 'None'}

ACTION CHECKLIST
────────────────────────────────
☐  Review intake in Admin Dashboard
☐  Match with an appropriate licensed provider
☐  Send provider match email or schedule consultation
☐  Follow up within 24 hours

Reference ID:  ${customerIntake.id}
Submitted:     ${submittedAt} ET

Admin Dashboard → https://app.medrevolve.com/admin-dashboard</pre>`
    });

    // ── Confirmation to customer ────────────────────────────────────────────
    await sendEmail({
      from_name: 'MedRevolve Wellness Team',
      to: data.email,
      subject: `✅ We received your intake, ${data.full_name.split(' ')[0]}! Here's what happens next`,
      body: `<pre style="font-family:monospace;font-size:13px;">Hi ${data.full_name.split(' ')[0]},

Thank you for completing your intake form — you're one step closer to your wellness goals!

YOUR INTAKE SUMMARY
────────────────────────────────
Wellness Interest:    ${data.primary_interest}
Consultation Pref:    ${data.consultation_preference || 'Flexible'}
Reference ID:         ${customerIntake.id}

WHAT HAPPENS NEXT
────────────────────────────────
1. Our wellness team reviews your information (within 24 hours)
2. We match you with the best available licensed provider
3. You'll receive a follow-up email with provider details + booking link

WANT TO MOVE FASTER?
────────────────────────────────
Book a consultation:  https://app.medrevolve.com/consultations
Browse treatments:    https://app.medrevolve.com/products
Access your portal:   https://app.medrevolve.com/patient-portal

Questions? Reply to this email or contact us at support@medrevolve.com

Warm regards,
MedRevolve Wellness Team
https://medrevolve.com</pre>`
    });

    return Response.json({
      success: true,
      intake_id: customerIntake.id,
      message: 'Customer intake completed successfully'
    });

  } catch (error) {
    console.error('Error submitting customer intake:', error);
    return Response.json({ error: error.message || 'Failed to submit customer intake' }, { status: 500 });
  }
});