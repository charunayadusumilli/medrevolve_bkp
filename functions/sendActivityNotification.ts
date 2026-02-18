import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { 
      eventType,
      pageName,
      userEmail,
      action,
      metadata,
      severity = 'info'
    } = await req.json();

    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (!adminEmail) {
      return Response.json({ success: true, notified: false });
    }

    // Filter what gets notified (avoid spam)
    const notifiableEvents = ['button_click', 'form_submit', 'booking', 'order', 'error', 'signup'];
    const shouldNotify = notifiableEvents.includes(eventType) || severity === 'critical';

    if (!shouldNotify) {
      return Response.json({ success: true, notified: false });
    }

    const timestamp = new Date().toISOString();
    const eventLabel = {
      page_view: '👁️ Page View',
      button_click: '🖱️ Button Click',
      form_submit: '📝 Form Submitted',
      booking: '📅 Booking',
      order: '🛒 Order',
      error: '⚠️ Error',
      signup: '✨ New Signup'
    }[eventType] || eventType;

    const subject = `${eventLabel} - ${pageName} ${severity === 'critical' ? '[URGENT]' : ''}`;
    const body = `
Activity Notification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Event:    ${eventLabel}
Page:     ${pageName}
Action:   ${action || 'N/A'}
Time:     ${timestamp}
User:     ${userEmail || 'Anonymous'}
Severity: ${severity.toUpperCase()}

${metadata ? `Details:
${JSON.stringify(metadata, null, 2)}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Activity Monitor',
        to: adminEmail,
        subject: subject,
        body: body
      });
    } catch (emailErr) {
      console.error('Notification email error:', emailErr);
    }

    return Response.json({ 
      success: true,
      notified: true
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});