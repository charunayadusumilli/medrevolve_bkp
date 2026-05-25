import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, email, phone, dateOfBirth, address } = await req.json();

    if (!email || !firstName || !lastName) {
      return Response.json({ error: 'First name, last name, and email are required' }, { status: 400 });
    }

    // Get ID.me credentials from secrets
    const clientId = Deno.env.get('IDME_CLIENT_ID');
    const clientSecret = Deno.env.get('IDME_CLIENT_SECRET');
    const redirectUri = Deno.env.get('IDME_REDIRECT_URI') || 'https://medrevolve.com/identity-verified';

    if (!clientId || !clientSecret) {
      return Response.json({ 
        error: 'ID.me not configured. Set IDME_CLIENT_ID and IDME_CLIENT_SECRET secrets' 
      }, { status: 500 });
    }

    // For sandbox/testing, we'll simulate verification
    // In production, you'd redirect to ID.me OAuth flow
    const isSandbox = Deno.env.get('IDME_SANDBOX') === 'true';

    if (isSandbox) {
      // Sandbox mode - simulate verification
      console.log('🔐 [ID.me Sandbox] Verifying identity for:', email);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return mock verified identity
      return Response.json({
        success: true,
        verification_id: `idme_sandbox_${Date.now()}`,
        status: 'verified',
        confidence: 'high',
        verified_at: new Date().toISOString(),
        attributes: {
          email: email,
          email_verified: true,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          phone_verified: false,
          dob: dateOfBirth || null,
          address: address || null
        },
        sandbox: true,
        message: 'Sandbox verification successful. In production, user would be redirected to ID.me for real verification.'
      });
    }

    // Production flow - generate OAuth URL
    const authUrl = `https://api.id.me/oauth2/v1/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email+phone+birthdate+address&state=${user.email}`;

    return Response.json({
      success: true,
      auth_url: authUrl,
      message: 'Redirect user to auth_url to complete identity verification with ID.me'
    });

  } catch (error) {
    console.error('ID.me verification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});