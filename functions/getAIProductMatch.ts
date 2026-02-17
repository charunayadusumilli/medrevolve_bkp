import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { userGoals, medicalHistory, age, gender } = await req.json();

        // Fetch all available products
        const products = await base44.asServiceRole.entities.Product.filter({ 
            available: true 
        });

        const prompt = `You are a medical wellness AI assistant. Based on the user's profile, recommend the top 3 most suitable products.

User Profile:
- Goals: ${userGoals || 'General wellness'}
- Medical History: ${medicalHistory || 'None disclosed'}
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}

Available Products:
${JSON.stringify(products.map(p => ({
    id: p.product_id,
    name: p.name,
    category: p.category,
    description: p.description
})), null, 2)}

Instructions:
1. Match products to user's stated goals
2. Consider age and gender appropriateness
3. Prioritize FDA-approved and clinically proven options
4. Return 3 product IDs in order of best fit
5. Include a brief 1-sentence reason for each recommendation

Return format:
{
    "recommendations": [
        {"product_id": "...", "reason": "..."},
        {"product_id": "...", "reason": "..."},
        {"product_id": "...", "reason": "..."}
    ]
}`;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    recommendations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                product_id: { type: "string" },
                                reason: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        // Enrich with full product details
        const enrichedRecommendations = response.recommendations.map(rec => {
            const product = products.find(p => p.product_id === rec.product_id);
            return {
                ...rec,
                product: product || null
            };
        }).filter(r => r.product !== null);

        return Response.json({ 
            success: true,
            recommendations: enrichedRecommendations
        });
    } catch (error) {
        console.error('Error getting AI product match:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});