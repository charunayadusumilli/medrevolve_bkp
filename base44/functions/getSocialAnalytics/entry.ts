import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Step 1: Get Instagram user ID
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,followers_count,media_count&access_token=${accessToken}`
    );
    const meData = await meRes.json();
    if (meData.error) {
      console.error('Instagram me error:', meData.error);
      return Response.json({ instagram: null, error: meData.error.message });
    }

    const igUserId = meData.id;

    // Step 2: Get recent media insights (last 10 posts)
    const mediaRes = await fetch(
      `https://graph.instagram.com/${igUserId}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,media_url,permalink&limit=10&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();

    // Step 3: Get account insights (reach, impressions) - last 30 days
    const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    const until = Math.floor(Date.now() / 1000);
    const insightsRes = await fetch(
      `https://graph.instagram.com/${igUserId}/insights?metric=reach,impressions,profile_views,accounts_engaged&period=day&since=${since}&until=${until}&access_token=${accessToken}`
    );
    const insightsData = await insightsRes.json();

    // Aggregate insights
    let totalReach = 0, totalImpressions = 0, totalProfileViews = 0, totalEngaged = 0;
    if (insightsData.data) {
      insightsData.data.forEach(metric => {
        const sum = (metric.values || []).reduce((acc, v) => acc + (v.value || 0), 0);
        if (metric.name === 'reach') totalReach = sum;
        if (metric.name === 'impressions') totalImpressions = sum;
        if (metric.name === 'profile_views') totalProfileViews = sum;
        if (metric.name === 'accounts_engaged') totalEngaged = sum;
      });
    }

    // Internal platform stats
    const [customers, contacts, partners, providers, socialPosts, appointments] = await Promise.all([
      base44.asServiceRole.entities.CustomerIntake.list('-created_date', 500),
      base44.asServiceRole.entities.ContactRequest.list('-created_date', 500),
      base44.asServiceRole.entities.Partner.list('-created_date', 200),
      base44.asServiceRole.entities.Provider.list('-created_date', 100),
      base44.asServiceRole.entities.SocialPost.list('-created_date', 100),
      base44.asServiceRole.entities.Appointment.list('-created_date', 500),
    ]);

    // 30-day funnel
    const cutoff30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const newCustomers30 = customers.filter(c => c.created_date > cutoff30).length;
    const newContacts30 = contacts.filter(c => c.created_date > cutoff30).length;
    const newAppointments30 = appointments.filter(a => a.created_date > cutoff30).length;
    const publishedPosts30 = socialPosts.filter(p => p.created_date > cutoff30 && p.status === 'published').length;

    // Source breakdown for contacts
    const sourceBreakdown = {};
    contacts.forEach(c => {
      const src = c.source || 'direct';
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    });

    return Response.json({
      instagram: {
        username: meData.username,
        followers: meData.followers_count || 0,
        media_count: meData.media_count || 0,
        reach_30d: totalReach,
        impressions_30d: totalImpressions,
        profile_views_30d: totalProfileViews,
        accounts_engaged_30d: totalEngaged,
        recent_posts: (mediaData.data || []).map(p => ({
          id: p.id,
          caption: (p.caption || '').slice(0, 100),
          type: p.media_type,
          likes: p.like_count || 0,
          comments: p.comments_count || 0,
          timestamp: p.timestamp,
          permalink: p.permalink,
          media_url: p.media_url,
        }))
      },
      platform: {
        total_customers: customers.length,
        total_contacts: contacts.length,
        total_partners: partners.filter(p => p.status === 'active').length,
        total_providers: providers.filter(p => p.is_active).length,
        new_customers_30d: newCustomers30,
        new_contacts_30d: newContacts30,
        new_appointments_30d: newAppointments30,
        published_posts_30d: publishedPosts30,
        source_breakdown: sourceBreakdown,
      }
    });

  } catch (error) {
    console.error('getSocialAnalytics error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});