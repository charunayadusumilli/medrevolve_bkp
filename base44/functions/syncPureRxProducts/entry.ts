/**
 * syncPureRxProducts
 * ─────────────────────────────────────────────────────────────────────────────
 * Syncs product catalog from PureRx API into the MedRevolve Product entity.
 * Maps GLP-1, RUO, and wellness products from PureRx into internal product records.
 * 
 * Scheduled: Run daily. Also callable manually by admin.
 * Secrets required: PURERX_API_KEY, PURERX_SECRET
 * 
 * Domain: CROSS (serves B2C GLP + RUO)
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PURERX_BASE_URL = 'https://api.purerx.org/v1';

// Map PureRx product types to our internal product_type enum
function mapProductType(purerxCategory) {
  const cat = (purerxCategory || '').toLowerCase();
  if (cat.includes('glp') || cat.includes('semaglutide') || cat.includes('tirzepatide')) return 'GLP';
  if (cat.includes('ruo') || cat.includes('research') || cat.includes('peptide')) return 'RUO';
  if (cat.includes('supplement') || cat.includes('wellness') || cat.includes('otc')) return 'supplement';
  return 'other';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth: admin only
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const PURERX_API_KEY = Deno.env.get('PURERX_API_KEY');
    const PURERX_SECRET = Deno.env.get('PURERX_SECRET');

    if (!PURERX_API_KEY || !PURERX_SECRET) {
      return Response.json({
        error: 'PureRx credentials not configured',
        message: 'Set PURERX_API_KEY and PURERX_SECRET in app secrets to enable PureRx catalog sync.',
        action_required: true,
        secrets_needed: ['PURERX_API_KEY', 'PURERX_SECRET'],
      });
    }

    console.log('Starting PureRx product catalog sync...');

    // Fetch products from PureRx
    const res = await fetch(`${PURERX_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${PURERX_API_KEY}`,
        'X-PureRx-Secret': PURERX_SECRET,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('PureRx API error:', res.status, errText);
      return Response.json({ error: `PureRx API error: ${res.status}`, details: errText }, { status: 502 });
    }

    const { products: purerxProducts = [] } = await res.json();
    console.log(`PureRx returned ${purerxProducts.length} products`);

    // Get existing MedRevolve products with purerx_supplier_id
    const existingProducts = await base44.asServiceRole.entities.Product.list('-created_date', 500);
    const existingByPureRxId = {};
    existingProducts.forEach(p => {
      if (p.supplier_product_id) existingByPureRxId[p.supplier_product_id] = p;
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const purerxProduct of purerxProducts) {
      const productType = mapProductType(purerxProduct.category);
      const productData = {
        name: purerxProduct.name,
        description: purerxProduct.description || '',
        product_type: productType,
        supplier_product_id: purerxProduct.id || purerxProduct.sku,
        supplier_name: 'PureRx',
        category: productType === 'GLP' ? 'weight_loss' :
                  productType === 'RUO' ? 'peptides' : 'other',
        price: purerxProduct.price || purerxProduct.wholesale_price || 0,
        is_active: purerxProduct.available !== false,
        compliance_notes: productType === 'RUO'
          ? 'For Research Use Only - Not for human use'
          : productType === 'GLP'
          ? 'Prescription Required - 503A/503B Pharmacy'
          : '',
        last_synced_at: new Date().toISOString(),
        raw_supplier_data: purerxProduct,
      };

      const existing = existingByPureRxId[productData.supplier_product_id];
      if (existing) {
        await base44.asServiceRole.entities.Product.update(existing.id, productData);
        updated++;
      } else {
        await base44.asServiceRole.entities.Product.create(productData);
        created++;
      }
    }

    console.log(`PureRx sync complete: ${created} created, ${updated} updated, ${skipped} skipped`);

    return Response.json({
      success: true,
      sync_summary: {
        total_from_purerx: purerxProducts.length,
        created,
        updated,
        skipped,
        synced_at: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('syncPureRxProducts error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});