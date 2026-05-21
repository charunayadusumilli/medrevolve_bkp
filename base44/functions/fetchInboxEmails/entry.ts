import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@batterywall.com';
const ADMIN_NAME = 'MedRevolve Team';

async function sendCalendarInvite(base44, { senderName, senderEmail, subject, messageSnippet }) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Schedule a discovery call 24 hours from now
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min

    const event = {
      summary: `Discovery Call: ${senderName || senderEmail}`,
      description: `Incoming inquiry from ${senderName || senderEmail} <${senderEmail}>\n\nSubject: ${subject}\n\nMessage preview:\n${messageSnippet}\n\nPlease confirm or reschedule this call.`,
      start: { dateTime: start.toISOString(), timeZone: 'America/New_York' },
      end: { dateTime: end.toISOString(), timeZone: 'America/New_York' },
      attendees: [
        { email: ADMIN_EMAIL, displayName: ADMIN_NAME },
        { email: senderEmail, displayName: senderName || senderEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `inbox-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }
    );
    const result = await res.json();
    if (!res.ok) {
      console.error('Calendar invite error:', result);
      return null;
    }

    const meetLink = result.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null;
    console.log(`✅ Calendar invite sent to ${senderEmail} — Meet: ${meetLink}`);
    return { meetLink, calLink: result.htmlLink, eventId: result.id };
  } catch (e) {
    console.error('Calendar invite failed (non-blocking):', e.message);
    return null;
  }
}

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

      // Send Google Calendar invite to sender + admin
      const calData = await sendCalendarInvite(base44, {
        senderName,
        senderEmail,
        subject,
        messageSnippet: bodyText.substring(0, 300),
      });

      // Save as ContactRequest
      const contact = await base44.asServiceRole.entities.ContactRequest.create({
        name: senderName || senderEmail,
        email: senderEmail,
        subject: `[Gmail:${messageId}] ${subject}`.substring(0, 250),
        message: bodyText.substring(0, 5000),
        source: 'gmail_inbox',
        status: 'new',
        meeting_booked: !!calData?.meetLink,
        meeting_link: calData?.meetLink || '',
      });

      processed++;
      console.log(`✅ Saved email from ${senderEmail}: ${subject} | Calendar invite: ${calData?.meetLink || 'none'}`);
    }

    return Response.json({ processed });
  } catch (error) {
    console.error('fetchInboxEmails error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});