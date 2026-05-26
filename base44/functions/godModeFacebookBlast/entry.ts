import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// 30 posts across all content types
const BLAST_CONTENT = [
  // ── B2B MERCHANT (8 posts) ──────────────────────────────────────────────
  {
    message: `🏥 ATTENTION: Med Spa & Clinic Owners\n\nAre you STILL building your telehealth business from scratch?\n\nMedRevolve gives you a TURNKEY merchant platform:\n✅ White-label telehealth website (YOUR brand)\n✅ GLP-1 & compound Rx fulfillment\n✅ Built-in billing + payment processing\n✅ Licensed provider network (50+ MDs)\n✅ HIPAA-compliant infrastructure\n\nLaunch in 30 days or less.\n\n📞 CALL NOW: 240-387-5224\n🌐 medrevolve.com/for-business`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  {
    message: `💼 I make $30K/month with my MedRevolve white-label store.\n\nI resell GLP-1, RUO compounds, and supplements under MY brand.\nMedRevolve handles compliance, providers, and fulfillment.\n\nReady to start your business?\n\n📞 Call: 240-387-5224\n🌐 medrevolve.com/for-business`,
    image_url: "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1080&h=1080&fit=crop",
    type: "b2b_ugc"
  },
  {
    message: `🚀 FROM ZERO TO REVENUE IN 30 DAYS\n\nDay 1: Sign merchant agreement\nDay 3: Branded platform goes live\nDay 7: Marketing assets delivered\nDay 14: First patients booking\nDay 30: First revenue check\n\nThis is the MedRevolve merchant timeline.\n\n📞 Start the clock: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    type: "b2b_promo"
  },
  {
    message: `💰 $2,999/mo vs. $90,000+ building it yourself.\n\nBuilding a telehealth platform alone:\n❌ Attorney: $15,000\n❌ Dev team: $50,000+\n❌ Provider credentialing: 6 months\n❌ Compliance setup: $25,000\n\nMedRevolve merchant account:\n✅ $2,999/mo. Everything included. Live in 30 days.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  {
    message: `🔑 3 MYTHS stopping you from owning a telehealth business:\n\n❌ "I need a medical license" — FALSE. MedRevolve provides licensed providers.\n❌ "HIPAA is too complex" — FALSE. It's built in.\n❌ "I can't afford startup costs" — FALSE. $2,999/mo, zero build costs.\n\nThe only thing stopping you is this post.\n\n📞 240-387-5224\n🌐 medrevolve.com/for-business`,
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  {
    message: `🤝 PARTNER PROGRAM: Earn $500 per merchant you refer\n\nKnow someone who should own a MedRevolve telehealth business?\n\nRefer them → they sign → you earn $500.\nNo cap. Top partners earn $5,000–$10,000/month.\n\n📞 Get your referral code: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
    type: "b2b_promo"
  },
  {
    message: `⚡ LIVE DEMO: See a MedRevolve merchant platform in action\n\nWhat's included:\n→ Custom-branded telehealth website\n→ Automated GLP-1 consultation booking\n→ Built-in e-commerce (supplements + Rx)\n→ Provider dashboard + SOAP notes\n→ Automated billing & compliance\n\n📞 Book your demo: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
    type: "b2b_promo"
  },
  {
    message: `🏆 If you're a gym owner, chiropractor, nurse practitioner, med spa owner, or health coach —\n\nYou can ADD telehealth GLP-1 revenue to your existing business with MedRevolve.\n\nNo new licenses. No overhead. New revenue stream.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  // ── COMPLIANCE (6 posts) ────────────────────────────────────────────────
  {
    message: `⚠️ Is your telehealth business HIPAA compliant?\n\nMost new telehealth businesses fail their first audit.\n\nCommon violations:\n❌ No BAA with vendors\n❌ Unencrypted patient data\n❌ Missing consent forms\n❌ No breach policy\n\nMedRevolve merchants are FULLY covered — compliance built in.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `🔒 I almost lost my telehealth business to a DEA audit.\n\nNo compliance framework. Just hope.\n\nThen MedRevolve walked me through everything:\n✅ State-by-state prescribing laws\n✅ Compound pharmacy documentation\n✅ Provider credentialing\n✅ Patient record encryption\n\nOne year later. Zero violations. $40K/month.\n\n📞 Don't learn the hard way: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
    type: "compliance_ugc"
  },
  {
    message: `📋 COMPLIANCE CHECKLIST for GLP-1 Businesses\n\nBefore you sell ONE prescription:\n☐ Licensed prescribers in every state\n☐ 503A/503B compliant pharmacy\n☐ Patient consent documentation\n☐ HIPAA tech stack\n☐ DEA protocols\n☐ FTC advertising compliance\n\nThis takes months to build alone. MedRevolve has it ALL pre-built.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `🏛️ GLP-1 regulations shifted in 14 states this year alone.\n\nAre you keeping up?\n\nMedRevolve monitors:\n→ State telehealth prescribing laws\n→ FDA compound pharmacy guidance\n→ DEA controlled substance rules\n→ HIPAA updates\n\nSo you don't have to. Focus on patients.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `✅ Your compliance package includes:\n\n📁 Patient intake forms (state-specific)\n📁 Informed consent templates\n📁 HIPAA privacy notices\n📁 BAA templates for all vendors\n📁 Prescription tracking logs\n📁 Audit response playbooks\n\n$50,000+ in legal work — included in your MedRevolve platform.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `🚨 Selling compounded medications without proper oversight = federal crime.\n\nThe FDA, DEA, and your state medical board are watching.\n\nMedRevolve keeps you protected:\n✅ 503A/503B compliant pharmacy network\n✅ Provider-supervised prescribing only\n✅ All orders medically supervised\n\nRun a real business. Stay protected.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
    type: "compliance_warning"
  },
  // ── UGC PATIENT (8 posts) ───────────────────────────────────────────────
  {
    message: `📞 I texted 240-387-5224 on a Tuesday.\n\nBy Thursday I had my GLP-1 prescription.\n\nNo doctor's office. No 6-week waitlist. No insurance battle.\n\nJust a 15-minute video call and done.\n\n📞 Text or call: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  {
    message: `💉 67 days. 22 pounds. One phone call.\n\nI called MedRevolve after seeing them on social media.\n\nWeek 2: Semaglutide arrived at my door\nWeek 8: Down 22 lbs, energy through the roof\n\nGLP-1 changed the equation completely.\n\n📞 Your consult is FREE: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  {
    message: `⚡ Men — your energy CAN come back.\n\nTRT through MedRevolve:\n→ Bloodwork ordered online\n→ Men's health specialist consult\n→ Testosterone shipped to your door\n→ Ongoing monitoring\n\nI wish I called sooner.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
    type: "ugc_mens_health"
  },
  {
    message: `🌸 Finally — a platform that takes women's health seriously.\n\nBHRT, hormone balance, menopause support. Licensed female providers. Actual answers.\n\nNo "just take birth control" dismissal.\n\nBook today:\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
    type: "ugc_womens_health"
  },
  {
    message: `🙋 Honest review after 3 months with MedRevolve:\n\n✅ Prescription in 48 hours\n✅ Provider actually answers messages\n✅ Discreet packaging\n✅ Monthly follow-ups included\n✅ WAY cheaper than my old clinic\n\n10/10. Recommend to everyone.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
    type: "ugc_review"
  },
  {
    message: `🔬 Peptides. GLP-1. TRT. HGH. All online.\n\nMedRevolve connects you to licensed providers who understand optimization — not just symptom management.\n\nReady to perform at 100%?\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1080&fit=crop",
    type: "ugc_biohacking"
  },
  {
    message: `📦 My GLP-1 kit arrived in 3 days.\n\nDiscreet packaging. Everything labeled. Provider already scheduled my follow-up.\n\nThis is what healthcare SHOULD look like.\n\n📞 Start today: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  {
    message: `🚨 TIRED OF BEING IGNORED BY YOUR DOCTOR?\n\nMedRevolve providers actually listen. Same-day telehealth consults for GLP-1, TRT, hormones, peptides.\n\nNo insurance drama. No gatekeeping. Real results.\n\n📞 Call NOW: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  // ── PROMOS & OFFERS (8 posts) ────────────────────────────────────────────
  {
    message: `🎁 FREE: 60-Min Merchant Strategy Session ($500 value)\n\nThis week only — book a FREE session with our merchant success team:\n→ Full platform demo\n→ Custom revenue projections\n→ No pressure, no obligation\n\nOnly 5 spots per week.\n\n📞 Book yours NOW: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
    type: "promo_free_offer"
  },
  {
    message: `💊 GLP-1 Consultation — $199\n\nNo insurance needed.\nNo referral needed.\nNo waiting room.\n\nWhat you get:\n→ 1-on-1 video consult with licensed MD\n→ Full health assessment\n→ GLP-1 prescription if appropriate\n→ 30-day supply shipped to your door\n\n📞 Book: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
    type: "promo_patient_offer"
  },
  {
    message: `⚡ FLASH DEAL: GLP-1 Starter Pack — $299\n\n✅ Initial telehealth consultation\n✅ 30-day semaglutide supply\n✅ Injection training guide\n✅ 2 follow-up check-ins\n✅ Nutrition protocol\n\nLimited to 50 patients.\n\n📞 240-387-5224 — call NOW\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
    type: "promo_flash"
  },
  {
    message: `📊 MedRevolve Merchant ROI — Real Numbers\n\nAverage merchant month 1: $12,000\nAverage merchant month 6: $45,000+\nPlatform cost: $2,999/mo\n\nThat's a 15x return on investment.\n\n📞 Run the numbers with us: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
    type: "promo_roi"
  },
  {
    message: `🎯 LIMITED SPOTS: MedRevolve Merchant Onboarding\n\nWe only accept 10 new merchants per month.\n\n$2,999/mo includes:\n✅ Telehealth platform\n✅ GLP-1 + Rx access\n✅ Full compliance\n✅ Provider network\n✅ Marketing assets\n✅ Dedicated account manager\n\n📞 RESERVE YOUR SPOT: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
    type: "promo_limited"
  },
  {
    message: `🌐 Q2 BUNDLE — Save $500/mo\n\nTelehealth Platform + Compliance + Marketing Kit\n\nNormal: $3,499/mo\nQ2 price: $2,999/mo\n\nIncludes:\n→ White-label telehealth platform\n→ Full compliance framework\n→ 100 done-for-you social posts/month\n→ Google Ads setup\n→ Patient acquisition funnel\n\n📞 Lock in Q2 pricing: 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1080&fit=crop",
    type: "promo_bundle"
  },
  {
    message: `💸 FIRST MONTH FREE — For Qualifying Merchants\n\nOpen 10+ patient accounts in your first 30 days → we credit your first month back.\n\n$2,999 back in your pocket.\n\nMost merchants hit 10 patients in week 1.\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    type: "promo_first_month"
  },
  {
    message: `🩺 TELEHEALTH IS THE FUTURE.\n\n$500 billion market by 2030.\nGLP-1 alone is a $100 billion industry.\n\nThe question isn't IF you should be in this space.\n\nThe question is: Are you going to build it alone or launch in 30 days with MedRevolve?\n\n📞 240-387-5224\n🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "promo_vision"
  }
];

// ── Direct Facebook Graph API post ─────────────────────────────────────────
async function postToFacebookPage(accessToken, message, imageUrl) {
  // Get pages
  const pagesRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
  const pagesData = await pagesRes.json();
  console.log('[FB] Pages:', JSON.stringify(pagesData).substring(0, 400));

  if (!pagesData.data || pagesData.data.length === 0) {
    throw new Error('No Facebook Pages found. The connected Facebook account must manage at least one Page.');
  }

  const page = pagesData.data[0];
  const pageToken = page.access_token;
  const pageId = page.id;
  console.log(`[FB] Using page: ${page.name} (${pageId})`);

  // Try photo post first
  const photoRes = await fetch(`https://graph.facebook.com/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: imageUrl, message, access_token: pageToken })
  });
  const photoData = await photoRes.json();

  if (photoData.id || photoData.post_id) {
    return { id: photoData.post_id || photoData.id, page: page.name, method: 'photos' };
  }

  console.warn('[FB] Photo post failed:', JSON.stringify(photoData), '— trying feed...');

  // Fallback to feed post
  const feedRes = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `${message}\n\n${imageUrl}`, access_token: pageToken })
  });
  const feedData = await feedRes.json();

  if (feedData.id) return { id: feedData.id, page: page.name, method: 'feed' };
  throw new Error('All Facebook post methods failed: ' + JSON.stringify(feedData));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');

    console.log(`[START] God Mode Facebook Blast — ${BLAST_CONTENT.length} posts`);

    // ── Get Facebook token via Instagram connector (same Meta token) ────────
    let fbToken = null;
    try {
      const conn = await base44.asServiceRole.connectors.getConnection('instagram');
      fbToken = conn.accessToken;
      console.log('[INFO] Got Meta/Facebook access token via Instagram connector');
    } catch (e) {
      console.warn('[WARN] Could not get Meta token:', e.message);
    }

    const results = [];
    let directCount = 0;
    let zapierCount = 0;
    let failCount = 0;

    for (let i = 0; i < BLAST_CONTENT.length; i++) {
      const post = BLAST_CONTENT[i];
      let success = false;
      let method = null;
      let fbPostId = null;

      // ── Method 1: Direct Facebook Graph API ──────────────────────────────
      if (fbToken) {
        try {
          const result = await postToFacebookPage(fbToken, post.message, post.image_url);
          fbPostId = result.id;
          directCount++;
          success = true;
          method = `direct_graph_api (${result.page})`;
          console.log(`[✅ ${i+1}/30] Direct Facebook: ${result.id} | page: ${result.page}`);
        } catch (fbErr) {
          console.error(`[⚠️ ${i+1}/30] Direct Facebook failed: ${fbErr.message} — trying Zapier...`);
        }
      }

      // ── Method 2: Zapier relay (fallback) ────────────────────────────────
      if (!success && zapierUrl) {
        try {
          const zapRes = await fetch(zapierUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'facebook_post',
              platform: 'facebook',
              message: post.message,
              image_url: post.image_url,
              link: 'https://medrevolve.com',
              phone: '240-387-5224',
              content_type: post.type,
              post_number: i + 1,
              source: 'godModeFacebookBlast'
            })
          });
          if (zapRes.ok) {
            zapierCount++;
            success = true;
            method = 'zapier_relay';
            console.log(`[✅ ${i+1}/30] Zapier relay OK`);
          } else {
            console.error(`[❌ ${i+1}/30] Zapier failed: ${zapRes.status}`);
          }
        } catch (zapErr) {
          console.error(`[❌ ${i+1}/30] Zapier error: ${zapErr.message}`);
        }
      }

      if (!success) failCount++;

      // Save to DB
      await base44.asServiceRole.entities.SocialPost.create({
        platform: 'facebook',
        caption: post.message,
        image_url: post.image_url,
        post_id: fbPostId,
        status: success ? 'published' : 'failed',
        published_at: success ? new Date().toISOString() : null,
        notes: success
          ? `God Mode Blast #${i+1}/30 | type:${post.type} | method:${method}`
          : `God Mode Blast #${i+1}/30 | All methods failed`
      });

      results.push({ post: i + 1, type: post.type, success, method, fbPostId });

      // Small delay
      if (i < BLAST_CONTENT.length - 1) {
        await new Promise(r => setTimeout(r, 600));
      }
    }

    console.log(`[DONE] Direct: ${directCount} | Zapier: ${zapierCount} | Failed: ${failCount}`);

    return Response.json({
      success: true,
      total: BLAST_CONTENT.length,
      direct_facebook_posts: directCount,
      zapier_relayed: zapierCount,
      failed: failCount,
      facebook_token_available: !!fbToken,
      results
    });

  } catch (error) {
    console.error('[ERROR] godModeFacebookBlast:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});