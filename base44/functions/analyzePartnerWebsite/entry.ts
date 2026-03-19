import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { website, partnerType } = await req.json();

        if (!website) {
            return Response.json({ error: 'Website URL required' }, { status: 400 });
        }

        // Analyze website using AI with internet context
        const analysisPrompt = `Analyze this ${partnerType || 'business'} website: ${website}

Extract and provide:
1. Core services offered
2. Target market and customer base
3. Technology stack (if visible)
4. API/integration capabilities
5. Compliance certifications (e.g., HIPAA, LegitScript)
6. Potential integration points with a telehealth platform
7. Revenue model
8. Estimated company size and market position
9. Contact information
10. Partnership opportunities

Format as JSON with these keys: coreServices, targetMarket, techStack, apiCapabilities, compliance, integrationPoints, revenueModel, companySize, contact, opportunities`;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt: analysisPrompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    coreServices: { type: "array", items: { type: "string" } },
                    targetMarket: { type: "string" },
                    techStack: { type: "array", items: { type: "string" } },
                    apiCapabilities: { type: "string" },
                    compliance: { type: "array", items: { type: "string" } },
                    integrationPoints: { type: "array", items: { type: "string" } },
                    revenueModel: { type: "string" },
                    companySize: { type: "string" },
                    contact: { type: "object" },
                    opportunities: { type: "array", items: { type: "string" } }
                }
            }
        });

        return Response.json({
            website: website,
            analysis: analysis
        });
    } catch (error) {
        console.error('Error analyzing website:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});