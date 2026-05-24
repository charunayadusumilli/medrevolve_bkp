import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This is an admin-only function
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('[INFO] Attempting to reset Instagram connector token...');
    
    // The issue is that the stored token is corrupted
    // Recommendation: Re-authorize through the dashboard OAuth flow
    // For now, log the issue and return instructions
    
    return Response.json({
      success: false,
      message: 'Instagram token is corrupted and requires fresh authorization',
      action: 'Please re-authorize Instagram through the app dashboard OAuth settings',
      status: 'token_corrupted',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking Instagram token:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});