/**
 * complianceDeployAudit
 * Logs all compliance changes to Google Sheets and sends
 * a deployment-ready audit email to noel@medrevolve.com
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SHEET_ID = ''; // Will be created dynamically via Sheets API

const AUDIT_CHANGES = [
  // ── medrevolve.com (B2C) ──────────────────────────────────────────────────
  {
    domain: 'medrevolve.com',
    page: 'B2CHeroSection (Hero)',
    risk: 'LOW',
    type: 'Social Proof Copy',
    original: '"Trusted by patients nationwide"',
    updated: '"Licensed physicians. Licensed pharmacies. All 50 states."',
    reason: 'Unverifiable social proof claim; replaced with factual, verifiable compliance statement',
  },
  {
    domain: 'medrevolve.com',
    page: 'Products page — 30mL Bulk specs',
    risk: 'MEDIUM',
    type: 'Pricing/Claims Language',
    original: '"Bulk institutional pricing"',
    updated: '"Volume pricing for licensed facilities"',
    reason: 'FDA/payment processor flag: "bulk" implied 503B-style purchasing. Narrowed to licensed facilities only',
  },
  {
    domain: 'medrevolve.com',
    page: 'PillarsSection — Pillar 01 description',
    risk: 'MEDIUM',
    type: '503A/B Reference',
    original: '"503A/B pharmacy integrations"',
    updated: '"503A pharmacy integrations"',
    reason: '503B outsourcing facilities are FDA-registered for institutional non-patient-specific bulk compounding. Removed "503B" from consumer-facing B2C page entirely',
  },

  // ── medrevolveb2b.com (B2B) ───────────────────────────────────────────────
  {
    domain: 'medrevolveb2b.com',
    page: 'ForBusiness — Hero stats bar',
    risk: 'HIGH',
    type: '503B Reference',
    original: '"503A/B" stat in hero',
    updated: '"503A" compounding pharmacy',
    reason: 'Mastercard/Visa high-risk rules: "503B" on merchant acquisition pages signals bulk compounding intent which is a payment processor red flag. Removed entirely.',
  },
  {
    domain: 'medrevolveb2b.com',
    page: 'ForBusiness — GLP-1 product track description',
    risk: 'HIGH',
    type: '503A/B + Dual-Action Language',
    original: '"routes to a 503A/B pharmacy" + "Dual-Action GLP-1 Protocols"',
    updated: '"routes to a licensed 503A compounding pharmacy" + "Combination Weight Management Protocols"',
    reason: '"Dual-Action" is an unapproved drug mechanism claim per FDA 21 CFR §201. "503B" removed from consumer commerce pages.',
  },
  {
    domain: 'medrevolveb2b.com',
    page: 'ForBusiness — Pharmacy B2B section: 503B card',
    risk: 'HIGH',
    type: '503B Outsourcing Facility Card',
    original: '"503B Outsourcing Facilities" card — "bulk non-patient-specific compounding. Available for qualified B2B wholesale merchants"',
    updated: 'Renamed to "Licensed Pharmacy Network" — patient-specific Rx only, NABP-verified, licensed provider required',
    reason: 'Describing 503B bulk wholesale to merchants is a direct Mastercard/Visa MCC 5122 violation and FDA 503B misuse. Card removed and replaced.',
  },
  {
    domain: 'medrevolveb2b.com',
    page: 'ForBusiness — Final CTA section pricing footnote',
    risk: 'MEDIUM',
    type: 'Public Pricing Exposure',
    original: '"$5K setup + $2.5–3K/month + 5% revenue share"',
    updated: 'Pricing provided during onboarding consultation only (no public $ figures)',
    reason: 'Public pricing on a high-risk merchant platform page creates predatory pricing audit risk and undermines Stripe/payment processor compliance review',
  },
  {
    domain: 'medrevolveb2b.com',
    page: 'PartnerProgram — Partner Perks list',
    risk: 'MEDIUM',
    type: 'FTC Referral Disclosure',
    original: '"Affiliate Referral Structure"',
    updated: '"Referral Compensation Program (physician-supervised programs only)"',
    reason: 'FTC 16 CFR Part 255 requires material connection disclosures. Added explicit exclusion of RUO from compensation structures',
  },
  {
    domain: 'medrevolveb2b.com',
    page: 'PartnerProgram — Earnings section header',
    risk: 'MEDIUM',
    type: 'FTC Income Claims',
    original: '"How Much Can You Earn?"',
    updated: '"Estimated Partner Earnings"',
    reason: 'FTC Business Opportunity Rule: income projection headlines require "estimated" qualifier. Added earnings disclaimer footnote.',
  },
  {
    domain: 'medrevolveb2b.com',
    page: 'JourneySelector (Home B2B) — RUO card',
    risk: 'HIGH',
    type: 'RUO Consumer Framing',
    original: '"RUO / Research Business" — "Launch a compliant Research Use Only business with a done-for-you website"',
    updated: '"RUO Research Supply" — "Institutional RUO catalog — licensed research entities only. Not for consumer sale."',
    reason: 'Framing RUO as a consumer merchant business violates FDA RUO guidelines. Must be institutional-only with explicit "not for consumer sale" language.',
  },

  // ── medrevolvewater.com (WATER) ────────────────────────────────────────────
  {
    domain: 'medrevolvewater.com',
    page: 'WaterHome — "Who We Serve" Individuals card',
    risk: 'MEDIUM',
    type: 'Ambiguous Use Language',
    original: '"Order individual vials for personal research or reconstitution needs. Discreet shipping."',
    updated: '"Order individual vials for reconstitution and licensed facility use. Discreet, secure shipping."',
    reason: '"Personal research" on a consumer product page is flagged by payment processors as implied self-administration. Removed.',
  },
  {
    domain: 'medrevolvewater.com',
    page: 'All pages — Footer',
    risk: 'HIGH',
    type: 'Duplicate Telehealth Footer',
    original: 'Second footer appeared: "Physician-supervised telehealth programs available in all 50 states. All programs require a valid prescription." with HIPAA/Telehealth links',
    updated: 'Layout footer fully suppressed on WATER domain. Only the MedRevolve Water branded footer displays.',
    reason: 'Telehealth compliance language and HIPAA links do not belong on a bacteriostatic water domain. Cross-domain linking creates regulatory confusion for payment processors.',
  },

  // ── medrevolveruo.com (RUO) ────────────────────────────────────────────────
  {
    domain: 'medrevolveruo.com',
    page: 'All pages — Footer',
    risk: 'HIGH',
    type: 'Duplicate Telehealth Footer',
    original: 'Second footer appeared with full telehealth legal copy, HIPAA/prescription links, and telehealth disclaimer',
    updated: 'Layout footer fully suppressed on RUO domain. Only the inline RUO research footer displays.',
    reason: 'Telehealth/Rx language on an RUO domain links the consumer medical brand to the RUO domain — a direct Mastercard and FDA red flag',
  },
  {
    domain: 'medrevolveruo.com',
    page: 'All pages — Top nav brand name',
    risk: 'MEDIUM',
    type: 'Brand Separation / Domain Identity',
    original: '"MedRevolve Research"',
    updated: '"MedRevolve RUO — For Research Use Only"',
    reason: 'Visual and legal separation of RUO domain from consumer brand. Reinforces "For Research Use Only" on every page load per FDA RUO guideline.',
  },
  {
    domain: 'medrevolveruo.com',
    page: 'All pages — Header phone number',
    risk: 'HIGH',
    type: 'Cross-Domain Phone Number',
    original: 'Consumer patient support number 240-387-5224 displayed in RUO domain header',
    updated: 'Phone number fully removed from top bar, desktop nav, floating button, and mobile menu. Email contact research@medrevolveruo.com shown instead.',
    reason: 'Shared phone number between consumer telehealth brand and RUO domain creates direct link that payment processors and FDA investigators use to prove cross-promotion. Removed entirely.',
  },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // ── 1. Write to Google Sheets ───────────────────────────────────────────
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Create a new spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `MedRevolve Compliance Audit — Deploy Ready — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        },
        sheets: [{
          properties: { title: 'Compliance Fixes' },
        }],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('Sheets create error:', err);
      throw new Error('Failed to create spreadsheet: ' + err);
    }

    const spreadsheet = await createRes.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    console.log('Created spreadsheet:', sheetUrl);

    // Build rows
    const headers = ['Domain', 'Page / Location', 'Risk Level', 'Issue Type', 'Original Text / Setting', 'Updated Text / Setting', 'Compliance Reason', 'Date Fixed'];
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const rows = AUDIT_CHANGES.map(c => [
      c.domain,
      c.page,
      c.risk,
      c.type,
      c.original,
      c.updated,
      c.reason,
      today,
    ]);

    // Write header + data
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:H${rows.length + 1}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers, ...rows],
        }),
      }
    );

    if (!writeRes.ok) {
      const err = await writeRes.text();
      console.error('Sheets write error:', err);
      throw new Error('Failed to write to spreadsheet: ' + err);
    }

    // Format header row bold + freeze
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
              cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.18, green: 0.22, blue: 0.16 } } },
              fields: 'userEnteredFormat(textFormat,backgroundColor)',
            },
          },
          {
            updateSheetProperties: {
              properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 8 },
            },
          },
        ],
      }),
    });

    console.log('Spreadsheet data written and formatted');

    // ── 2. Send email via Base44 integration ───────────────────────────────
    const highCount = AUDIT_CHANGES.filter(c => c.risk === 'HIGH').length;
    const medCount = AUDIT_CHANGES.filter(c => c.risk === 'MEDIUM').length;
    const lowCount = AUDIT_CHANGES.filter(c => c.risk === 'LOW').length;

    const domainSummary = [...new Set(AUDIT_CHANGES.map(c => c.domain))].map(domain => {
      const fixes = AUDIT_CHANGES.filter(c => c.domain === domain);
      return `<tr>
        <td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">${domain}</td>
        <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">${fixes.length}</td>
        <td style="padding:8px 12px;border:1px solid #ddd;">${fixes.map(f => `• ${f.type}`).join('<br>')}</td>
      </tr>`;
    }).join('');

    const fixRows = AUDIT_CHANGES.map(c => {
      const riskColor = c.risk === 'HIGH' ? '#b91c1c' : c.risk === 'MEDIUM' ? '#b45309' : '#15803d';
      return `<tr>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;color:#1f2937;">${c.domain}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#374151;">${c.page}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;"><span style="background:${riskColor};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">${c.risk}</span></td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#6b7280;font-size:12px;">${c.type}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#9ca3af;font-size:11px;font-style:italic;">${c.original}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#15803d;font-size:11px;font-weight:600;">${c.updated}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#6b7280;font-size:11px;">${c.reason}</td>
      </tr>`;
    }).join('');

    const emailBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

<div style="max-width:960px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="background:#1a2e1a;border-radius:12px 12px 0 0;padding:32px 36px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="background:white;padding:6px 10px;border-radius:4px;font-weight:900;font-size:13px;color:#1a2e1a;letter-spacing:-0.5px;">MR</div>
      <span style="color:white;font-weight:700;font-size:16px;">MedRevolve</span>
    </div>
    <h1 style="color:white;font-size:26px;font-weight:800;margin:0 0 8px 0;letter-spacing:-0.5px;">
      ✅ Compliance Audit Complete — Deploy Ready
    </h1>
    <p style="color:rgba(255,255,255,0.6);margin:0;font-size:14px;">
      Full 4-domain FDA, FTC & payment processor compliance pass · ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
    </p>
  </div>

  <!-- Status Bar -->
  <div style="background:#ffffff;border-left:4px solid #16a34a;padding:20px 36px;border-bottom:1px solid #e5e7eb;">
    <div style="display:flex;gap:32px;flex-wrap:wrap;">
      <div><span style="font-size:28px;font-weight:900;color:#1a2e1a;">${AUDIT_CHANGES.length}</span><span style="color:#6b7280;font-size:13px;display:block;">Total Fixes Deployed</span></div>
      <div><span style="font-size:28px;font-weight:900;color:#b91c1c;">${highCount}</span><span style="color:#6b7280;font-size:13px;display:block;">High Risk Resolved</span></div>
      <div><span style="font-size:28px;font-weight:900;color:#b45309;">${medCount}</span><span style="color:#6b7280;font-size:13px;display:block;">Medium Risk Resolved</span></div>
      <div><span style="font-size:28px;font-weight:900;color:#15803d;">${lowCount}</span><span style="color:#6b7280;font-size:13px;display:block;">Low Risk Resolved</span></div>
      <div><span style="font-size:28px;font-weight:900;color:#1a2e1a;">4</span><span style="color:#6b7280;font-size:13px;display:block;">Domains Audited</span></div>
    </div>
  </div>

  <!-- Google Sheet Link -->
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 24px;margin:24px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:gap;">
    <div>
      <p style="font-weight:700;color:#1e40af;margin:0 0 4px 0;">📊 Full Audit Log — Google Sheets</p>
      <p style="color:#3b82f6;font-size:13px;margin:0;">All ${AUDIT_CHANGES.length} changes documented with before/after text and compliance rationale</p>
    </div>
    <a href="${sheetUrl}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px;white-space:nowrap;margin-left:16px;">
      Open Sheet →
    </a>
  </div>

  <!-- Per-Domain Summary -->
  <div style="background:white;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:24px;overflow:hidden;">
    <div style="background:#f9fafb;padding:14px 24px;border-bottom:1px solid #e5e7eb;">
      <h2 style="margin:0;font-size:15px;font-weight:700;color:#1f2937;">Domain Scorecard</h2>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:10px 12px;border:1px solid #ddd;text-align:left;font-size:12px;color:#6b7280;">Domain</th>
          <th style="padding:10px 12px;border:1px solid #ddd;text-align:center;font-size:12px;color:#6b7280;">Fixes</th>
          <th style="padding:10px 12px;border:1px solid #ddd;text-align:left;font-size:12px;color:#6b7280;">Issue Types</th>
        </tr>
      </thead>
      <tbody>${domainSummary}</tbody>
    </table>
  </div>

  <!-- Full Fix Table -->
  <div style="background:white;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:24px;">
    <div style="background:#f9fafb;padding:14px 24px;border-bottom:1px solid #e5e7eb;">
      <h2 style="margin:0;font-size:15px;font-weight:700;color:#1f2937;">All Compliance Fixes — Before & After</h2>
    </div>
    <div style="overflow-x:auto;">
    <table style="width:100%;border-collapse:collapse;min-width:900px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:11px;color:#6b7280;">Domain</th>
          <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:11px;color:#6b7280;">Page</th>
          <th style="padding:10px 12px;border:1px solid #e5e7eb;font-size:11px;color:#6b7280;">Risk</th>
          <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:11px;color:#6b7280;">Type</th>
          <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:11px;color:#6b7280;">Original</th>
          <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:11px;color:#6b7280;">Updated</th>
          <th style="padding:10px 12px;border:1px solid #e5e7eb;text-align:left;font-size:11px;color:#6b7280;">Reason</th>
        </tr>
      </thead>
      <tbody>${fixRows}</tbody>
    </table>
    </div>
  </div>

  <!-- Key Compliance Areas Covered -->
  <div style="background:white;border-radius:8px;border:1px solid #e5e7eb;padding:24px;margin-bottom:24px;">
    <h2 style="font-size:15px;font-weight:700;color:#1f2937;margin:0 0 16px 0;">Regulatory Frameworks Addressed</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      ${[
        '✅ FDA 21 CFR §201 — No unapproved drug mechanism claims (removed "Dual-Action")',
        '✅ FDA 503A/503B — Correct pharmacy classification language throughout',
        '✅ FDA RUO Guidelines — Institutional-only framing, no consumer RUO commerce',
        '✅ FTC 16 CFR Part 255 — Referral/affiliate disclosures & "Estimated" income labeling',
        '✅ FTC Business Opportunity Rule — No guaranteed income projections',
        '✅ Mastercard/Visa MCC 5122 — Removed 503B bulk compounding merchant language',
        '✅ Payment Processor Rules — No cross-domain phone/brand linking on RUO domain',
        '✅ HIPAA — Telehealth consent & HIPAA links removed from non-telehealth domains',
      ].map(item => `<div style="font-size:12px;color:#374151;padding:6px 0;">${item}</div>`).join('')}
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#1a2e1a;border-radius:0 0 12px 12px;padding:20px 36px;text-align:center;">
    <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">
      MedRevolve Internal Compliance Report · Generated ${new Date().toISOString().split('T')[0]} · 
      Sent from rned@medrevolve.com · 
      Sheet: <a href="${sheetUrl}" style="color:#A8C99B;">${sheetUrl}</a>
    </p>
  </div>

</div>
</body>
</html>
    `.trim();

    // Send via Gmail connector (rned@medrevolve.com authorized)
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const subject = `✅ Deploy-Ready: ${AUDIT_CHANGES.length} Compliance Fixes Across All 4 Domains — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    // Build RFC 2822 message
    const boundary = 'boundary_medrevolve_' + Date.now();
    const rawMessage = [
      `From: MedRevolve Compliance <rned@medrevolve.com>`,
      `To: noel@medrevolve.com`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      emailBody,
    ].join('\r\n');

    const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gmailToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!gmailRes.ok) {
      const gmailErr = await gmailRes.text();
      console.error('Gmail send error:', gmailErr);
      throw new Error('Gmail send failed: ' + gmailErr);
    }

    console.log('Email sent via Gmail to noel@medrevolve.com');

    return Response.json({
      success: true,
      total_fixes: AUDIT_CHANGES.length,
      high_risk: highCount,
      medium_risk: medCount,
      low_risk: lowCount,
      sheet_url: sheetUrl,
      email_sent_to: 'noel@medrevolve.com',
      domains_audited: ['medrevolve.com', 'medrevolveb2b.com', 'medrevolvewater.com', 'medrevolveruo.com'],
    });

  } catch (error) {
    console.error('Audit function error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});