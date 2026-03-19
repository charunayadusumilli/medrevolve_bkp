import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { currentProductId, limit = 4 } = await req.json();

    // Fetch all products
    const allProducts = await base44.asServiceRole.entities.Product.list();

    // Try to get user data if authenticated
    let userContext = '';
    let browsingHistory = [];
    let questionnairData = null;

    try {
      const user = await base44.auth.me();
      if (user) {
        // Fetch browsing history
        const history = await base44.asServiceRole.entities.BrowsingHistory.filter({
          user_email: user.email
        });
        browsingHistory = history;

        // Fetch questionnaire responses
        const responses = await base44.asServiceRole.entities.PatientIntake.filter({
          email: user.email
        });
        if (responses.length > 0) {
          questionnairData = responses[0];
        }

        userContext = `
User Email: ${user.email}
Browsing History: ${browsingHistory.map(h => `${h.product_name} (${h.product_category})`).join(', ')}
${questionnairData ? `Primary Interest: ${questionnairData.primary_goal}` : ''}
        `.trim();
      }
    } catch (_) {
      // User not authenticated, use only product data
    }

    // Filter out current product
    let productsToRecommend = allProducts;
    if (currentProductId) {
      productsToRecommend = allProducts.filter(
        p => p.product_id !== currentProductId && p.id !== currentProductId
      );
    }

    // Build product context
    const productContext = productsToRecommend
      .slice(0, 15)
      .map(p => `- ${p.name} (${p.category}): ${p.description || p.subtitle}`)
      .join('\n');

    // Use AI to generate recommendations
    const recommendations = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a telehealth product recommendation specialist. Based on the user's profile and browsing patterns, recommend the top ${limit} products that would be most beneficial and relevant.

${userContext ? `USER PROFILE:\n${userContext}\n` : ''}

AVAILABLE PRODUCTS:
${productContext}

Please recommend exactly ${limit} products from the list. For each recommendation, provide:
1. Product name (must exactly match one from the available products)
2. Brief reason why it's recommended (1-2 sentences)
3. Relevance score (1-10)

Format as JSON array with objects containing: { name, reason, relevanceScore }`,
      response_json_schema: {
        type: 'object',
        properties: {
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                reason: { type: 'string' },
                relevanceScore: { type: 'number' }
              }
            }
          }
        }
      }
    });

    // Map recommendations to actual products
    const recommendedProducts = recommendations.recommendations
      .map(rec => {
        const product = productsToRecommend.find(
          p => p.name.toLowerCase() === rec.name.toLowerCase()
        );
        return product ? {
          id: product.product_id || product.id,
          name: product.name,
          category: product.category,
          price: product.minimum_price || 199,
          subtitle: product.subtitle || product.description,
          reason: rec.reason,
          relevanceScore: rec.relevanceScore
        } : null;
      })
      .filter(Boolean)
      .slice(0, limit);

    return Response.json({
      recommendations: recommendedProducts,
      personalized: !!userContext
    });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    
    // Fallback: return random products
    try {
      const base44 = createClientFromRequest(req);
      const allProducts = await base44.asServiceRole.entities.Product.list();
      const fallback = allProducts.slice(0, 4).map(p => ({
        id: p.product_id || p.id,
        name: p.name,
        category: p.category,
        price: p.minimum_price || 199,
        subtitle: p.subtitle || p.description
      }));
      
      return Response.json({
        recommendations: fallback,
        personalized: false
      });
    } catch (_) {
      return Response.json({
        error: error.message
      }, { status: 500 });
    }
  }
});