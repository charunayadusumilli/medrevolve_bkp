import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { appointmentId, consultationType, patientEmail, providerId } = await req.json();

        if (!appointmentId || !consultationType) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let sessionUrl = null;
        let communicationPlatform = null;

        // Initialize based on consultation type
        switch (consultationType) {
            case 'video':
                // Use Twilio Video (or Zoom API if integrated)
                communicationPlatform = 'twilio_video';
                sessionUrl = await initializeTwilioVideo(appointmentId, patientEmail, providerId);
                break;

            case 'phone':
                // Use Twilio Voice
                communicationPlatform = 'twilio_voice';
                sessionUrl = await initializeTwilioVoice(appointmentId, patientEmail, providerId);
                break;

            case 'chat':
                // Use real-time chat (Twilio Chat or custom)
                communicationPlatform = 'chat';
                sessionUrl = `/VideoCall?appointment=${appointmentId}&mode=chat`;
                break;

            case 'in_person':
                // No session URL needed
                communicationPlatform = 'in_person';
                break;
        }

        // Update appointment with communication details
        await base44.asServiceRole.entities.Appointment.update(appointmentId, {
            video_link: sessionUrl,
            notes: `Communication platform: ${communicationPlatform}`
        });

        console.log('Communication session initialized:', {
            appointmentId,
            type: consultationType,
            platform: communicationPlatform
        });

        return Response.json({
            success: true,
            sessionUrl,
            communicationPlatform
        });
    } catch (error) {
        console.error('Error initializing communication:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

async function initializeTwilioVideo(appointmentId, patientEmail, providerId) {
    // Twilio Video Room creation would go here
    // For now, return a custom video call page
    return `/VideoCall?appointment=${appointmentId}&mode=video`;
}

async function initializeTwilioVoice(appointmentId, patientEmail, providerId) {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioPhone) {
        console.warn('Twilio not configured, using fallback');
        return `/VideoCall?appointment=${appointmentId}&mode=phone`;
    }

    // Twilio Voice API would be called here to set up call routing
    // Return a dial-in number or call initiation URL
    return `/VideoCall?appointment=${appointmentId}&mode=phone&twilio=true`;
}