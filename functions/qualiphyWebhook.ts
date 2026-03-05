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
    const payload = await req.json();

    console.log('Qualiphy webhook received:', JSON.stringify(payload, null, 2));

    const { event_type, exam_id, provider_email, status, score, passed } = payload;

    if (event_type !== 'exam_completed') {
      return Response.json({ success: true, message: 'Event ignored' });
    }

    if (!provider_email) {
      return Response.json({ error: 'Provider email required' }, { status: 400 });
    }

    // Find provider by email
    const providers = await base44.asServiceRole.entities.ProviderIntake.filter({
      email: provider_email,
    });

    if (!providers.length) {
      console.warn('No provider found for email:', provider_email);
      return Response.json({ error: 'Provider not found' }, { status: 404 });
    }

    const provider = providers[0];

    // Update provider status
    await base44.asServiceRole.entities.ProviderIntake.update(provider.id, {
      status: passed ? 'under_review' : 'pending',
      qualiphy_exam_id: exam_id,
      qualiphy_score: score,
      qualiphy_passed: passed,
      qualiphy_completed_at: new Date().toISOString(),
    });

    // Send notification emails
    if (passed) {
      // Success email to provider
      const successHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1f2d1f,#4A6741);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="color:#fff;font-size:28px;font-weight:800;">🎉 Exam Passed!</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <div style="color:#166534;font-size:15px;font-weight:700;">✅ Congratulations!</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">You've successfully completed the Qualiphy medical qualification exam.</div>
    </div>

    <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:20px;">
      Your exam results show you meet the medical standards for joining the MedRevolve provider network. You're now ready for the final step: a live credentialing consultation with our medical director.
    </p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:20px;overflow:hidden;">
      <table width="100%">
        <tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
          <span style="font-size:12px;color:#94a3b8;font-weight:600;">YOUR SCORE</span><br/>
          <span style="font-size:18px;color:#111827;font-weight:700;">${score}%</span>
        </td></tr>
        <tr><td style="padding:12px 16px;">
          <span style="font-size:12px;color:#94a3b8;font-weight:600;">STATUS</span><br/>
          <span style="font-size:14px;color:#16a34a;font-weight:600;">✅ Passed</span>
        </td></tr>
      </table>
    </div>

    <p style="font-size:14px;color:#6b7280;margin-bottom:20px;">
      Your provider profile is now under review. Our credentialing team will schedule your consultation call within 1-2 business days. You'll receive a meeting invitation with the call details.
    </p>

    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
      <div style="color:#92400e;font-size:13px;">
        <strong>What's Next?</strong> Keep an eye on your inbox for a consultation scheduling email. If you don't see it within 2 days, contact providers@medrevolve.com.
      </div>
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
        to: provider_email,
        subject: '🎉 Exam Passed - Next Steps for Your Provider Onboarding',
        html: successHtml,
      });

      // Notify admin
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'krish@medrevolve.com';
      const adminHtml = `Provider ${provider.full_name} passed Qualiphy exam with score ${score}%. Schedule credentialing consultation. Email: ${provider_email}, Phone: ${provider.phone || 'N/A'}`;
      
      await sendEmail(base44, {
        to: adminEmail,
        subject: `✅ Provider Passed Qualiphy Exam - ${provider.full_name}`,
        html: adminHtml,
      });
    } else {
      // Failure email to provider
      const failureHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f3;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#7c2d12,#c2410c);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
    <div style="color:#fff;font-size:28px;font-weight:800;">📋 Exam Review Required</div>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 40px;">
    <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:20px;">
      Thank you for taking the Qualiphy medical qualification exam. Your score of <strong>${score}%</strong> indicates that we'd like to review your qualifications more carefully with you directly.
    </p>

    <p style="font-size:14px;color:#6b7280;margin-bottom:20px;">
      This doesn't mean you're not qualified—it simply means our medical director would like to have a conversation with you about your experience and credentials before proceeding.
    </p>

    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
      <div style="color:#92400e;font-size:13px;">
        <strong>Next Step:</strong> Our credentialing team will contact you to schedule a consultation call to discuss your application. Please reply to any communication from providers@medrevolve.com.
      </div>
    </div>

    <p style="font-size:13px;color:#6b7280;">
      If you have any questions or concerns, please don't hesitate to reach out to our provider relations team at providers@medrevolve.com.
    </p>
  </td></tr>
  <tr><td style="background:#1f2d1f;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
    <div style="color:#fff;font-size:13px;font-weight:700;">🌿 MedRevolve Provider Program</div>
    <div style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:6px;">© 2026 MedRevolve. All rights reserved.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

      await sendEmail(base44, {
        to: provider_email,
        subject: '📋 Exam Review - Next Steps for Your Application',
        html: failureHtml,
      });

      // Notify admin
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'krish@medrevolve.com';
      const adminHtml = `Provider ${provider.full_name} scored ${score}% on Qualiphy exam. Needs manual review. Email: ${provider_email}, Phone: ${provider.phone || 'N/A'}`;
      
      await sendEmail(base44, {
        to: adminEmail,
        subject: `📋 Provider Exam Needs Review - ${provider.full_name}`,
        html: adminHtml,
      });
    }

    console.log('✅ Qualiphy webhook processed successfully');
    return Response.json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Error processing Qualiphy webhook:', error);
    return Response.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
});