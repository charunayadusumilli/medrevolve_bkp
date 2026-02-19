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

    if (!data.company_name || !data.contact_name || !data.email || !data.interest_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await base44.asServiceRole.entities.BusinessInquiry.create({
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone || '',
      industry: data.industry || 'Other',
      interest_type: data.interest_type,
      company_size: data.company_size || '',
      message: data.message || '',
      status: 'new'
    });

    console.log('✅ BusinessInquiry record created:', inquiry.id);

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@medrevolve.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Admin notification ──────────────────────────────────────────────────
    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Platform',
      to: adminEmail,
      subject: `🏢 New Business Inquiry — ${data.company_name} [${data.interest_type}]`,
      body: `A new business inquiry has been submitted and requires follow-up within 1-2 business days.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  COMPANY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company Name:     ${data.company_name}
Contact Person:   ${data.contact_name}
Email:            ${data.email}
Phone:            ${data.phone || 'Not provided'}
Industry:         ${data.industry || 'Not specified'}
Interest Type:    ${data.interest_type}
Company Size:     ${data.company_size || 'Not specified'}

Message / Notes:
${data.message || 'None provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ACTION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐  Qualify the lead (size, budget, timeline)
☐  Research company background
☐  Respond within 1-2 business days
☐  Schedule a discovery call
☐  Send appropriate deck/proposal based on interest type:
     • White Label → whitelabel overview + pricing
     • Wholesale → catalog + volume pricing
     • Partnership → partnership framework doc
     • General Inquiry → product overview

Reference ID:  ${inquiry.id}
Submitted:     ${submittedAt} ET

Admin Dashboard → https://app.medrevolve.com/admin-dashboard`
    });

    // ── Confirmation to business ────────────────────────────────────────────
    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Business Development',
      to: data.email,
      subject: `✅ Inquiry Received — MedRevolve is excited to connect with ${data.company_name}`,
      body: `Hi ${data.contact_name},

Thank you for your interest in partnering with MedRevolve! We've received your inquiry and our business development team will reach out shortly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  YOUR INQUIRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company:         ${data.company_name}
Interest:        ${data.interest_type}
Industry:        ${data.industry || 'Not specified'}
Reference ID:    ${inquiry.id}
Status:          New — Under Review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT HAPPENS NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Our business development team reviews your inquiry (1-2 business days)
2. We prepare a tailored overview based on your interest in ${data.interest_type}
3. We schedule a discovery call to discuss your specific needs
4. You receive a custom proposal and next steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTIONS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    business@medrevolve.com
Web:      https://medrevolve.com/for-business

We look forward to exploring this opportunity with you!

Best regards,
MedRevolve Business Development Team`
    });

    // ── Zapier webhook (non-blocking) ───────────────────────────────────────
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.contact_name, email: data.email, phone: data.phone || '',
          company_name: data.company_name, platform: '', followers_count: '',
          audience_niche: data.industry || '', message: data.message || '',
          form_type: 'business_inquiry'
        })
      });
    } catch (e) {
      console.warn('Zapier webhook error (non-fatal):', e.message);
    }

    return Response.json({
      success: true,
      inquiry_id: inquiry.id,
      message: 'Inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting business inquiry:', error);
    return Response.json({ error: error.message || 'Failed to submit inquiry' }, { status: 500 });
  }
});