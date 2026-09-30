import { Sparkles, Microscope, FlaskConical, Bot, Package, Headset, Users, Pill, Leaf } from 'lucide-react';

const IMG = 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/';

export const LANDING_IMAGES = {
  hero: IMG + '3add5c56c_generated_image.png',
  compounding: IMG + 'c0393f010_generated_image.png',
  robotics: IMG + '21b999344_generated_image.png',
  support: IMG + '79383cc70_generated_image.png',
  ugc: IMG + '88ce1fee5_generated_image.png',
  products: IMG + '068bf780b_generated_image.png',
  ai: IMG + '7ef93cbd1_generated_image.png',
};

export const JOURNEYS = [
  {
    key: 'prescription',
    icon: Pill,
    eyebrow: 'Journey 01',
    title: 'Prescription Care',
    tag: 'Rx · Clinician-guided',
    desc: 'GLP-1, hormone and longevity protocols reviewed by US-licensed providers and filled by NABP-verified pharmacies.',
    points: ['Online intake + provider review', 'Pharmacy-compounded medication', 'Ongoing check-ins'],
    link: '/shop?cat=weight_loss',
    cta: 'Start Rx journey',
    image: LANDING_IMAGES.support,
  },
  {
    key: 'ruo',
    icon: FlaskConical,
    eyebrow: 'Journey 02',
    title: 'Research Compounds',
    tag: 'RUO · Lab use only',
    desc: 'Research-grade peptides with published literature, lot documentation and clear Research-Use-Only labeling.',
    points: ['Third-party purity testing', 'Citation-backed product pages', 'Not for human consumption'],
    link: '/shop?cat=peptides',
    cta: 'Explore research',
    image: LANDING_IMAGES.compounding,
  },
  {
    key: 'supplement',
    icon: Leaf,
    eyebrow: 'Journey 03',
    title: 'Wellness & Supplies',
    tag: 'OTC · Ships fast',
    desc: 'Wellness bundles, bacteriostatic water and injection supplies — no prescription needed, delivered in days.',
    points: ['No consultation required', 'Clinical-grade packaging', '2–3 day US shipping'],
    link: '/shop?cat=supplies',
    cta: 'Shop wellness',
    image: LANDING_IMAGES.products,
  },
];

export const FLOW_STEPS = [
  { icon: Sparkles, label: 'AI Personalization', title: 'Your protocol starts with intelligence.', desc: 'Our AI engine turns your intake into a structured profile so providers see exactly what matters — goals, history and contraindications — before they review.', image: LANDING_IMAGES.ai, stat: 'Under 5 min intake' },
  { icon: Microscope, label: 'Research & Science', title: 'Every compound, backed by literature.', desc: 'Product pages link straight to NEJM, PubMed and PMC studies, with 3D molecule viewers and receptor-binding animations that explain the mechanism.', image: LANDING_IMAGES.hero, stat: 'Peer-reviewed citations' },
  { icon: FlaskConical, label: 'Lab & Compounding', title: 'Compounded in sterile cleanrooms.', desc: 'Licensed partner pharmacies prepare each order under USP <797> sterile standards, with lot tracking and third-party potency testing.', image: LANDING_IMAGES.compounding, stat: 'USP <797> standards' },
  { icon: Bot, label: 'AI & Robotics', title: 'Precision fulfillment, zero guesswork.', desc: 'Automated dispensing and AI-verified labeling cut human error, then cold-chain packaging keeps every vial within spec to your door.', image: LANDING_IMAGES.robotics, stat: 'Automated QA checks' },
  { icon: Package, label: 'Products', title: 'Clinical-grade, discreetly delivered.', desc: 'Pens, vials and supplies arrive in minimalist, temperature-safe packaging with everything you need to begin.', image: LANDING_IMAGES.products, stat: '2–3 day shipping' },
  { icon: Headset, label: 'Customer Care', title: 'Real humans, on call.', desc: 'Care coordinators and provider messaging keep you supported — by chat, phone or video — whenever questions come up.', image: LANDING_IMAGES.support, stat: 'Replies within hours' },
  { icon: Users, label: 'UGC Community', title: 'A community that shares the journey.', desc: 'Members post routines, unboxings and platform reviews — honest content about the experience, never medical claims.', image: LANDING_IMAGES.ugc, stat: 'Verified members' },
];