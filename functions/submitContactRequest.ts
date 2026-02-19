import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, body }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${from_name} <onboarding@resend.dev>`,
      to: [to],
      subject,
      html: body
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
  } else {
    console.log('✅ Email sent via Resend to:', to);
  }
}

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

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    await sendEmail({
      from_name: 'MedRevolve Platform',
      to: adminEmail,
      subject: `📬 New Contact Message — "${data.subject || 'No Subject'}" from ${data.name}`,
      body: `<pre style="font-family:monospace;font-size:13px;">A new contact form message has been received.

CONTACT DETAILS
────────────────────────────────
From:       ${data.name}
Email:      ${data.email}
Subject:    ${data.subject || 'No subject provided'}

Message:
────────────────────────────────
${data.message}
────────────────────────────────

ACTION REQUIRED: Reply to ${data.email} within 24 hours.

Reference ID:  ${contactRequest.id}
Submitted:     ${submittedAt} ET

Admin Dashboard → https://app.medrevolve.com/admin-dashboard</pre>`
    });

    await sendEmail({
      from_name: 'MedRevolve Support',
      to: data.email,
      subject: `✅ We got your message, ${data.name.split(' ')[0]}! We'll be in touch within 24 hours`,
      body: `<pre style="font-family:monospace;font-size:13px;">Hi ${data.name.split(' ')[0]},

Thank you for reaching out to MedRevolve! We've received your message and our team will get back to you within 24 hours.

YOUR MESSAGE
────────────────────────────────
Subject:      ${data.subject || 'General Inquiry'}
Reference ID: ${contactRequest.id}

Message:
${data.message}

NEED FASTER HELP?
────────────────────────────────
Book a consultation:  https://app.medrevolve.com/consultations
Browse treatments:    https://app.medrevolve.com/products
Patient portal:       https://app.medrevolve.com/patient-portal

We'll be in touch soon!

Best regards,
MedRevolve Support Team
support@medrevolve.com</pre>`
    });

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