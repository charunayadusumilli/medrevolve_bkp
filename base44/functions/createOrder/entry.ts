import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { items, shippingInfo, total, tax, subtotal, stripeSessionId } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!shippingInfo || !shippingInfo.email) {
      return Response.json({ error: 'Shipping email is required' }, { status: 400 });
    }

    // Create order
    const order = await base44.asServiceRole.entities.Order.create({
      customer_email: shippingInfo.email,
      customer_name: shippingInfo.fullName,
      items: items,
      shipping_address: shippingInfo.address,
      shipping_city: shippingInfo.city,
      shipping_state: shippingInfo.state,
      shipping_zip: shippingInfo.zipCode,
      shipping_phone: shippingInfo.phone || '',
      subtotal: subtotal,
      tax: tax,
      total: total,
      stripe_session_id: stripeSessionId,
      status: 'paid'
    });

    // Send confirmation email to customer
    try {
      const itemsList = items
        .map(item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
        .join('\n');

      await base44.integrations.Core.SendEmail({
        to: shippingInfo.email,
        subject: 'Order Confirmation - MedRevolve',
        body: `Hi ${shippingInfo.fullName},

Thank you for your order! We've received your payment and your order is being processed.

Order Details:
${itemsList}

Subtotal: $${subtotal.toFixed(2)}
Tax: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

Shipping to:
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}

Your order will be reviewed and prepared for shipment. You'll receive a tracking number via email once it ships.

If you have any questions, please reply to this email or contact us at support@medrevolve.com.

Best regards,
MedRevolve Team`
      });
    } catch (emailErr) {
      console.error('Customer email error:', emailErr);
    }

    // Send alert to admin
    try {
      const adminEmail = Deno.env.get('ADMIN_EMAIL');
      if (adminEmail) {
        const itemsList = items
          .map(item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
          .join('\n');

        await base44.integrations.Core.SendEmail({
          to: adminEmail,
          subject: `New Order: ${shippingInfo.fullName} - $${total.toFixed(2)}`,
          body: `New order received!

Customer: ${shippingInfo.fullName}
Email: ${shippingInfo.email}
Phone: ${shippingInfo.phone || 'N/A'}

Items:
${itemsList}

Total: $${total.toFixed(2)}

Shipping Address:
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}

Order ID: ${order.id}
Status: Processing

Action: Review and prepare for shipment.`
        });
      }
    } catch (adminErr) {
      console.error('Admin email error:', adminErr);
    }

    console.log('Order created:', order.id);

    return Response.json({
      success: true,
      order_id: order.id,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    return Response.json({
      error: error.message || 'Failed to create order'
    }, { status: 500 });
  }
});