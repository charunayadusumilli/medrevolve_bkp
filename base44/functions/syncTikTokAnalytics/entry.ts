import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get TikTok access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('tiktok');

    // Fetch user info and stats
    const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username,bio_description,follower_count,following_count,likes_count,video_count', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userInfoData = await userInfoResponse.json();
    
    if (!userInfoData.data || !userInfoData.data.user) {
      throw new Error('Failed to fetch TikTok user info');
    }

    const userData = userInfoData.data.user;

    // Create analytics record
    const analyticsRecord = {
      username: userData.username || 'unknown',
      nickname: userData.display_name || '',
      avatar_url: userData.avatar_url || '',
      bio: userData.bio_description || '',
      verified: userData.verified || false,
      follower_count: userData.follower_count || 0,
      following_count: userData.following_count || 0,
      heart_count: userData.likes_count || 0,
      video_count: userData.video_count || 0,
      digg_count: userData.digg_count || 0,
      sync_date: new Date().toISOString()
    };

    // Save to database
    await base44.entities.TikTokAnalytics.create(analyticsRecord);

    return Response.json({
      success: true,
      data: analyticsRecord
    });

  } catch (error) {
    console.error('Error syncing TikTok analytics:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});