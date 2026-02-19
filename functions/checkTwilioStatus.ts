import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken) {
      return Response.json({ error: 'Twilio credentials not set' }, { status: 500 });
    }

    const auth = 'Basic ' + btoa(`${accountSid}:${authToken}`);

    // 1. Check account info
    const accountRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      headers: { 'Authorization': auth }
    });
    const account = await accountRes.json();

    // 2. Get last 5 messages sent
    const msgsRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?PageSize=5`,
      { headers: { 'Authorization': auth } }
    );
    const msgs = await msgsRes.json();

    // 3. Check verified caller IDs (trial accounts can only send to these)
    const verifiedRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/OutgoingCallerIds.json`,
      { headers: { 'Authorization': auth } }
    );
    const verified = await verifiedRes.json();

    return Response.json({
      account: {
        sid: account.sid,
        status: account.status,
        type: account.type,
        friendly_name: account.friendly_name
      },
      from_phone: fromPhone,
      verified_numbers: verified.outgoing_caller_ids?.map(v => ({ phone: v.phone_number, friendly: v.friendly_name })),
      last_5_messages: msgs.messages?.map(m => ({
        to: m.to,
        from: m.from,
        status: m.status,
        error_code: m.error_code,
        error_message: m.error_message,
        date_sent: m.date_sent,
        body_preview: m.body?.substring(0, 60)
      }))
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});