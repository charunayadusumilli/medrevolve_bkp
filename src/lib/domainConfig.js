/**
 * MedRevolve Domain Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTIVE DOMAINS (Unified Telehealth Platform):
 *   medrevolve.com          → Primary telehealth platform
 *   medrevolveb2b.com       → Same platform — alternate entry point
 *   [current/dev]           → Full platform (admin + all portals)
 *
 * All other domains (WATER, RUO) are masked/disabled.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DOMAINS = {
  B2C:   'medrevolve.com',
  B2B:   'medrevolveb2b.com',
  ADMIN: 'admin.medrevolve.com',
};

// Detect which domain context we are running on
export function detectDomain() {
  const hostname = window.location.hostname.toLowerCase();
  if (hostname === 'admin.medrevolve.com')                                  return 'ADMIN';
  if (hostname === 'medrevolveb2b.com' || hostname === 'www.medrevolveb2b.com') return 'B2C'; // Same site
  if (hostname === 'medrevolve.com'    || hostname === 'www.medrevolve.com')    return 'B2C';
  return 'DEV'; // localhost / base44 preview — full admin access
}

// Brand configurations — unified across both domains
export const BRAND = {
  B2C: {
    name: 'MedRevolve',
    tagline: 'Physician-Supervised Telehealth',
    primaryColor: '#4A6741',
    secondaryColor: '#8FB88F',
    bgDark: '#080808',
    bgLight: '#FDFBF7',
    logoText: 'MR',
    accentColor: '#A8C99B',
    targetAudience: 'all',
    compliance: ['HIPAA', 'LegitScript', 'Telehealth'],
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

// Page-to-domain mapping
export const PAGE_DOMAIN_MAP = {
  // ── Unified Platform (B2C + DEV) ─────────────────────────────────────────
  'Home':                 ['B2C', 'DEV'],
  'TelehealthPlatform':   ['B2C', 'DEV'],
  'BookAppointment':      ['B2C', 'DEV'],
  'PatientPortal':        ['B2C', 'DEV'],
  'HowItWorks':           ['B2C', 'DEV'],
  'MyAppointments':       ['B2C', 'DEV'],
  'Messages':             ['B2C', 'DEV'],
  'ProviderProfile':      ['B2C', 'DEV'],
  'CustomerIntake':       ['B2C', 'DEV'],
  'Questionnaire':        ['B2C', 'DEV'],
  'Checkout':             ['B2C', 'DEV'],
  'OrderSuccess':         ['B2C', 'DEV'],
  'QualiphyConsult':      ['B2C', 'DEV'],
  'VideoCall':            ['B2C', 'DEV'],
  'WaitingRoom':          ['B2C', 'DEV'],
  'PatientOnboarding':    ['B2C', 'DEV'],
  'AccountSettings':      ['B2C', 'DEV'],
  'Contact':              ['B2C', 'DEV'],
  'ForBusiness':          ['B2C', 'DEV'],
  'MerchantOnboarding':   ['B2C', 'DEV'],
  'MerchantDashboard':    ['B2C', 'DEV'],
  'MerchantInventoryPage':['B2C', 'DEV'],
  'MerchantDomainPage':   ['B2C', 'DEV'],
  'MerchantDemo':         ['B2C', 'DEV'],
  'PartnerProgram':       ['B2C', 'DEV'],
  'PartnerPortal':        ['B2C', 'DEV'],
  'PartnerCompliance':    ['B2C', 'DEV'],
  'PartnerSignup':        ['B2C', 'DEV'],
  'ForCreators':          ['B2C', 'DEV'],
  'CreatorApplication':   ['B2C', 'DEV'],
  'ProviderIntake':       ['B2C', 'DEV'],
  'PharmacyIntake':       ['B2C', 'DEV'],
  'PharmacyContracts':    ['B2C', 'DEV'],
  'ProviderContracts':    ['B2C', 'DEV'],
  'BusinessInquiry':      ['B2C', 'DEV'],
  'IntegrationsDashboard':['B2C', 'DEV'],
  'MDIntegrationsDashboard':['B2C', 'DEV'],
  'Platform':             ['B2C', 'DEV'],
  'Programs':             ['B2C', 'DEV'],

  // ── Legal (all) ──────────────────────────────────────────────────────────
  'Privacy':              ['B2C', 'DEV'],
  'Terms':                ['B2C', 'DEV'],
  'HIPAANotice':          ['B2C', 'DEV'],
  'TelehealthConsent':    ['B2C', 'DEV'],
  'MedicalDisclaimer':    ['B2C', 'DEV'],
  'CookiePolicy':         ['B2C', 'DEV'],

  // ── Masked / disabled ────────────────────────────────────────────────────
  'ResearchProducts':     ['DEV'],
  'WaterHome':            ['DEV'],
  'Products':             ['DEV'],
  'Cart':                 ['DEV'],
  'ProductDetail':        ['DEV'],

  // ── Admin / DEV only ─────────────────────────────────────────────────────
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

// Navigation — unified for both medrevolve.com and medrevolveb2b.com
export const NAV_CONFIG = {
  B2C: [
    { label: 'How It Works',    path: '/HowItWorks' },
    { label: 'Telehealth',      path: '/TelehealthPlatform' },
    { label: 'For Business',    path: '/ForBusiness' },
    { label: 'Book Consultation', path: '/BookAppointment' },
  ],
  DEV: [
    { label: 'How It Works',    path: '/HowItWorks' },
    { label: 'Telehealth',      path: '/TelehealthPlatform' },
    { label: 'For Business',    path: '/ForBusiness' },
    { label: 'Book Consultation', path: '/BookAppointment' },
  ],
};

// Backend functions by domain responsibility
export const FUNCTION_DOMAIN_MAP = {
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

export default { DOMAINS, detectDomain, BRAND, PAGE_DOMAIN_MAP, FUNCTION_DOMAIN_MAP, NAV_CONFIG };