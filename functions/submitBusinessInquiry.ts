import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

    // Notify admin
    if (adminEmail) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Business Development',
          to: adminEmail,
          subject: `New Business Inquiry - ${data.company_name}`,
          body: `New Business Inquiry Received\n\nCompany: ${data.company_name}\nContact: ${data.contact_name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nIndustry: ${data.industry || 'N/A'}\nInterest: ${data.interest_type}\nCompany Size: ${data.company_size || 'N/A'}\n\nMessage:\n${data.message || 'None'}\n\nInquiry ID: ${inquiry.id}\nSubmitted: ${new Date().toLocaleString()}\n\nAction Required: Follow up within 1-2 business days.`
        });
      } catch (e) {
        console.error('Admin email error:', e.message);
      }
    }

    // Confirmation to business contact
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Business Development',
        to: data.email,
        subject: 'Thank You for Your Interest - MedRevolve',
        body: `Hi ${data.contact_name},\n\nThank you for your interest in partnering with MedRevolve!\n\nWe're excited to explore how we can support ${data.company_name}'s wellness initiatives.\n\nWhat's Next:\n- Our business development team will review your inquiry\n- We'll reach out within 1-2 business days to schedule a consultation\n\nInquiry ID: ${inquiry.id}\n\nBest regards,\nMedRevolve Business Development Team`
      });
    } catch (e) {
      console.error('Business confirmation email error:', e.message);
    }

    // Send to Zapier webhook (non-blocking)
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/26459574/uevvvwi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.contact_name,
          email: data.email,
          phone: data.phone || '',
          company_name: data.company_name,
          platform: '',
          followers_count: '',
          audience_niche: data.industry || '',
          message: data.message || '',
          form_type: 'business_inquiry'
        })
      });
    } catch (e) {
      console.error('Zapier webhook error:', e.message);
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