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
    const payload = await req.json();
    
    // Handle both direct calls and entity automation payloads
    const application_id = payload.application_id || payload.event?.id;

    if (!application_id) {
      return Response.json({ error: "application_id required" }, { status: 400 });
    }

    // Get application details
    const applications = await base44.asServiceRole.entities.CreatorApplication.filter({ id: application_id });
    if (!applications || applications.length === 0) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    const app = applications[0];
    const token = await getZohoAccessToken();
    const domain = Deno.env.get("ZOHO_DOMAIN") || "zoho.com";

    // Create lead in Zoho CRM
    const leadData = {
      data: [{
        Company: "Creator - " + app.full_name,
        Last_Name: app.full_name,
        Email: app.email,
        Phone: app.phone || "",
        Lead_Source: "Creator Application",
        Lead_Status: app.status === "approved" ? "Qualified" : "Not Contacted",
        Description: `Platform: ${app.platform}\nHandle: ${app.platform_handle}\nFollowers: ${app.followers_count}\nNiche: ${app.audience_niche}\n\nWhy Partner:\n${app.why_partner}`,
        Tag: [{
          name: "MedRevolve_Creator"
        }, {
          name: `Platform_${app.platform}`
        }, {
          name: `Status_${app.status}`
        }]
      }]
    };

    const zohoResponse = await fetch(`https://www.zohoapis.${domain}/crm/v2/Leads`, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadData)
    });

    const result = await zohoResponse.json();

    if (!zohoResponse.ok) {
      throw new Error(`Zoho CRM error: ${JSON.stringify(result)}`);
    }

    // Send notification email
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (adminEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: "MedRevolve Zoho Sync",
        to: adminEmail,
        subject: `✅ Creator Application Synced to Zoho: ${app.full_name}`,
        body: `
          <h2>Creator Application Synced</h2>
          <p><strong>Name:</strong> ${app.full_name}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p><strong>Platform:</strong> ${app.platform} (@${app.platform_handle})</p>
          <p><strong>Followers:</strong> ${app.followers_count}</p>
          <p><strong>Status:</strong> ${app.status}</p>
          <p>Lead created in Zoho CRM successfully!</p>
        `
      });
    }

    return Response.json({ 
      success: true, 
      zoho_lead_id: result.data?.[0]?.details?.id,
      message: "Creator application synced to Zoho CRM"
    });

  } catch (error) {
    console.error("Zoho sync error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});