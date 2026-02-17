import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { source, event, error, context } = await req.json();

        console.error('ERROR LOGGED:', {
            source,
            event,
            error,
            context,
            timestamp: new Date().toISOString()
        });

        // Send critical errors to admin
        if (context?.critical) {
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: Deno.env.get('ADMIN_EMAIL') || 'support@medrevolve.com',
                subject: `🚨 CRITICAL ERROR: ${source}`,
                body: `
                    <h2>Critical Error Detected</h2>
                    <p><strong>Source:</strong> ${source}</p>
                    <p><strong>Event:</strong> ${event}</p>
                    <p><strong>Error:</strong> ${error}</p>
                    <p><strong>Context:</strong> ${JSON.stringify(context, null, 2)}</p>
                    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                `
            });
        }

        return Response.json({ success: true });
    } catch (err) {
        console.error('Error logging error:', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
});