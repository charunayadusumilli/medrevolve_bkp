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

    if (!data.pharmacy_name || !data.contact_name || !data.email || !data.license_number || !data.pharmacy_type) {
      return Response.json({ error: 'Pharmacy name, contact name, email, license number, and pharmacy type are required' }, { status: 400 });
    }

    const pharmacyIntake = await base44.asServiceRole.entities.PharmacyIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ PharmacyIntake record created:', pharmacyIntake.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      await sendEmailSafe(base44, {
        from_name: 'MedRevolve Pharmacy Partnerships',
        to: adminEmail,
        subject: `New Pharmacy Application - ${data.pharmacy_name}`,
        body: `New Pharmacy Partnership Application\n\nPharmacy: ${data.pharmacy_name}\nContact: ${data.contact_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nLicense: ${data.license_number}\nNPI: ${data.npi_number || 'N/A'}\nType: ${data.pharmacy_type}\nLocation: ${data.city || ''}, ${data.state || ''} ${data.zip_code || ''}\n\nApplication ID: ${pharmacyIntake.id}\nSubmitted: ${new Date().toLocaleString()}`
      });
    }

    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Pharmacy Partnerships',
      to: data.email,
      subject: 'Pharmacy Partnership Application Received',
      body: `Dear ${data.contact_name},\n\nThank you for ${data.pharmacy_name}'s interest in partnering with MedRevolve!\n\nWe've received your application and will review it within 3-5 business days.\n\nApplication ID: ${pharmacyIntake.id}\n\nQuestions? Email pharmacy@medrevolve.com\n\nBest regards,\nMedRevolve Pharmacy Partnerships Team`
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