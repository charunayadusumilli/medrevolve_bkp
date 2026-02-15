import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { 
      recordType, // 'lead', 'contact', 'deal'
      data,
      entityName, // which entity triggered this
      entityId 
    } = await req.json();

    if (!recordType || !data) {
      return Response.json({ error: 'recordType and data are required' }, { status: 400 });
    }

    // Get Zoho credentials
    const clientId = Deno.env.get('ZOHO_CLIENT_ID');
    const clientSecret = Deno.env.get('ZOHO_CLIENT_SECRET');
    const refreshToken = Deno.env.get('ZOHO_REFRESH_TOKEN');
    const domain = Deno.env.get('ZOHO_DOMAIN') || 'https://www.zohoapis.com';

    if (!clientId || !clientSecret || !refreshToken) {
      return Response.json({ 
        error: 'Zoho CRM not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN' 
      }, { status: 500 });
    }

    // Step 1: Get fresh access token
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    const tokenParams = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    });

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams}`, {
      method: 'POST'
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Zoho token error:', tokenData);
      return Response.json({ 
        error: 'Failed to get Zoho access token',
        details: tokenData.error 
      }, { status: 500 });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Map data to Zoho format
    let zohoData;
    const moduleName = recordType.charAt(0).toUpperCase() + recordType.slice(1) + 's';

    if (recordType === 'lead') {
      zohoData = {
        Company: data.company_name || data.pharmacy_name || 'Individual',
        Last_Name: data.full_name || data.contact_name,
        Email: data.email,
        Phone: data.phone,
        Lead_Source: data.heard_about_us || 'Website',
        Description: data.why_partner || data.partnership_interest || data.message || '',
        Lead_Status: 'New'
      };
    } else if (recordType === 'contact') {
      zohoData = {
        Last_Name: data.full_name || data.contact_name,
        Email: data.email,
        Phone: data.phone,
        Description: data.bio || data.medical_history_notes || ''
      };
    }

    // Step 3: Create/Update in Zoho CRM
    const zohoUrl = `${domain}/crm/v2/${moduleName}`;
    
    const zohoResponse = await fetch(zohoUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [zohoData],
        trigger: ['workflow']
      })
    });

    const zohoResult = await zohoResponse.json();

    if (!zohoResponse.ok) {
      console.error('Zoho CRM error:', zohoResult);
      return Response.json({ 
        error: 'Failed to sync to Zoho CRM',
        details: zohoResult 
      }, { status: 500 });
    }

    console.log('✅ Synced to Zoho CRM:', zohoResult.data?.[0]?.details);

    // Step 4: Update entity with Zoho ID
    if (entityName && entityId && zohoResult.data?.[0]?.details?.id) {
      try {
        await base44.asServiceRole.entities[entityName].update(entityId, {
          zoho_id: zohoResult.data[0].details.id,
          zoho_synced_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not update entity with Zoho ID:', err);
      }
    }

    return Response.json({
      success: true,
      zoho_id: zohoResult.data?.[0]?.details?.id,
      zoho_status: zohoResult.data?.[0]?.status
    });

  } catch (error) {
    console.error('Error syncing to Zoho CRM:', error);
    return Response.json({ 
      error: error.message || 'Failed to sync to Zoho CRM' 
    }, { status: 500 });
  }
});