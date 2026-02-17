import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!webhookSecret || !stripeSecretKey) {
        console.error('Stripe webhook secret or API key not configured');
        return Response.json({ error: 'Configuration error' }, { status: 500 });
    }

    try {
        const stripe = new Stripe(stripeSecretKey);
        const body = await req.text();
        
        // Verify webhook signature
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret
        );

        console.log('Stripe webhook event:', event.type);

        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutComplete(base44, event.data.object);
                break;
            
            case 'invoice.paid':
                await handleInvoicePaid(base44, event.data.object);
                break;
            
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionChange(base44, event.data.object);
                break;
            
            case 'customer.subscription.deleted':
                await handleSubscriptionCancelled(base44, event.data.object);
                break;
            
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(base44, event.data.object);
                break;
        }

        return Response.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);
        return Response.json({ error: error.message }, { status: 400 });
    }
});

async function handleCheckoutComplete(base44, session) {
    console.log('Processing checkout completion:', session.id);
    
    try {
        // Extract customer info
        const customerEmail = session.customer_email || session.customer_details?.email;
        
        // Get partner code from metadata or URL params
        const partnerCode = session.metadata?.partner_code;
        
        // Process partner referral if applicable
        if (partnerCode) {
            await base44.asServiceRole.functions.invoke('processPartnerReferral', {
                partnerCode: partnerCode,
                customerEmail: customerEmail,
                productId: session.metadata?.product_id || 'subscription',
                orderValue: session.amount_total / 100
            });
        }
        
        // Assign to available provider
        await base44.asServiceRole.functions.invoke('assignToProvider', {
            customerEmail: customerEmail,
            productId: session.metadata?.product_id,
            sessionId: session.id
        });
        
        // Send welcome email
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: customerEmail,
            subject: 'Welcome to MedRevolve - Next Steps',
            body: `
                <h2>Welcome to MedRevolve!</h2>
                <p>Your subscription is confirmed. Here's what happens next:</p>
                <ol>
                    <li>A licensed provider will review your intake within 24 hours</li>
                    <li>If approved, your prescription will be sent to our partner pharmacy</li>
                    <li>Your medication ships within 3-5 business days</li>
                </ol>
                <p>Track your order in the Patient Portal.</p>
            `
        });
        
        console.log('Checkout processing complete for:', customerEmail);
    } catch (error) {
        console.error('Error processing checkout:', error);
        // Log to error tracking system
        await base44.asServiceRole.functions.invoke('logError', {
            source: 'stripeWebhook',
            event: 'checkout.session.completed',
            error: error.message,
            sessionId: session.id
        });
    }
}

async function handleInvoicePaid(base44, invoice) {
    console.log('Invoice paid:', invoice.id);
    
    try {
        const customerEmail = invoice.customer_email;
        
        // Update subscription status
        // Track recurring revenue
        // Process provider/pharmacy payouts for this billing cycle
        
        console.log('Invoice processing complete');
    } catch (error) {
        console.error('Error processing invoice:', error);
    }
}

async function handleSubscriptionChange(base44, subscription) {
    console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionCancelled(base44, subscription) {
    console.log('Subscription cancelled:', subscription.id);
    
    // Notify provider and pharmacy
    // Stop future shipments
    // Send cancellation confirmation
}

async function handlePaymentFailed(base44, paymentIntent) {
    console.log('Payment failed:', paymentIntent.id);
    
    // Send payment retry email
    // Flag account for follow-up
}