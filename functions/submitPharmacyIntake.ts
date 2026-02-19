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

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Pharmacy Partnerships',
      to: adminEmail,
      subject: `💊 New Pharmacy Application - ${data.pharmacy_name}`,
      body: `New Pharmacy Partnership Application\n\n━━━━━━━━━━━━━━━━━━━━━━\n  PHARMACY DETAILS\n━━━━━━━━━━━━━━━━━━━━━━\nPharmacy Name:     ${data.pharmacy_name}\nPharmacy Type:     ${data.pharmacy_type}\nContact Person:    ${data.contact_name}\nEmail:             ${data.email}\nPhone:             ${data.phone || 'N/A'}\nLicense Number:    ${data.license_number}\nNPI Number:        ${data.npi_number || 'N/A'}\nLocation:          ${data.city || ''}, ${data.state || ''} ${data.zip_code || ''}\nShipping:          ${data.shipping_capabilities || 'N/A'}\nServices:          ${data.services_offered?.join(', ') || 'N/A'}\n\nPartnership Interest:\n${data.partnership_interest || 'N/A'}\n\nApplication ID:  ${pharmacyIntake.id}\nSubmitted:       ${new Date().toLocaleString()}\n\n━━━━━━━━━━━━━━━━━━━━━━\n  ACTION REQUIRED\n━━━━━━━━━━━━━━━━━━━━━━\n✅ Verify pharmacy license\n✅ Review partnership fit and capabilities\n✅ Respond within 3-5 business days\n\nAdmin Dashboard: medrevolve.com/admin-dashboard`
    });

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