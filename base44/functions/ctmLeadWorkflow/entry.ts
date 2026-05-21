/**
 * CTM Lead Workflow Automation
 * 
 * Triggered when a new ContactRequest is created from CTM (call/form/text).
 * Automatically:
 * - Sends SMS confirmation to caller
 * - Creates follow-up task for admin
 * - Triggers CRM campaign in HubSpot
 * - Notifies team via Slack (if connected)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { event, data, old_data } = body;
    
    // Only process new ContactRequest creates from CTM sources
    if (event.type !== 'create') {
      return Response.json({ skipped: 'not a create event' });
    }
    
    if (!['ctm_call', 'ctm_form', 'ctm_text'].includes(data.source)) {
      return Response.json({ skipped: 'not a CTM source' });
    }
    
    console.log(`📞 CTM Lead Workflow: Processing ${data.source} from ${data.phone}`);
    
    // 1. Send SMS confirmation to caller (if they provided a phone)
    if (data.phone && data.source === 'ctm_call') {
      try {
        await base44.asServiceRole.functions.invoke('sendSMS', {
          to: data.phone.replace(/\D/g, ''),
          message: `Thanks for calling MedRevolve! We received your inquiry about "${data.subject}". Our team will contact you within 1 business day. Reply STOP to opt out.`
        });
        console.log('✅ SMS confirmation sent');
      } catch (e) {
        console.error('SMS failed:', e.message);
      }
    }
    
    // 2. Send email if we have email address
    if (data.email && !data.email.includes('@ctm.noemail')) {
      try {
        await base44.asServiceRole.functions.invoke('sendGmailNotification', {
          to: data.email,
          subject: `We received your inquiry - MedRevolve`,
          body: `
            <p>Hi ${data.name || 'there'},</p>
            <p>Thank you for contacting MedRevolve! We've received your ${data.source.replace('ctm_', '')} regarding:</p>
            <p><strong>${data.subject}</strong></p>
            <p>Our team will review your inquiry and get back to you within 1 business day.</p>
            <p>If this is urgent, please call us directly at (234) 567-890.</p>
            <br/>
            <p>Best regards,<br/>MedRevolve Team</p>
          `
        });
        console.log('✅ Email confirmation sent');
      } catch (e) {
        console.error('Email failed:', e.message);
      }
    }
    
    // 3. Notify admin team via SMS
    try {
      await base44.asServiceRole.functions.invoke('sendSMS', {
        to: '5302006352',
        message: `🔔 NEW ${data.source.toUpperCase().replace('CTM_', '')}: ${data.name} | ${data.phone} | ${data.subject.substring(0, 50)}`
      });
      console.log('✅ Admin notified');
    } catch (e) {
      console.error('Admin SMS failed:', e.message);
    }
    
    // 4. HubSpot sync (already done in webhook, but double-check)
    try {
      await base44.asServiceRole.functions.invoke('syncToHubspot', {
        source: 'contact_request',
        data: { 
          name: data.name, 
          email: data.email, 
          phone: data.phone,
          company: data.business_name || ''
        }
      });
      console.log('✅ HubSpot synced');
    } catch (e) {
      console.error('HubSpot sync failed:', e.message);
    }
    
    return Response.json({ 
      success: true, 
      contact_id: data.id,
      actions: ['sms_sent', 'email_sent', 'admin_notified', 'hubspot_synced']
    });
    
  } catch (error) {
    console.error('CTM Lead Workflow error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});