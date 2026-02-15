import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate required fields
    if (!data.full_name || !data.email || !data.primary_interest) {
      return Response.json(
        { error: 'Full name, email, and primary interest are required' },
        { status: 400 }
      );
    }

    // Save to CustomerIntake entity
    const customerIntake = await base44.asServiceRole.entities.CustomerIntake.create({
      ...data,
      status: 'pending'
    });

    console.log('✅ CustomerIntake record created:', customerIntake.id);

    // Send notification to admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Customer Onboarding',
      to: 'support@medrevolve.com',
      subject: `New Customer Intake - ${data.full_name}`,
      body: `
👤 New Customer Intake Submission

Customer Details:
- Name: ${data.full_name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- DOB: ${data.date_of_birth || 'Not provided'}

Location:
${data.address || 'Not provided'}
${data.city || ''}, ${data.state || ''} ${data.zip_code || ''}

Wellness Interest:
- Primary: ${data.primary_interest}
- Consultation: ${data.consultation_preference || 'Not specified'}

Acquisition:
- Source: ${data.heard_about_us || 'Not provided'}
- Referral Code: ${data.referral_code || 'None'}

Insurance:
- Provider: ${data.insurance_provider || 'Not provided'}
- ID: ${data.insurance_id || 'Not provided'}

Medical History:
${data.medical_history_notes || 'Not provided'}

Submitted: ${new Date().toLocaleString()}
Customer ID: ${customerIntake.id}

Next Steps:
1. Review customer profile and interest
2. Assign to appropriate provider
3. Schedule initial consultation
4. Send product recommendations
      `
    });

    // Send confirmation to customer
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Wellness Team',
      to: data.email,
      subject: 'Welcome to MedRevolve - Your Wellness Journey Starts Here!',
      body: `
Hi ${data.full_name},

Welcome to MedRevolve! 🌿

Thank you for completing your customer intake. We're excited to help you achieve your wellness goals!

Your Wellness Interest: ${data.primary_interest}

What Happens Next:
1. Profile Review (24 hours)
   - Our wellness team reviews your information
   - We match you with the right provider

2. Initial Consultation (2-3 days)
   - Schedule a consultation with a licensed provider
   - Discuss your goals and medical history
   - Get personalized treatment recommendations

3. Treatment Plan (Immediate after consultation)
   - Receive your customized plan
   - Prescription sent to pharmacy (if applicable)
   - Products shipped directly to you

4. Ongoing Support
   - Regular check-ins with your provider
   - Adjust treatment as needed
   - Access to our wellness community

Your Customer ID: ${customerIntake.id}

${data.referral_code ? `\nReferral Code Used: ${data.referral_code}\nYou'll receive your referral discount at checkout!` : ''}

Getting Started:
🔹 Browse Products: medrevolve.com/products
🔹 Book Consultation: medrevolve.com/consultations
🔹 Patient Portal: medrevolve.com/patient-portal

Questions?
Our wellness team is here to help!
📧 Email: support@medrevolve.com
📞 Phone: 1-800-MED-REVO
💬 Live Chat: Available on our website

We're here to support you every step of the way!

Best regards,
MedRevolve Wellness Team

P.S. Check your inbox for a special welcome offer coming soon! 🎁
      `
    });

    return Response.json({
      success: true,
      intake_id: customerIntake.id,
      message: 'Customer intake completed successfully',
      next_steps: 'Check your email for next steps and schedule your consultation'
    });

  } catch (error) {
    console.error('Error submitting customer intake:', error);
    return Response.json(
      { error: error.message || 'Failed to submit customer intake' },
      { status: 500 }
    );
  }
});