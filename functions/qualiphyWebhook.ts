import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// This function receives webhook callbacks from Qualiphy after exam completion
// Register this URL in your Qualiphy exam invites as the webhook_url
Deno.serve(async (req) => {
    try {
        const body = await req.json();
        console.log("Qualiphy webhook received:", JSON.stringify(body));

        const base44 = createClientFromRequest(req);

        const {
            event,
            exam_id,
            exam_name,
            exam_status,
            exam_url,
            patient_email,
            patient_exam_id,
            provider_name,
            clinic_name,
            reason,
            additional_data,
            questions_answers,
            prescription,
            rx_status,
            patient_phone_number
        } = body;

        // Store the webhook result as a BelugaVisitLog (reusing existing entity for exam logs)
        await base44.asServiceRole.entities.BelugaVisitLog.create({
            visit_type_id: String(exam_id || ''),
            patient_email: patient_email || '',
            submission_mode: 'qualiphy',
            status: exam_status === 'Approved' ? 'approved' : exam_status === 'Deferred' ? 'deferred' : 'pending',
            beluga_visit_id: String(patient_exam_id || ''),
            beluga_response: JSON.stringify(body),
            submitted_at: new Date().toISOString()
        });

        console.log(`Qualiphy webhook processed: event=${event}, patient=${patient_email}, status=${exam_status}`);

        return Response.json({ success: true });
    } catch (error) {
        console.error("qualiphyWebhook error:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});