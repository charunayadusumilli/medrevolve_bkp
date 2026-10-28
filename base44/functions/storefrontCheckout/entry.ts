import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const STRIPE_API = 'https://api.stripe.com/v1';
const STRIPE_VERSION = '2025-10-29.clover';

const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING = 5.95;
const TAX_RATE = 0.0825;

const RUO_FLAT_SHIPPING = 18;
const RUO_FREE_CASES = 4;
const RUO_TIERS = [
  { cases: 4, discount: 0.15 },
  { cases: 3, discount: 0.1 },
  { cases: 2, discount: 0.05 },
];

const cents = (value) => Math.round(Number(value || 0) * 100);

async function stripeAccountHeader(base44, merchantCode) {
  // Stripe Connect: a merchant storefront charges on its own connected account.
  // The connected account id lives on the merchant record (admin-only writes),
  // so the buyer can never choose where the money lands.
  if (!merchantCode) return {};
  const { items } = await base44.asServiceRole.entities.Partner.filter({ partner_code: merchantCode }, { limit: 1 });
  const connected = items?.[0]?.stripe_account_id;
  return connected ? { 'Stripe-Account': connected } : {};
}

async function stripePost(path, params, accountHeader) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
      'Stripe-Version': STRIPE_VERSION,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': crypto.randomUUID(),
      ...accountHeader,
    },
    body: params.toString(),
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Stripe error ${res.status}`);
  return json;
}

async function buildConsumerLines(base44, lines) {
  const skus = [...new Set(lines.map((l) => String(l.sku || '')).filter(Boolean))];
  if (skus.length === 0) return { error: 'No items in basket' };
  const { items } = await base44.asServiceRole.entities.StorefrontProduct.filter({ sku: { $in: skus } }, { limit: 100 });
  const bySku = new Map(items.map((p) => [p.sku, p]));

  const resolved = [];
  for (const line of lines) {
    const product = bySku.get(line.sku);
    if (!product) return { error: `Unknown product ${line.sku}` };
    if (product.rail === 'prescription') return { error: `${product.display_name} requires a provider intake` };
    if (product.in_stock === false) return { error: `${product.display_name} is out of stock` };

    const quantity = Math.max(1, Math.min(Number(line.quantity) || 1, product.quantity_limit || 6));
    const isSub = line.purchase_type === 'subscription';
    const dose = (product.dose_options || []).find((d) => d.label === line.dose_label);
    const base = isSub && product.subscription_price != null ? product.subscription_price : product.price;
    const unit = Number(base || 0) + Number(dose?.price_delta || 0);

    resolved.push({
      sku: product.sku,
      name: product.display_name + (dose?.label ? ` (${dose.label})` : ''),
      unit,
      quantity,
      subscription: isSub,
      cadenceDays: isSub ? Number(product.subscription_cadences?.[0] || 30) : null,
    });
  }
  return { lines: resolved };
}

function consumerTotals(lines) {
  const gross = lines.reduce((sum, l) => sum + l.unit * l.quantity, 0);
  const shipping = gross >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = Math.round(gross * TAX_RATE * 100) / 100;
  return {
    subtotal: Math.round(gross * 100) / 100,
    shipping,
    tax,
    total: Math.round((gross + shipping + tax) * 100) / 100,
  };
}

async function buildRuoLines(base44, lines) {
  const skus = [...new Set(lines.map((l) => String(l.sku || '')).filter(Boolean))];
  if (skus.length === 0) return { error: 'No cases in cart' };
  const { items } = await base44.asServiceRole.entities.RUOProduct.filter({ sku: { $in: skus } }, { limit: 100 });
  const bySku = new Map(items.map((p) => [p.sku, p]));

  const resolved = [];
  for (const line of lines) {
    const product = bySku.get(line.sku);
    if (!product) return { error: `Unknown compound ${line.sku}` };
    if (product.in_stock === false) return { error: `${product.name} is backordered` };
    const quantity = Math.max(1, Math.min(Number(line.quantity) || 1, product.quantity_limit || 12));
    resolved.push({ sku: product.sku, name: `${product.name} — case of ${product.case_size}`, unit: Number(product.price || 0), quantity });
  }

  const cases = resolved.reduce((n, l) => n + l.quantity, 0);
  const discountRate = RUO_TIERS.find((t) => cases >= t.cases)?.discount || 0;
  const gross = resolved.reduce((sum, l) => sum + l.unit * l.quantity, 0);
  const discount = Math.round(gross * discountRate * 100) / 100;
  const subtotal = Math.round((gross - discount) * 100) / 100;
  const shipping = cases >= RUO_FREE_CASES ? 0 : RUO_FLAT_SHIPPING;

  return {
    lines: resolved,
    totals: { subtotal, shipping, tax: 0, total: Math.round((subtotal + shipping) * 100) / 100, discount, cases, discountRate },
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const channel = body.channel === 'ruo' ? 'ruo' : 'consumer';
    const cartLines = Array.isArray(body.lines) ? body.lines.slice(0, 40) : [];
    const customer = body.customer || {};

    if (cartLines.length === 0) return Response.json({ error: 'Your cart is empty' }, { status: 400 });
    if (!customer.email || !String(customer.email).includes('@')) {
      return Response.json({ error: 'A valid email is required for the receipt' }, { status: 400 });
    }
    if (!customer.name || !body.shipAddress || !body.shipCity || !body.shipState || !body.shipZip) {
      return Response.json({ error: 'A complete shipping address is required' }, { status: 400 });
    }

    const appUrl = req.headers.get('X-Base44-App-Url');
    if (!appUrl) return Response.json({ error: 'Missing app URL' }, { status: 500 });

    const built = channel === 'ruo'
      ? await buildRuoLines(base44, cartLines)
      : await buildConsumerLines(base44, cartLines);
    if (built.error) return Response.json({ error: built.error }, { status: 400 });

    const consumerTotalsValue = built.totals || consumerTotals(built.lines);
    const orderItems = built.lines.map((l) => ({
      product_id: l.sku,
      product_name: l.name,
      price: l.unit,
      quantity: l.quantity,
    }));

    const order = await base44.asServiceRole.entities.Order.create({
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone || '',
      items: orderItems,
      shipping_address: body.shipAddress,
      shipping_city: body.shipCity,
      shipping_state: body.shipState,
      shipping_zip: body.shipZip,
      shipping_phone: customer.phone || '',
      subtotal: consumerTotalsValue.subtotal,
      tax: consumerTotalsValue.tax,
      total: consumerTotalsValue.total,
      status: 'pending',
      notes: `channel=${channel}; shipping=${consumerTotalsValue.shipping}; discount=${consumerTotalsValue.discount || 0}`,
    });

    const params = new URLSearchParams();
    const allSubscription = channel === 'consumer' && built.lines.every((l) => l.subscription);
    params.set('mode', allSubscription ? 'subscription' : 'payment');
    params.set('customer_email', customer.email);
    params.set('success_url', `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${order.id}`);
    params.set('cancel_url', `${appUrl}/cart`);
    params.set('metadata[base44_app_id]', Deno.env.get('BASE44_APP_ID') || '');
    params.set('metadata[order_id]', order.id);
    params.set('metadata[channel]', channel);
    params.set('metadata[ship_state]', body.shipState);
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', 'usd');
    params.set('line_items[0][price_data][product_data][name]', `${channel === 'ruo' ? 'MedRevolve Research' : 'MedRevolve'} order ${order.id.slice(-6).toUpperCase()}`);
    // In subscription mode every line item must be recurring, so shipping and tax
    // are folded into the single recurring amount instead of separate lines.
    const chargeable = allSubscription
      ? consumerTotalsValue.subtotal + consumerTotalsValue.shipping + consumerTotalsValue.tax
      : consumerTotalsValue.subtotal;
    params.set('line_items[0][price_data][unit_amount]', String(cents(chargeable)));

    if (allSubscription) {
      const months = Math.max(1, Math.round((built.lines[0].cadenceDays || 30) / 30));
      params.set('line_items[0][price_data][recurring][interval]', 'month');
      params.set('line_items[0][price_data][recurring][interval_count]', String(months));
      params.set('subscription_data[metadata][base44_app_id]', Deno.env.get('BASE44_APP_ID') || '');
      params.set('subscription_data[metadata][order_id]', order.id);
    }

    if (!allSubscription && consumerTotalsValue.shipping > 0) {
      params.set('line_items[1][quantity]', '1');
      params.set('line_items[1][price_data][currency]', 'usd');
      params.set('line_items[1][price_data][product_data][name]', channel === 'ruo' ? 'Cold-chain shipping' : 'Shipping');
      params.set('line_items[1][price_data][unit_amount]', String(cents(consumerTotalsValue.shipping)));
    }

    if (!allSubscription && consumerTotalsValue.tax > 0) {
      params.set('line_items[2][quantity]', '1');
      params.set('line_items[2][price_data][currency]', 'usd');
      params.set('line_items[2][price_data][product_data][name]', 'Estimated sales tax');
      params.set('line_items[2][price_data][unit_amount]', String(cents(consumerTotalsValue.tax)));
    }

    const accountHeader = await stripeAccountHeader(base44, typeof body.merchant_code === 'string' ? body.merchant_code : '');
    const session = await stripePost('/checkout/sessions', params, accountHeader);

    await base44.asServiceRole.entities.Order.update(order.id, { stripe_session_id: session.id });

    return Response.json({ url: session.url, order_id: order.id, total: consumerTotalsValue.total });
  } catch (error) {
    console.error('storefrontCheckout failed', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});