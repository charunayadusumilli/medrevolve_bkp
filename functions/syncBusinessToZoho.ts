import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function getZohoAccessToken() {
  const clientId = Deno.env.get("ZOHO_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_REFRESH_TOKEN");

  // Always use the real Zoho accounts domain for OAuth, not the custom domain
  const tokenUrl = `https://accounts.zoho.com/oauth/v2/token`;
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
    const inquiry_id = payload.inquiry_id || payload.event?.entity_id;

    if (!inquiry_id) {
      return Response.json({ error: "inquiry_id required" }, { status: 400 });
    }

    // Get inquiry details
    const inquiries = await base44.asServiceRole.entities.BusinessInquiry.filter({ id: inquiry_id });
    if (!inquiries || inquiries.length === 0) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const inquiry = inquiries[0];
    const token = await getZohoAccessToken();
    const domain = Deno.env.get("ZOHO_DOMAIN") || "zoho.com";

    // Determine lead priority
    const isHighPriority = ["White Label", "Partnership"].includes(inquiry.interest_type);

    // Create lead in Zoho CRM
    const leadData = {
      data: [{
        Company: inquiry.company_name,
        Last_Name: inquiry.contact_name,
        Email: inquiry.email,
        Phone: inquiry.phone || "",
        Lead_Source: "Business Inquiry",
        Lead_Status: inquiry.status === "qualified" ? "Qualified" : "Not Contacted",
        Rating: isHighPriority ? "Hot" : "Warm",
        Industry: inquiry.industry,
        Description: `Interest Type: ${inquiry.interest_type}\nCompany Size: ${inquiry.company_size}\n\nMessage:\n${inquiry.message}`,
        Tag: [{
          name: "MedRevolve_Business"
        }, {
          name: `Interest_${inquiry.interest_type.replace(/\s+/g, '_')}`
        }, {
          name: `Industry_${inquiry.industry.replace(/\s+/g, '_')}`
        }, {
          name: inquiry.status === "qualified" ? "High_Priority" : "Standard"
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
        subject: `${isHighPriority ? '🔥 HIGH PRIORITY' : '✅'} Business Inquiry Synced: ${inquiry.company_name}`,
        body: `
          <h2>Business Inquiry Synced to Zoho</h2>
          <p><strong>Company:</strong> ${inquiry.company_name}</p>
          <p><strong>Contact:</strong> ${inquiry.contact_name}</p>
          <p><strong>Email:</strong> ${inquiry.email}</p>
          <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
          <p><strong>Industry:</strong> ${inquiry.industry}</p>
          <p><strong>Interest Type:</strong> ${inquiry.interest_type}</p>
          <p><strong>Company Size:</strong> ${inquiry.company_size || 'Not specified'}</p>
          <p><strong>Priority:</strong> ${isHighPriority ? 'HIGH' : 'Standard'}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${inquiry.message}</p>
          <hr>
          <p>Lead created in Zoho CRM successfully!</p>
        `
      });
    }

    return Response.json({ 
      success: true, 
      zoho_lead_id: result.data?.[0]?.details?.id,
      message: "Business inquiry synced to Zoho CRM",
      priority: isHighPriority ? "high" : "standard"
    });

  } catch (error) {
    console.error("Zoho sync error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});