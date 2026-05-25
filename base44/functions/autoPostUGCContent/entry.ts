import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ════════════════════════════════════════════════════════════════════════════
// MEDREVOLVE — GOD MODE CONTENT LIBRARY
// 5 Content Categories × 6 Posts Each = 30 Total
// EVERY post has: phone 240-387-5224 + medrevolve.com + hard CTA
// Lead capture on every interaction via phone/link
// ════════════════════════════════════════════════════════════════════════════

const CONTENT_LIBRARY = {

  // ── CATEGORY 1: B2B MERCHANT ACCOUNT ─────────────────────────────────────
  b2b_merchant: [
    {
      caption: `🏥 ATTENTION: Med Spa & Clinic Owners

Are you STILL building from scratch?

MedRevolve gives you a TURNKEY merchant platform:
✅ White-label telehealth website (YOUR brand)
✅ GLP-1 & compound Rx fulfillment
✅ Built-in billing + payment processing
✅ Licensed provider network
✅ HIPAA-compliant infrastructure

Launch in 30 days or less.

📞 CALL NOW: 240-387-5224
🌐 medrevolve.com/for-business

#MedSpa #TelehealthBusiness #MerchantAccount #GLP1Business #MedRevolve #HealthcareBusiness #WhiteLabel`,
      image_prompt: "Modern professional medical spa interior, clean white and gold design, business owner at desk with laptop showing dashboard, aspirational and premium",
      content_type: "static_ad",
      audience: "b2b_merchant"
    },
    {
      caption: `💼 Want to make $20K–$80K/month selling GLP-1?

Here's exactly how MedRevolve merchants do it:

1️⃣ Get your white-label merchant account ($2,999/mo)
2️⃣ We build your branded telehealth platform
3️⃣ Patients book → licensed providers prescribe → pharmacy ships
4️⃣ You collect 100% of patient revenue

No medical license needed. No compliance headaches. No overhead.

📞 Call or text: 240-387-5224
🌐 medrevolve.com

DM us "MERCHANT" to get started 👇

#GLP1Business #TelehealthEntrepreneur #PassiveIncome #MedRevolve #WhiteLabelTelehealth #MedSpaOwner`,
      image_prompt: "Entrepreneur celebrating business success, laptop open showing revenue analytics, clean modern home office, authentic UGC style excited expression",
      content_type: "ugc",
      audience: "b2b_merchant"
    },
    {
      caption: `🚀 The $2,999/mo decision that changed my business forever.

I was running a gym. I added MedRevolve's white-label GLP-1 platform.

Month 1: $8,400 in patient revenue
Month 3: $31,000
Month 6: $67,000

Same overhead. Same staff. Completely different income.

Want the details?

📞 240-387-5224 — call NOW
🌐 medrevolve.com/for-business

#GymOwner #MedSpaRevenue #GLP1 #MedRevolve #BusinessGrowth #TelehealthBusiness #WellnessRevenue`,
      image_prompt: "Gym or wellness studio owner holding phone showing revenue numbers, confident smile, professional yet authentic, before and after business growth story",
      content_type: "ugc",
      audience: "b2b_merchant"
    },
    {
      caption: `⚡ LIVE DEMO: See a MedRevolve merchant platform in action

What you get with your merchant account:
→ Custom-branded website & patient portal
→ Automated GLP-1 consultation booking
→ Real-time prescription tracking
→ Built-in e-commerce for supplements
→ Provider dashboard + SOAP notes
→ Automated billing & insurance workflows

This is NOT a side hustle. This is a BUSINESS.

📞 Book your demo: 240-387-5224
🌐 medrevolve.com

#TelehealthPlatform #MerchantAccount #MedRevolve #GLP1 #HealthcareBusiness #MedicalEntrepreneur`,
      image_prompt: "Split screen showing branded telehealth website on laptop and mobile, professional dashboard view, business showcase style flat lay",
      content_type: "promo",
      audience: "b2b_merchant"
    },
    {
      caption: `🔑 3 things stopping you from opening your own telehealth practice:

❌ "I need a medical license" — FALSE. MedRevolve provides licensed providers.
❌ "HIPAA compliance is too complex" — FALSE. It's built in.
❌ "I can't afford the startup cost" — FALSE. $2,999/mo, no upfront build costs.

The only thing stopping you… is this post.

📞 240-387-5224
🌐 medrevolve.com/for-business

Reply "INFO" or call us NOW 👇

#TelehealthStartup #GLP1Business #MedRevolve #BusinessMyths #HealthcareEntrepreneur #WhiteLabel`,
      image_prompt: "Confident business professional breaking through barriers, split screen myth vs reality concept, modern clean design, empowering business energy",
      content_type: "static_ad",
      audience: "b2b_merchant"
    },
    {
      caption: `📊 MedRevolve Merchant ROI — Real Numbers

Average merchant month 1: $12,000 patient revenue
Average merchant month 6: $45,000+
Platform cost: $2,999/mo

That's a 15x return on investment.

What's included:
✅ Telehealth platform
✅ GLP-1 & Rx access
✅ Compliance framework
✅ Marketing assets
✅ Provider network
✅ 24/7 tech support

📞 Run the numbers with us: 240-387-5224
🌐 medrevolve.com

#ROI #TelehealthROI #GLP1Business #MedRevolve #BusinessInvestment #MedSpaProfit`,
      image_prompt: "ROI growth chart on laptop screen, business analytics dashboard, professional merchant reviewing numbers, clean corporate aesthetic with green growth arrows",
      content_type: "static_ad",
      audience: "b2b_merchant"
    }
  ],

  // ── CATEGORY 2: COMPLIANCE ────────────────────────────────────────────────
  compliance: [
    {
      caption: `⚠️ WARNING: Is your telehealth business HIPAA compliant?

Most new telehealth businesses fail their first audit.

Common violations:
❌ No BAA with technology vendors
❌ Unencrypted patient communications
❌ Missing patient consent forms
❌ Improper PHI storage
❌ No breach notification policy

MedRevolve merchants are FULLY covered:
✅ HIPAA-compliant infrastructure (built in)
✅ All BAAs pre-executed
✅ Patient consent automation
✅ Encrypted data handling
✅ Audit-ready documentation

Sleep better. Run your business.

📞 240-387-5224
🌐 medrevolve.com

#HIPAA #HIPAACompliance #TelehealthCompliance #MedRevolve #HealthcareCompliance #PHI`,
      image_prompt: "Professional reviewing compliance documents on tablet, HIPAA shield symbol overlay, clean medical office setting, serious compliance-focused imagery",
      content_type: "static_ad",
      audience: "compliance"
    },
    {
      caption: `🔒 I almost lost my telehealth business to a DEA audit.

I had a GLP-1 practice. No compliance framework. Just vibes and hope.

Then MedRevolve's compliance team walked me through exactly what I needed.

Every state we operate in → covered.
Every compound we sell → documented.
Every provider → credentialed and verified.
Every patient record → encrypted and protected.

One year later. Zero violations. $40K/month.

📞 Don't learn the hard way: 240-387-5224
🌐 medrevolve.com

#ComplianceStory #TelehealthCompliance #HIPAA #MedRevolve #GLP1Compliance #MedicalBusiness`,
      image_prompt: "Business owner relieved and confident, compliance certificate or legal document visible, authentic UGC selfie style, relieved expression telling a real story",
      content_type: "ugc",
      audience: "compliance"
    },
    {
      caption: `📋 COMPLIANCE CHECKLIST for GLP-1 & Telehealth Businesses

Before you sell ONE prescription, you need:

☐ Licensed prescribers in every state you operate
☐ Pharmacy partnerships with compound compliance
☐ Patient intake & consent documentation
☐ HIPAA-compliant tech stack
☐ State-specific telehealth regulations
☐ DEA controlled substance protocols
☐ Billing compliance (if insurance)
☐ FTC advertising compliance for health claims

This takes months to build alone.

MedRevolve has it ALL pre-built.

📞 Skip the build: 240-387-5224
🌐 medrevolve.com

#GLP1Compliance #ComplianceChecklist #Telehealth #MedRevolve #HealthcareCompliance`,
      image_prompt: "Checklist on clipboard, professional hands checking items, clean clinical setting, green checkmarks, compliance and organization theme",
      content_type: "promo",
      audience: "compliance"
    },
    {
      caption: `🏛️ STATE LAWS ARE CHANGING FAST.

GLP-1 telehealth regulations shifted in 14 states this year alone.

Are you keeping up?

MedRevolve's compliance team monitors:
→ State telehealth prescribing laws
→ FDA compound pharmacy guidance
→ DEA controlled substance rules
→ FTC advertising standards
→ HIPAA updates

So you don't have to.

Focus on patients. We'll handle the law.

📞 240-387-5224
🌐 medrevolve.com

#TelehealthLaw #GLP1Regulations #HealthcareCompliance #MedRevolve #StateLaw #CompoundPharmacy`,
      image_prompt: "Legal compliance concept, scales of justice with medical cross, professional legal review setting, authoritative and trustworthy imagery",
      content_type: "static_ad",
      audience: "compliance"
    },
    {
      caption: `✅ Your compliance is only as good as your documentation.

MedRevolve merchants get:

📁 Patient intake forms (state-specific)
📁 Informed consent templates
📁 Provider employment/contractor agreements  
📁 HIPAA privacy notices
📁 BAA templates for all vendors
📁 Prescription tracking logs
📁 Audit response playbooks

All pre-drafted. All legally reviewed.

This is $50,000+ in legal work — included in your platform.

📞 240-387-5224
🌐 medrevolve.com

#LegalDocs #HIPAADocumentation #TelehealthLegal #MedRevolve #ComplianceDocs #HealthcareLaw`,
      image_prompt: "Organized professional documentation folder system, laptop showing document management platform, clean medical practice management aesthetic",
      content_type: "static_ad",
      audience: "compliance"
    },
    {
      caption: `🚨 REMINDER: Selling compounded medications without proper oversight = federal crime.

We're not saying this to scare you.

We're saying it because we've seen businesses shut down overnight.

The FDA, DEA, and your state medical board are watching.

MedRevolve keeps you protected:
✅ 503A/503B compliant pharmacy network
✅ Provider-supervised prescribing only
✅ No direct-to-consumer compound sales
✅ All orders medically supervised

Run a real business. Stay protected.

📞 240-387-5224
🌐 medrevolve.com

#CompoundCompliance #FDACompliance #MedRevolve #TelehealthCompliance #GLP1Legal #503B`,
      image_prompt: "Warning/compliance concept, business owner protected under shield, federal building or regulatory imagery in background, serious protective tone",
      content_type: "promo",
      audience: "compliance"
    }
  ],

  // ── CATEGORY 3: UGC PATIENT (B2C lead capture) ───────────────────────────
  ugc_patient: [
    {
      caption: `📞 I texted 240-387-5224 on a Tuesday.

By Thursday I had my GLP-1 prescription.

No doctor's office. No 6-week waitlist. No insurance battle.

Just a 15-minute video call, a few health questions, and done.

If you've been putting off your weight loss journey because it's "too complicated" — it's not anymore.

📞 Text or call: 240-387-5224
🌐 medrevolve.com

#GLP1Journey #Semaglutide #WeightLossJourney #Telehealth #MedRevolve #GLP1WeightLoss #OnlineDoctorVisit`,
      image_prompt: "Person smiling at phone, excited text conversation visible, home setting, authentic relatable moment of receiving good news about prescription",
      content_type: "ugc",
      audience: "b2c_patient"
    },
    {
      caption: `💉 67 days. 22 pounds. One phone call.

I called MedRevolve (240-387-5224) after seeing them on social media.

Week 1: Consultation done in 20 min
Week 2: Semaglutide arrived at my door
Week 8: Down 22 lbs, energy through the roof

I've tried EVERYTHING. Keto. Intermittent fasting. The gym. Nothing stuck.

GLP-1 changed the equation completely.

📞 Your call is FREE: 240-387-5224
🌐 medrevolve.com

#WeightLossResults #Semaglutide #GLP1Results #MedRevolve #Telehealth #WeightLossWin`,
      image_prompt: "Person in athletic wear showing transformation, confident body language, before/after moment captured authentically, genuine wellness transformation photo",
      content_type: "ugc",
      audience: "b2c_patient"
    },
    {
      caption: `🙋 Honest review of MedRevolve after 3 months:

PROS:
✅ Prescription in 48 hours
✅ Provider actually answers messages
✅ Discreet packaging (nobody knows your business)
✅ Monthly follow-ups included
✅ WAY cheaper than my old clinic

CONS:
❌ I can't unlearn how easy this is
❌ My old doctor is irrelevant now
❌ My family keeps asking what I'm doing

10/10. Recommend to everyone.

📞 240-387-5224
🌐 medrevolve.com

#HonestReview #MedRevolveReview #GLP1 #TelehealthReview #Semaglutide #WeightLoss`,
      image_prompt: "Person giving two thumbs up to camera, bright home background, genuine authentic review style UGC, cheerful and relatable expression",
      content_type: "ugc",
      audience: "b2c_patient"
    },
    {
      caption: `👨 Men — this is for you.

Low energy. Brain fog. Can't lose the gut. Low drive. Sound familiar?

That's not "just aging."

That's low testosterone. And it's fixable.

MedRevolve TRT program:
→ Bloodwork ordered online
→ Telehealth consult with men's health specialist
→ Testosterone cypionate or cream shipped to your door
→ Ongoing monitoring and dose adjustments

Real men. Real results. Real doctors.

📞 240-387-5224
🌐 medrevolve.com

#TRT #Testosterone #MensHealth #LowT #TestosteroneTherapy #MedRevolve #MensWellness #HormoneTherapy`,
      image_prompt: "Fit confident man 35-55, athletic and healthy energy, gym or outdoor morning setting, men's health transformation authentic lifestyle photo",
      content_type: "ugc",
      audience: "b2c_patient"
    },
    {
      caption: `🌸 Ladies — perimenopause is REAL and you deserve REAL treatment.

Hot flashes. Weight gain. Brain fog. Mood swings. Low libido.

This isn't in your head. It's your hormones.

MedRevolve BHRT program:
✅ Comprehensive hormone panel
✅ Female telehealth specialist
✅ Bio-identical hormones (cream, pellet, or injection)
✅ Ongoing monitoring
✅ No "just take birth control" dismissal

You deserve a provider who listens.

📞 240-387-5224
🌐 medrevolve.com

#BHRT #Perimenopause #HormoneBalance #WomensHealth #MenopauseSupport #MedRevolve #WomensWellness`,
      image_prompt: "Radiant confident woman 40-55, glowing health, natural outdoor or home setting, authentic womens health lifestyle photography",
      content_type: "ugc",
      audience: "b2c_patient"
    },
    {
      caption: `🔬 Peptides are the next frontier of healthcare.

BPC-157 for injury healing.
CJC-1295 for growth hormone optimization.
Sermorelin for anti-aging.
TB-500 for recovery.

Most doctors won't prescribe these because they don't know them.

MedRevolve providers DO.

Get a peptide consultation today:
📞 240-387-5224
🌐 medrevolve.com

#Peptides #BPC157 #Sermorelin #Biohacking #HealthOptimization #MedRevolve #Longevity #PeptideTherapy`,
      image_prompt: "Health optimization biohacker lifestyle, peptide vials arranged professionally, athletic person in peak condition, science meets wellness aesthetic",
      content_type: "promo",
      audience: "b2c_patient"
    }
  ],

  // ── CATEGORY 4: STATIC ADS (High-contrast promos) ────────────────────────
  static_ads: [
    {
      caption: `🎯 LIMITED SPOTS: MedRevolve Merchant Onboarding

We only accept 10 new merchant accounts per month.

Why? Because we actually support our partners.

What's included:
✅ Done-for-you branded telehealth platform
✅ GLP-1 + compound Rx access
✅ HIPAA compliance (full coverage)
✅ Provider network (50+ licensed MDs)
✅ Marketing assets & social content
✅ Dedicated account manager

$2,999/mo. Cancel anytime.

📞 RESERVE YOUR SPOT: 240-387-5224
🌐 medrevolve.com/for-business

Spots fill by the 15th every month. Don't wait.

#MerchantAccount #TelehealthPlatform #GLP1Business #MedRevolve #LimitedSpots #HealthcareBusiness`,
      image_prompt: "Exclusive limited offer concept, premium platform screenshot on MacBook, scarcity and exclusivity energy, professional business launch aesthetic",
      content_type: "static_ad",
      audience: "b2b_merchant"
    },
    {
      caption: `💊 GLP-1 Consultation — $199

No insurance needed.
No referral needed.
No waiting room.

What you get:
→ 1-on-1 video consult with licensed MD
→ Full health assessment
→ GLP-1 prescription (if appropriate)
→ 30-day supply shipped to your door
→ Ongoing provider access via secure messaging

Start your weight loss journey TODAY.

📞 Book now: 240-387-5224
🌐 medrevolve.com

#GLP1 #GLP1WeightLoss #Semaglutide #Telehealth #MedRevolve #WeightLossProgram #OnlineDoctorVisit`,
      image_prompt: "Clean product showcase, GLP-1 medication vials on white surface with stethoscope, medical professional aesthetic, premium healthcare product photography",
      content_type: "static_ad",
      audience: "b2c_patient"
    },
    {
      caption: `🏆 #1 Telehealth Platform for Independent Health Entrepreneurs

If you're a:
• Gym owner
• Chiropractor
• Nutritionist
• Esthetician
• Med spa owner
• Health coach
• Nurse practitioner
• PA or MD in private practice

…you can ADD telehealth GLP-1 revenue to your existing business with MedRevolve.

No new licenses. No new overhead. New revenue stream.

📞 240-387-5224
🌐 medrevolve.com

#HealthEntrepreneur #GymOwner #MedSpa #NursePractitioner #GLP1Revenue #MedRevolve #TelehealthAdd`,
      image_prompt: "Collage of different health entrepreneur types (gym, spa, clinic), success stories montage, diverse business owners, aspirational lifestyle grid",
      content_type: "static_ad",
      audience: "b2b_merchant"
    },
    {
      caption: `⏰ FROM ZERO TO REVENUE IN 30 DAYS

Day 1: Sign merchant agreement
Day 3: Branded platform goes live
Day 7: Marketing assets delivered
Day 14: First patients booking
Day 30: First revenue check

This is the MedRevolve merchant timeline.

Not 6 months. Not 12 months. 30 days.

📞 Start the clock: 240-387-5224
🌐 medrevolve.com

#30DayLaunch #TelehealthLaunch #MedRevolve #GLP1Business #QuickLaunch #MerchantAccount`,
      image_prompt: "Timeline concept, calendar with milestones highlighted, business launch countdown, success journey visualization, clean infographic style",
      content_type: "static_ad",
      audience: "b2b_merchant"
    },
    {
      caption: `💰 WHAT DOES $2,999/MO ACTUALLY BUY YOU?

Let's break it down vs. building it yourself:

Building alone:
- Attorney: $15,000
- Dev team: $50,000+
- Provider credentialing: 6 months
- Compliance setup: $25,000
- Total: $90,000+ and 12 months

MedRevolve:
- Total: $2,999/mo
- Timeline: 30 days
- Everything included

The math isn't complicated.

📞 240-387-5224
🌐 medrevolve.com

#ROI #TelehealthCost #MedRevolve #WhiteLabel #BusinessMath #GLP1Business #StartupCost`,
      image_prompt: "Side by side comparison graphic, DIY vs done-for-you costs visualization, clean infographic style, dollar signs and time icons, clear ROI visualization",
      content_type: "static_ad",
      audience: "b2b_merchant"
    },
    {
      caption: `🌐 Your patients are already searching for GLP-1 online.

Are they finding YOU?

MedRevolve merchants get:
→ SEO-optimized telehealth website
→ Google Ads campaign setup
→ Social media content library (monthly)
→ Email marketing automation
→ Patient review management
→ Local search optimization

Everything needed to dominate your market.

📞 240-387-5224
🌐 medrevolve.com

#TelehealthMarketing #GLP1Marketing #MedRevolve #DigitalMarketing #HealthcareMarketing #PatientAcquisition`,
      image_prompt: "Digital marketing dashboard showing patient acquisition metrics, Google search results showing telehealth practice, modern healthcare digital marketing aesthetic",
      content_type: "promo",
      audience: "b2b_merchant"
    }
  ],

  // ── CATEGORY 5: PROMOS / OFFERS ───────────────────────────────────────────
  promos: [
    {
      caption: `🎁 THIS WEEK ONLY: Free onboarding consultation ($500 value)

If you're considering a MedRevolve merchant account — this week we're offering:

→ FREE 60-min strategy session with our merchant success team
→ Full platform demo
→ Custom revenue projections for YOUR market
→ No-pressure, no obligation

We only do 5 of these per week.

📞 Book yours: 240-387-5224
🌐 medrevolve.com

Must call this week to qualify.

#FreeConsultation #TelehealthStrategy #MedRevolve #GLP1Business #MerchantAccount #LimitedOffer`,
      image_prompt: "Gift/offer concept, calendar showing this week highlighted, free consultation offer visual, warm welcoming business meeting setting",
      content_type: "promo",
      audience: "b2b_merchant"
    },
    {
      caption: `📣 FIRST MONTH FREE — For Qualifying Merchants

If you open 10+ patient accounts in your first 30 days, we credit your first month's platform fee back. Completely.

That's $2,999 back in your pocket.

It's our bet that once you see the results, you'll never leave.

Most merchants hit 10 patients in week 1.

📞 240-387-5224
🌐 medrevolve.com

Terms apply. Call for details.

#FirstMonthFree #MedRevolve #MerchantOffer #GLP1Business #TelehealthPromo #HealthcareBusiness`,
      image_prompt: "Money back guarantee concept, confident handshake business deal, first month free badge overlay, trust and value visual",
      content_type: "promo",
      audience: "b2b_merchant"
    },
    {
      caption: `🩺 PATIENT PROMO: $49 First Consultation

Normally $199. This week, $49.

Includes:
✅ Full telehealth consult
✅ GLP-1 eligibility assessment
✅ Prescription (if qualified)
✅ Personalized treatment plan

This offer won't last.

📞 Call to claim: 240-387-5224
🌐 medrevolve.com

Offer valid for new patients only.

#GLP1Deal #TelehealthDeal #MedRevolve #WeightLossOffer #ConsultationDeal #Semaglutide`,
      image_prompt: "Limited time offer badge, patient smiling at phone after booking, promotional energy, deal announcement style with price callout",
      content_type: "promo",
      audience: "b2c_patient"
    },
    {
      caption: `🤝 PARTNER PROGRAM: Earn $500 per merchant you refer

Know someone who should be running a MedRevolve telehealth business?

Send them our way. If they sign, you earn $500.

No cap. No limits. Refer 10 merchants = $5,000.

Our top referral partners earn $3,000–$10,000/month doing nothing but talking.

📞 Get your referral code: 240-387-5224
🌐 medrevolve.com/partner

#ReferralProgram #AffiliatePay #MedRevolve #EarnMoney #HealthcareAffiliate #TelehealthAffiliate #PassiveIncome`,
      image_prompt: "Referral program concept, person introducing two business partners, chain of success, partner network visual, collaborative business growth",
      content_type: "promo",
      audience: "b2b_merchant"
    },
    {
      caption: `⚡ FLASH DEAL: GLP-1 Starter Pack — $299

What's included:
✅ Initial telehealth consultation
✅ 30-day semaglutide supply
✅ Injection training guide
✅ 2 follow-up check-ins
✅ Nutrition & lifestyle protocol

Everything you need to start losing weight this week.

Limited to 50 patients.

📞 240-387-5224 — call NOW before it's gone
🌐 medrevolve.com

#GLP1StarterPack #Semaglutide #WeightLossDeal #MedRevolve #FlashDeal #GLP1 #TelehealthDeal`,
      image_prompt: "Flash sale energy, stopwatch with countdown, medication starter kit flat lay, urgent offer visual with price callout and scarcity",
      content_type: "promo",
      audience: "b2c_patient"
    },
    {
      caption: `🎯 BUNDLE: Telehealth Platform + Compliance Package + Marketing Kit

For Q2 merchant sign-ups only:

Normal price: $3,499/mo
Q2 bundle price: $2,999/mo

Includes EVERYTHING:
→ White-label telehealth platform
→ Full compliance framework
→ 100 done-for-you social posts/month
→ Google Ads setup & management
→ Patient acquisition funnel
→ Dedicated success manager

📞 Lock in Q2 pricing: 240-387-5224
🌐 medrevolve.com

Offer expires end of quarter.

#Q2Bundle #TelehealthBundle #MedRevolve #MerchantDeal #GLP1Business #ComplianceIncluded`,
      image_prompt: "Bundle deal concept, package deal with checkmarks, quarterly offer countdown, premium business package reveal aesthetic, value proposition visual",
      content_type: "promo",
      audience: "b2b_merchant"
    }
  ]
};

// Flatten all content into one array for random selection
const ALL_CONTENT = Object.values(CONTENT_LIBRARY).flat();

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1576091160550-217358c7db81?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a69c?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1080&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&fit=crop",
];

// Pick content that hasn't been posted recently — cycle through categories
async function pickContent(base44) {
  // Get last 30 posted captions to avoid repeats
  const recent = await base44.asServiceRole.entities.SocialPost.list('-created_date', 30);
  const recentCaptions = new Set(recent.map(p => p.caption?.substring(0, 60)));

  // Filter out recently used content
  const fresh = ALL_CONTENT.filter(c => !recentCaptions.has(c.caption.substring(0, 60)));

  // If all content used, reset and pick randomly
  const pool = fresh.length > 0 ? fresh : ALL_CONTENT;
  return pool[Math.floor(Math.random() * pool.length)];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow optional category override from payload
    let body = {};
    try { body = await req.json(); } catch {}
    const category = body.category; // e.g. "b2b_merchant", "compliance", "ugc_patient", "static_ads", "promos"

    let content;
    if (category && CONTENT_LIBRARY[category]) {
      const pool = CONTENT_LIBRARY[category];
      content = pool[Math.floor(Math.random() * pool.length)];
    } else {
      content = await pickContent(base44);
    }

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
        notes: `Auto-posted | type:${content.content_type} | audience:${content.audience} | CTA:240-387-5224`
      });

      console.log('[SUCCESS] Instagram posted:', publishData.id, '| type:', content.content_type, '| audience:', content.audience);
    } catch (e) {
      results.errors.push('Instagram: ' + e.message);
      console.error('[ERROR] Instagram:', e.message);
    }

    // ── 2. RELAY TO FACEBOOK via Zapier ─────────────────────────────────────
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
            content_type: content.content_type,
            audience: content.audience,
            source: 'autoPostUGCContent'
          })
        });

        const zapOk = zapRes.ok;
        await base44.asServiceRole.entities.SocialPost.create({
          platform: 'facebook',
          caption: content.caption,
          image_url: imageUrl,
          status: zapOk ? 'published' : 'failed',
          published_at: zapOk ? new Date().toISOString() : null,
          notes: zapOk
            ? `Relayed via Zapier | type:${content.content_type} | audience:${content.audience}`
            : 'Zapier relay failed'
        });

        results.facebook = zapOk ? 'relayed_via_zapier' : 'zapier_error';
        console.log('[INFO] Zapier Facebook relay:', zapRes.status, '| type:', content.content_type);
      } catch (e) {
        results.errors.push('Facebook/Zapier: ' + e.message);
        console.error('[ERROR] Zapier:', e.message);
      }
    } else {
      results.errors.push('Facebook: ZAPIER_WEBHOOK_URL not configured');
    }

    return Response.json({
      success: true,
      content_type: content.content_type,
      audience: content.audience,
      instagram: results.instagram ? '✅ Posted' : '❌ Failed',
      facebook: results.facebook === 'relayed_via_zapier' ? '✅ Relayed via Zapier' : '⚠️ ' + (results.facebook || 'Not configured'),
      caption_preview: content.caption.substring(0, 150) + '...',
      errors: results.errors
    });

  } catch (error) {
    console.error('[ERROR] autoPostUGCContent:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});