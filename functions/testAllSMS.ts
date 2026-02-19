import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function sendSMS(to, body) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!accountSid || !authToken || !fromPhone) return { error: 'Twilio not configured' };

  let normalized = to.replace(/\D/g, '');
  if (normalized.startsWith('1') && normalized.length === 11) normalized = normalized.slice(1);
  const phoneE164 = normalized.length === 10 ? `+1${normalized}` : `+${normalized}`;

  const params = new URLSearchParams({ To: phoneE164, From: fromPhone, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const result = await res.json();
  if (!res.ok) {
    console.error('SMS error:', JSON.stringify(result));
    return { error: result.message, code: result.code, to: phoneE164 };
  }
  console.log('SMS sent:', result.sid, 'status:', result.status, 'to:', phoneE164);
  return { success: true, sid: result.sid, status: result.status, to: phoneE164 };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const adminPhone = '5302006352';
    const results = [];

    const msgs = [
      `1/5 NEW LEAD: Jane Smith | Weight Management | jane@example.com | 5558675309 | ASAP | Social Media`,
      `2/5 PROVIDER APP: Dr. Michael Chen, MD | Internal Medicine | dr.chen@example.com | 5552345678`,
      `3/5 PHARMACY APP: Pacific Compounding Rx | Sarah Lee | sarah@pacificrx.com | 5553456789 | Compounding`,
      `4/5 CONTACT: Robert Johnson | rjohnson@email.com | Semaglutide pricing | Hi, I wanted to ask about pricing for semaglutide...`,
      `5/5 APPOINTMENT: Emily Davis | emily@example.com | Initial Consultation | Feb 22 10:00 AM | Provider TBD`
    ];

    for (const msg of msgs) {
      const r = await sendSMS(adminPhone, msg);
      results.push(r);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return Response.json({ success: true, sent: results.length, results });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});