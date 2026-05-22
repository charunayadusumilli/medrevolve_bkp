/**
 * pureRxWebhook
 * ─────────────────────────────────────────────────────────────────────────────
 * Receives fulfillment status updates from PureRx and syncs them to
 * MedRevolve Order, Prescription, and patient notification pipelines.
 * 
 * PureRx webhook events:
 *   order.confirmed      - Order received and processing
 *   order.in_transit     - Shipped with tracking
 *   order.delivered      - Delivered to patient
 *   order.failed         - Fulfillment failed
 *   order.cancelled      - Order cancelled
 * 
 * Security: Validates X-PureRx-Signature header using PURERX_WEBHOOK_SECRET
 * Domain: CROSS
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Signature verification
    const PURERX_WEBHOOK_SECRET = Deno.env.get('PURERX_WEBHOOK_SECRET');
    if (PURERX_WEBHOOK_SECRET) {
      const signature = req.headers.get('X-PureRx-Signature');
      const body = await req.text();

      if (!signature) {
        console.error('PureRx webhook: Missing signature header');
        return Response.json({ error: 'Missing signature' }, { status: 401 });
      }

      // Verify HMAC-SHA256 signature
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw', encoder.encode(PURERX_WEBHOOK_SECRET),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
      );
      const expectedSig = Array.from(
        new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(body)))
      ).map(b => b.toString(16).padStart(2, '0')).join('');

      if (`sha256=${expectedSig}` !== signature) {
        console.error('PureRx webhook: Signature mismatch');
        return Response.json({ error: 'Invalid signature' }, { status: 401 });
      }

      const payload = JSON.parse(body);
      return await processWebhookPayload(base44, payload);
    } else {
      // No secret configured — process without signature check (dev mode)
      console.warn('PURERX_WEBHOOK_SECRET not set — processing without signature verification');
      const payload = await req.json();
      return await processWebhookPayload(base44, payload);
    }

  } catch (error) {
    console.error('pureRxWebhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function processWebhookPayload(base44, payload) {
  const { event, orderId: purerxOrderId, externalOrderId, data = {} } = payload;

  console.log(`PureRx webhook received: event=${event}, purerxOrderId=${purerxOrderId}, internalId=${externalOrderId}`);

  if (!externalOrderId) {
    console.warn('PureRx webhook: No externalOrderId — cannot map to internal order');
    return Response.json({ received: true, warning: 'No externalOrderId' });
  }

  // Map PureRx event to internal status
  const statusMap = {
    'order.confirmed':   'confirmed',
    'order.processing':  'processing',
    'order.in_transit':  'in_transit',
    'order.shipped':     'in_transit',
    'order.delivered':   'delivered',
    'order.failed':      'pharmacy_error',
    'order.cancelled':   'cancelled',
  };

  const newStatus = statusMap[event];
  if (!newStatus) {
    console.warn(`PureRx webhook: Unknown event type: ${event}`);
    return Response.json({ received: true, warning: `Unknown event: ${event}` });
  }

  // Update Order
  const orderUpdates = {
    status: newStatus,
    pharmacy_order_id: purerxOrderId,
    updated_at: new Date().toISOString(),
  };

  if (data.tracking_number) orderUpdates.tracking_number = data.tracking_number;
  if (data.tracking_url)    orderUpdates.tracking_url = data.tracking_url;
  if (data.carrier)         orderUpdates.carrier = data.carrier;
  if (data.estimated_delivery) orderUpdates.estimated_delivery = data.estimated_delivery;
  if (data.delivered_at)    orderUpdates.delivered_at = data.delivered_at;

  await base44.asServiceRole.entities.Order.update(externalOrderId, orderUpdates);
  console.log(`Order ${externalOrderId} updated to status: ${newStatus}`);

  // Find linked prescription and update
  const orders = await base44.asServiceRole.entities.Order.filter({ id: externalOrderId });
  const order = orders[0];

  if (order?.prescription_id) {
    const prescriptionUpdates = { status: newStatus === 'in_transit' ? 'dispensed' : newStatus };
    if (newStatus === 'in_transit') prescriptionUpdates.dispensed_at = new Date().toISOString();
    await base44.asServiceRole.entities.Prescription.update(order.prescription_id, prescriptionUpdates);
  }

  // Send patient notification for key events
  const notifyEvents = ['order.in_transit', 'order.delivered', 'order.failed'];
  if (notifyEvents.includes(event) && order?.patient_email) {
    const emailSubjects = {
      'order.in_transit': `📦 Your order is on the way!`,
      'order.delivered':  `✅ Your order has been delivered`,
      'order.failed':     `⚠️ Issue with your order`,
    };
    const emailBodies = {
      'order.in_transit': `Your MedRevolve order has been shipped!\n\nTracking Number: ${data.tracking_number || 'See pharmacy portal'}\nCarrier: ${data.carrier || 'N/A'}\nEstimated Delivery: ${data.estimated_delivery || 'TBD'}\n\nYou can track your package using the tracking number above.\n\nMedRevolve Care Team`,
      'order.delivered':  `Great news — your order has been delivered!\n\nIf you have any questions about your medication or supplements, don't hesitate to reach out through your patient portal.\n\nMedRevolve Care Team`,
      'order.failed':     `We encountered an issue processing your order. Our team has been notified and will reach out within 24 hours to resolve this.\n\nOrder Reference: ${externalOrderId}\n\nApologies for the inconvenience.\n\nMedRevolve Care Team`,
    };

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Pharmacy',
      to: order.patient_email,
      subject: emailSubjects[event],
      body: emailBodies[event],
    });
    console.log(`Patient notification sent for event: ${event} to ${order.patient_email}`);
  }

  return Response.json({
    received: true,
    event,
    externalOrderId,
    newStatus,
    processed_at: new Date().toISOString(),
  });
}