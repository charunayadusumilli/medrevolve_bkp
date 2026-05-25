import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Ad content templates - high-converting UGC style
    const adTemplates = [
      {
        type: 'reel',
        hook: "POV: You found the GLP-1 loophole big pharma doesn't want you to know",
        content: "Telehealth + compounded semaglutide = 90% less than brand name. Your doctor can prescribe it legally. Link in bio to start.",
        cta: "Book consultation now",
        hashtags: ["#glp1", "#weightloss", "#semaglutide", "#telehealth", "#wellness"]
      },
      {
        type: 'ugc_testimonial',
        hook: "I lost 30lbs in 90 days and here's exactly how",
        content: "No gym. No crazy diets. Just GLP-1 medication from a legit telehealth provider. Down 2 dress sizes and feeling incredible.",
        cta: "Start your journey",
        hashtags: ["#weightlossjourney", "#glp1results", "#transformation", "#telehealth"]
      },
      {
        type: 'educational',
        hook: "3 things your doctor won't tell you about weight loss medications",
        content: "1️⃣ Compounded GLP-1 is the same active ingredient 2️⃣ Telehealth prescriptions are legal in all 50 states 3️⃣ Insurance rarely covers it but cash pay is under $300/mo",
        cta: "Learn more",
        hashtags: ["#weightlossmedication", "#glp1", "#telehealth", "#wellness"]
      },
      {
        type: 'problem_agitate',
        hook: "Tired of spending $1200/month on name brand GLP-1?",
        content: "There's a legal alternative. Same medication. Compounded pharmacy. Licensed providers. Fraction of the cost. This is what they don't want you to know.",
        cta: "Get started today",
        hashtags: ["#glp1", "#weightloss", "#affordablehealthcare", "#telehealth"]
      },
      {
        type: 'social_proof',
        hook: "500+ patients started their GLP-1 journey this month",
        content: "Average weight loss: 15-20lbs in first 90 days. 100% telehealth. No insurance needed. Licensed providers in all 50 states.",
        cta: "Join them",
        hashtags: ["#glp1community", "#weightloss", "#telehealth", "#results"]
      },
      {
        type: 'urgency',
        hook: "GLP-1 shortage update - what you need to know",
        content: "Brand names are sold out everywhere. But compounded pharmacies still have supply. Same medication. Available now. Don't wait months.",
        cta: "Check availability",
        hashtags: ["#glp1", "#shortage", "#weightloss", "#telehealth"]
      },
      {
        type: 'myth_busting',
        hook: "No, GLP-1 isn't just Ozempic. Here's the difference",
        content: "Ozempic/Wegovy = brand name (expensive, shortage). Compounded semaglutide = same active ingredient (affordable, available). Your choice.",
        cta: "Learn the facts",
        hashtags: ["#glp1", "#ozempic", "#semaglutide", "#weightloss"]
      },
      {
        type: 'before_after',
        hook: "90 days apart. Same person. Different medication.",
        content: "GLP-1 isn't magic - it's science. Reduces appetite. Regulates blood sugar. Sustainable weight loss. Talk to a provider today.",
        cta: "Start your transformation",
        hashtags: ["#beforeandafter", "#glp1results", "#weightloss", "#transformation"]
      }
    ];

    // Image prompts for each ad type
    const imagePrompts = {
      reel: "professional medical aesthetic, clean minimalist healthcare branding, before after transformation split screen, modern telehealth app interface",
      ugc_testimonial: "authentic user generated content style, casual selfie lighting, real person holding measuring tape, bathroom mirror, genuine smile",
      educational: "clean medical infographic style, green and white color scheme, professional healthcare branding, numbered list layout",
      problem_agitate: "frustrated person looking at pharmacy receipt, expensive medication bottle, relatable healthcare costs struggle",
      social_proof: "happy diverse group of people, success celebration, wellness lifestyle, modern healthcare setting",
      urgency: "breaking news style graphic, medication shortage alert, professional healthcare announcement, urgent but trustworthy",
      myth_busting: "comparison graphic, side by side medication bottles, educational healthcare content, fact check style",
      before_after: "professional before after transformation photo, split screen, wellness journey, healthy lifestyle imagery"
    };

    // Select random templates for this batch
    const selectedAds = adTemplates.sort(() => Math.random() - 0.5).slice(0, 4);
    
    const postsToCreate = selectedAds.map(ad => ({
      platform: 'instagram',
      caption: `${ad.hook}\n\n${ad.content}\n\n👉 ${ad.cta} - Link in bio\n\n${ad.hashtags.map(h => `#${h}`).join(' ')}`,
      image_url: `https://source.unsplash.com/random/1080x1080/?${ad.type.replace('_', '-')}`,
      status: 'scheduled',
      scheduled_at: new Date(Date.now() + Math.random() * 3600000).toISOString(), // Random time in next hour
      hashtags: ad.hashtags,
      notes: `Auto-generated ad content - ${ad.type}`
    }));

    // Create posts in database
    const created = await base44.entities.SocialPost.bulkCreate(postsToCreate);
    
    // Also create TikTok versions
    const tiktokPosts = selectedAds.map(ad => ({
      platform: 'tiktok',
      caption: `${ad.hook} #${ad.hashtags.slice(0, 5).join(' #')}`,
      image_url: `https://source.unsplash.com/random/1080x1920/?${ad.type.replace('_', '-')}`,
      status: 'scheduled',
      scheduled_at: new Date(Date.now() + Math.random() * 3600000).toISOString(),
      hashtags: ad.hashtags,
      notes: `Auto-generated TikTok ad - ${ad.type}`
    }));

    const tiktokCreated = await base44.entities.SocialPost.bulkCreate(tiktokPosts);

    // Generate Facebook posts (longer form)
    const facebookPosts = selectedAds.map(ad => ({
      platform: 'facebook',
      caption: `🏥 **${ad.hook}**\n\n${ad.content}\n\n✅ Licensed providers\n✅ All 50 states\n✅ No insurance required\n✅ Affordable pricing\n\n👉 ${ad.cta}: [Link in comments]\n\n${ad.hashtags.map(h => `#${h}`).join(' ')}`,
      image_url: `https://source.unsplash.com/random/1200x630/?${ad.type.replace('_', '-')}`,
      status: 'scheduled',
      scheduled_at: new Date(Date.now() + Math.random() * 3600000).toISOString(),
      hashtags: ad.hashtags,
      notes: `Auto-generated Facebook ad - ${ad.type}`
    }));

    const fbCreated = await base44.entities.SocialPost.bulkCreate(facebookPosts);

    return Response.json({
      success: true,
      message: `Generated ${postsToCreate.length + tiktokPosts.length + facebookPosts.length} ad posts across Instagram, TikTok, and Facebook`,
      instagram: postsToCreate.length,
      tiktok: tiktokPosts.length,
      facebook: facebookPosts.length,
      posts: [...postsToCreate, ...tiktokPosts, ...facebookPosts].map(p => ({
        type: p.notes,
        platform: p.platform,
        scheduled: p.scheduled_at
      }))
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});