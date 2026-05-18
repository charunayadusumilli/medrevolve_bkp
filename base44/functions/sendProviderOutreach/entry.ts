import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { recipients, subject, body } = await req.json();
    if (!recipients?.length || !subject || !body) {
      return Response.json({ error: 'Missing recipients, subject, or body' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      if (!recipient.email) continue;

      const firstName = recipient.name
        ? recipient.name.replace(/^Dr\.\s*/i, '').split(' ')[0]
        : 'Provider';

      const personalizedBody = body.replace(/\[Name\]/g, firstName);

      try {
        const emailLines = [
          `From: MedRevolve Provider Relations <rned@medrevolve.com>`,
          `To: ${recipient.email}`,
          `Subject: ${subject}`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset=UTF-8',
          '',
          personalizedBody,
        ];
        const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error?.message || 'Gmail send failed');

        sentCount++;
        console.log(`✅ Sent to: ${recipient.email}`);
      } catch (err) {
        failedCount++;
        console.error(`Failed to send to ${recipient.email}:`, err.message);
      }
    }

    return Response.json({ success: true, sent: sentCount, failed: failedCount });
  } catch (error) {
    console.error('sendProviderOutreach error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});