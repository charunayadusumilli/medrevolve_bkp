import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    const adminEmail = Deno.env.get('ADMIN_EMAIL');

    // Notify admin
    if (adminEmail) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Customer Onboarding',
          to: adminEmail,
          subject: `New Customer Intake - ${data.full_name}`,
          body: `New Customer Intake Submission\n\nName: ${data.full_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nDOB: ${data.date_of_birth || 'N/A'}\nState: ${data.state || 'N/A'}\nPrimary Interest: ${data.primary_interest}\nConsultation Preference: ${data.consultation_preference || 'N/A'}\nSource: ${data.heard_about_us || 'N/A'}\nReferral Code: ${data.referral_code || 'None'}\nNotes: ${data.medical_history_notes || 'None'}\n\nCustomer ID: ${customerIntake.id}\nSubmitted: ${new Date().toLocaleString()}`
        });
      } catch (e) {
        console.error('Admin email error:', e.message);
      }
    }

    // Confirmation to customer
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Wellness Team',
        to: data.email,
        subject: 'Welcome to MedRevolve - Your Wellness Journey Starts Here!',
        body: `Hi ${data.full_name},\n\nWelcome to MedRevolve! Thank you for completing your intake form.\n\nYour Wellness Interest: ${data.primary_interest}\n\nWhat Happens Next:\n1. Our wellness team reviews your information (24 hours)\n2. We match you with the right provider\n3. Schedule your initial consultation\n4. Receive your personalized treatment plan\n\nBook a Consultation: medrevolve.com/consultations\nPatient Portal: medrevolve.com/patient-portal\n\nQuestions? Email support@medrevolve.com\n\nBest regards,\nMedRevolve Wellness Team`
      });
    } catch (e) {
      console.error('Customer email error:', e.message);
    }

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