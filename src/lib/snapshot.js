/**
 * MedRevolve Platform Snapshot
 * ─────────────────────────────────────────────────────────────────────────────
 * SNAPSHOT DATE: 2026-05-22
 * VERSION: 1.0.0 — God Mode Separation Build
 * 
 * This file stores the living inventory of all built assets, their domain
 * assignments, completion status, and integration links.
 * Use this as the ground truth when planning new features, migrations, or audits.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SNAPSHOT = {
  version: '2.0.0',
  snapshot_date: '2026-05-23',
  build_phase: 'God Mode — Full Deploy',

  // ── DOMAINS ──────────────────────────────────────────────────────────────
  domains: {
    B2C:    { url: 'medrevolve.com',          status: 'pending', priority: 1, compliance: 'LegitScript_Required', stripe_product: 'prod_UZHDOgZoLCgqwb', stripe_price: 'price_1Ta8fTElLZoWknW5PY6Ef5NA', note: 'Domains configured — awaiting DNS propagation' },
    B2B:    { url: 'medrevolveb2b.com',        status: 'pending', priority: 2, compliance: 'Standard_B2B', stripe_product: 'prod_UZHDKsaaYMWlIh', stripe_price: 'price_1Ta8fTElLZoWknW5wwHbV69f', note: 'Domains configured — awaiting DNS propagation' },
    RUO:    { url: 'medrevolveruo.com',        status: 'pending', priority: 3, compliance: 'RUO_FDA_Disclaimer', note: 'Domains configured — awaiting DNS propagation' },
    WATER:  { url: 'medrevolvewater.com',      status: 'pending', priority: 4, compliance: 'Standard_Ecommerce', note: 'Domains configured — awaiting DNS propagation' },
    DEV:    { url: 'base44.app (current)',     status: 'live',           priority: 0, compliance: 'ALL' },
  },

  // ── PAGES INVENTORY ──────────────────────────────────────────────────────
  pages: {
    // B2C Pages
    Home:                 { domain: 'B2C', status: 'built', file: 'pages/Home.jsx', priority: 'critical' },
    TelehealthPlatform:   { domain: 'B2C', status: 'built', file: 'pages/TelehealthPlatform.jsx', priority: 'critical' },
    BookAppointment:      { domain: 'B2C', status: 'built', file: 'pages/BookAppointment.jsx', priority: 'critical' },
    PatientPortal:        { domain: 'B2C', status: 'built', file: 'pages/PatientPortal.jsx', priority: 'critical' },
    Products:             { domain: 'B2C', status: 'built', file: 'pages/Products.jsx', priority: 'high' },
    HowItWorks:           { domain: 'B2C', status: 'built', file: 'pages/HowItWorks.jsx', priority: 'high' },
    CustomerIntake:       { domain: 'B2C', status: 'built', file: 'pages/CustomerIntake.jsx', priority: 'high' },
    PatientOnboarding:    { domain: 'B2C', status: 'built', file: 'pages/PatientOnboarding.jsx', priority: 'high' },
    VideoCall:            { domain: 'B2C', status: 'built', file: 'pages/VideoCall.jsx', priority: 'medium' },
    WaitingRoom:          { domain: 'B2C', status: 'built', file: 'pages/WaitingRoom.jsx', priority: 'medium' },
    QualiphyConsult:      { domain: 'B2C', status: 'built', file: 'pages/QualiphyConsult.jsx', priority: 'medium' },
    Messages:             { domain: 'B2C', status: 'built', file: 'pages/Messages.jsx', priority: 'medium' },
    MyAppointments:       { domain: 'B2C', status: 'built', file: 'pages/MyAppointments.jsx', priority: 'medium' },
    Cart:                 { domain: 'B2C', status: 'built', file: 'pages/Cart.jsx', priority: 'medium' },
    Checkout:             { domain: 'B2C', status: 'built', file: 'pages/Checkout.jsx', priority: 'medium' },
    OrderSuccess:         { domain: 'B2C', status: 'built', file: 'pages/OrderSuccess.jsx', priority: 'medium' },
    AccountSettings:      { domain: 'B2C', status: 'built', file: 'pages/AccountSettings.jsx', priority: 'low' },
    ProviderProfile:      { domain: 'B2C', status: 'built', file: 'pages/ProviderProfile.jsx', priority: 'low' },

    // B2B Pages
    ForBusiness:          { domain: 'B2B', status: 'built', file: 'pages/ForBusiness.jsx', priority: 'critical' },
    MerchantOnboarding:   { domain: 'B2B', status: 'built', file: 'pages/MerchantOnboarding.jsx', priority: 'critical' },
    MerchantDashboard:    { domain: 'B2B', status: 'built', file: 'pages/MerchantDashboard.jsx', priority: 'critical' },
    PartnerPortal:        { domain: 'B2B', status: 'built', file: 'pages/PartnerPortal.jsx', priority: 'critical' },
    PartnerProgram:       { domain: 'B2B', status: 'built', file: 'pages/PartnerProgram.jsx', priority: 'high' },
    ForCreators:          { domain: 'B2B', status: 'built', file: 'pages/ForCreators.jsx', priority: 'high' },
    MerchantInventoryPage:{ domain: 'B2B', status: 'built', file: 'pages/MerchantInventoryPage.jsx', priority: 'high' },
    MerchantDomainPage:   { domain: 'B2B', status: 'built', file: 'pages/MerchantDomainPage.jsx', priority: 'medium' },
    PartnerCompliance:    { domain: 'B2B', status: 'built', file: 'pages/PartnerCompliance.jsx', priority: 'medium' },
    BusinessInquiry:      { domain: 'B2B', status: 'built', file: 'pages/BusinessInquiry.jsx', priority: 'medium' },
    CreatorApplication:   { domain: 'B2B', status: 'built', file: 'pages/CreatorApplication.jsx', priority: 'medium' },
    ProviderIntake:       { domain: 'B2B', status: 'built', file: 'pages/ProviderIntake.jsx', priority: 'medium' },
    PharmacyIntake:       { domain: 'B2B', status: 'built', file: 'pages/PharmacyIntake.jsx', priority: 'medium' },
    IntegrationsDashboard:{ domain: 'B2B', status: 'built', file: 'pages/IntegrationsDashboard.jsx', priority: 'low' },

    // RUO Pages
    ResearchProducts:     { domain: 'RUO', status: 'built', file: 'pages/ResearchProducts.jsx', priority: 'critical' },

    // WATER Pages
    WaterHome:            { domain: 'WATER', status: 'built', file: 'pages/WaterHome.jsx', priority: 'critical' },
    WaterProducts:        { domain: 'WATER', status: 'planned', file: 'pages/WaterProducts.jsx', priority: 'medium' },

    // Admin/Dev Only
    AdminDashboard:       { domain: 'ADMIN', status: 'built', file: 'pages/AdminDashboard.jsx', priority: 'critical' },
    GrowthDashboard:      { domain: 'ADMIN', status: 'built', file: 'pages/GrowthDashboard.jsx', priority: 'high' },
    GodModeAds:           { domain: 'ADMIN', status: 'built', file: 'pages/GodModeAds.jsx', priority: 'high' },
    SocialMediaDashboard: { domain: 'ADMIN', status: 'built', file: 'pages/SocialMediaDashboard.jsx', priority: 'high' },
    InboxDashboard:       { domain: 'ADMIN', status: 'built', file: 'pages/InboxDashboard.jsx', priority: 'high' },
    QualiphyIntegration:  { domain: 'ADMIN', status: 'built', file: 'pages/QualiphyIntegration.jsx', priority: 'high' },
    ComplianceDashboard:  { domain: 'ADMIN', status: 'built', file: 'pages/ComplianceDashboard.jsx', priority: 'high' },
    TelephonyDashboard:   { domain: 'ADMIN', status: 'built', file: 'pages/TelephonyDashboard.jsx', priority: 'medium' },
    BrandingAssets:       { domain: 'ADMIN', status: 'built', file: 'pages/BrandingAssets.jsx', priority: 'medium' },
    StrategyIntelligence: { domain: 'ADMIN', status: 'built', file: 'pages/StrategyIntelligence.jsx', priority: 'medium' },
    ProviderDashboard:    { domain: 'ADMIN', status: 'built', file: 'pages/ProviderDashboard.jsx', priority: 'medium' },
  },

  // ── BACKEND FUNCTIONS INVENTORY ──────────────────────────────────────────
  functions: {
    // PureRx Integration (PLANNED)
    syncPureRxProducts:   { domain: 'CROSS', status: 'planned', priority: 'critical', deps: ['PURERX_API_KEY'] },
    submitPureRxOrder:    { domain: 'B2C',   status: 'planned', priority: 'critical', deps: ['PURERX_API_KEY'] },
    pureRxWebhook:        { domain: 'CROSS', status: 'planned', priority: 'critical', deps: ['PURERX_WEBHOOK_SECRET'] },

    // Built & Active
    qualiphySendInvite:   { domain: 'ADMIN', status: 'live', deps: ['QUALIPHY_API_KEY'] },
    qualiphyWebhook:      { domain: 'ADMIN', status: 'live', deps: ['QUALIPHY_API_KEY'] },
    qualiphyGetExams:     { domain: 'ADMIN', status: 'live', deps: ['QUALIPHY_API_KEY'] },
    belugaGetPatient:     { domain: 'B2C',   status: 'live', deps: ['BELUGA_API_KEY', 'BELUGA_PARTNER_ID'] },
    belugaSubmitVisit:    { domain: 'B2C',   status: 'live', deps: ['BELUGA_API_KEY', 'BELUGA_PARTNER_ID'] },
    belugaSyncStatus:     { domain: 'ADMIN', status: 'live', deps: ['BELUGA_API_KEY', 'BELUGA_PARTNER_ID'] },
    stripeWebhook:        { domain: 'CROSS', status: 'live', deps: ['STRIPE_WEBHOOK_SECRET'] },
    createCheckout:       { domain: 'B2C',   status: 'live', deps: ['STRIPE_SECRET_KEY'] },
    merchantOnboardingWorkflow: { domain: 'B2B', status: 'live', deps: ['STRIPE_SECRET_KEY', 'ADMIN_EMAIL'] },
    syncToHubspot:        { domain: 'B2B',   status: 'live', deps: ['hubspot_connector'] },
    fetchInboxEmails:     { domain: 'ADMIN', status: 'live', deps: ['gmail_connector'] },
    setupDriveFolders:    { domain: 'ADMIN', status: 'live', deps: ['googledrive_connector'] },
    syncGoogleCalendar:   { domain: 'B2C',   status: 'live', deps: ['googlecalendar_connector'] },
    autoSEOPost:          { domain: 'ADMIN', status: 'live', deps: ['instagram_connector'] },
    masterAnalytics:      { domain: 'ADMIN', status: 'live', deps: [] },
  },

  // ── ENTITIES INVENTORY ───────────────────────────────────────────────────
  entities: {
    // B2C Entities
    CustomerIntake:       { domain: 'B2C',   status: 'live' },
    Appointment:          { domain: 'B2C',   status: 'live' },
    Prescription:         { domain: 'B2C',   status: 'live' },
    ConsultationSummary:  { domain: 'B2C',   status: 'live' },
    Message:              { domain: 'B2C',   status: 'live' },
    AutoRxPlan:           { domain: 'B2C',   status: 'live' },
    BelugaVisitLog:       { domain: 'B2C',   status: 'live' },
    BelugaVisitType:      { domain: 'B2C',   status: 'live' },
    BrowsingHistory:      { domain: 'B2C',   status: 'live' },
    ChatLog:              { domain: 'B2C',   status: 'live' },

    // B2B Entities
    Partner:              { domain: 'B2B',   status: 'live' },
    MerchantModule:       { domain: 'B2B',   status: 'live' },
    MerchantInventory:    { domain: 'B2B',   status: 'live' },
    MerchantDomain:       { domain: 'B2B',   status: 'live' },
    MerchantOrder:        { domain: 'B2B',   status: 'live' },
    PartnerReferral:      { domain: 'B2B',   status: 'live' },
    BusinessInquiry:      { domain: 'B2B',   status: 'live' },
    CreatorApplication:   { domain: 'B2B',   status: 'live' },
    CreatorMetrics:       { domain: 'B2B',   status: 'live' },
    PartnershipOutreach:  { domain: 'B2B',   status: 'live' },
    ConsultationBooking:  { domain: 'B2B',   status: 'live' },
    ConsultationPayment:  { domain: 'B2B',   status: 'live' },

    // Cross-Domain Entities
    Provider:             { domain: 'CROSS', status: 'live' },
    ProviderIntake:       { domain: 'CROSS', status: 'live' },
    ProviderContract:     { domain: 'CROSS', status: 'live' },
    ProviderSchedule:     { domain: 'CROSS', status: 'live' },
    ProviderRate:         { domain: 'CROSS', status: 'live' },
    PharmacyIntake:       { domain: 'CROSS', status: 'live' },
    PharmacyContract:     { domain: 'CROSS', status: 'live' },
    Product:              { domain: 'CROSS', status: 'live' },
    Order:                { domain: 'CROSS', status: 'live' },
    ContactRequest:       { domain: 'CROSS', status: 'live' },

    // Admin / Compliance Entities
    ComplianceRecord:     { domain: 'ADMIN', status: 'live' },
    ComplianceMessage:    { domain: 'ADMIN', status: 'live' },
    Analytics:            { domain: 'ADMIN', status: 'live' },
    SocialPost:           { domain: 'ADMIN', status: 'live' },
    SyncState:            { domain: 'ADMIN', status: 'live' },
    DriveFolder:          { domain: 'ADMIN', status: 'live' },
    ProviderConsultation: { domain: 'ADMIN', status: 'live' },
  },

  // ── AGENTS INVENTORY ─────────────────────────────────────────────────────
  agents: {
    patient_support:       { domain: 'B2C',   status: 'built', file: 'agents/patient_support.json' },
    merchant_success:      { domain: 'B2B',   status: 'built', file: 'agents/merchant_success.json' },
    compliance_advisor:    { domain: 'ADMIN', status: 'built', file: 'agents/compliance_advisor.json' },
    partnership_outreach:  { domain: 'B2B',   status: 'built', file: 'agents/partnership_outreach.json' },
    // Deployed agents
    ruo_research_assistant:{ domain: 'RUO',   status: 'built', file: 'agents/ruo_research_assistant.json' },
    water_wellness_guide:  { domain: 'WATER', status: 'built', file: 'agents/water_wellness_guide.json' },
  },

  // ── INTEGRATIONS / CONNECTORS ────────────────────────────────────────────
  integrations: {
    stripe:          { status: 'live_mode',  secrets: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY'] },
    qualiphy:        { status: 'live',       secrets: ['QUALIPHY_API_KEY'] },
    zoho:            { status: 'live',       secrets: ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN'] },
    twilio:          { status: 'live',       secrets: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'] },
    hubspot:         { status: 'connected',  connector: 'hubspot' },
    gmail:           { status: 'connected',  connector: 'gmail' },
    googledrive:     { status: 'connected',  connector: 'googledrive' },
    googlecalendar:  { status: 'connected',  connector: 'googlecalendar' },
    instagram:       { status: 'connected',  connector: 'instagram' },
    beluga:          { status: 'whitelabel_mode', secrets: ['BELUGA_API_KEY', 'BELUGA_PARTNER_ID'] },
    purerx:          { status: 'pending',    secrets: ['PURERX_API_KEY', 'PURERX_SECRET'] },
    ctm:             { status: 'webhook_configured', notes: 'Call Tracking Metrics' },
  },

  // ── PENDING ACTION ITEMS ─────────────────────────────────────────────────
  action_items: [
    { priority: 1, item: 'GoDaddy DNS: Point medrevolve.com, medrevolveb2b.com, medrevolveruo.com, medrevolvewater.com CNAME/A records to Base44 published app URL' },
    { priority: 2, item: 'Submit medrevolve.com for LegitScript certification (required before GLP-1 Google/Meta ads)' },
    { priority: 3, item: 'Obtain PURERX_API_KEY + PURERX_SECRET from Karthik at purerx.org — needed to activate syncPureRxProducts, submitPureRxOrder, pureRxWebhook functions' },
    { priority: 4, item: 'Set BELUGA_API_KEY and BELUGA_PARTNER_ID when Beluga telehealth account is provisioned' },
    { priority: 5, item: 'Build WaterProducts page for medrevolvewater.com e-commerce catalog' },
    { priority: 6, item: 'Set Facebook Pixel ID in index.html for Meta ad tracking' },
    { priority: 7, item: 'Submit XML sitemap to Google Search Console for each domain after DNS confirmed' },
    { priority: 8, item: 'Set CTM (Call Tracking Metrics) phone numbers per domain for call attribution' },
    { priority: 9, item: 'Confirm Stripe consultation prices with medical team — current: $199 consult, $399/mo subscription, $2,999/mo B2B' },
    { priority: 10, item: 'Add Google Tag Manager container IDs per domain for conversion tracking' },
  ],
};

export default SNAPSHOT;