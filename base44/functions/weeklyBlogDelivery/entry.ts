/**
 * weeklyBlogDelivery — Generates the weekly blog post and pushes it to:
 * 1. Google Sheets Blog Pipeline tab
 * 2. Sends a Gmail notification to the team
 * 
 * Triggered every Monday at 9:15am ET via scheduled automation.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BLOG_PIPELINE = [
  {
    title: 'How to Start a TRT Company in 2025: The Complete Compliance & Business Guide',
    target_page: '/trt-clinic-platform',
    target_keyword: 'how to start a TRT company',
    monthly_searches: 1600,
    competition: 'LOW',
    angle: 'Better version of the top-ranking OpenLoop post. Covers compliance, physician sourcing, pharmacy setup, and how MedRevolve removes every barrier.',
  },
  {
    title: 'How to Start a Medical Weight Loss Clinic (Without Hiring a Doctor)',
    target_page: '/weight-loss-clinic-platform',
    target_keyword: 'start medical weight loss clinic',
    monthly_searches: 2400,
    competition: 'MEDIUM',
    angle: 'Step-by-step guide targeting entrepreneurs. Covers GLP-1 programs, telehealth infrastructure, pharmacy, and compliance. CTA to MedRevolve.',
  },
  {
    title: 'Med Spa Weight Loss Programs: How to Add GLP-1 to Your Existing Business',
    target_page: '/for-med-spas',
    target_keyword: 'med spa weight loss program',
    monthly_searches: 3600,
    competition: 'MEDIUM',
    angle: 'Case study-style guide for med spa owners. Covers ROI, patient acquisition, compliance, and step-by-step platform setup.',
  },
  {
    title: 'OpenLoop Alternative: Why Telehealth Operators Are Switching to Full-Stack Platforms',
    target_page: '/openloop-alternative',
    target_keyword: 'openloop alternative',
    monthly_searches: 800,
    competition: 'LOW',
    angle: 'Direct competitor capture post. Comparison table, key differentiators, and real operator use cases.',
  },
  {
    title: 'MyTelemedicine Alternative: The Full-Stack Comparison for Clinic Owners',
    target_page: '/mytelemedicine-alternative',
    target_keyword: 'mytelemedicine alternative',
    monthly_searches: 600,
    competition: 'LOW',
    angle: 'Same competitor capture strategy as OpenLoop post. Targets business operators evaluating multiple platforms.',
  },
  {
    title: 'Telehealth Franchise vs. Building Your Own: What No One Tells You',
    target_page: '/telehealth-franchise',
    target_keyword: 'telehealth franchise',
    monthly_searches: 1200,
    competition: 'MEDIUM',
    angle: 'Challenges the franchise model. Covers hidden fees, brand lock-in, and why owning your platform (MedRevolve) is smarter.',
  },
  {
    title: 'How IV Therapy Clinics Are Adding $20K/Month With Telehealth Programs',
    target_page: '/iv-therapy-clinic-platform',
    target_keyword: 'iv therapy clinic telehealth',
    monthly_searches: 900,
    competition: 'LOW',
    angle: 'Revenue-first angle for IV therapy clinic owners. Covers weight loss, hormone, and peptide add-on programs.',
  },
  {
    title: 'White Label Telehealth Platform Comparison: 2025 Guide for Clinic Owners',
    target_page: '/ForBusiness',
    target_keyword: 'white label telehealth platform',
    monthly_searches: 2800,
    competition: 'HIGH',
    angle: 'High-authority comparison post covering the full white-label telehealth landscape. MedRevolve anchored as the only full-stack solution.',
  },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Determine which blog post to write this week (rotate through the pipeline)
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const postIndex = weekNumber % BLOG_PIPELINE.length;
    const thisWeeksPost = BLOG_PIPELINE[postIndex];

    console.log(`[weeklyBlogDelivery] Writing blog post ${postIndex + 1}/${BLOG_PIPELINE.length}:`, thisWeeksPost.title);

    // Generate the full blog post via LLM
    const blogContent = await base44.asServiceRole.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt: `You are an expert SEO content writer for MedRevolve, a B2B white-label telehealth infrastructure platform.

Write a complete, publish-ready SEO blog post with the following specs:

TITLE: ${thisWeeksPost.title}
TARGET KEYWORD: "${thisWeeksPost.target_keyword}" (${thisWeeksPost.monthly_searches} searches/month, ${thisWeeksPost.competition} competition)
CONTENT ANGLE: ${thisWeeksPost.angle}
TARGET PAGE TO LINK: medrevolve.com${thisWeeksPost.target_page}

REQUIREMENTS:
- 1,500–2,000 words
- H1, H2, H3 structure optimized for "${thisWeeksPost.target_keyword}"
- Include keyword naturally in: title, first 100 words, 2-3 subheadings, conclusion
- Include 2 internal links to medrevolve.com pages
- Include a strong CTA at the end linking to /MerchantOnboarding
- Tone: authoritative, educational, B2B-focused — NOT salesy
- Do NOT mention specific drug names in a promotional context
- Include a meta title (under 60 chars) and meta description (under 155 chars) at the top

FORMAT: Return as structured markdown with clear sections.`,
    });

    // Push to Google Sheets Blog Pipeline tab
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const SPREADSHEET_ID = '1ROoR2Xm2FVEmN3XqzM4I_YXvtvXUwuJxHcQflAbiZGg';
    const today = new Date().toISOString().split('T')[0];

    // Append to Blog Pipeline tab
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Blog%20Pipeline!A:G:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[
            today,
            thisWeeksPost.title,
            thisWeeksPost.target_keyword,
            thisWeeksPost.monthly_searches,
            thisWeeksPost.competition,
            thisWeeksPost.target_page,
            'GENERATED — Ready for review',
          ]],
        }),
      }
    );

    if (!sheetsResponse.ok) {
      const err = await sheetsResponse.text();
      console.error('[weeklyBlogDelivery] Sheets append error:', err);
    } else {
      console.log('[weeklyBlogDelivery] ✅ Blog post logged to Google Sheets');
    }

    // Send Gmail notification with the blog post
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: Deno.env.get('ADMIN_EMAIL') || 'info@medrevolve.com',
      subject: `📝 Weekly Blog Post Ready: ${thisWeeksPost.title}`,
      from_name: 'MedRevolve SEO Bot',
      body: `<h2>Your Weekly Blog Post Is Ready</h2>
<p><strong>Week of:</strong> ${today}</p>
<p><strong>Target Keyword:</strong> ${thisWeeksPost.target_keyword} (${thisWeeksPost.monthly_searches}/mo, ${thisWeeksPost.competition} competition)</p>
<p><strong>Target Page:</strong> <a href="https://medrevolve.com${thisWeeksPost.target_page}">medrevolve.com${thisWeeksPost.target_page}</a></p>
<hr/>
<pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px;line-height:1.6">${blogContent}</pre>
<hr/>
<p><small>This post was auto-generated by MedRevolve's weekly SEO automation. Review, lightly edit, and publish. Next post scheduled for next Monday at 9:15am ET.</small></p>`,
    });

    console.log('[weeklyBlogDelivery] ✅ Email sent with blog post');

    return Response.json({
      success: true,
      post_title: thisWeeksPost.title,
      post_index: postIndex + 1,
      total_posts: BLOG_PIPELINE.length,
      sheets_updated: sheetsResponse.ok,
    });

  } catch (error) {
    console.error('[weeklyBlogDelivery] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});