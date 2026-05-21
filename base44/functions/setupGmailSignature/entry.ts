/**
 * setupGmailSignature — Configures a professional HTML email signature for the connected Gmail account.
 * The signature includes the MedRevolve logo, Raj Nedunuri's title (President & CEO),
 * contact information, and social media links.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SIGNATURE_HTML = `
<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#2D3A2D;">
  <div style="padding-bottom:12px;">
    <img src="https://media.base44.com/images/public/698bb392815cbad420c2ec1a/74d6bc580_generated_image.png" alt="MedRevolve" style="height:40px;width:auto;" />
  </div>
  <div style="padding-bottom:8px;">
    <strong style="font-size:16px;color:#2D3A2D;">Raj Nedunuri</strong><br/>
    <span style="color:#4A6741;font-size:13px;">President & CEO</span><br/>
    <span style="color:#5A6B5A;font-size:13px;">MedRevolve Corporation</span>
  </div>
  <div style="padding-bottom:8px;">
    <span style="color:#5A6B5A;font-size:13px;">📞 (234) 567-890 | ✉️ rned@medrevolve.com</span>
  </div>
  <div style="padding-top:8px;border-top:1px solid #E8E0D5;padding-bottom:8px;">
    <a href="https://instagram.com/medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="Instagram" style="width:18px;height:18px;" />
    </a>
    <a href="https://twitter.com/medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" style="width:18px;height:18px;" />
    </a>
    <a href="https://facebook.com/medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174848.png" alt="Facebook" style="width:18px;height:18px;" />
    </a>
    <a href="https://youtube.com/@medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174860.png" alt="YouTube" style="width:18px;height:18px;" />
    </a>
    <a href="https://linkedin.com/company/medrevolve" style="text-decoration:none;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" style="width:18px;height:18px;" />
    </a>
  </div>
  <div style="padding-top:8px;font-size:11px;color:#8B9A8B;">
    MedRevolve Corporation | Launch a compliant telehealth, GLP-1, or RUO business under your own brand
  </div>
</div>
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // Get current send-as settings to find the primary account
    const sendAsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs', { headers });
    const sendAsData = await sendAsRes.json();
    
    if (!sendAsRes.ok) {
      console.error('Failed to get send-as settings:', sendAsData);
      return Response.json({ error: 'Failed to get Gmail settings', details: sendAsData }, { status: 500 });
    }

    // Find the primary account
    const primaryAccount = sendAsData.sendAs?.find(a => a.isPrimary) || sendAsData.sendAs?.[0];
    if (!primaryAccount) {
      return Response.json({ error: 'No Gmail account found' }, { status: 404 });
    }

    const sendAsEmail = primaryAccount.sendAsEmail;
    console.log(`Setting signature for: ${sendAsEmail}`);

    // Update the signature
    const updateRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/${encodeURIComponent(sendAsEmail)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        signature: SIGNATURE_HTML,
      }),
    });

    const result = await updateRes.json();
    
    if (updateRes.ok) {
      console.log('✅ Gmail signature updated successfully');
      return Response.json({
        success: true,
        message: 'Professional email signature has been configured for your Gmail account',
        signature_preview: 'Raj Nedunuri | President & CEO | MedRevolve Corporation',
      });
    } else {
      console.error('Failed to update signature:', result);
      return Response.json({ error: 'Failed to update signature', details: result }, { status: 500 });
    }

  } catch (error) {
    console.error('setupGmailSignature error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});