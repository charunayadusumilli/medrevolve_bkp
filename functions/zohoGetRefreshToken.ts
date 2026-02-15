import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { code } = await req.json();

    if (!code) {
      return Response.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    const clientId = Deno.env.get('ZOHO_CLIENT_ID');
    const clientSecret = Deno.env.get('ZOHO_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return Response.json({ error: 'ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET must be set' }, { status: 500 });
    }

    // Exchange code for tokens
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    const params = new URLSearchParams({
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'https://www.zoho.com',
      grant_type: 'authorization_code'
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Zoho token exchange error:', data);
      return Response.json({ 
        error: 'Failed to get refresh token',
        details: data 
      }, { status: 500 });
    }

    console.log('✅ Zoho refresh token obtained successfully');

    return Response.json({
      success: true,
      refresh_token: data.refresh_token,
      access_token: data.access_token,
      expires_in: data.expires_in,
      message: 'Copy this refresh_token and set it as ZOHO_REFRESH_TOKEN secret'
    });

  } catch (error) {
    console.error('Error getting Zoho refresh token:', error);
    return Response.json({ 
      error: error.message || 'Failed to get refresh token' 
    }, { status: 500 });
  }
});