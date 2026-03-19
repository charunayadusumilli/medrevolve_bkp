import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * belugaSubmitVisit
 * Submits a patient visit to Beluga Health API, or handles it in whitelabel mode.
 * 
 * Payload:
 *   patientEmail        - patient email
 *   visitTypeKey        - our internal visit type key
 *   intakeAnswers       - object of question answers
 *   prescriptionId      - (optional) link to prescription
 *   appointmentId       - (optional) link to appointment
 *   patientProfile      - { first_name, last_name, dob, phone, address, city, state, zip, gender }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth check - allow admin or user context (called by backend too)
    let callerIsAdmin = false;
    try {
      const user = await base44.auth.me();
      callerIsAdmin = user?.role === 'admin';
    } catch {
      // Called from backend automation - proceed with service role
    }

    const {
      patientEmail,
      visitTypeKey,
      intakeAnswers = {},
      prescriptionId,
      appointmentId,
      patientProfile = {}
    } = await req.json();

    if (!patientEmail || !visitTypeKey) {
      return Response.json({ error: 'patientEmail and visitTypeKey are required' }, { status: 400 });
    }

    // Load visit type config
    const visitTypes = await base44.asServiceRole.entities.BelugaVisitType.filter({ visit_type_key: visitTypeKey, is_active: true });
    if (!visitTypes.length) {
      return Response.json({ error: `Visit type '${visitTypeKey}' not found or inactive` }, { status: 404 });
    }
    const visitType = visitTypes[0];

    const BELUGA_API_KEY = Deno.env.get('BELUGA_API_KEY');
    const BELUGA_PARTNER_ID = Deno.env.get('BELUGA_PARTNER_ID');
    const usesBeluga = visitType.beluga_enabled && BELUGA_API_KEY && BELUGA_PARTNER_ID;

    let logData = {
      patient_email: patientEmail,
      visit_type_key: visitTypeKey,
      beluga_visit_type: visitType.beluga_visit_type || visitType.display_name,
      submission_mode: usesBeluga ? 'beluga' : 'whitelabel',
      status: 'pending',
      intake_answers: intakeAnswers,
      prescription_id: prescriptionId || null,
      appointment_id: appointmentId || null,
      submitted_at: new Date().toISOString()
    };

    let result = {};

    if (usesBeluga) {
      // ── BELUGA API SUBMISSION ────────────────────────────────────────────
      console.log(`Submitting to Beluga Health API: visit_type=${visitType.beluga_visit_type}, patient=${patientEmail}`);

      // Build Beluga patient object
      const nameParts = (patientProfile.full_name || '').split(' ');
      const belugaPatient = {
        firstName: patientProfile.first_name || nameParts[0] || '',
        lastName: patientProfile.last_name || nameParts.slice(1).join(' ') || '',
        dateOfBirth: patientProfile.dob || '',
        phone: patientProfile.phone || '',
        email: patientEmail,
        address: {
          line1: patientProfile.address || '',
          city: patientProfile.city || '',
          state: patientProfile.state || '',
          zipCode: patientProfile.zip || ''
        },
        gender: patientProfile.gender || 'unknown'
      };

      // Submit to Beluga
      const belugaRes = await fetch('https://api.belugahealth.com/v1/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BELUGA_API_KEY}`,
          'X-Partner-ID': BELUGA_PARTNER_ID
        },
        body: JSON.stringify({
          visitType: visitType.beluga_visit_type,
          patient: belugaPatient,
          intakeAnswers,
          metadata: {
            internalPrescriptionId: prescriptionId,
            internalAppointmentId: appointmentId,
            platform: 'MedRevolve'
          }
        })
      });

      const belugaData = await belugaRes.json();
      logData.response_payload = belugaData;

      if (belugaRes.ok) {
        logData.status = 'submitted';
        logData.beluga_visit_id = belugaData.visitId || belugaData.id || null;
        logData.beluga_patient_id = belugaData.patientId || null;
        result = {
          mode: 'beluga',
          belugaVisitId: logData.beluga_visit_id,
          belugaPatientId: logData.beluga_patient_id,
          status: 'submitted'
        };
        console.log('Beluga submission successful:', belugaData);
      } else {
        console.error('Beluga API error:', belugaRes.status, belugaData);
        logData.status = 'error';
        logData.error_message = belugaData.message || belugaData.error || `Beluga API error ${belugaRes.status}`;
        // Fall through to whitelabel handling
        result = { mode: 'beluga_error', error: logData.error_message, status: 'error' };
      }

    } else {
      // ── WHITELABEL MODE ──────────────────────────────────────────────────
      console.log(`Whitelabel visit submission: type=${visitTypeKey}, patient=${patientEmail}`);

      // Create an internal appointment/consultation record if no appointmentId given
      if (!appointmentId) {
        const appt = await base44.asServiceRole.entities.Appointment.create({
          patient_email: patientEmail,
          appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +24h placeholder
          type: 'initial_consultation',
          reason: visitType.display_name,
          notes: JSON.stringify(intakeAnswers),
          status: 'pending'
        });
        logData.appointment_id = appt.id;
      }

      logData.status = 'submitted';
      result = {
        mode: 'whitelabel',
        appointmentId: logData.appointment_id || appointmentId,
        status: 'submitted'
      };

      // Notify admin of new visit submission
      const adminEmail = Deno.env.get('ADMIN_EMAIL');
      if (adminEmail) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Clinical',
          to: adminEmail,
          subject: `🏥 New Visit Request: ${visitType.display_name} — ${patientEmail}`,
          body: `A new patient visit has been submitted via the whitelabel platform.

Visit Type: ${visitType.display_name} (${visitType.category})
Patient: ${patientEmail}
Mode: Whitelabel (Beluga integration not yet active)

Intake Answers:
${Object.entries(intakeAnswers).map(([k, v]) => `  ${k}: ${v}`).join('\n') || '  None provided'}

Please review and assign a provider via the Admin Dashboard → AutoRx or Appointments tab.
`
        });
      }

      // Notify patient
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Care Team',
        to: patientEmail,
        subject: `✅ Visit Request Received: ${visitType.display_name}`,
        body: `Hi,

Your visit request has been received and is under review.

Visit Type: ${visitType.display_name}
Category: ${visitType.category}

What happens next:
1. A licensed provider will review your intake information (within 24 hours)
2. You'll receive a follow-up email with next steps or a consultation link
3. If a prescription is appropriate, it will be sent to our partner pharmacy

Questions? Reply to this email or contact us through your patient portal.

MedRevolve Care Team
`
      });
    }

    // Save visit log
    const visitLog = await base44.asServiceRole.entities.BelugaVisitLog.create(logData);

    return Response.json({
      success: logData.status !== 'error',
      visitLogId: visitLog.id,
      ...result
    });

  } catch (error) {
    console.error('belugaSubmitVisit error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});