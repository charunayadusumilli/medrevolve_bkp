import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { userEmail, currentProductId, limit = 4 } = await req.json();

        // Fetch user's browsing history
        const browsingHistory = await base44.asServiceRole.entities.BrowsingHistory.filter(
            { user_email: userEmail },
            '-updated_date',
            20
        );

        // Get all products
        const allProducts = [
            { id: 'semaglutide', name: 'Semaglutide', category: 'weight', price: 299, subtitle: 'FDA-Approved Weight Loss' },
            { id: 'tirzepatide', name: 'Tirzepatide', category: 'weight', price: 399, subtitle: 'Advanced GLP-1 Therapy' },
            { id: 'phentermine', name: 'Phentermine', category: 'weight', price: 149, subtitle: 'Appetite Suppressant' },
            { id: 'testosterone', name: 'Testosterone Therapy', category: 'hormone', price: 249, subtitle: 'Hormone Optimization' },
            { id: 'estrogen', name: 'Estrogen Therapy', category: 'hormone', price: 229, subtitle: 'Balance & Wellness' },
            { id: 'thyroid', name: 'Thyroid Optimization', category: 'hormone', price: 199, subtitle: 'Metabolic Support' },
            { id: 'nad', name: 'NAD+ Therapy', category: 'longevity', price: 349, subtitle: 'Cellular Rejuvenation' },
            { id: 'metformin', name: 'Metformin', category: 'longevity', price: 89, subtitle: 'Longevity & Metabolic Health' },
            { id: 'rapamycin', name: 'Rapamycin', category: 'longevity', price: 279, subtitle: 'Lifespan Extension' }
        ];

        // Filter out current product
        const availableProducts = allProducts.filter(p => p.id !== currentProductId);

        // Build context for AI
        const viewedProducts = browsingHistory.map(h => ({
            name: h.product_name,
            category: h.product_category,
            views: h.view_count
        }));

        const currentProduct = allProducts.find(p => p.id === currentProductId);

        const prompt = `You are a wellness product recommendation expert. Based on the user's browsing behavior, recommend ${limit} products that would be most relevant to them.

User's Browsing History:
${viewedProducts.length > 0 ? JSON.stringify(viewedProducts, null, 2) : 'No browsing history yet'}

${currentProduct ? `Currently Viewing: ${currentProduct.name} (${currentProduct.category} category)` : 'Homepage'}

Available Products:
${JSON.stringify(availableProducts, null, 2)}

Instructions:
1. If user has browsing history, recommend products related to their interests
2. If currently viewing a product, recommend complementary products or alternatives in same category
3. If no history, recommend popular/beginner-friendly products across categories
4. Return ONLY an array of ${limit} product IDs in order of relevance
5. Consider cross-selling opportunities (e.g., weight loss + hormone therapy)

Return format: ["product_id_1", "product_id_2", "product_id_3", "product_id_4"]`;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    recommendations: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        });

        const recommendedIds = response.recommendations.slice(0, limit);
        const recommendedProducts = recommendedIds
            .map(id => allProducts.find(p => p.id === id))
            .filter(p => p !== undefined);

        return Response.json({ 
            success: true, 
            recommendations: recommendedProducts,
            personalized: viewedProducts.length > 0 || currentProduct !== null
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});