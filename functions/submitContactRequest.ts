import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.name || !data.email || !data.message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const contactRequest = await base44.asServiceRole.entities.ContactRequest.create({
      name: data.name,
      email: data.email,
      subject: data.subject || '',
      message: data.message,
      status: 'new'
    });

    console.log('✅ ContactRequest record created:', contactRequest.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL');

    // Notify admin
    if (adminEmail) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Contact Form',
          to: adminEmail,
          subject: `New Contact Request: ${data.subject || 'No Subject'} - from ${data.name}`,
          body: `New Contact Form Submission\n\nFrom: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject || 'No Subject'}\n\nMessage:\n${data.message}\n\nContact ID: ${contactRequest.id}\nSubmitted: ${new Date().toLocaleString()}`
        });
      } catch (e) {
        console.error('Admin email error:', e.message);
      }
    }

    // Confirmation to submitter
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Support',
        to: data.email,
        subject: 'We received your message',
        body: `Hi ${data.name},\n\nThank you for reaching out to MedRevolve!\n\nWe've received your message and our team will get back to you within 24 hours.\n\nYour message:\n"${data.message}"\n\nBest regards,\nMedRevolve Support Team`
      });
    } catch (e) {
      console.error('Confirmation email error:', e.message);
    }

    return Response.json({
      success: true,
      request_id: contactRequest.id,
      message: 'Contact request submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting contact request:', error);
    return Response.json({ error: error.message || 'Failed to submit contact request' }, { status: 500 });
  }
});