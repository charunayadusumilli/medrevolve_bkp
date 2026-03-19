import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * belugaGetPatient
 * Fetches a patient record from Beluga Health by email or belugaPatientId.
 * Falls back gracefully if Beluga isn't configured.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { patientEmail, belugaPatientId } = await req.json();

    if (!patientEmail && !belugaPatientId) {
      return Response.json({ error: 'patientEmail or belugaPatientId required' }, { status: 400 });
    }

    const BELUGA_API_KEY = Deno.env.get('BELUGA_API_KEY');
    const BELUGA_PARTNER_ID = Deno.env.get('BELUGA_PARTNER_ID');

    if (!BELUGA_API_KEY || !BELUGA_PARTNER_ID) {
      // Return whitelabel patient data instead
      const email = patientEmail || user.email;
      const intakes = await base44.asServiceRole.entities.CustomerIntake.filter({ email }, '-created_date', 1);
      const visitLogs = await base44.asServiceRole.entities.BelugaVisitLog.filter({ patient_email: email }, '-created_date', 10);

      return Response.json({
        mode: 'whitelabel',
        patient: intakes[0] || null,
        visitHistory: visitLogs,
        belugaConfigured: false
      });
    }

    // Fetch from Beluga
    const endpoint = belugaPatientId
      ? `https://api.belugahealth.com/v1/patients/${belugaPatientId}`
      : `https://api.belugahealth.com/v1/patients?email=${encodeURIComponent(patientEmail)}`;

    const res = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${BELUGA_API_KEY}`,
        'X-Partner-ID': BELUGA_PARTNER_ID
      }
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Beluga getPatient error:', res.status, err);
      return Response.json({ error: `Beluga error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return Response.json({ mode: 'beluga', patient: data, belugaConfigured: true });

  } catch (error) {
    console.error('belugaGetPatient error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});