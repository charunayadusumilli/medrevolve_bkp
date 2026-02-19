import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, message, appointmentId } = await req.json();

    if (!to || !message) {
      return Response.json({ error: 'Phone number and message are required' }, { status: 400 });
    }

    // Get Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioPhone) {
      return Response.json({ 
        error: 'Twilio not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER' 
      }, { status: 500 });
    }

    // Normalize phone to E.164 (+1XXXXXXXXXX for US)
    let normalizedTo = to.replace(/\D/g, '');
    if (normalizedTo.startsWith('1') && normalizedTo.length === 11) normalizedTo = normalizedTo.slice(1);
    if (normalizedTo.length === 10) normalizedTo = `+1${normalizedTo}`;
    else if (!normalizedTo.startsWith('+')) normalizedTo = `+${normalizedTo}`;

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', normalizedTo);
    formData.append('From', twilioPhone);
    formData.append('Body', message);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio error:', data);
      return Response.json({ 
        error: 'Failed to send SMS', 
        details: data.message 
      }, { status: 500 });
    }

    console.log('✅ SMS sent successfully:', data.sid);

    // Optionally log SMS to appointment record
    if (appointmentId) {
      try {
        await base44.asServiceRole.entities.Appointment.update(appointmentId, {
          last_sms_sent: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not update appointment SMS log:', err);
      }
    }

    return Response.json({
      success: true,
      messageSid: data.sid,
      status: data.status
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    return Response.json({ 
      error: error.message || 'Failed to send SMS' 
    }, { status: 500 });
  }
});