import { DTC_PRODUCTS } from '@/data/dtcProducts';

const IMG = 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/';

export const V2_IMAGES = {
  heroMan: IMG + 'c6f410f98_generated_image.png',
  pilates: IMG + '2dc9c550a_generated_image.png',
  jogging: IMG + '1d5d81598_generated_image.png',
  hiker: IMG + 'd86fce808_generated_image.png',
  pen: IMG + '29fef81bd_generated_image.png',
  vial: IMG + '2ab18b125_generated_image.png',
  bottle: IMG + '06dbd3fbb_generated_image.png',
  essentials: IMG + 'f94953106_generated_image.png',
  compounding: IMG + 'c0393f010_generated_image.png',
  ugcUnboxing: IMG + '7cb329900_generated_image.png',
  ugcGym: IMG + 'e062d2871_generated_image.png',
  ugcWalk: IMG + '02d7712b9_generated_image.png',
  hairLoss: IMG + '84c199d32_generated_image.png',
  sexualHealth: IMG + '62629f865_generated_image.png',
};

export const GOALS = [
  { id: 'weight_loss', label: 'Weight loss', blurb: 'GLP-1 programs, provider-guided', from: 399, image: V2_IMAGES.jogging, bg: 'bg-mr-sage', categories: ['weight_loss'] },
  { id: 'mens_health', label: "Men's health", blurb: 'Testosterone & vitality', from: 149, image: V2_IMAGES.heroMan, bg: 'bg-mr-sand', categories: ['mens_health'] },
  { id: 'womens_health', label: "Women's health", blurb: 'Hormone balance & BHRT', from: 199, image: V2_IMAGES.pilates, bg: 'bg-mr-blush', categories: ['womens_health'] },
  { id: 'longevity', label: 'Longevity', blurb: 'NAD+ & research peptides', from: 79, image: V2_IMAGES.hiker, bg: 'bg-mr-sage', categories: ['longevity', 'peptides'] },
  { id: 'hair_loss', label: 'Hair loss', blurb: 'Finasteride, provider-guided', from: 29, image: V2_IMAGES.hairLoss, bg: 'bg-mr-sand', categories: ['hair_loss'] },
  { id: 'sexual_health', label: 'Sexual health', blurb: 'ED treatment, on-demand or daily', from: 32, image: V2_IMAGES.sexualHealth, bg: 'bg-mr-blush', categories: ['sexual_health'] },
];

export const UGC_POSTS = [
  { handle: '@jordanmoves', image: V2_IMAGES.ugcGym, quote: 'Intake took me 5 minutes. Box showed up in 3 days.', tag: "Men's health" },
  { handle: '@wellwithdana', image: V2_IMAGES.ugcUnboxing, quote: 'The unboxing is honestly so clean. Everything I needed was in there.', tag: 'Essentials' },
  { handle: '@morningmiles.kim', image: V2_IMAGES.ugcWalk, quote: 'Messaging my provider is easier than texting my friends.', tag: 'Weight loss' },
  { handle: '@lifts.and.labs', image: V2_IMAGES.heroMan, quote: 'Love that every product page links the actual studies.', tag: 'Longevity' },
  { handle: '@pilates.priya', image: V2_IMAGES.pilates, quote: 'Finally a platform that feels made for women, not just marketed to us.', tag: "Women's health" },
];

export const getGoal = (id) => GOALS.find((g) => g.id === id);

export const productsForGoal = (goal) =>
  DTC_PRODUCTS.filter((p) => goal.categories.includes(p.category) && !p.waitlist);

export const ESSENTIALS = DTC_PRODUCTS.filter((p) => p.category === 'supplies');

export const toCartItem = (p) => ({ id: p.id, name: p.name, price: p.price, type: p.billing, image: p.image });