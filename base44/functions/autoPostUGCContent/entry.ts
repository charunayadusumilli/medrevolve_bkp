import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── High-converting direct-response content ────────────────────────────────────
// Every post includes: phone number 240-387-5224, medrevolve.com, hard CTA
const UGC_CONTENT = [
  {
    caption: `📞 ONE CALL changed my life.\n\nI called 240-387-5224, talked to MedRevolve for 10 minutes, and had my GLP-1 prescription in 48 hours. No waiting room. No runaround.\n\nIf you've been struggling with weight loss — just call. It's that easy.\n\n📱 240-387-5224\n🌐 medrevolve.com\n\n#GLP1 #Semaglutide #WeightLoss #Telehealth #MedRevolve #WeightLossJourney #GLP1WeightLoss`,
    image_prompt: "Person on phone, smiling, relieved expression, bright home setting, UGC lifestyle photo"
  },
  {
    caption: `🚨 TIRED OF BEING IGNORED BY YOUR DOCTOR?\n\nMedRevolve providers actually listen. Same-day telehealth consults for GLP-1, TRT, hormones, peptides.\n\nNo insurance drama. No gatekeeping. Real results.\n\n📞 Call NOW: 240-387-5224\n🌐 medrevolve.com\n\n#Telehealth #GLP1 #TRT #HormoneTherapy #WeightLoss #MedRevolve #HealthcareNow`,
    image_prompt: "Frustrated person turning happy after video call with doctor, transformation moment, authentic UGC style"
  },
  {
    caption: `💉 Down 37 lbs in 4 months.\n\nStarted GLP-1 through MedRevolve. Got my script in 2 days. Provider checks in weekly. I've NEVER had healthcare this personal.\n\nReady to start your journey?\n\n📞 240-387-5224 — call or text\n🌐 medrevolve.com\n\n#WeightLossResults #GLP1Results #Semaglutide #Tirzepatide #MedRevolve #Transformation`,
    image_prompt: "Before/after wellness transformation, person looking healthy and confident, authentic lifestyle"
  },
  {
    caption: `💼 I make $15K/month with my MedRevolve white-label store.\n\nI resell GLP-1, RUO compounds, and supplements under MY brand. MedRevolve handles everything else — compliance, providers, fulfillment.\n\nReady to start your business?\n\n📞 Call: 240-387-5224\n🌐 medrevolve.com/for-business\n\n#SideHustle #Entrepreneur #WellnessBusiness #MedRevolve #PassiveIncome #Telehealth`,
    image_prompt: "Confident entrepreneur with laptop showing revenue dashboard, home office, authentic success photo"
  },
  {
    caption: `⚡ Men — your energy CAN come back.\n\nTRT through MedRevolve. Bloodwork ordered online. Results in days. Treatment shipped to your door.\n\nI wish I called sooner.\n\n📞 240-387-5224\n🌐 medrevolve.com\n\n#TRT #TestosteroneTherapy #MensHealth #LowT #Testosterone #MedRevolve #MensWellness`,
    image_prompt: "Energetic fit man, confident expression, gym or outdoor setting, authentic UGC style"
  },
  {
    caption: `🌸 Finally — a platform that takes women's health SERIOUSLY.\n\nBHRT, hormone balance, thyroid, menopause support. Licensed female providers. Actual answers.\n\nBook your consult today:\n📞 240-387-5224\n🌐 medrevolve.com\n\n#WomensHealth #BHRT #HormoneBalance #Menopause #Thyroid #MedRevolve #WomensWellness`,
    image_prompt: "Confident woman, glowing, wellness lifestyle, soft natural lighting, authentic UGC photo"
  },
  {
    caption: `🏥 Want to open a med spa or telehealth clinic?\n\nMedRevolve gives you the ENTIRE infrastructure:\n✅ Branded website\n✅ Licensed providers\n✅ HIPAA compliance\n✅ GLP-1 & Rx fulfillment\n✅ Payment processing\n\nAll done-for-you.\n\n📞 Call today: 240-387-5224\n🌐 medrevolve.com\n\n#MedSpa #TelehealthBusiness #Healthcare #Entrepreneur #GLP1Business #MedRevolve`,
    image_prompt: "Modern medical spa or clinic interior, professional, clean, aspirational business setting"
  },
  {
    caption: `📦 My GLP-1 kit arrived in 3 days.\n\nDiscreet packaging. Everything labeled. Provider already scheduled my follow-up.\n\nThis is what healthcare SHOULD look like.\n\n📞 Start today: 240-387-5224\n🌐 medrevolve.com\n\n#GLP1 #Semaglutide #Tirzepatide #MedRevolve #HealthcareRevolution #WeightLoss`,
    image_prompt: "Medication package being opened on clean table, organized, unboxing style, flat lay photography"
  },
  {
    caption: `🔬 Peptides. GLP-1. TRT. HGH. All online.\n\nMedRevolve connects you to licensed providers who understand optimization — not just symptom management.\n\nReady to perform at 100%?\n\n📞 240-387-5224\n🌐 medrevolve.com\n\n#Peptides #Biohacking #GLP1 #TRT #Longevity #MedRevolve #HealthOptimization`,
    image_prompt: "Athletic person in prime health, peptides and supplements on clean surface, high performance lifestyle"
  },
  {
    caption: `💰 Start a $10K/mo wellness business for $2,999/month.\n\nMedRevolve white-label platform includes:\n→ Your own telehealth platform\n→ GLP-1 & compound pharmacy access\n→ Built-in compliance\n→ Marketing support\n\nSpots are LIMITED.\n\n📞 240-387-5224\n🌐 medrevolve.com\n\n#TelehealthBusiness #GLP1Business #WhiteLabel #MedRevolve #BusinessOpportunity`,
    image_prompt: "Business opportunity, success mindset, laptop with revenue growth chart, entrepreneur lifestyle"
  }
];

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1080&h=1080&fit=crop",
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Pick random content & image
    const content = UGC_CONTENT[Math.floor(Math.random() * UGC_CONTENT.length)];
    const imageUrl = IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)];

    const results = { instagram: null, facebook: null, errors: [] };

    // ── 1. POST TO INSTAGRAM ─────────────────────────────────────────────────
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

      const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
      const meData = await meRes.json();
      if (!meData.id) throw new Error('No Instagram user ID: ' + JSON.stringify(meData));

      const containerRes = await fetch(
        `https://graph.instagram.com/${meData.id}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(content.caption)}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const containerData = await containerRes.json();
      if (!containerData.id) throw new Error('Container failed: ' + JSON.stringify(containerData));

      // Wait for Instagram to process
      await new Promise(r => setTimeout(r, 10000));

      const publishRes = await fetch(
        `https://graph.instagram.com/${meData.id}/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const publishData = await publishRes.json();
      if (!publishData.id) throw new Error('Publish failed: ' + JSON.stringify(publishData));

      results.instagram = publishData.id;

      await base44.asServiceRole.entities.SocialPost.create({
        platform: 'instagram',
        caption: content.caption,
        image_url: imageUrl,
        post_id: publishData.id,
        status: 'published',
        published_at: new Date().toISOString(),
        notes: 'Auto-posted via autoPostUGCContent | includes 240-387-5224 CTA'
      });

      console.log('[SUCCESS] Instagram posted:', publishData.id);
    } catch (e) {
      results.errors.push('Instagram: ' + e.message);
      console.error('[ERROR] Instagram:', e.message);
    }

    // ── 2. POST TO FACEBOOK via Zapier webhook ───────────────────────────────
    // Facebook has no direct Base44 connector — we use Zapier to relay the post
    // to the MedRevolve Facebook Page. Set up a Zap: Webhook → Facebook Pages "Create Post"
    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    if (zapierUrl) {
      try {
        const zapRes = await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'facebook_post',
            platform: 'facebook',
            message: content.caption,
            image_url: imageUrl,
            link: 'https://medrevolve.com',
            phone: '240-387-5224',
            source: 'autoPostUGCContent'
          })
        });

        const zapOk = zapRes.ok;
        console.log('[INFO] Zapier Facebook relay status:', zapRes.status);

        // Save record regardless — Zapier handles the actual Facebook post
        await base44.asServiceRole.entities.SocialPost.create({
          platform: 'facebook',
          caption: content.caption,
          image_url: imageUrl,
          status: zapOk ? 'published' : 'failed',
          published_at: zapOk ? new Date().toISOString() : null,
          notes: zapOk
            ? 'Relayed to Facebook Page via Zapier webhook'
            : 'Zapier relay failed — check Zapier dashboard'
        });

        results.facebook = zapOk ? 'relayed_via_zapier' : 'zapier_error';
      } catch (e) {
        results.errors.push('Facebook/Zapier: ' + e.message);
        console.error('[ERROR] Zapier Facebook relay:', e.message);
      }
    } else {
      console.log('[WARN] ZAPIER_WEBHOOK_URL not set — Facebook post skipped');
      results.errors.push('Facebook: ZAPIER_WEBHOOK_URL not configured');
    }

    return Response.json({
      success: true,
      instagram: results.instagram ? '✅ Posted' : '❌ Failed',
      facebook: results.facebook === 'relayed_via_zapier' ? '✅ Relayed to Facebook via Zapier' : '⚠️ ' + (results.facebook || 'Not configured'),
      caption_preview: content.caption.substring(0, 120) + '...',
      errors: results.errors
    });

  } catch (error) {
    console.error('[ERROR] autoPostUGCContent:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});