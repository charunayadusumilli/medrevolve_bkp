/**
 * Trigger CRM Campaign for a ContactRequest lead:
 * 1. Create/update HubSpot contact with phone
 * 2. Create a HubSpot deal in the pipeline
 * 3. Send a personalized Gmail outreach to book a meeting
 * 4. Create a Google Calendar event invite (optional, if time provided)
 * 5. Update ContactRequest with deal ID + campaign_sent flag
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CALENDLY_LINK = 'https://calendly.com/medrevolve/consultation';
const ADMIN_EMAIL = 'rned@medrevolve.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { contact_request_id, meeting_time } = body;

    if (!contact_request_id) {
      return Response.json({ error: 'contact_request_id required' }, { status: 400 });
    }

    // Load the contact request
    const requests = await base44.asServiceRole.entities.ContactRequest.filter({ id: contact_request_id });
    const cr = requests[0];
    if (!cr) return Response.json({ error: 'Contact request not found' }, { status: 404 });

    const { accessToken: hubspotToken } = await base44.asServiceRole.connectors.getConnection('hubspot');
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const { accessToken: calendarToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const nameParts = (cr.name || '').split(' ');
    const firstName = nameParts[0] || 'there';

    // ── 1. Upsert HubSpot contact ──────────────────────────
    const contactProps = {
      email: cr.email,
      firstname: nameParts[0] || '',
      lastname: nameParts.slice(1).join(' ') || '',
      phone: cr.phone || '',
      hs_lead_status: 'IN_PROGRESS',
      lifecyclestage: 'lead',
      notes_last_contacted: new Date().toISOString(),
    };

    // Search for existing contact
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: cr.email }] }],
        limit: 1,
      }),
    });
    const searchData = await searchRes.json();

    let hubspotContactId;
    if (searchData.total > 0) {
      hubspotContactId = searchData.results[0].id;
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${hubspotContactId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: contactProps }),
      });
    } else {
      const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: contactProps }),
      });
      const created = await createRes.json();
      hubspotContactId = created.id;
    }
    console.log(`✅ HubSpot contact: ${hubspotContactId}`);

    // ── 2. Create HubSpot Deal ─────────────────────────────
    const dealRes = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          dealname: `${cr.name} — ${cr.subject || cr.source || 'MedRevolve Inquiry'}`,
          dealstage: 'appointmentscheduled',
          pipeline: 'default',
          closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: cr.message?.substring(0, 500) || '',
          hs_lead_status: 'IN_PROGRESS',
        },
      }),
    });
    const deal = await dealRes.json();
    const dealId = deal.id;

    // Associate deal with contact
    if (hubspotContactId && dealId) {
      await fetch(`https://api.hubapi.com/crm/v3/associations/deal/contact/batch/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: [{ from: { id: dealId }, to: { id: hubspotContactId }, type: 'deal_to_contact' }]
        }),
      });
    }
    console.log(`✅ HubSpot deal created: ${dealId}`);

    // ── 3. Send Gmail outreach email ───────────────────────
    const sourceLabel = cr.source === 'ctm_call' ? 'your recent call' :
                        cr.source === 'ctm_text' ? 'your recent message' :
                        'your recent inquiry';

    const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="color:#fff;font-size:24px;font-weight:800;">MedRevolve</div>
    <div style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:4px;">White-Label Telehealth & Wellness Platform</div>
  </td></tr>
  <tr><td style="background:#fff;padding:32px 40px;">
    <p style="font-size:17px;color:#111;margin:0 0 16px;">Hi <strong>${firstName}</strong> 👋</p>
    <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 16px;">
      Thank you for ${sourceLabel}. I'm personally following up to make sure we connect and explore how MedRevolve can support your goals.
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">
      We specialize in helping wellness businesses and clinics launch <strong>white-label telehealth platforms</strong>, GLP-1 programs, and compliant clinical infrastructure — often in as little as 7 days.
    </p>
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="font-size:14px;font-weight:700;color:#166534;margin:0 0 8px;">📅 Schedule a Free 30-Min Consultation</p>
      <p style="font-size:13px;color:#374151;margin:0 0 16px;">We'll cover your specific use case, timeline, and pricing — no commitment required.</p>
      <a href="${CALENDLY_LINK}" style="display:inline-block;background:#4A6741;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">Book a Meeting →</a>
    </div>
    <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0;">
      Or reply directly to this email — I check it regularly and will get back to you within a few hours.
    </p>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
    <p style="color:#fff;font-size:13px;font-weight:700;margin:0 0 4px;">r ned — MedRevolve</p>
    <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">rned@medrevolve.com &nbsp;·&nbsp; medrevolve.com</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;

    const emailLines = [
      `From: r ned <${ADMIN_EMAIL}>`,
      `To: ${cr.email}`,
      `Subject: Following up on ${sourceLabel} — let's book a call 📅`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      emailHtml,
    ];
    const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${gmailToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    const gmailData = await gmailRes.json();
    if (!gmailRes.ok) console.error('Gmail send error:', JSON.stringify(gmailData));
    else console.log(`✅ Campaign email sent to ${cr.email}`);

    // ── 4. Create Google Calendar event (if meeting_time provided) ─
    let meetingLink = CALENDLY_LINK;
    if (meeting_time && calendarToken) {
      const startTime = new Date(meeting_time);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      const eventRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: { Authorization: `Bearer ${calendarToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `MedRevolve Consultation — ${cr.name}`,
          description: `Lead from: ${cr.source}\nPhone: ${cr.phone || 'N/A'}\nEmail: ${cr.email}\n\n${cr.message?.substring(0, 300) || ''}`,
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
          attendees: [
            { email: ADMIN_EMAIL },
            ...(cr.email && !cr.email.includes('@ctm.noemail') ? [{ email: cr.email }] : []),
          ],
          conferenceData: {
            createRequest: { requestId: `medrevolve-${contact_request_id}`, conferenceSolutionKey: { type: 'hangoutsMeet' } }
          },
          reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 60 }, { method: 'popup', minutes: 15 }] },
        }),
      });
      const event = await eventRes.json();
      if (event.htmlLink) {
        meetingLink = event.hangoutLink || event.htmlLink;
        console.log(`✅ Google Calendar event created: ${event.htmlLink}`);
      }
    }

    // ── 5. Update ContactRequest ───────────────────────────
    await base44.asServiceRole.entities.ContactRequest.update(contact_request_id, {
      hubspot_contact_id: hubspotContactId || null,
      hubspot_deal_id: dealId || null,
      campaign_sent: true,
      meeting_link: meetingLink,
      status: meeting_time ? 'meeting_scheduled' : 'in_progress',
    });

    console.log(`✅ CRM campaign complete for ${cr.name} (${cr.email})`);

    return Response.json({
      success: true,
      hubspot_contact_id: hubspotContactId,
      hubspot_deal_id: dealId,
      campaign_email_sent: gmailRes.ok,
      meeting_link: meetingLink,
    });

  } catch (error) {
    console.error('CRM campaign error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});