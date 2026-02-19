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

    if (!data.pharmacy_name || !data.contact_name || !data.email || !data.license_number || !data.pharmacy_type) {
      return Response.json({ error: 'Pharmacy name, contact name, email, license number, and pharmacy type are required' }, { status: 400 });
    }

    const pharmacyIntake = await base44.asServiceRole.entities.PharmacyIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ PharmacyIntake record created:', pharmacyIntake.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    await sendEmail({
      from_name: 'MedRevolve Platform',
      to: adminEmail,
      subject: `💊 New Pharmacy Application — ${data.pharmacy_name} [${data.pharmacy_type}]`,
      body: `<pre style="font-family:monospace;font-size:13px;">A new pharmacy has submitted a partnership application.

PHARMACY DETAILS
────────────────────────────────
Pharmacy Name:        ${data.pharmacy_name}
Contact Person:       ${data.contact_name}
Email:                ${data.email}
Phone:                ${data.phone || 'Not provided'}
License Number:       ${data.license_number}
NPI Number:           ${data.npi_number || 'Not provided'}
Pharmacy Type:        ${data.pharmacy_type}
Shipping Capability:  ${data.shipping_capabilities || 'Not specified'}
Services Offered:     ${data.services_offered?.join(', ') || 'Not specified'}

Location:
${data.address || ''}
${data.city || ''}, ${data.state || ''} ${data.zip_code || ''}

Why They Want to Partner:
${data.partnership_interest || 'Not provided'}

ACTION CHECKLIST
────────────────────────────────
☐  Verify pharmacy license with state board
☐  Confirm NPI in registry
☐  Review compounding capabilities
☐  Check shipping coverage for our patient base
☐  Schedule intro call with pharmacy
☐  Send contract if approved
☐  Respond within 3-5 business days

Reference ID:  ${pharmacyIntake.id}
Submitted:     ${submittedAt} ET

Admin Dashboard → https://app.medrevolve.com/pharmacy-contracts</pre>`
    });

    await sendEmail({
      from_name: 'MedRevolve Pharmacy Partnerships',
      to: data.email,
      subject: `✅ Partnership Application Received — MedRevolve`,
      body: `<pre style="font-family:monospace;font-size:13px;">Dear ${data.contact_name},

Thank you for ${data.pharmacy_name}'s interest in partnering with MedRevolve! We're excited to explore this opportunity with you.

APPLICATION SUMMARY
────────────────────────────────
Pharmacy:         ${data.pharmacy_name}
Type:             ${data.pharmacy_type}
License:          ${data.license_number}
Reference ID:     ${pharmacyIntake.id}
Status:           Under Review

WHAT HAPPENS NEXT
────────────────────────────────
1. Our partnerships team reviews your application (3-5 business days)
2. License and accreditation verification
3. We schedule an introductory call to discuss integration details
4. Upon approval, you receive a partnership contract and onboarding guide

QUESTIONS?
────────────────────────────────
Email:    pharmacy@medrevolve.com
Web:      https://medrevolve.com

We look forward to working with you!

Best regards,
MedRevolve Pharmacy Partnerships Team</pre>`
    });

    return Response.json({
      success: true,
      intake_id: pharmacyIntake.id,
      message: 'Pharmacy application submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting pharmacy intake:', error);
    return Response.json({ error: error.message || 'Failed to submit pharmacy application' }, { status: 500 });
  }
});