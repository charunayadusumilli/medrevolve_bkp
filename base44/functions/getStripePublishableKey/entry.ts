import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const stripePublishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
        
        if (!stripePublishableKey) {
            return Response.json({ 
                error: 'Stripe not configured' 
            }, { status: 500 });
        }

        return Response.json({ 
            publishableKey: stripePublishableKey 
        });
    } catch (error) {
        console.error('Error getting Stripe publishable key:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});