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

        const { 
            providerId, 
            consultationType, 
            preferredDate, 
            preferredTime, 
            reason,
            patientState 
        } = await req.json();

        if (!providerId || !consultationType || !reason) {
            return Response.json({ 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        // Get provider to verify license for patient's state
        const providers = await base44.asServiceRole.entities.ProviderContract.filter({
            id: providerId,
            status: 'active'
        });

        if (providers.length === 0) {
            return Response.json({ 
                error: 'Provider not found or inactive' 
            }, { status: 404 });
        }

        const provider = providers[0];

        // Verify compliance: provider must be licensed in patient's state
        const complianceCheck = patientState && provider.states_licensed?.includes(patientState);
        
        if (patientState && !complianceCheck) {
            return Response.json({ 
                error: `Provider not licensed in ${patientState}. Please select a different provider.`,
                compliance_issue: true
            }, { status: 403 });
        }

        // Pricing based on consultation type
        const pricing = {
            video: 9900,      // $99
            phone: 7900,      // $79
            chat: 4900,       // $49
            in_person: 14900  // $149
        };

        const amount = pricing[consultationType] || 9900;

        // Create consultation booking record
        const booking = await base44.entities.ConsultationBooking.create({
            patient_email: user.email,
            provider_id: providerId,
            consultation_type: consultationType,
            preferred_date: preferredDate,
            preferred_time: preferredTime,
            reason: reason,
            payment_status: 'pending',
            payment_amount: amount / 100,
            booking_status: 'pending',
            participant_state: patientState,
            provider_state: provider.states_licensed?.[0] || 'CA',
            compliance_verified: complianceCheck || false,
            compliance_notes: complianceCheck 
                ? 'Provider licensed in patient state' 
                : 'No state verification performed'
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} Consultation`,
                        description: `Healthcare consultation with ${provider.provider_name}`
                    },
                    unit_amount: amount
                },
                quantity: 1
            }],
            mode: 'payment',
            customer_email: user.email,
            success_url: `${req.headers.get('origin')}/MyAppointments?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/Consultations`,
            metadata: {
                base44_app_id: Deno.env.get('BASE44_APP_ID'),
                booking_id: booking.id,
                provider_id: providerId,
                consultation_type: consultationType,
                patient_email: user.email,
                patient_state: patientState || 'unknown'
            }
        });

        // Update booking with payment intent
        await base44.entities.ConsultationBooking.update(booking.id, {
            stripe_payment_intent: session.payment_intent
        });

        console.log('Consultation checkout created:', {
            bookingId: booking.id,
            provider: provider.provider_name,
            type: consultationType,
            amount: amount / 100
        });

        return Response.json({
            sessionId: session.id,
            sessionUrl: session.url,
            bookingId: booking.id
        });
    } catch (error) {
        console.error('Error creating consultation checkout:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});