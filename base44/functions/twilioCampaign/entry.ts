import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const HOSTS = { consumer: 'https://medrevolve.com', ruo: 'https://medrevolveruo.com' };
const MAX_BATCH = 200;
const RUO_SEGMENTS = ['ruo_professional', 'b2b_operator'];

function escapeXml(value) {
  return String(value || '').replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
}

function renderBody(campaign, link) {
  const body = campaign.message_body || '';
  const merged = body.includes('{link}') ? body.split('{link}').join(link) : `${body} ${link}`;
  return merged.trim();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const action = payload.action;
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const keySid = Deno.env.get('TWILIO_API_KEY_SID');
    const keySecret = Deno.env.get('TWILIO_API_KEY_SECRET');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const from = Deno.env.get('TWILIO_PHONE_NUMBER');
    // Prefer scoped API key credentials; fall back to the account auth token.
    const credential = keySid && keySecret
      ? { user: keySid, pass: keySecret }
      : (authToken ? { user: accountSid, pass: authToken } : null);
    const configured = Boolean(accountSid && credential && from);
    const auth = credential ? 'Basic ' + btoa(`${credential.user}:${credential.pass}`) : null;

    if (action === 'status') {
      if (!configured) {
        return Response.json({
          connected: false,
          configured: false,
          reason: 'The account SID, API key or sending number is missing on the Secrets page.',
        });
      }
      const probe = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
        headers: { Authorization: auth },
        signal: AbortSignal.timeout(10000),
      });
      const info = await probe.json().catch(() => ({}));
      return Response.json({
        connected: probe.ok,
        configured: true,
        account_name: info.friendly_name || null,
        account_status: info.status || null,
        from,
        reason: probe.ok ? null : (info.message || `Twilio rejected the credentials (HTTP ${probe.status}).`),
      });
    }

    if (!payload.campaign_id) return Response.json({ error: 'campaign_id is required' }, { status: 400 });
    const campaign = await base44.asServiceRole.entities.MarketingCampaign
      .get(payload.campaign_id)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

    if (campaign.product_scope === 'ruo' && !RUO_SEGMENTS.includes(campaign.segment)) {
      return Response.json({ error: 'Research-use products can only be sent to the professional / research segments.' }, { status: 400 });
    }

    const host = HOSTS[campaign.product_scope === 'ruo' ? 'ruo' : 'consumer'];
    const linkUrl = campaign.link_url || `${host}/go/${campaign.link_code}`;
    const body = renderBody(campaign, linkUrl);

    const page = await base44.asServiceRole.entities.MarketingContact.filter(
      { segment: campaign.segment, opt_out: { $ne: true } },
      { limit: 500 },
    );
    const eligible = (page.items || []).filter((contact) => {
      if (!contact.phone) return false;
      return campaign.channel === 'voice' ? contact.voice_consent === true : contact.sms_consent === true;
    }).slice(0, MAX_BATCH);

    if (action === 'audience') {
      return Response.json({ eligible: eligible.length, link: linkUrl, body, configured });
    }

    if (!configured) {
      return Response.json({
        error: 'Twilio credentials are not set yet. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER on the Secrets page.',
      }, { status: 400 });
    }

    const callbackUrl = `${new URL(req.url).origin}/functions/twilioDeliveryWebhook`;

    const sendSms = async (to) => {
      const form = new URLSearchParams({ To: to, From: from, Body: body, StatusCallback: callbackUrl });
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => ({}));
      return { to, channel: 'sms', ok: res.ok, sid: data.sid || null, error: res.ok ? null : (data.message || `HTTP ${res.status}`) };
    };

    const placeCall = async (to) => {
      const script = campaign.voice_script || `This is MedRevolve. ${campaign.message_body || ''}`;
      const twiml = `<Response><Say voice="Polly.Joanna">${escapeXml(script)}</Say>` +
        `<Sms to="${escapeXml(to)}" from="${escapeXml(from)}">${escapeXml(`Here is your link: ${linkUrl}`)}</Sms>` +
        `<Hangup/></Response>`;
      const form = new URLSearchParams({
        To: to,
        From: from,
        Twiml: twiml,
        StatusCallback: callbackUrl,
        StatusCallbackEvent: 'completed',
      });
      form.append('StatusCallbackEvent', 'answered');
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
        signal: AbortSignal.timeout(20000),
      });
      const data = await res.json().catch(() => ({}));
      return { to, channel: 'voice', ok: res.ok, sid: data.sid || null, error: res.ok ? null : (data.message || `HTTP ${res.status}`) };
    };

    const sendTo = (to) => (campaign.channel === 'voice' ? placeCall(to) : sendSms(to));

    if (action === 'test') {
      const to = payload.phone || Deno.env.get('ADMIN_PHONE');
      if (!to) return Response.json({ error: 'A test phone number is required.' }, { status: 400 });
      const result = await sendTo(to);
      return Response.json({ result, body, link: linkUrl });
    }

    if (action !== 'launch') return Response.json({ error: 'Unknown action' }, { status: 400 });

    if (String(campaign.segment).startsWith('consumer')) {
      const hour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', hour: 'numeric', hour12: false,
      }).format(new Date()));
      if (hour < 9 || hour >= 20) {
        return Response.json({ error: 'Consumer sends are limited to 9am–8pm ET to stay inside quiet hours.' }, { status: 400 });
      }
    }

    if (!eligible.length) return Response.json({ error: 'No contacts in this segment have consent for that channel.' }, { status: 400 });

    const existingLink = await base44.asServiceRole.entities.CampaignLink.filter({ code: campaign.link_code }, { limit: 1 });
    if (!(existingLink.items || []).length) {
      await base44.asServiceRole.entities.CampaignLink.create({
        code: campaign.link_code,
        campaign_id: campaign.id,
        destination_url: campaign.destination_url || host,
        label: campaign.name,
        clicks: 0,
      });
    }

    await base44.asServiceRole.entities.MarketingCampaign.update(campaign.id, { status: 'sending', targeted_count: eligible.length });

    const results = [];
    for (let i = 0; i < eligible.length; i += 6) {
      const batch = eligible.slice(i, i + 6);
      const settled = await Promise.allSettled(batch.map((contact) => sendTo(contact.phone)));
      settled.forEach((entry, index) => {
        const contact = batch[index];
        if (entry.status === 'fulfilled') results.push(entry.value);
        else results.push({ to: contact.phone, channel: campaign.channel === 'voice' ? 'voice' : 'sms', ok: false, error: String(entry.reason) });
      });
    }

    const sent = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);

    if (results.length) {
      await base44.asServiceRole.entities.CampaignSend.bulkCreate(results.map((r) => ({
        campaign_id: campaign.id,
        phone: r.to,
        channel: r.channel,
        status: r.ok ? 'sent' : 'failed',
        provider_sid: r.sid || undefined,
        error: r.error || undefined,
        link_code: campaign.link_code,
      })));
    }

    await base44.asServiceRole.entities.MarketingCampaign.update(campaign.id, {
      status: sent.length ? 'sent' : 'failed',
      sent_count: sent.length,
      failed_count: failed.length,
      last_run_at: new Date().toISOString(),
    });

    return Response.json({
      targeted: eligible.length,
      sent: sent.length,
      failed: failed.length,
      errors: failed.slice(0, 3).map((f) => f.error),
      link: linkUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});