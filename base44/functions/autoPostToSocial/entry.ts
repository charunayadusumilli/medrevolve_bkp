import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This is called by automation - no user auth needed
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get draft posts scheduled for today or earlier
    const now = new Date().toISOString();
    const draftPosts = await base44.entities.SocialPost.filter({
      status: 'draft',
      scheduled_at: { $lte: now }
    });

    if (draftPosts.length === 0) {
      return Response.json({ message: 'No posts to publish' });
    }

    const results = [];

    for (const post of draftPosts) {
      try {
        // Check Instagram connection
        const connectionStatus = await base44.functions.invoke('checkInstagramConnection', {});
        
        if (!connectionStatus.connected) {
          results.push({
            post_id: post.id,
            platform: post.platform,
            status: 'failed',
            error: 'Instagram not connected'
          });
          continue;
        }

        // Post to Instagram/Facebook via existing function
        const postResult = await base44.functions.invoke('autoPostUGCContent', {
          platform: post.platform,
          caption: post.caption,
          // You'll need to add image_url - for now using placeholder
          image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080' // Medical/tech image
        });

        // Update post status
        await base44.entities.SocialPost.update(post.id, {
          status: 'published',
          published_at: new Date().toISOString(),
          post_id: postResult.post_id || 'unknown'
        });

        results.push({
          post_id: post.id,
          platform: post.platform,
          status: 'published',
          platform_post_id: postResult.post_id
        });

      } catch (error) {
        console.error(`Error posting to ${post.platform}:`, error);
        
        await base44.entities.SocialPost.update(post.id, {
          status: 'failed',
          notes: error.message
        });

        results.push({
          post_id: post.id,
          platform: post.platform,
          status: 'failed',
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      published: results.filter(r => r.status === 'published').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    });

  } catch (error) {
    console.error('Error in auto post scheduler:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});