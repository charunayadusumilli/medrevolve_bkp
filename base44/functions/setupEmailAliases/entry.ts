/**
 * setupEmailAliases — Registers department send-as aliases on the connected Gmail account.
 * Gmail API can add send-as addresses; the account owner (rned@medrevolve.com) will receive
 * all mail sent TO these aliases (when configured as routing in Google Workspace Admin).
 * This function registers them as "send-as" aliases so outbound replies can use them.
 * 
 * NOTE: For actual inbound routing (support@, payments@, etc. → rned + noel), 
 * that requires Google Workspace Admin Console → Apps → Gmail → Routing → 
 * Add a catch-all or alias routing rule. This function handles the send-as side.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ALIASES = [
  { email: 'support@medrevolve.com',      name: 'MedRevolve Support',         replyTo: 'support@medrevolve.com' },
  { email: 'info@medrevolve.com',          name: 'MedRevolve Info',            replyTo: 'info@medrevolve.com' },
  { email: 'partnerships@medrevolve.com',  name: 'MedRevolve Partnerships',    replyTo: 'partnerships@medrevolve.com' },
  { email: 'payments@medrevolve.com',      name: 'MedRevolve Payments',        replyTo: 'payments@medrevolve.com' },
  { email: 'providers@medrevolve.com',     name: 'MedRevolve Provider Network',replyTo: 'providers@medrevolve.com' },
  { email: 'pharmacy@medrevolve.com',      name: 'MedRevolve Pharmacy',        replyTo: 'pharmacy@medrevolve.com' },
  { email: 'compliance@medrevolve.com',    name: 'MedRevolve Compliance',      replyTo: 'compliance@medrevolve.com' },
  { email: 'merchants@medrevolve.com',     name: 'MedRevolve Merchants',       replyTo: 'merchants@medrevolve.com' },
  { email: 'creators@medrevolve.com',      name: 'MedRevolve Creator Program', replyTo: 'creators@medrevolve.com' },
  { email: 'billing@medrevolve.com',       name: 'MedRevolve Billing',         replyTo: 'billing@medrevolve.com' },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // Get existing send-as aliases
    const existingRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs', { headers });
    const existingData = await existingRes.json();
    const existingEmails = new Set((existingData.sendAs || []).map(a => a.sendAsEmail));
    console.log(`Existing send-as aliases: ${[...existingEmails].join(', ')}`);

    const results = [];

    for (const alias of ALIASES) {
      if (existingEmails.has(alias.email)) {
        console.log(`✅ Already exists: ${alias.email}`);
        results.push({ email: alias.email, status: 'already_exists' });
        continue;
      }

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sendAsEmail: alias.email,
          displayName: alias.name,
          replyToAddress: alias.replyTo,
          isDefault: false,
          treatAsAlias: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`✅ Created send-as: ${alias.email} (verification may be required)`);
        results.push({ email: alias.email, status: 'created', verificationStatus: data.verificationStatus });
      } else {
        console.error(`❌ Failed: ${alias.email}`, JSON.stringify(data));
        results.push({ email: alias.email, status: 'failed', error: data.error?.message });
      }
    }

    return Response.json({
      success: true,
      results,
      note: 'For inbound routing (support@, payments@ etc → rned + noel), configure Google Workspace Admin → Apps → Gmail → Default routing → Add recipient route for each alias.',
      aliases_summary: ALIASES.map(a => a.email),
    });

  } catch (error) {
    console.error('setupEmailAliases error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});