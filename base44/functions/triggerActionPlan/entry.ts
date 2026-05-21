/**
 * triggerActionPlan — Creates action plan items and sends digest emails
 * when new leads/applications come in.
 * 
 * Called by entity automations on: ContactRequest, ProviderIntake, 
 * PharmacyIntake, BusinessInquiry, CreatorApplication, Partner create.
 * 
 * Also sends a daily/weekly digest email summarizing pending action items.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'rned@medrevolve.com';

async function sendGmail(base44, { to, subject, html }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const lines = [
    `From: MedRevolve CRM <rned@medrevolve.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];
  const raw = btoa(unescape(encodeURIComponent(lines.join('\r\n'))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gmail send failed');
  return data.id;
}

function actionPlanRow(icon, type, name, email, priority, action, link) {
  const priorityColor = priority === 'HIGH' ? '#dc2626' : priority === 'MEDIUM' ? '#d97706' : '#6b7280';
  return `
  <tr style="border-bottom:1px solid #f1f5f9">
    <td style="padding:10px 12px;font-size:13px">${icon} <strong>${type}</strong></td>
    <td style="padding:10px 12px;font-size:13px">${name}</td>
    <td style="padding:10px 12px;font-size:12px;color:#6b7280">${email}</td>
    <td style="padding:10px 12px"><span style="background:${priorityColor}20;color:${priorityColor};font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px">${priority}</span></td>
    <td style="padding:10px 12px;font-size:12px">${action}</td>
    <td style="padding:10px 12px"><a href="${link}" style="color:#4A6741;font-size:12px;font-weight:600">→ View</a></td>
  </tr>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const entityName = body?.event?.entity_name;
    const data = body?.data;

    // ── Mode: Single entity event — send instant alert ─────────────────────
    if (entityName && data) {
      const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      let alertConfig = null;

      if (entityName === 'ContactRequest') {
        alertConfig = {
          icon: '📬',
          type: 'New Contact / Lead',
          name: data.name || 'Unknown',
          email: data.email,
          priority: data.source === 'ctm_call' ? 'HIGH' : 'MEDIUM',
          action: '1. Reply within 2 hrs · 2. Qualify · 3. Book discovery call',
          link: 'https://medrevolve.com/AdminDashboard?tab=contacts',
          subject: `📬 New Lead: ${data.name || data.email} [Action Required]`,
        };
      } else if (entityName === 'ProviderIntake') {
        alertConfig = {
          icon: '👨‍⚕️',
          type: 'Provider Application',
          name: `${data.full_name}, ${data.title}`,
          email: data.email,
          priority: 'HIGH',
          action: '1. Review credentials · 2. Send Qualiphy exam · 3. Schedule cred call',
          link: 'https://medrevolve.com/AdminDashboard?tab=providers',
          subject: `👨‍⚕️ Provider Application: ${data.full_name}, ${data.title}`,
        };
      } else if (entityName === 'PharmacyIntake') {
        alertConfig = {
          icon: '💊',
          type: 'Pharmacy Application',
          name: data.pharmacy_name,
          email: data.email,
          priority: 'HIGH',
          action: '1. Verify license · 2. Check shipping capabilities · 3. Schedule partnership call',
          link: 'https://medrevolve.com/AdminDashboard?tab=pharmacies',
          subject: `💊 Pharmacy Application: ${data.pharmacy_name}`,
        };
      } else if (entityName === 'BusinessInquiry') {
        alertConfig = {
          icon: '🏢',
          type: 'Business Inquiry',
          name: data.company_name,
          email: data.email,
          priority: data.interest_type === 'White Label' ? 'HIGH' : 'MEDIUM',
          action: '1. Send platform deck · 2. Book demo call · 3. Create HubSpot deal',
          link: 'https://medrevolve.com/AdminDashboard?tab=businesses',
          subject: `🏢 Business Inquiry: ${data.company_name} [${data.interest_type}]`,
        };
      } else if (entityName === 'CreatorApplication') {
        alertConfig = {
          icon: '🎨',
          type: 'Creator Application',
          name: data.full_name,
          email: data.email,
          priority: 'MEDIUM',
          action: '1. Review platform metrics · 2. Send creator agreement · 3. Set up referral code',
          link: 'https://medrevolve.com/AdminDashboard?tab=creators',
          subject: `🎨 Creator Application: ${data.full_name} (@${data.platform_handle})`,
        };
      } else if (entityName === 'Partner') {
        alertConfig = {
          icon: '🤝',
          type: 'New Partner',
          name: data.business_name,
          email: data.email,
          priority: 'HIGH',
          action: '1. Send welcome kit · 2. Set up white-label portal · 3. Assign success manager',
          link: 'https://medrevolve.com/AdminDashboard?tab=partners',
          subject: `🤝 New Partner Onboarded: ${data.business_name}`,
        };
      }

      if (!alertConfig) {
        return Response.json({ skipped: true, reason: `No action plan for: ${entityName}` });
      }

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 16px;"><tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:20px 28px;">
    <table width="100%"><tr>
      <td><span style="color:#fff;font-size:18px;font-weight:800;">🌿 MedRevolve — Action Required</span><br/>
          <span style="color:rgba(255,255,255,0.45);font-size:12px;">${submittedAt} ET</span></td>
      <td align="right"><span style="font-size:28px">${alertConfig.icon}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:24px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <tr><td style="background:#1e293b;padding:10px 16px"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase">📋 ${alertConfig.type}</span></td></tr>
      <tr><td style="padding:16px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="30%" style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0">Name</td><td style="font-size:14px;font-weight:700;padding:5px 0">${alertConfig.name}</td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0">Email</td><td style="font-size:13px;padding:5px 0"><a href="mailto:${alertConfig.email}" style="color:#4A6741">${alertConfig.email}</a></td></tr>
          <tr><td style="font-size:12px;color:#94a3b8;font-weight:600;padding:5px 0">Priority</td><td style="padding:5px 0">
            <span style="background:${alertConfig.priority === 'HIGH' ? '#fee2e2' : '#fef3c7'};color:${alertConfig.priority === 'HIGH' ? '#dc2626' : '#d97706'};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">${alertConfig.priority}</span>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <tr><td style="background:#4A6741;padding:10px 16px"><span style="color:#fff;font-size:11px;font-weight:700;text-transform:uppercase">⚡ Action Plan</span></td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#374151;line-height:2">${alertConfig.action}</td></tr>
    </table>

    <div style="text-align:center;margin-top:16px">
      <a href="${alertConfig.link}" style="display:inline-block;background:#4A6741;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;margin-right:8px">
        Open Admin Dashboard →
      </a>
      <a href="mailto:${alertConfig.email}" style="display:inline-block;background:#1e293b;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none">
        Reply Directly →
      </a>
    </div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:12px 28px;text-align:center">
    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">MedRevolve CRM · rned@medrevolve.com · Auto-generated action alert</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

      await sendGmail(base44, { to: ADMIN_EMAIL, subject: alertConfig.subject, html });
      console.log(`✅ Action plan sent for ${entityName}: ${alertConfig.name}`);
      return Response.json({ success: true, entity: entityName, name: alertConfig.name });
    }

    // ── Mode: Daily digest (called by scheduled automation) ──────────────
    if (body.mode === 'daily_digest') {
      const [contacts, providers, pharmacies, businesses, creators] = await Promise.all([
        base44.asServiceRole.entities.ContactRequest.filter({ status: 'new' }),
        base44.asServiceRole.entities.ProviderIntake.filter({ status: 'pending' }),
        base44.asServiceRole.entities.PharmacyIntake.filter({ status: 'pending' }),
        base44.asServiceRole.entities.BusinessInquiry.filter({ status: 'new' }),
        base44.asServiceRole.entities.CreatorApplication.filter({ status: 'pending' }),
      ]);

      const totalPending = contacts.length + providers.length + pharmacies.length + businesses.length + creators.length;

      if (totalPending === 0) {
        console.log('Daily digest: nothing pending, skipping email');
        return Response.json({ success: true, skipped: true, reason: 'No pending items' });
      }

      const rows = [
        ...contacts.map(c => actionPlanRow('📬', 'Lead', c.name || 'Unknown', c.email, 'MEDIUM', 'Reply & qualify', 'https://medrevolve.com/AdminDashboard?tab=contacts')),
        ...providers.map(p => actionPlanRow('👨‍⚕️', 'Provider', `${p.full_name}, ${p.title}`, p.email, 'HIGH', 'Send Qualiphy exam', 'https://medrevolve.com/AdminDashboard?tab=providers')),
        ...pharmacies.map(ph => actionPlanRow('💊', 'Pharmacy', ph.pharmacy_name, ph.email, 'HIGH', 'Verify license', 'https://medrevolve.com/AdminDashboard?tab=pharmacies')),
        ...businesses.map(b => actionPlanRow('🏢', 'Business', b.company_name, b.email, b.interest_type === 'White Label' ? 'HIGH' : 'MEDIUM', 'Send deck & book demo', 'https://medrevolve.com/AdminDashboard?tab=businesses')),
        ...creators.map(cr => actionPlanRow('🎨', 'Creator', cr.full_name, cr.email, 'LOW', 'Review & approve', 'https://medrevolve.com/AdminDashboard?tab=creators')),
      ];

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' });
      const digestHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 16px;"><tr><td align="center">
<table width="700" cellpadding="0" cellspacing="0" style="max-width:700px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1a2a1a,#2D3A2D);border-radius:14px 14px 0 0;padding:24px 28px;">
    <span style="color:#fff;font-size:20px;font-weight:800;">🌿 MedRevolve Daily Action Digest</span><br/>
    <span style="color:rgba(255,255,255,0.45);font-size:13px;">${today}</span>
  </td></tr>
  <tr><td style="background:#fff;padding:24px 28px;">
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:14px 20px;margin-bottom:20px;font-size:14px;color:#92400e;font-weight:600">
      ⚠️ ${totalPending} item${totalPending !== 1 ? 's' : ''} pending your attention
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr style="background:#1e293b">
        <th style="padding:10px 12px;color:#fff;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase">Type</th>
        <th style="padding:10px 12px;color:#fff;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase">Name</th>
        <th style="padding:10px 12px;color:#fff;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase">Email</th>
        <th style="padding:10px 12px;color:#fff;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase">Priority</th>
        <th style="padding:10px 12px;color:#fff;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase">Actions</th>
        <th style="padding:10px 12px;color:#fff;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase">Link</th>
      </tr>
      ${rows.join('')}
    </table>
    <div style="text-align:center;margin-top:20px">
      <a href="https://medrevolve.com/AdminDashboard" style="display:inline-block;background:#4A6741;color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none">
        Open Admin Dashboard →
      </a>
    </div>
  </td></tr>
  <tr><td style="background:#1a2a1a;border-radius:0 0 14px 14px;padding:12px 28px;text-align:center">
    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">MedRevolve CRM Daily Digest · Auto-generated every morning at 8 AM ET</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

      await sendGmail(base44, {
        to: ADMIN_EMAIL,
        subject: `📋 MedRevolve Daily Digest — ${totalPending} items pending [${today}]`,
        html: digestHtml,
      });

      console.log(`✅ Daily digest sent: ${totalPending} pending items`);
      return Response.json({ success: true, mode: 'daily_digest', pending: totalPending });
    }

    return Response.json({ success: true, message: 'No mode matched' });

  } catch (error) {
    console.error('triggerActionPlan error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});