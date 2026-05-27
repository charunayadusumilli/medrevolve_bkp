/**
 * SEO Meta injection utility — sets document title, meta description,
 * Open Graph, canonical URL, and robots directives per page/domain at runtime.
 *
 * Domain separation rules (LegitScript / payment processor compliance):
 *  - medrevolve.com   → patient-facing telehealth keywords only
 *  - medrevolveb2b.com → B2B platform, clinics, licensed merchants only
 *  - medrevolvewater.com → bacteriostatic water, pharmaceutical/lab context
 *  NOTE: medrevolveruo.com (RUO) removed from pilot deployment.
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
  '/Products': {
    title: 'Physician-Prescribed Medications | MedRevolve',
    description: 'Browse FDA-approved and physician-prescribed GLP-1 medications, hormone therapies, and wellness treatments. Prescription required for all Rx products.',
    keywords: 'GLP-1 medication, semaglutide, tirzepatide, hormone therapy, prescription medication, licensed pharmacy',
    canonical: 'https://medrevolve.com/Products',
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
    title: 'White-Label Telehealth Infrastructure for Clinics & Med Spas | MedRevolve B2B',
    description: 'Launch your licensed telehealth platform for clinics, med spas, and healthcare practices. Full infrastructure: physician network, licensed 503A pharmacy, compliance, and payments.',
    keywords: 'white label telehealth, telehealth for clinics, med spa platform, GLP-1 clinic, licensed telehealth infrastructure',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
    canonical: 'https://medrevolveb2b.com/ForBusiness',
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

  // ── WATER: medrevolvewater.com ─────────────────────────────────────────────
  '/WaterHome': {
    title: 'Bacteriostatic Water Vials — 5mL, 10mL, 30mL | MedRevolve Water',
    description: 'Pharmaceutical-grade bacteriostatic water in 5mL, 10mL, and 30mL sterile flip-top vials. USP-grade, endotoxin tested, COA included. For research, compounding, and licensed facility use.',
    keywords: 'bacteriostatic water, USP grade water, sterile vials, compounding water, research reagent, pharmaceutical water',
    og_image: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png',
    canonical: 'https://medrevolvewater.com/',
    robots: 'index, follow',
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
  WATER: {
    site_name: 'MedRevolve Water',
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

  // Robots directive (noindex RUO during cert process)
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