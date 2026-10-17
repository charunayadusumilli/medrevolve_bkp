// Share-ready graphics (1080x1080) served from /public/social. Regenerate with scripts/social/gen.mjs.
// Each entry carries a ready caption and the page a post should link to, per the Platform Walkthrough:
// launch/offer -> demo booking, educational -> section or article, trust/proof -> providers & pharmacy,
// lead-gen -> launch checklist.
export const SITE = 'https://medrevolve.com';

export const SOCIAL_GRAPHICS = [
  {
    id: '01-launch-in-7-days', type: 'Launch / offer', link: '/#walkthrough', linkLabel: 'Book a demo',
    title: 'Your brand. Live in about 7 days.',
    alt: 'Headline "Your brand. Your telehealth business. Live in about 7 days." above a white-label storefront preview for a sample brand, Lumen Aesthetics.',
    caption: 'Your name on the storefront. Licensed providers, a licensed pharmacy and a healthcare-ready checkout behind it. Clinics, med spas and pharmacies can launch their own telehealth brand in about 7 days. Book a 20-minute demo at medrevolve.com.',
  },
  {
    id: '02-seven-day-launch', type: 'Educational', link: '/#walkthrough', linkLabel: 'See the 7-day plan',
    title: 'The 7-day launch, day by day',
    alt: 'Vertical timeline of the seven launch days, from brand and discovery to go live and announce.',
    caption: 'Day 1 brand. Day 2 storefront. Day 3 providers. Day 4 pharmacy. Day 5 payments. Day 6 compliance check. Day 7 go live. Every day shows what you do and what we do. See the full plan at medrevolve.com.',
  },
  {
    id: '03-patient-journey', type: 'Trust / proof', link: '/#care', linkLabel: 'Providers & pharmacy',
    title: 'One journey explains the whole business',
    alt: 'Flow diagram: visitor, intake, provider review, prescription only if appropriate, pharmacy, follow-up and refill.',
    caption: 'Visitor, intake, provider review, prescription only when clinically appropriate, pharmacy, follow-up and refill. You sell under your brand; we connect the regulated pieces. How it works at medrevolve.com.',
  },
  {
    id: '04-five-questions', type: 'Educational', link: '/', linkLabel: 'Get the answers',
    title: 'Five questions every owner asks',
    alt: 'Five questions owners ask before launching telehealth, each with a one-line answer.',
    caption: 'Can I launch fast? Will it look like mine? Who treats my patients? How do orders and money work? Am I compliant? Five questions, answered in one page at medrevolve.com.',
  },
  {
    id: '05-payments', type: 'Educational', link: '/#payments', linkLabel: 'How payments work',
    title: "A merchant account that won't freeze",
    alt: 'Payment flow from checkout to authorization, settlement and payout, with subscriptions, refunds and a backup processor.',
    caption: "Telehealth is high-risk to many processors, and accounts get frozen. Ours come from vendors with a long healthcare track record, with refills, refunds, chargebacks and a backup processor planned in. Every fee is listed before you sign. More at medrevolve.com.",
  },
  {
    id: '06-compliance-service', type: 'Educational', link: '/#compliance', linkLabel: 'Compliance details',
    title: 'Compliance is a service',
    alt: 'Five-step compliance cycle: audit runs, change monitoring, announcements, remediation and record.',
    caption: 'Rules on telehealth, pharmacy, privacy and advertising change often. We run regular audits, track the changes, tell you what to do and fix the templates. Compliance is a service, not a launch checkbox. medrevolve.com',
  },
  {
    id: '07-telehealth-plan', type: 'Launch / offer', link: '/#pricing', linkLabel: 'See what $4,000 includes',
    title: '$4,000, 14 items listed in full',
    alt: 'The $4,000 Telehealth Plan with all 14 included items listed.',
    caption: 'No vague promises. The $4,000 launch includes 14 items, from your custom platform and secure video visits to a dedicated project manager and post-launch help. What is separate is listed too. medrevolve.com',
  },
  {
    id: '08-launch-checklist', type: 'Lead-gen', link: '/#checklist', linkLabel: 'Get the checklist',
    title: 'Have these ready before Day 1',
    alt: 'Checklist of items to prepare before launch day, with a button to get the full checklist.',
    caption: 'Thinking about launching your own telehealth brand? Have these ready before Day 1. Get the full white-label launch checklist free at medrevolve.com.',
  },
];
