import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * merchantOnboardingWorkflow
 * Entity automation handler for Partner entity (create/update)
 * - Sends Gmail notification to admin
 * - Syncs to HubSpot as opportunity
 * - Creates a HubSpot deal for merchant onboardings
 * - Triggers analytics tracking
 */

const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'rned@medrevolve.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { event, data, old_data } = body;

    if (!data) {
      return Response.json({ skipped: true, reason: 'No data in payload' });
    }

    const isCreate = event?.type === 'create';
    const isStatusChange = event?.type === 'update' && old_data?.status !== data?.status;

    // Only process on create or status change
    if (!isCreate && !isStatusChange) {
      return Response.json({ skipped: true, reason: 'No relevant change' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hubspot');
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // ── Gmail notification ───────────────────────────────────────────────────
    const isNew = isCreate;
    const subject = isNew
      ? `🚀 New Merchant Onboarding — ${data.business_name || data.contact_name}`
      : `🔄 Merchant Status Update — ${data.business_name || data.contact_name} → ${data.status}`;

    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0a0a0a;padding:16px 24px;border-radius:8px 8px 0 0;">
    <p style="color:#fff;margin:0;font-size:15px;font-weight:800;">MEDREVOLVE — Merchant ${isNew ? 'Onboarding' : 'Update'}</p>
    <p style="color:rgba(255,255,255,0.4);margin:2px 0 0;font-size:10px;letter-spacing:0.1em;">${now} ET</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:20px 24px;">
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr style="background:#f9fafb;"><td style="padding:7px 12px;color:#6b7280;">Business</td><td style="padding:7px 12px;font-weight:700;">${data.business_name || '—'}</td></tr>
      <tr><td style="padding:7px 12px;color:#6b7280;">Contact</td><td style="padding:7px 12px;">${data.contact_name || '—'}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:7px 12px;color:#6b7280;">Email</td><td style="padding:7px 12px;">${data.email || '—'}</td></tr>
      <tr><td style="padding:7px 12px;color:#6b7280;">Phone</td><td style="padding:7px 12px;">${data.phone || '—'}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:7px 12px;color:#6b7280;">Status</td><td style="padding:7px 12px;font-weight:700;color:#16a34a;">${data.status || '—'}</td></tr>
      <tr><td style="padding:7px 12px;color:#6b7280;">Niche</td><td style="padding:7px 12px;">${data.niche || '—'}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:7px 12px;color:#6b7280;">LLC Needed</td><td style="padding:7px 12px;">${data.llc_needed ? 'Yes' : 'No'}</td></tr>
      <tr><td style="padding:7px 12px;color:#6b7280;">Monthly Fee</td><td style="padding:7px 12px;font-weight:700;">$${data.monthly_fee || '0'}/mo</td></tr>
    </table>
    <div style="margin-top:16px;">
      <a href="https://medrevolve.com/merchant-dashboard" style="display:inline-block;background:#0a0a0a;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">Open Merchant Dashboard →</a>
    </div>
  </div>
</div>`;

    // Send Gmail notification (non-blocking)
    base44.asServiceRole.functions.invoke('sendGmailNotification', {
      to: ADMIN_EMAIL,
      subject,
      html,
      event_type: isNew ? 'merchant_onboarding' : 'merchant_status_update',
    }).catch(e => console.error('Gmail notification failed:', e.message));

    // ── HubSpot sync ─────────────────────────────────────────────────────────
    if (data.email) {
      const nameParts = (data.contact_name || '').split(' ');
      const contactProps = {
        email: data.email,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        phone: data.phone || '',
        company: data.business_name || '',
        hs_lead_status: isNew ? 'NEW' : 'IN_PROGRESS',
        lifecyclestage: 'opportunity',
        website: 'medrevolve.com',
      };

      // Upsert contact
      const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: data.email }] }],
          limit: 1,
        }),
      });
      const searchData = await searchRes.json();

      let contactId;
      if (searchData.total > 0) {
        contactId = searchData.results[0].id;
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties: contactProps }),
        });
        console.log(`✅ HubSpot: updated contact ${contactId}`);
      } else {
        const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties: contactProps }),
        });
        const created = await createRes.json();
        contactId = created.id;
        console.log(`✅ HubSpot: created contact ${contactId}`);
      }

      // Create a deal for new merchant onboardings
      if (isNew && contactId) {
        const dealRes = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            properties: {
              dealname: `Merchant — ${data.business_name || data.contact_name}`,
              dealstage: 'appointmentscheduled',
              pipeline: 'default',
              amount: String((data.monthly_fee || 0) * 12), // annual value
              closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
          }),
        });
        const deal = await dealRes.json();
        if (deal.id && contactId) {
          // Associate deal with contact
          await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${deal.id}/associations/contacts/${contactId}/deal_to_contact`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log(`✅ HubSpot: created deal ${deal.id} associated with contact ${contactId}`);
        }
      }
    }

    // ── Track in analytics ───────────────────────────────────────────────────
    base44.asServiceRole.entities.Analytics.create({
      event_type: isNew ? 'merchant_onboarding' : 'merchant_status_change',
      page_name: 'Partner',
      action: event?.type,
      user_email: data.email || null,
      session_id: 'server',
      referrer: 'entity_automation',
      user_agent: 'server',
      metadata: { business_name: data.business_name, status: data.status, monthly_fee: data.monthly_fee },
    }).catch(e => console.error('Analytics write failed:', e.message));

    return Response.json({ success: true, event: event?.type });
  } catch (error) {
    console.error('merchantOnboardingWorkflow error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});