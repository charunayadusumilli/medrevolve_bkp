/**
 * MedRevolve IVR bridge — AWS Lambda (Node.js 20.x, ESM).
 *
 * Amazon Connect invokes this function from the "Log Call To MedRevolve" block in the
 * contact flow. It forwards the caller's number and menu selection to the MedRevolve
 * intake endpoint, which creates the lead record.
 *
 * Environment variables to set on the Lambda:
 *   MEDREVOLVE_INTAKE_URL   https://medi-revolve-care.base44.app/functions/amazonConnectIntake
 *   MEDREVOLVE_SHARED_SECRET  the AMAZON_CONNECT_WEBHOOK_SECRET value from Base44
 *
 * Handler signature: index.handler  (file: index.mjs)
 */

export const handler = async (event) => {
  const contactData = event?.Details?.ContactData ?? {};
  const params = event?.Details?.Parameters ?? {};

  const phone = contactData.CustomerEndpoint?.Address ?? params.phone ?? '';
  const menuChoice = params.menu_choice ?? contactData.Attributes?.menu_choice ?? '';
  const contactId = contactData.ContactId ?? '';
  const summary = params.summary ?? '';

  const intakeUrl = process.env.MEDREVOLVE_INTAKE_URL;
  const secret = process.env.MEDREVOLVE_SHARED_SECRET;

  if (!intakeUrl || !secret) {
    console.error('Missing MEDREVOLVE_INTAKE_URL or MEDREVOLVE_SHARED_SECRET');
    return { status: 'error', reason: 'lambda_not_configured' };
  }

  try {
    const res = await fetch(intakeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-connect-secret': secret,
      },
      body: JSON.stringify({
        phone,
        menu_choice: menuChoice,
        contact_id: contactId,
        summary,
      }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('Intake rejected', res.status, data);
      return { status: 'error', reason: `http_${res.status}` };
    }

    // Returned to the contact flow as $LEX / lambda result attributes if you wire them up.
    return {
      status: 'ok',
      lead_id: data.lead_id ?? '',
      route: data.route ?? '',
    };
  } catch (err) {
    console.error('Intake call failed', err);
    return { status: 'error', reason: 'intake_unreachable' };
  }
};
