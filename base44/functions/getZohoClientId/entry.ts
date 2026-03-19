import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const clientId = Deno.env.get('ZOHO_CLIENT_ID');
    
    if (!clientId) {
      return Response.json({ error: 'ZOHO_CLIENT_ID not set' }, { status: 500 });
    }

    // Client ID is not secret in OAuth - it's meant to be public
    return Response.json({ client_id: clientId });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});