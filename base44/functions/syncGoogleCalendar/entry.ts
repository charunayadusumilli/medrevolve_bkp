import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { 
      action, // 'create', 'update', 'delete'
      appointmentId,
      appointmentData 
    } = await req.json();

    if (!action || !appointmentId) {
      return Response.json({ error: 'action and appointmentId are required' }, { status: 400 });
    }

    // Get Google Calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    if (!accessToken) {
      return Response.json({ 
        error: 'Google Calendar not authorized. Please authorize in dashboard.' 
      }, { status: 500 });
    }

    // Fetch appointment details if not provided
    let appointment = appointmentData;
    if (!appointment) {
      appointment = await base44.asServiceRole.entities.Appointment.get(appointmentId);
    }

    // Get provider details
    const provider = await base44.asServiceRole.entities.Provider.get(appointment.provider_id);

    // Create Google Calendar event
    const event = {
      summary: `Consultation - ${appointment.patient_email}`,
      description: `Type: ${appointment.type}\nReason: ${appointment.reason || 'Not specified'}\nPatient: ${appointment.patient_email}`,
      start: {
        dateTime: appointment.appointment_date,
        timeZone: 'America/New_York'
      },
      end: {
        dateTime: new Date(new Date(appointment.appointment_date).getTime() + (appointment.duration_minutes || 30) * 60000).toISOString(),
        timeZone: 'America/New_York'
      },
      attendees: [
        { email: appointment.patient_email },
        { email: provider?.email }
      ].filter(a => a.email),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    let response;
    const calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    if (action === 'create') {
      response = await fetch(calendarUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
    } else if (action === 'update' && appointment.google_event_id) {
      response = await fetch(`${calendarUrl}/${appointment.google_event_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
    } else if (action === 'delete' && appointment.google_event_id) {
      response = await fetch(`${calendarUrl}/${appointment.google_event_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }

    const result = response ? await response.json() : null;

    if (response && !response.ok) {
      console.error('Google Calendar error:', result);
      return Response.json({ 
        error: 'Failed to sync with Google Calendar',
        details: result 
      }, { status: 500 });
    }

    console.log('✅ Synced to Google Calendar:', result?.id);

    // Update appointment with Google event ID
    if (action === 'create' && result?.id) {
      await base44.asServiceRole.entities.Appointment.update(appointmentId, {
        google_event_id: result.id,
        google_synced_at: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      google_event_id: result?.id,
      google_event_link: result?.htmlLink
    });

  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    return Response.json({ 
      error: error.message || 'Failed to sync to Google Calendar' 
    }, { status: 500 });
  }
});