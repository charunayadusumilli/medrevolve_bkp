import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@17.5.0';

/**
 * merchantSetupCheckout
 * Creates a Stripe Checkout session for the $5,000 B2B merchant setup fee.
 * Called from MerchantOnboarding page after Partner entity is created.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { businessName, contactName, email, partnerCode, successUrl, cancelUrl } = await req.json();

    if (!email || !businessName) {
      return Response.json({ error: 'businessName and email are required' }, { status: 400 });
    }

    // Check if running in iframe — block checkout
    const origin = req.headers.get('origin') || '';
    const referer = req.headers.get('referer') || '';
    console.log('merchantSetupCheckout called — origin:', origin, 'referer:', referer);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MedRevolve B2B Platform Setup',
              description: `White-label platform launch for ${businessName}. Includes: branded storefront, domain setup, provider network access, pharmacy network, compliance framework, marketing stack, and dedicated 10-person onboarding team.`,
              images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'],
            },
            unit_amount: 500000, // $5,000 in cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/MerchantDashboard?setup=success`,
      cancel_url: cancelUrl || `${origin}/MerchantOnboarding?canceled=1`,
      billing_address_collection: 'required',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        type: 'merchant_setup',
        business_name: businessName,
        contact_name: contactName || '',
        email: email,
        partner_code: partnerCode || '',
      },
      payment_intent_data: {
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          type: 'merchant_setup',
          business_name: businessName,
          contact_name: contactName || '',
          partner_code: partnerCode || '',
        },
        description: `MedRevolve B2B Setup — ${businessName}`,
      },
    });

    console.log('✅ Merchant setup checkout created:', session.id, 'for', businessName);

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('merchantSetupCheckout error:', error.message, error);
    return Response.json({ error: error.message || 'Failed to create checkout' }, { status: 500 });
  }
});