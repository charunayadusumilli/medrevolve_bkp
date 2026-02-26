import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, html }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${from_name} <noreply@medrevolve.com>`,
      to: [to],
      subject,
      html
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend error:', errText);
    throw new Error(`Resend failed: ${errText}`);
  } else {
    console.log('✅ Email sent via Resend to:', to);
  }
}

async function getZohoAccessToken() {
  const clientId = Deno.env.get("ZOHO_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_REFRESH_TOKEN");
  const tokenUrl = "https://accounts.zoho.com/oauth/v2/token";
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

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@medrevolve.com";
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

    // Send welcome email to partner
    if (isPartner && data.email) {
      try {
        const firstName = data.contact_name?.split(' ')[0] || data.business_name;
        await sendEmail({
          from_name: "MedRevolve Partners",
          to: data.email,
          subject: `Welcome ${data.business_name}! Your Partner Account is Ready`,
          html: `<h2>Welcome to MedRevolve Partners!</h2>
<p>Hi ${firstName},</p>
<p>Congratulations! Your partner account is ready.</p>
<p><strong>Partner Code:</strong> ${data.partner_code}</p>
<p><strong>Status:</strong> ${data.subscription_status}</p>
<h3>What's Included:</h3>
<ul>
<li>White-label client portal</li>
<li>25+ telehealth programs</li>
<li>Full compliance support</li>
<li>Partner dashboard with analytics</li>
<li>Marketing resources</li>
</ul>
<p>Log in to your partner portal to get started!</p>
<p>Questions? Contact us at partners@medrevolve.com</p>`
        });
      } catch (emailError) {
        console.error("Failed to send partner welcome email:", emailError);
      }
    }

    // Send welcome email to the new user (not for partners since they have a different flow)
    if (!isPartner && data.email) {
      try {
        await sendEmail({
          from_name: "MedRevolve",
          to: data.email,
          subject: "Welcome to MedRevolve! 🌿",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #2D3A2D; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MedRevolve</h1>
                <p style="color: #A8C99B; margin: 8px 0 0;">Your wellness journey starts here</p>
              </div>
              <div style="background: #FDFBF7; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E8E0D5;">
                <p style="color: #2D3A2D; font-size: 16px;">Hi ${data.full_name || 'there'},</p>
                <p style="color: #555; line-height: 1.6;">Thank you for joining MedRevolve! We're excited to help you on your personalized wellness journey.</p>
                <p style="color: #555; line-height: 1.6;">With MedRevolve, you get access to:</p>
                <ul style="color: #555; line-height: 2;">
                  <li>Licensed healthcare providers available for telehealth consultations</li>
                  <li>Personalized treatment protocols tailored to your goals</li>
                  <li>Prescription medications delivered to your door in 24-48 hours</li>
                  <li>Ongoing support and follow-up care</li>
                </ul>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://medrevolve.base44.app" style="background: #2D3A2D; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px;">Get Started →</a>
                </div>
                <p style="color: #999; font-size: 13px; text-align: center; margin-top: 24px;">If you have any questions, just reply to this email or visit our <a href="https://medrevolve.base44.app" style="color: #4A6741;">help center</a>.</p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Failed to send user welcome email:", emailError);
      }
    }

    // Send email notification to admin
    try {
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

      await sendEmail({
        from_name: "MedRevolve Notifications",
        to: adminEmail,
        subject: emailSubject,
        html: emailBody
      });
    } catch (adminEmailError) {
      console.error("Failed to send admin notification email:", adminEmailError);
    }

    // Create contact in Zoho CRM
    try {
      const token = await getZohoAccessToken();

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

      await fetch("https://www.zohoapis.com/crm/v2/Contacts", {
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