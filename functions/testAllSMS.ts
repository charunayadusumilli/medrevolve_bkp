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
    console.error('SMS error:', result);
    return { error: result.message };
  }
  console.log('✅ SMS sent:', result.sid);
  return { success: true, sid: result.sid };
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

    // SMS 1 — Customer Intake
    results.push(await sendSMS(adminPhone,
      `1/5 🆕 CUSTOMER INTAKE\nName: Jane Smith\nEmail: jane@example.com\nPhone: (555) 867-5309\nInterest: Weight Management\nSource: Social Media\nConsult Pref: ASAP`
    ));
    await delay(1000);

    // SMS 2 — Provider Application
    results.push(await sendSMS(adminPhone,
      `2/5 👨‍⚕️ PROVIDER APPLICATION\nName: Dr. Michael Chen, MD\nEmail: dr.chen@example.com\nPhone: (555) 234-5678\nSpecialty: Internal Medicine\nLicense: CA-12345678\nStates: CA, TX, NY`
    ));
    await delay(1000);

    // SMS 3 — Pharmacy Application
    results.push(await sendSMS(adminPhone,
      `3/5 💊 PHARMACY APPLICATION\nPharmacy: Pacific Compounding Rx\nContact: Sarah Lee\nEmail: sarah@pacificrx.com\nPhone: (555) 345-6789\nType: Compounding\nShipping: National`
    ));
    await delay(1000);

    // SMS 4 — Contact Message
    results.push(await sendSMS(adminPhone,
      `4/5 📬 CONTACT MESSAGE\nFrom: Robert Johnson\nEmail: rjohnson@email.com\nSubject: Question about semaglutide\nMsg: Hi, I wanted to ask about the pricing for semaglutide injections and what the process looks like...`
    ));
    await delay(1000);

    // SMS 5 — Appointment Booked
    results.push(await sendSMS(adminPhone,
      `5/5 📅 APPOINTMENT BOOKED\nPatient: Emily Davis\nEmail: emily@example.com\nPhone: (555) 456-7890\nType: Initial Consultation\nDate: Feb 22, 2026 at 10:00 AM\nReason: Starting a weight management program\nProvider: To Be Assigned ⚠️`
    ));

    return Response.json({ success: true, sent: results.length, results });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});