import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('[INFO] Starting AI content generation and auto-posting...');

    // Step 1: Generate AI content using InvokeLLM
    const contentResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 5 unique social media posts for MedRevolve telehealth platform. Each post should include:
      1. A catchy hook (first line with emoji)
      2. 2-3 sentences about telehealth/GLP-1/wellness benefits
      3. Call-to-action with medrevolve.com link
      4. 5-7 relevant hashtags
      
      Make them authentic, UGC-style, HIPAA-compliant (no medical claims), and engaging.
      Format as JSON array with: hook, body, cta, hashtags, image_prompt
      
      Image prompts should describe: professional, bright, lifestyle photos related to health/wellness/business.`,
      response_json_schema: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                hook: { type: "string" },
                body: { type: "string" },
                cta: { type: "string" },
                hashtags: { type: "array", items: { type: "string" } },
                image_prompt: { type: "string" }
              },
              required: ["hook", "body", "cta", "hashtags", "image_prompt"]
            }
          }
        },
        required: ["posts"]
      }
    });

    const posts = contentResponse.posts || [];
    console.log(`[INFO] Generated ${posts.length} posts`);

    if (posts.length === 0) {
      return Response.json({ error: 'No posts generated' }, { status: 500 });
    }

    // Step 2: Generate AI images and upload to Google Drive
    const googleDriveToken = await base44.asServiceRole.connectors.getConnection('googledrive');
    
    const generatedPosts = [];
    
    for (const post of posts) {
      try {
        // Generate AI image
        const imageResponse = await base44.integrations.Core.GenerateImage({
          prompt: `${post.image_prompt}. Professional photography, bright lighting, high quality, Instagram-worthy, lifestyle shot, natural colors, 1080x1080 square format`
        });
        
        console.log(`[INFO] Generated image: ${imageResponse.url}`);
        
        // Upload generated image to Google Drive using simple upload
        const driveResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=media`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleDriveToken.accessToken}`,
            'Content-Type': 'image/jpeg'
          },
          body: await fetch(imageResponse.url).then(r => r.arrayBuffer())
        });
        
        const driveData = await driveResponse.json();
        const imageUrl = driveData.webContentLink || `https://drive.google.com/uc?id=${driveData.id}`;
        
        console.log(`[INFO] Uploaded to Drive: ${imageUrl}`);
        
        // Create SocialPost record
        const socialPost = await base44.entities.SocialPost.create({
          platform: "instagram",
          caption: `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(' ')}`,
          image_url: imageUrl,
          status: "draft",
          notes: `AI-generated content. Drive file ID: ${driveData.id}`
        });
        
        generatedPosts.push({
          post,
          imageUrl,
          driveId: driveData.id,
          socialPostId: socialPost.id
        });
        
      } catch (error) {
        console.error('[ERROR] Failed to generate post:', error.message);
      }
    }

    // Step 3: Auto-publish to Instagram & Facebook
    let instagramCount = 0;
    let facebookCount = 0;
    
    for (const generatedPost of generatedPosts) {
      const fullCaption = `${generatedPost.post.hook}\n\n${generatedPost.post.body}\n\n${generatedPost.post.cta}\n\n${generatedPost.post.hashtags.join(' ')}`;
      
      // Instagram
      try {
        const instagramToken = await base44.asServiceRole.connectors.getConnection('instagram');
        const userRes = await fetch(
          `https://graph.instagram.com/me?fields=id,username&access_token=${instagramToken.accessToken}`
        );
        const userData = await userRes.json();
        const userId = userData.id;
        
        const containerRes = await fetch(
          `https://graph.instagram.com/${userId}/media?image_url=${encodeURIComponent(generatedPost.imageUrl)}&caption=${encodeURIComponent(fullCaption)}&access_token=${instagramToken.accessToken}`,
          { method: 'POST' }
        );
        const containerData = await containerRes.json();
        
        if (containerData.id) {
          const publishRes = await fetch(
            `https://graph.instagram.com/${userId}/media_publish?creation_id=${containerData.id}&access_token=${instagramToken.accessToken}`,
            { method: 'POST' }
          );
          const publishData = await publishRes.json();
          
          if (publishData.id) {
            await base44.entities.SocialPost.update(generatedPost.socialPostId, {
              status: "published",
              post_id: publishData.id,
              published_at: new Date().toISOString(),
              platform: "instagram"
            });
            instagramCount++;
            console.log(`[INFO] Published to Instagram: ${publishData.id}`);
          }
        }
      } catch (error) {
        console.error('[ERROR] Instagram publishing failed:', error.message);
      }
      
      // Facebook
      try {
        const facebookToken = await base44.asServiceRole.connectors.getConnection('instagram'); // Instagram connector includes Facebook pages
        const pagesRes = await fetch(
          `https://graph.facebook.com/v18.0/me/accounts?access_token=${facebookToken.accessToken}`
        );
        const pagesData = await pagesRes.json();
        
        if (pagesData.data && pagesData.data.length > 0) {
          const page = pagesData.data[0];
          const pageAccessToken = page.access_token;
          const pageId = page.id;
          
          const fbPublishRes = await fetch(
            `https://graph.facebook.com/v18.0/${pageId}/photos?url=${encodeURIComponent(generatedPost.imageUrl)}&published=true&message=${encodeURIComponent(fullCaption)}&access_token=${pageAccessToken}`,
            { method: 'POST' }
          );
          const fbPublishData = await fbPublishRes.json();
          
          if (fbPublishData.id) {
            await base44.entities.SocialPost.update(generatedPost.socialPostId, {
              status: "published",
              post_id: fbPublishData.id,
              published_at: new Date().toISOString(),
              platform: "facebook"
            });
            facebookCount++;
            console.log(`[INFO] Published to Facebook: ${fbPublishData.id}`);
          }
        }
      } catch (error) {
        console.error('[ERROR] Facebook publishing failed:', error.message);
      }
    }

    // Step 4: Log summary
    console.log(`[SUCCESS] Generated ${generatedPosts.length} posts, Instagram: ${instagramCount}, Facebook: ${facebookCount}`);

    return Response.json({
      success: true,
      generated: generatedPosts.length,
      instagram_posts: instagramCount,
      facebook_posts: facebookCount,
      posts: generatedPosts.map(p => ({
        caption: p.post.hook,
        imageUrl: p.imageUrl,
        platform: p.socialPostId ? 'instagram+facebook' : 'draft'
      }))
    });

  } catch (error) {
    console.error('[ERROR]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});