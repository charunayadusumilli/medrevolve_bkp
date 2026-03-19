import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { outreachId, emailContent, recipientEmail } = await req.json();

        if (!outreachId || !emailContent || !recipientEmail) {
            return Response.json({ 
                error: 'Outreach ID, email content, and recipient required' 
            }, { status: 400 });
        }

        // Send email
        await base44.integrations.Core.SendEmail({
            to: recipientEmail,
            from_name: "MedRevolve Partnership Team",
            subject: "Partnership Opportunity with MedRevolve",
            body: emailContent
        });

        // Update outreach record
        await base44.asServiceRole.entities.PartnershipOutreach.update(outreachId, {
            status: 'outreach_sent',
            outreach_sent_date: new Date().toISOString(),
            outreach_email: emailContent
        });

        return Response.json({
            success: true,
            message: 'Partnership email sent successfully'
        });
    } catch (error) {
        console.error('Error sending partnership email:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});