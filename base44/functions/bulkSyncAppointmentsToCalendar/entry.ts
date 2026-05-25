import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all pending appointments without google_event_id
    const appointments = await base44.asServiceRole.entities.Appointment.filter({
      status: 'pending'
    });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const results = {
      synced: [],
      failed: [],
      skipped: []
    };

    const TYPE_LABEL = {
      initial_consultation: 'Initial Consultation',
      follow_up: 'Follow-Up',
      dosage_adjustment: 'Dosage Adjustment',
      general_inquiry: 'General Inquiry',
    };

    for (const apt of appointments) {
      try {
        // Skip if already synced
        if (apt.google_event_id) {
          results.skipped.push({
            id: apt.id,
            reason: 'Already synced to Google Calendar'
          });
          continue;
        }

        // Get provider if exists
        let provider = null;
        if (apt.provider_id) {
          try { provider = await base44.asServiceRole.entities.Provider.get(apt.provider_id); } catch {}
        }

        const typeLabel = TYPE_LABEL[apt.type] || apt.type;
        const providerDisplay = provider
          ? `${provider.name}${provider.title ? ', ' + provider.title : ''}`
          : 'MedRevolve Provider';

        const startDt = new Date(apt.appointment_date);
        const endDt = new Date(startDt.getTime() + (apt.duration_minutes || 30) * 60000);

        const attendees = [
          { email: apt.patient_email },
          ...(provider?.email ? [{ email: provider.email }] : []),
          { email: 'rned@medrevolve.com' },
        ];

        const calEvent = {
          summary: `MedRevolve — ${typeLabel} · ${apt.patient_email}`,
          description: [
            `Type: ${typeLabel}`,
            `Provider: ${providerDisplay}`,
            `Patient: ${apt.patient_email}`,
            `Reason: ${apt.reason || 'Not specified'}`,
            ``,
            `Join via Google Meet link included in this event.`,
            `Patient Portal: https://medrevolve.base44.app`,
          ].join('\n'),
          start: { dateTime: startDt.toISOString(), timeZone: 'America/New_York' },
          end: { dateTime: endDt.toISOString(), timeZone: 'America/New_York' },
          attendees,
          conferenceData: {
            createRequest: {
              requestId: `medrevolve-${apt.id}-${Date.now()}`,
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

        const response = await fetch(`${baseUrl}?conferenceDataVersion=1&sendUpdates=all`, {
          method: 'POST', headers, body: JSON.stringify(calEvent),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(`Google Calendar API error: ${JSON.stringify(errData)}`);
        }

        const result = await response.json();
        const meetLink = result.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null;
        const calLink = result.htmlLink || null;

        // Persist Google event fields back to the appointment
        await base44.asServiceRole.entities.Appointment.update(apt.id, {
          google_event_id: result.id,
          google_meet_link: meetLink,
          google_calendar_link: calLink,
          google_synced_at: new Date().toISOString(),
          ...(meetLink ? { session_url: meetLink } : {}),
        });

        results.synced.push({
          id: apt.id,
          title: apt.title || 'Appointment',
          patient: apt.patient_email,
          date: apt.appointment_date,
          googleEventId: result.id,
          meetLink: meetLink
        });

        console.log(`✓ Synced appointment ${apt.id} to Google Calendar - ${meetLink}`);
      } catch (error) {
        results.failed.push({
          id: apt.id,
          title: apt.title || 'Appointment',
          error: error.message
        });
        console.error(`✗ Failed to sync appointment ${apt.id}:`, error);
      }
    }

    return Response.json({
      message: `Bulk sync complete: ${results.synced.length} synced, ${results.failed.length} failed, ${results.skipped.length} skipped`,
      results
    });

  } catch (error) {
    console.error('Bulk sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});