import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { creatorEmail, customerEmail, orderValue, referralCode } = await req.json();

        if (!creatorEmail || !customerEmail || !orderValue) {
            return Response.json({ 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        // Get creator metrics
        const metrics = await base44.asServiceRole.entities.CreatorMetrics.filter({
            creator_email: creatorEmail
        });

        if (metrics.length === 0) {
            console.error('Creator metrics not found:', creatorEmail);
            return Response.json({ 
                error: 'Creator not found' 
            }, { status: 404 });
        }

        const creatorMetrics = metrics[0];

        // Calculate commission based on tier
        const commissionRates = {
            bronze: 0.10,   // 10%
            silver: 0.15,   // 15%
            gold: 0.20,     // 20%
            platinum: 0.25  // 25%
        };

        const rate = commissionRates[creatorMetrics.current_tier] || 0.10;
        const commission = orderValue * rate;

        // Update creator metrics
        await base44.asServiceRole.entities.CreatorMetrics.update(creatorMetrics.id, {
            total_conversions: (creatorMetrics.total_conversions || 0) + 1,
            total_revenue_generated: (creatorMetrics.total_revenue_generated || 0) + orderValue,
            total_commission_earned: (creatorMetrics.total_commission_earned || 0) + commission,
            monthly_conversions: (creatorMetrics.monthly_conversions || 0) + 1,
            monthly_revenue: (creatorMetrics.monthly_revenue || 0) + orderValue,
            monthly_commission: (creatorMetrics.monthly_commission || 0) + commission
        });

        // Check for tier upgrade
        const totalRevenue = (creatorMetrics.total_revenue_generated || 0) + orderValue;
        let newTier = creatorMetrics.current_tier;

        if (totalRevenue >= 100000) newTier = 'platinum';
        else if (totalRevenue >= 50000) newTier = 'gold';
        else if (totalRevenue >= 20000) newTier = 'silver';
        else newTier = 'bronze';

        if (newTier !== creatorMetrics.current_tier) {
            await base44.asServiceRole.entities.CreatorMetrics.update(creatorMetrics.id, {
                current_tier: newTier
            });

            // Notify creator of tier upgrade
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: creatorEmail,
                subject: `🎉 You've Been Upgraded to ${newTier.toUpperCase()} Tier!`,
                body: `
                    <h2>Congratulations!</h2>
                    <p>You've been upgraded to <strong>${newTier.toUpperCase()}</strong> tier!</p>
                    <p>Your new commission rate is <strong>${(commissionRates[newTier] * 100)}%</strong></p>
                    <p>Keep up the great work!</p>
                `
            });
        }

        console.log('Creator commission processed:', {
            creator: creatorEmail,
            commission: commission,
            tier: newTier
        });

        return Response.json({ 
            success: true,
            commission: commission,
            tier: newTier,
            upgraded: newTier !== creatorMetrics.current_tier
        });
    } catch (error) {
        console.error('Error processing creator commission:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});