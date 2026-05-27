/**
 * MedRevolve Domain Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * SNAPSHOT VERSION: 2026-05-27 (PILOT DEPLOYMENT)
 * 
 * THREE ACTIVE DOMAINS:
 *   medrevolve.com          → B2C GLP-1 Telehealth Consumer Platform
 *   medrevolveb2b.com       → B2B White-Label Merchant Platform
 *   medrevolvewater.com     → Bacteriostatic Water (Wholesale & Retail)
 *   [current/dev]           → Full platform (admin + all portals)
 * 
 * NOTE: medrevolveruo.com (RUO) has been REMOVED from pilot deployment.
 * RUO domain will be re-enabled in a future release after LegitScript cert.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DOMAINS = {
  B2C:    'medrevolve.com',
  B2B:    'medrevolveb2b.com',
  WATER:  'medrevolvewater.com',
  ADMIN:  'admin.medrevolve.com',
};

// Detect which domain context we are running on
export function detectDomain() {
  const hostname = window.location.hostname.toLowerCase();
  // Order matters — most specific first, use exact domain matching to prevent false positives
  if (hostname === 'admin.medrevolve.com')                                    return 'ADMIN';
  if (hostname === 'medrevolvewater.com'|| hostname === 'www.medrevolvewater.com') return 'WATER';
  if (hostname === 'medrevolveb2b.com'  || hostname === 'www.medrevolveb2b.com')   return 'B2B';
  if (hostname === 'medrevolve.com'     || hostname === 'www.medrevolve.com')      return 'B2C';
  return 'DEV'; // localhost / base44 preview — full admin access
}

// Brand configurations per domain
export const BRAND = {
  B2C: {
    name: 'MedRevolve',
    tagline: 'Your Telehealth Platform',
    primaryColor: '#4A6741',
    secondaryColor: '#8FB88F',
    bgDark: '#080808',
    bgLight: '#FDFBF7',
    logoText: 'MR',
    accentColor: '#A8C99B',
    targetAudience: 'consumer',
    compliance: ['HIPAA', 'LegitScript', 'Telehealth'],
  },
  B2B: {
    name: 'MedRevolve B2B',
    tagline: 'Launch Your Wellness Empire',
    primaryColor: '#2D6A9F',
    secondaryColor: '#A8C99B',
    bgDark: '#0F1A0F',
    bgLight: '#F5F9FF',
    logoText: 'MR',
    accentColor: '#6BB5D6',
    targetAudience: 'merchant',
    compliance: ['B2B', 'WhiteLabel', 'PEPMD'],
  },
  WATER: {
    name: 'MedRevolve Water',
    tagline: 'Bacteriostatic Water — USP Grade',
    primaryColor: '#1E6EBF',
    secondaryColor: '#4AB8D6',
    bgDark: '#040C14',
    bgLight: '#F0F7FF',
    logoText: 'MW',
    accentColor: '#60B8D6',
    targetAudience: 'both',
    compliance: ['ResearchUseOnly', 'USP', 'FDA-Registered'],
  },
  DEV: {
    name: 'MedRevolve [DEV]',
    tagline: 'Full Platform — Development',
    primaryColor: '#4A6741',
    secondaryColor: '#8FB88F',
    bgDark: '#080808',
    bgLight: '#FDFBF7',
    logoText: 'MR',
    accentColor: '#A8C99B',
    targetAudience: 'admin',
    compliance: ['ALL'],
  },
};

// Page-to-domain mapping — defines which pages belong to which domain
export const PAGE_DOMAIN_MAP = {
  // ── B2C: medrevolve.com ──────────────────────────────────────────────────
  'Home':                 ['B2C', 'DEV'],
  'TelehealthPlatform':   ['B2C', 'DEV'],
  'BookAppointment':      ['B2C', 'DEV'],
  'PatientPortal':        ['B2C', 'DEV'],
  'Products':             ['B2C', 'DEV'],
  'ProductDetail':        ['B2C', 'DEV'],
  'HowItWorks':           ['B2C', 'DEV'],
  'MyAppointments':       ['B2C', 'DEV'],
  'Messages':             ['B2C', 'DEV'],
  'ProviderProfile':      ['B2C', 'DEV'],
  'CustomerIntake':       ['B2C', 'DEV'],
  'Questionnaire':        ['B2C', 'DEV'],
  'Cart':                 ['B2C', 'DEV'],
  'Checkout':             ['B2C', 'DEV'],
  'OrderSuccess':         ['B2C', 'DEV'],
  'QualiphyConsult':      ['B2C', 'DEV'],
  'VideoCall':            ['B2C', 'DEV'],
  'WaitingRoom':          ['B2C', 'DEV'],
  'PatientOnboarding':    ['B2C', 'DEV'],
  'AccountSettings':      ['B2C', 'DEV'],
  'Contact':              ['B2C', 'B2B', 'DEV'],
  'Privacy':              ['B2C', 'B2B', 'WATER', 'DEV'],
  'Terms':                ['B2C', 'B2B', 'WATER', 'DEV'],
  'HIPAANotice':          ['B2C', 'DEV'],
  'TelehealthConsent':    ['B2C', 'DEV'],
  'MedicalDisclaimer':    ['B2C', 'DEV'],
  'CookiePolicy':         ['B2C', 'B2B', 'WATER', 'DEV'],

  // ── B2B: medrevolveb2b.com ───────────────────────────────────────────────
  // B2B pages: NOT accessible from medrevolve.com (B2C certified site)
  // to prevent LegitScript from seeing B2B merchant recruitment on the cert domain.
  'ForBusiness':          ['B2B', 'DEV'],
  'MerchantOnboarding':   ['B2B', 'DEV'],
  'MerchantDashboard':    ['B2B', 'DEV'],
  'MerchantInventoryPage':['B2B', 'DEV'],
  'MerchantDomainPage':   ['B2B', 'DEV'],
  'MerchantDemo':         ['B2B', 'DEV'],
  'PartnerProgram':       ['B2B', 'DEV'],
  'PartnerPortal':        ['B2B', 'DEV'],
  'PartnerCompliance':    ['B2B', 'DEV'],
  'PartnerSignup':        ['B2B', 'DEV'],
  'ForCreators':          ['B2B', 'DEV'],
  'CreatorApplication':   ['B2B', 'DEV'],
  'ProviderIntake':       ['B2B', 'B2C', 'DEV'],
  'PharmacyIntake':       ['B2B', 'DEV'],
  'PharmacyContracts':    ['B2B', 'DEV'],
  'ProviderContracts':    ['B2B', 'DEV'],
  'BusinessInquiry':      ['B2B', 'DEV'],
  'IntegrationsDashboard':['B2B', 'DEV'],
  'MDIntegrationsDashboard':['B2B', 'DEV'],
  'Platform':             ['B2B', 'B2C', 'DEV'],
  'Programs':             ['B2B', 'B2C', 'DEV'],

  // ── RUO: medrevolveruo.com ───────────────────────────────────────────────
  // RUO domain REMOVED from pilot. Page accessible in DEV only.
  'ResearchProducts':     ['DEV'],

  // ── WATER: medrevolvewater.com ───────────────────────────────────────────
  // (Future pages to be created)

  // ── ADMIN / DEV only ────────────────────────────────────────────────────
  'AdminDashboard':       ['DEV'],
  'GrowthDashboard':      ['DEV'],
  'GodModeAds':           ['DEV'],
  'SocialMediaDashboard': ['DEV'],
  'InboxDashboard':       ['DEV'],
  'QualiphyIntegration':  ['DEV'],
  'BelugaIntegration':    ['DEV'],
  'ComplianceDashboard':  ['DEV'],
  'PartnershipHub':       ['DEV'],
  'PaymentsDashboard':    ['DEV'],
  'TelephonyDashboard':   ['DEV'],
  'GrowthDashboard':      ['DEV'],
  'BrandingAssets':       ['DEV'],
  'CompetitorIntelligence':['DEV'],
  'EmailSignature':       ['DEV'],
  'EmailAudit':           ['DEV'],
  'StrategyIntelligence': ['DEV'],
  'ProviderDashboard':    ['DEV'],
  'ProviderOutreach':     ['DEV'],
  'ProviderOnboarding':   ['DEV'],
  'Consultations':        ['DEV'],
  'AutoRxFollowup':       ['DEV'],
  'VisitTypeSelector':    ['DEV'],
};

// Backend functions by domain responsibility
export const FUNCTION_DOMAIN_MAP = {
  // ── B2C Functions ────────────────────────────────────────────────────────
  B2C: [
    'bookConsultation',
    'createConsultationCheckout',
    'processConsultationPayment',
    'getProviderAvailability',
    'scheduleProviderConsultation',
    'completeConsultation',
    'notifyAppointmentBooked',
    'sendAppointmentReminder',
    'initializeTwilioVideoSession',
    'initializeCommunicationSession',
    'submitQuestionnaire',
    'submitCustomerIntake',
    'submitPrescriptionToPharmacy',
    'createOrder',
    'getAIRecommendations',
    'getPersonalizedRecommendations',
    'getAIProductMatch',
    'trackProductView',
    'belugaGetPatient',
    'belugaSubmitVisit',
    'createCheckout',
  ],
  // ── B2B Functions ────────────────────────────────────────────────────────
  B2B: [
    'merchantOnboardingWorkflow',
    'notifyOnboardingComplete',
    'notifyNewSignup',
    'submitBusinessInquiry',
    'submitProviderIntake',
    'submitPharmacyIntake',
    'submitCreatorApplication',
    'processCreatorCommission',
    'processPartnerReferral',
    'analyzePartnerWebsite',
    'verifyPartnerCompliance',
    'generatePartnershipDoc',
    'syncBusinessToZoho',
    'syncCreatorToZoho',
    'syncToHubspot',
    'syncToZohoCRM',
    'triggerCRMCampaign',
    'sendPartnershipEmail',
    'sendProviderOutreach',
    'workflowNotifications',
    'triggerActionPlan',
    'triggerAutoRxBilling',
    'sendAutoRxFollowupReminders',
    'submitAutoRxFollowup',
  ],
  // ── ADMIN / Cross-Domain Functions ───────────────────────────────────────
  ADMIN: [
    'qualiphyGetExams',
    'qualiphySendInvite',
    'qualiphyWebhook',
    'belugaSyncStatus',
    'masterAnalytics',
    'getAnalytics',
    'getSocialAnalytics',
    'godModeAdCampaign',
    'autoSEOPost',
    'generateAndPostAIContent',
    'autoPostUGCContent',
    'bulkPostToSocial',
    'createSocialPost',
    'generateSocialMediaContent',
    'fetchInboxEmails',
    'classifyAndLabelEmail',
    'bulkClassifyInbox',
    'setupEmailAliases',
    'setupGmailLabels',
    'sendGmailNotification',
    'setupDriveFolders',
    'driveUploadIntakeForm',
    'syncGoogleCalendar',
    'checkInstagramConnection',
    'ctmWebhook',
    'ctmLeadWorkflow',
    'submitContactRequest',
    'sendSMS',
    'checkTwilioStatus',
    'testAllSMS',
    'stripeWebhook',
    'getStripePublishableKey',
    'generateComplianceDoc',
    'updateComplianceCheck',
    'uploadComplianceDocument',
    'verifyCompliance',
    'generateInvoice',
    'assignToProvider',
    'mdIntegrations',
    'logError',
    'trackEvent',
    'sendActivityNotification',
    'zohoAuth',
    'zohoGetRefreshToken',
    'getZohoClientId',
    'testChat',
    'testEmail',
    'testZapierWebhook',
  ],
};

// Navigation menus per domain
export const NAV_CONFIG = {
  B2C: [
    { label: 'How It Works', path: '/HowItWorks' },
    { label: 'Telehealth', path: '/TelehealthPlatform' },
    { label: 'Products', path: '/Products' },
    { label: 'Book Consultation', path: '/BookAppointment' },
  ],
  B2B: [
    { label: 'Platform', path: '/ForBusiness' },
    { label: 'Partner Program', path: '/PartnerProgram' },
    { label: 'Creator Program', path: '/ForCreators' },
    { label: 'Pricing', path: '/MerchantOnboarding' },
    { label: 'Talk to Sales', path: '/Contact' },
  ],
  // WATER nav: no cross-links to B2C telehealth pages, contact via email only
  WATER: [
    { label: 'Vial Products', path: '/WaterHome#products' },
    { label: 'Bulk & Wholesale', path: '/WaterHome#bulk' },
  ],
};

export default { DOMAINS, detectDomain, BRAND, PAGE_DOMAIN_MAP, FUNCTION_DOMAIN_MAP, NAV_CONFIG };

// DEPLOYMENT CHECKLIST — 3 Active Domains (Pilot)
// ─────────────────────────────────────────────────────────────────────────────
// medrevolve.com    → B2C  → consumer telehealth, GLP-1, hormone, wellness
// medrevolveb2b.com → B2B  → merchant platform, white-label, onboarding
// medrevolvewater.com → WATER → bacteriostatic water, wholesale, compounding
// RUO (medrevolveruo.com) → DISABLED pending LegitScript cert phase 2
// ─────────────────────────────────────────────────────────────────────────────