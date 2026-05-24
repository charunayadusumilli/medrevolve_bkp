import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Sends automated follow-up sequence to B2B leads who haven't responded
// Called by scheduler: daily check for leads > 24h with no status change

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all new B2B inquiries older than 24h but less than 7 days, not yet contacted
    const allInquiries = await base44.asServiceRole.entities.BusinessInquiry.filter({ status: 'new' });

    const now = new Date();
    const toFollow = allInquiries.filter(inq => {
      const created = new Date(inq.created_date);
      const hoursOld = (now - created) / (1000 * 60 * 60);
      return hoursOld >= 24 && hoursOld < 168; // 1–7 days old
    });

    console.log(`📋 Found ${toFollow.length} leads needing follow-up`);

    const results = [];

    for (const inq of toFollow) {
      if (!inq.email) {
        results.push({ id: inq.id, skipped: 'no email' });
        continue;
      }

      const firstName = (inq.contact_name || 'there').split(' ')[0];
      const hoursOld = Math.floor((now - new Date(inq.created_date)) / (1000 * 60 * 60));
      const daysOld = Math.floor(hoursOld / 24);

      let subject, body;

      if (daysOld === 1) {
        // Day 1 follow-up
        subject = `${firstName}, ready to launch your platform? — MedRevolve`;
        body = `
<h2>Hi ${firstName},</h2>
<p>Just wanted to follow up on your interest in MedRevolve's B2B platform for <strong>${inq.company_name || 'your business'}</strong>.</p>
<p>We're ready to get you started. Here's what's included on Day 1:</p>
<ul>
  <li>✅ White-label storefront under your brand</li>
  <li>✅ GLP-1, RUO, or supplement product catalog</li>
  <li>✅ Licensed provider network (telehealth)</li>
  <li>✅ 503A/B pharmacy integration</li>
  <li>✅ Built-in compliance framework</li>
  <li>✅ Stripe payment processing</li>
  <li>✅ Dedicated 10-person onboarding team</li>
</ul>
<p><strong>Investment:</strong> $5,000 setup + $2,500/month + 5% revenue share</p>
<p><a href="https://app.medrevolve.com/MerchantOnboarding" style="background:#4A6741;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;">Start Your Platform →</a></p>
<p>Or call us directly: <a href="tel:+17044263311">(704) 426-3311</a></p>
<p>— MedRevolve B2B Team</p>
        `.trim();
      } else if (daysOld === 3) {
        // Day 3 follow-up
        subject = `Quick question about your wellness business, ${firstName}`;
        body = `
<h2>Hi ${firstName},</h2>
<p>I wanted to check in — are you still exploring options for launching your ${inq.industry || 'wellness'} platform?</p>
<p>Many of our merchants had the same questions you might have:</p>
<ul>
  <li>💭 "Do I need an LLC first?" — No, we can help you form one</li>
  <li>💭 "How long does setup take?" — 7 days from payment</li>
  <li>💭 "What if I don't have a website yet?" — We build it</li>
  <li>💭 "What about compliance?" — 100% covered by our framework</li>
</ul>
<p>Happy to do a quick 15-minute call to answer any questions. Just reply with a good time.</p>
<p>Or start directly: <a href="https://app.medrevolve.com/MerchantOnboarding">app.medrevolve.com/MerchantOnboarding</a></p>
<p>— MedRevolve B2B Team<br/>(704) 426-3311</p>
        `.trim();
      } else if (daysOld === 7) {
        // Day 7 last follow-up
        subject = `Last chance — platform offer for ${firstName}`;
        body = `
<h2>Hi ${firstName},</h2>
<p>This will be my last follow-up. I don't want to keep filling your inbox!</p>
<p>If you're ready to launch your ${inq.industry || 'wellness'} business under your own brand — we're here when you need us.</p>
<p>When the timing is right, just visit:<br/>
<a href="https://app.medrevolve.com/MerchantOnboarding">app.medrevolve.com/MerchantOnboarding</a></p>
<p>Or call: <a href="tel:+17044263311">(704) 426-3311</a></p>
<p>Best of luck with your business!</p>
<p>— MedRevolve B2B Team</p>
        `.trim();

        // Mark as no longer following up after day 7
        await base44.asServiceRole.entities.BusinessInquiry.update(inq.id, { status: 'contacted' });
      } else {
        results.push({ id: inq.id, skipped: `${daysOld} days old — not a follow-up day` });
        continue;
      }

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve B2B',
        to: inq.email,
        subject,
        body,
      });

      console.log(`✅ Follow-up sent to ${inq.email} (day ${daysOld})`);
      results.push({ id: inq.id, email: inq.email, day: daysOld, sent: true });
    }

    // Also notify admin of follow-ups sent
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Automation',
      to: 'rned@medrevolve.com',
      subject: `📊 B2B Follow-Up Report — ${results.filter(r => r.sent).length} emails sent`,
      body: `
<h2>Daily B2B Follow-Up Report</h2>
<p><strong>${results.filter(r => r.sent).length}</strong> follow-up emails sent today.</p>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px;">
  <tr style="background:#f0f0f0"><th style="padding:8px;text-align:left;">Lead</th><th style="padding:8px;">Day</th><th style="padding:8px;">Status</th></tr>
  ${results.map(r => `<tr><td style="padding:8px;">${r.email || r.id}</td><td style="padding:8px;">${r.day || '—'}</td><td style="padding:8px;">${r.sent ? '✅ Sent' : '⏭ ' + r.skipped}</td></tr>`).join('')}
</table>
<p style="color:#888;font-size:12px;">Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
      `.trim(),
    });

    return Response.json({
      success: true,
      total_leads: toFollow.length,
      emails_sent: results.filter(r => r.sent).length,
      results,
    });

  } catch (error) {
    console.error('❌ ionosB2BFollowUp error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});