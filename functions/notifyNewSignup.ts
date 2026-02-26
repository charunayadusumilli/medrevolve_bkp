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

    // Handle both User and Partner entity create events
    if (event?.type !== "create" || !["User", "Partner"].includes(event?.entity_name)) {
      return Response.json({ error: "Invalid event type" }, { status: 400 });
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const isPartner = event?.entity_name === "Partner";
    
    // Format the signup data based on entity type
    const signupData = isPartner ? {
      name: data.contact_name || data.business_name,
      email: data.email,
      type: "Partner",
      business: data.business_name,
      businessType: data.business_type,
      phone: data.phone,
      partnerCode: data.partner_code,
      subscriptionStatus: data.subscription_status,
      created: data.created_date
    } : {
      name: data.full_name || data.email,
      email: data.email,
      type: "User",
      role: data.role,
      created: data.created_date
    };

    // Send email notification
    if (adminEmail) {
      const emailSubject = isPartner 
        ? `🤝 New Partner Signup: ${data.contact_name} (${data.business_name})`
        : `🎉 New User Signup: ${data.full_name || data.email}`;
      
      const emailBody = isPartner
        ? `
          <h2>New Partner Registered</h2>
          <p><strong>Contact Name:</strong> ${data.contact_name}</p>
          <p><strong>Business Name:</strong> ${data.business_name}</p>
          <p><strong>Business Type:</strong> ${data.business_type}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Partner Code:</strong> ${data.partner_code}</p>
          <p><strong>Subscription Status:</strong> ${data.subscription_status}</p>
          <p><strong>Registered:</strong> ${new Date(data.created_date).toLocaleString()}</p>
          <hr>
          <p>Partner account has been created and added to the system.</p>
        `
        : `
          <h2>New User Registered</h2>
          <p><strong>Name:</strong> ${data.full_name || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Role:</strong> ${data.role}</p>
          <p><strong>Registered:</strong> ${new Date(data.created_date).toLocaleString()}</p>
          <hr>
          <p>User has been added to the system.</p>
        `;

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: "MedRevolve Notifications",
        to: adminEmail,
        subject: emailSubject,
        body: emailBody
      });
    }

    // Create contact in Zoho CRM
    try {
      const token = await getZohoAccessToken();
      const domain = Deno.env.get("ZOHO_DOMAIN") || "zoho.com";

      const contactData = isPartner ? {
        data: [{
          First_Name: data.contact_name?.split(' ')[0] || data.business_name,
          Last_Name: data.contact_name?.split(' ').slice(1).join(' ') || data.contact_name || "Partner",
          Email: data.email,
          Phone: data.phone || "",
          Lead_Source: "Partner Signup",
          Description: `Business: ${data.business_name}\nBusiness Type: ${data.business_type}\nPartner Code: ${data.partner_code}\nSignup Date: ${new Date(data.created_date).toLocaleString()}`,
          Tag: [{
            name: "MedRevolve_Partner"
          }, {
            name: `BusinessType_${data.business_type?.replace(/\s+/g, '_')}`
          }]
        }]
      } : {
        data: [{
          First_Name: data.full_name?.split(' ')[0] || "User",
          Last_Name: data.full_name?.split(' ').slice(1).join(' ') || data.email.split('@')[0],
          Email: data.email,
          Lead_Source: "Website Signup",
          Description: `User Role: ${data.role}\nSignup Date: ${new Date(data.created_date).toLocaleString()}`,
          Tag: [{
            name: "MedRevolve_Customer"
          }, {
            name: `Role_${data.role}`
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
      message: isPartner 
        ? "Partner signup notification sent and contact created in Zoho CRM"
        : "User signup notification sent and contact created in Zoho CRM"
    });

  } catch (error) {
    console.error("Notification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});