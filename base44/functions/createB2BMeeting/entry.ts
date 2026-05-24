import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      attendee_email,
      attendee_name,
      organizer_email,
      company_name,
      start_time_iso,
      duration_minutes = 30,
      title,
      description,
    } = body;

    // Get Google Calendar access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const startDt = new Date(start_time_iso);
    const endDt = new Date(startDt.getTime() + duration_minutes * 60000);

    const eventBody = {
      summary: title || `MedRevolve B2B Intro — ${attendee_name}`,
      description: description || `Introduction call with ${attendee_name} from ${company_name}.\n\nAgenda:\n- Platform overview\n- Pricing & onboarding\n- Q&A\n\nThis call will be recorded and transcribed.`,
      start: {
        dateTime: startDt.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDt.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: organizer_email },
        { email: attendee_email },
      ],
      conferenceData: {
        createRequest: {
          requestId: `medrevolve-b2b-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 30 },
          { method: 'popup', minutes: 10 },
        ],
      },
      guestsCanModify: false,
      sendUpdates: 'all',
    };

    // Create the calendar event with conferenceDataVersion=1 to generate Meet link
    const calRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!calRes.ok) {
      const err = await calRes.text();
      console.error('Google Calendar API error:', err);
      throw new Error(`Calendar API failed: ${err}`);
    }

    const event = await calRes.json();
    const meetLink = event.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || '';
    const calLink = event.htmlLink || '';
    const eventId = event.id;

    console.log('✅ Google Meet event created:', eventId, meetLink);

    // Save MeetingRecord
    const meeting = await base44.asServiceRole.entities.MeetingRecord.create({
      title: eventBody.summary,
      google_event_id: eventId,
      meet_link: meetLink,
      event_link: calLink,
      organizer_email: organizer_email,
      attendees: [attendee_email, organizer_email],
      start_time: startDt.toISOString(),
      end_time: endDt.toISOString(),
      status: 'scheduled',
      transcription_status: 'pending',
      notes: `B2B intro call — ${company_name}. To be recorded and transcribed.`,
    });

    console.log('✅ MeetingRecord saved:', meeting.id);

    const timeStr = startDt.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

    // Helper: send email via Gmail connector (works for external addresses)
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const sendGmail = async (to, subject, htmlBody, fromName = 'MedRevolve B2B Team') => {
      const boundary = `boundary_${Date.now()}`;
      const mimeMessage = [
        `From: ${fromName} <rned@medrevolve.com>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        htmlBody,
        `--${boundary}--`,
      ].join('\r\n');

      const encoded = btoa(unescape(encodeURIComponent(mimeMessage)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encoded }),
      });

      if (!gmailRes.ok) {
        const err = await gmailRes.text();
        console.error('Gmail send error:', err);
        throw new Error(`Gmail API failed: ${err}`);
      }
      return await gmailRes.json();
    };

    // Email to attendee
    await sendGmail(
      attendee_email,
      `You're invited: MedRevolve Intro Call — Today at 6:00 PM ET`,
      `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0A0A0A;padding:24px 32px;border-radius:8px 8px 0 0;">
    <div style="display:inline-flex;align-items:center;gap:10px;">
      <div style="background:white;width:32px;height:32px;border-radius:4px;text-align:center;line-height:32px;font-weight:900;font-size:11px;color:black;">MR</div>
      <span style="color:white;font-weight:700;font-size:16px;">MedRevolve</span>
    </div>
  </div>
  <div style="background:#fff;padding:32px;border:1px solid #eee;border-radius:0 0 8px 8px;">
    <h2 style="color:#1a1a1a;margin:0 0 8px;">Hi ${attendee_name.split(' ')[0]},</h2>
    <p style="color:#444;font-size:15px;">You're confirmed for your MedRevolve B2B intro call. We're excited to show you what the platform can do for <strong>${company_name}</strong>.</p>
    
    <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Meeting Details</p>
      <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#1a1a1a;">Today, Sunday May 24 at 6:00 PM ET</p>
      <p style="margin:0 0 6px;color:#444;font-size:14px;">30 minutes · Google Meet</p>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${meetLink}" style="background:#4A6741;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:700;font-size:15px;display:inline-block;">
        Join Google Meet →
      </a>
    </div>
    <p style="color:#888;font-size:12px;text-align:center;">
      Link: <a href="${meetLink}" style="color:#4A6741;">${meetLink}</a>
    </p>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
    <p style="color:#444;font-size:14px;"><strong>What we'll cover:</strong></p>
    <ul style="color:#555;font-size:14px;line-height:1.8;">
      <li>MedRevolve platform overview — telehealth &amp; white-label</li>
      <li>Pricing &amp; onboarding ($5K setup · $2,500/mo)</li>
      <li>Your specific needs for ${company_name}</li>
      <li>Next steps &amp; launch plan</li>
    </ul>
    <p style="color:#888;font-size:13px;margin-top:24px;">📝 This call will be recorded and transcribed for your records.</p>
    <p style="color:#444;font-size:14px;margin-top:24px;">Questions? Reply here or call <a href="tel:+17044263311" style="color:#4A6741;">(704) 426-3311</a></p>
    <p style="color:#666;font-size:14px;margin-top:24px;">See you at 6 PM!<br/><strong>The MedRevolve B2B Team</strong></p>
  </div>
</div>
      `.trim()
    );

    console.log('✅ Invite sent to attendee via Gmail');

    // Confirmation email to organizer
    await sendGmail(
      organizer_email,
      `✅ Meeting Created — ${attendee_name} (${company_name}) @ 6PM Today`,
      `
<div style="font-family:sans-serif;max-width:600px;">
  <h2 style="color:#1a1a1a;">✅ Meeting Confirmed</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;width:160px;"><b>With</b></td><td style="padding:10px;font-weight:bold;">${attendee_name} — ${company_name}</td></tr>
    <tr><td style="padding:10px;color:#444;"><b>Email</b></td><td style="padding:10px;"><a href="mailto:${attendee_email}">${attendee_email}</a></td></tr>
    <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Phone</b></td><td style="padding:10px;">(949) 413-5952</td></tr>
    <tr><td style="padding:10px;color:#444;"><b>Time</b></td><td style="padding:10px;">Today, Sunday May 24 at 6:00 PM ET</td></tr>
    <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Duration</b></td><td style="padding:10px;">30 minutes</td></tr>
    <tr><td style="padding:10px;color:#444;"><b>Google Meet</b></td><td style="padding:10px;"><a href="${meetLink}" style="color:#4A6741;">${meetLink}</a></td></tr>
    <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Calendar Event</b></td><td style="padding:10px;"><a href="${calLink}" style="color:#4A6741;">View in Google Calendar</a></td></tr>
    <tr><td style="padding:10px;color:#444;"><b>Lead Note</b></td><td style="padding:10px;">Startup interested in telehealth platform &amp; white label</td></tr>
  </table>
  <div style="margin-top:20px;padding:16px;background:#f0f7f0;border-left:4px solid #4A6741;border-radius:4px;">
    <p style="margin:0;font-size:13px;color:#2d5a2d;">📝 Remember to start recording when the call begins. Transcript will be auto-processed and saved to your Project Management dashboard.</p>
  </div>
  <p style="color:#888;font-size:12px;margin-top:16px;">Meeting ID: ${meeting.id} | Event ID: ${eventId}</p>
</div>
      `.trim(),
      'MedRevolve Calendar'
    );

    console.log('✅ Confirmation sent to organizer via Gmail');

    return Response.json({
      success: true,
      meeting_id: meeting.id,
      google_event_id: eventId,
      meet_link: meetLink,
      calendar_link: calLink,
      start_time: startDt.toISOString(),
    });

  } catch (error) {
    console.error('❌ createB2BMeeting error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});