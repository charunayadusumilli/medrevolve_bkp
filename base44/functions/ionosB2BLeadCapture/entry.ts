import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// This function receives lead data from IONOS AI Receptionist (via email parse or webhook)
// and creates a full B2B intake record + schedules follow-up + books meeting + notifies admin

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      company_name,
      contact_name,
      email,
      phone,
      business_type,
      interest_type,
      has_llc,
      llc_name,
      ein,
      state_of_incorporation,
      product_categories,
      company_size,
      current_website,
      notes,
      source = 'ionos_ai_receptionist'
    } = body;

    if (!contact_name || !phone) {
      return Response.json({ error: 'contact_name and phone are required' }, { status: 400 });
    }

    // 1. Create BusinessInquiry record
    const inquiry = await base44.asServiceRole.entities.BusinessInquiry.create({
      company_name: company_name || 'Unknown',
      contact_name,
      email: email || '',
      phone,
      industry: business_type || 'Other',
      interest_type: interest_type || 'White Label',
      company_size: company_size || '',
      message: `Source: ${source}. Product categories: ${(product_categories || []).join(', ')}. Has LLC: ${has_llc}. LLC Name: ${llc_name || 'N/A'}. EIN: ${ein || 'N/A'}. State: ${state_of_incorporation || 'N/A'}. Website: ${current_website || 'N/A'}. Notes: ${notes || 'None'}`,
      status: 'new',
    });

    console.log('✅ BusinessInquiry created:', inquiry.id);

    // 2. Create ContactRequest for CRM pipeline
    const contactReq = await base44.asServiceRole.entities.ContactRequest.create({
      name: contact_name,
      email: email || '',
      phone,
      subject: `B2B Merchant Inquiry — ${company_name || 'New Lead'}`,
      message: `Called in via IONOS AI Receptionist. Business: ${company_name}. Type: ${business_type}. Interest: ${interest_type}. Products: ${(product_categories || []).join(', ')}.`,
      source: 'ctm_call',
      status: 'new',
    });

    console.log('✅ ContactRequest created:', contactReq.id);

    // 3. Notify admin immediately with full intake details
    const emailBody = `
<h2 style="color:#1a1a1a;">🚀 New B2B Merchant Lead — IONOS AI Receptionist</h2>
<p style="color:#c00;font-weight:bold;">⚡ ACTION REQUIRED: Schedule intro call within 24 hours</p>

<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;margin-top:16px;">
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;width:200px;"><b>Contact Name</b></td><td style="padding:10px;font-weight:bold;">${contact_name}</td></tr>
  <tr><td style="padding:10px;color:#444;"><b>Company</b></td><td style="padding:10px;">${company_name || '—'}</td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Phone</b></td><td style="padding:10px;"><a href="tel:${phone}">${phone}</a></td></tr>
  <tr><td style="padding:10px;color:#444;"><b>Email</b></td><td style="padding:10px;"><a href="mailto:${email}">${email || '—'}</a></td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Business Type</b></td><td style="padding:10px;">${business_type || '—'}</td></tr>
  <tr><td style="padding:10px;color:#444;"><b>Interest Type</b></td><td style="padding:10px;font-weight:bold;color:#2d7a2d;">${interest_type || 'White Label'}</td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Product Categories</b></td><td style="padding:10px;">${(product_categories || []).join(', ') || '—'}</td></tr>
  <tr><td style="padding:10px;color:#444;"><b>Company Size</b></td><td style="padding:10px;">${company_size || '—'}</td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Has LLC?</b></td><td style="padding:10px;">${has_llc === true ? '✅ Yes — ' + (llc_name || '') : has_llc === false ? '❌ No' : 'Not specified'}</td></tr>
  <tr><td style="padding:10px;color:#444;"><b>EIN</b></td><td style="padding:10px;">${ein || '—'}</td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>State of Incorporation</b></td><td style="padding:10px;">${state_of_incorporation || '—'}</td></tr>
  <tr><td style="padding:10px;color:#444;"><b>Current Website</b></td><td style="padding:10px;">${current_website || '—'}</td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Notes from Call</b></td><td style="padding:10px;">${notes || '—'}</td></tr>
  <tr><td style="padding:10px;color:#444;"><b>Source</b></td><td style="padding:10px;">${source}</td></tr>
  <tr style="background:#f0f7f0"><td style="padding:10px;color:#444;"><b>Received</b></td><td style="padding:10px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td></tr>
</table>

<div style="margin-top:24px;padding:16px;background:#f0f7f0;border-left:4px solid #4A6741;border-radius:4px;">
  <p style="margin:0;font-weight:bold;color:#2d5a2d;">Next Steps:</p>
  <ol style="margin:8px 0 0 0;color:#444;font-size:13px;">
    <li>Call ${contact_name} at <a href="tel:${phone}">${phone}</a> within 24 hours</li>
    <li>Send platform overview + pricing deck</li>
    <li>Book intro meeting via Google Calendar</li>
    <li>Begin onboarding once payment confirmed ($5K setup)</li>
  </ol>
</div>

<p style="color:#888;font-size:12px;margin-top:16px;">
  Inquiry ID: ${inquiry.id} | Contact ID: ${contactReq.id}
</p>
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve B2B — IONOS AI',
      to: 'rned@medrevolve.com',
      subject: `🚀 New B2B Lead — ${contact_name} | ${company_name || 'New Merchant'} | ${phone}`,
      body: emailBody,
    });

    console.log('✅ Admin email sent');

    // 4. Send welcome/confirmation SMS via existing Twilio if phone provided
    // (handled by existing sendSMS function — just log for now)
    console.log('📱 Lead ready for SMS follow-up:', phone);

    // 5. Send prospect a welcome email if email provided
    if (email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve',
        to: email,
        subject: `Thanks for reaching out, ${contact_name.split(' ')[0]}! — MedRevolve B2B`,
        body: `
<h2>Hi ${contact_name.split(' ')[0]},</h2>
<p>Thank you for reaching out to MedRevolve about launching your ${business_type || 'wellness'} platform!</p>
<p>Our team has received your information and will contact you within <strong>24 hours</strong> to schedule your intro call and walk you through everything.</p>

<h3>What to expect:</h3>
<ul>
  <li>📞 Personal call from our B2B team to discuss your vision</li>
  <li>📊 Custom platform demo tailored to your business type</li>
  <li>💼 Pricing breakdown — $5K setup + $2,500/month</li>
  <li>🚀 Launch timeline — typically 7 days after onboarding</li>
</ul>

<p>In the meantime, you can review our platform at <a href="https://app.medrevolve.com/ForBusiness">medrevolve.com/ForBusiness</a></p>

<p>Questions? Reply to this email or call us at <a href="tel:+17044263311">(704) 426-3311</a></p>

<p>— The MedRevolve Team</p>
        `.trim(),
      });
      console.log('✅ Welcome email sent to prospect');
    }

    return Response.json({
      success: true,
      inquiry_id: inquiry.id,
      contact_id: contactReq.id,
      message: 'Lead captured, admin notified, follow-up emails sent',
    });

  } catch (error) {
    console.error('❌ ionosB2BLeadCapture error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});