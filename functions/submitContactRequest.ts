import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Save to ContactRequest entity
    const contactRequest = await base44.asServiceRole.entities.ContactRequest.create({
      name: data.name,
      email: data.email,
      subject: data.subject || '',
      message: data.message,
      status: 'new'
    });

    console.log('✅ ContactRequest record created:', contactRequest.id);

    // Send notification to support team
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Contact Form',
      to: 'support@medrevolve.com',
      subject: `New Contact Request: ${data.subject || 'No Subject'}`,
      body: `
📧 New Contact Form Submission

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'No Subject'}

Message:
${data.message}

Submitted: ${new Date().toLocaleString()}
Contact ID: ${contactRequest.id}
      `
    });

    // Send confirmation to customer
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Support',
      to: data.email,
      subject: 'We received your message',
      body: `
Hi ${data.name},

Thank you for reaching out to MedRevolve!

We've received your message and our team will get back to you within 24 hours.

Your message:
"${data.message}"

In the meantime, feel free to explore:
• Our Products: medrevolve.com/products
• Book a Consultation: medrevolve.com/consultations
• FAQs: medrevolve.com/faqs

Best regards,
MedRevolve Support Team

Need urgent assistance? Call 1-800-MED-REVO
      `
    });

    return Response.json({
      success: true,
      request_id: contactRequest.id,
      message: 'Contact request submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting contact request:', error);
    return Response.json(
      { error: error.message || 'Failed to submit contact request' },
      { status: 500 }
    );
  }
});