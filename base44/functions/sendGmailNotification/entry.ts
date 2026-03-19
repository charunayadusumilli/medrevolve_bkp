import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Sends a Gmail notification using the connected Gmail account
// Payload: { to, subject, html, event_type }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, subject, html, event_type } = await req.json();

    if (!to || !subject || !html) {
      return Response.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    // Build RFC 2822 email
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'noreply@medrevolve.com';
    const emailLines = [
      `From: MedRevolve <${adminEmail}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
    ];
    const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Gmail send error:', JSON.stringify(data));
      return Response.json({ error: data.error?.message || 'Gmail send failed' }, { status: 500 });
    }

    console.log(`Gmail sent [${event_type || 'unknown'}] to ${to}, messageId: ${data.id}`);
    return Response.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('sendGmailNotification error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});