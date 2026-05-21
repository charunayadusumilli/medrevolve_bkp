import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posts } = await req.json();

    if (!posts || !Array.isArray(posts)) {
      return Response.json({ error: 'Posts array is required' }, { status: 400 });
    }

    // Get Instagram access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Get Instagram user ID
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    const userData = await userResponse.json();
    
    if (!userData.id) {
      return Response.json({ error: 'Failed to get Instagram user ID' }, { status: 500 });
    }

    const results = [];

    // Post each item
    for (const post of posts) {
      try {
        // Create media container
        const containerResponse = await fetch(
          `https://graph.instagram.com/${userData.id}/media?image_url=${encodeURIComponent(post.image_url)}&caption=${encodeURIComponent(post.caption)}&access_token=${accessToken}`,
          { method: 'POST' }
        );
        const containerData = await containerResponse.json();

        if (!containerData.id) {
          results.push({ success: false, error: containerData.error?.message || 'Failed to create container' });
          continue;
        }

        // Publish the post
        const publishResponse = await fetch(
          `https://graph.instagram.com/${userData.id}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
          { method: 'POST' }
        );
        const publishData = await publishResponse.json();

        if (!publishData.id) {
          results.push({ success: false, error: publishData.error?.message || 'Failed to publish' });
          continue;
        }

        // Save to database
        await base44.entities.SocialPost.create({
          platform: 'instagram',
          caption: post.caption,
          image_url: post.image_url,
          post_id: publishData.id,
          status: 'published',
          topic: post.topic || 'general',
          content_type: post.content_type || 'post',
          created_by: user.email,
          published_at: new Date().toISOString()
        });

        results.push({ 
          success: true, 
          post_id: publishData.id,
          caption: post.caption.substring(0, 50) + '...'
        });

      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return Response.json({
      success: true,
      total: posts.length,
      successful: successCount,
      failed: failCount,
      results
    });

  } catch (error) {
    console.error('Error in bulk posting:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});