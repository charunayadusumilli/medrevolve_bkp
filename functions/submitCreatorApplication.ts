import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmailSafe(base44, params) {
  try {
    await base44.asServiceRole.integrations.Core.SendEmail(params);
  } catch (e) {
    console.warn('Email send skipped (non-fatal):', e.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.full_name || !data.email || !data.platform || !data.followers_count) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    console.log('✅ CreatorApplication record created:', application.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      await sendEmailSafe(base44, {
        from_name: 'MedRevolve Creator Program',
        to: adminEmail,
        subject: `New Creator Application - ${data.full_name}`,
        body: `New Creator Application\n\nName: ${data.full_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nPlatform: ${data.platform}\nHandle: ${data.platform_handle || 'N/A'}\nFollowers: ${data.followers_count}\nNiche: ${data.audience_niche || 'N/A'}\n\nWhy Partner:\n${data.why_partner || 'N/A'}\n\nApplication ID: ${application.id}\nSubmitted: ${new Date().toLocaleString()}`
      });
    }

    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Creator Program',
      to: data.email,
      subject: 'Application Received - MedRevolve Creator Program',
      body: `Hi ${data.full_name},\n\nThank you for applying to the MedRevolve Creator Program!\n\nOur team will review your submission within 24-48 hours and reach out with next steps.\n\nBest regards,\nThe MedRevolve Creator Team`
    });

    // Zapier webhook (non-blocking)
    let zapierStatus = 'pending';
    let zapierError = null;
    const zapierSentAt = new Date().toISOString();

    try {
      const webhookResponse = await fetch('https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.full_name, email: data.email, phone: data.phone || '',
          company_name: '', platform: data.platform,
          followers_count: data.followers_count, audience_niche: data.audience_niche || '',
          message: data.why_partner || '', form_type: 'creator_application'
        })
      });
      zapierStatus = webhookResponse.ok ? 'success' : 'failed';
      if (!webhookResponse.ok) zapierError = `HTTP ${webhookResponse.status}`;
    } catch (e) {
      zapierStatus = 'failed';
      zapierError = e.message;
      console.warn('Zapier webhook error (non-fatal):', e.message);
    }

    await base44.asServiceRole.entities.CreatorApplication.update(application.id, {
      zapier_status: zapierStatus,
      zapier_error: zapierError,
      zapier_sent_at: zapierSentAt
    });

    return Response.json({
      success: true,
      application_id: application.id,
      message: 'Application submitted successfully',
      zapier_status: zapierStatus
    });

  } catch (error) {
    console.error('Error submitting creator application:', error);
    return Response.json({ error: error.message || 'Failed to submit application' }, { status: 500 });
  }
});