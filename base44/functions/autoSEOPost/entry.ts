import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// SEO-focused telehealth content templates for automated weekly posting
const SEO_TOPICS = [
  {
    topic: "GLP-1 Weight Loss",
    keywords: ["semaglutide", "tirzepatide", "weight loss medication", "GLP-1 treatment"],
    hook: "Did you know GLP-1 medications can help you lose up to 15-20% of body weight?",
    cta: "Start your telehealth consultation today → medrevolve.com",
  },
  {
    topic: "Telehealth Convenience",
    keywords: ["online doctor", "telehealth appointment", "virtual healthcare", "remote medical care"],
    hook: "No waiting rooms. No commute. Real doctors, real prescriptions — from your phone.",
    cta: "Book your consultation in minutes → medrevolve.com",
  },
  {
    topic: "White Label Telehealth for Business",
    keywords: ["white label telehealth", "telehealth platform for business", "launch telehealth business"],
    hook: "Launch your own telehealth brand in days — not months. Full compliance. No tech team needed.",
    cta: "Get the platform → medrevolve.com",
  },
  {
    topic: "Men's Health & Hormone Therapy",
    keywords: ["TRT", "testosterone therapy", "men's health online", "hormone replacement"],
    hook: "Feeling tired, low energy, or losing muscle? Your hormones might be the answer.",
    cta: "Talk to a licensed provider → medrevolve.com",
  },
  {
    topic: "Weight Loss Without Surgery",
    keywords: ["non-surgical weight loss", "medical weight loss", "prescription weight loss"],
    hook: "Medical weight loss without the surgery. FDA-approved medications, licensed providers, delivered to your door.",
    cta: "See if you qualify → medrevolve.com",
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get Instagram access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Get IG user ID
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    const meData = await meRes.json();
    if (meData.error) {
      console.error('IG me error:', meData.error);
      return Response.json({ error: meData.error.message }, { status: 400 });
    }

    // Pick a rotating topic based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const topic = SEO_TOPICS[dayOfYear % SEO_TOPICS.length];

    // Generate AI caption optimized for SEO + Instagram
    const captionResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Write an Instagram caption for a telehealth platform called MedRevolve. 
Topic: ${topic.topic}
Hook to start with: "${topic.hook}"
CTA to end with: "${topic.cta}"
Keywords to naturally include: ${topic.keywords.join(', ')}

Requirements:
- Start with the hook
- 3-4 short punchy sentences in the middle with facts/benefits
- End with the CTA
- Add 15-20 relevant hashtags below the caption
- Keep total under 2200 characters
- Tone: professional but approachable, trustworthy

Return ONLY the caption text with hashtags. No extra commentary.`,
    });

    const caption = typeof captionResult === 'string' ? captionResult : captionResult.text || '';

    // Generate AI image for the post
    const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: `Professional telehealth marketing image for Instagram. Topic: ${topic.topic}. 
Clean, modern medical aesthetic. Bright white and green color palette. 
Include subtle imagery of: smartphone, doctor, wellness. 
No text overlays. 1:1 aspect ratio. High-quality, trustworthy medical brand feel.`,
    });

    const imageUrl = imageResult?.url;
    if (!imageUrl) {
      return Response.json({ error: 'Image generation failed' }, { status: 500 });
    }

    // Post to Instagram via Graph API (container + publish)
    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.instagram.com/${meData.id}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );
    const containerData = await containerRes.json();
    if (containerData.error) {
      console.error('IG container error:', containerData.error);
      return Response.json({ error: containerData.error.message }, { status: 400 });
    }

    // Step 2: Publish
    const publishRes = await fetch(
      `https://graph.instagram.com/${meData.id}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      }
    );
    const publishData = await publishRes.json();
    if (publishData.error) {
      console.error('IG publish error:', publishData.error);
      return Response.json({ error: publishData.error.message }, { status: 400 });
    }

    // Save to SocialPost entity for tracking
    await base44.asServiceRole.entities.SocialPost.create({
      platform: 'instagram',
      caption: caption,
      image_url: imageUrl,
      post_id: publishData.id,
      status: 'published',
      published_at: new Date().toISOString(),
      hashtags: caption.match(/#\w+/g) || [],
      notes: `Auto SEO post — Topic: ${topic.topic}`,
    });

    return Response.json({
      success: true,
      topic: topic.topic,
      post_id: publishData.id,
      caption_preview: caption.slice(0, 150) + '...',
    });

  } catch (error) {
    console.error('autoSEOPost error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});