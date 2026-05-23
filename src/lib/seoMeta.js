/**
 * SEO Meta injection utility — sets document title, meta description,
 * Open Graph, and canonical URL per page/domain at runtime.
 */

const META_MAP = {
  // B2C Pages
  '/': {
    title: 'MedRevolve — GLP-1 Telehealth & Weight Loss Platform',
    description: 'Access physician-supervised GLP-1 programs, hormone therapy, and personalized telehealth — all from home. Licensed providers, compliant pharmacy.',
    og_image: 'https://medrevolve.com/og-home.jpg',
  },
  '/TelehealthPlatform': {
    title: 'Telehealth Platform | MedRevolve',
    description: 'Book a telehealth consultation with a licensed provider. GLP-1, hormones, peptides, and more — compliant, fast, and affordable.',
  },
  '/BookAppointment': {
    title: 'Book a Telehealth Appointment | MedRevolve',
    description: 'Schedule your telehealth consultation in minutes. Choose from GLP-1, hormone therapy, and more.',
  },
  '/Products': {
    title: 'Products | MedRevolve',
    description: 'Browse physician-prescribed GLP-1 medications, hormone therapies, and wellness products.',
  },
  '/HowItWorks': {
    title: 'How It Works | MedRevolve',
    description: 'See how MedRevolve connects you with licensed providers, pharmacy fulfillment, and ongoing care.',
  },
  // B2B Pages
  '/ForBusiness': {
    title: 'White-Label Telehealth Platform for Wellness Merchants | MedRevolve B2B',
    description: 'Launch your own GLP-1, RUO, or supplement brand in days. Full platform: website, telehealth, pharmacy, compliance, and payments.',
  },
  '/MerchantOnboarding': {
    title: 'Start Your Wellness Platform | MedRevolve B2B',
    description: 'Onboard as a merchant and launch a fully compliant telehealth, GLP-1, or wellness brand under your own name.',
  },
  '/PartnerProgram': {
    title: 'Partner Program | MedRevolve B2B',
    description: 'Refer clients and earn recurring commissions. Join the MedRevolve partner network.',
  },
  '/ForCreators': {
    title: 'Creator Affiliate Program | MedRevolve',
    description: 'Earn commissions by promoting MedRevolve wellness products. Unique links, real-time analytics, auto payouts.',
  },
  // RUO Page
  '/ResearchProducts': {
    title: 'Research Compound Catalog | MedRevolve Research (RUO)',
    description: 'HPLC-certified peptides and research compounds for licensed institutions. COA provided. For research use only.',
  },
  // WATER Page
  '/WaterHome': {
    title: 'Pure Wellness Hydration Products | MedRevolve Wellness',
    description: 'Premium water enhancement and hydration products. Clean formulas, third-party tested, science-backed.',
  },
  // Compliance
  '/Privacy': { title: 'Privacy Policy | MedRevolve', description: 'MedRevolve privacy policy and HIPAA data practices.' },
  '/Terms':   { title: 'Terms of Service | MedRevolve', description: 'MedRevolve terms of service and user agreement.' },
  '/HIPAANotice': { title: 'HIPAA Notice of Privacy Practices | MedRevolve', description: 'Your rights under HIPAA and how MedRevolve uses protected health information.' },
  '/Contact': { title: 'Contact Us | MedRevolve', description: 'Reach the MedRevolve team for support, partnerships, or provider inquiries.' },
};

export function injectSEO(pathname, overrides = {}) {
  const meta = { ...META_MAP[pathname], ...overrides };
  if (!meta) return;

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
  setMeta('og:title', meta.title, 'property');
  setMeta('og:description', meta.description, 'property');
  if (meta.og_image) setMeta('og:image', meta.og_image, 'property');
  setMeta('og:url', window.location.href, 'property');

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', window.location.href);
}

export default { injectSEO, META_MAP };