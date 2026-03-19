import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const { providerId, consultationType, preferredDate, preferredTime, reason, patientState, paymentTiming, patientEmail, appointmentType, appointmentDate, appointmentTime, notes } = await req.json();

        // Support both field name conventions
        const resolvedEmail = patientEmail;
        const resolvedConsultationType = consultationType || 'video';
        const resolvedDate = preferredDate || appointmentDate;
        const resolvedTime = preferredTime || appointmentTime;

        if (!resolvedEmail) {
            return Response.json({ error: 'Patient email is required' }, { status: 400 });
        }

        if (!reason) {
            return Response.json({ error: 'Reason is required' }, { status: 400 });
        }

        // Get provider (optional)
        let provider = null;
        let rates = { video_rate: 99, phone_rate: 79, chat_rate: 49, in_person_rate: 149, payment_timing: 'before' };
        if (providerId) {
            const providers = await base44.asServiceRole.entities.Provider.filter({ id: providerId });
            if (providers.length) provider = providers[0];
            const rateRecords = await base44.asServiceRole.entities.ProviderRate.filter({ provider_id: providerId });
            if (rateRecords.length) rates = rateRecords[0];
        }

        const rateMap = {
            video: rates.video_rate || 99,
            phone: rates.phone_rate || 79,
            chat: rates.chat_rate || 49,
            in_person: rates.in_person_rate || 149
        };

        // Use a flat consultation fee if no provider assigned
        const amountDollars = rateMap[resolvedConsultationType] || 99;
        const amountCents = Math.round(amountDollars * 100);

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

        // Create consultation booking
        const bookingData = {
            patient_email: resolvedEmail,
            consultation_type: resolvedConsultationType,
            preferred_date: resolvedDate,
            preferred_time: resolvedTime,
            reason,
            payment_status: 'pending',
            payment_amount: amountDollars,
            booking_status: 'pending',
            participant_state: patientState || ''
        };
        if (providerId) bookingData.provider_id = providerId;
        const booking = await base44.asServiceRole.entities.ConsultationBooking.create(bookingData);

        // Create payment record
        const payment = await base44.asServiceRole.entities.ConsultationPayment.create({
            booking_id: booking.id,
            patient_email: resolvedEmail,
            provider_id: providerId || '',
            provider_name: provider ? `${provider.name}, ${provider.title}` : 'To Be Assigned',
            consultation_type: resolvedConsultationType,
            amount: amountDollars,
            status: 'pending',
            payment_timing: paymentTiming || rates.payment_timing || 'before',
            invoice_number: invoiceNumber,
            appointment_date: resolvedDate ? `${resolvedDate}T${resolvedTime || '10:00'}:00` : null
        });

        // If paying after, return booking without checkout
        if ((paymentTiming || rates.payment_timing) === 'after') {
            return Response.json({ bookingId: booking.id, paymentId: payment.id, payAfter: true, invoiceNumber });
        }

        const consultationLabel = appointmentType ? appointmentType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : `${resolvedConsultationType.charAt(0).toUpperCase() + resolvedConsultationType.slice(1)} Consultation`;
        const providerDesc = provider ? `With ${provider.name}, ${provider.title}` : 'MedRevolve Licensed Provider';

        // Create Stripe checkout session
        const origin = req.headers.get('origin') || 'https://medi-revolve-care.base44.app';
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: consultationLabel,
                        description: providerDesc
                    },
                    unit_amount: amountCents
                },
                quantity: 1
            }],
            mode: 'payment',
            customer_email: resolvedEmail,
            success_url: `${origin}/PatientPortal?session_id={CHECKOUT_SESSION_ID}&booking=${booking.id}`,
            cancel_url: `${origin}/BookAppointment`,
            metadata: {
                base44_app_id: Deno.env.get('BASE44_APP_ID'),
                booking_id: booking.id,
                payment_id: payment.id,
                provider_id: providerId || '',
                consultation_type: resolvedConsultationType,
                patient_email: resolvedEmail,
                invoice_number: invoiceNumber
            }
        });

        await base44.asServiceRole.entities.ConsultationPayment.update(payment.id, {
            stripe_session_id: session.id
        });
        await base44.asServiceRole.entities.ConsultationBooking.update(booking.id, {
            stripe_payment_intent: session.payment_intent || session.id
        });

        console.log('Consultation checkout created:', { bookingId: booking.id, invoiceNumber, amount: amountDollars });

        return Response.json({ sessionId: session.id, sessionUrl: session.url, bookingId: booking.id, invoiceNumber });
    } catch (error) {
        console.error('Error creating consultation checkout:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});