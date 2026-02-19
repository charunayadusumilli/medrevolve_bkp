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

    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      await sendEmailSafe(base44, {
        from_name: 'MedRevolve Provider Application',
        to: adminEmail,
        subject: `New Provider Application - ${data.full_name}`,
        body: `New Provider Application Received\n\nName: ${data.full_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nTitle: ${data.title}\nSpecialty: ${data.specialty}\nLicense: ${data.license_number}\nStates Licensed: ${data.states_licensed?.join(', ') || 'N/A'}\nYears Experience: ${data.years_experience || 'N/A'}\n\nApplication ID: ${providerIntake.id}\nSubmitted: ${new Date().toLocaleString()}`
      });
    }

    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Provider Relations',
      to: data.email,
      subject: 'Provider Application Received - Next Steps',
      body: `Dear ${data.full_name},\n\nThank you for your interest in joining MedRevolve as a healthcare provider!\n\nWe've received your application and our credentialing team will review it within 2-3 business days.\n\nApplication Details:\n- Title: ${data.title}\n- Specialty: ${data.specialty}\n- License: ${data.license_number}\n- Application ID: ${providerIntake.id}\n\nQuestions? Email providers@medrevolve.com\n\nBest regards,\nMedRevolve Provider Relations Team`
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