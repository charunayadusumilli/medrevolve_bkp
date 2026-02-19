import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    // Notify admin
    if (adminEmail) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Pharmacy Partnerships',
          to: adminEmail,
          subject: `New Pharmacy Application - ${data.pharmacy_name}`,
          body: `New Pharmacy Partnership Application\n\nPharmacy: ${data.pharmacy_name}\nContact: ${data.contact_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nLicense: ${data.license_number}\nNPI: ${data.npi_number || 'N/A'}\nType: ${data.pharmacy_type}\nLocation: ${data.address || ''}, ${data.city || ''}, ${data.state || ''} ${data.zip_code || ''}\nServices: ${data.services_offered?.join(', ') || 'N/A'}\nShipping: ${data.shipping_capabilities || 'N/A'}\n\nApplication ID: ${pharmacyIntake.id}\nSubmitted: ${new Date().toLocaleString()}`
        });
      } catch (e) {
        console.error('Admin email error:', e.message);
      }
    }

    // Confirmation to pharmacy
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Pharmacy Partnerships',
        to: data.email,
        subject: 'Pharmacy Partnership Application Received',
        body: `Dear ${data.contact_name},\n\nThank you for ${data.pharmacy_name}'s interest in partnering with MedRevolve!\n\nWe've received your application and our pharmacy partnerships team will review it.\n\nWhat Happens Next:\n1. Verification (3-5 business days)\n2. Partnership Discussion call\n3. Integration Setup (2-3 weeks)\n4. Go Live!\n\nApplication Details:\n- Pharmacy: ${data.pharmacy_name}\n- Type: ${data.pharmacy_type}\n- License: ${data.license_number}\n- Application ID: ${pharmacyIntake.id}\n\nQuestions? Email pharmacy@medrevolve.com\n\nBest regards,\nMedRevolve Pharmacy Partnerships Team`
      });
    } catch (e) {
      console.error('Pharmacy confirmation email error:', e.message);
    }

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