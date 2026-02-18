import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { providerId, consultationType, preferredDate, preferredTime, reason, patientState, paymentTiming } = await req.json();

        if (!providerId || !consultationType || !reason) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get provider
        const providers = await base44.asServiceRole.entities.Provider.filter({ id: providerId });
        if (!providers.length) {
            return Response.json({ error: 'Provider not found' }, { status: 404 });
        }
        const provider = providers[0];

        // Get provider rates (fall back to defaults)
        const rateRecords = await base44.asServiceRole.entities.ProviderRate.filter({ provider_id: providerId });
        const rates = rateRecords[0] || { video_rate: 99, phone_rate: 79, chat_rate: 49, in_person_rate: 149 };

        const rateMap = {
            video: rates.video_rate,
            phone: rates.phone_rate,
            chat: rates.chat_rate,
            in_person: rates.in_person_rate
        };

        const amountDollars = rateMap[consultationType] || 99;
        const amountCents = Math.round(amountDollars * 100);

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

        // Create consultation booking
        const booking = await base44.entities.ConsultationBooking.create({
            patient_email: user.email,
            provider_id: providerId,
            consultation_type: consultationType,
            preferred_date: preferredDate,
            preferred_time: preferredTime,
            reason,
            payment_status: 'pending',
            payment_amount: amountDollars,
            booking_status: 'pending',
            participant_state: patientState || ''
        });

        // Create payment record
        const payment = await base44.asServiceRole.entities.ConsultationPayment.create({
            booking_id: booking.id,
            patient_email: user.email,
            provider_id: providerId,
            provider_name: `${provider.name}, ${provider.title}`,
            consultation_type: consultationType,
            amount: amountDollars,
            status: 'pending',
            payment_timing: paymentTiming || rates.payment_timing || 'before',
            invoice_number: invoiceNumber,
            appointment_date: preferredDate ? `${preferredDate}T${preferredTime || '10:00'}:00` : null
        });

        // If paying after, return booking without checkout
        if ((paymentTiming || rates.payment_timing) === 'after') {
            return Response.json({ bookingId: booking.id, paymentId: payment.id, payAfter: true, invoiceNumber });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} Consultation`,
                        description: `With ${provider.name}, ${provider.title}`
                    },
                    unit_amount: amountCents
                },
                quantity: 1
            }],
            mode: 'payment',
            customer_email: user.email,
            success_url: `${req.headers.get('origin')}/PatientPortal?session_id={CHECKOUT_SESSION_ID}&booking=${booking.id}`,
            cancel_url: `${req.headers.get('origin')}/BookAppointment`,
            metadata: {
                base44_app_id: Deno.env.get('BASE44_APP_ID'),
                booking_id: booking.id,
                payment_id: payment.id,
                provider_id: providerId,
                consultation_type: consultationType,
                patient_email: user.email,
                invoice_number: invoiceNumber
            }
        });

        await base44.asServiceRole.entities.ConsultationPayment.update(payment.id, {
            stripe_session_id: session.id
        });
        await base44.entities.ConsultationBooking.update(booking.id, {
            stripe_payment_intent: session.payment_intent || session.id
        });

        console.log('Consultation checkout created:', { bookingId: booking.id, invoiceNumber, amount: amountDollars });

        return Response.json({ sessionId: session.id, sessionUrl: session.url, bookingId: booking.id, invoiceNumber });
    } catch (error) {
        console.error('Error creating consultation checkout:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});