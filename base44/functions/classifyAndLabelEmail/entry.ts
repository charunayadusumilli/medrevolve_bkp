/**
 * classifyAndLabelEmail — Auto-classifies incoming emails and applies Gmail labels.
 * Also applies labels to existing ContactRequest records when their status changes.
 * 
 * Called by the Gmail mailbox automation AND by entity update automations.
 * 
 * Payload options:
 *   { message_id, gmail_message_id }  → classify a specific Gmail message
 *   { contact_request_id, status }    → apply label update when CR status changes
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Classification rules — checked in order, first match wins
const CLASSIFICATION_RULES = [
  // Competitors / intelligence
  {
    label: 'MedRevolve/🔬 Competitors/Intelligence',
    match: (subject, body, from) =>
      /peptide|competi|competitor|beluga|qualiphy|wellsync|openloop|drcare|ola digital/i.test(subject + body) ||
      /noel@cardgroupintl/i.test(from),
  },
  // Provider applications
  {
    label: 'MedRevolve/👨‍⚕️ Providers/Applications',
    match: (subject, body, from) =>
      /provider|physician|md|np|pa|license|credentail|specialty|npi/i.test(subject) ||
      /join.*provider|provider.*apply|apply.*provider/i.test(subject + body),
  },
  // Pharmacy applications
  {
    label: 'MedRevolve/💊 Pharmacies/Applications',
    match: (subject, body, from) =>
      /pharmac|compounding|dispensing|rx|npi.*pharmacy/i.test(subject + body),
  },
  // Merchant / business onboarding
  {
    label: 'MedRevolve/🏢 Merchants/Onboarding',
    match: (subject, body, from) =>
      /merchant|white.?label|b2b|white label|onboard|business inquiry|clinic setup|launch/i.test(subject + body),
  },
  // Partner program
  {
    label: 'MedRevolve/🤝 Partners/Applications',
    match: (subject, body, from) =>
      /partner|affiliate|referral|gym|spa|wellness center|fitness/i.test(subject + body),
  },
  // Creator / influencer
  {
    label: 'MedRevolve/🎨 Creators/Applications',
    match: (subject, body, from) =>
      /creator|influencer|instagram|tiktok|youtube|content creator|ugc/i.test(subject + body),
  },
  // Payment issues
  {
    label: 'MedRevolve/💳 Payments/Failed',
    match: (subject, body, from) =>
      /payment fail|declined|chargeback|refund request|billing issue/i.test(subject + body) ||
      /stripe|payment/i.test(from),
  },
  // Compliance / flagged
  {
    label: 'MedRevolve/⚠️ Compliance/Flagged',
    match: (subject, body, from) =>
      /fda|dea|complaint|flagged|violation|cease|legal|audit|inspect/i.test(subject + body),
  },
  // Patient / customer intakes
  {
    label: 'MedRevolve/🏥 Patients/Intakes',
    match: (subject, body, from) =>
      /patient|intake|glp|semaglutide|tirzepatide|weight loss|peptide.*prescription|consultation/i.test(subject + body),
  },
  // Action required catch-all
  {
    label: 'MedRevolve/📋 Action Required',
    match: (subject, body, from) =>
      /urgent|asap|follow.?up|action needed|reminder|response required/i.test(subject + body),
  },
  // General lead fallback
  {
    label: 'MedRevolve/📥 Leads/New',
    match: () => true, // fallback
  },
];

const SOURCE_TO_LABEL = {
  website_form: 'MedRevolve/📥 Leads/New',
  gmail_inbox: 'MedRevolve/📥 Leads/New',
  ctm_call: 'MedRevolve/📋 Action Required',
  ctm_text: 'MedRevolve/📥 Leads/New',
};

const STATUS_TO_LABEL = {
  new: 'MedRevolve/📥 Leads/New',
  in_progress: 'MedRevolve/📥 Leads/Contacted',
  meeting_scheduled: 'MedRevolve/📥 Leads/Qualified',
  resolved: 'MedRevolve/📥 Leads/Closed',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const gmailHeaders = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // Get all labels (build name→id map)
    const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const labelsData = await labelsRes.json();
    const labelMap = {}; // name → id
    (labelsData.labels || []).forEach(l => { labelMap[l.name] = l.id; });

    const applyLabel = async (gmailMessageId, labelName) => {
      const labelId = labelMap[labelName];
      if (!labelId) {
        console.warn(`Label not found: "${labelName}" — run setupGmailLabels first`);
        return false;
      }
      const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${gmailMessageId}/modify`, {
        method: 'POST',
        headers: gmailHeaders,
        body: JSON.stringify({ addLabelIds: [labelId] }),
      });
      if (!r.ok) {
        const e = await r.json();
        console.error(`Label apply failed for ${gmailMessageId}:`, JSON.stringify(e));
        return false;
      }
      console.log(`✅ Applied label "${labelName}" to message ${gmailMessageId}`);
      return true;
    };

    // ── Mode 1: Classify new Gmail messages (from mailbox webhook) ──────────
    const messageIds = body?.data?.new_message_ids ?? [];
    if (messageIds.length > 0) {
      let classified = 0;
      for (const messageId of messageIds) {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!msgRes.ok) continue;
        const msg = await msgRes.json();

        const headers = msg.payload?.headers ?? [];
        const getH = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
        const subject = getH('Subject');
        const from = getH('From');

        let bodyText = '';
        const extractBody = (part) => {
          if (part.mimeType === 'text/plain' && part.body?.data) {
            bodyText += atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
          if (part.parts) part.parts.forEach(extractBody);
        };
        extractBody(msg.payload);

        // Skip system/daemon messages
        if (/mailer-daemon|no-reply@|noreply@|postmaster@/i.test(from)) {
          console.log(`Skipping system message from: ${from}`);
          continue;
        }

        // Find matching label
        const rule = CLASSIFICATION_RULES.find(r => r.match(subject, bodyText, from));
        if (rule) {
          await applyLabel(messageId, rule.label);
          classified++;
        }
      }
      return Response.json({ success: true, classified, mode: 'classify_incoming' });
    }

    // ── Mode 2: Re-label a ContactRequest when its status changes ─────────
    if (body?.event?.entity_name === 'ContactRequest' && body?.data) {
      const cr = body.data;
      const status = cr.status;
      const targetLabel = STATUS_TO_LABEL[status];

      if (!targetLabel) {
        return Response.json({ skipped: true, reason: `No label mapping for status: ${status}` });
      }

      // Find the Gmail message ID embedded in subject [Gmail:XXXX]
      const gmailIdMatch = cr.subject?.match(/\[Gmail:([^\]]+)\]/);
      if (!gmailIdMatch) {
        return Response.json({ skipped: true, reason: 'No Gmail message ID in subject' });
      }
      const gmailMessageId = gmailIdMatch[1];

      // Remove old lead labels, apply new one
      const oldLabelIds = Object.values(STATUS_TO_LABEL)
        .map(n => labelMap[n])
        .filter(Boolean);
      
      await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${gmailMessageId}/modify`, {
        method: 'POST',
        headers: gmailHeaders,
        body: JSON.stringify({ removeLabelIds: oldLabelIds, addLabelIds: [labelMap[targetLabel]].filter(Boolean) }),
      });

      console.log(`✅ Re-labeled ContactRequest ${cr.id} → "${targetLabel}"`);
      return Response.json({ success: true, mode: 'relabel_status_change', label: targetLabel });
    }

    // ── Mode 3: Manual classify by message_id ──────────────────────────────
    if (body.gmail_message_id) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${body.gmail_message_id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const msg = await msgRes.json();
      const hdrs = msg.payload?.headers ?? [];
      const getH = (name) => hdrs.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
      const subject = getH('Subject');
      const from = getH('From');
      let bodyText = '';
      const extractBody = (part) => {
        if (part.mimeType === 'text/plain' && part.body?.data)
          bodyText += atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        if (part.parts) part.parts.forEach(extractBody);
      };
      extractBody(msg.payload);
      const rule = CLASSIFICATION_RULES.find(r => r.match(subject, bodyText, from));
      if (rule) {
        await applyLabel(body.gmail_message_id, rule.label);
        return Response.json({ success: true, mode: 'manual', label: rule.label });
      }
      return Response.json({ success: true, mode: 'manual', label: null, message: 'No matching rule' });
    }

    return Response.json({ success: true, processed: 0, message: 'Nothing to process' });

  } catch (error) {
    console.error('classifyAndLabelEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});