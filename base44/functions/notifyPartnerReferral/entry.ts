import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const INTERNAL_INBOX = 'rned@medrevolve.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { name, email, service_interest, business_name, phone, notes } = body;

    if (!name || !email) {
      return Response.json({ error: 'name and email are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return Response.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const service = service_interest || 'MedRevolve operator services';
    const who = business_name ? `${name} (${business_name})` : name;

    const confirmationBody = [
      `Hi ${name.split(' ')[0]},`,
      '',
      `We have your request for ${service}. Here is what happens next:`,
      '',
      '1. A named person on our team replies within one business day.',
      '2. You get a fixed-price audit scope within three business days.',
      '3. Kickoff happens inside a week, against a written scope.',
      '',
      'Nothing hourly starts before that fixed-price audit is complete.',
      '',
      'If anything changes in the meantime, reply to this email or call (980) 899-6800.',
      '',
      'MedRevolve',
      'https://medrevolveb2b.com/services',
    ].join('\n');

    const notificationBody = [
      'New referral submitted.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'not provided'}`,
      `Business: ${business_name || 'not provided'}`,
      `Service: ${service}`,
      `Notes: ${notes || 'none'}`,
      '',
      'Respond within one business day.',
    ].join('\n');

    const results = await Promise.allSettled([
      base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: `We have your ${service} request`,
        body: confirmationBody,
        category: 'transactional',
      }),
      base44.asServiceRole.integrations.Core.SendEmail({
        to: INTERNAL_INBOX,
        subject: `New referral: ${who} — ${service}`,
        body: notificationBody,
        category: 'transactional',
      }),
    ]);

    const [confirmation, notification] = results;
    if (confirmation.status === 'rejected') {
      console.error('Referral confirmation email failed:', confirmation.reason?.message);
    }
    if (notification.status === 'rejected') {
      console.error('Referral internal notification failed:', notification.reason?.message);
    }

    return Response.json({
      success: true,
      confirmationEmail: confirmation.status,
      internalNotification: notification.status,
    });
  } catch (error) {
    console.error('notifyPartnerReferral error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});