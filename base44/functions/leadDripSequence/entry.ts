/**
 * leadDripSequence — Sends a timed 5-email nurture sequence to a lead.
 * Called automatically when a new ContactRequest or CustomerIntake is created.
 * Also callable manually with { email, name, lead_type, interest }
 * 
 * Drip schedule (all sent immediately in sequence with staggered send times via Sheets log):
 * Day 0: Welcome / what MedRevolve does
 * Day 2: Social proof / ROI story
 * Day 5: Address the #1 objection ("I don't have a doctor")
 * Day 9: Urgency / limited slots
 * Day 14: Final breakup email
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';
const CALENDLY_LINK = 'https://calendly.com/medrevolve/consultation';
const SITE = 'https://medrevolve.com';

const DRIP_EMAILS = [
  {
    day: 0,
    subject: 'Welcome to MedRevolve — here\'s exactly what we do 👋',
    getBody: (firstName, interest) => `
      <p style="font-size:16px;font-weight:700;color:#111;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        I saw you reached out about <strong>${interest || 'launching a telehealth business'}</strong>. I want to make sure you fully understand what MedRevolve actually gives you — because most people are surprised by how complete it is.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">Here's what's included on Day 1:</p>
      <ul style="font-size:14px;color:#374151;line-height:2;padding-left:20px;">
        <li>✅ Your own white-label telehealth platform (branded to you)</li>
        <li>✅ Licensed physicians in all 50 states — already credentialed</li>
        <li>✅ 503A pharmacy integration — medications shipped to patients</li>
        <li>✅ HIPAA-compliant intake, consent forms, and EHR</li>
        <li>✅ Payment processing built in</li>
        <li>✅ Full compliance infrastructure (LegitScript-ready)</li>
      </ul>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        Most clients are live and processing their first orders within 7 days. No hiring, no licensing headaches.
      </p>
      <div style="margin:24px 0;">
        <a href="${CALENDLY_LINK}" style="background:#0A0A0A;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Book a Free 30-Min Call →</a>
      </div>
      <p style="font-size:13px;color:#6b7280;">Or just reply here with any questions. I respond personally.</p>
    `
  },
  {
    day: 2,
    subject: 'How a med spa owner added $28K/month in 90 days 📈',
    getBody: (firstName) => `
      <p style="font-size:16px;font-weight:700;color:#111;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        I wanted to share a quick story from one of our partners. She runs a med spa in Texas. Before MedRevolve, she was turning away patients who asked about weight loss injections because she didn't have the clinical infrastructure.
      </p>
      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="font-size:14px;color:#166534;margin:0;font-style:italic;line-height:1.8;">
          "We went live in 6 days. First month we enrolled 18 patients at $399/month. By month 3 we were at 70+ active subscribers. The platform handles everything — I just focus on growing my clientele."
        </p>
        <p style="font-size:13px;color:#374151;margin:8px 0 0;font-weight:600;">— Med Spa Owner, Austin TX</p>
      </div>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        70 patients × $399/month = <strong>$27,930/month in recurring revenue</strong>. Her platform fee is $2,999/month. Net: ~$25K/month added to her existing business.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        This is exactly what's possible when you have the right infrastructure behind you.
      </p>
      <div style="margin:24px 0;">
        <a href="${CALENDLY_LINK}" style="background:#0A0A0A;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">See If This Works for Your Business →</a>
      </div>
    `
  },
  {
    day: 5,
    subject: 'The #1 question I get: "But I\'m not a doctor..." 🩺',
    getBody: (firstName) => `
      <p style="font-size:16px;font-weight:700;color:#111;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        The most common thing I hear from entrepreneurs before they sign up:
      </p>
      <p style="font-size:15px;color:#0A0A0A;font-weight:700;font-style:italic;margin:16px 0;">"I love the idea, but I'm not a medical professional. Can I really do this?"</p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        Yes — and here's why. You're not practicing medicine. You're running a <strong>business that connects patients with licensed physicians</strong>. That's exactly what MedRevolve is built for.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">Our model:</p>
      <ul style="font-size:14px;color:#374151;line-height:2;padding-left:20px;">
        <li>🏢 <strong>You</strong> — own the brand, run the business, keep the margin</li>
        <li>👨‍⚕️ <strong>Our physicians</strong> — handle all consultations, prescriptions, clinical decisions</li>
        <li>💊 <strong>Our pharmacy partners</strong> — fulfill and ship all medications</li>
        <li>🔒 <strong>Our compliance team</strong> — keeps everything LegitScript and HIPAA compliant</li>
      </ul>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        You bring the business. We bring the clinical infrastructure. It's a clean split.
      </p>
      <div style="margin:24px 0;">
        <a href="${CALENDLY_LINK}" style="background:#0A0A0A;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Let's Talk Through Your Setup →</a>
      </div>
    `
  },
  {
    day: 9,
    subject: 'We only onboard 10 new partners per month — here\'s why ⚡',
    getBody: (firstName) => `
      <p style="font-size:16px;font-weight:700;color:#111;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        I want to be upfront with you: MedRevolve intentionally limits new partner onboarding to <strong>10 merchants per month</strong>.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        Not as a sales tactic — but because our white-glove setup process requires real attention. We build your brand, configure your platform, handle your compliance filings, and connect you to our pharmacy network. That takes hands-on time from our team.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        Right now we have <strong>3 spots open</strong> for June. Once those fill, the next cohort is July.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        If you're still on the fence, I'd love to just get on a 20-minute call — no pitch, no pressure. I'll walk you through the numbers for your specific business type and you can decide if it makes sense.
      </p>
      <div style="margin:24px 0;">
        <a href="${CALENDLY_LINK}" style="background:#A66B3C;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Claim Your June Spot →</a>
      </div>
    `
  },
  {
    day: 14,
    subject: 'Last email — I\'ll leave you alone after this 👋',
    getBody: (firstName) => `
      <p style="font-size:16px;font-weight:700;color:#111;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        I've sent a few emails over the past couple weeks and haven't heard back. Totally understand — you're busy, timing might not be right.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        I'll make this simple: if you're still thinking about launching a telehealth business, adding GLP-1 to your current practice, or building a white-label wellness platform — <strong>we can have you live in 7 days</strong> for $2,999/month.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        If the timing is off, no worries. Just reply "not now" and I'll check back in 60 days.
      </p>
      <p style="font-size:14px;color:#374151;line-height:1.8;">
        If you're ready, one link is all it takes:
      </p>
      <div style="margin:24px 0;">
        <a href="${SITE}/MerchantOnboarding" style="background:#0A0A0A;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Start Onboarding Now →</a>
      </div>
      <p style="font-size:13px;color:#6b7280;">Either way — good luck with your business. It's a great time to be in this space.</p>
      <p style="font-size:13px;color:#374151;font-weight:600;">— r ned, MedRevolve</p>
    `
  }
];

const buildEmail = (from, to, subject, bodyHtml) => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
    <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">MedRevolve</div>
    <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:3px;">White-Label Telehealth Infrastructure</div>
  </td></tr>
  <tr><td style="background:#fff;padding:36px 40px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
    ${bodyHtml}
  </td></tr>
  <tr><td style="background:#0A0A0A;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
    <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0;">${ADMIN_EMAIL} · medrevolve.com · (240) 387-5224</p>
    <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:6px 0 0;">You're receiving this because you expressed interest in MedRevolve. Reply STOP to unsubscribe.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;

  const lines = [
    `From: r ned at MedRevolve <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];
  return btoa(unescape(encodeURIComponent(lines.join('\r\n'))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { email, name, interest, drip_index } = body;

    if (!email) return Response.json({ error: 'email required' }, { status: 400 });

    const firstName = (name || 'there').replace(/^Dr\.\s*/i, '').split(' ')[0];

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    // If drip_index specified, send just that one. Otherwise send email 0 (Day 0).
    const idx = typeof drip_index === 'number' ? drip_index : 0;
    const drip = DRIP_EMAILS[idx];
    if (!drip) return Response.json({ error: 'Invalid drip_index' }, { status: 400 });

    const raw = buildEmail(
      ADMIN_EMAIL,
      email,
      drip.subject,
      drip.getBody(firstName, interest)
    );

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('[leadDripSequence] Gmail error:', JSON.stringify(result));
      return Response.json({ error: result.error?.message || 'Send failed' }, { status: 500 });
    }

    console.log(`[leadDripSequence] ✅ Sent drip ${idx} (Day ${drip.day}) to ${email}`);

    return Response.json({
      success: true,
      drip_index: idx,
      day: drip.day,
      subject: drip.subject,
      sent_to: email,
    });

  } catch (error) {
    console.error('[leadDripSequence] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});