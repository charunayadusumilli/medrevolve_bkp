# MedRevolve Marketing Automation System

## Overview
This document outlines the complete marketing automation setup for generating leads across all social media platforms with the primary CTA: **240-387-5224**

## System Components

### 1. IONOS AI Voice Receptionist
**Status:** ✅ Active  
**Phone:** 240-387-5224  
**Knowledge Base:** See `content/ionos/IONOS_KNOWLEDGE_BASE.md`

**What IONOS Does:**
- Answers calls 24/7 with AI
- Qualifies leads (B2B partners, B2C patients, RUO customers)
- Books appointments automatically
- Sends follow-up emails
- Escalates hot leads to human team
- Learns from every call interaction

**Setup Instructions:**
1. Go to your IONOS AI Voice Receptionist dashboard
2. Navigate to "Knowledge Base" or "AI Training" section
3. Copy the entire content from `content/ionos/IONOS_KNOWLEDGE_BASE.md`
4. Paste into the knowledge base field
5. Set greeting: "Thank you for calling MedRevolve! This is [AI name]. Are you interested in starting your own telehealth business, looking for weight loss treatments, or calling about research products?"
6. Enable call recording for quality monitoring
7. Set escalation rules (see knowledge base for triggers)

**Continuous Improvement:**
- IONOS automatically learns from successful conversions
- Review call recordings weekly to identify improvement areas
- Update knowledge base monthly with new FAQs, objections, success stories
- Monitor metrics: answer rate, qualification rate, booking rate, conversion rate

---

### 2. Social Media Content Generation
**Status:** ✅ Automated  
**Function:** `generateSocialMediaContent`

**What It Does:**
- Generates platform-specific content daily
- Creates posts for Instagram, Facebook, LinkedIn
- Includes strong CTAs with phone number
- Optimizes hashtags and formatting per platform
- Saves drafts to database for review

**Content Strategy:**
- **Instagram:** Visual, emoji-rich, hashtag-heavy (15-20 tags)
- **Facebook:** Community-focused, story-driven, moderate hashtags
- **LinkedIn:** Professional, data-driven, business case studies
- **Posting Schedule:** 3x per day per platform (9am, 1pm, 7pm EST)

**How to Use:**
1. Run `generateSocialMediaContent` function manually or via automation
2. Review generated posts in SocialPost entity
3. Edit if needed (maintain phone number CTA!)
4. Approve for scheduling

---

### 3. Automated Social Media Posting
**Status:** ✅ Automated  
**Function:** `autoPostToSocial`

**What It Does:**
- Automatically publishes scheduled posts
- Posts to connected social media accounts
- Updates post status (draft → published)
- Tracks engagement metrics
- Handles errors gracefully

**Required Connections:**
- ✅ Instagram Business (already connected)
- ⚠️ Facebook Page (connect via dashboard)
- ⚠️ LinkedIn Company Page (manual posting for now)

**Setup:**
1. Connect Facebook Page to Instagram (already done if Business Manager linked)
2. For LinkedIn: Export posts and manually publish or use LinkedIn API integration
3. Set automation to run 3x daily (see Automation Setup section)

---

### 4. Lead Capture & Tracking
**Status:** ✅ Active  
**Entity:** `ContactRequest`

**Lead Sources Tracked:**
- Website forms
- Phone calls (via IONOS)
- Social media DMs
- Email inquiries
- Partner referrals

**Automatic Workflows:**
1. **New Lead Created** → Send welcome email
2. **B2B Lead** → Trigger partnership email sequence
3. **B2C Lead** → Send booking link + intake forms
4. **Hot Lead** (ready to buy) → SMS notification to sales team
5. **Follow-up** → Automated Day 1, 3, 7, 14 touchpoints

**Lead Scoring:**
- **Hot:** Called phone number + requested demo = Immediate call back
- **Warm:** Filled form + engaged with content = Email sequence
- **Cold:** Single interaction = Monthly newsletter

---

### 5. Content Calendar

#### Weekly Themes
- **Monday:** Motivation + Business Opportunity (B2B focus)
- **Tuesday:** Transformation Tuesday (patient success stories)
- **Wednesday:** Wellness Wednesday (health tips + RUO products)
- **Thursday:** Thought Leadership (industry insights)
- **Friday:** Feature Friday (platform capabilities)
- **Saturday:** Social Proof (testimonials, reviews)
- **Sunday:** Self-Care Sunday (wellness focus)

#### Content Mix
- 40% Educational (health tips, business advice)
- 30% Promotional (platform features, products)
- 20% Social Proof (testimonials, case studies)
- 10% Behind-the-Scenes (team, company culture)

#### Always Include:
- ✅ Phone number: 240-387-5224
- ✅ Clear CTA ("Call now", "Book demo", "Start today")
- ✅ Relevant hashtags
- ✅ Visual element (image/video/graphic)

---

## Automation Setup

### Scheduled Automations to Create

#### 1. Daily Content Generation
**Schedule:** Every day at 8:00 AM EST  
**Function:** `generateSocialMediaContent`  
**Purpose:** Generate fresh content for all platforms

```
Create automation:
- automation_type: "scheduled"
- name: "Daily Social Media Content Generation"
- function_name: "generateSocialMediaContent"
- repeat_interval: 1
- repeat_unit: "days"
- start_time: "08:00"
```

#### 2. Auto-Post to Social Media
**Schedule:** 3x daily (9:00 AM, 1:00 PM, 7:00 PM EST)  
**Function:** `autoPostToSocial`  
**Purpose:** Publish scheduled content

```
Create 3 automations:
- name: "Morning Social Media Post"
  start_time: "09:00"
  
- name: "Afternoon Social Media Post"
  start_time: "13:00"
  
- name: "Evening Social Media Post"
  start_time: "19:00"
```

#### 3. Weekly Lead Report
**Schedule:** Every Monday at 9:00 AM EST  
**Function:** Create new function `generateWeeklyLeadReport`  
**Purpose:** Email summary of leads, conversions, revenue

#### 4. Monthly Content Review
**Schedule:** 1st of each month at 10:00 AM EST  
**Function:** Manual review + LLM analysis  
**Purpose:** Analyze top-performing content, adjust strategy

---

## Platform-Specific Strategies

### Instagram
**Goal:** Brand awareness + B2C leads  
**Post Types:**
- Before/after transformations (with permission)
- Product showcases (GLP-1 vials, RUO products)
- Behind-the-scenes (platform demo)
- Educational carousels (telehealth tips)
- Reels (quick tips, FAQs)

**Hashtags (rotate these):**
```
#telehealth #weightloss #glp1 #wellness #entrepreneur #medspa #healthtech
#digitalhealth #healthcare #businessopportunity #passiveincome #wellnessjourney
#semaglutide #tirzepatide #healthcarebusiness #whiteLabel #turnkey
```

**Engagement:**
- Respond to all comments within 2 hours
- DM anyone asking about pricing with phone number
- Story polls/questions daily
- Go Live weekly for Q&A

### Facebook
**Goal:** Community building + B2B leads  
**Post Types:**
- Long-form success stories
- Live demo announcements
- Partner spotlights
- Educational videos
- Event promotions (webinars)

**Groups to Join:**
- Med Spa Owners
- Wellness Business Network
- Telehealth Professionals
- Healthcare Entrepreneurs
- Weight Loss Clinic Owners

**Strategy:**
- Share value first (80%), promote second (20%)
- Answer questions in groups (establish authority)
- Share case studies with phone number CTA
- Run Facebook Ads targeting business owners

### LinkedIn
**Goal:** B2B partnerships + credibility  
**Post Types:**
- Industry insights (telehealth growth stats)
- Company milestones
- Partner success stories
- Thought leadership articles
- Job postings (growth signal)

**Engagement:**
- Connect with med spa owners, wellness entrepreneurs
- Comment on relevant posts daily
- Share articles with insightful commentary
- Use LinkedIn Articles for long-form content

### Twitter/X (Optional)
**Goal:** Real-time engagement + customer service  
**Post Types:**
- Quick tips
- Industry news commentary
- Thread series (telehealth 101)
- Customer service responses

---

## Paid Advertising Integration

### Google Ads
**Campaigns to Launch:**
1. **B2B - "Start Telehealth Business"**
   - Keywords: "white label telehealth", "start med spa", "GLP-1 business opportunity"
   - Landing page: /ForBusiness
   - CTA: Call 240-387-5224 for demo

2. **B2C - "Weight Loss Telehealth"**
   - Keywords: "weight loss doctor online", "GLP-1 prescription", "semaglutide telehealth"
   - Landing page: /BookAppointment
   - CTA: Book consultation today

3. **RUO - "Bacteriostatic Water"**
   - Keywords: "bacteriostatic water bulk", "sterile water vials", "RUO supplies"
   - Landing page: /WaterHome
   - CTA: Call for wholesale pricing

### Facebook/Instagram Ads
**Audiences:**
- Med spa owners (job title + interests)
- Wellness entrepreneurs
- Fitness business owners
- Healthcare providers
- Weight loss seekers (25-65, interests)

**Ad Creative:**
- Video ads (platform demo, testimonials)
- Carousel ads (features, benefits)
- Lead gen forms (capture info without leaving platform)

### LinkedIn Ads
**Targeting:**
- Job titles: Owner, Founder, CEO, Medical Director
- Industries: Wellness, Healthcare, Fitness
- Company size: 1-50 employees
- Interests: Telehealth, Medical Spa, Wellness

---

## Metrics & KPIs

### Daily Tracking
- [ ] Number of calls to 240-387-5224
- [ ] Lead source breakdown (social, organic, paid, referral)
- [ ] Social media engagement (likes, comments, shares)
- [ ] Website traffic (Google Analytics)
- [ ] Appointment bookings

### Weekly Review
- [ ] Lead qualification rate (% that become opportunities)
- [ ] Conversion rate (% that become customers)
- [ ] Cost per lead (ad spend / leads)
- [ ] Cost per acquisition (ad spend / customers)
- [ ] Top-performing content pieces

### Monthly Goals
- **Month 1:** 50 calls, 20 qualified leads, 5 new customers
- **Month 2:** 100 calls, 40 qualified leads, 10 new customers
- **Month 3:** 200 calls, 80 qualified leads, 20 new customers

---

## Quick Start Checklist

### Week 1: Foundation
- [ ] Upload knowledge base to IONOS
- [ ] Test IONOS AI with sample calls
- [ ] Connect Facebook Business Manager
- [ ] Generate first week of content
- [ ] Schedule posts for Week 1
- [ ] Set up Google Analytics goals
- [ ] Create lead tracking dashboard

### Week 2: Launch
- [ ] Start daily content generation
- [ ] Enable auto-posting automation
- [ ] Launch Google Ads (small budget)
- [ ] Launch Facebook Ads (small budget)
- [ ] Begin LinkedIn outreach (10 connections/day)
- [ ] Monitor call quality and adjust IONOS scripts

### Week 3: Optimize
- [ ] Review Week 2 metrics
- [ ] Double down on top-performing content
- [ ] Adjust ad targeting based on conversions
- [ ] Add customer testimonials to content mix
- [ ] Implement A/B testing on ad creative

### Week 4: Scale
- [ ] Increase ad budget on winning campaigns
- [ ] Add new content formats (video, reels)
- [ ] Expand to additional platforms (Twitter, Pinterest)
- [ ] Launch referral program
- [ ] Plan next month's content themes

---

## Emergency Contacts & Escalation

**Technical Issues:**
- IONOS not answering: Check account status, restart AI
- Social posting failing: Reconnect Instagram/Facebook
- Website down: Contact hosting support

**Lead Overflow:**
- >20 calls/day: Add sales team member
- >50 leads/week: Implement lead scoring + prioritization
- System overwhelmed: Temporarily pause ads, focus on fulfillment

**Negative Feedback:**
- Social media complaints: Respond within 1 hour, move to DM
- Bad reviews: Professional response, offer resolution
- Compliance concerns: Escalate to legal immediately

---

## Success Principles

1. **Consistency is Key** - Post daily, even if engagement is low initially
2. **Phone Number Everywhere** - Every post, every ad, every profile
3. **Follow Up Fast** - Leads go cold in 15 minutes, call immediately
4. **Track Everything** - What gets measured gets managed
5. **Iterate Quickly** - Kill what doesn't work, scale what does
6. **Compliance First** - Never make false claims, always disclaim
7. **Customer Success** - Happy customers = referrals = growth

---

**Last Updated:** 2026-05-24  
**Version:** 1.0  
**Owner:** Marketing Team  
**Next Review:** Weekly

**Questions?** Call 240-387-5224 or email support@medrevolve.com