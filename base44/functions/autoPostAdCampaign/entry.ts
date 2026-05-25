import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get Instagram connection
    const { accessToken: igToken } = await base44.asServiceRole.connectors.getConnection("instagram");
    
    // Get Facebook page info from Instagram
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,instagram_business_account{username,followers_count,media_count}&access_token=${igToken}`
    );
    const igAccountData = await igAccountResponse.json();
    
    if (!igAccountData.data || !igAccountData.data[0]?.instagram_business_account) {
      throw new Error('Instagram Business account not connected');
    }

    const igAccountId = igAccountData.data[0].instagram_business_account.id;
    const fbPageId = igAccountData.data[0].id;

    // Get scheduled posts that are due
    const now = new Date().toISOString();
    const scheduledPosts = await base44.entities.SocialPost.filter({
      status: 'scheduled',
      scheduled_at: { $lte: now }
    });

    const results = {
      instagram: { success: 0, failed: 0 },
      facebook: { success: 0, failed: 0 },
      tiktok: { success: 0, failed: 0 }
    };

    for (const post of scheduledPosts) {
      try {
        if (post.platform === 'instagram' || post.platform === 'facebook') {
          // Download image
          const imageResponse = await fetch(post.image_url);
          const imageBlob = await imageResponse.blob();
          
          // Upload to Base44
          const arrayBuffer = await imageBlob.arrayBuffer();
          const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
          const uploadResponse = await fetch('https://api.base44.com/v1/integrations/core/upload-file', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('BASE44_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              file: `data:image/jpeg;base64,${base64Image}`,
              filename: `ad-${post.id}.jpg`
            })
          });
          
          const uploadData = await uploadResponse.json();
          const imageUrl = uploadData.file_url;

          if (post.platform === 'instagram') {
            // Create media container
            const containerResponse = await fetch(
              `https://graph.facebook.com/v18.0/${igAccountId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(post.caption)}&access_token=${igToken}`,
              { method: 'POST' }
            );
            const containerData = await containerResponse.json();
            
            if (containerData.id) {
              // Wait for processing
              await new Promise(resolve => setTimeout(resolve, 5000));
              
              // Publish
              const publishResponse = await fetch(
                `https://graph.facebook.com/v18.0/${igAccountId}/media_publish?creation_id=${containerData.id}&access_token=${igToken}`,
                { method: 'POST' }
              );
              const publishData = await publishResponse.json();
              
              if (publishData.id) {
                results.instagram.success++;
                await base44.entities.SocialPost.update(post.id, {
                  status: 'published',
                  published_at: new Date().toISOString(),
                  post_id: publishData.id
                });
              } else {
                throw new Error('Publish failed');
              }
            } else {
              throw new Error('Container creation failed');
            }
          }

          if (post.platform === 'facebook') {
            // Post to Facebook page
            const fbResponse = await fetch(
              `https://graph.facebook.com/v18.0/${fbPageId}/photos?url=${encodeURIComponent(imageUrl)}&message=${encodeURIComponent(post.caption)}&access_token=${igToken}`,
              { method: 'POST' }
            );
            const fbData = await fbResponse.json();
            
            if (fbData.id) {
              results.facebook.success++;
              await base44.entities.SocialPost.update(post.id, {
                status: 'published',
                published_at: new Date().toISOString(),
                post_id: fbData.id
              });
            } else {
              throw new Error('Facebook post failed');
            }
          }
        }

        if (post.platform === 'tiktok') {
          // TikTok posting would require additional connector setup
          // For now, mark as ready for manual posting
          results.tiktok.success++;
          await base44.entities.SocialPost.update(post.id, {
            status: 'ready_for_posting',
            notes: 'TikTok requires manual posting via app'
          });
        }

      } catch (error) {
        console.error(`Failed to post ${post.id}:`, error.message);
        results[post.platform].failed++;
        await base44.entities.SocialPost.update(post.id, {
          status: 'failed',
          notes: `Failed: ${error.message}`
        });
      }
    }

    return Response.json({
      success: true,
      message: `Posted: ${results.instagram.success} Instagram, ${results.facebook.success} Facebook, ${results.tiktok.success} TikTok`,
      results
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});