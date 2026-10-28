import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const ALLOWED = ['queued', 'sent', 'delivered', 'undelivered', 'failed', 'answered'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const form = await req.formData();
    const sid = form.get('MessageSid') || form.get('CallSid');
    const raw = form.get('MessageStatus') || form.get('CallStatus');
    if (!sid || !raw) return Response.json({ ok: true, ignored: true });

    const status = String(raw).toLowerCase();
    if (!ALLOWED.includes(status)) return Response.json({ ok: true, ignored: status });

    const found = await base44.asServiceRole.entities.CampaignSend.filter({ provider_sid: sid }, { limit: 1 });
    const send = (found.items || [])[0];
    if (!send) return Response.json({ ok: true, unmatched: true });

    await base44.asServiceRole.entities.CampaignSend.update(send.id, {
      status,
      error: form.get('ErrorMessage') || undefined,
    });

    if (status === 'delivered' || status === 'undelivered' || status === 'failed') {
      const campaign = await base44.asServiceRole.entities.MarketingCampaign
        .get(send.campaign_id)
        .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
      if (campaign) {
        const delivered = (campaign.sent_count || 0);
        const failed = status === 'delivered' ? (campaign.failed_count || 0) : (campaign.failed_count || 0) + 1;
        await base44.asServiceRole.entities.MarketingCampaign.update(campaign.id, {
          failed_count: failed,
          sent_count: status === 'delivered' ? delivered : Math.max(delivered - 1, 0),
        });
      }
    }

    return Response.json({ ok: true, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});