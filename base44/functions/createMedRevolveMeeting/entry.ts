import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const ORGANIZER_EMAIL = 'rned@medrevolve.com';
    const CALENDAR_ID = 'primary';

    // First, check if a MedRevolve meeting already exists (prevent duplicates)
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    const searchRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?` +
      `q=MedRevolve+Meeting&timeMin=${now.toISOString()}&maxResults=10&singleEvents=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const searchData = await searchRes.json();
    const existingMeeting = searchData.items?.find(e =>
      e.summary === 'MedRevolve Meeting' && e.status !== 'cancelled'
    );

    if (existingMeeting) {
      return Response.json({
        success: true,
        alreadyExists: true,
        meetLink: existingMeeting.hangoutLink,
        eventId: existingMeeting.id,
        eventLink: existingMeeting.htmlLink,
        summary: existingMeeting.summary,
        message: 'A MedRevolve Meeting already exists — returning existing meeting link.',
      });
    }

    // No existing meeting found — create a new one
    // Schedule 30 minutes from now as the default start time
    const startTime = new Date(now.getTime() + 30 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event = {
      summary: 'MedRevolve Meeting',
      description: 'MedRevolve team meeting. Join via Google Meet.',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/New_York',
      },
      organizer: {
        email: ORGANIZER_EMAIL,
      },
      attendees: [
        { email: ORGANIZER_EMAIL },
      ],
      conferenceData: {
        createRequest: {
          requestId: `medrevolve-meeting-${Date.now()}`,
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
    };

    const createRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    const created = await createRes.json();

    if (!createRes.ok) {
      console.error('Calendar API error:', created);
      throw new Error(`Google Calendar API error: ${created.error?.message || 'Unknown error'}`);
    }

    return Response.json({
      success: true,
      alreadyExists: false,
      meetLink: created.hangoutLink,
      eventId: created.id,
      eventLink: created.htmlLink,
      summary: created.summary,
      startTime: created.start?.dateTime,
      message: 'MedRevolve Meeting created successfully with Google Meet link.',
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});