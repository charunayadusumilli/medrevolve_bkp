import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hubspot');

    const body = await req.json();
    const { source, data } = body;

    // Build contact properties based on source
    let contactProps = {};

    if (source === 'customer_intake') {
      const nameParts = (data.full_name || '').split(' ');
      contactProps = {
        email: data.email,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        phone: data.phone || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip_code || '',
        address: data.address || '',
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        jobtitle: data.primary_interest || '',
        website: 'medrevolve.com',
        hs_analytics_source: 'SOCIAL_MEDIA',
      };
    } else if (source === 'business_inquiry') {
      const nameParts = (data.contact_name || '').split(' ');
      contactProps = {
        email: data.email,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        phone: data.phone || '',
        company: data.company_name || '',
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        description: `MedRevolve Business Inquiry | Industry: ${data.industry || ''} | Interest: ${data.interest_type || ''} | Company Size: ${data.company_size || ''} | Message: ${data.message || ''}`,
      };
    } else if (source === 'creator_application') {
      const nameParts = (data.full_name || '').split(' ');
      contactProps = {
        email: data.email,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        phone: data.phone || '',
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        description: `MedRevolve Creator Application | Platform: ${data.platform || ''} | Handle: ${data.platform_handle || ''} | Followers: ${data.followers_count || ''} | Niche: ${data.audience_niche || ''} | Why Partner: ${data.why_partner || ''}`,
      };
    } else if (source === 'provider_intake') {
      const nameParts = (data.full_name || '').split(' ');
      contactProps = {
        email: data.email,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || '',
        phone: data.phone || '',
        jobtitle: `${data.title || ''} - ${data.specialty || ''}`,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        description: `MedRevolve Provider Application | Title: ${data.title || ''} | Specialty: ${data.specialty || ''} | License: ${data.license_number || ''} | States: ${(data.states_licensed || []).join(', ')} | Years Exp: ${data.years_experience || ''} | Practice: ${data.practice_type || ''}`,
      };
    } else {
      return Response.json({ error: 'Unknown source' }, { status: 400 });
    }

    // Check if contact already exists
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{ propertyName: 'email', operator: 'EQ', value: contactProps.email }]
        }],
        limit: 1,
      }),
    });
    const searchData = await searchRes.json();

    let result;
    if (searchData.total > 0) {
      // Update existing contact
      const contactId = searchData.results[0].id;
      const updateRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: contactProps }),
      });
      result = await updateRes.json();
      console.log(`Updated HubSpot contact ${contactId} for ${source}:`, JSON.stringify(result));
    } else {
      // Create new contact
      const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: contactProps }),
      });
      result = await createRes.json();
      console.log(`HubSpot create response for ${source}:`, JSON.stringify(result));
    }

    if (result.status === 'error' || result.message) {
      console.error('HubSpot API error:', JSON.stringify(result));
      return Response.json({ error: result.message, details: result }, { status: 400 });
    }

    return Response.json({ success: true, hubspot_id: result.id });
  } catch (error) {
    console.error('HubSpot sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});