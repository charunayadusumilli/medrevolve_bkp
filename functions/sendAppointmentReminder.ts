import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get appointments scheduled for tomorrow (24 hours from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    // Get all appointments for tomorrow
    const appointments = await base44.asServiceRole.entities.Appointment.list();
    const tomorrowAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= tomorrow && aptDate < dayAfter && apt.status !== 'cancelled';
    });

    if (tomorrowAppointments.length === 0) {
      return Response.json({ 
        success: true,
        message: 'No appointments scheduled for tomorrow',
        reminders_sent: 0
      });
    }

    let successCount = 0;
    let errors = [];

    // Send reminders for each appointment
    for (const appointment of tomorrowAppointments) {
      try {
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

        successCount++;
      } catch (error) {
        console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
        errors.push({ appointment_id: appointment.id, error: error.message });
      }
    }

    return Response.json({ 
      success: true,
      message: `Sent ${successCount} reminder(s) for tomorrow's appointments`,
      reminders_sent: successCount,
      total_appointments: tomorrowAppointments.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in appointment reminder automation:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});