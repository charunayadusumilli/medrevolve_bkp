import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Direct Facebook Graph API post (no Zapier needed) ──────────────────────
async function postToFacebook(accessToken, message, imageUrl) {
  try {
    // Get all pages the user manages
    const pagesRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesRes.json();
    console.log('[FB] Pages response:', JSON.stringify(pagesData).substring(0, 300));

    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error('No Facebook Pages found. Make sure the connected account manages at least one Facebook Page.');
    }

    const page = pagesData.data[0]; // Use first page
    const pageToken = page.access_token;
    const pageId = page.id;
    console.log(`[FB] Posting to page: ${page.name} (${pageId})`);

    // Post photo with message to the page
    const postRes = await fetch(`https://graph.facebook.com/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        message: message,
        access_token: pageToken
      })
    });
    const postData = await postRes.json();
    console.log('[FB] Post result:', JSON.stringify(postData));

    if (postData.id || postData.post_id) {
      return postData.post_id || postData.id;
    }

    // If photos fails, try feed post (text + link)
    console.log('[FB] Photos endpoint failed, trying feed post...');
    const feedRes = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        link: imageUrl,
        access_token: pageToken
      })
    });
    const feedData = await feedRes.json();
    console.log('[FB] Feed result:', JSON.stringify(feedData));

    if (feedData.id) return feedData.id;
    throw new Error('Facebook post failed: ' + JSON.stringify(feedData));

  } catch (err) {
    throw new Error('Facebook posting error: ' + err.message);
  }
}

// ── Also relay to Zapier as backup (for page scheduling tools etc.) ─────────
async function relayToZapier(zapierUrl, caption, imageUrl, targetAudience) {
  if (!zapierUrl) return false;
  try {
    const res = await fetch(zapierUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'facebook_post',
        platform: 'facebook',
        message: caption,
        image_url: imageUrl,
        link: 'https://medrevolve.com',
        phone: '240-387-5224',
        target_audience: targetAudience,
        source: 'generateAndPostAIContent'
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('[INFO] Generating AI content and posting...');

    // ── Step 1: AI-generate posts ─────────────────────────────────────────────
    const contentResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 5 unique high-converting direct-response social media posts for MedRevolve telehealth platform.

RULES — follow every single one:
1. Start with a BOLD hook that stops the scroll (emoji + problem/result statement)
2. 2-3 punchy sentences — benefits, results, or business opportunity
3. ALWAYS end with: "📞 Call or text: 240-387-5224" and "🌐 medrevolve.com"
4. 5-7 hashtags relevant to the content
5. NO vague wellness fluff — be SPECIFIC (GLP-1, semaglutide, tirzepatide, TRT, peptides, BHRT, white-label, $2,999/mo)
6. Write like a real person, not a corporation
7. Alternate between: weight loss patients, men's health, women's health, business opportunity, anti-aging
8. image_prompt MUST be a vivid, specific description (NEVER leave it empty or vague)

Return ONLY valid JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                caption: { type: "string" },
                image_prompt: { type: "string", description: "Specific visual description for image generation — NEVER empty" },
                target_audience: { type: "string" }
              },
              required: ["caption", "image_prompt", "target_audience"]
            }
          }
        },
        required: ["posts"]
      }
    });

    const posts = (contentResponse.posts || []).filter(p => p.caption && p.image_prompt);
    if (posts.length === 0) return Response.json({ error: 'No posts generated' }, { status: 500 });
    console.log(`[INFO] Generated ${posts.length} posts`);

    // ── Step 2: Get connectors ────────────────────────────────────────────────
    const { accessToken: igToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${igToken}`);
    const meData = await meRes.json();
    const igUserId = meData.id;
    if (!igUserId) throw new Error('Could not get Instagram user ID: ' + JSON.stringify(meData));

    // Get Facebook connector token (same Meta/Facebook connector)
    let fbToken = null;
    try {
      const fbConn = await base44.asServiceRole.connectors.getConnection('instagram'); // Instagram connector uses same Meta token
      fbToken = fbConn.accessToken;
    } catch (e) {
      console.log('[FB] Could not get Facebook token:', e.message);
    }

    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    let instagramCount = 0;
    let facebookCount = 0;
    const published = [];
    const FALLBACK_IMAGES = [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    ];

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      try {
        // ── Generate AI image with guaranteed fallback ─────────────────────
        let imageUrl = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
        const promptText = (post.image_prompt || '').trim();
        if (promptText && promptText.length > 10) {
          try {
            const imgRes = await base44.integrations.Core.GenerateImage({
              prompt: `${promptText}. Professional photography, bright lighting, high quality, lifestyle shot, natural colors, 1080x1080 square, Instagram-ready`
            });
            if (imgRes?.url) imageUrl = imgRes.url;
          } catch (imgErr) {
            console.warn(`[WARN] Image generation failed for post ${i+1}, using fallback. Error: ${imgErr.message}`);
          }
        }

        // ── Instagram ──────────────────────────────────────────────────────
        let igPostId = null;
        try {
          const containerRes = await fetch(`https://graph.instagram.com/${igUserId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: imageUrl, caption: post.caption, access_token: igToken })
          });
          const containerData = await containerRes.json();

          if (containerData.id) {
            await new Promise(r => setTimeout(r, 3000));
            const publishRes = await fetch(`https://graph.instagram.com/${igUserId}/media_publish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creation_id: containerData.id, access_token: igToken })
            });
            const publishData = await publishRes.json();
            if (publishData.id) {
              igPostId = publishData.id;
              instagramCount++;
              console.log(`[SUCCESS] Instagram post ${i+1}:`, igPostId);
            } else {
              console.error(`[ERROR] Instagram publish failed:`, JSON.stringify(publishData));
            }
          } else {
            console.error(`[ERROR] Instagram container failed:`, JSON.stringify(containerData));
          }
        } catch (igErr) {
          console.error(`[ERROR] Instagram post ${i+1}:`, igErr.message);
        }

        // Save Instagram record
        await base44.asServiceRole.entities.SocialPost.create({
          platform: 'instagram',
          caption: post.caption,
          image_url: imageUrl,
          post_id: igPostId,
          status: igPostId ? 'published' : 'failed',
          published_at: igPostId ? new Date().toISOString() : null,
          notes: `AI-generated | audience: ${post.target_audience}`
        });

        // ── Facebook: Direct Graph API first, Zapier as backup ────────────
        let fbPostId = null;
        let fbMethod = null;

        if (fbToken) {
          try {
            fbPostId = await postToFacebook(fbToken, post.caption, imageUrl);
            facebookCount++;
            fbMethod = 'graph_api_direct';
            console.log(`[SUCCESS] Facebook direct post ${i+1}:`, fbPostId);
          } catch (fbErr) {
            console.error(`[ERROR] Facebook direct post ${i+1}:`, fbErr.message);
            // Fallback to Zapier
            const zapOk = await relayToZapier(zapierUrl, post.caption, imageUrl, post.target_audience);
            if (zapOk) {
              facebookCount++;
              fbMethod = 'zapier_relay';
              console.log(`[INFO] Facebook Zapier relay ${i+1}: OK`);
            } else {
              console.error(`[ERROR] Facebook Zapier relay also failed for post ${i+1}`);
            }
          }
        } else {
          // No FB direct token — try Zapier only
          const zapOk = await relayToZapier(zapierUrl, post.caption, imageUrl, post.target_audience);
          if (zapOk) {
            facebookCount++;
            fbMethod = 'zapier_relay';
          }
        }

        await base44.asServiceRole.entities.SocialPost.create({
          platform: 'facebook',
          caption: post.caption,
          image_url: imageUrl,
          post_id: fbPostId,
          status: fbPostId || fbMethod === 'zapier_relay' ? 'published' : 'failed',
          published_at: fbMethod ? new Date().toISOString() : null,
          notes: fbMethod ? `Posted via ${fbMethod} | audience: ${post.target_audience}` : 'All Facebook methods failed'
        });

        published.push({
          caption: post.caption.substring(0, 80),
          imageUrl,
          igPostId,
          fbPostId,
          fbMethod,
          target: post.target_audience
        });

      } catch (postError) {
        console.error(`[ERROR] Post ${i+1} failed entirely:`, postError.message);
      }
    }

    console.log(`[DONE] Instagram: ${instagramCount}, Facebook: ${facebookCount}`);

    return Response.json({
      success: true,
      generated: posts.length,
      instagram_posts: instagramCount,
      facebook_posts: facebookCount,
      posts: published
    });

  } catch (error) {
    console.error('[ERROR]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});