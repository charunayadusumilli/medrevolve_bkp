import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Instagram access token from connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Get Instagram user info
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      return Response.json({ connected: false, error: error.message });
    }

    const userData = await response.json();

    return Response.json({ 
      connected: true, 
      user: {
        id: userData.id,
        username: userData.username
      }
    });

  } catch (error) {
    console.error('Error checking Instagram connection:', error);
    return Response.json({ connected: false, error: error.message });
  }
});