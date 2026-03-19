import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function getZohoAccessToken() {
  const clientId = Deno.env.get("ZOHO_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_REFRESH_TOKEN");
  const response = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ refresh_token: refreshToken, client_id: clientId, client_secret: clientSecret, grant_type: "refresh_token" })
  });
  const data = await response.json();
  return data.access_token;
}

async function sendEmail({ to, subject, html }) {
  const token = await getZohoAccessToken();
  const res = await fetch('https://mail.zoho.com/api/accounts/2234922000000008002/messages', {
    method: 'POST',
    headers: { 'Authorization': `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromAddress: 'charunya.adusumilli@hanu-consulting.com', toAddress: to, subject, content: html, mailFormat: 'html' })
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Zoho Mail error:', errText);
    throw new Error(`Zoho Mail failed: ${errText}`);
  } else {
    console.log('✅ Email sent via Zoho Mail to:', to);
  }
}

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
      await sendEmail({
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
      await sendEmail({
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