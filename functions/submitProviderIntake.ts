import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate required fields
    if (!data.full_name || !data.email || !data.title || !data.specialty || !data.license_number) {
      return Response.json(
        { error: 'Full name, email, title, specialty, and license number are required' },
        { status: 400 }
      );
    }

    // Save to ProviderIntake entity
    const providerIntake = await base44.asServiceRole.entities.ProviderIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ ProviderIntake record created:', providerIntake.id);

    // Send notification to admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Provider Application',
      to: 'support@medrevolve.com',
      subject: `New Provider Application - ${data.full_name}`,
      body: `
🏥 New Provider Application Received

Provider Details:
- Name: ${data.full_name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Title: ${data.title}
- Specialty: ${data.specialty}
- License Number: ${data.license_number}
- States Licensed: ${data.states_licensed?.join(', ') || 'Not provided'}
- Years Experience: ${data.years_experience || 'Not provided'}
- Practice Type: ${data.practice_type || 'Not provided'}

Education:
${data.education || 'Not provided'}

Certifications:
${data.certifications || 'Not provided'}

Bio:
${data.bio || 'Not provided'}

Availability:
${data.availability || 'Not provided'}

Submitted: ${new Date().toLocaleString()}
Application ID: ${providerIntake.id}

Next Steps:
1. Verify license credentials
2. Review professional background
3. Schedule credentialing interview
4. Approve and onboard to platform
      `
    });

    // Send confirmation to provider
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Provider Relations',
      to: data.email,
      subject: 'Provider Application Received - Next Steps',
      body: `
Dear ${data.full_name},

Thank you for your interest in joining MedRevolve as a healthcare provider!

We've received your application and our credentialing team is reviewing your information.

What Happens Next:
1. Credential Verification (2-3 business days)
   - We'll verify your medical license and certifications
   - Background check and reference verification

2. Interview & Onboarding (1 week)
   - Virtual interview with our medical director
   - Platform training and orientation
   - Contract review and signing

3. Profile Creation (1-2 days)
   - Set up your provider profile
   - Configure your availability
   - Upload professional photos

4. Go Live! (Immediate)
   - Start accepting patient consultations
   - Access provider dashboard
   - Begin earning

Timeline: Most providers are approved and live within 7-10 business days.

Your Application Details:
- Title: ${data.title}
- Specialty: ${data.specialty}
- License: ${data.license_number}
- Application ID: ${providerIntake.id}

Questions?
Email us at providers@medrevolve.com or call 1-800-MED-REVO

We're excited to potentially have you join our team of exceptional healthcare providers!

Best regards,
MedRevolve Provider Relations Team
      `
    });

    return Response.json({
      success: true,
      intake_id: providerIntake.id,
      message: 'Provider application submitted successfully',
      next_steps: 'You will receive a follow-up email within 2-3 business days'
    });

  } catch (error) {
    console.error('Error submitting provider intake:', error);
    return Response.json(
      { error: error.message || 'Failed to submit provider application' },
      { status: 500 }
    );
  }
});