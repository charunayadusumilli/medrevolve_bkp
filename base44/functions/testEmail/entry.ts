import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const adminEmail = Deno.env.get('ADMIN_EMAIL');

    if (!adminEmail) {
      return Response.json({ error: 'ADMIN_EMAIL not configured' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Test',
      to: adminEmail,
      subject: '📧 Test Email - MedRevolve',
      body: `This is a test email sent at ${new Date().toISOString()}.\n\nIf you received this, email notifications are working correctly!`
    });

    return Response.json({ success: true, message: `Test email sent to ${adminEmail}` });
  } catch (error) {
    console.error('Error sending test email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});