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

    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      await sendEmailSafe(base44, {
        from_name: 'MedRevolve Business Development',
        to: adminEmail,
        subject: `New Business Inquiry - ${data.company_name}`,
        body: `New Business Inquiry\n\nCompany: ${data.company_name}\nContact: ${data.contact_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nIndustry: ${data.industry || 'N/A'}\nInterest: ${data.interest_type}\nSize: ${data.company_size || 'N/A'}\n\nMessage:\n${data.message || 'None'}\n\nInquiry ID: ${inquiry.id}\nSubmitted: ${new Date().toLocaleString()}`
      });
    }

    await sendEmailSafe(base44, {
      from_name: 'MedRevolve Business Development',
      to: data.email,
      subject: 'Thank You for Your Interest - MedRevolve',
      body: `Hi ${data.contact_name},\n\nThank you for your interest in partnering with MedRevolve!\n\nOur business development team will reach out within 1-2 business days to schedule a consultation.\n\nInquiry ID: ${inquiry.id}\n\nBest regards,\nMedRevolve Business Development Team`
    });

    // Zapier webhook (non-blocking)
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