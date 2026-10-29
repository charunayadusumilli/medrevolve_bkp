import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// IVR intake endpoint.
// Called by the AWS Lambda that Amazon Connect invokes at the end of the phone menu.
// Authenticated with a shared secret (header `x-connect-secret` or `?secret=`).

const MENU = {
  '1': {
    label: 'New patient — weight loss / GLP-1',
    customer_type: 'B2C Patient',
    primary_interest: 'GLP-1 / Weight Loss',
    priority: 'hot',
  },
  '2': {
    label: 'Existing patient',
    customer_type: 'B2C Patient',
    primary_interest: 'General Wellness',
    priority: 'warm',
  },
  '3': {
    label: 'Operator / B2B partnership',
    customer_type: 'B2B Merchant',
    primary_interest: 'Launch B2B Platform',
    priority: 'hot',
  },
  '4': {
    label: 'Billing',
    customer_type: 'Other',
    primary_interest: 'Other',
    priority: 'warm',
  },
  '0': {
    label: 'Front desk',
    customer_type: 'Other',
    primary_interest: 'Other',
    priority: 'warm',
  },
  timeout: {
    label: 'No menu selection (timeout)',
    customer_type: 'Other',
    primary_interest: 'Other',
    priority: 'warm',
  },
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const url = new URL(req.url);
    const expected = Deno.env.get('AMAZON_CONNECT_WEBHOOK_SECRET');
    const supplied = req.headers.get('x-connect-secret') || url.searchParams.get('secret') || '';
    if (!expected || supplied !== expected) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const phone = String(body.phone ?? '').trim();
    if (!phone) {
      return Response.json({ error: 'phone is required' }, { status: 400 });
    }

    const choice = String(body.menu_choice ?? '').trim();
    const menu = MENU[choice] ?? MENU['0'];
    const contactId = String(body.contact_id ?? '').trim();
    const callerName = String(body.name ?? '').trim() || `Phone caller ${phone}`;
    const note = String(body.summary ?? '').trim();

    const base44 = createClientFromRequest(req);

    const message = note || `Inbound call routed by the phone menu: ${menu.label}.`;

    const lead = await base44.asServiceRole.entities.ContactRequest.create({
      name: callerName,
      phone,
      email: String(body.email ?? '').trim() || undefined,
      subject: `Phone — ${menu.label}`,
      message,
      source: 'amazon_connect',
      priority: menu.priority,
      status: 'new',
      notes: contactId
        ? `Amazon Connect contact ${contactId}. Route to: ${menu.label}.`
        : `Amazon Connect IVR. Route to: ${menu.label}.`,
    });

    return Response.json({
      status: 'ok',
      lead_id: lead.id,
      route: menu.label,
      customer_type: menu.customer_type,
      primary_interest: menu.primary_interest,
      priority: menu.priority,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});