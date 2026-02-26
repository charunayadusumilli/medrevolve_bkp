import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (event?.type !== "create" || event?.entity_name !== "Appointment") {
      return Response.json({ error: "Invalid event type" }, { status: 400 });
    }

    const appointment = data;
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    // Get provider details
    let providerName = "Provider";
    try {
      const providers = await base44.asServiceRole.entities.Provider.filter({ id: appointment.provider_id });
      if (providers?.length > 0) {
        providerName = providers[0].name;
      }
    } catch (e) {
      console.log("Could not fetch provider:", e);
    }

    const appointmentDate = new Date(appointment.appointment_date).toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Send notification to admin
    if (adminEmail) {
      await resend.emails.send({
        from: "MedRevolve Appointments <noreply@medrevolve.com>",
        to: adminEmail,
        subject: `📅 New Appointment Booked: ${appointment.type}`,
        html: `
          <h2>New Appointment Scheduled</h2>
          <p><strong>Patient:</strong> ${appointment.patient_email}</p>
          <p><strong>Provider:</strong> ${providerName}</p>
          <p><strong>Type:</strong> ${appointment.type}</p>
          <p><strong>Date & Time:</strong> ${appointmentDate}</p>
          <p><strong>Duration:</strong> ${appointment.duration_minutes} minutes</p>
          <p><strong>Reason:</strong> ${appointment.reason || 'Not specified'}</p>
          ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
          <hr>
          <p>Appointment has been confirmed and added to the schedule.</p>
        `
      });
    }

    // Send confirmation email to patient
    if (appointment.patient_email) {
      await resend.emails.send({
        from: "MedRevolve <noreply@medrevolve.com>",
        to: appointment.patient_email,
        subject: `✅ Appointment Confirmed`,
        html: `
          <h2>Your Appointment is Confirmed</h2>
          <p>Hi there,</p>
          <p>Your appointment has been successfully scheduled.</p>
          <p><strong>Provider:</strong> ${providerName}</p>
          <p><strong>Type:</strong> ${appointment.type?.replace(/_/g, ' ')}</p>
          <p><strong>Date & Time:</strong> ${appointmentDate}</p>
          <p><strong>Duration:</strong> ${appointment.duration_minutes} minutes</p>
          ${appointment.reason ? `<p><strong>Reason:</strong> ${appointment.reason}</p>` : ''}
          <hr>
          <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
          <p>— The MedRevolve Team</p>
        `
      });
    }

    return Response.json({ 
      success: true,
      message: "Appointment notifications sent"
    });

  } catch (error) {
    console.error("Notification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});