import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { productId, contentType } = await req.json();

    if (!productId || !['description', 'faq', 'benefits'].includes(contentType)) {
      return Response.json(
        { error: 'productId and contentType (description|faq|benefits) are required' },
        { status: 400 }
      );
    }

    // Fetch the product
    const products = await base44.asServiceRole.entities.Product.list();
    const product = products.find(p => p.product_id === productId || p.id === productId);

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    // Generate content based on type
    let content;

    if (contentType === 'description') {
      content = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a compelling, professional product description for a telehealth medication.

Product Name: ${product.name}
Category: ${product.category}
Current Description: ${product.description || 'N/A'}
Benefits: ${product.benefits?.join(', ') || 'N/A'}
Form: ${product.form || 'N/A'}

Write a description that is:
- 2-3 sentences long
- Highlights the key benefits
- Professional and trustworthy
- Suitable for a medical product listing
- Emphasizes FDA approval or clinical validation where relevant

Just provide the description text, no additional formatting.`,
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' }
          }
        }
      });

      return Response.json({ description: content.description });
    }

    if (contentType === 'faq') {
      content = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5-6 relevant FAQ questions and answers for a telehealth product.

Product Name: ${product.name}
Category: ${product.category}
Description: ${product.description}
Form: ${product.form || 'Unknown'}
Side Effects: ${product.side_effects?.join(', ') || 'N/A'}
Dosage Info: ${product.dosage_info || 'Personalized by provider'}

Generate FAQs that address common patient concerns about:
- How it works
- Safety and side effects
- Dosage and administration
- Who it's for
- Results timeline
- Contraindications

Format as JSON array with objects containing: { question, answer }
Make answers clear, concise, and patient-friendly (1-2 sentences each).`,
        response_json_schema: {
          type: 'object',
          properties: {
            faqs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  answer: { type: 'string' }
                }
              }
            }
          }
        }
      });

      return Response.json({ faqs: content.faqs });
    }

    if (contentType === 'benefits') {
      content = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5-6 key benefits for this telehealth product that would appeal to patients.

Product Name: ${product.name}
Category: ${product.category}
Description: ${product.description}
Existing Benefits: ${product.benefits?.join(', ') || 'N/A'}

Generate unique, compelling benefit statements that:
- Focus on patient outcomes and quality of life
- Are specific and measurable where possible
- Appeal to the target audience for this category
- Are concise (1 sentence each)

Format as JSON with an array of benefit strings.`,
        response_json_schema: {
          type: 'object',
          properties: {
            benefits: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      });

      return Response.json({ benefits: content.benefits });
    }
  } catch (error) {
    console.error('Generate content error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});