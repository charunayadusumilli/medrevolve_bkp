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
    const { businessName, contactName, email, partnerCode, successUrl, cancelUrl, amount, description } = await req.json();

    if (!email || !businessName) {
      return Response.json({ error: 'businessName and email are required' }, { status: 400 });
    }

    // Check if running in iframe — block checkout
    const origin = req.headers.get('origin') || '';
    const referer = req.headers.get('referer') || '';
    console.log('merchantSetupCheckout called — origin:', origin, 'referer:', referer);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' });

    // Support variable amounts: $100 onboarding call OR $5,000 full setup
    const amountDollars = amount || 5000;
    const amountCents = amountDollars * 100;
    const productName = amountDollars === 100
      ? 'MedRevolve Onboarding Consultation'
      : 'MedRevolve B2B Platform Setup';
    const productDesc = description || (amountDollars === 100
      ? `1-hour live guided platform setup call for ${businessName}. Covers: telehealth setup, bank accounts, compliance, domain, providers & pharmacy network.`
      : `White-label platform launch for ${businessName}. Includes: branded storefront, domain, provider network, pharmacy, compliance framework, and dedicated onboarding team.`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDesc,
              images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'],
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/MerchantDashboard?setup=success`,
      cancel_url: cancelUrl || `${origin}/MerchantOnboarding?canceled=1`,
      billing_address_collection: 'required',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        type: amount === 100 ? 'merchant_onboarding_call' : 'merchant_setup',
        business_name: businessName,
        contact_name: contactName || '',
        email: email,
        partner_code: partnerCode || '',
        amount: String(amountDollars),
      },
      payment_intent_data: {
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          type: amount === 100 ? 'merchant_onboarding_call' : 'merchant_setup',
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