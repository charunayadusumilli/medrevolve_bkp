import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { customerEmail, productId, sessionId } = await req.json();

        if (!customerEmail || !productId) {
            return Response.json({ 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        // Get customer intake
        const intakes = await base44.asServiceRole.entities.CustomerIntake.filter({
            email: customerEmail
        }, '-created_date', 1);

        if (intakes.length === 0) {
            console.error('No intake found for customer:', customerEmail);
            return Response.json({ 
                error: 'Customer intake not found' 
            }, { status: 404 });
        }

        const intake = intakes[0];

        // Get all active provider contracts
        const providers = await base44.asServiceRole.entities.ProviderContract.filter({
            status: 'active'
        });

        if (providers.length === 0) {
            console.error('No active providers available');
            // Fallback: notify admin
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: Deno.env.get('ADMIN_EMAIL') || 'support@medrevolve.com',
                subject: 'URGENT: No Providers Available',
                body: `Customer ${customerEmail} needs provider assignment but no active providers available.`
            });
            return Response.json({ 
                error: 'No providers available' 
            }, { status: 503 });
        }

        // Simple round-robin assignment (or use AI matching)
        const provider = providers[0]; // TODO: Implement smart matching

        // Create appointment record
        const appointment = await base44.asServiceRole.entities.Appointment.create({
            provider_id: provider.id,
            patient_email: customerEmail,
            appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24hrs from now
            duration_minutes: 30,
            type: 'initial_consultation',
            status: 'scheduled',
            reason: intake.primary_interest,
            notes: `Product: ${productId}, Session: ${sessionId}`
        });

        // Update provider stats
        await base44.asServiceRole.entities.ProviderContract.update(provider.id, {
            total_consultations: (provider.total_consultations || 0) + 1
        });

        // Notify provider
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: provider.contact_email,
            subject: 'New Patient Assignment',
            body: `
                <h2>New Patient Consultation Assigned</h2>
                <p><strong>Patient:</strong> ${intake.full_name}</p>
                <p><strong>Interest:</strong> ${intake.primary_interest}</p>
                <p><strong>Appointment ID:</strong> ${appointment.id}</p>
                <p>Please review the patient intake and schedule consultation within 24 hours.</p>
            `
        });

        // Notify customer
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: customerEmail,
            subject: 'Provider Assigned - MedRevolve',
            body: `
                <h2>Your Provider Has Been Assigned</h2>
                <p>A licensed provider will review your information and contact you within 24 hours.</p>
                <p>You can track your consultation status in the Patient Portal.</p>
            `
        });

        console.log('Provider assigned:', {
            customer: customerEmail,
            provider: provider.provider_name,
            appointmentId: appointment.id
        });

        return Response.json({ 
            success: true,
            appointmentId: appointment.id,
            providerId: provider.id
        });
    } catch (error) {
        console.error('Error assigning provider:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});