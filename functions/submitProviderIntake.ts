import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmailSafe(base44, params) {
  try {
    await base44.asServiceRole.integrations.Core.SendEmail(params);
  } catch (e) {
    console.warn('Email send skipped (non-fatal):', e.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.full_name || !data.email || !data.title || !data.specialty || !data.license_number) {
      return Response.json({ error: 'Full name, email, title, specialty, and license number are required' }, { status: 400 });
    }

    const providerIntake = await base44.asServiceRole.entities.ProviderIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ ProviderIntake record created:', providerIntake.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Admin notification ──────────────────────────────────────────────────
    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Platform',
      to: adminEmail,
      subject: `👨‍⚕️ New Provider Application — ${data.full_name}, ${data.title} [${data.specialty}]`,
      body: `A new healthcare provider has submitted an application and requires credentialing review.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PROVIDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:               ${data.full_name}
Title:              ${data.title}
Specialty:          ${data.specialty}
Email:              ${data.email}
Phone:              ${data.phone || 'Not provided'}
License Number:     ${data.license_number}
States Licensed:    ${data.states_licensed?.join(', ') || 'Not provided'}
Years Experience:   ${data.years_experience || 'Not provided'}
Practice Type:      ${data.practice_type || 'Not specified'}
Availability:       ${data.availability || 'Not specified'}
Education:          ${data.education || 'Not provided'}
Certifications:     ${data.certifications || 'None listed'}

Bio:
${data.bio || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ACTION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐  Verify license with state medical board
☐  Check NPI registry
☐  Schedule credentialing call
☐  Review malpractice insurance
☐  Send contract & onboarding if approved
☐  Respond to applicant within 2-3 business days

Reference ID:  ${providerIntake.id}
Submitted:     ${submittedAt} ET

Admin Dashboard → https://app.medrevolve.com/provider-contracts`
    });

    // ── Confirmation to provider ────────────────────────────────────────────
    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Provider Relations',
      to: data.email,
      subject: `✅ Application Received — MedRevolve Provider Program`,
      body: `Dear ${data.full_name},

Thank you for your interest in joining MedRevolve as a licensed healthcare provider. We're excited to review your application!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  APPLICATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:            ${data.full_name}, ${data.title}
Specialty:       ${data.specialty}
License Number:  ${data.license_number}
Reference ID:    ${providerIntake.id}
Status:          Under Review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT HAPPENS NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Our credentialing team reviews your application (2-3 business days)
2. License verification with state medical board
3. We schedule a credentialing call with you
4. Upon approval, you receive an onboarding package and contract

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTIONS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    providers@medrevolve.com
Web:      https://medrevolve.com

We'll be in touch soon!

Best regards,
MedRevolve Provider Relations Team`
    });

    return Response.json({
      success: true,
      intake_id: providerIntake.id,
      message: 'Provider application submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting provider intake:', error);
    return Response.json({ error: error.message || 'Failed to submit provider application' }, { status: 500 });
  }
});