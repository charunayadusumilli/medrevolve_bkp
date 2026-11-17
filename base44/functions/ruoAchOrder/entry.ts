import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// ACH / wire order request for the RUO storefront.
// Creates a PENDING order priced server-side from the catalog and returns the
// settlement instructions. No payment is captured here and no entitlement is granted.

const RUO_FLAT_SHIPPING = 18;
const RUO_FREE_CASES = 4;
const ACH_THRESHOLD = 2000;

const round = (value) => Math.round(Number(value || 0) * 100) / 100;

function unitFor(product, quantity) {
  const retail = Number(product.retail_price) || 0;
  const tiered = quantity >= 6
    ? Number(product.tier_6_price)
    : quantity >= 3
      ? Number(product.tier_3_price)
      : retail;
  if (tiered > 0) return tiered;
  if (quantity >= 6) return Math.round(retail * 90) / 100;
  if (quantity >= 3) return Math.round(retail * 95) / 100;
  return retail;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const cartLines = Array.isArray(body.lines) ? body.lines.slice(0, 40) : [];
    const customer = body.customer || {};

    if (cartLines.length === 0) return Response.json({ error: 'Your cart is empty' }, { status: 400 });
    if (!customer.email || !String(customer.email).includes('@')) {
      return Response.json({ error: 'A valid email is required for the invoice' }, { status: 400 });
    }
    if (!customer.name || !body.shipAddress || !body.shipCity || !body.shipState || !body.shipZip) {
      return Response.json({ error: 'A complete shipping address is required' }, { status: 400 });
    }
    if (body.ageConfirmed !== true) {
      return Response.json(
        { error: 'Confirm you are 21 or older and buying for laboratory research.' },
        { status: 400 },
      );
    }

    const skus = [...new Set(cartLines.map((l) => String(l.sku || '')).filter(Boolean))];
    if (skus.length === 0) return Response.json({ error: 'No items in cart' }, { status: 400 });

    const { items } = await base44.asServiceRole.entities.RuoProduct.filter({ slug: { $in: skus } }, { limit: 100 });
    const bySlug = new Map(items.map((p) => [p.slug, p]));

    const resolved = [];
    for (const line of cartLines) {
      const product = bySlug.get(line.sku);
      if (!product) return Response.json({ error: `Unknown catalog record ${line.sku}` }, { status: 400 });
      if (product.active === false) return Response.json({ error: `${product.name} is no longer listed` }, { status: 400 });
      if (product.in_stock === false) return Response.json({ error: `${product.name} is unavailable` }, { status: 400 });

      const quantity = Math.max(1, Math.min(Number(line.quantity) || 1, 99));
      const unit = unitFor(product, quantity);
      if (!(unit > 0)) return Response.json({ error: `Pricing is not published for ${product.name}` }, { status: 400 });

      resolved.push({
        sku: product.slug,
        name: `${product.name} ${product.strength_label || ''} - lot ${product.coa_lot || 'pending'}`.trim(),
        unit: round(unit),
        quantity,
      });
    }

    const cases = resolved.reduce((n, l) => n + l.quantity, 0);
    const subtotal = round(resolved.reduce((sum, l) => sum + l.unit * l.quantity, 0));
    const shipping = cases >= RUO_FREE_CASES ? 0 : RUO_FLAT_SHIPPING;
    const total = round(subtotal + shipping);

    if (total < ACH_THRESHOLD) {
      return Response.json(
        { error: `ACH and wire are available on orders of ${ACH_THRESHOLD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} and above. Please pay by card.` },
        { status: 400 },
      );
    }

    const order = await base44.asServiceRole.entities.Order.create({
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone || '',
      items: resolved.map((l) => ({
        product_id: l.sku,
        product_name: l.name,
        price: l.unit,
        quantity: l.quantity,
      })),
      shipping_address: body.shipAddress,
      shipping_city: body.shipCity,
      shipping_state: body.shipState,
      shipping_zip: body.shipZip,
      shipping_phone: customer.phone || '',
      subtotal,
      tax: 0,
      total,
      status: 'pending',
      payment_provider: 'ach_wire',
      notes: `channel=ruo; provider=ach_wire; shipping=${shipping}; cases=${cases}; research_use_confirmed=true; age21=confirmed; age_confirmed_at=${body.ageConfirmedAt || new Date().toISOString()}`,
    });

    return Response.json({
      success: true,
      order_id: order.id,
      total,
      reference: `MR-RUO-${order.id.slice(-8).toUpperCase()}`,
      message: 'Order reserved. Settlement instructions are emailed to the address on file within one business day.',
    });
  } catch (error) {
    console.error('ruoAchOrder error:', error);
    return Response.json({ error: error?.message || 'Order could not be created.' }, { status: 500 });
  }
});