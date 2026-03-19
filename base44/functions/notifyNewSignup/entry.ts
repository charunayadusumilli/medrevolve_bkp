import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function sendGmailNotification(base44, { to, subject, html }) {
  const response = await base44.integrations.Core.SendEmail({
    to,
    subject,
    body: html
  });
  console.log('✅ Email sent via Gmail to:', to);
  return response;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const event = payload.event || {};
    const data = payload.data || {};

    // Handle PatientIntake entity create events only
    if (event.type !== "create" || event.entity_name !== "PatientIntake") {
      return Response.json({ error: "Invalid event type" }, { status: 400 });
    }

    // PatientIntake: send welcome email directly using the intake email
    if (data?.email) {
      const profile = (() => { try { return JSON.parse(data.answers_json || '{}')?.profile || {}; } catch { return {}; } })();
      const firstName = (profile.full_name || data.email)?.split(' ')[0] || 'there';
      try {
        await sendGmailNotification(base44, {
          to: data.email,
          subject: `Welcome to MedRevolve, ${firstName}! 🌿 Your account is confirmed`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#2D3A2D,#4A6741);padding:32px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="color:#fff;margin:0;font-size:26px;">Welcome to MedRevolve 🌿</h1>
                <p style="color:#A8C99B;margin:8px 0 0;font-size:14px;">Your account has been successfully created</p>
              </div>
              <div style="background:#FDFBF7;padding:32px;border-radius:0 0 12px 12px;border:1px solid #E8E0D5;">
                <p style="color:#2D3A2D;font-size:16px;">Hi ${firstName},</p>
                <p style="color:#555;line-height:1.7;">Your MedRevolve account is confirmed and ready. Here's what to do next:</p>
                <ol style="color:#555;line-height:2.2;font-size:14px;">
                  <li><strong>Book a consultation</strong> — connect with a licensed provider who'll review your goals</li>
                  <li><strong>Get your treatment plan</strong> — personalized protocols based on your health profile</li>
                  <li><strong>Receive your medication</strong> — delivered to your door in 24–48 hours</li>
                </ol>
                <div style="text-align:center;margin:28px 0;">
                  <a href="https://medrevolve.base44.app" style="background:#2D3A2D;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px;">Go to My Portal →</a>
                </div>
                <p style="color:#999;font-size:12px;text-align:center;">Questions? Email us at <a href="mailto:support@medrevolve.com" style="color:#4A6741;">support@medrevolve.com</a></p>
              </div>
            </div>
          `
        });
        console.log('✅ Welcome email sent to new patient:', data.email);
      } catch (e) {
        console.error('Failed to send PatientIntake welcome email:', e);
      }
      return Response.json({ success: true, message: "Welcome email sent to new patient" });

  } catch (error) {
    console.error("Notification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});