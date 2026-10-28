import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

/**
 * QBI Gateway payment webhook.
 *
 * Storefront charges are confirmed synchronously by storefrontCheckout, so this
 * endpoint is a reconciliation path: it settles orders whose browser response
 * was lost, and records refunds / voids raised in the QBI control panel.
 *
 * Point the QBI webhook at: https://<your-app-domain>/functions/qbiWebhook
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    console.log('QBI webhook received:', JSON.stringify(body).slice(0, 2000));

    // QBI payloads vary by event; read the common shapes.
    const transaction = body?.transaction || body?.data || body?.payload || body;
    const reference = String(
      transaction?.reference_number || transaction?.reference || transaction?.transaction_id || ''
    );
    const invoice = String(transaction?.invoice_number || transaction?.transaction_details?.invoice_number || '');
    const status = String(transaction?.status || transaction?.status_code || '').toLowerCase();
    const amount = Number(transaction?.amount ?? transaction?.auth_amount ?? 0);
    const event = String(body?.event || body?.event_type || body?.type || '').toLowerCase();

    const isRefund = ['refund', 'refunded', 'void', 'voided', 'reversal'].some((k) => event.includes(k) || status.includes(k));
    const isApproved = status === 'approved' || status === 'a' || status === 'partially approved' || event.includes('approv') || event.includes('captur');

    if (!reference && !invoice) {
      console.log('QBI webhook: no reference or invoice in payload, ignoring');
      return Response.json({ received: true, matched: false });
    }

    // Match the order we created: reference first, then invoice number in notes.
    let order = null;
    if (reference) {
      const { items } = await base44.asServiceRole.entities.Order.filter({ payment_reference: reference }, { limit: 1 });
      order = items?.[0] || null;
    }
    if (!order && invoice) {
      const { items } = await base44.asServiceRole.entities.Order.filter({}, { sort: '-created_date', limit: 50 });
      order = items.find((o) => (o.notes || '').includes(invoice) || o.id.slice(-8).toUpperCase() === invoice.replace(/^MR-/, '')) || null;
    }

    if (!order) {
      console.log(`QBI webhook: no order matched (ref=${reference}, invoice=${invoice})`);
      return Response.json({ received: true, matched: false });
    }

    if (isRefund) {
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: 'refunded',
        notes: `${order.notes || ''}; qbi_webhook=refund amount=${amount || 'n/a'}${reference ? ` ref=${reference}` : ''}`,
      });
      return Response.json({ received: true, matched: true, status: 'refunded' });
    }

    // Settle a charge that the checkout response lost: only when the order is
    // still pending and the confirmed amount matches what we charged.
    const amountMatches = Math.abs(amount - Number(order.total || 0)) < 0.01;
    if (isApproved && order.status === 'pending' && amountMatches) {
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: 'paid',
        payment_provider: 'qbi',
        payment_reference: reference || order.payment_reference || '',
        notes: `${order.notes || ''}; qbi_webhook=settled amount=${amount}`,
      });
      return Response.json({ received: true, matched: true, status: 'paid' });
    }

    console.log(`QBI webhook: recorded only (order=${order.id} status=${order.status} event=${event} amount=${amount})`);
    return Response.json({ received: true, matched: true, status: order.status });
  } catch (error) {
    console.error('QBI webhook error:', error);
    return Response.json({ received: false, error: error?.message || 'Webhook failed' }, { status: 500 });
  }
});