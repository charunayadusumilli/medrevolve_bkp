import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { applicationId, action } = await req.json();

    if (!applicationId) {
      return Response.json({ error: 'Application ID required' }, { status: 400 });
    }

    // Fetch the application — use service role so admin/staff can also trigger
    const app = await base44.asServiceRole.entities.MerchantApplication.get(applicationId);

    if (!app) {
      return Response.json({ error: 'Application not found' }, { status: 404 });
    }

    // Only the merchant owner or an admin can trigger doc generation/email
    const isOwner = app.merchant_email === user.email;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // ─── GENERATE DOCS: mark application as docs_generated ──────────────
    if (action === 'generate' || !action) {
      const updates = {
        application_status: 'docs_generated',
      };
      await base44.asServiceRole.entities.MerchantApplication.update(applicationId, updates);
    }

    // ─── SEND EMAIL with review/sign link ───────────────────────────────
    if (action === 'send_email' || !action) {
      const baseUrl = `https://medi-revolve-care.base44.app`;
      const reviewUrl = `${baseUrl}/MerchantDocuments?app=${applicationId}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #0A0A0A; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #fff; font-size: 20px; margin: 0;">MedRevolve — Onboarding Documents Ready</h1>
          </div>
          <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 14px; color: #333;">Hello ${app.signing_officer_name || app.legal_business_name},</p>
            <p style="font-size: 14px; color: #333; line-height: 1.6;">
              Your MedRevolve merchant onboarding documents are ready for review and electronic signature.
              Please complete the following three documents to finalize your onboarding:
            </p>
            <ol style="font-size: 14px; color: #333; line-height: 2;">
              <li><strong>Merchant Processing Application (MPA)</strong> — Card acceptance agreement</li>
              <li><strong>B2B Platform Service Agreement</strong> — Master service terms</li>
              <li><strong>HIPAA Business Associate Agreement (BAA)</strong> — PHI data protection</li>
            </ol>
            <p style="font-size: 14px; color: #333; line-height: 1.6;">
              Each document is pre-filled with the information you provided during intake.
              You will need to review and electronically sign each one.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${reviewUrl}" style="background: #4A6741; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 15px;">
                Review & Sign Documents →
              </a>
            </div>
            <p style="font-size: 12px; color: #888; line-height: 1.5;">
              This link is unique to your application. If you did not request onboarding with MedRevolve, please disregard this email.<br/><br/>
              MedRevolve Corporation · 240-387-5224 · medrevolve.com
            </p>
          </div>
        </div>
      `;

      const text = `MedRevolve Onboarding Documents Ready\n\nHello ${app.signing_officer_name || app.legal_business_name},\n\nYour merchant onboarding documents are ready for review and electronic signature:\n1. Merchant Processing Application (MPA)\n2. B2B Platform Service Agreement\n3. HIPAA Business Associate Agreement (BAA)\n\nReview and sign here: ${reviewUrl}\n\nMedRevolve Corporation · 240-387-5224`;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: app.merchant_email || app.signing_officer_email,
        subject: 'MedRevolve — Your Onboarding Documents Are Ready for Signature',
        html,
        text,
      });

      await base44.asServiceRole.entities.MerchantApplication.update(applicationId, {
        docs_email_sent: true,
        docs_email_sent_at: new Date().toISOString(),
        application_status: 'docs_generated',
      });

      return Response.json({
        success: true,
        message: 'Onboarding documents email sent successfully',
        reviewUrl,
        sentTo: app.merchant_email || app.signing_officer_email,
      });
    }

    return Response.json({ success: true, message: 'Documents generated', applicationId });
  } catch (error) {
    console.error('generateMerchantDocuments error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});