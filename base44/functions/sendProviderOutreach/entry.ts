import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin only
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { recipients, subject, body } = await req.json();

    if (!recipients?.length || !subject || !body) {
      return Response.json({ error: 'Missing recipients, subject, or body' }, { status: 400 });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      if (!recipient.email) continue;

      // Personalize the body — replace [Name] with first name
      const firstName = recipient.name
        ? recipient.name.replace(/^Dr\.\s*/i, '').split(' ')[0]
        : 'Provider';

      const personalizedBody = body.replace(/\[Name\]/g, firstName);

      try {
        await base44.integrations.Core.SendEmail({
          to: recipient.email,
          subject: subject,
          body: personalizedBody,
          from_name: 'MedRevolve Provider Relations'
        });
        sentCount++;
        console.log(`Sent to: ${recipient.email}`);
      } catch (err) {
        failedCount++;
        console.error(`Failed to send to ${recipient.email}:`, err.message);
      }
    }

    return Response.json({ sent: sentCount, failed: failedCount });
  } catch (error) {
    console.error('sendProviderOutreach error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});