import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate required fields
    if (!data.pharmacy_name || !data.contact_name || !data.email || !data.license_number || !data.pharmacy_type) {
      return Response.json(
        { error: 'Pharmacy name, contact name, email, license number, and pharmacy type are required' },
        { status: 400 }
      );
    }

    // Save to PharmacyIntake entity
    const pharmacyIntake = await base44.asServiceRole.entities.PharmacyIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ PharmacyIntake record created:', pharmacyIntake.id);

    // Send notification to admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Pharmacy Partnerships',
      to: 'support@medrevolve.com',
      subject: `New Pharmacy Partnership Application - ${data.pharmacy_name}`,
      body: `
💊 New Pharmacy Partnership Application

Pharmacy Details:
- Name: ${data.pharmacy_name}
- Contact: ${data.contact_name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- License: ${data.license_number}
- NPI: ${data.npi_number || 'Not provided'}
- Type: ${data.pharmacy_type}

Location:
${data.address || 'Not provided'}
${data.city || ''}, ${data.state || ''} ${data.zip_code || ''}

Capabilities:
- Services: ${data.services_offered?.join(', ') || 'Not provided'}
- Shipping: ${data.shipping_capabilities || 'Not provided'}

Partnership Interest:
${data.partnership_interest || 'Not provided'}

Submitted: ${new Date().toLocaleString()}
Application ID: ${pharmacyIntake.id}

Next Steps:
1. Verify pharmacy license and accreditation
2. Review service capabilities and capacity
3. Schedule partnership call
4. Negotiate terms and integrate systems
      `
    });

    // Send confirmation to pharmacy
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Pharmacy Partnerships',
      to: data.email,
      subject: 'Pharmacy Partnership Application Received',
      body: `
Dear ${data.contact_name},

Thank you for ${data.pharmacy_name}'s interest in partnering with MedRevolve!

We've received your application and our pharmacy partnerships team is reviewing your information.

What Happens Next:
1. Verification (3-5 business days)
   - Pharmacy license verification
   - Accreditation and compliance review
   - Capability assessment

2. Partnership Discussion (1 week)
   - Call with our pharmacy partnerships team
   - Discuss integration and logistics
   - Review terms and pricing

3. Integration Setup (2-3 weeks)
   - Technical integration (if applicable)
   - Order management system setup
   - Training and documentation

4. Go Live! (Immediate)
   - Start receiving prescriptions
   - Access pharmacy portal
   - Begin fulfillment

Timeline: Most pharmacy partnerships are active within 4-6 weeks.

Your Application Details:
- Pharmacy: ${data.pharmacy_name}
- Type: ${data.pharmacy_type}
- License: ${data.license_number}
- Application ID: ${pharmacyIntake.id}

Benefits of Partnership:
✓ Steady prescription volume
✓ Streamlined fulfillment process
✓ Competitive pricing structure
✓ Dedicated support team

Questions?
Email us at pharmacy@medrevolve.com or call 1-800-MED-REVO

We look forward to exploring this partnership opportunity!

Best regards,
MedRevolve Pharmacy Partnerships Team
      `
    });

    return Response.json({
      success: true,
      intake_id: pharmacyIntake.id,
      message: 'Pharmacy application submitted successfully',
      next_steps: 'You will receive a follow-up call within 3-5 business days'
    });

  } catch (error) {
    console.error('Error submitting pharmacy intake:', error);
    return Response.json(
      { error: error.message || 'Failed to submit pharmacy application' },
      { status: 500 }
    );
  }
});