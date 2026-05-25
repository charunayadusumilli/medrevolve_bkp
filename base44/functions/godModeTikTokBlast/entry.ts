import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// 30 TikTok-optimized posts (shorter, punchier for the algorithm)
const TIKTOK_BLAST = [
  // B2B MERCHANT (8)
  { caption: "Med Spa Owner? You could be making $30K/month with MedRevolve telehealth. 30-day setup. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576087192825-e56de36c8dec?w=540&h=960&fit=crop" },
  { caption: "Gym owner here. Added GLP-1 revenue stream with MedRevolve. Already clearing $10K/month. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1535214304b9-ceb984400910?w=540&h=960&fit=crop" },
  { caption: "Building a telehealth business solo = $90K in legal fees. MedRevolve = $2,999/mo. Everything included. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=540&h=960&fit=crop" },
  { caption: "HIPAA-compliant telehealth platform built in 30 days? That's the MedRevolve promise. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=540&h=960&fit=crop" },
  { caption: "Refer someone to MedRevolve = $500 commission. No cap. We've paid $75K to partners this month. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=540&h=960&fit=crop" },
  { caption: "Nurse practitioner? Chiropractor? Coach? Add telehealth revenue. MedRevolve handles everything. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=540&h=960&fit=crop" },
  { caption: "Licensed providers. White-label platform. Billing automation. Rx fulfillment. All $2,999/mo. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=540&h=960&fit=crop" },
  { caption: "Your brand. Your platform. Your revenue. MedRevolve does the heavy lifting. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1554224311-beee415c15eb?w=540&h=960&fit=crop" },

  // COMPLIANCE (6)
  { caption: "Running telehealth without HIPAA compliance = federal crime waiting to happen. MedRevolve covers everything. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=540&h=960&fit=crop" },
  { caption: "DEA audit almost shut down my telehealth biz. MedRevolve walked me through everything. Zero violations. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160397-112ba8d25d1d?w=540&h=960&fit=crop" },
  { caption: "State-by-state prescribing laws? 503A/503B compliance? Patient consent docs? MedRevolve has it all. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1579154204601-01d6cc01ae48?w=540&h=960&fit=crop" },
  { caption: "GLP-1 regulations changed 14x this year. We're tracking all of them. You're covered. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1583291165004-7d9d4a9955f6?w=540&h=960&fit=crop" },
  { caption: "$50K in legal work? Free with MedRevolve. HIPAA. BAA. Consent forms. Audit playbooks. Everything. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160575-2173dba999ef?w=540&h=960&fit=crop" },
  { caption: "Is your GLP-1 business compliant? Most aren't. That's why most fail. MedRevolve = zero violations. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=540&h=960&fit=crop" },

  // UGC PATIENT (8)
  { caption: "I texted 240-387-5224 on a Tuesday. Had my GLP-1 by Thursday. No doctor's office. No waitlist. That's telehealth.", image_url: "https://images.unsplash.com/photo-1581578731548-c64695c952952?w=540&h=960&fit=crop" },
  { caption: "67 days. 22 pounds. One phone call to MedRevolve. Changed everything for me. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1591026373366-2f70d78cc5f6?w=540&h=960&fit=crop" },
  { caption: "Men's energy back? TRT through MedRevolve. Video call + bloodwork online + testosterone shipped. Simple. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1552993881-a2e5c8ea79a8?w=540&h=960&fit=crop" },
  { caption: "Finally a platform that LISTENS to women. BHRT. Hormones. Menopause. Licensed female providers. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1551217145-2022a4d8d0f2?w=540&h=960&fit=crop" },
  { caption: "3 months with MedRevolve: prescription in 48hrs, real provider responses, discreet packaging, 10/10 recommend. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1591026373366-2f70d78cc5f6?w=540&h=960&fit=crop" },
  { caption: "Peptides. GLP-1. TRT. HGH. Online. Licensed providers who actually understand optimization. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160575-2173dba999ef?w=540&h=960&fit=crop" },
  { caption: "GLP-1 kit arrived in 3 days. Everything labeled. Provider already scheduled follow-up. This is healthcare done right. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=540&h=960&fit=crop" },
  { caption: "Tired of being ignored by your doctor? MedRevolve providers listen. Same-day consultations. Real results. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1585864299869-592a1cec1dfa?w=540&h=960&fit=crop" },

  // PROMOS (8)
  { caption: "FREE 60-min merchant strategy session ($500 value). Platform demo + revenue projections. Book now. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=540&h=960&fit=crop" },
  { caption: "$199 GLP-1 Consultation. Licensed MD. Video call. Script delivered. Same-day. No insurance needed. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=540&h=960&fit=crop" },
  { caption: "FLASH: GLP-1 Starter Pack $299. Consult + 30-day supply + training + 2 check-ins. Only 50 spots. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576091160575-2173dba999ef?w=540&h=960&fit=crop" },
  { caption: "Merchant ROI breakdown: Month 1 avg = $12K. Month 6 avg = $45K+. Platform cost = $2,999. Do the math. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=540&h=960&fit=crop" },
  { caption: "ONLY 10 merchant spots this month. $2,999/mo includes platform + providers + compliance + marketing. Reserve now. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=540&h=960&fit=crop" },
  { caption: "Q2 BUNDLE: Platform + Compliance + Marketing = $2,999/mo (normally $3,499). Lock in pricing now. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=540&h=960&fit=crop" },
  { caption: "First month FREE if you get 10+ patients in 30 days. Most merchants hit 10 in week 1. 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=540&h=960&fit=crop" },
  { caption: "$500B telehealth market by 2030. $100B GLP-1 industry. Question: are you in or out? 📞 240-387-5224", image_url: "https://images.unsplash.com/photo-1576087192825-e56de36c8dec?w=540&h=960&fit=crop" }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    if (!zapierUrl) {
      return Response.json({ error: 'ZAPIER_WEBHOOK_URL not set' }, { status: 500 });
    }

    console.log(`[START] TikTok Blast — sending ${TIKTOK_BLAST.length} posts to Zapier`);

    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (let i = 0; i < TIKTOK_BLAST.length; i++) {
      const post = TIKTOK_BLAST[i];
      
      try {
        const zapRes = await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'tiktok_post',
            platform: 'tiktok',
            caption: post.caption,
            image_url: post.image_url,
            post_number: i + 1,
            total_posts: TIKTOK_BLAST.length,
            source: 'godModeTikTokBlast'
          })
        });

        const ok = zapRes.ok;
        
        // Save record to DB
        await base44.asServiceRole.entities.SocialPost.create({
          platform: 'tiktok',
          caption: post.caption,
          image_url: post.image_url,
          status: ok ? 'published' : 'failed',
          published_at: ok ? new Date().toISOString() : null,
          notes: ok
            ? `TikTok Blast #${i + 1}/30 | Relayed via Zapier`
            : `TikTok Blast #${i + 1}/30 | Zapier relay failed (${zapRes.status})`
        });

        if (ok) {
          successCount++;
          console.log(`[✅ ${i+1}/30] TikTok post relayed | Status: ${zapRes.status}`);
        } else {
          failCount++;
          console.error(`[❌ ${i+1}/30] Failed | Status: ${zapRes.status}`);
        }

        results.push({ post: i + 1, success: ok, status: zapRes.status });

        if (i < TIKTOK_BLAST.length - 1) {
          await new Promise(r => setTimeout(r, 500));
        }

      } catch (err) {
        failCount++;
        console.error(`[❌ ${i+1}/30] Error: ${err.message}`);
        results.push({ post: i + 1, success: false, error: err.message });
      }
    }

    console.log(`[DONE] TikTok Blast complete — ✅ ${successCount} sent, ❌ ${failCount} failed`);

    return Response.json({
      success: true,
      total: TIKTOK_BLAST.length,
      sent_to_zapier: successCount,
      failed: failCount,
      important_note: failCount > 0
        ? '⚠️ Some posts failed. Verify your Zapier Zap for TikTok is PUBLISHED.'
        : '✅ All 30 TikTok posts relayed to Zapier! They will post via your Zapier automation.',
      results
    });

  } catch (error) {
    console.error('[ERROR] godModeTikTokBlast:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});