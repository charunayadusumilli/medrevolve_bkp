import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This is an automated function - use service role
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // UGC-style content templates with website links
    const ugcContent = [
      {
        caption: "🚀 Just launched my telehealth platform with @MedRevolve!\n\nSame-day appointments, GLP-1 weight loss, TRT, and more. Everything under MY brand.\n\n💼 Want to start your own wellness business? Link in bio → medrevolve.com\n\n#Telehealth #Entrepreneur #WellnessBusiness #GLP1 #PassiveIncome #MedRevolve",
        image_prompt: "Successful entrepreneur working on laptop with telehealth dashboard, modern home office, natural lighting, UGC style authentic photo"
      },
      {
        caption: "💊 My GLP-1 journey starts today!\n\nSigned up through a local MedRevolve partner - got my prescription in 48 hours. Game changer for weight loss!\n\n🩺 Start yours: medrevolve.com\n\n#GLP1 #Semaglutide #WeightLossJourney #Telehealth #WellnessTransformation #MedRevolve",
        image_prompt: "Person holding medication package at home, excited expression, natural selfie-style photo, wellness journey"
      },
      {
        caption: "⚡ Men, low T is real. I did something about it.\n\nTRT through MedRevolve - bloodwork, consultation, treatment. All online. Energy is back!\n\n💪 Learn more: medrevolve.com\n\n#MensHealth #TRT #Testosterone #WellnessJourney #Telehealth #FitnessMotivation #MedRevolve",
        image_prompt: "Fit man working out at home gym, confident pose, authentic UGC style, natural lighting"
      },
      {
        caption: "🌸 Finally found a telehealth platform that gets women's health!\n\nHormone balance, BHRT, menopause support - all with providers who listen. Thank you MedRevolve!\n\n👩‍⚕️ Book consultation: medrevolve.com\n\n#WomensHealth #Hormones #BHRT #Menopause #WellnessWarrior #Telehealth #MedRevolve",
        image_prompt: "Woman smiling at home, holding wellness products, authentic lifestyle photo, soft natural lighting"
      },
      {
        caption: "📦 Unboxing my MedRevolve order!\n\nDiscreet packaging, fast shipping, everything I needed. This is the future of healthcare.\n\n🛒 Order yours: medrevolve.com\n\n#Unboxing #WellnessProducts #Telehealth #HealthcareRevolution #SelfCare #MedRevolve",
        image_prompt: "Hands opening medication package on clean table, unboxing style, flat lay photography"
      },
      {
        caption: "🎯 From idea to income in 30 days!\n\nMy MedRevolve wellness store is LIVE. Selling GLP-1, RUO compounds, and supplements. White-label = genius!\n\n💰 Start your business: medrevolve.com\n\n#SideHustle #OnlineBusiness #WellnessEntrepreneur #PassiveIncome #Ecommerce #MedRevolve",
        image_prompt: "Person celebrating business success with laptop showing sales dashboard, authentic excitement, home office"
      },
      {
        caption: "🩺 Telehealth appointment done in 15 minutes!\n\nNo waiting room, no hassle. Just real care from licensed providers. This is healthcare done right.\n\n📱 Book now: medrevolve.com\n\n#Telehealth #HealthcareAccess #ConvenientCare #Wellness #DoctorVisit #MedRevolve",
        image_prompt: "Person on video call with doctor on laptop, comfortable home setting, healthcare accessibility"
      },
      {
        caption: "🔒 HIPAA-compliant, secure, and private.\n\nMy health data is safe with MedRevolve. Plus, their platform makes running my wellness business effortless!\n\n🛡️ Learn about security: medrevolve.com\n\n#HIPAA #DataSecurity #Telehealth #HealthcareBusiness #Trust #MedRevolve",
        image_prompt: "Person working confidently on laptop with security icons overlay, professional yet authentic UGC style"
      },
      {
        caption: "💼 Best business decision I made this year!\n\nMedRevolve handles compliance, fulfillment, providers. I focus on marketing. Revenue is growing! 📈\n\n🚀 Join the network: medrevolve.com\n\n#BusinessSuccess #WellnessIndustry #Entrepreneur #ScaleUp #MedRevolve #SuccessStory",
        image_prompt: "Business owner reviewing growth charts on laptop, satisfied expression, home office, success visualization"
      },
      {
        caption: "🌿 Natural wellness meets modern science.\n\nMy MedRevolve partner offers both RUO research compounds AND OTC supplements. Best of both worlds!\n\n🔬 Explore products: medrevolve.com\n\n#Wellness #ResearchCompounds #Supplements #HealthOptimization #Biohacking #MedRevolve",
        image_prompt: "Wellness products arranged aesthetically on clean surface, natural and scientific elements, flat lay"
      }
    ];

    // Pick random UGC content
    const randomIndex = Math.floor(Math.random() * ugcContent.length);
    const selectedContent = ugcContent[randomIndex];

    // IMPORTANT: Replace these with your actual UGC image URLs hosted on your CDN, Google Drive, or image hosting
    // Instagram requires images to be publicly accessible via direct URL
    // Example: Upload to your Google Drive (connected) and use signed URLs, or use your CDN
    const imageUrls = [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1080&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1080&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1080&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1080&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1080&q=80"
    ];

    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    // Post to both Instagram and Facebook
    const postToInstagram = async () => {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
      
      // Get Instagram Business User ID
      const userResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
      );
      const userData = await userResponse.json();
      
      if (!userData.id) {
        throw new Error('Failed to get Instagram user ID');
      }

      // Create Media Container
      const containerResponse = await fetch(
        `https://graph.instagram.com/${userData.id}/media?image_url=${encodeURIComponent(randomImage)}&caption=${encodeURIComponent(selectedContent.caption)}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const containerData = await containerResponse.json();

      if (!containerData.id) {
        throw new Error('Failed to create media container: ' + JSON.stringify(containerData));
      }

      // Wait longer for Instagram to process the image (Instagram requires up to 10s)
      console.log('[INFO] Waiting 10s for Instagram to process image...');
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Publish the post
      const publishResponse = await fetch(
        `https://graph.instagram.com/${userData.id}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const publishData = await publishResponse.json();

      if (!publishData.id) {
        throw new Error('Failed to publish post: ' + JSON.stringify(publishData));
      }

      return publishData.id;
    };

    const postToFacebook = async () => {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
      
      // Get Facebook Page ID
      const pageResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      );
      const pagesData = await pageResponse.json();

      if (!pagesData.data || pagesData.data.length === 0) {
        throw new Error('No Facebook pages found');
      }

      const page = pagesData.data[0];
      const pageAccessToken = page.access_token;
      const pageId = page.id;

      // Create Facebook post
      const postResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/photos?url=${encodeURIComponent(randomImage)}&message=${encodeURIComponent(selectedContent.caption)}&access_token=${pageAccessToken}`,
        { method: 'POST' }
      );
      const postData = await postResponse.json();

      if (!postData.id) {
        throw new Error('Failed to create Facebook post: ' + JSON.stringify(postData));
      }

      return { postId: postData.id, pageId };
    };

    // Post to Instagram (required)
    const instagramPostId = await postToInstagram();
    
    // Save Instagram post record
    await base44.entities.SocialPost.create({
      platform: 'instagram',
      caption: selectedContent.caption,
      image_url: randomImage,
      post_id: instagramPostId,
      status: 'published',
      created_by: user.email,
      notes: 'Auto-generated UGC content with medrevolve.com link'
    });

    // Try to post to Facebook (optional - may not have page connected)
    let facebookPostId = null;
    let facebookPageId = null;
    try {
      const fbResult = await postToFacebook();
      facebookPostId = fbResult.postId;
      facebookPageId = fbResult.pageId;
      
      await base44.entities.SocialPost.create({
        platform: 'facebook',
        caption: selectedContent.caption,
        image_url: randomImage,
        post_id: facebookPostId,
        status: 'published',
        created_by: user.email,
        notes: `Auto-generated UGC content with medrevolve.com link (Page: ${facebookPageId})`
      });
    } catch (fbError) {
      console.warn('Facebook posting skipped:', fbError.message);
      // Continue - Instagram is the primary platform
    }

    console.log('UGC content posted successfully!', {
      instagram_post_id: instagramPostId,
      facebook_post_id: facebookPostId,
      caption_preview: selectedContent.caption.substring(0, 50) + '...'
    });

    return Response.json({
      success: true,
      message: facebookPostId 
        ? 'UGC content posted to Instagram and Facebook' 
        : 'UGC content posted to Instagram (Facebook not connected)',
      instagram_post_id: instagramPostId,
      facebook_post_id: facebookPostId,
      content_used: selectedContent.caption.substring(0, 100) + '...'
    });

  } catch (error) {
    console.error('Error in auto UGC posting:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});