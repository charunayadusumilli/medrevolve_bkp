import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    const messageIds = body?.data?.new_message_ids ?? [];
    if (messageIds.length === 0) {
      return Response.json({ processed: 0 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    let processed = 0;

    for (const messageId of messageIds) {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: authHeader }
      );
      if (!res.ok) continue;
      const message = await res.json();

      const headers = message.payload?.headers ?? [];
      const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';

      const from = getHeader('From');
      const subject = getHeader('Subject');
      const date = getHeader('Date');

      // Extract email address from "Name <email>" format
      const emailMatch = from.match(/<(.+?)>/) || [null, from];
      const senderEmail = emailMatch[1].trim();
      const senderName = from.includes('<') ? from.split('<')[0].trim().replace(/"/g, '') : from;

      // Extract plain text body
      let bodyText = '';
      const extractBody = (part) => {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          bodyText = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          return;
        }
        if (part.parts) part.parts.forEach(extractBody);
      };
      extractBody(message.payload);

      // Skip if already saved (deduplicate by gmail message ID)
      const existing = await base44.asServiceRole.entities.ContactRequest.filter({ subject: `[Gmail:${messageId}]` });
      if (existing.length > 0) continue;

      // Save as ContactRequest
      await base44.asServiceRole.entities.ContactRequest.create({
        name: senderName || senderEmail,
        email: senderEmail,
        subject: `[Gmail:${messageId}] ${subject}`.substring(0, 250),
        message: bodyText.substring(0, 5000),
        status: 'new',
      });

      processed++;
      console.log(`Saved email from ${senderEmail}: ${subject}`);
    }

    return Response.json({ processed });
  } catch (error) {
    console.error('fetchInboxEmails error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});