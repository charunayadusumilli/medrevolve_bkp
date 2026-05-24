/**
 * MedRevolve Domain Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * SNAPSHOT VERSION: 2026-05-22
 * 
 * This is the single source of truth for all domain routing, branding,
 * and page categorization across the MedRevolve ecosystem.
 * 
 * DOMAINS:
 *   medrevolve.com          → B2C GLP-1 Telehealth Consumer Platform
 *   medrevolveb2b.com       → B2B White-Label Merchant Platform
 *   medrevolveruo.com       → Research Use Only (RUO) Compound Catalog
 *   medrevolvewater.com     → Consumer Wellness & Water Products
 *   [current/dev]           → Full platform (admin + all portals)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DOMAINS = {
  B2C:    'medrevolve.com',
  B2B:    'medrevolveb2b.com',
  RUO:    'medrevolveruo.com',
  WATER:  'medrevolvewater.com',
  ADMIN:  'admin.medrevolve.com',
};

// Detect which domain context we are running on
export function detectDomain() {
  const hostname = window.location.hostname.toLowerCase();
  // Order matters — check most-specific subdomains first
  if (hostname.includes('admin.medrevolve'))  return 'ADMIN';
  if (hostname.includes('medrevolveruo'))     return 'RUO';
  if (hostname.includes('medrevolvewater'))   return 'WATER';
  if (hostname.includes('medrevolveb2b'))     return 'B2B';
  // Only exact medrevolve.com (or www.) — never preview/base44 hosts
  if (hostname === 'medrevolve.com' || hostname === 'www.medrevolve.com') return 'B2C';
  return 'DEV'; // localhost / base44 preview
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
  RUO: {
    name: 'MedRevolve Research',
    tagline: 'Research Compound Catalog',
    primaryColor: '#7B5EA7',
    secondaryColor: '#4A6741',
    bgDark: '#080808',
    bgLight: '#F8F6FF',
    logoText: 'MR',
    accentColor: '#B89FD8',
    targetAudience: 'researcher',
    compliance: ['RUO', 'FDA-Disclaimer', 'AgeGated'],
  },
  WATER: {
    name: 'MedRevolve Wellness',
    tagline: 'Pure Wellness Products',
    primaryColor: '#2D9FBF',
    secondaryColor: '#A8D4E5',
    bgDark: '#060F1A',
    bgLight: '#F5FBFF',
    logoText: 'MW',
    accentColor: '#7BC8D6',
    targetAudience: 'consumer',
    compliance: ['StandardEcommerce'],
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
  'Privacy':              ['B2C', 'B2B', 'RUO', 'WATER', 'DEV'],
  'Terms':                ['B2C', 'B2B', 'RUO', 'WATER', 'DEV'],
  'HIPAANotice':          ['B2C', 'DEV'],
  'TelehealthConsent':    ['B2C', 'DEV'],
  'MedicalDisclaimer':    ['B2C', 'DEV'],
  'CookiePolicy':         ['B2C', 'B2B', 'RUO', 'WATER', 'DEV'],

  // ── B2B: medrevolveb2b.com ───────────────────────────────────────────────
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
  'ResearchProducts':     ['RUO', 'DEV'],

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
  // ── RUO Functions ────────────────────────────────────────────────────────
  RUO: [
    'generateProductContent',
    'generateProductVisual',
    'generatePharmaceuticalImage',
    'generateInvoice',
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
  RUO: [
    { label: 'Research Catalog', path: '/ResearchProducts' },
    { label: 'About RUO', path: '/ResearchAbout' },
    { label: 'Contact', path: '/Contact' },
  ],
  WATER: [
    { label: 'Products', path: '/WaterProducts' },
    { label: 'About', path: '/WaterAbout' },
    { label: 'Contact', path: '/Contact' },
  ],
};

export default { DOMAINS, detectDomain, BRAND, PAGE_DOMAIN_MAP, FUNCTION_DOMAIN_MAP, NAV_CONFIG };