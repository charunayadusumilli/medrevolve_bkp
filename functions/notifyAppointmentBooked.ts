import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    // Send notification to admin
    if (adminEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: "MedRevolve Appointments",
        to: adminEmail,
        subject: `📅 New Appointment Booked: ${appointment.type}`,
        body: `
          <h2>New Appointment Scheduled</h2>
          <p><strong>Patient:</strong> ${appointment.patient_email}</p>
          <p><strong>Provider:</strong> ${providerName}</p>
          <p><strong>Type:</strong> ${appointment.type}</p>
          <p><strong>Date & Time:</strong> ${new Date(appointment.appointment_date).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${appointment.duration_minutes} minutes</p>
          <p><strong>Reason:</strong> ${appointment.reason || 'Not specified'}</p>
          ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
          <hr>
          <p>Appointment has been confirmed and added to the schedule.</p>
        `
      });
    }

    // Send confirmation to patient
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: "MedRevolve",
      to: appointment.patient_email,
      subject: `✅ Appointment Confirmed - ${new Date(appointment.appointment_date).toLocaleDateString()}`,
      body: `
        <h2>Your Appointment is Confirmed</h2>
        <p>Hello,</p>
        <p>Your appointment has been successfully scheduled.</p>
        <hr>
        <p><strong>Provider:</strong> ${providerName}</p>
        <p><strong>Date & Time:</strong> ${new Date(appointment.appointment_date).toLocaleString()}</p>
        <p><strong>Type:</strong> ${appointment.type}</p>
        <p><strong>Duration:</strong> ${appointment.duration_minutes} minutes</p>
        <hr>
        <p>We'll send you a reminder before your appointment.</p>
        <p>If you need to reschedule, please log in to your patient portal.</p>
        <br>
        <p>Best regards,<br>MedRevolve Team</p>
      `
    });

    return Response.json({ 
      success: true,
      message: "Appointment notifications sent"
    });

  } catch (error) {
    console.error("Notification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});