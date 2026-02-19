import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendEmail({ to, from_name, subject, body }) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${from_name} <onboarding@resend.dev>`,
      to: [to],
      subject,
      html: body
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
  } else {
    console.log('✅ Email sent via Resend to:', to);
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

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    await sendEmail({
      from_name: 'MedRevolve Platform',
      to: adminEmail,
      subject: `🎯 New Creator Application — ${data.full_name} [${data.platform}, ${data.followers_count} followers]`,
      body: `<pre style="font-family:monospace;font-size:13px;">A new creator has applied to the MedRevolve Creator Program.

CREATOR DETAILS
────────────────────────────────
Name:             ${data.full_name}
Email:            ${data.email}
Phone:            ${data.phone || 'Not provided'}
Platform:         ${data.platform}
Handle:           ${data.platform_handle ? '@' + data.platform_handle : 'Not provided'}
Followers:        ${data.followers_count}
Audience Niche:   ${data.audience_niche || 'Not specified'}

Why They Want to Partner:
${data.why_partner || 'Not provided'}

ACTION CHECKLIST
────────────────────────────────
☐  Review profile & audience alignment
☐  Check engagement rate on their profile
☐  Assess content quality and compliance fit
☐  Approve or reject in Admin Dashboard
☐  If approved: send welcome + commission structure + affiliate link
☐  Respond within 24-48 hours

Reference ID:  ${application.id}
Submitted:     ${submittedAt} ET

Admin Dashboard → https://app.medrevolve.com/admin-dashboard</pre>`
    });

    await sendEmail({
      from_name: 'MedRevolve Creator Program',
      to: data.email,
      subject: `✅ Application Received — MedRevolve Creator Program`,
      body: `<pre style="font-family:monospace;font-size:13px;">Hi ${data.full_name.split(' ')[0]},

Thank you for applying to the MedRevolve Creator Program! We love your passion for wellness and can't wait to review your application.

YOUR APPLICATION
────────────────────────────────
Platform:       ${data.platform}${data.platform_handle ? ' (@' + data.platform_handle + ')' : ''}
Followers:      ${data.followers_count}
Niche:          ${data.audience_niche || 'General Wellness'}
Reference ID:   ${application.id}
Status:         Under Review

WHAT HAPPENS NEXT
────────────────────────────────
1. Our creator team reviews your application (24-48 hours)
2. We assess your audience fit with our wellness community
3. If approved, you'll receive your welcome package with:
   • Personalized affiliate link & promo code
   • Commission structure (up to 20%)
   • Content guidelines & brand assets
   • Dedicated creator support contact

QUESTIONS?
────────────────────────────────
Email:    creators@medrevolve.com
Web:      https://medrevolve.com/for-creators

Excited to potentially work together!

Best regards,
The MedRevolve Creator Team</pre>`
    });

    // ── Zapier webhook (non-blocking) ───────────────────────────────────────
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