/**
 * linkedinOutreachList — Generates 10 personalized LinkedIn DM scripts
 * targeting med spa owners, TRT clinic operators, and weight loss clinic founders.
 * Emails the full list to the admin every weekday morning.
 * 
 * Run via scheduled automation: Mon-Fri at 8am ET
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';

// Target personas and search strategies
const PERSONAS = [
  {
    type: 'Med Spa Owner',
    searchQuery: 'med spa owner OR "medical spa" founder OR "aesthetic clinic" owner',
    painPoint: 'missing out on GLP-1/weight loss revenue from existing clients',
    hook: 'add a weight loss program to your med spa without hiring another doctor',
  },
  {
    type: 'TRT / Men\'s Health Clinic',
    searchQuery: '"TRT clinic" OR "testosterone" OR "men\'s health clinic" founder OR operator',
    painPoint: 'telehealth infrastructure and physician access in multiple states',
    hook: 'expand your TRT clinic to all 50 states without hiring more providers',
  },
  {
    type: 'Weight Loss Clinic Entrepreneur',
    searchQuery: '"weight loss clinic" OR "GLP-1" OR semaglutide clinic owner OR founder',
    painPoint: 'building compliant clinical infrastructure from scratch',
    hook: 'launch a medical weight loss clinic in 7 days — physicians and pharmacy included',
  },
  {
    type: 'Wellness / Gym Owner',
    searchQuery: 'gym owner OR "fitness studio" OR "wellness center" founder entrepreneur',
    painPoint: 'adding medical revenue streams beyond memberships',
    hook: 'add telehealth-based GLP-1 or hormone programs to your existing wellness business',
  },
  {
    type: 'IV Therapy Clinic',
    searchQuery: '"IV therapy" OR "IV drip" OR "IV lounge" owner OR founder OR operator',
    painPoint: 'limited revenue per patient and no recurring subscription model',
    hook: 'add telehealth prescriptions to your IV therapy clinic for recurring monthly revenue',
  },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    // Generate 10 LinkedIn DM scripts using AI (2 per persona)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const prompt = `You are a B2B sales expert for MedRevolve, a white-label telehealth infrastructure platform for $2,999/month.

MedRevolve gives clients:
- White-label telehealth platform (branded to them)
- Licensed physicians in all 50 states (already credentialed)
- 503A pharmacy integration — medications shipped to patients
- HIPAA compliance and LegitScript certification
- Can launch in 7 days

Generate exactly 10 LinkedIn cold outreach DM scripts — 2 per persona below. Each message must:
- Be under 150 words (LinkedIn DM limit)
- Sound human, conversational, NOT salesy
- Reference something specific about their business type
- End with a soft CTA (not "buy now" — more like "open to a quick chat?")
- Not mention pricing

PERSONAS:
${PERSONAS.map((p, i) => `${i+1}. ${p.type} — Pain: ${p.painPoint} — Hook: ${p.hook}`).join('\n')}

FORMAT each DM exactly like this:
---
TARGET: [Persona Type]
SEARCH: [LinkedIn search string to find these people]
SUBJECT: [Connection request note OR opening line]
MESSAGE:
[The DM body]
---

Generate all 10 now. Make 2 different angle versions per persona.`;

    const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    // Build the email
    const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;"><tr><td align="center">
<table width="680" style="max-width:680px;width:100%;">
  <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:24px 36px;">
    <div style="color:#fff;font-size:20px;font-weight:800;">MedRevolve — LinkedIn Outreach Scripts</div>
    <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px;">${today} · 10 personalized DMs ready to send</div>
  </td></tr>
  <tr><td style="background:#fff;padding:32px 36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
    
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;color:#166534;margin:0 0 6px;">📋 HOW TO USE TODAY'S SCRIPTS</p>
      <ol style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
        <li>Go to LinkedIn → Search the provided search string</li>
        <li>Filter by "People" → Look for owners/founders/CEOs</li>
        <li>Send connection request with the subject line as your note (300 char limit)</li>
        <li>Once connected, send the DM body within 24 hours</li>
        <li>Goal: 10 connections/day → 2–3 conversations → 1 booked call</li>
      </ol>
    </div>

    <pre style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;font-size:13px;color:#1e293b;white-space:pre-wrap;line-height:1.7;overflow:auto;">${(aiResult || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>

    <div style="margin-top:24px;padding:16px 20px;background:#fef9f0;border:1px solid #fed7aa;border-radius:8px;">
      <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 6px;">⚡ DAILY LINKEDIN GOAL</p>
      <p style="font-size:13px;color:#374151;margin:0;line-height:1.7;">
        Send <strong>10 connection requests + DMs per day</strong>. At a 30% acceptance rate, that's 3 conversations. At a 30% booking rate, that's 1 demo call every 3 days. At a 25% close rate, that's ~$2,999/month added every ~12 days — <strong>for free</strong>.
      </p>
    </div>

  </td></tr>
  <tr><td style="background:#0A0A0A;border-radius:0 0 12px 12px;padding:16px 36px;text-align:center;">
    <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">MedRevolve Growth Automation · Sent daily Mon–Fri at 8am</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;

    const subjectText = `Today's LinkedIn Outreach Scripts — ${today}`;
    const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subjectText)))}?=`;

    const emailLines = [
      `From: MedRevolve Growth Bot <${ADMIN_EMAIL}>`,
      `To: ${ADMIN_EMAIL}`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      btoa(unescape(encodeURIComponent(emailHtml))),
    ];
    const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${gmailToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });

    const gmailData = await gmailRes.json();
    if (!gmailRes.ok) {
      console.error('[linkedinOutreachList] Gmail error:', JSON.stringify(gmailData));
      return Response.json({ error: gmailData.error?.message }, { status: 500 });
    }

    console.log(`[linkedinOutreachList] ✅ Sent 10 LinkedIn DM scripts to ${ADMIN_EMAIL}`);

    return Response.json({
      success: true,
      scripts_generated: 10,
      sent_to: ADMIN_EMAIL,
      date: today,
    });

  } catch (error) {
    console.error('[linkedinOutreachList] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});