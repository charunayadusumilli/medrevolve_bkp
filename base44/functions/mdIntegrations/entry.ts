import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const MDI_BASE_URL = 'https://api.mdintegrations.com/v1';

// --- Token Cache (in-memory for this instance) ---
let cachedToken = null;
let tokenExpiresAt = null;

async function getAccessToken() {
  const clientId = Deno.env.get('MDI_CLIENT_ID');
  const clientSecret = Deno.env.get('MDI_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('MDI_CLIENT_ID and MDI_CLIENT_SECRET secrets are not configured. Please add them in the dashboard.');
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const res = await fetch(`${MDI_BASE_URL}/partner/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to obtain MD Integrations access token (${res.status})`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // tokens typically expire in 1 hour; use expires_in if provided
  const expiresIn = data.expires_in || 3600;
  tokenExpiresAt = Date.now() + expiresIn * 1000;
  return cachedToken;
}

async function mdiRequest(method, path, body = null, token) {
  const res = await fetch(`${MDI_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `MDI API error: ${res.status}`);
  }
  return data;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, params = {} } = body;

    // Test connectivity only (no real token needed for status check)
    if (action === 'test_connection') {
      const clientId = Deno.env.get('MDI_CLIENT_ID');
      const clientSecret = Deno.env.get('MDI_CLIENT_SECRET');
      if (!clientId || !clientSecret) {
        return Response.json({ connected: false, message: 'Credentials not configured' });
      }
      try {
        const token = await getAccessToken();
        return Response.json({ connected: true, message: 'Successfully connected to MD Integrations', token_preview: token.substring(0, 20) + '...' });
      } catch (e) {
        return Response.json({ connected: false, message: e.message });
      }
    }

    const token = await getAccessToken();

    switch (action) {

      // --- METADATA ---
      case 'get_states': {
        const search = params.search ? `?search=${encodeURIComponent(params.search)}` : '';
        const data = await mdiRequest('GET', `/partner/metadata/states${search}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'get_cities': {
        const { state_id, search } = params;
        if (!state_id) return Response.json({ error: 'state_id required' }, { status: 400 });
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const data = await mdiRequest('GET', `/partner/metadata/states/${state_id}/cities${query}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'get_diseases': {
        const { description, icd, page = 1, per_page = 50 } = params;
        let query = `?page=${page}&per_page=${per_page}`;
        if (description) query += `&description=${encodeURIComponent(description)}`;
        if (icd) query += `&icd=${encodeURIComponent(icd)}`;
        const data = await mdiRequest('GET', `/partner/metadata/diseases${query}`, null, token);
        return Response.json({ success: true, data });
      }

      // --- PATIENTS ---
      case 'create_patient': {
        const data = await mdiRequest('POST', '/partner/patients', params, token);
        return Response.json({ success: true, data });
      }

      case 'get_patient': {
        if (!params.patient_id) return Response.json({ error: 'patient_id required' }, { status: 400 });
        const data = await mdiRequest('GET', `/partner/patients/${params.patient_id}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'list_patients': {
        const { page = 1, per_page = 20, search } = params;
        let query = `?page=${page}&per_page=${per_page}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        const data = await mdiRequest('GET', `/partner/patients${query}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'update_patient': {
        if (!params.patient_id) return Response.json({ error: 'patient_id required' }, { status: 400 });
        const { patient_id, ...updateData } = params;
        const data = await mdiRequest('PUT', `/partner/patients/${patient_id}`, updateData, token);
        return Response.json({ success: true, data });
      }

      // --- CASES ---
      case 'create_case': {
        const data = await mdiRequest('POST', '/partner/cases', params, token);
        return Response.json({ success: true, data });
      }

      case 'get_case': {
        if (!params.case_id) return Response.json({ error: 'case_id required' }, { status: 400 });
        const data = await mdiRequest('GET', `/partner/cases/${params.case_id}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'list_cases': {
        const { page = 1, per_page = 20, status } = params;
        let query = `?page=${page}&per_page=${per_page}`;
        if (status) query += `&status=${encodeURIComponent(status)}`;
        const data = await mdiRequest('GET', `/partner/cases${query}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'update_case': {
        if (!params.case_id) return Response.json({ error: 'case_id required' }, { status: 400 });
        const { case_id, ...updateData } = params;
        const data = await mdiRequest('PUT', `/partner/cases/${case_id}`, updateData, token);
        return Response.json({ success: true, data });
      }

      // --- PRESCRIPTIONS ---
      case 'list_prescriptions': {
        const { case_id, page = 1, per_page = 20 } = params;
        if (!case_id) return Response.json({ error: 'case_id required' }, { status: 400 });
        const data = await mdiRequest('GET', `/partner/cases/${case_id}/prescriptions?page=${page}&per_page=${per_page}`, null, token);
        return Response.json({ success: true, data });
      }

      case 'create_prescription': {
        if (!params.case_id) return Response.json({ error: 'case_id required' }, { status: 400 });
        const { case_id, ...rxData } = params;
        const data = await mdiRequest('POST', `/partner/cases/${case_id}/prescriptions`, rxData, token);
        return Response.json({ success: true, data });
      }

      // --- MEDICATIONS ---
      case 'search_medications': {
        const { search, page = 1, per_page = 20 } = params;
        let query = `?page=${page}&per_page=${per_page}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        const data = await mdiRequest('GET', `/partner/medications${query}`, null, token);
        return Response.json({ success: true, data });
      }

      // --- PARTNER INFO ---
      case 'get_partner': {
        const data = await mdiRequest('GET', '/partner', null, token);
        return Response.json({ success: true, data });
      }

      default:
        return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error('[MDI Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});