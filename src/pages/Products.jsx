import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Heart, Scale, Leaf, Lock, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// MR Branded — Hims/Ro/UpScript style category tiles
const categories = [
  {
    id: 'weight',
    name: 'Weight Loss',
    description: 'GLP-1 & dual-action programs',
    // Clean studio vial/pen shot on white — weight loss injectable
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=90',
    bg: 'bg-[#F0EDE8]',
    available: true,
    accent: '#2D3A2D',
  },
  {
    id: 'longevity',
    name: 'Longevity',
    description: 'Peptides & cellular health',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=90',
    bg: 'bg-[#EDF0EE]',
    available: true,
    accent: '#3D5636',
  },
  {
    id: 'hormone',
    name: 'Hormones',
    description: 'Balance & optimization',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=90',
    bg: 'bg-[#EEEAF0]',
    available: true,
    accent: '#3D3656',
  },
  {
    id: 'mens',
    name: "Men's Health",
    description: 'Performance & vitality',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=90',
    bg: 'bg-[#E8EDF0]',
    available: true,
    accent: '#1A3A5C',
  },
  {
    id: 'womens',
    name: "Women's Health",
    description: 'Wellness from within',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=90',
    bg: 'bg-[#F0EBF0]',
    available: true,
    accent: '#5C1A4A',
  },
  {
    id: 'hair',
    name: 'Hair & Skin',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    bg: 'bg-[#F0EEEA]',
    available: false,
    accent: '#5C4A1A',
  },
  {
    id: 'sexual',
    name: 'Sexual Health',
    description: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
    bg: 'bg-[#EEF0EA]',
    available: false,
    accent: '#2D4A1A',
  }
];

// MedRevolve Rx Products — Hims/Ro/UpScript/Fehr-inspired branded product catalog
// Each product uses studio pharmaceutical imagery: clean vials, pens, injectables, tablets on minimal backgrounds
const allProducts = [
  // ─── WEIGHT LOSS ───────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Semaglutide',
    category: 'weight',
    subtitle: 'GLP-1 Weekly Injection',
    form: 'Injectable Vial',
    promise: 'Lose up to 15% body weight',
    lifestyle: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=90',
    productBg: 'bg-[#F5F2EE]',
    tag: 'Most Popular',
    tagColor: 'bg-[#2D3A2D]',
    price: 299,
    customers: '12,400+',
    rx: true,
    benefits: ['Clinically proven GLP-1 agonist', 'Once weekly subcutaneous injection', 'Curbs cravings & appetite naturally', 'Compounded at licensed pharmacy'],
    description: 'Our compounded Semaglutide program mirrors the active ingredient in Ozempic® & Wegovy®. Physician-prescribed, pharmacy-compounded, and shipped discreetly to your door.',
  },
  {
    id: 2,
    name: 'Tirzepatide',
    category: 'weight',
    subtitle: 'Dual GIP/GLP-1 Injection',
    form: 'Injectable Vial',
    promise: 'Up to 22% weight loss — strongest available',
    lifestyle: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=90',
    productBg: 'bg-[#F0EDF5]',
    tag: 'Strongest Results',
    tagColor: 'bg-[#4C3D6B]',
    price: 399,
    customers: '8,200+',
    rx: true,
    benefits: ['Dual GIP + GLP-1 mechanism', 'Mirrors Mounjaro® & Zepbound® ingredient', 'Best-in-class clinical outcomes', 'Once weekly injection'],
    description: 'The most powerful weight loss medication available. Tirzepatide activates both GIP and GLP-1 receptors — the same mechanism as Mounjaro® — compounded at our partner pharmacy.',
  },
  {
    id: 3,
    name: 'Semaglutide Oral Drops',
    category: 'weight',
    subtitle: 'Sublingual — No Needles',
    form: 'Oral Drops',
    promise: 'All the results, zero injections',
    lifestyle: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=800&q=90',
    productBg: 'bg-[#EEF5F0]',
    tag: 'Needle-Free',
    tagColor: 'bg-[#2D6B4C]',
    price: 249,
    customers: '6,800+',
    rx: true,
    benefits: ['Sublingual daily drops', 'No needles or syringes', 'Travel-friendly dropper bottle', 'Gentle GLP-1 effect'],
    description: 'Oral sublingual Semaglutide for patients who prefer to avoid injections. Same proven GLP-1 mechanism in a convenient daily drop format.',
  },
  {
    id: 4,
    name: 'Tirzepatide + B12 Blend',
    category: 'weight',
    subtitle: 'Enhanced Energy Formula',
    form: 'Injectable Vial',
    promise: 'Lose weight without the fatigue',
    lifestyle: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=90',
    productBg: 'bg-[#F5EEE8]',
    tag: 'Energy Boost',
    tagColor: 'bg-[#B45309]',
    price: 449,
    customers: '3,100+',
    rx: true,
    benefits: ['Tirzepatide + Vitamin B12 blend', 'Combats GLP-1 fatigue side effects', 'Compounded at licensed Rx', 'Weekly injection'],
    description: 'Our signature Tirzepatide + B12 compound adds energy support to the world\'s strongest weight loss injection — perfect for patients experiencing fatigue on standard protocols.',
  },
  {
    id: 5,
    name: 'MIC + B12 Lipotropic',
    category: 'weight',
    subtitle: 'Fat-Burning Injection',
    form: 'Injectable Vial',
    promise: 'Accelerate fat loss & metabolism',
    lifestyle: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=90',
    productBg: 'bg-[#EEF2F5]',
    tag: 'Metabolism',
    tagColor: 'bg-[#1A5CA0]',
    price: 129,
    customers: '9,400+',
    rx: true,
    benefits: ['Methionine, Inositol & Choline (MIC)', 'B12 energy support', 'Enhances fat metabolism', 'Great as GLP-1 add-on'],
    description: 'MIC Lipotropic injections combine Methionine, Inositol, Choline, and B12 to enhance your body\'s ability to break down and remove fat — ideal alongside any GLP-1 program.',
  },

  // ─── LONGEVITY ──────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Sermorelin',
    category: 'longevity',
    subtitle: 'Growth Hormone Peptide',
    form: 'Injectable Vial',
    promise: 'Deep sleep, rapid recovery, youthful energy',
    lifestyle: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&q=90',
    productBg: 'bg-[#F5EEEE]',
    tag: 'Anti-Aging',
    tagColor: 'bg-[#9B1A1A]',
    price: 199,
    customers: '7,300+',
    rx: true,
    benefits: ['Stimulates natural GH release', 'Deep restorative sleep', 'Faster muscle recovery', 'Subcutaneous nightly injection'],
    description: 'Sermorelin is a growth hormone-releasing peptide that stimulates your pituitary to produce more HGH naturally — without synthetic HGH. Ideal for patients seeking anti-aging and recovery benefits.',
  },
  {
    id: 7,
    name: 'BPC-157',
    category: 'longevity',
    subtitle: 'Healing & Recovery Peptide',
    form: 'Injectable Vial',
    promise: 'Heal faster. Train harder. Recover smarter.',
    lifestyle: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=90',
    productBg: 'bg-[#EEEEF5]',
    tag: 'Recovery',
    tagColor: 'bg-[#3D3680]',
    price: 179,
    customers: '5,200+',
    rx: true,
    benefits: ['Accelerated tissue & tendon healing', 'Anti-inflammatory peptide', 'Gut lining repair', 'Neuroprotective effects'],
    description: 'BPC-157 (Body Protection Compound 157) is one of the most researched healing peptides. Originally derived from gastric fluid, it promotes healing of tendons, ligaments, muscle, and gut tissue.',
  },
  {
    id: 8,
    name: 'NAD+ Injection',
    category: 'longevity',
    subtitle: 'Cellular Energy & Longevity',
    form: 'Injectable Vial',
    promise: 'Restore cellular energy from the inside out',
    lifestyle: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=90',
    productBg: 'bg-[#EEF5EE]',
    tag: 'Brain & Body',
    tagColor: 'bg-[#1A6B2D]',
    price: 179,
    customers: '5,400+',
    rx: true,
    benefits: ['Boosts NAD+ at cellular level', 'Cognitive clarity & focus', 'Enhanced stamina & endurance', 'Supports DNA repair'],
    description: 'NAD+ (Nicotinamide Adenine Dinucleotide) is essential for cellular energy production and DNA repair. Injectables deliver NAD+ directly into the bloodstream for maximum bioavailability.',
  },
  {
    id: 9,
    name: 'Glutathione IV Push',
    category: 'longevity',
    subtitle: 'Master Antioxidant',
    form: 'Injectable Vial',
    promise: 'Glow, detox, and protect from the inside',
    lifestyle: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=90',
    productBg: 'bg-[#F5EEF3]',
    tag: 'Skin & Immunity',
    tagColor: 'bg-[#8B1A6B]',
    price: 149,
    customers: '9,600+',
    rx: true,
    benefits: ['Radiant skin brightening', 'Liver detox & protection', 'Powerful immune support', 'Antioxidant cellular defense'],
    description: 'Glutathione is the body\'s master antioxidant. Our injectable Glutathione supports liver detox, immune function, and is known for its skin-brightening and anti-aging properties.',
  },
  {
    id: 10,
    name: 'B12 + MIC Weekly Shot',
    category: 'longevity',
    subtitle: 'Energy & Mood Essential',
    form: 'Injectable Vial',
    promise: 'Feel energized and sharp within days',
    lifestyle: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=800&q=90',
    productBg: 'bg-[#EEF5F2]',
    tag: 'Best Value',
    tagColor: 'bg-[#1A6B4A]',
    price: 79,
    customers: '15,200+',
    rx: true,
    benefits: ['Vitamin B12 methylcobalamin', 'Instant natural energy', 'Better mood & cognition', 'Supports red blood cell production'],
    description: 'Our most accessible injectable — weekly Methylcobalamin B12 shots deliver fast, noticeable energy and mood improvements. Often paired with GLP-1 programs to counter fatigue.',
  },

  // ─── HORMONES ───────────────────────────────────────────────────────────────
  {
    id: 11,
    name: 'Testosterone Cypionate',
    category: 'hormone',
    subtitle: 'TRT — Men\'s Optimization',
    form: 'Injectable Vial',
    promise: 'Reclaim your energy, strength & drive',
    lifestyle: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=90',
    productBg: 'bg-[#EEF0F5]',
    tag: 'For Men',
    tagColor: 'bg-[#1A3A6B]',
    price: 199,
    customers: '11,100+',
    rx: true,
    benefits: ['Physician-managed TRT protocol', 'Lean muscle & strength gains', 'Improved libido & mood', 'Weekly self-injection kit included'],
    description: 'Our Testosterone Replacement Therapy (TRT) program includes physician consultation, lab work, and ongoing management. Weekly Testosterone Cypionate injections to restore optimal T levels.',
  },
  {
    id: 12,
    name: 'Estradiol + Progesterone',
    category: 'hormone',
    subtitle: 'Women\'s HRT — Balance & Relief',
    form: 'Cream / Tablet',
    promise: 'Feel like yourself again',
    lifestyle: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=90',
    productBg: 'bg-[#F5EEF5]',
    tag: 'For Women',
    tagColor: 'bg-[#6B1A6B]',
    price: 179,
    customers: '8,900+',
    rx: true,
    benefits: ['Bioidentical hormone formula', 'Hot flash & night sweat relief', 'Mood stabilization', 'Topical cream or oral tablet'],
    description: 'Compounded bioidentical Estradiol and Progesterone for women navigating perimenopause and menopause. Customized to your labs and symptom profile.',
  },
  {
    id: 13,
    name: 'Thyroid T3/T4 Compound',
    category: 'hormone',
    subtitle: 'Metabolic Thyroid Support',
    form: 'Oral Capsule',
    promise: 'Steady energy, clear mind, healthy weight',
    lifestyle: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=90',
    productBg: 'bg-[#EEF5F5]',
    tag: 'Metabolism',
    tagColor: 'bg-[#1A6B6B]',
    price: 149,
    customers: '6,200+',
    rx: true,
    benefits: ['Compounded T3/T4 blend', 'Tailored to your thyroid labs', 'Steady all-day energy', 'Weight & metabolism support'],
    description: 'Our compounded T3/T4 thyroid formula is customized to your specific thyroid panel. Where standard Synthroid fails, our compounded blend fills the gap.',
  },
  {
    id: 14,
    name: 'DHEA + Pregnenolone',
    category: 'hormone',
    subtitle: 'Adrenal & Hormonal Foundation',
    form: 'Oral Capsule',
    promise: 'Restore your hormonal baseline',
    lifestyle: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=800&q=90',
    productBg: 'bg-[#F5F2EE]',
    tag: 'Foundation',
    tagColor: 'bg-[#6B4A1A]',
    price: 99,
    customers: '4,800+',
    rx: true,
    benefits: ['DHEA adrenal precursor', 'Pregnenolone neurosteroid', 'Mood & libido support', 'Daily oral capsule'],
    description: 'DHEA and Pregnenolone are foundational adrenal hormones that decline sharply with age. Restoring them provides a hormonal base for energy, cognition, and mood.',
  },

  // ─── MEN'S HEALTH ───────────────────────────────────────────────────────────
  {
    id: 15,
    name: 'Sildenafil (ED)',
    category: 'mens',
    subtitle: 'Erectile Dysfunction Rx',
    form: 'Oral Tablet',
    promise: 'Confidence when it counts',
    lifestyle: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=90',
    productBg: 'bg-[#EEF0F5]',
    tag: 'ED Treatment',
    tagColor: 'bg-[#1A3A6B]',
    price: 89,
    customers: '14,600+',
    rx: true,
    benefits: ['Generic Viagra® active ingredient', 'Works in 30–60 minutes', 'Discreet shipping always', 'Physician-prescribed'],
    description: 'Compounded Sildenafil, the same active ingredient as Viagra®, prescribed by our licensed physicians and delivered discreetly. Available in tablets and custom dosage blends.',
  },
  {
    id: 16,
    name: 'Tadalafil Daily (ED)',
    category: 'mens',
    subtitle: 'Daily Cialis® Alternative',
    form: 'Oral Tablet',
    promise: 'Always ready — no timing required',
    lifestyle: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=90',
    productBg: 'bg-[#F5F0EE]',
    tag: 'Daily Rx',
    tagColor: 'bg-[#6B2D1A]',
    price: 79,
    customers: '11,200+',
    rx: true,
    benefits: ['Generic Cialis® active ingredient', 'Take once daily, always ready', 'Also treats BPH symptoms', '36-hour window'],
    description: 'Daily Tadalafil maintains a steady-state concentration in your system, so you don\'t have to plan around intimacy. The discreet, long-acting alternative to Cialis®.',
  },
  {
    id: 17,
    name: 'Finasteride + Minoxidil',
    category: 'mens',
    subtitle: 'Hair Loss Prevention',
    form: 'Oral Tablet + Topical',
    promise: 'Stop hair loss before it stops you',
    lifestyle: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=90',
    productBg: 'bg-[#EEF5EE]',
    tag: 'Hair Rx',
    tagColor: 'bg-[#1A6B3A]',
    price: 49,
    customers: '18,400+',
    rx: true,
    benefits: ['Finasteride blocks DHT hair loss', 'Minoxidil stimulates regrowth', 'Compounded topical combo', 'Proven 2-drug protocol'],
    description: 'Our compounded Finasteride + Minoxidil topical combines the two most proven hair loss treatments in a single daily application — no pills, no mess.',
  },
  {
    id: 18,
    name: 'Testosterone + Semaglutide Stack',
    category: 'mens',
    subtitle: 'Performance Body Recomposition',
    form: 'Injectable Vial',
    promise: 'Lose fat. Build muscle. At the same time.',
    lifestyle: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=90',
    productBg: 'bg-[#EEF0F5]',
    tag: 'Power Stack',
    tagColor: 'bg-[#1A1A6B]',
    price: 449,
    customers: '3,600+',
    rx: true,
    benefits: ['TRT + GLP-1 combination protocol', 'Fat loss with muscle preservation', 'Improved body composition', 'Full physician management'],
    description: 'The ultimate men\'s body recomposition stack — Testosterone Replacement Therapy combined with Semaglutide GLP-1. Lose fat while building and preserving lean muscle mass.',
  },

  // ─── WOMEN'S HEALTH ─────────────────────────────────────────────────────────
  {
    id: 19,
    name: 'Semaglutide for Women',
    category: 'womens',
    subtitle: 'Female GLP-1 Weight Program',
    form: 'Injectable Vial',
    promise: 'The most effective weight loss — designed for her',
    lifestyle: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=90',
    productBg: 'bg-[#F5EEF3]',
    tag: 'Most Popular',
    tagColor: 'bg-[#6B1A4A]',
    price: 299,
    customers: '9,800+',
    rx: true,
    benefits: ['GLP-1 weekly injection', 'Balanced with female hormone profile', 'Physician-managed program', 'Includes nutrition coaching'],
    description: 'Our female-focused Semaglutide protocol accounts for hormonal cycles and contraindication screening. Delivered with a full care team, not just a vial.',
  },
  {
    id: 20,
    name: 'Estriol Vaginal Cream',
    category: 'womens',
    subtitle: 'Vaginal Atrophy & Dryness',
    form: 'Topical Cream',
    promise: 'Restore comfort and confidence',
    lifestyle: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=90',
    productBg: 'bg-[#F5EEF5]',
    tag: 'Feminine Health',
    tagColor: 'bg-[#8B1A6B]',
    price: 99,
    customers: '5,200+',
    rx: true,
    benefits: ['Compounded Estriol 0.5mg cream', 'Restores vaginal tissue', 'Relieves dryness & discomfort', 'Gentle localized application'],
    description: 'Compounded Estriol vaginal cream provides localized estrogen support to relieve vaginal dryness, atrophy, and discomfort — common in peri/post-menopause — with minimal systemic absorption.',
  },
  {
    id: 21,
    name: 'Oxytocin Nasal Spray',
    category: 'womens',
    subtitle: 'Mood, Bonding & Intimacy',
    form: 'Nasal Spray',
    promise: 'Feel more connected, present & calm',
    lifestyle: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=90',
    productBg: 'bg-[#F5F0F5]',
    tag: 'Wellness',
    tagColor: 'bg-[#6B3A8B]',
    price: 129,
    customers: '3,400+',
    rx: true,
    benefits: ['Intranasal oxytocin delivery', 'Mood & emotional wellbeing', 'Supports intimacy & bonding', 'Anxiety & stress relief'],
    description: 'Compounded intranasal Oxytocin — the "bonding hormone" — delivered via nasal spray for fast absorption. Supports emotional regulation, intimacy, and social connection.',
  },
  {
    id: 22,
    name: 'Spironolactone (Acne/Hair)',
    category: 'womens',
    subtitle: 'Hormonal Acne & Hair Thinning',
    form: 'Oral Tablet',
    promise: 'Clear skin. Fuller hair. From the source.',
    lifestyle: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=90',
    productBg: 'bg-[#F5EEF0]',
    tag: 'Skin + Hair',
    tagColor: 'bg-[#8B1A3A]',
    price: 59,
    customers: '7,100+',
    rx: true,
    benefits: ['Anti-androgen mechanism', 'Reduces hormonal acne', 'Slows female pattern hair loss', 'Daily oral tablet'],
    description: 'Spironolactone is the go-to prescription for women with androgen-driven acne and hair thinning. It blocks the hormonal signals at the root of both conditions.',
  },
];

// Map URL param values to internal category IDs
const categoryParamMap = {
  'weight_loss': 'weight',
  'weight': 'weight',
  'longevity': 'longevity',
  'hormone': 'hormone',
  'mens_health': 'mens',
  'mens': 'mens',
  'womens_health': 'womens',
  'womens': 'womens',
  'hair_loss': 'hair',
  'peptides': 'longevity',
};

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawCategory = urlParams.get('category') || null;
  const initialCategory = rawCategory ? (categoryParamMap[rawCategory] || rawCategory) : null;
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4 tracking-tight">
              Explore Our Products
            </h1>
            <p className="text-lg text-[#5A6B5A]">
              Wellness that fits your life. Choose your path to feeling your best.
            </p>
          </motion.div>

          {/* Category Grid - FrontCare Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* First Row - 4 categories */}
            {categories.slice(0, 4).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard 
                  category={category} 
                  isActive={activeCategory === category.id}
                  onClick={() => category.available && setActiveCategory(category.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Second Row - 3 categories + Title */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
            <motion.div 
              className="hidden md:flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Empty space or could add decorative element */}
            </motion.div>
            {categories.slice(4).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <CategoryCard 
                  category={category} 
                  isActive={activeCategory === category.id}
                  onClick={() => category.available && setActiveCategory(category.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.section
            key={activeCategory}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="py-16 px-6 lg:px-8 bg-white"
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D]">
                    {categories.find(c => c.id === activeCategory)?.name} Products
                  </h2>
                  <p className="text-[#5A6B5A] mt-2">
                    Personalized treatments backed by science
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveCategory(null)}
                  className="text-[#5A6B5A] hover:text-[#2D3A2D]"
                >
                  View All Categories
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* No Category Selected State */}
      {!activeCategory && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-[#D4E5D7] flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-10 h-10 text-[#4A6741]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#2D3A2D] mb-4">
              Choose Your Wellness Journey
            </h2>
            <p className="text-[#5A6B5A] mb-6">
              Select a category above to explore treatments designed for your specific goals. 
              Every journey is unique—let's find yours.
            </p>
            <div className="mb-8">
              <Link to={createPageUrl('CustomerIntake')}>
                <Button 
                  size="lg"
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8"
                >
                  Get Started - Complete Your Intake
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.filter(c => c.available).map(category => (
                <Button
                  key={category.id}
                  variant="outline"
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full border-[#4A6741]/30 text-[#4A6741] hover:bg-[#4A6741] hover:text-white"
                >
                  {category.name}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Trust Section */}
      <section className="py-16 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-light text-[#4A6741] mb-2">50,000+</div>
              <p className="text-[#5A6B5A]">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-light text-[#4A6741] mb-2">Licensed</div>
              <p className="text-[#5A6B5A]">Medical Providers</p>
            </div>
            <div>
              <div className="text-4xl font-light text-[#4A6741] mb-2">24-48 hrs</div>
              <p className="text-[#5A6B5A]">Discreet Delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ category, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all duration-300
        ${isActive ? 'border-[#2D3A2D] shadow-xl scale-[1.01]' : 'border-transparent'}
        ${!category.available ? 'opacity-50 cursor-default' : 'hover:border-[#2D3A2D]/30 hover:shadow-lg'}
        bg-white`}
      whileHover={category.available ? { y: -3 } : {}}
      whileTap={category.available ? { scale: 0.98 } : {}}
    >
      {/* Category image — pharmacy/wellness aesthetic */}
      <div className={`aspect-[4/3] relative overflow-hidden ${category.bg || 'bg-gray-100'}`}>
        <img
          src={category.image}
          alt={category.name}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${
            category.available ? 'group-hover:scale-105' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Coming Soon overlay */}
        {!category.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="bg-white rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-md border border-gray-200">
              <Lock className="w-3.5 h-3.5 text-[#4A6741]" />
              <span className="text-xs font-semibold text-[#2D3A2D]">Coming Soon</span>
            </div>
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-2 right-2">
            <span className="bg-[#2D3A2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Selected</span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-[#2D3A2D] text-sm">{category.name}</h3>
        {category.available && (
          <p className="text-xs text-[#5A6B5A] mt-0.5">{category.description}</p>
        )}
      </div>
    </motion.div>
  );
}

function ProductCard({ product }) {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden group h-full flex flex-col hover:shadow-xl transition-all duration-300 border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Link to={createPageUrl(`ProductDetail?id=${product.id}`)} className="flex-1 flex flex-col">
        {/* Product image — studio / pharmaceutical style */}
        <div className={`relative aspect-[4/3] overflow-hidden ${product.productBg || 'bg-gray-50'}`}>
          <img
            src={product.lifestyle}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
          />
          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Rx badge */}
            {product.rx && (
              <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase backdrop-blur-sm">
                Rx
              </span>
            )}
            {/* Tag pill */}
            {product.tag && (
              <span className={`${product.tagColor} text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow ml-auto`}>
                {product.tag}
              </span>
            )}
          </div>
          {/* Form pill — bottom left */}
          {product.form && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-[#2D3A2D] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/50 shadow-sm">
                {product.form}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col">
          <p className="text-[10px] font-bold text-[#4A6741] uppercase tracking-[0.15em] mb-1">{product.subtitle}</p>
          <h3 className="text-lg font-semibold text-[#1A2A1A] leading-snug mb-2 group-hover:text-[#2D3A2D] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[#5A6B5A] mb-4 leading-relaxed">{product.promise}</p>

          {/* Benefits */}
          <div className="space-y-1.5 mb-4">
            {product.benefits.slice(0, 3).map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#2D3A2D]">
                <div className="w-4 h-4 rounded-full bg-[#D4E5D7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#4A6741] text-[9px] font-bold">✓</span>
                </div>
                {b}
              </div>
            ))}
          </div>

          <div className="flex-1" />
          <p className="text-[11px] text-[#8A9A8A]">{product.customers} patients treated</p>
        </div>
      </Link>

      {/* Price + CTA */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs text-[#8A9A8A] mr-0.5">from</span>
              <span className="text-2xl font-bold text-[#1A2A1A]">${product.price}</span>
              <span className="text-sm text-[#8A9A8A]">/mo</span>
            </div>
            <p className="text-[10px] text-[#4A6741] font-medium">Consult + Rx + Shipping</p>
          </div>
          <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
            <Button
              size="sm"
              className="bg-[#1A2A1A] hover:bg-[#2D3A2D] text-white rounded-full px-5 text-sm font-semibold"
            >
              Learn More
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}