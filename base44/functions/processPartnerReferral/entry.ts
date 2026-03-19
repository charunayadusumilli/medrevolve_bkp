import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { partnerCode, customerEmail, productId, orderValue } = await req.json();

        if (!partnerCode || !customerEmail || !productId || !orderValue) {
            return Response.json({ 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        // Find partner by code
        const partners = await base44.asServiceRole.entities.Partner.filter({ 
            partner_code: partnerCode 
        });

        if (partners.length === 0) {
            return Response.json({ 
                error: 'Invalid partner code' 
            }, { status: 404 });
        }

        const partner = partners[0];

        // Calculate partner earnings (markup percentage of order value)
        const partnerEarnings = orderValue * (partner.pricing_markup_percentage / 100);

        // Create referral record
        const referral = await base44.asServiceRole.entities.PartnerReferral.create({
            partner_id: partner.id,
            customer_email: customerEmail,
            product_id: productId,
            order_value: orderValue,
            partner_earnings: partnerEarnings,
            status: 'pending'
        });

        // Update partner stats
        await base44.asServiceRole.entities.Partner.update(partner.id, {
            total_referrals: (partner.total_referrals || 0) + 1,
            total_earnings: (partner.total_earnings || 0) + partnerEarnings
        });

        console.log('Partner referral processed:', {
            partner: partner.business_name,
            earnings: partnerEarnings,
            customer: customerEmail
        });

        return Response.json({ 
            success: true, 
            referralId: referral.id,
            partnerEarnings: partnerEarnings
        });
    } catch (error) {
        console.error('Error processing partner referral:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});