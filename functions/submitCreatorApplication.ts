import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate required fields
    if (!data.full_name || !data.email || !data.platform || !data.followers_count) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create application record
    const application = await base44.asServiceRole.entities.CreatorApplication.create({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || '',
      platform: data.platform,
      platform_handle: data.platform_handle || '',
      followers_count: data.followers_count,
      audience_niche: data.audience_niche || '',
      why_partner: data.why_partner || '',
      status: 'pending'
    });

    // Send notification to creators@medrevolve.com
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Creator Program',
      to: 'creators@medrevolve.com',
      subject: `New Creator Application - ${data.full_name}`,
      body: `
🎯 New Creator Application Received

Name: ${data.full_name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Platform: ${data.platform}
Handle: ${data.platform_handle || 'Not provided'}
Followers: ${data.followers_count}
Niche: ${data.audience_niche || 'Not provided'}

Why Partner:
${data.why_partner || 'Not provided'}

Application ID: ${application.id}
Submitted: ${new Date().toLocaleString()}

Action Required: Review and approve/reject in dashboard.
      `
    });

    // Send confirmation to applicant
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Creator Program',
      to: data.email,
      subject: 'Application Received - MedRevolve Creator Program',
      body: `
Hi ${data.full_name},

Thank you for applying to the MedRevolve Creator Program! 🎉

We're excited to review your application and learn more about how we can collaborate.

What Happens Next:
✓ Our team will review your submission within 24-48 hours
✓ We'll evaluate your audience fit and content alignment
✓ You'll receive an email with our decision and next steps

In the meantime, feel free to:
• Explore our product catalog at medrevolve.com
• Check out our creator resources and marketing materials
• Connect with us on social media

We appreciate your interest in partnering with MedRevolve!

Best regards,
The MedRevolve Creator Team

Questions? Reply to this email anytime.
      `
    });

    // Send to Zapier webhook
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/';
    const webhookPayload = {
      name: data.full_name,
      email: data.email,
      phone: data.phone || '',
      company_name: '',
      platform: data.platform,
      followers_count: data.followers_count,
      audience_niche: data.audience_niche || '',
      message: data.why_partner || '',
      form_type: 'creator_application'
    };

    console.log('📤 Sending to Zapier webhook:', webhookUrl);
    console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));

    let zapierStatus = 'pending';
    let zapierError = null;
    const zapierSentAt = new Date().toISOString();

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });

      const responseBody = await webhookResponse.text();
      
      console.log('✅ Zapier response status:', webhookResponse.status);
      console.log('✅ Zapier response body:', responseBody);

      if (webhookResponse.ok) {
        zapierStatus = 'success';
      } else {
        zapierStatus = 'failed';
        zapierError = `HTTP ${webhookResponse.status}: ${responseBody}`;
        console.error('❌ Zapier webhook failed:', zapierError);
      }
    } catch (webhookError) {
      zapierStatus = 'failed';
      zapierError = webhookError.message;
      console.error('❌ Zapier webhook error:', webhookError);
    }

    // Update application record with webhook status
    await base44.asServiceRole.entities.CreatorApplication.update(application.id, {
      zapier_status: zapierStatus,
      zapier_error: zapierError,
      zapier_sent_at: zapierSentAt
    });

    console.log('📊 Webhook tracking updated:', { zapierStatus, zapierError, zapierSentAt });

    return Response.json({
      success: true,
      application_id: application.id,
      message: 'Application submitted successfully',
      zapier_status: zapierStatus
    });

  } catch (error) {
    console.error('Error submitting creator application:', error);
    return Response.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
});