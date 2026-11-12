import { PARTNER_SERVICES, AUDIT_URL } from './offerings';

/** Checkout + booking links reused from the service catalog. */
export const MARKETING_CHECKOUT_URL = 'https://buy.stripe.com/3cIaEX2nc61P6L26kA2ZO03';
export const STRATEGY_CALL_URL = 'https://calendly.com/rned-medrevolve/medrevolve-intro-call';
export const AUDIT_CHECKOUT_URL = AUDIT_URL;

export const MARKETING_META = {
  title: 'Telehealth Marketing Services | Ads, Creative, Social, CRM | MedRevolve',
  description:
    'Paid ads, social, UGC, landing pages and CRM for telehealth and regulated health brands. Built to Meta and Google healthcare policy, run by the team that built the platform.',
  path: '/marketing',
  canonical: 'https://medrevolveb2b.com/marketing',
};

export const HERO_TRUST = [
  'Own platform, payments and pharmacy under one roof',
  '50-state coverage',
  'Weekly reporting in plain English',
  'You own your accounts, domains and data',
];

export const CHANNELS = [
  {
    key: 'ads',
    title: 'Paid ads management',
    body: 'Meta and Instagram, Google Search and YouTube, policy-aware copy and targeting, weekly reporting you can actually read.',
  },
  {
    key: 'creative',
    title: 'Creative, UGC and video',
    body: 'Creator-style video and polished brand spots, scripted for health offers and cut for every placement.',
  },
  {
    key: 'organic',
    title: 'Organic social',
    body: 'Content calendars, graphics, short-form video, account management and comment care.',
  },
  {
    key: 'web',
    title: 'Web design and landing pages',
    body: 'Conversion-focused sites, quiz and intake funnels, campaign landing pages on your own domain, built so you own it.',
  },
  {
    key: 'brand',
    title: 'Brand and identity',
    body: 'Logo and brand guidelines, product and packaging renders, ad and social templates, founder branding.',
  },
  {
    key: 'crm',
    title: 'Lead capture, CRM and follow-up',
    body: 'Email and SMS sequences, abandoned intake recovery, booking and lead routing, monthly campaigns, one pipeline view.',
  },
];

export const WHY_POINTS = [
  {
    n: '1',
    title: 'We run the platform, not just the ads.',
    body: 'Payments, pharmacy routing, intake and refills sit under the same roof, so the funnel does not break at checkout.',
  },
  {
    n: '2',
    title: 'Written to the rules.',
    body: 'Prescription ad policy, LegitScript, HIPAA-safe tracking and claim limits are handled before anything reaches an ad account.',
  },
  {
    n: '3',
    title: 'One team owns the result.',
    body: 'Ads, creative, pages and CRM in one place, with no handoffs between three vendors.',
  },
  {
    n: '4',
    title: 'You keep the assets.',
    body: 'Ad accounts, domains, creative files and your customer data stay yours.',
  },
];

export const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Audit',
    body: 'We review ad accounts, creative, site and funnel, and flag anything a platform could reject.',
  },
  {
    n: '02',
    title: 'Plan',
    body: 'Channels, offers and a creative roadmap matched to your program and to what each platform allows.',
  },
  {
    n: '03',
    title: 'Produce',
    body: 'UGC, video, ad sets and landing pages, built and approved by you before launch.',
  },
  {
    n: '04',
    title: 'Launch and optimize',
    body: 'Campaigns go live, we refine weekly, and you see the numbers in plain English.',
  },
];

export const AUDIENCES = [
  {
    title: 'Launching a telehealth brand',
    body: 'You have the offer and the budget, and need brand, site, intake and ads built in the right order.',
    cta: { label: 'Start with the $500 audit', href: AUDIT_CHECKOUT_URL },
  },
  {
    title: 'Live and needs patients',
    body: 'You are already running and need more volume, better creative and ads that stay approved.',
    cta: { label: 'Book a strategy call', href: STRATEGY_CALL_URL },
  },
  {
    title: 'Clinics and med spas adding cash-pay programs',
    body: 'You are adding self-pay programs to an existing practice and need marketing that respects the license you operate under.',
    cta: { label: 'Talk to the team', to: '/contact' },
  },
];

/** The a-la-carte rows read their names and prices from the service catalog. */
const ALA_CARTE_ITEMS = [
  { slug: 'readiness-audit' },
  { slug: 'custom-development', priceLabel: '$380 per 4-hour block' },
  { slug: 'development-retainer', priceLabel: '$3,420 per month' },
  { slug: 'legitscript-buildout' },
];

export const ALA_CARTE = ALA_CARTE_ITEMS.map((item) => {
  const service = PARTNER_SERVICES.find((s) => s.slug === item.slug);
  if (!service) return null;
  return {
    slug: service.slug,
    name: service.name,
    price: item.priceLabel || service.price,
    to: `/services/${service.slug}`,
  };
}).filter(Boolean);

export const PRICING_NOTE =
  'Ad spend is paid directly to the ad platforms and is separate from the retainer.';

export const MARKETING_FAQ = [
  {
    question: 'Do I have to run on MedRevolve\u2019s platform?',
    answer:
      'No. We are platform-agnostic and market what you already run. Running on our stack simply removes the handoffs between ads, checkout and fulfillment.',
  },
  {
    question: 'Can you advertise prescription and compounded offers?',
    answer:
      'We advertise only offers that are legally marketable and within each platform\u2019s health policy. No one can guarantee ad approval, and we do not promise it.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'A setup fee plus a monthly retainer, plus ad spend paid directly to the platforms. No hourly billing inside the retainer without written approval.',
  },
  {
    question: 'Do you guarantee results?',
    answer:
      'No. We report the numbers honestly every week, and we will tell you when a channel is not working.',
  },
  {
    question: 'Can you build the website and landing pages too?',
    answer: 'Yes, on your domain, and you own the site, the content and the data.',
  },
  {
    question: 'How fast can this start?',
    answer:
      'Audit inside the first week, creative and campaigns inside the first month, depending on how fast approvals and accounts move.',
  },
];

export const COMPLIANCE_LINE =
  'Marketing and advertising services. We do not guarantee processor, platform or ad-account approval. Cash-pay only, no insurance claims. Results vary by offer, market and spend.';