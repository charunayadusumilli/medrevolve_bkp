import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { bookingId, sessionId, paymentStatus } = await req.json();

        if (!bookingId) {
            return Response.json({ error: 'Booking ID required' }, { status: 400 });
        }

        // Get booking
        const bookings = await base44.asServiceRole.entities.ConsultationBooking.filter({
            id: bookingId
        });

        if (bookings.length === 0) {
            return Response.json({ error: 'Booking not found' }, { status: 404 });
        }

        const booking = bookings[0];

        // Update payment status
        await base44.asServiceRole.entities.ConsultationBooking.update(bookingId, {
            payment_status: paymentStatus === 'paid' ? 'paid' : 'failed',
            booking_status: paymentStatus === 'paid' ? 'confirmed' : 'pending'
        });

        if (paymentStatus === 'paid') {
            // Create appointment
            const appointment = await base44.asServiceRole.entities.Appointment.create({
                provider_id: booking.provider_id,
                patient_email: booking.patient_email,
                appointment_date: booking.preferred_date,
                time: booking.preferred_time,
                duration_minutes: 30,
                type: 'paid_consultation',
                status: 'scheduled',
                reason: booking.reason,
                consultation_type: booking.consultation_type,
                notes: `Paid consultation - ${booking.consultation_type}`
            });

            // Update booking with appointment ID
            await base44.asServiceRole.entities.ConsultationBooking.update(bookingId, {
                appointment_id: appointment.id
            });

            // Initialize communication session based on type
            let sessionUrl = null;
            if (booking.consultation_type === 'video' || booking.consultation_type === 'phone') {
                const commResult = await base44.asServiceRole.functions.invoke('initializeCommunicationSession', {
                    appointmentId: appointment.id,
                    consultationType: booking.consultation_type,
                    patientEmail: booking.patient_email,
                    providerId: booking.provider_id
                });
                sessionUrl = commResult.data?.sessionUrl;

                if (sessionUrl) {
                    await base44.asServiceRole.entities.ConsultationBooking.update(bookingId, {
                        session_url: sessionUrl
                    });
                }
            }

            // Get provider details
            const providers = await base44.asServiceRole.entities.ProviderContract.filter({
                id: booking.provider_id
            });

            // Send confirmation emails
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: booking.patient_email,
                subject: 'Consultation Confirmed - MedRevolve',
                body: `
                    <h2>Your Consultation is Confirmed!</h2>
                    <p><strong>Type:</strong> ${booking.consultation_type}</p>
                    <p><strong>Date:</strong> ${booking.preferred_date}</p>
                    <p><strong>Time:</strong> ${booking.preferred_time}</p>
                    <p><strong>Provider:</strong> ${providers[0]?.provider_name || 'Healthcare Provider'}</p>
                    ${sessionUrl ? `<p><a href="${sessionUrl}">Join Session</a></p>` : ''}
                    <p>View details in My Appointments.</p>
                `
            });

            if (providers.length > 0) {
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: providers[0].contact_email,
                    subject: 'New Paid Consultation Booked',
                    body: `
                        <h2>New Consultation Scheduled</h2>
                        <p><strong>Patient:</strong> ${booking.patient_email}</p>
                        <p><strong>Type:</strong> ${booking.consultation_type}</p>
                        <p><strong>Date:</strong> ${booking.preferred_date}</p>
                        <p><strong>Time:</strong> ${booking.preferred_time}</p>
                        <p><strong>Reason:</strong> ${booking.reason}</p>
                        ${sessionUrl ? `<p><a href="${sessionUrl}">Join Session</a></p>` : ''}
                    `
                });
            }

            console.log('Consultation payment processed:', {
                bookingId,
                appointmentId: appointment.id,
                type: booking.consultation_type
            });

            return Response.json({
                success: true,
                appointmentId: appointment.id,
                sessionUrl: sessionUrl
            });
        }

        return Response.json({ success: false });
    } catch (error) {
        console.error('Error processing consultation payment:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});