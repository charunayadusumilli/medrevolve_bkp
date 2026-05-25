import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      toName,
      toAddress,
      toCity,
      toState,
      toZip,
      toCountry = 'US',
      weight,
      length,
      width,
      height,
      orderId 
    } = await req.json();

    if (!toName || !toAddress || !toCity || !toState || !toZip || !weight) {
      return Response.json({ 
        error: 'Shipping address and weight are required' 
      }, { status: 400 });
    }

    // Get ShipEngine credentials
    const apiKey = Deno.env.get('SHIPENGINE_API_KEY');
    const carrierId = Deno.env.get('SHIPENGINE_CARRIER_ID') || 'usps'; // Default to USPS

    if (!apiKey) {
      return Response.json({ 
        error: 'ShipEngine not configured. Set SHIPENGINE_API_KEY secret' 
      }, { status: 500 });
    }

    // Create shipment
    const shipmentData = {
      carrier_id: carrierId,
      service_code: 'usps_priority_mail', // Default service
      ship_date: new Date().toISOString(),
      is_return: false,
      packages: [{
        package_code: 'package',
        weight: {
          value: parseFloat(weight),
          unit: 'ounce'
        },
        dimensions: {
          unit: 'inch',
          length: parseFloat(length || 10),
          width: parseFloat(width || 8),
          height: parseFloat(height || 4)
        }
      }],
      ship_to: {
        name: toName,
        phone: '555-555-5555',
        address_line1: toAddress,
        city: toCity,
        state_or_province: toState,
        postal_code: toZip,
        country_code: toCountry
      },
      ship_from: {
        name: 'MedRevolve Pharmacy',
        phone: '240-387-5224',
        address_line1: '123 Business Park Dr',
        city: 'Gaithersburg',
        state_or_province: 'MD',
        postal_code: '20878',
        country_code: 'US'
      },
      advanced_options: {
        bill_to_party: 'shipper',
        insurance_provider: 'none'
      }
    };

    // Create rate and purchase label
    const rateResponse = await fetch('https://api.shipengine.com/v1/rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shipmentData)
    });

    if (!rateResponse.ok) {
      const errorData = await rateResponse.json();
      console.error('ShipEngine rate error:', errorData);
      return Response.json({ 
        error: 'Failed to get shipping rates', 
        details: errorData 
      }, { status: 500 });
    }

    const rateData = await rateResponse.json();
    const rateId = rateData.rates?.[0]?.rate_id;

    if (!rateId) {
      return Response.json({ error: 'No rates available for this shipment' }, { status: 400 });
    }

    // Purchase the label
    const labelResponse = await fetch('https://api.shipengine.com/v1/labels', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rate_id: rateId
      })
    });

    if (!labelResponse.ok) {
      const errorData = await labelResponse.json();
      console.error('ShipEngine label error:', errorData);
      return Response.json({ 
        error: 'Failed to create shipping label', 
        details: errorData 
      }, { status: 500 });
    }

    const labelData = await labelResponse.json();
    const labelId = labelData.label_id;
    const labelUrl = labelData.label_download_url?.pdf;
    const trackingNumber = labelData.tracking_number;
    const carrierCode = labelData.carrier_code;
    const cost = rateData.rates?.[0]?.amount;

    console.log('✅ Shipping label created:', labelId);

    // Update order with tracking info
    if (orderId) {
      try {
        await base44.asServiceRole.entities.MerchantOrder.update(orderId, {
          tracking_number: trackingNumber,
          status: 'in_transit',
          notes: `ShipEngine Label: ${labelId}, Carrier: ${carrierCode}`
        });
      } catch (err) {
        console.warn('Could not update order with tracking:', err);
      }
    }

    return Response.json({
      success: true,
      label_id: labelId,
      label_url: labelUrl,
      tracking_number: trackingNumber,
      carrier: carrierCode,
      cost: cost,
      message: 'Shipping label created successfully'
    });

  } catch (error) {
    console.error('ShipEngine shipping error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});