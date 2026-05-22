/**
 * submitPureRxOrder
 * ─────────────────────────────────────────────────────────────────────────────
 * Submits a patient order (GLP or RUO) to PureRx for fulfillment.
 * Called from checkout completion, prescription approval, or AutoRx triggers.
 * 
 * Payload:
 *   orderId         - MedRevolve Order entity ID
 *   orderType       - 'GLP' | 'RUO' | 'SUPPLEMENT'
 *   patientEmail    - Patient email
 *   prescriptionId  - (GLP only) Prescription entity ID
 *   items           - Array of { product_id, supplier_product_id, quantity, dosage }
 *   shippingAddress - { name, address, city, state, zip, phone }
 * 
 * Secrets required: PURERX_API_KEY, PURERX_SECRET
 * Domain: B2C (GLP), RUO
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PURERX_BASE_URL = 'https://api.purerx.org/v1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      orderId,
      orderType = 'GLP',
      patientEmail,
      prescriptionId,
      items = [],
      shippingAddress = {},
      providerNpi,
      diagnosisCode,
    } = await req.json();

    if (!orderId || !patientEmail || !items.length || !shippingAddress.address) {
      return Response.json({
        error: 'Missing required fields: orderId, patientEmail, items, shippingAddress',
      }, { status: 400 });
    }

    const PURERX_API_KEY = Deno.env.get('PURERX_API_KEY');
    const PURERX_SECRET = Deno.env.get('PURERX_SECRET');

    if (!PURERX_API_KEY || !PURERX_SECRET) {
      // Log the order internally for manual processing
      console.warn('PureRx not configured — logging order for manual processing:', orderId);
      await base44.asServiceRole.entities.Order.update(orderId, {
        status: 'pending_pharmacy',
        fulfillment_note: 'PureRx integration pending — manual processing required',
        updated_at: new Date().toISOString(),
      });

      // Alert admin
      const adminEmail = Deno.env.get('ADMIN_EMAIL');
      if (adminEmail) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Pharmacy',
          to: adminEmail,
          subject: `⚠️ Manual Fulfillment Required — Order ${orderId}`,
          body: `A new order requires manual pharmacy processing (PureRx not yet configured).

Order ID: ${orderId}
Type: ${orderType}
Patient: ${patientEmail}
Items: ${items.map(i => `${i.product_name || i.product_id} x${i.quantity}`).join(', ')}

Please process manually and configure PURERX_API_KEY and PURERX_SECRET to automate this.`,
        });
      }

      return Response.json({
        success: false,
        mode: 'manual',
        message: 'PureRx not configured. Order logged for manual processing. Admin notified.',
        orderId,
      });
    }

    console.log(`Submitting ${orderType} order ${orderId} to PureRx for patient ${patientEmail}`);

    // Build PureRx order payload
    const purerxPayload = {
      externalOrderId: orderId,
      orderType: orderType.toLowerCase(),
      patient: {
        email: patientEmail,
        shippingAddress: {
          name: shippingAddress.name || '',
          address1: shippingAddress.address || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          zipCode: shippingAddress.zip || '',
          phone: shippingAddress.phone || '',
        },
      },
      items: items.map(item => ({
        productId: item.supplier_product_id || item.product_id,
        quantity: item.quantity || 1,
        dosage: item.dosage || null,
        instructions: item.instructions || null,
      })),
      prescription: prescriptionId ? {
        internalId: prescriptionId,
        providerNpi: providerNpi || null,
        diagnosisCode: diagnosisCode || null,
      } : null,
      metadata: {
        platform: 'MedRevolve',
        appId: Deno.env.get('BASE44_APP_ID'),
        submittedAt: new Date().toISOString(),
      },
    };

    const res = await fetch(`${PURERX_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PURERX_API_KEY}`,
        'X-PureRx-Secret': PURERX_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purerxPayload),
    });

    const responseData = await res.json();

    if (res.ok) {
      const purerxOrderId = responseData.orderId || responseData.id;
      console.log('PureRx order submitted successfully:', purerxOrderId);

      // Update internal order with PureRx reference
      await base44.asServiceRole.entities.Order.update(orderId, {
        status: 'sent_to_pharmacy',
        pharmacy_order_id: purerxOrderId,
        pharmacy_name: 'PureRx',
        sent_to_pharmacy_at: new Date().toISOString(),
      });

      // Update prescription if provided
      if (prescriptionId) {
        await base44.asServiceRole.entities.Prescription.update(prescriptionId, {
          status: 'sent_to_pharmacy',
          pharmacy_name: 'PureRx',
          sent_to_pharmacy_at: new Date().toISOString(),
        });
      }

      return Response.json({
        success: true,
        mode: 'purerx',
        purerxOrderId,
        estimatedDelivery: responseData.estimatedDelivery || null,
        trackingInfo: responseData.tracking || null,
        status: 'sent_to_pharmacy',
      });

    } else {
      console.error('PureRx order submission failed:', res.status, responseData);

      await base44.asServiceRole.entities.Order.update(orderId, {
        status: 'pharmacy_error',
        fulfillment_note: `PureRx error ${res.status}: ${responseData.message || responseData.error || 'Unknown error'}`,
      });

      return Response.json({
        success: false,
        error: `PureRx error ${res.status}`,
        details: responseData,
        orderId,
      }, { status: 502 });
    }

  } catch (error) {
    console.error('submitPureRxOrder error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});