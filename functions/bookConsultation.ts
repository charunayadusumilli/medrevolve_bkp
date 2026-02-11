import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    if (!data.provider_id || !data.appointment_date || !data.appointment_time || !data.type) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create appointment datetime
    const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);

    // Check if datetime is in the future
    if (appointmentDateTime <= new Date()) {
      return Response.json(
        { error: 'Appointment must be in the future' },
        { status: 400 }
      );
    }

    // Get provider details
    const provider = await base44.asServiceRole.entities.Provider.get(data.provider_id);

    // Create appointment
    const appointment = await base44.asServiceRole.entities.Appointment.create({
      provider_id: data.provider_id,
      patient_email: user.email,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: 30,
      type: data.type,
      reason: data.reason || '',
      notes: data.notes || '',
      status: 'scheduled',
      video_room_id: `room_${Date.now()}`
    });

    // Send notification to consultations@medrevolve.com
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Consultations',
      to: 'consultations@medrevolve.com',
      subject: `New Consultation Booked - ${user.email}`,
      body: `
📅 New Consultation Appointment

Patient: ${user.full_name || user.email}
Email: ${user.email}
Provider: ${provider?.name || 'Provider ' + data.provider_id}
Type: ${data.type.replace('_', ' ').toUpperCase()}
Date: ${appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
Time: ${appointmentDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
Duration: 30 minutes

Reason: ${data.reason || 'Not provided'}
Notes: ${data.notes || 'None'}

Appointment ID: ${appointment.id}
Video Room: ${appointment.video_room_id}
      `
    });

    // Send confirmation to patient
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Consultations',
      to: user.email,
      subject: 'Consultation Confirmed - MedRevolve',
      body: `
Hi ${user.full_name || 'there'},

Your telehealth consultation has been successfully scheduled! 🎉

Appointment Details:
📅 Date: ${appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
⏰ Time: ${appointmentDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
👨‍⚕️ Provider: ${provider?.name || 'Licensed Provider'}
📋 Type: ${data.type.replace('_', ' ')}
⏱️ Duration: 30 minutes

What to Expect:
✓ You'll receive a reminder 24 hours before your appointment
✓ Join the video call 5 minutes early to test your connection
✓ Have your medical history and current medications ready
✓ Prepare any questions you want to discuss

Access Your Appointment:
Log in to your account at medrevolve.com and go to "My Appointments" to join the video call when it's time.

Need to Reschedule?
You can reschedule or cancel up to 24 hours before your appointment through your account dashboard.

We're looking forward to your consultation!

Best regards,
MedRevolve Care Team

Questions? Reply to this email or call 1-800-MED-REVO
      `
    });

    return Response.json({
      success: true,
      appointment_id: appointment.id,
      appointment_date: appointmentDateTime.toISOString(),
      message: 'Appointment booked successfully'
    });

  } catch (error) {
    console.error('Error booking consultation:', error);
    return Response.json(
      { error: error.message || 'Failed to book appointment' },
      { status: 500 }
    );
  }
});