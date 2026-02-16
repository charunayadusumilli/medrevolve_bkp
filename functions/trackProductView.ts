import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const { productId, productName, productCategory } = await req.json();

        // Check if this user already viewed this product
        const existing = await base44.entities.BrowsingHistory.filter({
            user_email: user.email,
            product_id: productId
        });

        if (existing.length > 0) {
            // Update view count
            await base44.entities.BrowsingHistory.update(existing[0].id, {
                view_count: existing[0].view_count + 1
            });
        } else {
            // Create new browsing history entry
            await base44.entities.BrowsingHistory.create({
                user_email: user.email,
                product_id: productId,
                product_name: productName,
                product_category: productCategory,
                view_count: 1
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error tracking product view:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});