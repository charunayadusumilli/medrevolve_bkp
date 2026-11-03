/**
 * Creator / media-partner copy for each service kit at /media-kit/<slug>.
 * Keyed by the service slug in the catalog.
 */
export const MEDIA_KITS = {
  'readiness-audit': {
    promise: 'We read your site before a processor does, so the fix list is written down.',
    hooks: [
      'Card processing got declined? It is almost never the bank. It is the site.',
      'Three things on your checkout page get you declined. We check all three for $500.',
      'You do not need a new website. You need a written list of what to fix.',
    ],
    captions: {
      short:
        'Before you apply for card processing, get your site read by someone who knows what review teams look for. Fixed price, written report. link in bio',
      long:
        'Most declined applications are not about revenue or credit. They are about the site: missing policy pages, an unclear refund term, a checkout that looks incomplete. The $500 readiness audit reviews your checkout and pages and hands back a written remediation list you can act on before you apply. It does not guarantee approval by anyone, and it is not supposed to. It gives you the list. link in bio',
    },
    hashtags: ['#telehealthops', '#merchantaccount', '#payments', '#ecommerceops', '#medrevolve'],
    talkingPoints: [
      'For operators who are about to apply for processing.',
      'For anyone declined once and unsure why.',
      'For founders who would rather fix a list than guess.',
    ],
  },
  'custom-development': {
    promise: 'One developer, fixed 4-hour blocks, no retainer required.',
    hooks: [
      'You have one thing to build and no developer. That is a 4-hour block, not a project.',
      'No retainer, no lock-in. You buy hours, we ship the change.',
      'The checkout change you keep postponing is a $380 afternoon.',
    ],
    captions: {
      short:
        'Fixed 4-hour development blocks at $95 an hour. Buy one block, ship one change, no retainer. link in bio',
      long:
        'Custom development without the agency minimums. You buy 4-hour blocks at $380 and we work on the storefront, the integrations or the internal tool you actually need. Invoiced monthly, no retainer required, and the same team that builds the platform. If the work needs a bigger scope we say so up front and quote it. link in bio',
    },
    hashtags: ['#buildinpublic', '#telehealthtech', '#webdevelopment', '#foundertools', '#medrevolve'],
    talkingPoints: [
      'For operators with one specific build task.',
      'For teams with no developer on staff.',
      'For anyone who needs a change shipped this week.',
    ],
  },
  'development-retainer': {
    promise: 'A standing development team for 40 hours a month.',
    hooks: [
      'Forty hours of development a month, priority queue, no hiring.',
      'You are paying an agency for discovery calls. We just build.',
      'A retainer that actually ships: 40 hours, monthly report, 10% off hourly.',
    ],
    captions: {
      short:
        '40 development hours a month at $3,420, priority queue and a monthly report. Your dev team without the hiring. link in bio',
      long:
        'If you are shipping every week, hourly blocks stop making sense. The retainer gives you 40 hours a month at $3,420 with 10% off the hourly rate, priority in the queue and a monthly work report so you can see exactly where the time went. Same team that builds the platform, pointed at your roadmap. link in bio',
    },
    hashtags: ['#devteam', '#telehealthinfrastructure', '#startuptools', '#productops', '#medrevolve'],
    talkingPoints: [
      'For operators shipping continuously.',
      'For teams that need capacity more than headcount.',
      'For founders who want a monthly report, not a status call.',
    ],
  },
  'marketing-engine': {
    promise: 'We run acquisition: channels built, flows shipped, results reported.',
    hooks: [
      'A storefront with no traffic is a $4,000 mistake. Here is the fix.',
      'Setup, channels, lifecycle flows, weekly market scan. One monthly fee.',
      'You do not need another course on ads. You need someone running them.',
    ],
    captions: {
      short:
        'Channel build, lifecycle flows, weekly market scan and monthly reporting. $1,500 setup, then $2,500 a month. link in bio',
      long:
        'The marketing engine is for operators who already have a working storefront and no repeatable demand. Setup covers the channel build and the lifecycle email flows. Then every month we run campaigns, scan the market and report what moved. Same team that builds the platform, so nothing gets lost between the ad and the checkout. link in bio',
    },
    hashtags: ['#telehealthmarketing', '#lifecyclemarketing', '#growthops', '#emailmarketing', '#medrevolve'],
    talkingPoints: [
      'For operators with a live storefront and no traffic.',
      'For brands already spending on ads without attribution.',
      'For teams that want execution, not a strategy deck.',
    ],
  },
  'legitscript-buildout': {
    promise: 'A separate compliant merchant account and the application work to get there.',
    hooks: [
      'Selling a regulated category? One merchant account will not cover it.',
      'LegitScript is a paperwork problem, not a mystery. We do the paperwork.',
      'From $2,500: separate merchant account, pharmacy tie-ins, compliance registration.',
    ],
    captions: {
      short:
        'Regulated category, separate merchant account, compliance registration and application support. From $2,500, quoted per client. link in bio',
      long:
        'If you sell a regulated telehealth category, your processing has to be set up as one. The LegitScript buildout covers the separate merchant account, the pharmacy tie-ins reviewers ask for, the compliance registration and the application support that follows. It starts at a $2,500 deposit and gets quoted per client, because the scope depends on the category. link in bio',
    },
    hashtags: ['#legitscript', '#compliantpayments', '#telehealthcompliance', '#merchantaccount', '#medrevolve'],
    talkingPoints: [
      'For operators in regulated telehealth categories.',
      'For brands declined by a mainstream processor.',
      'For teams that need the compliance file, not just the account.',
    ],
  },
  'pharmacy-integration': {
    promise: 'Connected supply, so orders route themselves and catalogs stay in sync.',
    hooks: [
      'Your pharmacy integration should not need a person in the middle.',
      'Orders that route themselves and a catalog that stays in sync. That is the whole point.',
      'One connection, $1,000, then $100 a month. No manual order sheets.',
    ],
    captions: {
      short:
        'Pharmacy connectivity, catalog sync and order routing for $1,000 setup and $100 a month. link in bio',
      long:
        'Manual order sheets do not scale and they break compliance trails. Pharmacy integration connects your storefront to fulfilment so orders route automatically, catalogs and pricing stay in sync and status flows back to your order. Setup is $1,000 and it runs $100 a month to keep the connection maintained. link in bio',
    },
    hashtags: ['#pharmacytech', '#telehealthops', '#orderfulfillment', '#supplychain', '#medrevolve'],
    talkingPoints: [
      'For operators with a product line that needs pharmacy fulfilment.',
      'For teams still sending order sheets by email.',
      'For brands whose catalog drift causes oversells.',
    ],
  },
  'llc-formation': {
    promise: 'The entity, formed, and the platform stood up under your brand.',
    hooks: [
      'You cannot take payments through a business that legally does not exist yet.',
      'Entity, platform, brand, accounts. One setup, $1,500.',
      'The boring first step that unlocks everything else.',
    ],
    captions: {
      short:
        'Entity formation plus platform setup under your own brand for $1,500. One step, then you are trading. link in bio',
      long:
        'Before processing, before marketing, before any of it, there has to be an entity and a platform with your name on it. LLC formation and setup handles the formation filing, stands the platform up under your brand, and configures the accounts, access and domain so you are not the bottleneck later. $1,500 one time. link in bio',
    },
    hashtags: ['#llcformation', '#bizsetup', '#telehealthfounder', '#entrepreneur', '#medrevolve'],
    talkingPoints: [
      'For founders who have not formed the entity yet.',
      'For operators starting from zero.',
      'For anyone who wants the platform under their own brand.',
    ],
  },
  'payment-integration': {
    promise: 'Live card processing on your own checkout, configured and tested.',
    hooks: [
      'Payments are not a plugin. They are the revenue rails.',
      'Configured, tested and live in seven days, for $1,000 plus $100 a month.',
      'Stop taking manual invoices. Get the checkout working.',
    ],
    captions: {
      short:
        'Card processing configured and tested on your own checkout. $1,000 setup, then $100 a month. link in bio',
      long:
        'Payment integration is the difference between a brochure site and a business. We configure the merchant account, set up the payment rails and routing, run test transactions and stay on through go-live. $1,000 setup, $100 a month to keep it maintained. No card data ever touches our pages: checkout stays hosted. link in bio',
    },
    hashtags: ['#payments', '#stripe', '#checkoutoptimization', '#telehealthbiz', '#medrevolve'],
    talkingPoints: [
      'For operators with a formed entity and a site that needs live processing.',
      'For brands still invoicing manually.',
      'For teams whose checkout fails under load.',
    ],
  },
  'product-integration': {
    promise: 'Your catalog built and imported, ready to sell on day one.',
    hooks: [
      'A spreadsheet is not a catalog. Here is the difference.',
      'Catalog, pricing tiers, availability rules. $750, five days.',
      'Product data is the most skipped step in a launch.',
    ],
    captions: {
      short:
        'Catalog structure, product import, pricing tiers and availability rules for $750, live in five business days. link in bio',
      long:
        'Everyone budgets for the website and forgets the product data. Product integration builds the catalog structure, imports your products, and sets the pricing tiers and availability rules so the storefront behaves properly on day one. $750 one time, live in about five business days. link in bio',
    },
    hashtags: ['#productdata', '#catalogmanagement', '#ecommercesetup', '#telehealthbiz', '#medrevolve'],
    talkingPoints: [
      'For operators holding a catalog spreadsheet.',
      'For brands with no structured product data.',
      'For launches that cannot afford oversells.',
    ],
  },
  'marketing-integration': {
    promise: 'Channels, tracking and lifecycle flows wired into your stack.',
    hooks: [
      'If you cannot attribute a sale, you are guessing at the budget.',
      'Channels, tracking, lifecycle flows. $750 and $150 a month.',
      'Your marketing tools do not talk to your platform. That is the problem.',
    ],
    captions: {
      short:
        'Channels, tracking and lifecycle flows wired into your platform. $750 setup, then $150 a month. link in bio',
      long:
        'Most operators have the tools and none of the wiring. Marketing integration connects the channels, sets up tracking and attribution so a sale can be traced back, and builds the lifecycle flows that catch leads and repeat buyers. $750 setup, $150 a month. link in bio',
    },
    hashtags: ['#attribution', '#marketingops', '#lifecyclemarketing', '#analytics', '#medrevolve'],
    talkingPoints: [
      'For operators who already market.',
      'For brands that cannot attribute revenue.',
      'For teams with tools that never got connected.',
    ],
  },
  'full-platform-bundle': {
    promise: 'Every module in one engagement, on one monthly fee.',
    hooks: [
      'Six vendors or one. The bundle is the shortcut.',
      'Everything on the platform, one onboarding, $4,000 plus $250 a month.',
      'Launching from zero? Do not assemble the stack yourself.',
    ],
    captions: {
      short:
        'Entity, commerce, payments, pharmacy, marketing and catalog in one engagement. $4,000 setup, then $250 a month. link in bio',
      long:
        'The full platform bundle is for operators launching from zero who would rather have one vendor than six. Every platform module is included in one onboarding, with a single point of contact and one monthly fee instead of module-by-module billing. $4,000 setup, $250 a month. link in bio',
    },
    hashtags: ['#telehealthplatform', '#buildonline', '#founderjourney', '#infrastructure', '#medrevolve'],
    talkingPoints: [
      'For operators launching from zero.',
      'For teams that want one vendor and one fee.',
      'For founders who value speed over assembling parts.',
    ],
  },
};

export function getMediaKit(slug) {
  return MEDIA_KITS[slug] || null;
}