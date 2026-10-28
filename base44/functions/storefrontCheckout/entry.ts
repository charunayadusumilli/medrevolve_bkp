import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// ── Payment rail: QBI Gateway (same merchant account as the B2B checkout) ──────
const QBI_CHARGE_URL = 'https://api.qbigateway.com/api/v2/transactions/charge';

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

const round = (value) => Math.round(Number(value || 0) * 100) / 100;

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
      unit: round(unit),
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
    subtotal: round(gross),
    shipping: round(shipping),
    tax: round(tax),
    total: round(gross + shipping + tax),
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
    resolved.push({
      sku: product.sku,
      name: `${product.name} — case of ${product.case_size}`,
      unit: round(product.price),
      quantity,
    });
  }

  const cases = resolved.reduce((n, l) => n + l.quantity, 0);
  const discountRate = RUO_TIERS.find((t) => cases >= t.cases)?.discount || 0;
  const gross = resolved.reduce((sum, l) => sum + l.unit * l.quantity, 0);
  const discount = round(gross * discountRate);
  const subtotal = round(gross - discount);
  const shipping = cases >= RUO_FREE_CASES ? 0 : RUO_FLAT_SHIPPING;

  return {
    lines: resolved,
    totals: { subtotal, shipping, tax: 0, total: round(subtotal + shipping), discount, cases, discountRate },
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
    if (!body.nonce) {
      return Response.json({ error: 'Enter your card details to continue.' }, { status: 400 });
    }

    const sourceKey = Deno.env.get('QBI_GATEWAY_SOURCE_KEY');
    const pin = Deno.env.get('QBI_GATEWAY_PIN');
    if (!sourceKey) {
      console.error('QBI_GATEWAY_SOURCE_KEY is not set');
      return Response.json({ error: 'Payment gateway is not configured.' }, { status: 500 });
    }

    // ── Price the basket server-side; the buyer never supplies amounts ──
    const built = channel === 'ruo'
      ? await buildRuoLines(base44, cartLines)
      : await buildConsumerLines(base44, cartLines);
    if (built.error) return Response.json({ error: built.error }, { status: 400 });

    const totals = built.totals || consumerTotals(built.lines);
    if (!(totals.total >= 0.01)) return Response.json({ error: 'Invalid order total' }, { status: 400 });

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
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      status: 'pending',
      notes: [
        `channel=${channel}`,
        `provider=qbi`,
        `shipping=${totals.shipping}`,
        `discount=${totals.discount || 0}`,
        built.lines.some((l) => l.subscription)
          ? `refill=${built.lines[0].cadenceDays || 30}d`
          : '',
      ].filter(Boolean).join('; '),
    });

    // ── Charge through QBI Gateway ──
    const payload: Record<string, unknown> = {
      source: `nonce-${body.nonce}`,
      amount: totals.total,
      name: customer.name,
      expiry_month: body.expiryMonth,
      expiry_year: body.expiryYear,
      capture: true,
      save_card: false,
      transaction_details: {
        description: `${channel === 'ruo' ? 'MedRevolve Research' : 'MedRevolve'} order ${order.id.slice(-6).toUpperCase()}`,
        invoice_number: `MR-${order.id.slice(-8).toUpperCase()}`,
      },
      billing_info: {
        email: customer.email,
        phone: customer.phone || '',
      },
      line_items: built.lines.map((l, idx) => ({
        sku: l.sku || `SKU-${idx + 1}`,
        description: l.name,
        cost: l.unit,
        quantity: l.quantity,
      })),
    };
    if (body.avsZip) payload.avs_zip = body.avsZip;

    console.log(`QBI storefront charge: channel=${channel} order=${order.id} amount=${totals.total}`);

    const apiRes = await fetch(QBI_CHARGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${sourceKey}:${pin || ''}`)}`,
        Accept: 'application/json',
        'User-Agent': 'MedRevolve-Storefront/1.0',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25000),
    });

    const raw = await apiRes.text();
    let result: Record<string, any>;
    try {
      result = JSON.parse(raw);
    } catch {
      result = { raw };
    }

    if (!apiRes.ok) {
      console.error('QBI charge failed:', apiRes.status, raw);
      const message = result?.error_message || result?.error?.message || result?.message || result?.error;
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: 'failed',
        notes: `${order.notes}; qbi_status=${apiRes.status}`,
      });
      return Response.json({
        error: typeof message === 'string' ? message : 'Your card was declined. Please try another card.',
        declined: true,
      }, { status: 402 });
    }

    const approved = result?.status_code === 'A' || result?.status_code === 'P' ||
      result?.status === 'Approved' || result?.status === 'Partially Approved';

    if (!approved) {
      console.error('QBI charge not approved:', result?.status, result?.error_code, result?.error_message);
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: 'failed',
        notes: `${order.notes}; qbi_status=${result?.status || 'unknown'}`,
      });
      return Response.json({
        error: result?.error_message || 'Your card was declined. Please try another card.',
        declined: true,
      }, { status: 402 });
    }

    const reference = result?.reference_number;
    await base44.asServiceRole.entities.Order.update(order.id, {
      status: 'paid',
      payment_provider: 'qbi',
      payment_reference: reference ? String(reference) : '',
      notes: `${order.notes}; qbi_ref=${reference || 'n/a'}; card=${result?.last_4 ? `**** ${result.last_4}` : 'n/a'}`,
    });

    console.log(`QBI storefront approved: order=${order.id} ref=${reference}`);

    return Response.json({
      success: true,
      order_id: order.id,
      reference_number: reference,
      masked_card: result?.last_4 ? `**** ${result.last_4}` : null,
      card_type: result?.card_type || null,
      amount: result?.auth_amount ?? totals.total,
    });
  } catch (error) {
    console.error('storefrontCheckout error:', error);
    return Response.json({ error: error?.message || 'Checkout failed. Please try again.' }, { status: 500 });
  }
});