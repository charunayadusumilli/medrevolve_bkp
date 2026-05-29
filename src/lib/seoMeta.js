/**
 * SEO Meta injection utility — sets document title, meta description,
 * Open Graph, canonical URL, and robots directives per page/domain at runtime.
 *
 * Domain separation rules (LegitScript / payment processor compliance):
 *  - medrevolve.com       → unified telehealth platform (patient + business services)
 *  - medrevolveb2b.com    → same platform, same content, alternate entry point
 *  NOTE: WATER and RUO domains are masked/disabled in this deployment.
 */

// ── Per-page meta (domain-agnostic, overrideable) ──────────────────────────
const META_MAP = {
  // ── B2C: medrevolve.com ────────────────────────────────────────────────────
  '/': {
    title: 'Licensed Telehealth | FDA-Approved Weight Loss, Hormone & Wellness | MedRevolve',
    description: 'Access physician-supervised GLP-1 programs, hormone therapy, and personalized telehealth — all from home. Licensed providers, licensed 503A pharmacies. All 50 states.',
    keywords: 'telehealth, online doctor, weight loss medication, GLP-1, semaglutide, tirzepatide, TRT, hormone therapy, ED treatment, licensed pharmacy, FDA-approved',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
    canonical: 'https://medrevolve.com/',
  },
  '/TelehealthPlatform': {
    title: 'Licensed Telehealth Platform | MedRevolve',
    description: 'Book a telehealth consultation with a board-certified physician. GLP-1, hormones, and more — all requiring a valid prescription. Compliant, fast, and affordable.',
    keywords: 'telehealth platform, licensed physician, online consultation, GLP-1, prescription medication',
    canonical: 'https://medrevolve.com/TelehealthPlatform',
  },
  '/BookAppointment': {
    title: 'Book a Telehealth Appointment | MedRevolve',
    description: 'Schedule your telehealth consultation with a licensed provider in minutes. Prescription required. GLP-1, hormone therapy, and more.',
    canonical: 'https://medrevolve.com/BookAppointment',
  },

  '/HowItWorks': {
    title: 'How MedRevolve Telehealth Works | MedRevolve',
    description: 'See how MedRevolve connects you with licensed physicians, licensed 503A compounding pharmacies, and ongoing care — all from home.',
    canonical: 'https://medrevolve.com/HowItWorks',
  },
  '/Programs': {
    title: 'Physician-Supervised Programs | MedRevolve',
    description: 'GLP-1 weight management, hormone replacement therapy, and wellness programs — all requiring physician evaluation and valid prescription.',
    canonical: 'https://medrevolve.com/Programs',
  },

  // ── B2B: medrevolveb2b.com ─────────────────────────────────────────────────
  '/ForBusiness': {
    title: 'Launch a Licensed Telehealth Platform | For Clinics, Med Spas & Wellness Practices | MedRevolve',
    description: 'Launch your licensed telehealth platform for clinics, med spas, and healthcare practices. Full infrastructure: physician network, licensed 503A pharmacy, compliance, and payments.',
    keywords: 'white label telehealth, telehealth for clinics, med spa platform, licensed telehealth infrastructure',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
    canonical: 'https://medrevolve.com/ForBusiness',
  },
  '/MerchantOnboarding': {
    title: 'Launch Your Telehealth Platform | MedRevolve B2B',
    description: 'Onboard your clinic or wellness practice and launch a fully compliant telehealth platform under your own brand. Licensed physicians and pharmacies included.',
    canonical: 'https://medrevolveb2b.com/MerchantOnboarding',
  },
  '/PartnerProgram': {
    title: 'Estimated Partner Earnings | Referral Compensation Program | MedRevolve B2B',
    description: 'Refer licensed clinics and wellness practices to MedRevolve\'s telehealth platform. Referral compensation for physician-supervised programs only. See estimated earnings.',
    canonical: 'https://medrevolveb2b.com/PartnerProgram',
  },
  '/ForCreators': {
    title: 'Creator Referral Program | MedRevolve',
    description: 'Earn referral compensation by promoting MedRevolve\'s licensed telehealth programs. Unique tracking links, real-time analytics. For physician-supervised programs only.',
    canonical: 'https://medrevolveb2b.com/ForCreators',
  },
  '/BusinessInquiry': {
    title: 'Business Inquiry | MedRevolve B2B',
    description: 'Submit a business inquiry to learn about MedRevolve\'s white-label telehealth platform for clinics, med spas, and licensed healthcare operators.',
    canonical: 'https://medrevolveb2b.com/BusinessInquiry',
  },

  // ── SEO Landing Pages ─────────────────────────────────────────────────────
  '/for-med-spas': {
    title: 'Add a GLP-1 Weight Loss Program to Your Med Spa in 7 Days | MedRevolve',
    description: 'MedRevolve gives med spas a complete, white-label physician-supervised GLP-1 weight loss program. HIPAA compliant, licensed pharmacy included. Launch in 7 days.',
    keywords: 'med spa weight loss program, telehealth for med spas, add glp-1 to med spa, med spa telehealth platform',
    canonical: 'https://medrevolve.com/for-med-spas',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  '/trt-clinic-platform': {
    title: 'Start a TRT Telehealth Company Without Building the Infrastructure | MedRevolve',
    description: 'Launch a compliant TRT clinic in 7 days. White-label testosterone replacement therapy platform with licensed physicians, 503A pharmacy, and HIPAA compliance included.',
    keywords: 'how to start a TRT company, TRT telehealth platform, testosterone clinic startup, mens health telehealth platform',
    canonical: 'https://medrevolve.com/trt-clinic-platform',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  '/weight-loss-clinic-platform': {
    title: 'Start a Medical Weight Loss Clinic Without Hiring a Doctor | MedRevolve',
    description: 'Launch a medical weight loss clinic in 7 days. GLP-1 programs, licensed physicians, 503A pharmacy, and HIPAA compliance — all included in your white-label platform.',
    keywords: 'start medical weight loss clinic, how to open a weight loss clinic, weight loss clinic startup, glp-1 clinic platform',
    canonical: 'https://medrevolve.com/weight-loss-clinic-platform',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  '/openloop-alternative': {
    title: 'OpenLoop Alternative: MedRevolve Includes More — For Less | MedRevolve',
    description: 'Switching from OpenLoop? MedRevolve is the full-stack telehealth platform alternative with white-label branding, built-in pharmacy, compliance, and payments.',
    keywords: 'openloop alternative, openloop telehealth competitor, telehealth platform alternative',
    canonical: 'https://medrevolve.com/openloop-alternative',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  '/mytelemedicine-alternative': {
    title: 'MyTelemedicine Alternative: Full-Stack Platform for Clinic Owners | MedRevolve',
    description: 'Looking for a MyTelemedicine alternative? MedRevolve is the complete white-label telehealth infrastructure — physicians, pharmacy, compliance, and payments in one platform.',
    keywords: 'mytelemedicine alternative, mytelemedicine competitor, telehealth platform comparison',
    canonical: 'https://medrevolve.com/mytelemedicine-alternative',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  '/telehealth-franchise': {
    title: 'Launch a Telehealth Business Without Buying a Franchise | MedRevolve',
    description: 'Skip the franchise fees. MedRevolve gives you a complete white-label telehealth business — licensed physicians, pharmacy, compliance, and brand — from $2,999/month.',
    keywords: 'telehealth franchise, telehealth business franchise, health clinic franchise alternative',
    canonical: 'https://medrevolve.com/telehealth-franchise',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  '/iv-therapy-clinic-platform': {
    title: 'Add Telehealth to Your IV Therapy Clinic in 7 Days | MedRevolve',
    description: 'IV therapy clinics are adding $20K/month with white-label telehealth programs. GLP-1, hormone therapy, and wellness — all physician-supervised and pharmacy-fulfilled.',
    keywords: 'iv therapy clinic telehealth, add telehealth to iv clinic, iv clinic platform',
    canonical: 'https://medrevolve.com/iv-therapy-clinic-platform',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },

  // ── Shared legal pages ─────────────────────────────────────────────────────
  '/Privacy':       { title: 'Privacy Policy | MedRevolve', description: 'MedRevolve privacy policy and HIPAA data practices.' },
  '/Terms':         { title: 'Terms of Service | MedRevolve', description: 'MedRevolve terms of service and user agreement.' },
  '/HIPAANotice':   { title: 'HIPAA Notice of Privacy Practices | MedRevolve', description: 'Your rights under HIPAA and how MedRevolve uses protected health information.' },
  '/TelehealthConsent': { title: 'Telehealth Informed Consent | MedRevolve', description: 'Review and acknowledge the telehealth informed consent form before your consultation.' },
  '/MedicalDisclaimer': { title: 'Medical Disclaimer | MedRevolve', description: 'Important medical disclaimer for MedRevolve telehealth services.' },
  '/CookiePolicy':  { title: 'Cookie Policy | MedRevolve', description: 'How MedRevolve uses cookies and tracking technologies.' },
  '/Contact':       { title: 'Contact Us | MedRevolve', description: 'Reach the MedRevolve team for patient support, partnerships, or provider inquiries.' },
};

// ── Domain-level meta overrides (applied on top of page meta) ─────────────
const DOMAIN_META = {
  B2C: {
    site_name: 'MedRevolve',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
  B2B: {
    site_name: 'MedRevolve B2B Platform',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
  },
};

export function injectSEO(pathname, overrides = {}, domain = null) {
  const pageMeta = META_MAP[pathname] || {};
  const domainMeta = domain ? (DOMAIN_META[domain] || {}) : {};
  const meta = { ...pageMeta, ...domainMeta, ...overrides };

  if (!meta || Object.keys(meta).length === 0) return;

  if (meta.title) document.title = meta.title;

  const setMeta = (name, content, prop = 'name') => {
    if (!content) return;
    let el = document.querySelector(`meta[${prop}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(prop, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', meta.description);
  if (meta.keywords) setMeta('keywords', meta.keywords);

  // Robots directive
  if (meta.robots) setMeta('robots', meta.robots);

  // Open Graph
  setMeta('og:title', meta.title, 'property');
  setMeta('og:description', meta.description, 'property');
  if (meta.og_image) setMeta('og:image', meta.og_image, 'property');
  if (meta.site_name) setMeta('og:site_name', meta.site_name, 'property');
  setMeta('og:url', window.location.href, 'property');

  // Twitter
  setMeta('twitter:title', meta.title);
  setMeta('twitter:description', meta.description);
  if (meta.og_image) setMeta('twitter:image', meta.og_image);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  // Use provided canonical or current URL
  canonical.setAttribute('href', meta.canonical || window.location.href);
}

export default { injectSEO, META_MAP };