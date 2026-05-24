import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SERVICES = [
  {
    key: 'telehealth',
    name: 'Telehealth Platform',
    emoji: '🩺',
    hook: 'See a licensed provider from your phone in minutes.',
    pain: 'Tired of waiting weeks for a doctor?',
    cta: 'Start your consultation today',
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=telehealth_static&utm_content=ad1',
    hashtags: ['#Telehealth', '#OnlineDoctors', '#VirtualCare', '#TelehealthNow', '#MedRevolve', '#HealthTech', '#DoctorOnDemand', '#HealthcareAccess'],
    imagePrompt: 'A professional, clean telehealth scene: a smiling patient on a video call with a doctor on a modern smartphone, bright clinical white background, medical professional setting, lifestyle photography style, high contrast, vibrant colors suitable for Instagram ads',
    audience: 'patients seeking telehealth services'
  },
  {
    key: 'glp1',
    name: 'GLP-1 Weight Loss',
    emoji: '⚖️',
    hook: 'Clinically proven GLP-1 treatments. No wait. No hassle.',
    pain: 'Struggling with weight and nothing is working?',
    cta: 'Get your personalized plan',
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=glp1_static&utm_content=ad1',
    hashtags: ['#GLP1', '#WeightLoss', '#Semaglutide', '#Ozempic', '#WeightLossJourney', '#MedRevolve', '#Telehealth', '#HealthyWeight', '#FatLoss', '#Wellness'],
    imagePrompt: 'A before-and-after transformation lifestyle photo: a confident, healthy person in athletic wear showing their wellness journey, bright modern gym or outdoor setting, motivational mood, clean aesthetic for Instagram weight loss ad campaign',
    audience: 'adults seeking medically supervised weight loss'
  },
  {
    key: 'mens_health',
    name: "Men's Health",
    emoji: '💪',
    hook: 'TRT, ED treatments & more — delivered to your door.',
    pain: "Low energy, low drive, low confidence? You don't have to live like that.",
    cta: 'Fix it today — discreetly',
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=mens_health_static&utm_content=ad1',
    hashtags: ["#MensHealth", '#TRT', '#TestosteroneTherapy', '#EDTreatment', '#MensWellness', '#MedRevolve', '#Telehealth', '#MensFitness', '#Health'],
    imagePrompt: "A confident, fit man in his 40s working out or in a professional setting, strong and healthy, modern lifestyle photography, masculine clean aesthetic, motivational tone for men's health Instagram ad",
    audience: "men 35-65 seeking hormone therapy or ED treatment"
  },
  {
    key: 'womens_health',
    name: "Women's Health",
    emoji: '🌸',
    hook: 'Hormone balance, fertility & wellness — on your terms.',
    pain: 'Feeling off? Hormones affect everything.',
    cta: "Book your women's health consult",
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=womens_health_static&utm_content=ad1',
    hashtags: ["#WomensHealth", '#HormoneBalance', '#HRT', '#WomensWellness', '#MedRevolve', '#Telehealth', '#Fertility', '#WomenEmpowerment', '#Health'],
    imagePrompt: "A radiant, confident woman in her 40s doing yoga or enjoying morning coffee outdoors, soft natural lighting, feminine wellness aesthetic, empowering and positive mood for women's health Instagram ad campaign",
    audience: "women 30-55 seeking hormone therapy or wellness care"
  },
  {
    key: 'longevity',
    name: 'Longevity & Anti-Aging',
    emoji: '⚡',
    hook: 'Biohack your age. Live sharper, stronger, longer.',
    pain: 'What if aging was optional?',
    cta: 'Start your longevity protocol',
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=longevity_static&utm_content=ad1',
    hashtags: ['#Longevity', '#AntiAging', '#Biohacking', '#Peptides', '#MedRevolve', '#Telehealth', '#HealthOptimization', '#LiveLonger', '#Wellness'],
    imagePrompt: 'A vibrant, energetic person in their 50s running or cycling outdoors, looking youthful and powerful, bright optimistic lifestyle photography, longevity and anti-aging aesthetic for Instagram ad',
    audience: 'biohackers and health optimizers 40-65'
  },
  {
    key: 'white_label',
    name: 'White Label Platform',
    emoji: '🏢',
    hook: 'Launch your own telehealth brand in 48 hours.',
    pain: 'Your competitors are already offering telehealth. Are you?',
    cta: 'Get your white label demo',
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=white_label_b2b&utm_content=ad1',
    hashtags: ['#WhiteLabel', '#Telehealth', '#MedSpa', '#WellnessCenter', '#MedRevolve', '#B2BHealth', '#HealthcareStartup', '#TelehealthPlatform', '#BusinessOpportunity'],
    imagePrompt: 'A sleek modern medical spa or wellness clinic interior with branded signage, professional healthcare business setting, corporate clean aesthetic, showing a successful health business for B2B Instagram ad',
    audience: 'med spa owners, clinic operators, wellness entrepreneurs'
  },
  {
    key: 'pharmacy',
    name: 'Compounding Pharmacy',
    emoji: '💊',
    hook: 'Personalized compounded medications shipped directly to patients.',
    pain: 'Generic meds that don\'t quite work?',
    cta: 'Explore custom compounds',
    utm: 'utm_source=instagram&utm_medium=paid_social&utm_campaign=pharmacy_static&utm_content=ad1',
    hashtags: ['#CompoundingPharmacy', '#CustomMedication', '#GLP1', '#Semaglutide', '#MedRevolve', '#Telehealth', '#PersonalizedMedicine', '#RxDelivery'],
    imagePrompt: 'Clean pharmaceutical imagery: prescription bottles and medication packaging in a bright modern pharmacy setting, professional medical photography, clean white background with green accents for healthcare Instagram ad',
    audience: 'patients seeking custom compounded GLP-1 medications'
  },
  {
    key: 'ugc_testimonial',
    name: 'UGC Patient Success Story',
    emoji: '🌟',
    hook: 'Real patient. Real results. 47 lbs in 6 months.',
    pain: 'Still waiting for something that actually works?',
    cta: 'See how they did it — medrevolve.com',
    utm: 'utm_source=instagram&utm_medium=ugc&utm_campaign=patient_success&utm_content=testimonial1',
    hashtags: ['#RealResults', '#WeightLossSuccess', '#GLP1Results', '#MedRevolve', '#PatientStory', '#Transformation', '#Telehealth', '#HealthJourney', '#BeforeAndAfter'],
    imagePrompt: 'A candid, authentic UGC-style photo of a happy person holding their phone showing health stats, casual home setting, natural lighting, unpolished authentic feel like a real customer testimonial photo for Instagram',
    audience: 'weight loss seekers who respond to social proof'
  },
  {
    key: 'ugc_provider',
    name: 'UGC Provider Testimonial',
    emoji: '👨‍⚕️',
    hook: '"I see 40+ patients per week fully remote. MedRevolve made it possible." — Dr. James R.',
    pain: 'Looking to expand your practice without the overhead?',
    cta: 'Join our provider network',
    utm: 'utm_source=instagram&utm_medium=ugc&utm_campaign=provider_ugc&utm_content=testimonial1',
    hashtags: ['#MedicalProfessional', '#TelehealthProvider', '#DoctorLife', '#MedRevolve', '#NursePractitioner', '#TelemedicineJobs', '#HealthcareJobs', '#FutureOfMedicine'],
    imagePrompt: 'A professional doctor or nurse practitioner in scrubs or white coat, smiling while using a laptop or tablet for telehealth, modern medical office, authentic professional photography style for healthcare provider Instagram ad',
    audience: 'licensed healthcare providers and NPs seeking telehealth opportunities'
  },
  {
    key: 'ugc_merchant',
    name: 'UGC Merchant Success',
    emoji: '📈',
    hook: '"We added $22K/month in recurring revenue by adding telehealth to our gym." — Marcus T.',
    pain: 'Your gym members want GLP-1. Are you offering it?',
    cta: 'Add telehealth to your business',
    utm: 'utm_source=instagram&utm_medium=ugc&utm_campaign=merchant_ugc&utm_content=testimonial1',
    hashtags: ['#GymOwner', '#FitnessStudio', '#MedSpa', '#PassiveIncome', '#MedRevolve', '#WhiteLabel', '#BusinessGrowth', '#Telehealth', '#WellnessBusiness', '#Entrepreneur'],
    imagePrompt: 'A confident gym owner or fitness studio owner standing proudly in their facility, professional but approachable, modern fitness business aesthetic, success story feel for B2B Instagram merchant testimonial ad',
    audience: 'gym owners, fitness studios, wellness entrepreneurs'
  }
];

const BASE_URL = 'https://medrevolve.com';

function buildCaption(service, isUGC = false) {
  const url = `${BASE_URL}?${service.utm}`;
  
  if (isUGC) {
    return `${service.emoji} ${service.hook}

${service.pain}

${service.name === 'UGC Patient Success Story' 
  ? `We helped hundreds of patients transform their health with personalized GLP-1 protocols — guided by licensed providers, delivered to your door.`
  : service.name === 'UGC Provider Testimonial'
  ? `MedRevolve gives licensed providers the tools to see more patients, earn more, and work from anywhere. Join 100+ providers already on our platform.`
  : `Wellness businesses across the country are adding 5-6 figures in recurring revenue by white-labeling the MedRevolve telehealth platform.`
}

📞 Call or text: 240-387-5224
👉 ${service.cta}: ${url}

${service.hashtags.join('  ')}`;
  }

  return `${service.emoji} ${service.hook}

${service.pain}

Here's what MedRevolve offers:
✅ Licensed providers in 50 states
✅ Same-day consultations available  
✅ Medications shipped to your door
✅ 100% HIPAA compliant
✅ No insurance needed

📞 Call or text: 240-387-5224
👉 ${service.cta} → ${url}

${service.hashtags.join('  ')}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const serviceKeys = body.service_keys || SERVICES.map(s => s.key);
    const dryRun = body.dry_run || false;
    const postToInstagram = body.post_to_instagram !== false;

    const selectedServices = SERVICES.filter(s => serviceKeys.includes(s.key));
    const results = [];

    for (const service of selectedServices) {
      console.log(`Processing service: ${service.name}`);
      
      const isUGC = service.key.startsWith('ugc_');
      const caption = buildCaption(service, isUGC);

      // Generate AI image
      let imageUrl = null;
      try {
        const imgRes = await base44.asServiceRole.integrations.Core.GenerateImage({
          prompt: service.imagePrompt
        });
        imageUrl = imgRes.url;
        console.log(`Image generated for ${service.key}: ${imageUrl}`);
      } catch (imgErr) {
        console.error(`Image generation failed for ${service.key}:`, imgErr.message);
        imageUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&q=80';
      }

      // Save to SocialPost entity
      let postRecord = null;
      if (!dryRun) {
        postRecord = await base44.asServiceRole.entities.SocialPost.create({
          platform: 'instagram',
          caption,
          image_url: imageUrl,
          status: 'draft',
          hashtags: service.hashtags,
          notes: `GOD MODE AD | Service: ${service.name} | UTM: ${service.utm} | Type: ${isUGC ? 'UGC' : 'Static'}`
        });
        console.log(`SocialPost record created: ${postRecord.id}`);
      }

      // Post to Instagram
      let instagramResult = null;
      if (postToInstagram && !dryRun && imageUrl) {
        try {
          const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
          
          // Get Instagram user ID
          const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
          const meData = await meRes.json();
          const igUserId = meData.id;

          if (!igUserId) throw new Error('Could not get Instagram user ID');

          // Create media container
          const containerRes = await fetch(`https://graph.instagram.com/${igUserId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: imageUrl,
              caption: caption,
              access_token: accessToken
            })
          });
          const containerData = await containerRes.json();
          
          if (containerData.error) throw new Error(containerData.error.message);
          
          // Wait for media to process
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Publish
          const publishRes = await fetch(`https://graph.instagram.com/${igUserId}/media_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creation_id: containerData.id,
              access_token: accessToken
            })
          });
          const publishData = await publishRes.json();

          if (publishData.error) throw new Error(publishData.error.message);

          instagramResult = { success: true, post_id: publishData.id };

          // Update record with published status
          if (postRecord) {
            await base44.asServiceRole.entities.SocialPost.update(postRecord.id, {
              status: 'published',
              post_id: publishData.id,
              published_at: new Date().toISOString()
            });
          }

          console.log(`Published to Instagram: ${publishData.id}`);
        } catch (igErr) {
          console.error(`Instagram post failed for ${service.key}:`, igErr.message);
          instagramResult = { success: false, error: igErr.message };
        }
      }

      results.push({
        service: service.name,
        type: isUGC ? 'UGC' : 'Static Ad',
        utm_link: `${BASE_URL}?${service.utm}`,
        caption_preview: caption.substring(0, 120) + '...',
        image_url: imageUrl,
        record_id: postRecord?.id,
        instagram: instagramResult,
        hashtag_count: service.hashtags.length,
        target_audience: service.audience
      });

      // Rate limit between posts
      if (!dryRun && postToInstagram) {
        await new Promise(resolve => setTimeout(resolve, 8000));
      }
    }

    const published = results.filter(r => r.instagram?.success).length;
    const failed = results.filter(r => r.instagram?.success === false).length;
    const drafted = results.filter(r => !r.instagram).length;

    return Response.json({
      success: true,
      summary: {
        total_ads_created: results.length,
        published_to_instagram: published,
        saved_as_draft: drafted,
        failed: failed,
        static_ads: results.filter(r => r.type === 'Static Ad').length,
        ugc_ads: results.filter(r => r.type === 'UGC').length,
        all_link_to: BASE_URL
      },
      results
    });

  } catch (error) {
    console.error('God Mode Ad Campaign Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});