import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        // Only admin/providers can complete consultations
        if (!user || user.role !== 'admin') {
            return Response.json({ 
                error: 'Unauthorized - Provider access required' 
            }, { status: 403 });
        }

        const { 
            appointmentId, 
            diagnosis, 
            treatmentPlan,
            prescribeMedication,
            medicationDetails,
            followUpRequired,
            providerNotes
        } = await req.json();

        if (!appointmentId) {
            return Response.json({ 
                error: 'Appointment ID required' 
            }, { status: 400 });
        }

        // Get appointment
        const appointments = await base44.entities.Appointment.filter({
            id: appointmentId
        });

        if (appointments.length === 0) {
            return Response.json({ 
                error: 'Appointment not found' 
            }, { status: 404 });
        }

        const appointment = appointments[0];

        // Create consultation summary
        const summary = await base44.entities.ConsultationSummary.create({
            appointment_id: appointmentId,
            patient_email: appointment.patient_email,
            provider_id: appointment.provider_id,
            chief_complaint: appointment.reason,
            diagnosis: diagnosis,
            treatment_plan: treatmentPlan,
            medications_prescribed: medicationDetails?.map(m => m.name) || [],
            follow_up_instructions: followUpRequired ? 'Follow up in 30 days' : 'No follow up needed',
            provider_notes: providerNotes
        });

        // Create prescriptions if needed
        if (prescribeMedication && medicationDetails?.length > 0) {
            for (const med of medicationDetails) {
                const prescription = await base44.entities.Prescription.create({
                    patient_email: appointment.patient_email,
                    provider_id: appointment.provider_id,
                    appointment_id: appointmentId,
                    medication_name: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    quantity: med.quantity,
                    refills: med.refills || 0,
                    instructions: med.instructions,
                    status: 'active',
                    start_date: new Date().toISOString().split('T')[0]
                });

                // Auto-submit to pharmacy
                await base44.asServiceRole.functions.invoke('submitPrescriptionToPharmacy', {
                    prescriptionId: prescription.id
                });
            }
        }

        // Update appointment status
        await base44.entities.Appointment.update(appointmentId, {
            status: 'completed',
            provider_notes: providerNotes,
            prescription_provided: prescribeMedication || false
        });

        // Update provider contract stats
        const providerContracts = await base44.asServiceRole.entities.ProviderContract.filter({
            id: appointment.provider_id
        });

        if (providerContracts.length > 0) {
            const contract = providerContracts[0];
            let compensation = 0;

            // Calculate compensation based on contract type
            if (contract.contract_type === 'per_consultation') {
                compensation = contract.rate_per_consultation || 0;
            } else if (contract.contract_type === 'revenue_share') {
                // Would calculate from order value
                compensation = 0; // TODO: Calculate from order
            }

            await base44.asServiceRole.entities.ProviderContract.update(contract.id, {
                total_compensation_paid: (contract.total_compensation_paid || 0) + compensation
            });
        }

        // Notify patient
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: appointment.patient_email,
            subject: 'Your Consultation is Complete',
            body: `
                <h2>Consultation Summary</h2>
                <p>Your consultation has been completed.</p>
                
                ${prescribeMedication ? `
                    <h3>Prescriptions</h3>
                    <p>Your prescriptions have been sent to the pharmacy and will ship within 3-5 days.</p>
                ` : ''}
                
                <p>View full details in your Patient Portal.</p>
            `
        });

        console.log('Consultation completed:', {
            appointmentId,
            patient: appointment.patient_email,
            prescribed: prescribeMedication
        });

        return Response.json({ 
            success: true,
            summaryId: summary.id,
            prescriptionsCreated: medicationDetails?.length || 0
        });
    } catch (error) {
        console.error('Error completing consultation:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});