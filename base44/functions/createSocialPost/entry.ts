import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, caption, image_url } = await req.json();

    // Validate input
    if (!caption || !image_url) {
      return Response.json({ error: 'Caption and image URL are required' }, { status: 400 });
    }

    if (!['instagram', 'facebook'].includes(platform)) {
      return Response.json({ error: 'Invalid platform. Use "instagram" or "facebook"' }, { status: 400 });
    }

    // Get Instagram/Facebook access token from connector
    // Note: Instagram connector provides access to both Instagram and Facebook
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    if (platform === 'instagram') {
      // Step 1: Get Instagram Business User ID
      const userResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
      );
      const userData = await userResponse.json();
      
      if (!userData.id) {
        return Response.json({ error: 'Failed to get Instagram user ID', details: userData }, { status: 500 });
      }

      // Step 2: Create Media Container
      const containerResponse = await fetch(
        `https://graph.instagram.com/${userData.id}/media?image_url=${encodeURIComponent(image_url)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const containerData = await containerResponse.json();

      if (!containerData.id) {
        return Response.json({ error: 'Failed to create media container', details: containerData }, { status: 500 });
      }

      // Step 3: Publish the post
      const publishResponse = await fetch(
        `https://graph.instagram.com/${userData.id}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const publishData = await publishResponse.json();

      if (!publishData.id) {
        return Response.json({ error: 'Failed to publish post', details: publishData }, { status: 500 });
      }

      // Save post record
      await base44.entities.SocialPost.create({
        platform: 'instagram',
        caption,
        image_url,
        post_id: publishData.id,
        status: 'published',
        created_by: user.email
      });

      return Response.json({ 
        success: true, 
        post_id: publishData.id,
        platform: 'instagram',
        message: 'Post published successfully to Instagram'
      });
    }

    if (platform === 'facebook') {
      // Get Facebook Page ID (you'll need to store this or retrieve from connector config)
      // For now, we'll use the default page
      const pageResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      );
      const pagesData = await pageResponse.json();

      if (!pagesData.data || pagesData.data.length === 0) {
        return Response.json({ error: 'No Facebook pages found' }, { status: 404 });
      }

      const page = pagesData.data[0];
      const pageAccessToken = page.access_token;
      const pageId = page.id;

      // Create Facebook post
      const postResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/photos?url=${encodeURIComponent(image_url)}&message=${encodeURIComponent(caption)}&access_token=${pageAccessToken}`,
        { method: 'POST' }
      );
      const postData = await postResponse.json();

      if (!postData.id) {
        return Response.json({ error: 'Failed to create Facebook post', details: postData }, { status: 500 });
      }

      // Save post record
      await base44.entities.SocialPost.create({
        platform: 'facebook',
        caption,
        image_url,
        post_id: postData.id,
        status: 'published',
        created_by: user.email
      });

      return Response.json({ 
        success: true, 
        post_id: postData.id,
        platform: 'facebook',
        message: 'Post published successfully to Facebook'
      });
    }

  } catch (error) {
    console.error('Error creating social post:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});