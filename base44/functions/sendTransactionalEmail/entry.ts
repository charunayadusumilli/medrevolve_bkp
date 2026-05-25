import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, html, text, appointmentId } = await req.json();

    if (!to || !subject) {
      return Response.json({ error: 'Recipient email and subject are required' }, { status: 400 });
    }

    // Get SendGrid credentials
    const apiKey = Deno.env.get('SENDGRID_API_KEY');
    const fromEmail = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@medrevolve.com';
    const fromName = Deno.env.get('SENDGRID_FROM_NAME') || 'MedRevolve';

    if (!apiKey) {
      return Response.json({ 
        error: 'SendGrid not configured. Set SENDGRID_API_KEY secret' 
      }, { status: 500 });
    }

    // Send email via SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: {
          email: fromEmail,
          name: fromName
        },
        content: [
          {
            type: 'text/plain',
            value: text || subject
          },
          {
            type: 'text/html',
            value: html || `<p>${text || subject}</p>`
          }
        ],
        // HIPAA compliance headers
        custom_args: {
          category: 'transactional',
          app_id: Deno.env.get('BASE44_APP_ID') || 'medrevolve'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SendGrid error:', errorData);
      return Response.json({ 
        error: 'Failed to send email', 
        details: errorData.errors 
      }, { status: 500 });
    }

    console.log('✅ Email sent successfully via SendGrid to:', to);

    // Log email to appointment if appointmentId provided
    if (appointmentId) {
      try {
        await base44.asServiceRole.entities.Appointment.update(appointmentId, {
          last_email_sent: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not update appointment email log:', err);
      }
    }

    return Response.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('SendGrid email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});