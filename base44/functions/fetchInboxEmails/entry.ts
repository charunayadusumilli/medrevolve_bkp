import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';
const ADMIN_NAME = 'MedRevolve Team';

// Calendar invites are ONLY sent when a user requests a meeting via the website contact form.
// They are NOT sent automatically when emails arrive in the inbox.
// See: functions/submitContactRequest for the calendar invite logic.

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

      // Extract email address from "Name <email>" format
      const emailMatch = from.match(/<(.+?)>/) || [null, from];
      const senderEmail = emailMatch[1].trim();
      const senderName = from.includes('<') ? from.split('<')[0].trim().replace(/"/g, '') : from;

      // Skip our own outgoing emails coming back
      if (senderEmail === ADMIN_EMAIL || senderEmail === 'rned@medrevolve.com') {
        console.log(`Skipping own email from ${senderEmail}`);
        continue;
      }

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

      // Deduplicate by gmail message ID
      const allRecent = await base44.asServiceRole.entities.ContactRequest.filter({});
      const alreadySaved = allRecent.some(r => r.subject && r.subject.includes(`[Gmail:${messageId}]`));
      if (alreadySaved) {
        console.log(`Skipping duplicate messageId: ${messageId}`);
        continue;
      }

      // Save as ContactRequest — NO calendar invite (only sent via website form)
      await base44.asServiceRole.entities.ContactRequest.create({
        name: senderName || senderEmail,
        email: senderEmail,
        subject: `[Gmail:${messageId}] ${subject}`.substring(0, 250),
        message: bodyText.substring(0, 5000),
        source: 'gmail_inbox',
        status: 'new',
        meeting_booked: false,
        meeting_link: '',
      });

      processed++;
      console.log(`✅ Saved email from ${senderEmail}: ${subject} (no auto calendar invite)`);
    }

    return Response.json({ processed });
  } catch (error) {
    console.error('fetchInboxEmails error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});