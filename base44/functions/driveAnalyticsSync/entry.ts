import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    console.log('[INFO] Starting Drive Analytics Sync...');

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Get the MedRevolve folder ID from stored Drive folders
    const driveFolders = await base44.asServiceRole.entities.DriveFolder.list();
    const analyticsFolder = driveFolders.find(f => f.name === 'Analytics');
    const rootFolder = driveFolders.find(f => f.name === 'MedRevolve' && !f.parent_id);

    // Find or create Analytics folder
    let analyticsFolderId = analyticsFolder?.folder_id;
    if (!analyticsFolderId) {
      const rootId = rootFolder?.folder_id;
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Analytics',
          mimeType: 'application/vnd.google-apps.folder',
          parents: rootId ? [rootId] : []
        })
      });
      const folderData = await createRes.json();
      analyticsFolderId = folderData.id;

      if (analyticsFolderId) {
        await base44.asServiceRole.entities.DriveFolder.create({
          name: 'Analytics',
          folder_id: analyticsFolderId,
          parent_id: rootId || null,
          path: 'MedRevolve/Analytics'
        });
      }
      console.log(`[INFO] Created Analytics folder: ${analyticsFolderId}`);
    }

    // Gather analytics data
    const now = new Date();
    const [contacts, partners, appointments, orders, socialPosts, prescriptions] = await Promise.all([
      base44.asServiceRole.entities.ContactRequest.list('-created_date', 500),
      base44.asServiceRole.entities.Partner.list('-created_date', 500),
      base44.asServiceRole.entities.Appointment.list('-created_date', 500),
      base44.asServiceRole.entities.Order.list('-created_date', 500),
      base44.asServiceRole.entities.SocialPost.list('-created_date', 200),
      base44.asServiceRole.entities.Prescription.list('-created_date', 500),
    ]);

    const analyticsData = {
      generated_at: now.toISOString(),
      period: 'cumulative_snapshot',
      leads: {
        total: contacts.length,
        new: contacts.filter(c => c.status === 'new').length,
        in_progress: contacts.filter(c => c.status === 'in_progress').length,
        meeting_scheduled: contacts.filter(c => c.status === 'meeting_scheduled').length,
        resolved: contacts.filter(c => c.status === 'resolved').length,
        sources: contacts.reduce((acc, c) => { acc[c.source || 'unknown'] = (acc[c.source || 'unknown'] || 0) + 1; return acc; }, {})
      },
      partners: {
        total: partners.length,
        active: partners.filter(p => p.status === 'active').length,
        pending: partners.filter(p => p.status === 'pending').length,
        trial: partners.filter(p => p.subscription_status === 'trial').length,
        total_earnings: partners.reduce((sum, p) => sum + (p.total_earnings || 0), 0),
        total_referrals: partners.reduce((sum, p) => sum + (p.total_referrals || 0), 0),
      },
      telehealth: {
        total_appointments: appointments.length,
        completed: appointments.filter(a => a.status === 'completed').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        total_prescriptions: prescriptions.length,
        active_prescriptions: prescriptions.filter(p => p.status === 'active').length,
      },
      orders: {
        total: orders.length,
      },
      social_media: {
        total_posts: socialPosts.length,
        published: socialPosts.filter(p => p.status === 'published').length,
        instagram: socialPosts.filter(p => p.platform === 'instagram').length,
        facebook: socialPosts.filter(p => p.platform === 'facebook').length,
        total_likes: socialPosts.reduce((sum, p) => sum + (p.engagement_likes || 0), 0),
        total_reach: socialPosts.reduce((sum, p) => sum + (p.reach || 0), 0),
      }
    };

    // Upload JSON analytics to Drive
    const fileName = `analytics_${now.toISOString().split('T')[0]}.json`;
    const uploadRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/related; boundary=boundary'
        },
        body: [
          '--boundary',
          'Content-Type: application/json',
          '',
          JSON.stringify({ name: fileName, parents: [analyticsFolderId] }),
          '--boundary',
          'Content-Type: application/json',
          '',
          JSON.stringify(analyticsData, null, 2),
          '--boundary--'
        ].join('\r\n')
      }
    );

    const uploadData = await uploadRes.json();
    console.log(`[SUCCESS] Analytics synced to Drive: ${uploadData.id} — ${fileName}`);

    return Response.json({ success: true, file_id: uploadData.id, file_name: fileName, analytics: analyticsData });

  } catch (error) {
    console.error('[ERROR] Drive analytics sync failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});