import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';

// Detect workflow path and service category from email subject + body
function detectWorkflow(subject, body) {
  const text = (subject + ' ' + body).toLowerCase();

  if (/incorporat|llc|formation|business entity|registered agent/i.test(text))
    return { path: 'Legal / Business Formation', category: 'LLC & Incorporation', icon: '🏛️', priority: 'HIGH' };
  if (/white.?label|merchant|b2b|clinic setup|launch.*platform|platform.*launch/i.test(text))
    return { path: 'Merchant Onboarding', category: 'White Label Platform', icon: '🏢', priority: 'HIGH' };
  if (/wholesale|bulk.*order|product.*supply|supply.*product/i.test(text))
    return { path: 'Wholesale / Supply', category: 'Product Wholesale', icon: '📦', priority: 'HIGH' };
  if (/provider|physician|md|np|pa|license|credentail|specialty|join.*as.*provider/i.test(text))
    return { path: 'Provider Network', category: 'Provider Application', icon: '👨‍⚕️', priority: 'HIGH' };
  if (/pharmac|compounding|dispensing|rx.*partner|pharmacy.*partner/i.test(text))
    return { path: 'Pharmacy Network', category: 'Pharmacy Partnership', icon: '💊', priority: 'HIGH' };
  if (/partner|affiliate|referral|gym|spa|wellness center|fitness/i.test(text))
    return { path: 'Partner Program', category: 'Affiliate / Referral', icon: '🤝', priority: 'MEDIUM' };
  if (/creator|influencer|instagram|tiktok|youtube|ugc/i.test(text))
    return { path: 'Creator Program', category: 'Influencer Partnership', icon: '🎨', priority: 'MEDIUM' };
  if (/glp|semaglutide|tirzepatide|weight loss|consultation|patient|intake/i.test(text))
    return { path: 'Patient / Telehealth', category: 'Patient Inquiry', icon: '🏥', priority: 'MEDIUM' };
  if (/payment|invoice|billing|charge|refund|subscription/i.test(text))
    return { path: 'Billing / Payments', category: 'Payment Issue', icon: '💳', priority: 'HIGH' };
  if (/compliance|fda|dea|legal|audit|flagged|violation/i.test(text))
    return { path: 'Compliance', category: 'Compliance / Legal', icon: '⚠️', priority: 'HIGH' };
  if (/competitor|peptide.*vendor|alternative.*platform/i.test(text))
    return { path: 'Competitor Intelligence', category: 'Market Research', icon: '🔬', priority: 'LOW' };

  return { path: 'General Inquiry', category: 'Unclassified', icon: '📬', priority: 'MEDIUM' };
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    const messageIds = body?.data?.new_message_ids ?? [];
    if (messageIds.length === 0) {
      return Response.json({ processed: 0 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    let processed = 0;

    for (const messageId of messageIds) {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: authHeader }
      );
      if (!res.ok) continue;
      const message = await res.json();

      const headers = message.payload?.headers ?? [];
      const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';

      const from = getHeader('From');
      const subject = getHeader('Subject');

      const emailMatch = from.match(/<(.+?)>/) || [null, from];
      const senderEmail = emailMatch[1].trim();
      const senderName = from.includes('<') ? from.split('<')[0].trim().replace(/"/g, '') : from;

      // Skip own outgoing / system emails
      if (senderEmail === ADMIN_EMAIL || /mailer-daemon|no-reply@|noreply@|postmaster@/i.test(senderEmail)) {
        console.log(`Skipping system/own email from ${senderEmail}`);
        continue;
      }

      // Extract plain text body
      let bodyText = '';
      const extractBody = (part) => {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          bodyText = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          return;
        }
        if (part.parts) part.parts.forEach(extractBody);
      };
      extractBody(message.payload);

      // Deduplicate
      const allRecent = await base44.asServiceRole.entities.ContactRequest.filter({});
      const alreadySaved = allRecent.some(r => r.notes && r.notes.includes(`gmail_id:${messageId}`));
      if (alreadySaved) {
        console.log(`Skipping duplicate messageId: ${messageId}`);
        continue;
      }

      // Detect workflow
      const workflow = detectWorkflow(subject, bodyText);

      // Store clean subject (no Gmail ID prefix), stash gmail_id in notes
      await base44.asServiceRole.entities.ContactRequest.create({
        name: senderName || senderEmail,
        email: senderEmail,
        subject: subject.substring(0, 250),
        message: bodyText.substring(0, 5000),
        source: 'gmail_inbox',
        status: 'new',
        meeting_booked: false,
        meeting_link: '',
        notes: `gmail_id:${messageId} | workflow:${workflow.path} | category:${workflow.category} | priority:${workflow.priority}`,
      });

      processed++;
      console.log(`✅ Saved [${workflow.path}] from ${senderEmail}: "${subject}"`);
    }

    return Response.json({ processed });
  } catch (error) {
    console.error('fetchInboxEmails error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});