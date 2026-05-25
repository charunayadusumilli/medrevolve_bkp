import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate Facebook-specific content
    const fbPrompts = [
      `Create a professional Facebook post for MedRevolve B2B platform:
      - Opening: "Thinking about starting your own telehealth business?"
      - Pain points: Licensing, compliance, EHR, billing ($200k+ startup)
      - Solution: MedRevolve done-for-you platform
      - Features: Custom branded app, Licensed providers, HIPAA compliance
      - Pricing: $2,999/month all-inclusive
      - CTA: "Call 240-387-5224 or visit medrevolve.com/for-business"
      - Professional tone, 5-7 hashtags`,
      
      `Create an engaging Facebook post about GLP-1 telehealth:
      - Hook: "The weight loss revolution is here!"
      - Benefits: Telehealth convenience, licensed providers, affordable
      - Include: medrevolve.com and phone 240-387-5224
      - Emojis: 💊⚕️📱
      - 10-15 hashtags including #GLP1 #WeightLoss #Telehealth`,
      
      `Create a Facebook post for MedRevolve partner success:
      - Story: "From idea to income in 30 days"
      - Features: White-label platform, compliance handled, fulfillment
      - CTA: "Start your wellness business today"
      - Include website and phone
      - Success-focused tone`
    ];

    const generatedPosts = [];
    
    for (const prompt of fbPrompts) {
      const llmResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });
      generatedPosts.push(llmResponse);
    }

    // Facebook-friendly image URLs (landscape 1200x630)
    const imageUrls = [
      "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1200&h=630&fit=crop",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=630&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop"
    ];

    // Create Facebook post records
    const posts = await base44.entities.SocialPost.bulkCreate(
      generatedPosts.map((caption, index) => ({
        platform: 'facebook',
        caption: caption,
        image_url: imageUrls[index % imageUrls.length],
        status: 'draft',
        scheduled_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        hashtags: [],
        notes: 'Facebook-specific content - ready for manual or auto posting'
      }))
    );

    return Response.json({
      success: true,
      posts: posts,
      message: `Generated ${posts.length} Facebook posts ready to publish`,
      next_step: 'Run autoPostToSocial to publish these to Facebook, or post manually from SocialMediaManagement page'
    });

  } catch (error) {
    console.error('Error generating Facebook content:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});