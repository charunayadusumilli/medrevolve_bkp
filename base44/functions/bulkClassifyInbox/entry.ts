/**
 * bulkClassifyInbox — Fetches all inbox emails and applies MedRevolve classification labels.
 * Run once to clean up / classify existing inbox messages.
 * Supports optional ?maxResults= query param (default 100).
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CLASSIFICATION_RULES = [
  { label: 'MedRevolve/🔬 Competitors/Intelligence',
    match: (s, b, f) => /peptide|competi|competitor|beluga|qualiphy|wellsync|openloop|drcare|ola digital/i.test(s + b) || /noel@cardgroupintl/i.test(f) },
  { label: 'MedRevolve/👨‍⚕️ Providers/Applications',
    match: (s, b, f) => /provider|physician|md |np |pa |license|credential|specialty|npi/i.test(s) || /join.*provider|provider.*apply/i.test(s + b) },
  { label: 'MedRevolve/💊 Pharmacies/Applications',
    match: (s, b) => /pharmac|compounding|dispensing|rx |npi.*pharmacy/i.test(s + b) },
  { label: 'MedRevolve/🏢 Merchants/Onboarding',
    match: (s, b) => /merchant|white.?label|b2b|onboard|business inquiry|clinic setup|launch.*platform|platform.*launch/i.test(s + b) },
  { label: 'MedRevolve/🤝 Partners/Applications',
    match: (s, b) => /partner|affiliate|referral|gym|spa|wellness center|fitness studio/i.test(s + b) },
  { label: 'MedRevolve/🎨 Creators/Applications',
    match: (s, b) => /creator|influencer|instagram|tiktok|youtube|content creator|ugc/i.test(s + b) },
  { label: 'MedRevolve/💳 Payments/Failed',
    match: (s, b, f) => /payment fail|declined|chargeback|refund request|billing issue/i.test(s + b) || /stripe/i.test(f) },
  { label: 'MedRevolve/⚠️ Compliance/Flagged',
    match: (s, b) => /fda|dea|complaint|flagged|violation|cease|legal|audit|inspect/i.test(s + b) },
  { label: 'MedRevolve/🏥 Patients/Intakes',
    match: (s, b) => /patient|intake|glp|semaglutide|tirzepatide|weight loss|consultation/i.test(s + b) },
  { label: 'MedRevolve/📋 Action Required',
    match: (s, b) => /urgent|asap|follow.?up|action needed|reminder|response required/i.test(s + b) },
  { label: 'MedRevolve/📥 Leads/New',
    match: () => true },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const maxResults = body.maxResults || 200;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const gmailHeaders = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // Build label name → id map
    const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const labelsData = await labelsRes.json();
    const labelMap = {};
    (labelsData.labels || []).forEach(l => { labelMap[l.name] = l.id; });
    console.log(`Found ${Object.keys(labelMap).length} labels`);

    // List inbox messages
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=${maxResults}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const listData = await listRes.json();
    const messages = listData.messages || [];
    console.log(`Found ${messages.length} inbox messages to classify`);

    let classified = 0;
    let skipped = 0;
    const results = [];

    for (const { id } of messages) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!msgRes.ok) { skipped++; continue; }
      const msg = await msgRes.json();

      const hdrs = msg.payload?.headers ?? [];
      const getH = (name) => hdrs.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
      const subject = getH('Subject');
      const from = getH('From');

      // Skip system messages
      if (/mailer-daemon|no-reply@|noreply@|postmaster@|notifications@base44/i.test(from)) {
        skipped++;
        continue;
      }

      // Find matching rule
      const rule = CLASSIFICATION_RULES.find(r => r.match(subject, subject, from));
      if (!rule) { skipped++; continue; }

      const labelId = labelMap[rule.label];
      if (!labelId) {
        console.warn(`Label not found: "${rule.label}" — run setupGmailLabels first`);
        skipped++;
        continue;
      }

      // Check if label already applied
      const currentLabelIds = msg.labelIds || [];
      if (currentLabelIds.includes(labelId)) {
        skipped++;
        continue;
      }

      // Apply label
      const applyRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
        method: 'POST',
        headers: gmailHeaders,
        body: JSON.stringify({ addLabelIds: [labelId] }),
      });

      if (applyRes.ok) {
        classified++;
        results.push({ id, subject: subject.substring(0, 60), from: from.substring(0, 40), label: rule.label });
        console.log(`✅ [${classified}] "${subject.substring(0, 50)}" → ${rule.label}`);
      } else {
        skipped++;
      }
    }

    return Response.json({
      success: true,
      total_scanned: messages.length,
      classified,
      skipped,
      results,
    });

  } catch (error) {
    console.error('bulkClassifyInbox error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});