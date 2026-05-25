import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// 30 posts across all content types — fires ALL to Facebook via Zapier in one call
const BLAST_CONTENT = [
  // ── B2B MERCHANT (8 posts) ──────────────────────────────────────────────
  {
    message: `🏥 ATTENTION: Med Spa & Clinic Owners

Are you STILL building your telehealth business from scratch?

MedRevolve gives you a TURNKEY merchant platform:
✅ White-label telehealth website (YOUR brand)
✅ GLP-1 & compound Rx fulfillment
✅ Built-in billing + payment processing
✅ Licensed provider network (50+ MDs)
✅ HIPAA-compliant infrastructure

Launch in 30 days or less.

📞 CALL NOW: 240-387-5224
🌐 medrevolve.com/for-business`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  {
    message: `💼 I make $30K/month with my MedRevolve white-label store.

I resell GLP-1, RUO compounds, and supplements under MY brand.
MedRevolve handles compliance, providers, and fulfillment.

Ready to start your business?

📞 Call: 240-387-5224
🌐 medrevolve.com/for-business`,
    image_url: "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1080&h=1080&fit=crop",
    type: "b2b_ugc"
  },
  {
    message: `🚀 FROM ZERO TO REVENUE IN 30 DAYS

Day 1: Sign merchant agreement
Day 3: Branded platform goes live
Day 7: Marketing assets delivered
Day 14: First patients booking
Day 30: First revenue check

This is the MedRevolve merchant timeline.

📞 Start the clock: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    type: "b2b_promo"
  },
  {
    message: `💰 $2,999/mo vs. $90,000+ building it yourself.

Building a telehealth platform alone:
❌ Attorney: $15,000
❌ Dev team: $50,000+
❌ Provider credentialing: 6 months
❌ Compliance setup: $25,000

MedRevolve merchant account:
✅ $2,999/mo. Everything included. Live in 30 days.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  {
    message: `🔑 3 MYTHS stopping you from owning a telehealth business:

❌ "I need a medical license" — FALSE. MedRevolve provides licensed providers.
❌ "HIPAA is too complex" — FALSE. It's built in.
❌ "I can't afford startup costs" — FALSE. $2,999/mo, zero build costs.

The only thing stopping you is this post.

📞 240-387-5224
🌐 medrevolve.com/for-business`,
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },
  {
    message: `🤝 PARTNER PROGRAM: Earn $500 per merchant you refer

Know someone who should own a MedRevolve telehealth business?

Refer them → they sign → you earn $500.
No cap. Top partners earn $5,000–$10,000/month.

📞 Get your referral code: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
    type: "b2b_promo"
  },
  {
    message: `⚡ LIVE DEMO: See a MedRevolve merchant platform in action

What's included:
→ Custom-branded telehealth website
→ Automated GLP-1 consultation booking
→ Built-in e-commerce (supplements + Rx)
→ Provider dashboard + SOAP notes
→ Automated billing & compliance

📞 Book your demo: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
    type: "b2b_promo"
  },
  {
    message: `🏆 If you're a gym owner, chiropractor, nurse practitioner, med spa owner, or health coach —

You can ADD telehealth GLP-1 revenue to your existing business with MedRevolve.

No new licenses. No overhead. New revenue stream.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
    type: "b2b_static_ad"
  },

  // ── COMPLIANCE (6 posts) ────────────────────────────────────────────────
  {
    message: `⚠️ Is your telehealth business HIPAA compliant?

Most new telehealth businesses fail their first audit.

Common violations:
❌ No BAA with vendors
❌ Unencrypted patient data
❌ Missing consent forms
❌ No breach policy

MedRevolve merchants are FULLY covered — compliance built in.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `🔒 I almost lost my telehealth business to a DEA audit.

No compliance framework. Just hope.

Then MedRevolve walked me through everything:
✅ State-by-state prescribing laws
✅ Compound pharmacy documentation
✅ Provider credentialing
✅ Patient record encryption

One year later. Zero violations. $40K/month.

📞 Don't learn the hard way: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
    type: "compliance_ugc"
  },
  {
    message: `📋 COMPLIANCE CHECKLIST for GLP-1 Businesses

Before you sell ONE prescription:
☐ Licensed prescribers in every state
☐ 503A/503B compliant pharmacy
☐ Patient consent documentation
☐ HIPAA tech stack
☐ DEA protocols
☐ FTC advertising compliance

This takes months to build alone. MedRevolve has it ALL pre-built.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `🏛️ GLP-1 regulations shifted in 14 states this year alone.

Are you keeping up?

MedRevolve monitors:
→ State telehealth prescribing laws
→ FDA compound pharmacy guidance
→ DEA controlled substance rules
→ HIPAA updates

So you don't have to. Focus on patients.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `✅ Your compliance package includes:

📁 Patient intake forms (state-specific)
📁 Informed consent templates
📁 HIPAA privacy notices
📁 BAA templates for all vendors
📁 Prescription tracking logs
📁 Audit response playbooks

$50,000+ in legal work — included in your MedRevolve platform.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    type: "compliance_ad"
  },
  {
    message: `🚨 Selling compounded medications without proper oversight = federal crime.

The FDA, DEA, and your state medical board are watching.

MedRevolve keeps you protected:
✅ 503A/503B compliant pharmacy network
✅ Provider-supervised prescribing only
✅ All orders medically supervised

Run a real business. Stay protected.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
    type: "compliance_warning"
  },

  // ── UGC PATIENT (8 posts) ───────────────────────────────────────────────
  {
    message: `📞 I texted 240-387-5224 on a Tuesday.

By Thursday I had my GLP-1 prescription.

No doctor's office. No 6-week waitlist. No insurance battle.

Just a 15-minute video call and done.

📞 Text or call: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  {
    message: `💉 67 days. 22 pounds. One phone call.

I called MedRevolve after seeing them on social media.

Week 2: Semaglutide arrived at my door
Week 8: Down 22 lbs, energy through the roof

GLP-1 changed the equation completely.

📞 Your consult is FREE: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  {
    message: `⚡ Men — your energy CAN come back.

TRT through MedRevolve:
→ Bloodwork ordered online
→ Men's health specialist consult
→ Testosterone shipped to your door
→ Ongoing monitoring

I wish I called sooner.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
    type: "ugc_mens_health"
  },
  {
    message: `🌸 Finally — a platform that takes women's health seriously.

BHRT, hormone balance, menopause support. Licensed female providers. Actual answers.

No "just take birth control" dismissal.

Book today:
📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
    type: "ugc_womens_health"
  },
  {
    message: `🙋 Honest review after 3 months with MedRevolve:

✅ Prescription in 48 hours
✅ Provider actually answers messages
✅ Discreet packaging
✅ Monthly follow-ups included
✅ WAY cheaper than my old clinic

10/10. Recommend to everyone.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
    type: "ugc_review"
  },
  {
    message: `🔬 Peptides. GLP-1. TRT. HGH. All online.

MedRevolve connects you to licensed providers who understand optimization — not just symptom management.

Ready to perform at 100%?

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1080&fit=crop",
    type: "ugc_biohacking"
  },
  {
    message: `📦 My GLP-1 kit arrived in 3 days.

Discreet packaging. Everything labeled. Provider already scheduled my follow-up.

This is what healthcare SHOULD look like.

📞 Start today: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },
  {
    message: `🚨 TIRED OF BEING IGNORED BY YOUR DOCTOR?

MedRevolve providers actually listen. Same-day telehealth consults for GLP-1, TRT, hormones, peptides.

No insurance drama. No gatekeeping. Real results.

📞 Call NOW: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
    type: "ugc_patient"
  },

  // ── PROMOS & OFFERS (8 posts) ────────────────────────────────────────────
  {
    message: `🎁 FREE: 60-Min Merchant Strategy Session ($500 value)

This week only — book a FREE session with our merchant success team:
→ Full platform demo
→ Custom revenue projections
→ No pressure, no obligation

Only 5 spots per week.

📞 Book yours NOW: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
    type: "promo_free_offer"
  },
  {
    message: `💊 GLP-1 Consultation — $199

No insurance needed.
No referral needed.
No waiting room.

What you get:
→ 1-on-1 video consult with licensed MD
→ Full health assessment
→ GLP-1 prescription if appropriate
→ 30-day supply shipped to your door

📞 Book: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
    type: "promo_patient_offer"
  },
  {
    message: `⚡ FLASH DEAL: GLP-1 Starter Pack — $299

✅ Initial telehealth consultation
✅ 30-day semaglutide supply
✅ Injection training guide
✅ 2 follow-up check-ins
✅ Nutrition protocol

Limited to 50 patients.

📞 240-387-5224 — call NOW
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
    type: "promo_flash"
  },
  {
    message: `📊 MedRevolve Merchant ROI — Real Numbers

Average merchant month 1: $12,000
Average merchant month 6: $45,000+
Platform cost: $2,999/mo

That's a 15x return on investment.

📞 Run the numbers with us: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
    type: "promo_roi"
  },
  {
    message: `🎯 LIMITED SPOTS: MedRevolve Merchant Onboarding

We only accept 10 new merchants per month.

$2,999/mo includes:
✅ Telehealth platform
✅ GLP-1 + Rx access
✅ Full compliance
✅ Provider network
✅ Marketing assets
✅ Dedicated account manager

📞 RESERVE YOUR SPOT: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
    type: "promo_limited"
  },
  {
    message: `🌐 Q2 BUNDLE — Save $500/mo

Telehealth Platform + Compliance + Marketing Kit

Normal: $3,499/mo
Q2 price: $2,999/mo

Includes:
→ White-label telehealth platform
→ Full compliance framework
→ 100 done-for-you social posts/month
→ Google Ads setup
→ Patient acquisition funnel

📞 Lock in Q2 pricing: 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1553877615-30c73e63cf53?w=1080&h=1080&fit=crop",
    type: "promo_bundle"
  },
  {
    message: `💸 FIRST MONTH FREE — For Qualifying Merchants

Open 10+ patient accounts in your first 30 days → we credit your first month back.

$2,999 back in your pocket.

Most merchants hit 10 patients in week 1.

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
    type: "promo_first_month"
  },
  {
    message: `🩺 TELEHEALTH IS THE FUTURE.

$500 billion market by 2030.
GLP-1 alone is a $100 billion industry.

The question isn't IF you should be in this space.

The question is: Are you going to build it alone or launch in 30 days with MedRevolve?

📞 240-387-5224
🌐 medrevolve.com`,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
    type: "promo_vision"
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    if (!zapierUrl) {
      return Response.json({ error: 'ZAPIER_WEBHOOK_URL not set' }, { status: 500 });
    }

    console.log(`[START] God Mode Facebook Blast — sending ${BLAST_CONTENT.length} posts to Zapier`);

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < BLAST_CONTENT.length; i++) {
      const post = BLAST_CONTENT[i];
      
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
            total_posts: BLAST_CONTENT.length,
            source: 'godModeFacebookBlast'
          })
        });

        const ok = zapRes.ok;
        
        // Save record to DB
        await base44.asServiceRole.entities.SocialPost.create({
          platform: 'facebook',
          caption: post.message,
          image_url: post.image_url,
          status: ok ? 'published' : 'failed',
          published_at: ok ? new Date().toISOString() : null,
          notes: ok
            ? `God Mode Blast #${i + 1}/30 | type:${post.type} | Relayed via Zapier`
            : `God Mode Blast #${i + 1}/30 | Zapier relay failed (${zapRes.status})`
        });

        if (ok) {
          successCount++;
          console.log(`[✅ ${i+1}/30] Sent: ${post.type} | Status: ${zapRes.status}`);
        } else {
          failCount++;
          console.error(`[❌ ${i+1}/30] Failed: ${post.type} | Status: ${zapRes.status}`);
        }

        results.push({ post: i + 1, type: post.type, success: ok, status: zapRes.status });

        // Small delay between posts to avoid rate limiting
        if (i < BLAST_CONTENT.length - 1) {
          await new Promise(r => setTimeout(r, 500));
        }

      } catch (err) {
        failCount++;
        console.error(`[❌ ${i+1}/30] Error: ${err.message}`);
        results.push({ post: i + 1, type: post.type, success: false, error: err.message });
      }
    }

    console.log(`[DONE] Blast complete — ✅ ${successCount} sent, ❌ ${failCount} failed`);

    return Response.json({
      success: true,
      total: BLAST_CONTENT.length,
      sent_to_zapier: successCount,
      failed: failCount,
      important_note: failCount > 0
        ? '⚠️ Some posts failed. Make sure your Zapier Zap is PUBLISHED (not Draft) and the Facebook Pages action is configured.'
        : '✅ All posts relayed to Zapier successfully! Check your Facebook Page in 1-2 minutes.',
      results
    });

  } catch (error) {
    console.error('[ERROR] godModeFacebookBlast:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});