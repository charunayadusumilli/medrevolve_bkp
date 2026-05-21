/**
 * CTM (CallTrackingMetrics) Webhook Handler
 * 
 * Setup instructions:
 * 1. Create a CTM account at https://www.ctm.com
 * 2. In CTM: Settings > Integrations > Webhooks
 * 3. Set webhook URL to this function's endpoint
 * 4. Set CTM_WEBHOOK_SECRET in app secrets (optional but recommended)
 * 5. Subscribe to events: call.completed, form.submitted, text.received
 * 
 * Google Voice numbers: CTM can forward calls from Google Voice numbers.
 * In CTM: Numbers > Add Number > Forward from existing number (enter your Google Voice number)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    console.log('CTM webhook received:', JSON.stringify(body));

    // Optional secret validation
    const ctmSecret = Deno.env.get('CTM_WEBHOOK_SECRET');
    if (ctmSecret) {
      const sigHeader = req.headers.get('x-ctm-signature') || req.headers.get('authorization');
      if (!sigHeader || !sigHeader.includes(ctmSecret)) {
        console.error('CTM webhook signature mismatch');
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // CTM sends different payloads per event type
    const eventType = body.event_type || body.type || 'call';
    const callerPhone = body.caller_phone_number || body.from || body.phone || '';
    const callerName = body.caller_name || body.name || 'Unknown Caller';
    const trackingNumber = body.tracking_phone_number || body.tracking_number || body.to || '';
    const callDuration = parseInt(body.duration_in_seconds || body.duration || '0', 10);
    const recordingUrl = body.recording_url || body.recording || '';
    const callerEmail = body.email || body.caller_email || '';
    const message = body.transcription || body.message || body.notes || `${eventType} via ${trackingNumber}`;
    const subject = body.subject || body.campaign_name || `Inbound ${eventType === 'form' ? 'Form' : eventType === 'text' ? 'Text' : 'Call'} — ${trackingNumber}`;

    // Determine source type
    let source = 'ctm_call';
    if (eventType === 'form' || eventType === 'form.submitted') source = 'ctm_form';
    else if (eventType === 'text' || eventType === 'text.received') source = 'ctm_text';

    // Skip very short calls (< 10 seconds = likely a hang-up or voicemail machine)
    if (source === 'ctm_call' && callDuration < 10 && callDuration > 0) {
      console.log(`Skipping short call (${callDuration}s) from ${callerPhone}`);
      return Response.json({ skipped: true, reason: 'call too short' });
    }

    // Deduplicate: check for same caller phone in last 5 minutes
    if (callerPhone) {
      const recent = await base44.asServiceRole.entities.ContactRequest.filter({ phone: callerPhone });
      const fiveMinAgo = Date.now() - 5 * 60 * 1000;
      const duplicate = recent.find(r => new Date(r.created_date).getTime() > fiveMinAgo && r.source === source);
      if (duplicate) {
        console.log(`Duplicate CTM event for ${callerPhone}, skipping`);
        return Response.json({ skipped: true, reason: 'duplicate' });
      }
    }

    // Save as ContactRequest
    const contact = await base44.asServiceRole.entities.ContactRequest.create({
      name: callerName,
      email: callerEmail || `${callerPhone.replace(/\D/g, '')}@ctm.noemail`,
      phone: callerPhone,
      subject,
      message,
      source,
      call_tracking_number: trackingNumber,
      call_duration_seconds: callDuration || null,
      call_recording_url: recordingUrl || null,
      status: 'new',
    });

    console.log(`✅ CTM ${source} saved: ${contact.id} from ${callerPhone}`);

    // Check if caller exists in system (phone verification)
    let existingContact = null;
    if (callerPhone && callerPhone !== 'unknown') {
      const contacts = await base44.entities.ContactRequest.filter({ 
        phone: callerPhone 
      }, '-created_date', 1);
      existingContact = contacts[0] || null;
    }

    // Sync to HubSpot
    await base44.asServiceRole.functions.invoke('syncToHubspot', {
      source: 'contact_request',
      data: { name: callerName, email: callerEmail || '', phone: callerPhone }
    }).catch(e => console.error('HubSpot sync failed:', e.message));

    // Notify admin via SMS
    await base44.asServiceRole.functions.invoke('sendSMS', {
      to: '5302006352',
      message: `📞 CTM ${source.toUpperCase()}: ${callerName} | ${callerPhone} | ${subject.substring(0, 60)}`
    }).catch(e => console.error('SMS notify failed:', e.message));

    // Send follow-up to caller based on verification status
    if (existingContact) {
      // Returning patient - send portal link
      if (callerPhone && callerPhone !== 'unknown') {
        await base44.asServiceRole.functions.invoke('sendSMS', {
          to: callerPhone.replace(/\D/g, ''),
          message: `Welcome back ${callerName?.split(' ')[0] || 'there'}! Access your patient portal: https://medrevolve.com/PatientPortal or complete intake: https://medrevolve.com/CustomerIntake`
        }).catch(e => console.error('Welcome SMS failed:', e.message));
      }
    } else {
      // New patient - send intake link
      if (callerPhone && callerPhone !== 'unknown') {
        await base44.asServiceRole.functions.invoke('sendSMS', {
          to: callerPhone.replace(/\D/g, ''),
          message: `Thanks for calling MedRevolve! Start your intake: https://medrevolve.com/CustomerIntake or book consult: https://medrevolve.com/BookAppointment. Questions? Call back anytime.`
        }).catch(e => console.error('New patient SMS failed:', e.message));
      }
    }

    // For form submissions - send email with intake link
    if (eventType === 'form_submitted' && callerEmail && !callerEmail.includes('@ctm.noemail')) {
      await base44.asServiceRole.functions.invoke('sendGmailNotification', {
        to: callerEmail,
        subject: 'Continue Your Intake - MedRevolve',
        body: `<p>Hi ${callerName || 'there'},</p><p>Thank you for your interest! Complete your intake: <a href="https://medrevolve.com/CustomerIntake">Click Here</a></p><p>Or book directly: <a href="https://medrevolve.com/BookAppointment">Book Now</a></p><br/><p>Questions? Call (234) 567-890</p><p>MedRevolve Team</p>`
      }).catch(e => console.error('Intake email failed:', e.message));
    }

    return Response.json({ success: true, contact_id: contact.id, verified: !!existingContact });

  } catch (error) {
    console.error('CTM webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});