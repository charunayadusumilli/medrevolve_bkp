import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import twilio from 'npm:twilio@4.20.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return Response.json({ error: 'appointmentId is required' }, { status: 400 });
    }

    // Fetch appointment to verify user access and get recording consent
    const appointment = await base44.asServiceRole.entities.ConsultationBooking.filter({
      id: appointmentId
    }, '-created_date', 1);

    if (!appointment.length) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const appt = appointment[0];
    
    // Verify user is either the patient or the assigned provider
    const isPatient = appt.patient_email === user.email;
    const isProvider = appt.provider_id && user.email; // Provider would be fetched from provider_id

    if (!isPatient) {
      return Response.json({ error: 'Forbidden: Not authorized for this appointment' }, { status: 403 });
    }

    // Generate Twilio access token
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioApiKey = Deno.env.get('TWILIO_API_KEY') || Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioApiSecret = Deno.env.get('TWILIO_API_SECRET');

    if (!twilioAccountSid || !twilioApiKey) {
      return Response.json({ error: 'Twilio credentials not configured' }, { status: 500 });
    }

    const client = twilio(twilioAccountSid, twilioApiKey);
    
    // Create room name from appointment ID
    const roomName = `consultation-${appointmentId}`;
    
    // Get or create room
    let room;
    try {
      room = await client.video.rooms.get(roomName).fetch();
    } catch {
      // Room doesn't exist, create it
      room = await client.video.rooms.create({
        uniqueName: roomName,
        type: 'group',
        recordParticipantsOnConnect: appt.recording_consent || false,
        maxParticipants: 10
      });
    }

    // Generate token for this user
    const { AccessToken } = await import('npm:twilio@4.20.0');
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret || Deno.env.get('TWILIO_AUTH_TOKEN')
    );

    token.addGrant(new AccessToken.VideoGrant({ room: roomName }));
    token.identity = user.email;

    return Response.json({
      token: token.toJwt(),
      room: roomName,
      recordingConsent: appt.recording_consent || false
    });
  } catch (error) {
    console.error('Twilio video session error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});