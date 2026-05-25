import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Generate comprehensive marketing content including UGC scripts, static ads, and posts
    const contentPrompts = [
      {
        platform: 'instagram',
        content_type: 'ugc_video_script',
        prompt: `Create a 30-second UGC (User Generated Content) video script for MedRevolve telehealth platform. Include:
        - Hook (0-3s): "I launched my own telehealth business in 7 days..."
        - Problem (3-10s): Traditional healthcare business is expensive ($100k+ startup)
        - Solution (10-20s): MedRevolve white-label platform - compliance, providers, tech all included
        - CTA (20-30s): "Call 240-387-5224 or visit medrevolve.com to start YOUR business"
        - Include visual directions for each scene
        - Natural, conversational tone like a real customer testimonial
        - Add text overlay suggestions`
      },
      {
        platform: 'instagram',
        content_type: 'static_ad',
        prompt: `Create a high-converting static Instagram ad for MedRevolve targeting entrepreneurs. Include:
        - Headline: "Start Your Own Telehealth Business in 7 Days"
        - Bullet points: ✅ HIPAA Compliant ✅ Licensed Providers ✅ $2,999/mo All-Inclusive
        - Strong CTA: "Call 240-387-5224 | medrevolve.com"
        - Visual description for designer (professional, medical, trustworthy)
        - Keep text under 20% of image for Facebook ad rules
        - Include color scheme suggestions (blues, greens, whites)`
      },
      {
        platform: 'instagram',
        content_type: 'post',
        prompt: `Create an engaging Instagram post for MedRevolve telehealth platform. Include:
        - Hook emoji: 🚀 "Want to own a telehealth business without the headache?"
        - 3 key benefits: Compliance handled, Turnkey technology, 24/7 provider network
        - Social proof: "100+ partners launched successfully"
        - CTA: "📞 240-387-5224 | 🔗 Link in bio: medrevolve.com"
        - 20-25 trending hashtags: #telehealth #healthtech #entrepreneur #medspa #wellness #GLP1 #weightloss #businessowner #passiveincome #healthcare #digitalhealth #startup #medspaowner #aesthetics #antiaging #longevity #menshealth #womenshealth #fitness #nutrition`
      },
      {
        platform: 'facebook',
        content_type: 'long_form_post',
        prompt: `Create a detailed Facebook post for MedRevolve B2B platform. Include:
        - Opening question: "Thinking about starting your own healthcare business?"
        - Pain points: Licensing, compliance, EHR, billing, provider recruitment ($200k+ startup costs)
        - Solution: MedRevolve done-for-you platform
        - Features: Custom branded app/website, Licensed providers, HIPAA compliance, Payment processing, Marketing support
        - Pricing: Starting at $2,999/month (all-inclusive)
        - Urgency: "Limited spots available for Q2 2026"
        - CTA: "📞 Call 240-387-5224 for a FREE demo" or "🌐 Visit medrevolve.com/for-business"
        - Professional yet conversational tone
        - 5-7 hashtags: #Telehealth #HealthcareBusiness #Entrepreneur #MedSpa #Wellness #DigitalHealth #BusinessOpportunity`
      },
      {
        platform: 'facebook',
        content_type: 'video_ad_script',
        prompt: `Create a 60-second Facebook video ad script for MedRevolve. Include:
        - Scene 1 (0-5s): Problem - "Healthcare business dreams... crushed by red tape?"
        - Scene 2 (5-15s): Show overwhelming paperwork, licensing forms, tech setup
        - Scene 3 (15-30s): Solution reveal - MedRevolve platform dashboard, happy providers
        - Scene 4 (30-45s): Benefits montage - Custom app, Compliance badge, Provider network, Payment processing
        - Scene 5 (45-60s): Strong CTA - "Start YOUR telehealth empire today! Call 240-387-5224 or visit medrevolve.com"
        - Include background music suggestions (upbeat, inspiring)
        - Add text overlay timing
        - Voice-over script for each scene`
      },
      {
        platform: 'instagram',
        content_type: 'reel_script',
        prompt: `Create a trending Instagram Reel script (15-30 seconds) for MedRevolve. Include:
        - Trending audio suggestion (upbeat, motivational)
        - Quick cuts format:
          * 0-2s: "POV: You just launched your telehealth business"
          * 2-5s: Show custom branded app
          * 5-8s: "Compliance? ✅ Done"
          * 8-11s: "Providers? ✅ Licensed network"
          * 11-14s: "Tech? ✅ Custom platform"
          * 14-17s: "Cost? ✅ $2,999/mo all-in"
          * 17-20s: "Ready? Call 240-387-5224 | medrevolve.com"
        - Include transition suggestions
        - Add on-screen text timing
        - Hashtag suggestions for reels`
      },
      {
        platform: 'facebook',
        content_type: 'carousel_ad',
        prompt: `Create a 5-slide Facebook/Instagram carousel ad for MedRevolve. Include:
        - Slide 1: "Start Your Telehealth Business in 7 Days" + Hero image description
        - Slide 2: "✅ Custom Branded App & Website" + Features list
        - Slide 3: "✅ HIPAA Compliance & Legal" + Badge icons
        - Slide 4: "✅ Licensed Provider Network" + Doctor icons
        - Slide 5: "✅ $2,999/mo All-Inclusive" + CTA "Call 240-387-5224 | medrevolve.com"
        - For each slide: Headline (max 40 chars), Subtext (max 90 chars), Visual description
        - Consistent color scheme (medical blues/greens)
        - Professional, trustworthy aesthetic`
      }
    ];

    const generatedContent = [];

    for (const contentPrompt of contentPrompts) {
      const llmResponse = await base44.integrations.Core.InvokeLLM({
        prompt: contentPrompt.prompt,
        add_context_from_internet: false
      });

      generatedContent.push({
        platform: contentPrompt.platform,
        content: llmResponse,
        generated_at: new Date().toISOString()
      });
    }

    // High-converting image URLs for different content types (all from Unsplash - free to use)
    const imageUrls = {
      // Instagram square (1080x1080)
      instagram_ugc: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop', // Person with phone/laptop
      instagram_static: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop', // Medical tech
      instagram_post: 'https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop', // Healthcare professional
      
      // Facebook landscape (1200x630)
      facebook_long: 'https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1200&h=630&fit=crop', // Business meeting
      facebook_video_thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop', // Medical tech
      facebook_carousel: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=630&fit=crop', // Professional
      
      // Reels/Video thumbnails (1080x1920 vertical)
      reel_thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1080&h=1920&fit=crop', // Phone social media
      video_cover: 'https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1920&fit=crop' // Tech dashboard
    };

    // Create social post records in database with enhanced metadata
    const posts = await base44.entities.SocialPost.bulkCreate(
      generatedContent.map(post => {
        // Extract hashtags if present in content
        const hashtagMatch = post.content.match(/#[\w#]+/g);
        const hashtags = hashtagMatch ? hashtagMatch.slice(0, 20) : [];
        
        return {
          platform: post.platform,
          caption: post.content,
          image_url: imageUrls[`${post.platform}_${post.content_type}`] || imageUrls[`${post.platform}_post`] || imageUrls.instagram_post,
          status: 'draft',
          scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Schedule for tomorrow
          content_type: post.content_type,
          hashtags: hashtags,
          notes: `Auto-generated ${post.content_type} for ${post.platform} - includes phone 240-387-5224 and medrevolve.com links`
        };
      })
    );

    return Response.json({
      success: true,
      posts: posts,
      message: `Generated ${posts.length} high-converting marketing assets including UGC scripts, static ads, reels, and posts for Instagram and Facebook. All content includes phone number (240-387-5224) and website links (medrevolve.com). Ready to publish!`,
      content_breakdown: {
        ugc_video_scripts: generatedContent.filter(c => c.content_type === 'ugc_video_script').length,
        static_ads: generatedContent.filter(c => c.content_type === 'static_ad').length,
        reels_scripts: generatedContent.filter(c => c.content_type === 'reel_script').length,
        video_ad_scripts: generatedContent.filter(c => c.content_type === 'video_ad_script').length,
        carousel_ads: generatedContent.filter(c => c.content_type === 'carousel_ad').length,
        posts: generatedContent.filter(c => c.content_type === 'post' || c.content_type === 'long_form_post').length
      }
    });

  } catch (error) {
    console.error('Error generating social content:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});