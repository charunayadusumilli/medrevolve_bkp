import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia'
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const {
      items,
      shippingInfo,
      successUrl,
      cancelUrl,
      mode = 'payment',            // 'payment' = charge now | 'setup' = authorize/save card only ($0)
      paymentMethodTypes = ['card'] // card | cashapp | us_bank_account | link
    } = await req.json();

    const fallback = 'https://medi-revolve-care.base44.app';
    const okUrl = successUrl || `${fallback}/Cart?status=payment_success`;
    const noUrl = cancelUrl || `${fallback}/Cart?status=payment_canceled`;

    // ── SETUP mode: collect/authorize a payment method with NO charge ──
    if (mode === 'setup') {
      const sessionParams = {
        mode: 'setup',
        payment_method_types: paymentMethodTypes,
        success_url: successUrl || `${fallback}/Cart?status=setup_success`,
        cancel_url: cancelUrl || `${fallback}/Cart?status=setup_canceled`,
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          shipping_name: shippingInfo?.fullName,
          shipping_email: shippingInfo?.email,
          shipping_phone: shippingInfo?.phone,
          checkout_mode: 'setup'
        }
      };
      if (shippingInfo?.email) sessionParams.customer_email = shippingInfo.email;

      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log('Stripe setup session created:', session.id);
      return Response.json({ sessionId: session.id, url: session.url, mode: 'setup' });
    }

    // ── PAYMENT mode: charge the cart total now ──
    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart items are required for payment mode' }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100);
    const totalCents = Math.round((subtotal + subtotal * 0.08) * 100);

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

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Sales Tax (8%)' },
          unit_amount: tax
        },
        quantity: 1
      });
    }

    const sessionParams = {
      payment_method_types: paymentMethodTypes,
      mode: 'payment',
      line_items: lineItems,
      success_url: okUrl,
      cancel_url: noUrl,
      billing_address_collection: 'auto',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        shipping_name: shippingInfo?.fullName,
        shipping_email: shippingInfo?.email,
        shipping_phone: shippingInfo?.phone,
        shipping_address: shippingInfo?.address,
        shipping_city: shippingInfo?.city,
        shipping_state: shippingInfo?.state,
        shipping_zip: shippingInfo?.zipCode,
        checkout_mode: 'payment'
      }
    };

    if (shippingInfo?.email) sessionParams.customer_email = shippingInfo.email;

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log('Stripe payment session created:', session.id, 'total:', totalCents);

    return Response.json({
      sessionId: session.id,
      url: session.url,
      mode: 'payment',
      total: totalCents
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({
      error: error.message || 'Failed to create checkout session'
    }, { status: 500 });
  }
});