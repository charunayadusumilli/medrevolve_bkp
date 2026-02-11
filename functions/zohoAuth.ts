import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Helper function to get Zoho access token
export async function getZohoAccessToken() {
  const clientId = Deno.env.get("ZOHO_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_REFRESH_TOKEN");
  const domain = Deno.env.get("ZOHO_DOMAIN") || "zoho.com";

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Zoho credentials. Please set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN");
  }

  const tokenUrl = `https://accounts.${domain}/oauth/v2/token`;
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token"
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zoho auth failed: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const token = await getZohoAccessToken();
    
    return Response.json({ 
      success: true,
      token: token.substring(0, 10) + "...",
      message: "Zoho authentication successful"
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});