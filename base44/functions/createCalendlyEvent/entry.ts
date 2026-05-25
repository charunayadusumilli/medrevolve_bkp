import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      title, 
      startTime, 
      endTime, 
      attendeeEmails = [], 
      location = 'Telehealth Consultation',
      appointmentId 
    } = await req.json();

    if (!title || !startTime) {
      return Response.json({ error: 'Title and start time are required' }, { status: 400 });
    }

    // Get Calendly credentials
    const apiKey = Deno.env.get('CALENDLY_API_KEY');
    const userUri = Deno.env.get('CALENDLY_USER_URI');

    if (!apiKey) {
      return Response.json({ 
        error: 'Calendly not configured. Set CALENDLY_API_KEY secret' 
      }, { status: 500 });
    }

    // Get user info if not provided
    let calendlyUserUri = userUri;
    if (!calendlyUserUri) {
      const userRes = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      const userData = await userRes.json();
      calendlyUserUri = userData.resource?.uri;
      
      if (!calendlyUserUri) {
        return Response.json({ error: 'Could not get Calendly user URI' }, { status: 500 });
      }
    }

    // Create scheduled event
    const eventResponse = await fetch('https://api.calendly.com/scheduled_events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        scheduled_event: {
          title: title,
          start_time: startTime,
          end_time: endTime || new Date(new Date(startTime).getTime() + 30 * 60000).toISOString(), // Default 30 min
          location: {
            type: 'custom',
            info: location
          },
          status: 'active',
          invitees: attendeeEmails.map(email => ({
            email: email,
            name: ''
          }))
        }
      })
    });

    if (!eventResponse.ok) {
      const errorData = await eventResponse.json();
      console.error('Calendly error:', errorData);
      return Response.json({ 
        error: 'Failed to create Calendly event', 
        details: errorData 
      }, { status: 500 });
    }

    const eventData = await eventResponse.json();
    const eventUri = eventData.resource?.uri;
    const eventUrl = eventData.resource?.url;

    console.log('✅ Calendly event created:', eventUrl);

    // Update appointment with Calendly event
    if (appointmentId) {
      try {
        await base44.asServiceRole.entities.Appointment.update(appointmentId, {
          calendly_event_uri: eventUri,
          calendly_event_url: eventUrl,
          google_synced_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not update appointment with Calendly info:', err);
      }
    }

    return Response.json({
      success: true,
      event_uri: eventUri,
      event_url: eventUrl,
      message: 'Calendly event created successfully'
    });

  } catch (error) {
    console.error('Calendly event creation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});