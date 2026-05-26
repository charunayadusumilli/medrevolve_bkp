import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_URL = 'https://medrevolve.com';

const CAMPAIGNS = [
  {
    key: 'glp1', segment: 'B2C — GLP-1 Weight Loss', emoji: '⚖️',
    link: `${BASE_URL}?utm_source=email&utm_medium=outreach&utm_campaign=glp1_email`,
    subject: '🩺 Clinically Proven Weight Loss — GLP-1 Programs Starting at $399/mo',
    audience: 'Adults seeking medically supervised weight loss',
    product: 'GLP-1 Monthly Subscription',
    stripe_link: 'https://medrevolve.com/BookAppointment',
    booking_link: 'https://medrevolve.com/BookAppointment',
  },
  {
    key: 'mens_health', segment: "B2C — Men's Health / TRT", emoji: '💪',
    link: `${BASE_URL}?utm_source=email&utm_medium=outreach&utm_campaign=mens_health_email`,
    subject: "💪 Low T? TRT & Men's Health Programs — Discreet, Delivered to Your Door",
    audience: "Men 35-65 seeking hormone therapy or ED treatment",
    product: "Men's Health Consultation",
    stripe_link: 'https://medrevolve.com/BookAppointment',
    booking_link: 'https://medrevolve.com/BookAppointment',
  },
  {
    key: 'womens_health', segment: "B2C — Women's Health / BHRT", emoji: '🌸',
    link: `${BASE_URL}?utm_source=email&utm_medium=outreach&utm_campaign=womens_health_email`,
    subject: "🌸 Hormone Balance & Women's Wellness — Licensed Providers, Same-Day Consults",
    audience: "Women 30-55 seeking hormone therapy or wellness care",
    product: "Women's Health Consultation",
    stripe_link: 'https://medrevolve.com/BookAppointment',
    booking_link: 'https://medrevolve.com/BookAppointment',
  },
  {
    key: 'longevity', segment: 'B2C — Longevity & Peptides', emoji: '⚡',
    link: `${BASE_URL}?utm_source=email&utm_medium=outreach&utm_campaign=longevity_email`,
    subject: '⚡ Biohack Your Age — Peptide & Longevity Protocols from Licensed Providers',
    audience: 'Biohackers and health optimizers 40-65',
    product: 'Longevity Protocol Consultation',
    stripe_link: 'https://medrevolve.com/BookAppointment',
    booking_link: 'https://medrevolve.com/BookAppointment',
  },
  {
    key: 'white_label', segment: 'B2B — White Label Platform', emoji: '🏢',
    link: `${BASE_URL}/ForBusiness?utm_source=email&utm_medium=b2b_outreach&utm_campaign=white_label_email`,
    subject: '🚀 Launch Your Own Telehealth Brand in 48 Hours — White Label Platform',
    audience: 'Med spa owners, clinic operators, wellness entrepreneurs',
    product: 'MedRevolve B2B Merchant Platform ($2,999/mo)',
    stripe_link: 'https://medrevolve.com/MerchantOnboarding',
    booking_link: 'https://medrevolve.com/MerchantOnboarding',
  },
  {
    key: 'glp1_b2b', segment: 'B2B — Add GLP-1 to Your Business', emoji: '💼',
    link: `${BASE_URL}/ForBusiness?utm_source=email&utm_medium=b2b_outreach&utm_campaign=glp1_b2b_email`,
    subject: '💼 Your Clients Want GLP-1 — Are You Offering It Yet?',
    audience: 'Gyms, spas, fitness studios, health coaches',
    product: 'GLP-1 B2B Revenue Module',
    stripe_link: 'https://medrevolve.com/MerchantOnboarding',
    booking_link: 'https://medrevolve.com/MerchantOnboarding',
  },
  {
    key: 'creators', segment: 'Creator / Influencer Program', emoji: '🎥',
    link: `${BASE_URL}/ForCreators?utm_source=email&utm_medium=creator_outreach&utm_campaign=creator_email`,
    subject: '🎥 Earn Commission Promoting Telehealth — Creator & Affiliate Program',
    audience: 'Health & wellness influencers, content creators',
    product: 'Creator / Affiliate Program',
    stripe_link: 'https://medrevolve.com/ForCreators',
    booking_link: 'https://medrevolve.com/ForCreators',
  },
  {
    key: 'provider', segment: 'Provider Network Recruitment', emoji: '👨‍⚕️',
    link: `${BASE_URL}/ProviderIntake?utm_source=email&utm_medium=provider_outreach&utm_campaign=provider_email`,
    subject: '👨‍⚕️ Join MedRevolve — See 40+ Patients/Week Remotely, Keep Your Schedule',
    audience: 'Licensed MDs, DOs, NPs, PAs in the US',
    product: 'Provider Network Partnership',
    stripe_link: 'https://medrevolve.com/ProviderIntake',
    booking_link: 'https://medrevolve.com/ProviderIntake',
  },
  {
    key: 'pharmacy', segment: 'Pharmacy Partnership', emoji: '💊',
    link: `${BASE_URL}/PharmacyIntake?utm_source=email&utm_medium=pharmacy_outreach&utm_campaign=pharmacy_email`,
    subject: '💊 Compounding Pharmacy Partnership — High-Volume GLP-1 Referrals Available',
    audience: 'Licensed 503A/503B compounding pharmacies',
    product: 'Pharmacy Partnership Agreement',
    stripe_link: 'https://medrevolve.com/PharmacyIntake',
    booking_link: 'https://medrevolve.com/PharmacyIntake',
  },
];

const ALL_LINKS = {
  website: 'https://medrevolve.com',
  b2b: 'https://medrevolve.com/ForBusiness',
  booking: 'https://medrevolve.com/BookAppointment',
  merchant_onboarding: 'https://medrevolve.com/MerchantOnboarding',
  partner_program: 'https://medrevolve.com/PartnerProgram',
  creators: 'https://medrevolve.com/ForCreators',
  provider_intake: 'https://medrevolve.com/ProviderIntake',
  pharmacy_intake: 'https://medrevolve.com/PharmacyIntake',
  how_it_works: 'https://medrevolve.com/HowItWorks',
  telehealth: 'https://medrevolve.com/TelehealthPlatform',
  phone: 'tel:+12403875224',
  email_support: 'mailto:support@medrevolve.com',
  email_info: 'mailto:info@medrevolve.com',
};

const COMPLIANCE_ITEMS = [
  { domain: 'B2C', item: 'Remove "cure" and "treat" language from all patient-facing pages', status: 'In Progress', priority: 'High' },
  { domain: 'B2C', item: 'Add FDA disclaimer to all GLP-1 product pages', status: 'Completed', priority: 'High' },
  { domain: 'B2C', item: 'Telehealth informed consent visible before booking', status: 'Completed', priority: 'High' },
  { domain: 'B2C', item: 'HIPAA Notice of Privacy Practices linked in footer', status: 'Completed', priority: 'High' },
  { domain: 'B2C', item: 'Medical disclaimer on all program/product pages', status: 'Completed', priority: 'Medium' },
  { domain: 'B2B', item: 'B2B white-label contracts include indemnification clause', status: 'In Progress', priority: 'High' },
  { domain: 'B2B', item: 'Merchant onboarding agreement reviewed by legal', status: 'Pending', priority: 'High' },
  { domain: 'B2B', item: 'Remove revenue guarantee language from B2B marketing', status: 'Completed', priority: 'High' },
  { domain: 'B2B', item: 'B2B pricing page updated — no misleading markup claims', status: 'Completed', priority: 'Medium' },
  { domain: 'RUO', item: 'RUO pages include "Not for human use" disclaimer on all products', status: 'Completed', priority: 'Critical' },
  { domain: 'RUO', item: 'RUO checkout requires business/lab verification step', status: 'In Progress', priority: 'Critical' },
  { domain: 'RUO', item: 'RUO email campaigns include mandatory research-only language', status: 'Completed', priority: 'High' },
  { domain: 'WATER', item: 'Bacteriostatic water pages include sterile compounding disclaimer', status: 'Completed', priority: 'High' },
  { domain: 'WATER', item: 'Water product pages do not make therapeutic claims', status: 'Completed', priority: 'High' },
  { domain: 'INTERNAL', item: 'Cookie consent banner active via Cookiebot', status: 'Completed', priority: 'Medium' },
  { domain: 'INTERNAL', item: 'Cookie Policy page live and linked in footer', status: 'Completed', priority: 'Medium' },
  { domain: 'INTERNAL', item: 'Privacy Policy updated for telehealth data handling', status: 'Completed', priority: 'High' },
  { domain: 'INTERNAL', item: 'Terms of Service reviewed and updated', status: 'Completed', priority: 'High' },
  { domain: 'INTERNAL', item: 'Admin-only access enforced on all sensitive dashboards', status: 'Completed', priority: 'High' },
];

const OPEN_REQUESTS = [
  { category: 'UI/UX', request: 'Gmail drafts should SEND immediately — not save as drafts', status: 'In Progress', priority: 'High', date: '2026-05-26' },
  { category: 'UI/UX', request: 'Email formatting and links not rendering correctly in Gmail drafts', status: 'Fixed', priority: 'High', date: '2026-05-26' },
  { category: 'Feature', request: 'Google Sheet should include compliance, open requests, and change log tabs', status: 'In Progress', priority: 'High', date: '2026-05-26' },
  { category: 'Feature', request: 'Recipient email inputs per segment before sending — one per campaign', status: 'In Progress', priority: 'High', date: '2026-05-26' },
  { category: 'Feature', request: 'God Mode should send 9 emails immediately (not create drafts)', status: 'In Progress', priority: 'High', date: '2026-05-26' },
  { category: 'Compliance', request: 'Compliance audit report accessible from admin nav', status: 'Completed', priority: 'Medium', date: '2026-05-20' },
  { category: 'Integration', request: 'Facebook OAuth token expired — needs reconnection', status: 'Open', priority: 'High', date: '2026-05-26' },
  { category: 'Integration', request: 'Instagram publish limit exceeded — API rate limit hit', status: 'Open', priority: 'Medium', date: '2026-05-26' },
  { category: 'Marketing', request: 'UTM tracking links in all outbound emails', status: 'Completed', priority: 'Medium', date: '2026-05-22' },
  { category: 'Marketing', request: 'God Mode ad campaign engine for Instagram + Facebook', status: 'Completed', priority: 'High', date: '2026-05-15' },
];

function buildEmailHtml(campaign, sheetUrl) {
  const segmentBodies = {
    glp1: `<p>Our physician-supervised weight loss program uses FDA-accepted GLP-1 therapies, tailored by licensed providers — no office visits required. Medications delivered directly to your door.</p><p><strong>✅ Licensed providers in 50 states · Same-day consults · No insurance needed</strong></p>`,
    mens_health: `<p>MedRevolve offers discreet, physician-supervised hormone therapy, ED treatment, and men's wellness programs — fully remote, fully compliant.</p><p><strong>✅ TRT · ED Protocols · Hair Health · 100% Confidential</strong></p>`,
    womens_health: `<p>Our licensed providers specialize in hormone balancing, BHRT, and women's wellness — available via telehealth from the comfort of home.</p><p><strong>✅ BHRT · Hormone Panels · Women's Health Protocols · Licensed Providers</strong></p>`,
    longevity: `<p>From peptide protocols to longevity panels, our providers build individualized programs for health optimization and anti-aging — all via telehealth.</p><p><strong>✅ Peptide Protocols · NAD+ · Longevity Panels · Biohacker-Friendly</strong></p>`,
    white_label: `<p>We give clinics, med spas, gyms, and wellness businesses a fully-branded telehealth storefront — with built-in compliance, providers, pharmacy, payments, and marketing.</p><p><strong>✅ 48-hour launch · Full white-label · $2,999/mo · Provider network included</strong></p>`,
    glp1_b2b: `<p>Your clients are already searching for GLP-1 programs. We help you add a physician-supervised weight loss revenue stream to your existing business — under your brand.</p><p><strong>✅ White-label ready · Licensed providers · Average $5K–$22K/mo added revenue</strong></p>`,
    creators: `<p>Health & wellness creators earn competitive commissions for every consultation booked through their referral link. No selling required — just authentic content.</p><p><strong>✅ High commissions · Custom referral codes · Real-time dashboards</strong></p>`,
    provider: `<p>We're looking for licensed MDs, DOs, NPs, and PAs to join our growing telehealth provider network — see patients fully remote, set your own schedule, keep your independence.</p><p><strong>✅ 40+ patients/week potential · Fully remote · Built-in EHR & compliance</strong></p>`,
    pharmacy: `<p>We're actively partnering with licensed 503A/503B compounding pharmacies for high-volume GLP-1 and hormone therapy compound referrals.</p><p><strong>✅ High-volume referrals · Compliant workflows · Direct platform integration</strong></p>`,
  };

  const body = segmentBodies[campaign.key] || `<p>MedRevolve is the complete telehealth platform — providers, pharmacy, compliance, and marketing all in one.</p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0A0A0A, #1a1a1a); padding: 32px 40px; text-align: center; }
  .logo { font-size: 22px; font-weight: 900; color: white; letter-spacing: -0.5px; }
  .logo span { color: #4A6741; }
  .body { padding: 36px 40px; }
  h1 { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 12px; line-height: 1.3; }
  p { color: #555; line-height: 1.7; margin: 0 0 16px; font-size: 15px; }
  .cta-primary { display: inline-block; background: #0A0A0A; color: white !important; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; margin: 8px 4px; }
  .cta-secondary { display: inline-block; background: #4A6741; color: white !important; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; margin: 8px 4px; }
  .cta-sheet { display: inline-block; background: #0f9d58; color: white !important; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; margin: 8px 4px; }
  .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
  .links-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .links-box h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 0 0 12px; }
  .link-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
  .link-row:last-child { border-bottom: none; }
  .link-label { color: #444; font-weight: 600; }
  .link-url { color: #4A6741; text-decoration: none; font-size: 12px; }
  .footer { background: #f8f9fa; padding: 24px 40px; text-align: center; }
  .footer p { color: #aaa; font-size: 12px; margin: 4px 0; }
  .footer a { color: #4A6741; text-decoration: none; }
  .badge { display: inline-block; background: #e8f0e8; color: #4A6741; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Med<span>Revolve</span></div>
  </div>
  <div class="body">
    <div class="badge">${campaign.emoji} ${campaign.segment}</div>
    <h1>${campaign.subject.replace(/^[^\s]+\s/, '')}</h1>
    <p>Hi there,</p>
    <p>We're reaching out because we think <strong>${campaign.audience}</strong> would be a great fit for what we've built at MedRevolve.</p>
    ${body}
    <hr class="divider" />
    <p style="text-align:center;">
      <a href="${campaign.booking_link}" class="cta-primary">Get Started →</a>
      <a href="tel:+12403875224" class="cta-secondary">Call 240-387-5224</a>
    </p>
    <hr class="divider" />
    <div class="links-box">
      <h3>📋 Key Links</h3>
      <div class="link-row"><span class="link-label">Main Site</span><a href="${ALL_LINKS.website}" class="link-url">medrevolve.com</a></div>
      <div class="link-row"><span class="link-label">Campaign Link</span><a href="${campaign.link}" class="link-url">${campaign.link}</a></div>
      <div class="link-row"><span class="link-label">Book / Apply</span><a href="${campaign.booking_link}" class="link-url">${campaign.booking_link}</a></div>
      <div class="link-row"><span class="link-label">For Business</span><a href="${ALL_LINKS.b2b}" class="link-url">medrevolve.com/ForBusiness</a></div>
      <div class="link-row"><span class="link-label">Partner Program</span><a href="${ALL_LINKS.partner_program}" class="link-url">medrevolve.com/PartnerProgram</a></div>
      <div class="link-row"><span class="link-label">How It Works</span><a href="${ALL_LINKS.how_it_works}" class="link-url">medrevolve.com/HowItWorks</a></div>
    </div>
    ${sheetUrl ? `
    <p style="text-align:center; margin-top: 20px;">
      <a href="${sheetUrl}" class="cta-sheet">📊 View Full Campaign Sheet (Google Sheets)</a>
    </p>` : ''}
  </div>
  <div class="footer">
    <p>MedRevolve · 240-387-5224 · <a href="mailto:info@medrevolve.com">info@medrevolve.com</a></p>
    <p><a href="https://medrevolve.com">medrevolve.com</a> · <a href="https://medrevolve.com/Privacy">Privacy</a> · <a href="https://medrevolve.com/Terms">Terms</a></p>
  </div>
</div>
</body>
</html>`;
}

function encodeEmailRaw(to, subject, htmlBody, plainText) {
  const boundary = `b44_${Math.random().toString(36).slice(2)}`;

  // base64-encode the HTML part per RFC 2045
  const htmlB64 = (() => {
    const bytes = new TextEncoder().encode(htmlBody);
    let bin = '';
    bytes.forEach(b => bin += String.fromCharCode(b));
    return btoa(bin).match(/.{1,76}/g).join('\r\n');
  })();

  const mime =
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: multipart/alternative; boundary="${boundary}"\r\n` +
    `\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n` +
    `Content-Transfer-Encoding: quoted-printable\r\n` +
    `\r\n` +
    plainText + `\r\n` +
    `\r\n--${boundary}\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n` +
    `\r\n` +
    htmlB64 + `\r\n` +
    `\r\n--${boundary}--`;

  const envBytes = new TextEncoder().encode(mime);
  let envBin = '';
  envBytes.forEach(b => envBin += String.fromCharCode(b));
  return btoa(envBin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    // recipients: { glp1: "email@x.com", mens_health: "email@y.com", ... }
    const recipients = body.recipients || {};

    console.log('God Mode Email+Sheets: Starting...');

    const { accessToken: sheetsToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    // ── 1. Create Google Sheet with 4 tabs ─────────────────
    console.log('Creating Google Sheet...');
    const createSheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${sheetsToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: { title: `MedRevolve God Mode Master Sheet — ${new Date().toLocaleDateString('en-US')}` },
        sheets: [
          { properties: { title: 'Campaigns & Links' } },
          { properties: { title: 'Compliance Tracker' } },
          { properties: { title: 'Open Requests' } },
          { properties: { title: 'Change Log' } },
        ]
      }),
    });

    const sheetData = await createSheetRes.json();
    if (!sheetData.spreadsheetId) {
      throw new Error('Failed to create Google Sheet: ' + (sheetData.error?.message || 'unknown'));
    }
    const spreadsheetId = sheetData.spreadsheetId;
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    console.log(`Google Sheet created: ${sheetUrl}`);

    // ── 2. Tab 1: Campaigns & Links ─────────────────────────
    const campaignRows = [
      ['Segment', 'Emoji', 'Email Subject', 'Campaign Link (UTM)', 'Booking Link', 'Product', 'Target Audience', 'Recipient Email'],
      ...CAMPAIGNS.map(c => [c.segment, c.emoji, c.subject, c.link, c.booking_link, c.product, c.audience, recipients[c.key] || '']),
      [],
      ['KEY LINKS', ''],
      ['Main Website', ALL_LINKS.website],
      ['For Business (B2B)', ALL_LINKS.b2b],
      ['Book Appointment', ALL_LINKS.booking],
      ['Merchant Onboarding', ALL_LINKS.merchant_onboarding],
      ['Partner Program', ALL_LINKS.partner_program],
      ['Creator Program', ALL_LINKS.creators],
      ['Provider Intake', ALL_LINKS.provider_intake],
      ['Pharmacy Intake', ALL_LINKS.pharmacy_intake],
      ['How It Works', ALL_LINKS.how_it_works],
      ['Telehealth Platform', ALL_LINKS.telehealth],
      ['Support Email', ALL_LINKS.email_support],
      ['Info Email', ALL_LINKS.email_info],
    ];

    // ── 3. Tab 2: Compliance Tracker ───────────────────────
    const complianceRows = [
      ['Domain', 'Compliance Item', 'Status', 'Priority'],
      ...COMPLIANCE_ITEMS.map(c => [c.domain, c.item, c.status, c.priority]),
    ];

    // ── 4. Tab 3: Open Requests ────────────────────────────
    const requestRows = [
      ['Category', 'Request / Issue', 'Status', 'Priority', 'Date Logged'],
      ...OPEN_REQUESTS.map(r => [r.category, r.request, r.status, r.priority, r.date]),
    ];

    // ── 5. Tab 4: Change Log ───────────────────────────────
    const changeLogRows = [
      ['Date', 'Change', 'Status', 'Notes'],
      [new Date().toLocaleDateString('en-US'), 'God Mode Email: switched from drafts to immediate send', 'Deployed', 'Per admin request'],
      [new Date().toLocaleDateString('en-US'), 'God Mode Sheet: added Compliance, Open Requests, Change Log tabs', 'Deployed', 'Per admin request'],
      [new Date().toLocaleDateString('en-US'), 'Email HTML encoding fixed — proper base64 + multipart MIME', 'Deployed', 'Formatting + links now render correctly in Gmail'],
      ['2026-05-26', 'Compliance Audit Report page added to admin nav', 'Live', ''],
      ['2026-05-26', 'Gmail drafts created with proper HTML formatting', 'Live', ''],
      ['2026-05-22', 'UTM tracking links added to all outbound campaigns', 'Live', ''],
      ['2026-05-20', 'God Mode Ads page launched — 9 campaign segments', 'Live', ''],
      ['2026-05-15', 'Google Sheets + Gmail integration connected', 'Live', ''],
    ];

    // Write all 4 tabs in parallel
    const tabWrites = [
      { tab: 'Campaigns%20%26%20Links', rows: campaignRows },
      { tab: 'Compliance%20Tracker', rows: complianceRows },
      { tab: 'Open%20Requests', rows: requestRows },
      { tab: 'Change%20Log', rows: changeLogRows },
    ];

    await Promise.all(tabWrites.map(({ tab, rows }) =>
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${tab}!A1:J${rows.length}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${sheetsToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows }),
      })
    ));

    console.log('Google Sheet populated with 4 tabs');

    // ── 6. Send 9 emails immediately (no drafts) ───────────
    const sendResults = [];
    for (const campaign of CAMPAIGNS) {
      const to = recipients[campaign.key];
      if (!to) {
        sendResults.push({ segment: campaign.segment, success: false, error: 'No recipient email provided' });
        console.warn(`Skipping ${campaign.key} — no recipient email`);
        continue;
      }

      try {
        const htmlBody = buildEmailHtml(campaign, sheetUrl);
        const plainText = `${campaign.segment}\r\n\r\nCampaign Link: ${campaign.link}\r\nBook / Apply: ${campaign.booking_link}\r\nGoogle Sheets: ${sheetUrl}\r\nPhone: 240-387-5224\r\nWebsite: https://medrevolve.com`;
        const encoded = encodeEmailRaw(to, campaign.subject, htmlBody, plainText);

        const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${gmailToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw: encoded }),
        });

        const sendData = await sendRes.json();
        if (sendData.error) throw new Error(sendData.error.message);

        sendResults.push({ segment: campaign.segment, to, message_id: sendData.id, success: true });
        console.log(`✅ Sent: ${campaign.segment} → ${to}`);
      } catch (err) {
        console.error(`❌ Failed: ${campaign.key} → ${err.message}`);
        sendResults.push({ segment: campaign.segment, to, success: false, error: err.message });
      }
    }

    const sent = sendResults.filter(r => r.success).length;
    const skipped = sendResults.filter(r => !r.success && r.error === 'No recipient email provided').length;
    const failed = sendResults.filter(r => !r.success && r.error !== 'No recipient email provided').length;

    return Response.json({
      success: true,
      spreadsheet_url: sheetUrl,
      spreadsheet_id: spreadsheetId,
      emails_sent: sent,
      emails_skipped: skipped,
      emails_failed: failed,
      send_results: sendResults,
      message: `✅ Sheet created (4 tabs). ${sent} emails sent immediately. ${skipped} skipped (no recipient). ${failed} failed.`,
    });

  } catch (error) {
    console.error('God Mode Email+Sheets Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});