import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { appointment_id } = await req.json();

    if (!appointment_id) {
      return Response.json({ error: 'appointment_id is required' }, { status: 400 });
    }

    // Get appointment details
    const appointment = await base44.asServiceRole.entities.Appointment.get(appointment_id);
    
    if (!appointment) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Get provider details
    const provider = await base44.asServiceRole.entities.Provider.get(appointment.provider_id);
    
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    // Send email reminder to patient
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: appointment.patient_email,
      subject: `Reminder: Upcoming Appointment Tomorrow`,
      from_name: 'MedRevolve',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A6741;">Appointment Reminder</h2>
          
          <p>Hi there,</p>
          
          <p>This is a friendly reminder about your upcoming appointment:</p>
          
          <div style="background-color: #F5F0E8; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Provider:</strong> ${provider.name}, ${provider.title}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${appointment.type.replace('_', ' ')}</p>
          </div>
          
          <p>Please ensure you have:</p>
          <ul>
            <li>A stable internet connection</li>
            <li>A quiet, private space</li>
            <li>Any medical records or questions prepared</li>
          </ul>
          
          <p>You can join your video call from your Patient Portal when it's time.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://app.medrevolve.com" style="background-color: #4A6741; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; display: inline-block;">Go to Patient Portal</a>
          </p>
          
          <p style="color: #5A6B5A; font-size: 14px; margin-top: 30px;">
            If you need to reschedule or cancel, please do so at least 24 hours in advance.
          </p>
          
          <p style="color: #5A6B5A; font-size: 14px;">
            Best regards,<br>
            The MedRevolve Team
          </p>
        </div>
      `
    });

    return Response.json({ 
      success: true,
      message: 'Reminder sent successfully',
      appointment_id
    });

  } catch (error) {
    console.error('Error sending reminder:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});