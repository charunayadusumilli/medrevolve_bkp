import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      nonce,              // nonce token from QBI Hosted Tokenization iframe
      expiryMonth,
      expiryYear,
      avsZip,
      amount,             // total charge amount in USD (float)
      customerName,
      customerEmail,
      customerPhone,
      items,              // cart line items for reporting
      mode = 'payment',   // 'payment' = capture now | 'setup' = auth-only $0.01 (voided after)
      shippingInfo
    } = await req.json();

    // ── Validate required fields ──
    if (!nonce) {
      return Response.json({ error: 'Missing payment token (nonce). Please re-enter your card details.' }, { status: 400 });
    }
    if (mode === 'payment' && (!amount || amount < 0.01)) {
      return Response.json({ error: 'Invalid charge amount.' }, { status: 400 });
    }

    // ── Read QBI gateway credentials ──
    const sourceKey = Deno.env.get("QBI_GATEWAY_SOURCE_KEY");
    const pin = Deno.env.get("QBI_GATEWAY_PIN");

    if (!sourceKey) {
      console.error('QBI_GATEWAY_SOURCE_KEY secret is not set');
      return Response.json({
        error: 'Payment gateway not configured. Add QBI_GATEWAY_SOURCE_KEY in Settings → Secrets.'
      }, { status: 500 });
    }

    // ── Build Basic Auth header (source_key:pin) ──
    const basicAuth = btoa(`${sourceKey}:${pin || ''}`);

    // ── Build the charge payload ──
    // Setup mode: auth-only $0.01 (capture=false), voided immediately to verify the card
    // Payment mode: capture the full amount
    const chargeAmount = mode === 'setup' ? 0.01 : amount;
    const capture = mode === 'payment';

    const payload: Record<string, unknown> = {
      source: `nonce-${nonce}`,
      amount: chargeAmount,
      name: customerName || shippingInfo?.fullName || '',
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      capture,
      save_card: false,
      transaction_details: {
        description: items
          ? items.map((i: { name: string; quantity: number }) => `${i.quantity}× ${i.name}`).join(', ').substring(0, 200)
          : mode === 'setup' ? 'Card authorization (setup only)' : 'MedRevolve B2B services',
        invoice_number: `MR-${Date.now()}`,
      },
    };

    if (avsZip) payload.avs_zip = avsZip;

    // Add billing info if available
    if (customerEmail || shippingInfo?.email) {
      payload.billing_info = {
        email: customerEmail || shippingInfo?.email,
        phone: customerPhone || shippingInfo?.phone,
      };
    }

    // Add line items for Level 3 reporting (optional, improves interchange rates)
    if (mode === 'payment' && items && items.length > 0) {
      payload.line_items = items.map((item: { name: string; price: number; quantity: number }, idx: number) => ({
        sku: `SKU-${idx + 1}`,
        description: item.name,
        cost: item.price,
        quantity: item.quantity,
      }));
    }

    // ── Call QBI Gateway API ──
    const apiUrl = 'https://api.qbigateway.com/api/v2/transactions/charge';

    console.log(`QBI charge: mode=${mode}, amount=${chargeAmount}, capture=${capture}`);

    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
        'User-Agent': 'MedRevolve-B2B/1.0',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await apiRes.text();
    let chargeResult;
    try {
      chargeResult = JSON.parse(responseText);
    } catch {
      chargeResult = { raw: responseText };
    }

    // ── Handle API errors ──
    if (!apiRes.ok) {
      console.error('QBI charge failed:', apiRes.status, responseText);
      const errorMsg = chargeResult?.error?.message ||
                       chargeResult?.message ||
                       chargeResult?.error ||
                       `Gateway returned status ${apiRes.status}`;
      return Response.json({
        error: typeof errorMsg === 'string' ? errorMsg : 'Payment was declined. Please check your card details.',
        declined: true,
      }, { status: 402 });
    }

    // ── Check if the transaction was approved ──
    const isApproved = chargeResult?.status === 'approved' || chargeResult?.status === 'Authorized';
    const refNum = chargeResult?.refnum || chargeResult?.reference_number || chargeResult?.id;

    if (!isApproved) {
      console.error('QBI transaction not approved:', chargeResult);
      return Response.json({
        error: chargeResult?.error || chargeResult?.message || 'Payment was declined. Please try a different card.',
        declined: true,
        raw: chargeResult,
      }, { status: 402 });
    }

    console.log(`QBI charge approved: ref=${refNum}, status=${chargeResult?.status}`);

    // ── Setup mode: void the $0.01 auth immediately ──
    if (mode === 'setup' && refNum) {
      try {
        const voidUrl = `https://api.qbigateway.com/api/v2/transactions/${refNum}/void`;
        await fetch(voidUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify({}),
        });
        console.log(`QBI void issued for setup auth ${refNum}`);
      } catch (voidErr) {
        console.error('QBI void failed (non-fatal):', voidErr.message);
      }
    }

    // ── Return success ──
    return Response.json({
      success: true,
      mode,
      referenceNumber: refNum,
      status: chargeResult?.status,
      authCode: chargeResult?.auth_code,
      maskedCard: chargeResult?.masked_card,
      cardType: chargeResult?.card_type,
      amount: chargeAmount,
      raw: chargeResult,
    });

  } catch (error) {
    console.error('QBI checkout error:', error);
    return Response.json({
      error: error.message || 'Checkout failed. Please try again.'
    }, { status: 500 });
  }
});