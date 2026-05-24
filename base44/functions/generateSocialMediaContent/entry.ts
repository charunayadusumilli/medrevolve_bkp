import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Generate content for different platforms
    const contentPrompts = [
      {
        platform: 'instagram',
        prompt: `Create an engaging Instagram post for MedRevolve, a white-label telehealth platform. Include:
        - Hook about starting your own telehealth/GLP-1 business
        - 3 key benefits (compliance handled, turnkey solution, 24/7 support)
        - Call-to-action: "Call 240-387-5224 to start your business today"
        - 15-20 relevant hashtags for telehealth, wellness, entrepreneurship
        - Keep it under 2200 characters
        - Emoji-rich, visually appealing format`
      },
      {
        platform: 'facebook',
        prompt: `Create a Facebook post for MedRevolve targeting entrepreneurs wanting to start a telehealth business. Include:
        - Attention-grabbing opening question
        - Problem: Traditional healthcare business setup is expensive and complex
        - Solution: MedRevolve's turnkey white-label platform
        - Key stats: Launch in 7-14 days, $2,999/month all-inclusive
        - Strong CTA: "Call 240-387-5224 for a free demo"
        - Professional but conversational tone
        - 3-5 relevant hashtags`
      },
      {
        platform: 'linkedin',
        prompt: `Create a professional LinkedIn post for MedRevolve B2B platform. Include:
        - Industry insight about telehealth growth
        - Opportunity for med spas, wellness clinics, gyms to add revenue streams
        - MedRevolve value proposition (compliance, technology, network)
        - Credibility markers (HIPAA compliant, licensed providers, nation-wide)
        - CTA: "Schedule a demo: 240-387-5224 or visit medrevolve.com"
        - Professional tone, business-focused
        - 5-8 business/healthcare hashtags`
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

    // Professional image URLs for different platforms
    const imageUrls = {
      instagram: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop', // Medical/tech square
      facebook: 'https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1200&h=630&fit=crop', // Healthcare landscape
      linkedin: 'https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1200&h=627&fit=crop' // Business professional
    };

    // Create social post records in database
    const posts = await base44.entities.SocialPost.bulkCreate(
      generatedContent.map(post => ({
        platform: post.platform,
        caption: post.content,
        image_url: imageUrls[post.platform] || imageUrls.instagram,
        status: 'draft',
        scheduled_at: new Date(Date.now() + 86400000).toISOString() // Schedule for tomorrow
      }))
    );

    return Response.json({
      success: true,
      posts: posts,
      message: `Generated ${posts.length} social media posts for Instagram, Facebook, and LinkedIn`
    });

  } catch (error) {
    console.error('Error generating social content:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});