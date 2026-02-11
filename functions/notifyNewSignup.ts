import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function getZohoAccessToken() {
  const clientId = Deno.env.get("ZOHO_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_REFRESH_TOKEN");
  const domain = Deno.env.get("ZOHO_DOMAIN") || "zoho.com";

  const tokenUrl = `https://accounts.${domain}/oauth/v2/token`;
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token"
    })
  });

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // This is triggered by User entity create event
    if (event?.type !== "create" || event?.entity_name !== "User") {
      return Response.json({ error: "Invalid event type" }, { status: 400 });
    }

    const user = data;
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    // Send email notification
    if (adminEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: "MedRevolve Notifications",
        to: adminEmail,
        subject: `🎉 New User Signup: ${user.full_name || user.email}`,
        body: `
          <h2>New User Registered</h2>
          <p><strong>Name:</strong> ${user.full_name || 'N/A'}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
          <p><strong>Registered:</strong> ${new Date(user.created_date).toLocaleString()}</p>
          <hr>
          <p>User has been added to the system.</p>
        `
      });
    }

    // Create contact in Zoho CRM
    try {
      const token = await getZohoAccessToken();
      const domain = Deno.env.get("ZOHO_DOMAIN") || "zoho.com";

      const contactData = {
        data: [{
          First_Name: user.full_name?.split(' ')[0] || "User",
          Last_Name: user.full_name?.split(' ').slice(1).join(' ') || user.email.split('@')[0],
          Email: user.email,
          Lead_Source: "Website Signup",
          Description: `User Role: ${user.role}\nSignup Date: ${new Date(user.created_date).toLocaleString()}`,
          Tag: [{
            name: "MedRevolve_Customer"
          }, {
            name: `Role_${user.role}`
          }]
        }]
      };

      await fetch(`https://www.zohoapis.${domain}/crm/v2/Contacts`, {
        method: "POST",
        headers: {
          "Authorization": `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });
    } catch (zohoError) {
      console.error("Zoho sync failed:", zohoError);
      // Continue even if Zoho fails
    }

    return Response.json({ 
      success: true,
      message: "Signup notification sent and contact created"
    });

  } catch (error) {
    console.error("Notification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});