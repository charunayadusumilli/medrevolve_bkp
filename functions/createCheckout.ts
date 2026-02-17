import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia'
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { items, shippingInfo, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart items are required' }, { status: 400 });
    }

    // Calculate total
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100);
    const total = Math.round((subtotal + subtotal * 0.08) * 100);

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sales Tax'
          },
          unit_amount: tax
        },
        quantity: 1
      });
    }

    const sessionParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'auto',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        shipping_name: shippingInfo?.fullName,
        shipping_email: shippingInfo?.email,
        shipping_phone: shippingInfo?.phone,
        shipping_address: shippingInfo?.address,
        shipping_city: shippingInfo?.city,
        shipping_state: shippingInfo?.state,
        shipping_zip: shippingInfo?.zipCode
      }
    };

    if (shippingInfo?.email) {
      sessionParams.customer_email = shippingInfo.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('Stripe session created:', session.id);

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ 
      error: error.message || 'Failed to create checkout session' 
    }, { status: 500 });
  }
});