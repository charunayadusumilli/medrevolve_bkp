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
        
        // Use the Base44 image URL directly (Instagram requires direct image URLs)
        const imageUrl = imageResponse.url;
        console.log(`[INFO] Using Base44 image URL: ${imageUrl}`);
        
        // Upload to Google Drive for backup storage
        try {
          const driveResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=media`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${googleDriveToken.accessToken}`,
              'Content-Type': 'image/jpeg'
            },
            body: await fetch(imageUrl).then(r => r.arrayBuffer())
          });
          
          const driveData = await driveResponse.json();
          console.log(`[INFO] Backup uploaded to Drive: ${driveData.id}`);
          
          // Create SocialPost record
          const socialPost = await base44.entities.SocialPost.create({
            platform: "instagram",
            caption: `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(' ')}`,
            image_url: imageUrl,
            status: "draft",
            notes: `AI-generated content. Drive backup ID: ${driveData.id}`
          });
          
          generatedPosts.push({
            post,
            imageUrl,
            driveId: driveData.id,
            socialPostId: socialPost.id
          });
        } catch (driveError) {
          console.error('[WARN] Drive upload failed, continuing with Base44 URL:', driveError.message);
          
          // Still create the post record even if Drive fails
          const socialPost = await base44.entities.SocialPost.create({
            platform: "instagram",
            caption: `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(' ')}`,
            image_url: imageUrl,
            status: "draft",
            notes: `AI-generated content (Drive upload failed)`
          });
          
          generatedPosts.push({
            post,
            imageUrl,
            socialPostId: socialPost.id
          });
        }
        
      } catch (error) {
        console.error('[ERROR] Failed to generate post:', error.message);
      }
    }

    // Step 3: Auto-publish to Instagram ONLY (Facebook requires separate connector)
    let instagramCount = 0;
    
    for (const generatedPost of generatedPosts) {
      const fullCaption = `${generatedPost.post.hook}\n\n${generatedPost.post.body}\n\n${generatedPost.post.cta}\n\n${generatedPost.post.hashtags.join(' ')}`;
      
      // Instagram - use correct Graph API flow
      try {
        const instagramToken = await base44.asServiceRole.connectors.getConnection('instagram');
        
        // Step 1: Get Instagram Business Account ID
        const userRes = await fetch(
          `https://graph.instagram.com/me?fields=id,username&access_token=${instagramToken.accessToken}`
        );
        const userData = await userRes.json();
        
        if (!userData.id) {
          console.error('[ERROR] No Instagram user ID found:', userData);
          continue;
        }
        
        const userId = userData.id;
        console.log(`[INFO] Instagram Business Account ID: ${userId}`);
        
        // Step 2: Create media container
        const containerRes = await fetch(
          `https://graph.instagram.com/${userId}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: generatedPost.imageUrl,
              caption: fullCaption,
              access_token: instagramToken.accessToken
            })
          }
        );
        const containerData = await containerRes.json();
        console.log('[DEBUG] Container response:', JSON.stringify(containerData));
        
        if (containerData.error) {
          console.error('[ERROR] Container creation failed:', containerData.error.message);
          continue;
        }
        
        if (!containerData.id) {
          console.error('[ERROR] No container ID returned');
          continue;
        }
        
        // Step 3: Publish the container
        const publishRes = await fetch(
          `https://graph.instagram.com/${userId}/media_publish`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creation_id: containerData.id,
              access_token: instagramToken.accessToken
            })
          }
        );
        const publishData = await publishRes.json();
        console.log('[DEBUG] Publish response:', JSON.stringify(publishData));
        
        if (publishData.id) {
          await base44.entities.SocialPost.update(generatedPost.socialPostId, {
            status: "published",
            post_id: publishData.id,
            published_at: new Date().toISOString(),
            platform: "instagram"
          });
          instagramCount++;
          console.log(`[INFO] ✅ Published to Instagram: ${publishData.id}`);
        } else if (publishData.error) {
          console.error('[ERROR] Publish failed:', publishData.error.message);
        }
      } catch (error) {
        console.error('[ERROR] Instagram publishing failed:', error.message);
      }
    }

    // Step 4: Log summary
    console.log(`[SUCCESS] Generated ${generatedPosts.length} posts, Instagram: ${instagramCount}`);

    return Response.json({
      success: true,
      generated: generatedPosts.length,
      instagram_posts: instagramCount,
      posts: generatedPosts.map(p => ({
        caption: p.post.hook,
        imageUrl: p.imageUrl,
        platform: 'instagram'
      }))
    });

  } catch (error) {
    console.error('[ERROR]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});