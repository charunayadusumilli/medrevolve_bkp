import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { partnerId, documentType } = await req.json();

        if (!partnerId || !documentType) {
            return Response.json({ 
                error: 'Partner ID and document type required' 
            }, { status: 400 });
        }

        // Get partner details
        const partner = await base44.entities.Partner.get(partnerId);

        // Generate document using AI
        const prompt = documentType === 'outreach' 
            ? `Generate a professional partnership outreach email for ${partner.business_name}, a ${partner.business_type}. 
               
               Context:
               - MedRevolve is a telehealth platform offering white-label solutions, wholesale pricing, and provider networks
               - We want to explore partnership opportunities for mutual growth
               - Highlight integration benefits, revenue opportunities, and our technology stack
               
               Make it personalized, professional, and compelling. Include:
               1. Introduction and value proposition
               2. Specific partnership opportunities
               3. Integration benefits
               4. Next steps and call to action
               
               Keep it under 300 words.`
            : `Generate a partnership agreement template for ${partner.business_name}, a ${partner.business_type}.
               
               Include standard clauses for:
               1. Scope of partnership
               2. Revenue sharing terms (${partner.pricing_markup_percentage}% markup)
               3. Data handling and HIPAA compliance
               4. Intellectual property
               5. Term and termination
               6. Liability and indemnification
               
               Make it legally sound and comprehensive.`;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: false
        });

        return Response.json({
            document: response,
            partner: partner,
            type: documentType
        });
    } catch (error) {
        console.error('Error generating document:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});