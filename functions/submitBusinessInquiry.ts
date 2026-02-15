import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate required fields
    if (!data.company_name || !data.contact_name || !data.email || !data.interest_type) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create inquiry record
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

    // Send notification to business@medrevolve.com
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Business Development',
      to: 'business@medrevolve.com',
      subject: `New Business Inquiry - ${data.company_name}`,
      body: `
🏢 New Business Inquiry Received

Company: ${data.company_name}
Contact: ${data.contact_name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Industry: ${data.industry || 'Not specified'}
Interest: ${data.interest_type}
Company Size: ${data.company_size || 'Not provided'}

Message:
${data.message || 'No additional message'}

Inquiry ID: ${inquiry.id}
Submitted: ${new Date().toLocaleString()}

Action Required: Follow up within 1-2 business days.
      `
    });

    // Send confirmation to business contact
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Business Development',
      to: data.email,
      subject: 'Thank You for Your Interest - MedRevolve',
      body: `
Hi ${data.contact_name},

Thank you for your interest in partnering with MedRevolve! 🤝

We're excited to explore how we can support ${data.company_name}'s wellness initiatives.

What's Next:
✓ Our business development team will review your inquiry
✓ We'll reach out within 1-2 business days
✓ We'll schedule a consultation to discuss your specific needs

Based on your interest in "${data.interest_type}", we'll prepare relevant information about:
• Product catalogs and pricing
• Partnership structures and terms
• Implementation timelines
• Success stories from similar businesses

In the meantime, you can explore our business solutions at medrevolve.com/business

We look forward to speaking with you soon!

Best regards,
MedRevolve Business Development Team

Need immediate assistance? Call us at 1-800-MED-REVO
      `
    });

    // Send to Zapier webhook
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
    } catch (webhookError) {
      console.error('Zapier webhook error:', webhookError);
      // Don't fail the entire request if webhook fails
    }

    return Response.json({
      success: true,
      inquiry_id: inquiry.id,
      message: 'Inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting business inquiry:', error);
    return Response.json(
      { error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
});