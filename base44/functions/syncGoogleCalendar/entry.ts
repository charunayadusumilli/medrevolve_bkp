import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Creates or updates a Google Calendar event with a Google Meet link for the appointment.
// action: 'create' | 'update' | 'delete'

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, appointmentId, appointmentData } = await req.json();
    if (!action || !appointmentId) {
      return Response.json({ error: 'action and appointmentId are required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    let appointment = appointmentData;
    if (!appointment) {
      appointment = await base44.asServiceRole.entities.Appointment.get(appointmentId);
    }
    if (!appointment) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 });
    }

    let provider = null;
    if (appointment.provider_id) {
      try { provider = await base44.asServiceRole.entities.Provider.get(appointment.provider_id); } catch {}
    }

    const TYPE_LABEL = {
      initial_consultation: 'Initial Consultation',
      follow_up: 'Follow-Up',
      dosage_adjustment: 'Dosage Adjustment',
      general_inquiry: 'General Inquiry',
    };
    const typeLabel = TYPE_LABEL[appointment.type] || appointment.type;
    const providerDisplay = provider
      ? `${provider.name}${provider.title ? ', ' + provider.title : ''}`
      : 'MedRevolve Provider';

    const startDt = new Date(appointment.appointment_date);
    const endDt = new Date(startDt.getTime() + (appointment.duration_minutes || 30) * 60000);

    const attendees = [
      { email: appointment.patient_email },
      ...(provider?.email ? [{ email: provider.email }] : []),
      { email: 'rned@medrevolve.com' },
    ];

    const calEvent = {
      summary: `MedRevolve — ${typeLabel} · ${appointment.patient_email}`,
      description: [
        `Type: ${typeLabel}`,
        `Provider: ${providerDisplay}`,
        `Patient: ${appointment.patient_email}`,
        `Reason: ${appointment.reason || 'Not specified'}`,
        ``,
        `Join via Google Meet link included in this event.`,
        `Patient Portal: https://medrevolve.base44.app`,
      ].join('\n'),
      start: { dateTime: startDt.toISOString(), timeZone: 'America/New_York' },
      end: { dateTime: endDt.toISOString(), timeZone: 'America/New_York' },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `medrevolve-${appointmentId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    let response;
    if (action === 'create') {
      response = await fetch(`${baseUrl}?conferenceDataVersion=1&sendUpdates=all`, {
        method: 'POST', headers, body: JSON.stringify(calEvent),
      });
    } else if (action === 'update' && appointment.google_event_id) {
      response = await fetch(`${baseUrl}/${appointment.google_event_id}?conferenceDataVersion=1&sendUpdates=all`, {
        method: 'PUT', headers, body: JSON.stringify(calEvent),
      });
    } else if (action === 'delete' && appointment.google_event_id) {
      response = await fetch(`${baseUrl}/${appointment.google_event_id}?sendUpdates=all`, {
        method: 'DELETE', headers,
      });
      if (response.ok || response.status === 204 || response.status === 404) {
        await base44.asServiceRole.entities.Appointment.update(appointmentId, {
          google_event_id: null, google_meet_link: null, google_calendar_link: null,
        });
        return Response.json({ success: true, action: 'deleted' });
      }
    }

    if (!response) {
      return Response.json({ error: `Cannot ${action} — missing google_event_id for update/delete` }, { status: 400 });
    }

    if (!response.ok) {
      const errData = await response.json();
      console.error('Google Calendar API error:', errData);
      return Response.json({ error: 'Google Calendar API failed', details: errData }, { status: 500 });
    }

    const result = await response.json();
    const meetLink = result.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null;
    const calLink = result.htmlLink || null;

    // Persist Google event fields back to the appointment
    if (action === 'create' || action === 'update') {
      try {
        await base44.asServiceRole.entities.Appointment.update(appointmentId, {
          google_event_id: result.id,
          google_meet_link: meetLink,
          google_calendar_link: calLink,
          google_synced_at: new Date().toISOString(),
          ...(meetLink ? { session_url: meetLink } : {}),
        });
      } catch (dbErr) {
        console.warn('Could not persist Google event to appointment (may not exist yet):', dbErr.message);
      }
    }

    console.log(`✅ Google Calendar ${action}d — eventId: ${result.id} | Meet: ${meetLink}`);

    return Response.json({
      success: true,
      action,
      google_event_id: result.id,
      google_meet_link: meetLink,
      google_calendar_link: calLink,
    });

  } catch (error) {
    console.error('syncGoogleCalendar error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});