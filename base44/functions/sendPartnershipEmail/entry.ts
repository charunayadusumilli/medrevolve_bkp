import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { outreachId, emailContent, recipientEmail, subject } = await req.json();
    if (!outreachId || !emailContent || !recipientEmail) {
      return Response.json({ error: 'Outreach ID, email content, and recipient required' }, { status: 400 });
    }

    // Send via Gmail connector (rned@medrevolve.com)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const emailLines = [
      `From: MedRevolve Partnership Team <rned@medrevolve.com>`,
      `To: ${recipientEmail}`,
      `Subject: ${subject || 'Partnership Opportunity with MedRevolve'}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      emailContent,
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

    console.log(`✅ Partnership email sent to ${recipientEmail} — messageId: ${result.id}`);

    // Update outreach record
    await base44.asServiceRole.entities.PartnershipOutreach.update(outreachId, {
      status: 'outreach_sent',
      outreach_sent_date: new Date().toISOString(),
      outreach_email: emailContent,
    });

    return Response.json({ success: true, message: 'Partnership email sent via Gmail', messageId: result.id });
  } catch (error) {
    console.error('sendPartnershipEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});