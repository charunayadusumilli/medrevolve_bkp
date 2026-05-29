/**
 * pushSEOToSheets — One-time + on-demand function to push the full SEO keyword stack,
 * new page inventory, and Google Ads campaigns to the Master Workbook.
 * 
 * Tabs updated:
 * 1. SEO Keywords (40 keywords)
 * 2. Blog Pipeline (8 queued posts)
 * 3. New Pages (8 new SEO landing pages)
 * 4. Ad Campaigns (5 Google Ads campaigns)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID = '1ROoR2Xm2FVEmN3XqzM4I_YXvtvXUwuJxHcQflAbiZGg';

const SEO_KEYWORDS = [
  // B2B Core
  ['white label telehealth platform', 2800, 'HIGH', '/ForBusiness', 'H1, meta title'],
  ['telehealth platform for clinics', 1900, 'HIGH', '/ForBusiness', 'H2'],
  ['white label telehealth software', 1600, 'MEDIUM', '/ForBusiness', 'H2'],
  ['telehealth infrastructure', 1100, 'MEDIUM', '/ForBusiness', 'H3'],
  ['telehealth B2B platform', 900, 'MEDIUM', '/ForBusiness', 'H3'],
  // Med Spa
  ['med spa weight loss program', 3600, 'MEDIUM', '/for-med-spas', 'H1, meta title'],
  ['telehealth for med spas', 1400, 'LOW', '/for-med-spas', 'H2'],
  ['add glp-1 to med spa', 1100, 'LOW', '/for-med-spas', 'H2'],
  ['med spa telehealth platform', 880, 'LOW', '/for-med-spas', 'H3'],
  ['glp1 weight loss clinic platform', 720, 'LOW', '/for-med-spas', 'H3'],
  // TRT / Hormone
  ['how to start a TRT company', 1600, 'LOW', '/trt-clinic-platform', 'H1, meta title'],
  ['TRT telehealth platform', 1200, 'MEDIUM', '/trt-clinic-platform', 'H2'],
  ['testosterone clinic startup', 880, 'LOW', '/trt-clinic-platform', 'H2'],
  ['mens health telehealth platform', 740, 'LOW', '/trt-clinic-platform', 'H3'],
  ['TRT business white label', 620, 'LOW', '/trt-clinic-platform', 'H3'],
  // Weight Loss Clinic
  ['start medical weight loss clinic', 2400, 'MEDIUM', '/weight-loss-clinic-platform', 'H1, meta title'],
  ['how to open a weight loss clinic', 1800, 'MEDIUM', '/weight-loss-clinic-platform', 'H2'],
  ['weight loss clinic startup', 1400, 'MEDIUM', '/weight-loss-clinic-platform', 'H2'],
  ['glp-1 clinic platform', 960, 'LOW', '/weight-loss-clinic-platform', 'H3'],
  ['medical weight loss telehealth', 840, 'MEDIUM', '/weight-loss-clinic-platform', 'H3'],
  // Competitor Keywords
  ['openloop alternative', 800, 'LOW', '/openloop-alternative', 'H1, meta title'],
  ['openloop telehealth competitor', 540, 'LOW', '/openloop-alternative', 'H2'],
  ['mytelemedicine alternative', 600, 'LOW', '/mytelemedicine-alternative', 'H1, meta title'],
  ['mytelemedicine competitor', 420, 'LOW', '/mytelemedicine-alternative', 'H2'],
  ['telehealth platform alternative', 1100, 'MEDIUM', '/openloop-alternative', 'H3'],
  // Franchise
  ['telehealth franchise', 1200, 'MEDIUM', '/telehealth-franchise', 'H1, meta title'],
  ['telehealth business franchise', 880, 'MEDIUM', '/telehealth-franchise', 'H2'],
  ['health clinic franchise alternative', 640, 'LOW', '/telehealth-franchise', 'H3'],
  // IV Therapy
  ['iv therapy clinic telehealth', 900, 'LOW', '/iv-therapy-clinic-platform', 'H1, meta title'],
  ['add telehealth to iv clinic', 540, 'LOW', '/iv-therapy-clinic-platform', 'H2'],
  // Long-tail high intent
  ['launch telehealth business 7 days', 320, 'LOW', '/MerchantOnboarding', 'CTA'],
  ['white label telehealth without hiring doctors', 280, 'LOW', '/ForBusiness', 'H3'],
  ['telehealth white label no code', 440, 'LOW', '/ForBusiness', 'H3'],
  ['hipaa compliant telehealth platform B2B', 580, 'LOW', '/ForBusiness', 'H3'],
  ['legitscript telehealth platform', 380, 'LOW', '/ForBusiness', 'H3'],
  ['503a pharmacy telehealth integration', 260, 'LOW', '/ForBusiness', 'H3'],
  ['telehealth platform all 50 states', 620, 'LOW', '/ForBusiness', 'H2'],
  ['telehealth startup platform', 980, 'MEDIUM', '/HowItWorks', 'H2'],
  ['wellness clinic telehealth software', 740, 'LOW', '/for-med-spas', 'H3'],
  ['entrepreneurial telehealth platform', 360, 'LOW', '/MerchantOnboarding', 'CTA'],
];

const BLOG_PIPELINE = [
  ['2026-06-02', 'How to Start a TRT Company in 2025: The Complete Guide', 'how to start a TRT company', 1600, 'LOW', '/trt-clinic-platform', 'QUEUED - Week 1'],
  ['2026-06-09', 'How to Start a Medical Weight Loss Clinic (Without Hiring a Doctor)', 'start medical weight loss clinic', 2400, 'MEDIUM', '/weight-loss-clinic-platform', 'QUEUED - Week 2'],
  ['2026-06-16', 'Med Spa Weight Loss Programs: How to Add GLP-1 to Your Existing Business', 'med spa weight loss program', 3600, 'MEDIUM', '/for-med-spas', 'QUEUED - Week 3'],
  ['2026-06-23', 'OpenLoop Alternative: Why Operators Switch to Full-Stack Platforms', 'openloop alternative', 800, 'LOW', '/openloop-alternative', 'QUEUED - Week 4'],
  ['2026-06-30', 'MyTelemedicine Alternative: Full-Stack Comparison for Clinic Owners', 'mytelemedicine alternative', 600, 'LOW', '/mytelemedicine-alternative', 'QUEUED - Week 5'],
  ['2026-07-07', 'Telehealth Franchise vs. Building Your Own: What No One Tells You', 'telehealth franchise', 1200, 'MEDIUM', '/telehealth-franchise', 'QUEUED - Week 6'],
  ['2026-07-14', 'How IV Therapy Clinics Are Adding $20K/Month With Telehealth Programs', 'iv therapy clinic telehealth', 900, 'LOW', '/iv-therapy-clinic-platform', 'QUEUED - Week 7'],
  ['2026-07-21', 'White Label Telehealth Platform Comparison: 2025 Guide for Clinic Owners', 'white label telehealth platform', 2800, 'HIGH', '/ForBusiness', 'QUEUED - Week 8'],
];

const NEW_PAGES = [
  ['/for-med-spas', 'For Med Spas', 'Add a GLP-1 Weight Loss Program to Your Med Spa — in 7 Days', 'med spa weight loss program', '3,600/mo', 'LIVE'],
  ['/trt-clinic-platform', 'TRT Clinic Platform', 'Start a TRT Telehealth Company Without Building the Infrastructure', 'how to start a TRT company', '1,600/mo', 'LIVE'],
  ['/weight-loss-clinic-platform', 'Weight Loss Clinic Platform', 'Start a Medical Weight Loss Clinic Without Hiring a Single Doctor', 'start medical weight loss clinic', '2,400/mo', 'LIVE'],
  ['/openloop-alternative', 'OpenLoop Alternative', 'Looking for an OpenLoop Alternative? MedRevolve Includes More — For Less', 'openloop alternative', '800/mo', 'LIVE'],
  ['/mytelemedicine-alternative', 'MyTelemedicine Alternative', 'Looking for a MyTelemedicine Alternative? MedRevolve Is the Full-Stack Solution', 'mytelemedicine alternative', '600/mo', 'LIVE'],
  ['/telehealth-franchise', 'Telehealth Franchise Alternative', 'Launch a Telehealth Business Without Buying a Franchise', 'telehealth franchise', '1,200/mo', 'LIVE'],
  ['/iv-therapy-clinic-platform', 'IV Therapy Clinic Platform', 'Add Telehealth to Your IV Therapy Clinic — in 7 Days', 'iv therapy clinic telehealth', '900/mo', 'LIVE'],
  ['/ForCreators', 'For Creators', 'Partner With MedRevolve — Creator & Affiliate Program', 'telehealth affiliate program', '1,100/mo', 'LIVE'],
];

const AD_CAMPAIGNS = [
  ['Med Spa B2B', '$50/day', 'med spa weight loss program, telehealth for med spas, add glp-1 to med spa', '/for-med-spas', 'Add GLP-1 to your med spa in 7 days. White-label telehealth platform — physicians + pharmacy included.', 'READY'],
  ['TRT Clinic Launch', '$30/day', 'how to start a TRT company, TRT telehealth platform, testosterone clinic startup', '/trt-clinic-platform', 'Launch your TRT telehealth clinic in 7 days. Full platform — physicians, pharmacy, compliance included.', 'READY'],
  ['OpenLoop & MyTelemedicine Conquest', '$25/day', 'openloop alternative, mytelemedicine alternative, telehealth platform competitor', '/openloop-alternative', 'Switched from OpenLoop? MedRevolve gives you the full stack — white-label, pharmacy, and compliance built in.', 'READY'],
  ['Weight Loss Clinic Startup', '$50/day', 'start medical weight loss clinic, how to open weight loss clinic, glp-1 clinic platform', '/weight-loss-clinic-platform', 'Start a medical weight loss clinic in 7 days. No doctors to hire. Full white-label platform included.', 'READY'],
  ['White Label Core', '$35/day', 'white label telehealth platform, telehealth platform for clinics, telehealth infrastructure B2B', '/ForBusiness', 'The #1 white-label telehealth platform for clinics, med spas & entrepreneurs. Launch in 7 days.', 'READY'],
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const results = {};

    // Helper: ensure a sheet tab exists (add it if not)
    const ensureTab = async (tabName) => {
      const metaRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties.title`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      const meta = await metaRes.json();
      const existing = (meta.sheets || []).map(s => s.properties.title);
      if (!existing.includes(tabName)) {
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tabName } } }] }),
          }
        );
        console.log(`[pushSEOToSheets] Created tab: ${tabName}`);
      }
    };

    // Helper: clear and rewrite a tab
    const writeTab = async (tabName, headers, rows) => {
      await ensureTab(tabName);
      const range = `${tabName}!A1`;
      // Clear first
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(tabName)}:clear`,
        { method: 'POST', headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      // Write headers + rows
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [headers, ...rows] }),
        }
      );
      if (!response.ok) {
        const err = await response.text();
        console.error(`[pushSEOToSheets] Error writing tab ${tabName}:`, err);
      }
      return response.ok;
    };

    // 1. SEO Keywords tab
    results.seo_keywords = await writeTab(
      'SEO Keywords',
      ['Keyword', 'Monthly Searches', 'Competition', 'Target Page', 'Placement', 'Status'],
      SEO_KEYWORDS.map(r => [...r, 'ACTIVE'])
    );
    console.log('[pushSEOToSheets] SEO Keywords:', results.seo_keywords);

    // 2. Blog Pipeline tab
    results.blog_pipeline = await writeTab(
      'Blog Pipeline',
      ['Publish Date', 'Title', 'Target Keyword', 'Monthly Searches', 'Competition', 'Target Page', 'Status'],
      BLOG_PIPELINE
    );
    console.log('[pushSEOToSheets] Blog Pipeline:', results.blog_pipeline);

    // 3. New Pages tab
    results.new_pages = await writeTab(
      'New Pages',
      ['URL', 'Page Name', 'Meta Title', 'Primary Keyword', 'Search Volume', 'Status'],
      NEW_PAGES
    );
    console.log('[pushSEOToSheets] New Pages:', results.new_pages);

    // 4. Ad Campaigns tab
    results.ad_campaigns = await writeTab(
      'Ad Campaigns',
      ['Campaign Name', 'Daily Budget', 'Keywords', 'Landing Page', 'Ad Copy', 'Status'],
      AD_CAMPAIGNS
    );
    console.log('[pushSEOToSheets] Ad Campaigns:', results.ad_campaigns);

    return Response.json({
      success: true,
      spreadsheet_url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
      tabs_updated: results,
      summary: {
        keywords: SEO_KEYWORDS.length,
        blog_posts: BLOG_PIPELINE.length,
        new_pages: NEW_PAGES.length,
        ad_campaigns: AD_CAMPAIGNS.length,
      },
    });

  } catch (error) {
    console.error('[pushSEOToSheets] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});