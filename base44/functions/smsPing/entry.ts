/** smsPing — sends one test SMS to ADMIN_PHONE and reports Twilio's answer (account type, delivery status, any error). */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sid = Deno.env.get('TWILIO_ACCOUNT_SID'), tok = Deno.env.get('TWILIO_AUTH_TOKEN'), from = Deno.env.get('TWILIO_PHONE_NUMBER');
    const to = body.to || Deno.env.get('ADMIN_PHONE') || '+15302006352';
    const auth = 'Basic ' + btoa(`${sid}:${tok}`);
    const acct = await (await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, { headers: { Authorization: auth } })).json();
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: to, From: from, Body: body.text || 'MedRevolve: SMS alerts are working. Talk to Raj requests will text this number.' }),
    });
    const msg = await r.json();
    let status = msg.status;
    if (msg.sid) { await new Promise(res => setTimeout(res, 4000)); status = (await (await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages/${msg.sid}.json`, { headers: { Authorization: auth } })).json()).status; }
    const out = { to, from, account_type: acct.type, account_status: acct.status, ok: r.ok, message_sid: msg.sid || null, status, error_code: msg.code || msg.error_code || null, error: msg.message || msg.error_message || null };
    console.log('SMSPING', JSON.stringify(out));
    const st = await base44.asServiceRole.entities.MailboxState.filter({ key: 'sms_ping' });
    if (st[0]) await base44.asServiceRole.entities.MailboxState.update(st[0].id, { last_report: JSON.stringify(out) });
    else await base44.asServiceRole.entities.MailboxState.create({ key: 'sms_ping', last_report: JSON.stringify(out) });
    return Response.json(out);
  } catch (e) { return Response.json({ error: e.message }, { status: 500 }); }
});
