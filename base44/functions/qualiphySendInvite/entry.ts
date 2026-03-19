import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function sendEmail(base44, { to, subject, html }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const emailLines = [
    `From: MedRevolve <noreply@medrevolve.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];
  const raw = btoa(unescape(encodeURIComponent(emailLines.join('\r\n'))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gmail send failed');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, name } = await req.json();
    const apiKey = Deno.env.get('QUALIPHY_API_KEY');

    if (!email || !apiKey) {
      return Response.json({ error: 'Email and API key required' }, { status: 400 });
    }

    // Call Qualiphy API to generate exam invite
    const qualiphyRes = await fetch('https://api.qualiphy.me/v1/exams/send-invite', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        full_name: name,
        exam_type: 'provider_qualification',
        redirect_url: 'https://medrevolve.com/provider-onboarding',
      }),
    });

    const qualiphyData = await qualiphyRes.json();
    if (!qualiphyRes.ok) {
      throw new Error(qualiphyData.error?.message || 'Failed to send Qualiphy invite');
    }

    // Send email notification to provider
    const inviteHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="color:#fff;font-size:28px;font-weight:800;">✅ Medical Qualification Exam</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">Ready to Start</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">Your Qualiphy medical qualification exam is ready!</div>
    </div>

    <div style="font-size:15px;color:#111827;margin-bottom:12px;">Hi ${name},</div>
    <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:20px;">
      The next step in your MedRevolve provider onboarding is to complete the <strong>Qualiphy.me medical qualification exam</strong>. This exam verifies your medical knowledge and licensing.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:20px;overflow:hidden;">
      <tr><td style="background:#1e293b;padding:11px 16px;"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 About the Exam</span></td></tr>
      <tr><td style="padding:16px;">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;font-size:13px;color:#374151;">⏱️ <strong>Duration:</strong> 15-30 minutes</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#374151;">📚 <strong>Content:</strong> Medical knowledge & licensing verification</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#374151;">⚡ <strong>Timing:</strong> Complete at your own pace</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#374151;">✅ <strong>Scoring:</strong> Instant results upon completion</td></tr>
        </table>
      </td></tr>
    </table>

    <div style="margin-bottom:20px;">
      <a href="${qualiphyData.invite_url || 'https://qualiphy.me'}" style="display:inline-block;background:#4A6741;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
        Start Exam Now →
      </a>
    </div>

    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;">
      <div style="color:#92400e;font-size:13px;">
        <strong>Pro Tip:</strong> Have your medical credentials ready (license, NPI, education details). The exam takes 15-30 minutes in a distraction-free environment.
      </div>
    </div>

    <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
      <p><strong>Questions?</strong> Contact our provider relations team:</p>
      <p>📧 providers@medrevolve.com</p>
    </div>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;">🌿 MedRevolve Provider Program</div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:6px;">© 2026 MedRevolve. All rights reserved.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    await sendEmail(base44, {
      to: email,
      subject: '✅ Your Qualiphy Medical Qualification Exam Invite',
      html: inviteHtml,
    });

    return Response.json({
      success: true,
      invite_url: qualiphyData.invite_url,
      exam_id: qualiphyData.exam_id,
      message: 'Exam invite sent successfully',
    });

  } catch (error) {
    console.error('Error sending Qualiphy invite:', error);
    return Response.json({ error: error.message || 'Failed to send invite' }, { status: 500 });
  }
});