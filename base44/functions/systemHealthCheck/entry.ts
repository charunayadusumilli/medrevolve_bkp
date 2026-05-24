import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    console.log('[INFO] Running MedRevolve System Health Check...');

    const now = new Date();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000);

    // Parallel data fetch across all key entities
    const [
      contacts, partners, appointments, prescriptions,
      orders, socialPosts, providers, creators
    ] = await Promise.all([
      base44.asServiceRole.entities.ContactRequest.list('-created_date', 100),
      base44.asServiceRole.entities.Partner.list('-created_date', 100),
      base44.asServiceRole.entities.Appointment.list('-created_date', 100),
      base44.asServiceRole.entities.Prescription.list('-created_date', 100),
      base44.asServiceRole.entities.Order.list('-created_date', 100),
      base44.asServiceRole.entities.SocialPost.list('-created_date', 50),
      base44.asServiceRole.entities.Provider.list('-created_date', 50),
      base44.asServiceRole.entities.CreatorApplication.list('-created_date', 50),
    ]);

    // New in last 24h
    const newLeads = contacts.filter(c => new Date(c.created_date) > yesterday);
    const newPartners = partners.filter(p => new Date(p.created_date) > yesterday);
    const newAppointments = appointments.filter(a => new Date(a.created_date) > yesterday);
    const newOrders = orders.filter(o => new Date(o.created_date) > yesterday);
    const publishedPosts = socialPosts.filter(p => p.status === 'published' && new Date(p.created_date) > yesterday);

    // Issues
    const pendingLeads = contacts.filter(c => c.status === 'new').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
    const draftPrescriptions = prescriptions.filter(p => p.status === 'draft').length;
    const pendingCreators = creators.filter(c => c.status === 'pending').length;
    const pendingPartners = partners.filter(p => p.status === 'pending').length;

    const report = {
      timestamp: now.toISOString(),
      summary: {
        new_leads_24h: newLeads.length,
        new_partners_24h: newPartners.length,
        new_appointments_24h: newAppointments.length,
        new_orders_24h: newOrders.length,
        social_posts_24h: publishedPosts.length,
      },
      action_required: {
        pending_leads: pendingLeads,
        pending_appointments: pendingAppointments,
        draft_prescriptions: draftPrescriptions,
        pending_creator_applications: pendingCreators,
        pending_partners: pendingPartners,
      },
      totals: {
        total_contacts: contacts.length,
        total_partners: partners.length,
        total_appointments: appointments.length,
        total_prescriptions: prescriptions.length,
        total_orders: orders.length,
        active_providers: providers.filter(p => p.is_active).length,
      }
    };

    const totalActionItems = pendingLeads + pendingAppointments + draftPrescriptions + pendingCreators + pendingPartners;

    // Send email digest to admin
    const emailBody = `
<h2>🏥 MedRevolve System Health Report</h2>
<p><strong>Generated:</strong> ${now.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>

<h3>📊 Last 24 Hours</h3>
<ul>
  <li>🆕 New Leads: <strong>${newLeads.length}</strong></li>
  <li>🤝 New Partners: <strong>${newPartners.length}</strong></li>
  <li>📅 New Appointments: <strong>${newAppointments.length}</strong></li>
  <li>🛒 New Orders: <strong>${newOrders.length}</strong></li>
  <li>📱 Social Posts Published: <strong>${publishedPosts.length}</strong></li>
</ul>

<h3>⚠️ Action Required (${totalActionItems} items)</h3>
<ul>
  <li>🔴 Pending Leads (uncontacted): <strong>${pendingLeads}</strong></li>
  <li>🟡 Pending Appointments: <strong>${pendingAppointments}</strong></li>
  <li>📋 Draft Prescriptions: <strong>${draftPrescriptions}</strong></li>
  <li>🎨 Pending Creator Applications: <strong>${pendingCreators}</strong></li>
  <li>🏢 Pending Partner Onboarding: <strong>${pendingPartners}</strong></li>
</ul>

<h3>📈 Platform Totals</h3>
<ul>
  <li>Total Contacts: ${contacts.length}</li>
  <li>Total Partners: ${partners.length}</li>
  <li>Total Appointments: ${appointments.length}</li>
  <li>Total Prescriptions: ${prescriptions.length}</li>
  <li>Total Orders: ${orders.length}</li>
  <li>Active Providers: ${providers.filter(p => p.is_active).length}</li>
</ul>

<p><a href="https://medrevolve.com/AdminDashboard">→ Open Admin Dashboard</a></p>
<p style="color:#999;font-size:12px">MedRevolve Automated Health Check — rned@medrevolve.com</p>
    `.trim();

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'rned@medrevolve.com';
    // Find the admin user to send to a registered user
    const users = await base44.asServiceRole.entities.User.list();
    const adminUser = users.find(u => u.role === 'admin') || users[0];
    if (adminUser) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminUser.email,
        from_name: 'MedRevolve System',
        subject: `🏥 MedRevolve Health Check — ${totalActionItems} items need attention`,
        body: emailBody
      });
    }
    console.log(`[INFO] Email sent to admin: ${adminUser?.email}`);

    console.log(`[SUCCESS] Health check complete. ${totalActionItems} action items. Email sent to rned@medrevolve.com`);

    return Response.json({ success: true, report });

  } catch (error) {
    console.error('[ERROR] Health check failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});