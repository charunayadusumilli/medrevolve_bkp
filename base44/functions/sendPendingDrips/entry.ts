/**
 * sendPendingDrips — One-time bulk sender.
 * Finds all ContactRequest and CustomerIntake records with campaign_sent=false,
 * filters out test/spam/internal entries, and sends Day 0 drip email to each.
 * Marks campaign_sent=true after sending.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SKIP_EMAILS = ['test@example.com', 'rned@medrevolve.com'];
const SKIP_DOMAINS = ['example.com', 'ctm.noemail', 'no-reply.base44.com'];
// Skip obvious spam/SEO cold outreach by keyword in subject or message
const SPAM_KEYWORDS = ['seo analysis', 'search engine optimization steps', 'backend analysis of your website', 'llc incorporation', 'llc formation'];

const isRealLead = (record) => {
  const email = (record.email || '').toLowerCase();
  const name = (record.name || record.full_name || '').toLowerCase();
  const msg = (record.message || record.call_notes || '').toLowerCase();
  const subj = (record.subject || '').toLowerCase();

  if (!email || !email.includes('@')) return false;
  if (SKIP_EMAILS.includes(email)) return false;
  if (SKIP_DOMAINS.some(d => email.endsWith('@' + d))) return false;
  if (name === 'test user' || name === 'test' || email.includes('test@')) return false;
  if (SPAM_KEYWORDS.some(kw => msg.includes(kw) || subj.includes(kw))) return false;

  return true;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all pending ContactRequests
    const contactRequests = await base44.asServiceRole.entities.ContactRequest.filter({ campaign_sent: false });
    const customerIntakes = await base44.asServiceRole.entities.CustomerIntake.filter({ email_sent: false });

    const results = { sent: [], skipped: [], failed: [] };

    // Process ContactRequests
    for (const cr of contactRequests) {
      if (!isRealLead(cr)) {
        results.skipped.push({ email: cr.email, reason: 'test/spam/internal' });
        continue;
      }

      try {
        const dripRes = await base44.asServiceRole.functions.invoke('leadDripSequence', {
          email: cr.email,
          name: cr.name,
          interest: cr.subject || 'your inquiry',
          drip_index: 0,
        });

        if (dripRes?.success) {
          await base44.asServiceRole.entities.ContactRequest.update(cr.id, {
            campaign_sent: true,
            status: 'in_progress',
          });
          results.sent.push({ email: cr.email, name: cr.name, type: 'ContactRequest' });
          console.log(`✅ Sent Day 0 drip to ContactRequest: ${cr.email}`);
        } else {
          results.failed.push({ email: cr.email, error: 'Drip returned no success' });
        }
      } catch (err) {
        results.failed.push({ email: cr.email, error: err.message });
        console.error(`❌ Failed for ${cr.email}:`, err.message);
      }
    }

    // Process CustomerIntakes
    for (const ci of customerIntakes) {
      if (!isRealLead({ email: ci.email, name: ci.full_name, message: ci.call_notes })) {
        results.skipped.push({ email: ci.email, reason: 'test/spam/internal' });
        continue;
      }

      try {
        const dripRes = await base44.asServiceRole.functions.invoke('leadDripSequence', {
          email: ci.email,
          name: ci.full_name,
          interest: ci.primary_interest || 'your inquiry',
          drip_index: 0,
        });

        if (dripRes?.success) {
          await base44.asServiceRole.entities.CustomerIntake.update(ci.id, {
            email_sent: true,
            status: 'contacted',
          });
          results.sent.push({ email: ci.email, name: ci.full_name, type: 'CustomerIntake' });
          console.log(`✅ Sent Day 0 drip to CustomerIntake: ${ci.email}`);
        } else {
          results.failed.push({ email: ci.email, error: 'Drip returned no success' });
        }
      } catch (err) {
        results.failed.push({ email: ci.email, error: err.message });
        console.error(`❌ Failed for ${ci.email}:`, err.message);
      }
    }

    console.log(`[sendPendingDrips] Done — Sent: ${results.sent.length}, Skipped: ${results.skipped.length}, Failed: ${results.failed.length}`);

    return Response.json({
      success: true,
      summary: {
        sent: results.sent.length,
        skipped: results.skipped.length,
        failed: results.failed.length,
      },
      details: results,
    });

  } catch (error) {
    console.error('[sendPendingDrips] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});