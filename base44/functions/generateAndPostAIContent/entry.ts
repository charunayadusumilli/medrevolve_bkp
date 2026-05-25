import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('[INFO] Generating AI content and posting...');

    // ── Step 1: AI-generate posts with HARD CTAs and phone number ─────────────
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

Format response as JSON array.`,
      response_json_schema: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                caption: { type: "string" },
                image_prompt: { type: "string" },
                target_audience: { type: "string" }
              },
              required: ["caption", "image_prompt", "target_audience"]
            }
          }
        },
        required: ["posts"]
      }
    });

    const posts = contentResponse.posts || [];
    if (posts.length === 0) return Response.json({ error: 'No posts generated' }, { status: 500 });

    console.log(`[INFO] Generated ${posts.length} posts`);

    // ── Step 2: Generate AI images + create Instagram + relay Facebook ────────
    const { accessToken: igToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${igToken}`);
    const meData = await meRes.json();
    const igUserId = meData.id;
    if (!igUserId) throw new Error('Could not get Instagram user ID: ' + JSON.stringify(meData));

    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    let instagramCount = 0;
    let facebookCount = 0;
    const published = [];

    for (const post of posts) {
      try {
        // Generate AI image
        const imgRes = await base44.integrations.Core.GenerateImage({
          prompt: `${post.image_prompt}. Professional photography, bright lighting, high quality, lifestyle shot, natural colors, 1080x1080 square, Instagram-ready`
        });
        const imageUrl = imgRes.url;

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
              console.log('[SUCCESS] Instagram:', igPostId);
            }
          }
        } catch (igErr) {
          console.error('[ERROR] Instagram post:', igErr.message);
        }

        // Save Instagram record
        const socialPost = await base44.asServiceRole.entities.SocialPost.create({
          platform: 'instagram',
          caption: post.caption,
          image_url: imageUrl,
          post_id: igPostId,
          status: igPostId ? 'published' : 'failed',
          published_at: igPostId ? new Date().toISOString() : null,
          notes: `AI-generated | audience: ${post.target_audience}`
        });

        // ── Facebook via Zapier ────────────────────────────────────────────
        if (zapierUrl) {
          try {
            const zapRes = await fetch(zapierUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'facebook_post',
                platform: 'facebook',
                message: post.caption,
                image_url: imageUrl,
                link: 'https://medrevolve.com',
                phone: '240-387-5224',
                target_audience: post.target_audience,
                source: 'generateAndPostAIContent'
              })
            });

            await base44.asServiceRole.entities.SocialPost.create({
              platform: 'facebook',
              caption: post.caption,
              image_url: imageUrl,
              status: zapRes.ok ? 'published' : 'failed',
              published_at: zapRes.ok ? new Date().toISOString() : null,
              notes: zapRes.ok ? 'Relayed to Facebook Page via Zapier' : 'Zapier relay failed'
            });

            if (zapRes.ok) facebookCount++;
          } catch (zapErr) {
            console.error('[ERROR] Zapier Facebook relay:', zapErr.message);
          }
        }

        published.push({ caption: post.caption.substring(0, 80), imageUrl, igPostId, target: post.target_audience });

      } catch (postError) {
        console.error('[ERROR] Post generation failed:', postError.message);
      }
    }

    console.log(`[DONE] Instagram: ${instagramCount}, Facebook: ${facebookCount}`);

    return Response.json({
      success: true,
      generated: posts.length,
      instagram_posts: instagramCount,
      facebook_posts: facebookCount,
      facebook_note: zapierUrl ? 'Facebook relayed via Zapier' : 'Facebook skipped — ZAPIER_WEBHOOK_URL not set',
      posts: published
    });

  } catch (error) {
    console.error('[ERROR]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});